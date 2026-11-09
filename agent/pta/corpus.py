"""Carga del corpus verificado en el prompt.

Decisión de arquitectura: a ~14k tokens de contenido normativo, el corpus entra
entero en el prompt. Nada de vectorial, chunking ni reranker. Esa maquinaria
resuelve un problema de escala que no tenemos, y a cambio introduce una clase
de fallos (recuperar el fragmento equivocado) que aquí sería letal.

Umbral para revisar la decisión: el corpus supera ~150k tokens, o aparecen
corpus por tenant que impidan un prompt compartido. Ver README del agente.
"""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2] / "corpus"

# Orden estable y deliberado: el prefijo cacheado no puede variar entre
# peticiones. Un solo byte distinto invalida el caché completo.
DOCUMENTOS = (
    "README.md",
    "global/ue/directiva-2023-970-indice.md",
    "global/ue/ai-act-y-rgpd.md",
    "es/MANIFEST.md",
    "es/vigente/et-arts-22-28.md",
    "es/vigente/valoracion-puestos-svpt.md",
)

LIMITE_SIN_RAG = 150_000  # tokens aprox.


@dataclass(frozen=True)
class Corpus:
    texto: str
    documentos: tuple[str, ...]
    caracteres: int

    @property
    def tokens_aprox(self) -> int:
        return int(self.caracteres / 3.5)

    @property
    def necesita_rag(self) -> bool:
        return self.tokens_aprox > LIMITE_SIN_RAG


def cargar(raiz: Path | None = None) -> Corpus:
    base = raiz or RAIZ
    partes, incluidos = [], []
    for rel in DOCUMENTOS:
        p = base / rel
        if not p.exists():
            continue
        partes.append(f"<documento ref=\"{rel}\">\n{p.read_text(encoding='utf-8')}\n</documento>")
        incluidos.append(rel)
    texto = "\n\n".join(partes)
    return Corpus(texto=texto, documentos=tuple(incluidos), caracteres=len(texto))


def bloques_sistema(prompt_sistema: str, corpus: Corpus) -> list[dict]:
    """Bloques del prompt de sistema, con el punto de caché al final.

    El orden de renderizado es tools -> system -> messages. Todo lo estable va
    delante y el punto de caché se coloca en el último bloque estable, de modo
    que herramientas y sistema se cachean juntos.
    """
    return [
        {"type": "text", "text": prompt_sistema},
        {
            "type": "text",
            "text": (
                "<corpus_normativo_verificado>\n"
                "Este es el corpus completo. Si algo no está aquí, no lo sabes.\n\n"
                f"{corpus.texto}\n"
                "</corpus_normativo_verificado>"
            ),
            "cache_control": {"type": "ephemeral", "ttl": "1h"},
        },
    ]
