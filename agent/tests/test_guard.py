"""Tests de la guardia determinista.

Cada test corresponde a un fallo real que el sistema debe interceptar. El caso
G4 es literalmente el error que Datalent cometió y propagó por su propio diseño:
situar la evaluación conjunta retributiva en el art. 11 de la Directiva.
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from pta import guard  # noqa: E402


def codigos(texto: str) -> set[str]:
    return {h.codigo for h in guard.revisar(texto).hallazgos}


def test_cita_correcta_pasa():
    t = ("La evaluación conjunta retributiva está en "
         "[[UE-DIR-2023-970 art. 10|INTERPRETATIVO]], con umbral del 5%.")
    res = guard.revisar(t)
    assert res.apto, guard.render(res)
    assert res.citas == [("UE-DIR-2023-970", "10", "INTERPRETATIVO")]


def test_articulo_inexistente():
    # La Directiva tiene 37 artículos. El 47 no existe.
    assert "G2_ARTICULO_NO_VERIFICADO" in codigos(
        "Según [[UE-DIR-2023-970 art. 47|INTERPRETATIVO]] el empleador debe...")


def test_articulo_no_verificado_aunque_este_en_rango():
    # El art. 19 existe en la Directiva pero su contenido no está verificado.
    # Citar por deducción del rango es exactamente lo que hay que impedir.
    assert "G2_ARTICULO_NO_VERIFICADO" not in codigos(
        "[[UE-DIR-2023-970 art. 19|INTERPRETATIVO]]"), "el 19 sí está en el índice"
    assert "G2_ARTICULO_NO_VERIFICADO" in codigos(
        "[[ES-RD902-2020 art. 11|VIGENTE]]"), "el RD 902 tiene 11 arts, solo 2-8 verificados"


def test_instrumento_desconocido():
    assert "G1_INSTRUMENTO_DESCONOCIDO" in codigos("[[UE-DIR-9999-999 art. 1|VIGENTE]]")


def test_estado_incorrecto_es_el_error_del_diseno_original():
    # La Directiva no está transpuesta en España: no puede ser VIGENTE.
    assert "G4_ESTADO_INCORRECTO" in codigos(
        "[[UE-DIR-2023-970 art. 5|VIGENTE]] obliga a publicar la banda salarial.")


def test_cita_suelta_sin_token():
    assert "G5_CITA_SIN_TOKEN" in codigos(
        "El artículo 10 de la Directiva regula la evaluación conjunta.")


def test_incumplimiento_sobre_norma_no_vigente():
    t = ("Su empresa incumple [[UE-DIR-2023-970 art. 5|INTERPRETATIVO]] "
         "al no publicar la banda salarial.")
    assert "G6_INCUMPLIMIENTO_SOBRE_NO_VIGENTE" in codigos(t)


def test_incumplimiento_sobre_norma_vigente_es_admisible():
    t = ("Su empresa incumple [[ES-RD902-2020 art. 5|VIGENTE]] "
         "al no llevar registro retributivo.")
    res = guard.revisar(t)
    assert res.apto, guard.render(res)


def test_importe_verificado_pasa():
    t = ("[[ES-RDL-5-2000 art. 40|VIGENTE]] fija para las muy graves multas "
         "de 7.501 a 225.018 euros.")
    res = guard.revisar(t)
    assert res.apto, guard.render(res)


def test_importe_verosimil_pero_inexacto_se_bloquea():
    # 187.515 es plausible y falso: el máximo real es 225.018. Un importe
    # inexacto es peor que ninguno, porque el cliente presupuesta con él.
    t = "[[ES-RDL-5-2000 art. 40|VIGENTE]] fija multas de hasta 187.515 euros."
    assert "G8_IMPORTE_NO_COINCIDE" in codigos(t)


def test_importe_sobre_instrumento_sin_cuantias():
    t = "[[ES-RD902-2020 art. 5|VIGENTE]] prevé multas de 5.000 euros."
    assert "G7_IMPORTE_SIN_VERIFICAR" in codigos(t)


def test_importe_se_atribuye_al_instrumento_correcto():
    # Detectado ejecutando el servicio: con dos citas en la misma frase, la
    # guardia culpaba a la primera. El importe es de la LISOS, no de la
    # Directiva, y el error debe ser G8 (importe inexacto), no G7 (sin cuantías).
    t = ("Se expone a 187.515 euros según [[UE-DIR-2023-970 art. 5|INTERPRETATIVO]] "
         "y [[ES-RDL-5-2000 art. 40|VIGENTE]].")
    c = codigos(t)
    assert "G8_IMPORTE_NO_COINCIDE" in c, c
    assert "G7_IMPORTE_SIN_VERIFICAR" not in c, c


def test_importe_correcto_con_varias_citas_pasa():
    t = ("[[UE-DIR-2023-970 art. 23|INTERPRETATIVO]] remite a sanciones y "
         "[[ES-RDL-5-2000 art. 40|VIGENTE]] las fija en hasta 225.018 euros.")
    res = guard.revisar(t)
    assert res.apto, guard.render(res)


def test_apartados_se_resuelven_por_articulo_base():
    res = guard.revisar("[[ES-ET art. 28.3|VIGENTE]] fija el umbral del 25%.")
    assert res.apto, guard.render(res)


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
