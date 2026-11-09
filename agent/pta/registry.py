"""Registro de citas verificadas.

Fuente de verdad legible por máquina. Un artículo que no esté aquí no puede
citarse: la guardia lo rechaza antes de que la respuesta llegue a nadie.
"""
from __future__ import annotations

import json
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

REGISTRY_PATH = Path(__file__).resolve().parents[2] / "corpus" / "registry.json"

# Estados de regla. Ver corpus/README.md.
VIGENTE = "VIGENTE"
INTERPRETATIVO = "INTERPRETATIVO"
PREVISTO = "PREVISTO"
ESTADOS = {VIGENTE, INTERPRETATIVO, PREVISTO}


@dataclass(frozen=True)
class Instrumento:
    ref: str
    titulo: str
    autoridad: int
    articulos: dict[str, str]
    estados: dict[str, str]
    total_articulos: int | None
    verificacion: str
    hechos_clave: dict[str, str]
    sin_verificar: tuple[str, ...]
    importes: frozenset[int]

    def estado(self, jurisdiccion: str = "ES") -> str | None:
        return self.estados.get(jurisdiccion)

    def tiene_articulo(self, num: str) -> bool:
        """Un artículo es citable si está verificado explícitamente.

        Conocer el total no basta: que la Directiva tenga 37 artículos no
        significa que tengamos verificado el título del 19. Citar por
        deducción del rango es exactamente el error que este registro evita.
        """
        return num.split(".")[0] in self.articulos


@lru_cache(maxsize=1)
def cargar(path: Path | None = None) -> dict[str, Instrumento]:
    data = json.loads((path or REGISTRY_PATH).read_text(encoding="utf-8"))
    out: dict[str, Instrumento] = {}
    for ref, raw in data["instrumentos"].items():
        arts = raw.get("articulos") or raw.get("articulos_verificados") or {}
        out[ref] = Instrumento(
            ref=ref,
            titulo=raw["titulo"],
            autoridad=raw["autoridad"],
            articulos=dict(arts),
            estados=dict(raw.get("estado_por_jurisdiccion", {})),
            total_articulos=raw.get("total_articulos"),
            verificacion=raw.get("verificacion", "PENDIENTE_VERIFICACION"),
            hechos_clave=dict(raw.get("hechos_clave", {})),
            sin_verificar=tuple(raw.get("sin_verificar", [])),
            importes=frozenset(raw.get("importes_verificados", [])),
        )
    return out


def instrumento(ref: str) -> Instrumento | None:
    return cargar().get(ref)


def refs() -> list[str]:
    return sorted(cargar())
