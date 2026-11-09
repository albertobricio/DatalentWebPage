"""Asistente normativo. Llamada al modelo más guardia determinista.

La guardia decide. Si rechaza, el agente reintenta una vez con los errores
concretos como instrucción de operador, y si vuelve a fallar devuelve el
rechazo en lugar de una respuesta que no puede defender.
"""
from __future__ import annotations

from dataclasses import dataclass

from . import corpus as corpus_mod
from . import guard, prompts

MODELO = "claude-opus-5"
EFFORT = "high"
MAX_TOKENS = 8_000
MAX_REINTENTOS = 1


@dataclass
class Respuesta:
    texto: str
    apto: bool
    revision: guard.Resultado
    intentos: int
    uso: dict


def _cliente():
    try:
        import anthropic
    except ModuleNotFoundError as e:  # pragma: no cover
        raise RuntimeError(
            "Falta el SDK. Instala con:  pip install -r agent/requirements.txt"
        ) from e
    return anthropic.Anthropic()


def preguntar(pregunta: str, jurisdiccion: str = "ES", cliente=None) -> Respuesta:
    cliente = cliente or _cliente()
    c = corpus_mod.cargar()
    system = corpus_mod.bloques_sistema(prompts.ASISTENTE_NORMATIVO, c)

    mensajes: list[dict] = [{"role": "user", "content": pregunta}]
    uso: dict = {}

    for intento in range(1, MAX_REINTENTOS + 2):
        r = cliente.messages.create(
            model=MODELO,
            max_tokens=MAX_TOKENS,
            system=system,
            messages=mensajes,
            output_config={"effort": EFFORT},
        )
        texto = "".join(b.text for b in r.content if b.type == "text")
        uso = {
            "input": r.usage.input_tokens,
            "output": r.usage.output_tokens,
            "cache_read": getattr(r.usage, "cache_read_input_tokens", 0),
            "cache_write": getattr(r.usage, "cache_creation_input_tokens", 0),
        }
        revision = guard.revisar(texto, jurisdiccion)
        if revision.apto or intento > MAX_REINTENTOS:
            return Respuesta(texto, revision.apto, revision, intento, uso)

        # Reintento: los errores van como mensaje de operador, que preserva
        # el prefijo cacheado en lugar de reescribir el system.
        detalle = "\n".join(f"- {h.codigo}: {h.mensaje}" for h in revision.errores())
        mensajes += [
            {"role": "assistant", "content": texto},
            {"role": "system", "content":
                "La guardia determinista ha rechazado tu respuesta. Corrige y "
                f"reescríbela entera:\n{detalle}"},
        ]

    raise AssertionError("inalcanzable")
