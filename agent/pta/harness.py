"""Arnés de evaluación. Convierte la suite de documento en test.

Dos capas, deliberadamente asimétricas:

  DETERMINISTA (bloqueante). Sin modelo, reproducible bit a bit. Decide si el
  corpus puede publicarse. Un solo fallo aquí bloquea la publicación.

  JUEZ (informativo). Un modelo puntúa la corrección sustantiva contra la
  respuesta esperada en prosa. Nunca bloquea por sí solo: un juez que decide
  publicaciones es un juez que hay que auditar, y todavía no está calibrado.

El modo «replay» ejecuta la capa determinista sobre respuestas grabadas, sin
credenciales. Sirve para probar el propio arnés y para reejecutar la suite
tras un cambio de guardia sin volver a pagar tokens.
"""
from __future__ import annotations

import json
import re
from dataclasses import asdict, dataclass, field
from pathlib import Path

from . import guard
from .evalsuite import Caso

CHECKS = ("guardia", "citas", "estado", "debe", "prohibido")


@dataclass
class Check:
    nombre: str
    ok: bool
    detalle: str = ""


@dataclass
class Veredicto:
    caso_id: str
    bloque: str
    estado: str  # PASA | FALLA | BLOQUEADO
    checks: list[Check] = field(default_factory=list)
    respuesta: str = ""
    juez: dict | None = None
    uso: dict = field(default_factory=dict)

    @property
    def fallos(self) -> list[Check]:
        return [c for c in self.checks if not c.ok]


def evaluar_determinista(caso: Caso, respuesta: str, jurisdiccion: str = "ES") -> list[Check]:
    checks: list[Check] = []

    rev = guard.revisar(respuesta, jurisdiccion)
    checks.append(Check(
        "guardia", rev.apto,
        "" if rev.apto else "; ".join(f"{h.codigo}" for h in rev.errores())))

    emitidas = {(r, a) for r, a, _ in rev.citas}
    emitidas_base = {(r, a.split(".")[0]) for r, a, _ in rev.citas}
    if caso.citas:
        faltan = [f"{r} art. {a}" for r, a in caso.citas
                  if (r, a) not in emitidas and (r, a.split(".")[0]) not in emitidas_base]
        checks.append(Check("citas", not faltan,
                            "" if not faltan else f"faltan: {', '.join(faltan)}"))

    if caso.estado:
        declarados = {e for r, a, e in rev.citas
                      if any(r == cr for cr, _ in caso.citas)} or {e for _, _, e in rev.citas}
        ok = caso.estado in declarados
        checks.append(Check("estado", ok,
                            "" if ok else f"esperado {caso.estado}, declarado {sorted(declarados) or 'ninguno'}"))

    if caso.debe:
        ok = bool(re.search(caso.debe, respuesta, re.I))
        checks.append(Check("debe", ok, "" if ok else f"no aparece /{caso.debe}/"))

    if caso.prohibido:
        m = re.search(caso.prohibido, respuesta, re.I)
        checks.append(Check("prohibido", not m, "" if not m else f"aparece '{m.group(0)}'"))

    return checks


JUEZ_PROMPT = """\
Evalúas la respuesta de un asistente normativo contra la respuesta esperada por \
un equipo jurídico. No juzgas estilo ni formato: juzgas si dice lo que debe decir.

Devuelve JSON con:
  correccion:  0 a 3. 3 = dice lo esencial de lo esperado. 0 = lo contradice.
  calibracion: 0 a 3. 3 = el nivel de confianza declarado encaja con la evidencia
               que aporta. Penaliza tanto la falsa seguridad como el exceso de
               cautela ante algo verificado.
  motivo:      una frase.
"""


def evaluar_juez(caso: Caso, respuesta: str, cliente, modelo: str = "claude-opus-5") -> dict:
    from pydantic import BaseModel

    class Nota(BaseModel):
        correccion: int
        calibracion: int
        motivo: str

    r = cliente.messages.parse(
        model=modelo,
        max_tokens=1_000,
        system=JUEZ_PROMPT,
        output_config={"format": Nota},
        messages=[{"role": "user", "content":
                   f"PREGUNTA\n{caso.pregunta}\n\n"
                   f"ESPERADO\n{caso.esperado}\n\n"
                   f"RESPUESTA\n{respuesta}"}],
    )
    return r.parsed_output.model_dump()


def ejecutar(casos: list[Caso], responder, juez=None, jurisdiccion: str = "ES") -> list[Veredicto]:
    """`responder(caso) -> (texto, uso)`. Inyectado para poder hacer replay."""
    out: list[Veredicto] = []
    for caso in casos:
        if caso.bloqueado:
            out.append(Veredicto(caso.id, caso.bloque, "BLOQUEADO",
                                 [Check("cobertura", False,
                                        "el corpus no contiene el instrumento necesario")]))
            continue
        texto, uso = responder(caso)
        checks = evaluar_determinista(caso, texto, jurisdiccion)
        v = Veredicto(
            caso.id, caso.bloque,
            "PASA" if all(c.ok for c in checks) else "FALLA",
            checks, texto, uso=uso or {})
        if juez is not None:
            try:
                v.juez = juez(caso, texto)
            except Exception as e:  # el juez nunca tumba la ejecución
                v.juez = {"error": str(e)}
        out.append(v)
    return out


def resumen(vs: list[Veredicto]) -> str:
    pasa = sum(v.estado == "PASA" for v in vs)
    falla = sum(v.estado == "FALLA" for v in vs)
    bloq = sum(v.estado == "BLOQUEADO" for v in vs)
    evaluables = pasa + falla

    lineas = ["", "=" * 74,
              f"  {pasa}/{evaluables} PASAN   ·   {falla} fallan   ·   {bloq} bloqueados por corpus",
              "=" * 74]

    for v in vs:
        if v.estado == "PASA":
            continue
        marca = "BLOQ" if v.estado == "BLOQUEADO" else "FALLA"
        lineas.append(f"\n  [{marca}] {v.caso_id}  ({v.bloque})")
        for c in v.fallos:
            lineas.append(f"      ✗ {c.nombre}: {c.detalle}")

    por_check: dict[str, int] = {}
    for v in vs:
        for c in v.fallos:
            por_check[c.nombre] = por_check.get(c.nombre, 0) + 1
    if por_check:
        lineas.append("\n  fallos por comprobación:")
        for k, n in sorted(por_check.items(), key=lambda x: -x[1]):
            lineas.append(f"      {k:<12} {n}")

    notas = [v.juez for v in vs if v.juez and "correccion" in v.juez]
    if notas:
        c = sum(n["correccion"] for n in notas) / len(notas)
        k = sum(n["calibracion"] for n in notas) / len(notas)
        lineas.append(f"\n  juez (informativo)  corrección {c:.2f}/3 · calibración {k:.2f}/3"
                      f"  sobre {len(notas)} casos")

    tot_in = sum(v.uso.get("input", 0) for v in vs)
    tot_out = sum(v.uso.get("output", 0) for v in vs)
    cache = sum(v.uso.get("cache_read", 0) for v in vs)
    if tot_in or tot_out:
        total_entrada = tot_in + cache
        pct = (cache / total_entrada * 100) if total_entrada else 0
        lineas.append(f"\n  tokens  entrada {tot_in:,} · salida {tot_out:,} · "
                      f"caché leído {cache:,} ({pct:.0f}% de la entrada)")

    veredicto = "PUBLICABLE" if falla == 0 else "PUBLICACIÓN BLOQUEADA"
    lineas += ["", f"  {veredicto}", ""]
    return "\n".join(lineas)


def guardar(vs: list[Veredicto], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps([asdict(v) for v in vs], ensure_ascii=False, indent=2),
                    encoding="utf-8")


def cargar_replay(path: Path) -> dict[str, str]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, list):  # salida de guardar()
        return {v["caso_id"]: v.get("respuesta", "") for v in data}
    return dict(data)
