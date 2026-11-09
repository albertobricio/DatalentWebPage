"""Analizador de ofertas de empleo.

Capa determinista: detecta lo que se puede detectar con reglas y lo puntúa.
El modelo entra después, para lo que las reglas no alcanzan (contexto,
justificación funcional de un requisito, reescritura).

Dos principios que gobiernan este módulo:

1. **Nunca se afirma intención.** Se describe efecto potencial y su mecanismo.
   «Este requisito puede tener impacto adverso sobre candidatas con
   responsabilidades de cuidado» es correcto. «Este requisito discrimina» no lo
   es: excede el ámbito del sistema y expone al cliente.

2. **El art. 5 de la Directiva es INTERPRETATIVO en España.** La ausencia de
   banda salarial no es incumplimiento hoy. Es riesgo de preparación, y así se
   reporta. Confundirlo es el error que el resto del sistema existe para evitar.
"""
from __future__ import annotations

import re
import unicodedata
from dataclasses import dataclass, field

# ---------------------------------------------------------------------------
# Léxico
#
# ESTADO: PENDIENTE_VERIFICACION.
#
# La base metodológica del eje agéntico/comunal es Gaucher, Friesen & Kay
# (2011), Journal of Personality and Social Psychology 101(1), sobre lenguaje
# de género en ofertas de empleo. Ese trabajo es sobre inglés. Esta adaptación
# al español NO está validada contra un corpus anotado por evaluadores humanos,
# y por eso los hallazgos de este eje salen con confianza BAJA y van a revisión
# humana en lugar de al informe.
#
# [VALIDATE: validación del léxico contra corpus anotado, con medida de acuerdo
#  entre anotadores. Hasta entonces, el eje léxico es indicativo, no probatorio.]
# ---------------------------------------------------------------------------

AGENTICO = {
    "agresivo", "agresiva", "ambicioso", "ambiciosa", "competitivo", "competitiva",
    "dominante", "lider", "liderazgo", "autonomo", "autonoma", "decidido", "decidida",
    "determinado", "determinada", "independiente", "asertivo", "asertiva",
    "orientado a resultados", "orientada a resultados", "guerrero", "ninja", "crack",
    "rockstar", "luchador", "luchadora", "batalla", "conquistar",
}

COMUNAL = {
    "colaborativo", "colaborativa", "empatico", "empatica", "empatia",
    "apoyo", "cooperativo", "cooperativa", "comprensivo", "comprensiva",
    "paciente", "amable", "cercano", "cercana", "acompanar", "cuidar",
    "escucha", "sensible", "leal",
}

EDAD = {
    r"reci[eé]n\s+(titulad|licenciad|graduad)": "referencia a titulación reciente",
    r"\bj[oó]ven(es)?\b": "referencia explícita a juventud",
    r"equipo\s+joven": "«equipo joven» como reclamo",
    r"nativo[s]?\s+digital": "«nativo digital» como proxy de edad",
    r"menor(es)?\s+de\s+\d{2}\s*a[nñ]os": "límite de edad explícito",
    r"m[aá]ximo\s+\d{1,2}\s*a[nñ]os\s+de\s+experiencia": "tope de experiencia",
}

DISPONIBILIDAD = {
    r"disponibilidad\s+(total|plena|absoluta|completa)": "disponibilidad sin límite declarado",
    r"plena\s+disponibilidad": "disponibilidad sin límite declarado",
    r"disponibilidad\s+para\s+viajar": "disponibilidad para viajar",
    r"flexibilidad\s+horaria\s+total": "flexibilidad horaria sin límite",
    r"incorporaci[oó]n\s+inmediata": "incorporación inmediata",
}

HISTORIAL = {
    r"salario\s+actual": "solicitud de salario actual",
    r"[uú]ltimo\s+salario": "solicitud de salario anterior",
    r"expectativas?\s+salarial(es)?": "solicitud de expectativa salarial",
    r"pretensiones?\s+(econ[oó]mic|salarial)": "solicitud de pretensión económica",
    r"banda\s+salarial\s+actual": "solicitud de banda actual",
}

# Rango retributivo declarado: "30.000 - 40.000 €", "entre 30.000 y 40.000 euros",
# "30k-40k", "salario: 35.000 € brutos anuales".
BANDA = re.compile(
    r"(\d[\d.]{2,}\s*(?:€|eur|euros)?\s*(?:-|–|a|y|hasta)\s*\d[\d.]{2,}\s*(?:€|eur|euros))"
    r"|(\d{2,3}\s*k\s*(?:-|–|a)\s*\d{2,3}\s*k)"
    r"|((?:salario|retribuci[oó]n|banda|rango)[^.\n]{0,40}\d[\d.]{2,}\s*(?:€|eur|euros))",
    re.I)

# Formas inclusivas o desdobladas que neutralizan el genérico masculino.
INCLUSIVO = re.compile(r"/[oa]s?\b|\([oa]s?\)|@|\bx\b|persona\s+(?:candidat|responsabl)|"
                       r"\by\s+\w+as\b|\bo\s+\w+a\b", re.I)

PUESTOS_MASC = re.compile(
    r"\b(ingeniero|desarrollador|programador|analista|consultor|director|jefe|"
    r"responsable|t[eé]cnico|comercial|gestor|administrativo|contable|abogado|"
    r"arquitecto|dise[nñ]ador|operario|mozo|cocinero|camarero|enfermero|profesor)"
    r"(?:es)?\b", re.I)


def _norm(s: str) -> str:
    """Minúsculas sin diacríticos, PRESERVANDO la longitud.

    NFD descompone «é» en «e» + marca, y al filtrar la marca se recupera la
    longitud original. Eso permite buscar sobre el texto normalizado y recortar
    el fragmento del texto original, que es el que se le enseña a la persona.
    """
    return "".join(c for c in unicodedata.normalize("NFD", s.lower())
                   if unicodedata.category(c) != "Mn")


def _frag(original: str, span: tuple[int, int]) -> str:
    """Fragmento del texto original, con espacios colapsados."""
    return " ".join(original[span[0]:span[1]].split())


CONFIANZA = {"ALTA": 3, "MEDIA": 2, "BAJA": 1}


@dataclass
class Hallazgo:
    eje: str            # cumplimiento | sesgo | edad | disponibilidad | lexico
    codigo: str
    titulo: str
    fragmento: str
    mecanismo: str      # por qué puede producir efecto adverso
    base: str           # cita en formato canónico, o "" si es metodológica
    confianza: str
    peso: int           # aportación a la puntuación de riesgo


@dataclass
class Analisis:
    hallazgos: list[Hallazgo] = field(default_factory=list)
    banda_declarada: bool = False

    def por_eje(self) -> dict[str, list[Hallazgo]]:
        out: dict[str, list[Hallazgo]] = {}
        for h in self.hallazgos:
            out.setdefault(h.eje, []).append(h)
        return out

    @property
    def revisables(self) -> list[Hallazgo]:
        """Confianza BAJA: van a revisión humana, no al informe."""
        return [h for h in self.hallazgos if h.confianza == "BAJA"]

    @property
    def riesgo(self) -> int:
        """0 a 100. Los hallazgos de confianza BAJA pesan la mitad."""
        total = sum(h.peso if h.confianza != "BAJA" else h.peso // 2
                    for h in self.hallazgos)
        return min(100, total)

    @property
    def nivel(self) -> str:
        r = self.riesgo
        return "ALTO" if r >= 60 else "MEDIO" if r >= 30 else "BAJO"


def analizar(texto: str) -> Analisis:
    a = Analisis()
    n = _norm(texto)

    # --- Eje cumplimiento -------------------------------------------------
    a.banda_declarada = bool(BANDA.search(texto))
    if not a.banda_declarada:
        a.hallazgos.append(Hallazgo(
            "cumplimiento", "C1_SIN_BANDA",
            "No declara retribución inicial ni banda retributiva",
            "",
            "El art. 5 de la Directiva reconoce al solicitante de empleo el derecho a "
            "recibir información sobre la retribución inicial o su banda. En España no "
            "está transpuesto: hoy no es exigible, y genera riesgo de preparación.",
            "[[UE-DIR-2023-970 art. 5|INTERPRETATIVO]]", "ALTA", 25))

    for pat, desc in HISTORIAL.items():
        if (m := re.search(pat, n)):
            a.hallazgos.append(Hallazgo(
                "cumplimiento", "C2_HISTORIAL_RETRIBUTIVO",
                f"Pregunta por el historial retributivo: {desc}",
                _frag(texto, m.span()),
                "El art. 5 de la Directiva prohíbe al empleador preguntar por el "
                "historial retributivo del solicitante. No transpuesto en España, luego "
                "hoy no es ilegal, pero perpetúa brechas heredadas y conviene retirarlo.",
                "[[UE-DIR-2023-970 art. 5|INTERPRETATIVO]]", "ALTA", 20))
            break

    # --- Eje sesgo de género gramatical -----------------------------------
    puestos = {m.group(0).lower() for m in PUESTOS_MASC.finditer(texto)}
    if puestos and not INCLUSIVO.search(texto):
        a.hallazgos.append(Hallazgo(
            "sesgo", "S1_GENERICO_MASCULINO",
            "Denominación del puesto solo en masculino, sin forma inclusiva",
            ", ".join(sorted(puestos)[:4]),
            "El genérico masculino sin desdoblar reduce la tasa de candidatura "
            "femenina. Es el ajuste de menor coste y mayor efecto de toda la oferta.",
            "[[ES-ET art. 22|VIGENTE]]", "ALTA", 15))

    # --- Eje edad ---------------------------------------------------------
    # Un hallazgo por eje, no uno por coincidencia. Cuatro marcadores de edad
    # son un problema, no cuatro: contarlos por separado infla la puntuación y
    # hace que un único defecto sature el informe.
    edad = [(desc, _frag(texto, m.span()))
            for pat, desc in EDAD.items() if (m := re.search(pat, n))]
    if edad:
        a.hallazgos.append(Hallazgo(
            "edad", "E1_MARCADOR_EDAD",
            f"Marcadores de edad ({len(edad)}): " + "; ".join(d for d, _ in edad),
            " · ".join(f for _, f in edad),
            "Requisitos que correlacionan con la edad y no guardan relación "
            "demostrable con el desempeño pueden producir impacto adverso.",
            "[[ES-RDL-5-2000 art. 8|VIGENTE]]", "MEDIA", 20 + 5 * (len(edad) - 1)))

    # --- Eje disponibilidad ----------------------------------------------
    disp = [(desc, _frag(texto, m.span()))
            for pat, desc in DISPONIBILIDAD.items() if (m := re.search(pat, n))]
    if disp:
        a.hallazgos.append(Hallazgo(
            "disponibilidad", "D1_DISPONIBILIDAD",
            f"Requisitos de disponibilidad ({len(disp)}): " + "; ".join(d for d, _ in disp),
            " · ".join(f for _, f in disp),
            "Sin justificación funcional explícita, pueden producir impacto adverso "
            "sobre personas con responsabilidades de cuidado, mayoritariamente "
            "mujeres. Requiere comprobar si el puesto lo exige de verdad.",
            "", "MEDIA", 12 + 4 * (len(disp) - 1)))

    # --- Eje léxico (indicativo, no probatorio) ---------------------------
    ag = sorted(t for t in AGENTICO if t in n)
    co = sorted(t for t in COMUNAL if t in n)
    if ag and len(ag) > len(co) + 1:
        a.hallazgos.append(Hallazgo(
            "lexico", "L1_DESEQUILIBRIO_AGENTICO",
            f"Predominio de léxico agéntico ({len(ag)} frente a {len(co)} comunal)",
            ", ".join(ag[:5]),
            "Base metodológica en Gaucher, Friesen y Kay (2011). La adaptación al "
            "español NO está validada contra corpus anotado: hallazgo indicativo, "
            "para revisión humana, no para el informe.",
            "", "BAJA", 10))

    return a


def render(a: Analisis, ancho: int = 74) -> str:
    l = ["", "=" * ancho,
         f"  RIESGO {a.riesgo}/100 · nivel {a.nivel} · "
         f"{len(a.hallazgos)} hallazgos ({len(a.revisables)} a revisión humana)",
         "=" * ancho]
    for eje, hs in a.por_eje().items():
        l.append(f"\n  {eje.upper()}")
        for h in hs:
            l.append(f"    [{h.confianza:<5}] {h.titulo}")
            if h.fragmento:
                l.append(f"            «{h.fragmento.strip()}»")
            l.append(f"            {h.mecanismo}")
            if h.base:
                l.append(f"            base: {h.base}")
    if a.revisables:
        l += ["", "  Los hallazgos de confianza BAJA no se incluyen en el informe al",
              "  cliente. Un falso positivo erosiona la confianza en los verdaderos."]
    l.append("")
    return "\n".join(l)
