"""Lector de la suite de regresión.

La suite vive en corpus/eval/regression-suite.md, en markdown, porque la
mantiene el equipo jurídico y no debe requerir tocar código para añadir un caso.
Este módulo la convierte en casos ejecutables.

Cada caso puede llevar aserciones comprobables por máquina, en líneas «⊨»:

    ⊨ citas: UE-DIR-2023-970 art. 5, ES-ET art. 28.3
    ⊨ estado: INTERPRETATIVO
    ⊨ debe: transpu|no transpuesta
    ⊨ prohibido: está obligada a publicar
    ⊨ cobertura: PENDIENTE

Son opcionales. Un caso sin aserciones se evalúa solo con el juez y con la
guardia; un caso con ellas gana comprobaciones deterministas y bloqueantes.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path

SUITE = Path(__file__).resolve().parents[2] / "corpus" / "eval" / "regression-suite.md"

CASO = re.compile(
    r"^\*\*(?P<id>[A-F]\d+(?:\s+bis)?)\.\*\*\s*(?P<pregunta>.+?)\n"
    r"→\s*Esperado:\s*(?P<esperado>.+?)(?=\n⊨|\n\n|\n>|\n#|\Z)"
    r"(?P<aserciones>(?:\n⊨[^\n]*)*)",
    re.M | re.S,
)
BLOQUE = re.compile(r"^##\s+Bloque\s+(?P<letra>[A-F])\s*·\s*(?P<titulo>.+)$", re.M)
ASERCION = re.compile(r"^⊨\s*(?P<clave>\w+)\s*:\s*(?P<valor>.+)$", re.M)
CITA_REF = re.compile(r"^(?P<ref>[A-Z0-9\-]+)\s+art\.\s*(?P<art>[0-9]+(?:\.[0-9a-z]+)*)$")


@dataclass(frozen=True)
class Caso:
    id: str
    bloque: str
    pregunta: str
    esperado: str
    citas: tuple[tuple[str, str], ...] = ()
    estado: str | None = None
    debe: str | None = None
    prohibido: str | None = None
    cobertura: str | None = None

    @property
    def bloqueado(self) -> bool:
        """El corpus no cubre este caso todavía. No es un fallo del modelo."""
        return self.cobertura == "PENDIENTE"

    @property
    def tiene_aserciones(self) -> bool:
        return bool(self.citas or self.estado or self.debe or self.prohibido)


def _limpiar(s: str) -> str:
    s = re.sub(r"\*\*(.+?)\*\*", r"\1", s)
    s = re.sub(r"`(.+?)`", r"\1", s)
    return " ".join(s.split())


def cargar(path: Path | None = None) -> list[Caso]:
    texto = (path or SUITE).read_text(encoding="utf-8")
    bloques = [(m.start(), m.group("letra"), m.group("titulo").strip())
               for m in BLOQUE.finditer(texto)]

    def bloque_de(pos: int) -> str:
        actual = "?"
        for start, letra, titulo in bloques:
            if start < pos:
                actual = f"{letra} · {titulo}"
        return actual

    casos: list[Caso] = []
    for m in CASO.finditer(texto):
        a = {x.group("clave"): x.group("valor").strip()
             for x in ASERCION.finditer(m.group("aserciones") or "")}

        citas = []
        for trozo in (a.get("citas") or "").split(","):
            trozo = trozo.strip()
            if not trozo:
                continue
            c = CITA_REF.match(trozo)
            if c:
                citas.append((c.group("ref"), c.group("art")))

        casos.append(Caso(
            id=re.sub(r"\s+", " ", m.group("id")).strip(),
            bloque=bloque_de(m.start()),
            pregunta=_limpiar(m.group("pregunta")),
            esperado=_limpiar(m.group("esperado")),
            citas=tuple(citas),
            estado=a.get("estado"),
            debe=a.get("debe"),
            prohibido=a.get("prohibido"),
            cobertura=a.get("cobertura"),
        ))
    return casos


def por_bloque(casos: list[Caso]) -> dict[str, list[Caso]]:
    out: dict[str, list[Caso]] = {}
    for c in casos:
        out.setdefault(c.bloque, []).append(c)
    return out
