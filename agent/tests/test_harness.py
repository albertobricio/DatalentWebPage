"""Tests del arnés de evaluación, sobre respuestas grabadas.

Prueban que la puntuación detecta lo que debe detectar. Sin credenciales:
el arnés es evaluable por sí mismo, que es justo lo que se le pide a un arnés.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from pta import evalsuite, harness  # noqa: E402

FIXTURES = Path(__file__).parent / "fixtures" / "replay-demo.json"
RESP = json.loads(FIXTURES.read_text(encoding="utf-8"))
CASOS = {c.id: c for c in evalsuite.cargar()}


def checks_de(caso_id: str, clave: str | None = None) -> dict[str, harness.Check]:
    texto = RESP[clave or caso_id]
    return {c.nombre: c for c in harness.evaluar_determinista(CASOS[caso_id], texto)}


def test_suite_parsea_aserciones():
    casos = evalsuite.cargar()
    assert len(casos) == 32, f"esperados 32 casos, hay {len(casos)}"
    con = [c for c in casos if c.tiene_aserciones]
    assert len(con) >= 25, f"solo {len(con)} casos con aserciones"
    a1 = CASOS["A1"]
    assert a1.citas == (("UE-DIR-2023-970", "5"),)
    assert a1.estado == "INTERPRETATIVO"


def test_respuesta_correcta_pasa_todo():
    for cid in ("A1", "B1", "B4", "C9", "D1", "F2", "F5"):
        cs = checks_de(cid)
        fallos = [n for n, c in cs.items() if not c.ok]
        assert not fallos, f"{cid} falla en {fallos}: {[cs[n].detalle for n in fallos]}"


def test_estado_mal_clasificado_falla():
    cs = checks_de("A1", "A1_MAL")
    assert not cs["guardia"].ok, "la guardia debe rechazar la Directiva marcada VIGENTE"
    assert not cs["estado"].ok, "el check de estado debe fallar"


def test_importe_inventado_falla():
    # F5_MAL dice "muy grave" y por tanto pasa el check léxico `debe`. Lo que
    # lo tumba es la guardia: 187.515 no está entre las cuantías verificadas.
    # Es el caso que justifica que la capa determinista no se apoye solo en
    # patrones de texto.
    cs = checks_de("F5", "F5_MAL")
    assert not cs["guardia"].ok, "la guardia debe bloquear el importe inexacto"
    assert "G8" in cs["guardia"].detalle, cs["guardia"].detalle


def test_casos_sin_cobertura_no_cuentan_como_fallo_del_modelo():
    # El mecanismo se prueba con un caso sintético, no con casos reales de la
    # suite: cuando el corpus crece, los bloqueados se desbloquean y un test
    # anclado a ids concretos empieza a fallar por la razón equivocada. Pasó
    # con E1 a E4 al incorporar el AI Act y el RGPD el 2026-07-29.
    sintetico = evalsuite.Caso(
        id="X1", bloque="sintético", pregunta="¿?", esperado="",
        cobertura="PENDIENTE")
    vs = harness.ejecutar([sintetico], responder=lambda c: ("", {}))
    assert vs[0].estado == "BLOQUEADO"
    assert vs[0].fallos[0].nombre == "cobertura"


def test_el_bloque_E_ya_no_esta_bloqueado():
    bloqueados = {c.id for c in evalsuite.cargar() if c.bloqueado}
    assert not bloqueados, f"quedan casos sin cobertura: {sorted(bloqueados)}"


def test_resumen_bloquea_publicacion_si_hay_fallos():
    casos = [CASOS["A1"], CASOS["F5"]]
    vs = harness.ejecutar(casos, responder=lambda c: (RESP[c.id + "_MAL"], {}))
    txt = harness.resumen(vs)
    assert "PUBLICACIÓN BLOQUEADA" in txt
    vs_ok = harness.ejecutar(casos, responder=lambda c: (RESP[c.id], {}))
    assert "PUBLICABLE" in harness.resumen(vs_ok)


if __name__ == "__main__":
    fallos = 0
    for nombre, fn in sorted(globals().items()):
        if nombre.startswith("test_") and callable(fn):
            try:
                fn()
                print(f"  ok    {nombre}")
            except AssertionError as e:
                fallos += 1
                print(f"  FALLO {nombre}\n        {e}")
    print(f"\n{'todos los tests pasan' if not fallos else f'{fallos} fallos'}")
    raise SystemExit(1 if fallos else 0)
