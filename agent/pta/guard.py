"""Guardia determinista de citas.

No usa modelo. Es la defensa que no puede alucinar, y por eso es la que decide.
Toda respuesta del agente pasa por aquí antes de llegar a una persona.

Formato de cita obligatorio:  [[REF art. N|ESTADO]]
Ejemplo:                      [[UE-DIR-2023-970 art. 10|INTERPRETATIVO]]
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field

from . import registry

CITA = re.compile(r"\[\[\s*([A-Z0-9\-]+)\s+art\.\s*([0-9]+(?:\.[0-9a-z]+)*)\s*\|\s*([A-Z_]+)\s*\]\]")

# Referencia normativa suelta, fuera de un token de cita.
SUELTA = re.compile(r"(?<!\[\[)\b(?:art\.|artículo|articulo)\s*([0-9]+(?:\.[0-9a-z]+)*)", re.I)

IMPORTE = re.compile(r"\b(\d[\d.]*(?:,\d+)?)\s*(?:€|euros?|EUR)\b", re.I)


def _num(s: str) -> int:
    """'225.018' -> 225018. El punto es separador de millar en español."""
    return int(s.replace(".", "").split(",")[0])

# Lenguaje que afirma incumplimiento. Solo admisible sobre norma VIGENTE.
INCUMPLIMIENTO = re.compile(
    r"\b(incumpl\w+|infracci\w+|sancionab\w+|est[áa]\s+obligad\w+|"
    r"es\s+ilegal|vulnera\b|contraviene\b)", re.I
)

SEVERIDAD = {"error": 2, "aviso": 1}


@dataclass
class Hallazgo:
    codigo: str
    nivel: str  # "error" bloquea la entrega; "aviso" se registra
    mensaje: str
    fragmento: str = ""


@dataclass
class Resultado:
    hallazgos: list[Hallazgo] = field(default_factory=list)
    citas: list[tuple[str, str, str]] = field(default_factory=list)

    @property
    def apto(self) -> bool:
        return not any(h.nivel == "error" for h in self.hallazgos)

    def errores(self) -> list[Hallazgo]:
        return [h for h in self.hallazgos if h.nivel == "error"]


def revisar(texto: str, jurisdiccion: str = "ES") -> Resultado:
    res = Resultado()
    reg = registry.cargar()

    for m in CITA.finditer(texto):
        ref, art, estado_dicho = m.group(1), m.group(2), m.group(3)
        res.citas.append((ref, art, estado_dicho))
        frag = m.group(0)

        inst = reg.get(ref)
        if inst is None:
            res.hallazgos.append(Hallazgo(
                "G1_INSTRUMENTO_DESCONOCIDO", "error",
                f"El instrumento '{ref}' no existe en el registro.", frag))
            continue

        if not inst.tiene_articulo(art):
            total = f" (el instrumento tiene {inst.total_articulos} artículos)" if inst.total_articulos else ""
            res.hallazgos.append(Hallazgo(
                "G2_ARTICULO_NO_VERIFICADO", "error",
                f"El art. {art} de {ref} no está verificado en el corpus{total}. "
                f"Verificados: {', '.join(sorted(inst.articulos, key=int))}.", frag))
            continue

        estado_real = inst.estado(jurisdiccion)
        if estado_dicho not in registry.ESTADOS:
            res.hallazgos.append(Hallazgo(
                "G3_ESTADO_INVALIDO", "error",
                f"Estado '{estado_dicho}' no reconocido. Admitidos: {sorted(registry.ESTADOS)}.", frag))
        elif estado_real and estado_dicho != estado_real:
            res.hallazgos.append(Hallazgo(
                "G4_ESTADO_INCORRECTO", "error",
                f"{ref} art. {art} es {estado_real} en {jurisdiccion}, "
                f"no {estado_dicho}. Clasificar mal el estado produce el error más caro "
                f"del sistema: imputar un incumplimiento inexistente.", frag))

    # Referencias sueltas fuera de token de cita.
    sin_tokens = CITA.sub(" ", texto)
    for m in SUELTA.finditer(sin_tokens):
        res.hallazgos.append(Hallazgo(
            "G5_CITA_SIN_TOKEN", "error",
            f"Referencia normativa 'art. {m.group(1)}' fuera del formato de cita. "
            f"Toda cita debe emitirse como [[REF art. N|ESTADO]] para poder verificarse.",
            m.group(0)))

    # Las comprobaciones por frase necesitan segmentar el texto, y el token de
    # cita contiene "art." con punto: segmentar en crudo lo parte por la mitad.
    # Se enmascara cada cita con un marcador sin puntuación antes de segmentar.
    for frase, citas_frase in _frases_con_citas(texto):
        if INCUMPLIMIENTO.search(frase):
            no_vigentes = [f"{r} art. {a}" for r, a, _ in citas_frase
                           if (i := reg.get(r)) and i.estado(jurisdiccion) != registry.VIGENTE]
            if no_vigentes:
                res.hallazgos.append(Hallazgo(
                    "G6_INCUMPLIMIENTO_SOBRE_NO_VIGENTE", "error",
                    f"Se afirma incumplimiento apoyándose en norma no vigente en {jurisdiccion}: "
                    f"{', '.join(no_vigentes)}. Una norma INTERPRETATIVO o PREVISTO genera "
                    f"riesgo, nunca hallazgo de incumplimiento.", frase.strip()[:180]))

        importes = [_num(m.group(1)) for m in IMPORTE.finditer(frase)]
        if importes and citas_frase:
            # Una frase puede citar varios instrumentos y el importe pertenece a
            # uno concreto. Recorrerlos en orden y culpar al primero produce el
            # error equivocado: se acusaba a la Directiva de no tener cuantías
            # cuando el importe era de la LISOS. Se toma la unión de las
            # cuantías verificadas de todos los instrumentos citados.
            con_cuantias = {r: reg[r] for r, _, _ in citas_frase
                            if r in reg and reg[r].importes}
            if not con_cuantias:
                refs = sorted({r for r, _, _ in citas_frase if r in reg})
                res.hallazgos.append(Hallazgo(
                    "G7_IMPORTE_SIN_VERIFICAR", "error",
                    f"Importe económico en una frase que solo cita "
                    f"{', '.join(refs)}, sin cuantías verificadas en el corpus.",
                    frase.strip()[:180]))
            else:
                admitidos = set().union(*(i.importes for i in con_cuantias.values()))
                fuera = [i for i in importes if i not in admitidos]
                if fuera:
                    res.hallazgos.append(Hallazgo(
                        "G8_IMPORTE_NO_COINCIDE", "error",
                        f"Importe {fuera[0]:,} no figura entre las cuantías verificadas "
                        f"de {', '.join(sorted(con_cuantias))}. Un importe verosímil "
                        f"pero inexacto es peor que ninguno: el cliente lo usa para "
                        f"presupuestar.".replace(",", "."),
                        frase.strip()[:180]))

    return res


def _frases_con_citas(texto: str) -> list[tuple[str, list[tuple[str, str, str]]]]:
    """Segmenta en frases sin romper los tokens de cita."""
    citas: list[tuple[str, str, str]] = []

    def _mask(m: re.Match) -> str:
        citas.append((m.group(1), m.group(2), m.group(3)))
        return f"\x00{len(citas) - 1}\x00"

    enmascarado = CITA.sub(_mask, texto)
    salida = []
    for frase in re.split(r"(?<=[.;:\n])\s+", enmascarado):
        indices = [int(i) for i in re.findall(r"\x00(\d+)\x00", frase)]
        visible = re.sub(r"\x00(\d+)\x00",
                         lambda m: "[[{} art. {}|{}]]".format(*citas[int(m.group(1))]), frase)
        salida.append((visible, [citas[i] for i in indices]))
    return salida


def render(res: Resultado) -> str:
    if res.apto and not res.hallazgos:
        return f"APTO · {len(res.citas)} citas verificadas"
    lineas = ["APTO con avisos" if res.apto else "NO APTO"]
    for h in sorted(res.hallazgos, key=lambda x: -SEVERIDAD[x.nivel]):
        lineas.append(f"  [{h.nivel.upper()}] {h.codigo}: {h.mensaje}")
        if h.fragmento:
            lineas.append(f"      → {h.fragmento}")
    return "\n".join(lineas)
