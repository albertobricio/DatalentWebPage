"""Tests del analizador de ofertas, sobre textos realistas.

Cubren tanto lo que debe detectar como lo que NO debe detectar. Un detector
que dispara con todo es un detector que el cliente aprende a ignorar, y
entonces deja de servir para los hallazgos verdaderos.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from pta import guard, ofertas  # noqa: E402

MALA = """
Buscamos un Ingeniero de Software ambicioso y competitivo para incorporarse a
nuestro equipo joven y dinámico. Perfil recién titulado, con máximo 3 años de
experiencia. Se requiere plena disponibilidad y disponibilidad para viajar.
Indícanos tus pretensiones económicas y tu salario actual en la candidatura.
Buscamos un crack, un auténtico ninja del código, con liderazgo y orientado a
resultados.
"""

BUENA = """
Buscamos una persona candidata para el puesto de Ingeniero/a de Software.
Banda retributiva: 38.000 - 46.000 € brutos anuales, según experiencia
acreditada en los criterios de valoración publicados en nuestra política
retributiva. Jornada completa con horario flexible. Los desplazamientos son
puntuales, unas cuatro veces al año, por requerimiento de auditoría de cliente.
Valoramos capacidad de colaboración y escucha, y autonomía técnica.
No preguntamos por retribuciones anteriores.
"""

INTERMEDIA = """
Se busca Analista de Datos. Retribución: 35.000 € brutos anuales.
Se valorará disponibilidad para viajar de forma ocasional.
Buscamos una persona con capacidad analítica y de trabajo en equipo.
"""


def codigos(texto: str) -> set[str]:
    return {h.codigo for h in ofertas.analizar(texto).hallazgos}


def test_oferta_problematica_dispara_todos_los_ejes():
    a = ofertas.analizar(MALA)
    c = {h.codigo for h in a.hallazgos}
    for esperado in ("C1_SIN_BANDA", "C2_HISTORIAL_RETRIBUTIVO",
                     "S1_GENERICO_MASCULINO", "E1_MARCADOR_EDAD",
                     "D1_DISPONIBILIDAD", "L1_DESEQUILIBRIO_AGENTICO"):
        assert esperado in c, f"falta {esperado}; detectados {sorted(c)}"
    assert a.nivel == "ALTO", f"riesgo {a.riesgo}"


def test_oferta_correcta_no_dispara_falsos_positivos():
    a = ofertas.analizar(BUENA)
    assert a.banda_declarada, "debe reconocer la banda '38.000 - 46.000 €'"
    assert "C1_SIN_BANDA" not in {h.codigo for h in a.hallazgos}
    assert "C2_HISTORIAL_RETRIBUTIVO" not in {h.codigo for h in a.hallazgos}, \
        "«No preguntamos por retribuciones anteriores» no es una solicitud"
    assert "S1_GENERICO_MASCULINO" not in {h.codigo for h in a.hallazgos}, \
        "«Ingeniero/a» y «persona candidata» son formas inclusivas"
    assert a.nivel == "BAJO", f"riesgo {a.riesgo}: {[h.codigo for h in a.hallazgos]}"


def test_norm_preserva_longitud():
    # De esto depende que _frag recorte el fragmento correcto del texto
    # original. Si NFD dejara de preservar longitud, los fragmentos saldrían
    # desplazados y nadie lo notaría hasta verlo en un informe de cliente.
    for muestra in ("Ingeniero/a de Software · ñ, á, é, í, ó, ú, ü",
                    "RECIÉN TITULADO", "máximo 5 años", MALA, BUENA):
        assert len(ofertas._norm(muestra)) == len(muestra), repr(muestra)


def test_fragmento_conserva_acentos_del_original():
    a = ofertas.analizar("Perfil recién titulado con máximo 3 años de experiencia.")
    h = next(x for x in a.hallazgos if x.codigo == "E1_MARCADOR_EDAD")
    assert "recién" in h.fragmento, h.fragmento
    assert "años" in h.fragmento, h.fragmento


def test_banda_en_formato_k_tambien_cuenta():
    assert ofertas.analizar("Salario 38k-46k según valía.").banda_declarada


def test_hallazgo_lexico_va_a_revision_no_al_informe():
    a = ofertas.analizar(MALA)
    lex = [h for h in a.hallazgos if h.eje == "lexico"]
    assert lex and lex[0].confianza == "BAJA", \
        "el eje léxico no está validado en español: nunca confianza alta"
    assert lex[0] in a.revisables


def test_el_articulo_5_se_reporta_como_interpretativo():
    # Es la prueba de que el analizador respeta el modelo de tres estados:
    # no declarar banda salarial NO es incumplimiento en España hoy.
    a = ofertas.analizar(MALA)
    h = next(x for x in a.hallazgos if x.codigo == "C1_SIN_BANDA")
    assert "INTERPRETATIVO" in h.base
    assert "no es exigible" in h.mecanismo or "riesgo de preparación" in h.mecanismo


def test_las_bases_legales_pasan_la_guardia():
    # Cada cita que emite el analizador debe resolver contra el registro.
    for texto in (MALA, BUENA, INTERMEDIA):
        for h in ofertas.analizar(texto).hallazgos:
            if not h.base:
                continue
            res = guard.revisar(h.base)
            assert res.apto, f"{h.codigo}: {guard.render(res)}"


# Afirmación de ilicitud o intención, EXCLUYENDO las formas negadas. La primera
# versión de este test buscaba subcadenas y saltaba con «hoy no es ilegal», que
# dice justo lo contrario. Mismo fallo que el check léxico `debe` sobre F5_MAL:
# una aserción sobre prosa necesita entender la negación o no sirve.
AFIRMA_ILICITUD = re.compile(
    r"(?<!no\s)(?<!no\ses\s)(?<!nunca\s)"
    r"\b(discrimina|discriminatori[oa]|es\s+ilegal|infringe|vulnera|"
    r"con\s+intenci[oó]n|deliberad[oa])\b", re.I)


def test_nunca_se_afirma_intencion():
    for texto in (MALA, BUENA, INTERMEDIA):
        for h in ofertas.analizar(texto).hallazgos:
            for campo in (h.titulo, h.mecanismo):
                m = AFIRMA_ILICITUD.search(campo)
                assert not m, f"{h.codigo} afirma «{m.group(0)}» en: {campo}"


def test_la_negacion_no_cuenta_como_afirmacion():
    assert not AFIRMA_ILICITUD.search("hoy no es ilegal, pero conviene retirarlo")
    assert AFIRMA_ILICITUD.search("este requisito discrimina a las candidatas")


def test_oferta_intermedia_es_riesgo_medio_o_bajo():
    a = ofertas.analizar(INTERMEDIA)
    assert a.banda_declarada
    assert a.nivel in ("BAJO", "MEDIO"), f"riesgo {a.riesgo}"


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
