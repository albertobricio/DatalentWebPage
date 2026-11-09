"""Autenticación por clave de API y límite de peticiones.

Mínimo imprescindible para que el servicio pueda exponerse. No sustituye a lo
que la arquitectura describe para fase 3 (OIDC, SAML, SCIM, RBAC y ABAC): es
la puerta que impide que un endpoint público quede abierto de par en par.

Las claves se declaran en PTA_API_KEYS, separadas por comas. En producción su
ausencia impide arrancar: un servicio de cumplimiento sin autenticación es peor
que ningún servicio, porque aparenta control donde no lo hay.
"""
from __future__ import annotations

import hashlib
import hmac
import os
import time
from collections import defaultdict, deque
from dataclasses import dataclass

VENTANA_S = 60
LIMITE_POR_VENTANA = 60


def _claves() -> dict[str, str]:
    """{sha256_de_la_clave: etiqueta}. Nunca se guarda la clave en claro."""
    crudo = os.environ.get("PTA_API_KEYS", "").strip()
    out: dict[str, str] = {}
    for i, parte in enumerate(p.strip() for p in crudo.split(",") if p.strip()):
        etiqueta, _, clave = parte.partition(":")
        if not clave:
            etiqueta, clave = f"clave-{i + 1}", etiqueta
        out[hashlib.sha256(clave.encode()).hexdigest()] = etiqueta
    return out


def es_produccion() -> bool:
    return os.environ.get("PTA_ENV", "dev").lower() in ("prod", "production")


def comprobar_arranque() -> None:
    """Falla rápido si el despliegue es inseguro. Se llama al importar la app."""
    if es_produccion() and not _claves():
        raise RuntimeError(
            "PTA_ENV=production sin PTA_API_KEYS. El servicio no arranca sin "
            "autenticación: expondría los endpoints /v1/ a cualquiera y el "
            "registro de auditoría dejaría de ser atribuible."
        )


@dataclass
class Identidad:
    etiqueta: str
    autenticada: bool

    @property
    def actor(self) -> str:
        return self.etiqueta if self.autenticada else "anónimo"


def identificar(clave: str | None) -> Identidad | None:
    """Devuelve la identidad, o None si la clave es inválida.

    En desarrollo sin claves configuradas, admite acceso anónimo para que el
    servicio sea utilizable en local sin ceremonia.
    """
    registradas = _claves()
    if not registradas:
        return None if es_produccion() else Identidad("dev-anónimo", False)
    if not clave:
        return None
    digest = hashlib.sha256(clave.encode()).hexdigest()
    # Comparación en tiempo constante contra cada clave registrada.
    for esperado, etiqueta in registradas.items():
        if hmac.compare_digest(digest, esperado):
            return Identidad(etiqueta, True)
    return None


_peticiones: dict[str, deque[float]] = defaultdict(deque)


def dentro_de_limite(actor: str, ahora: float | None = None) -> tuple[bool, int]:
    """Ventana deslizante en memoria. Devuelve (admitida, restantes).

    En memoria significa por proceso: con varias réplicas el límite efectivo se
    multiplica por el número de instancias. Suficiente para un despliegue de una
    sola réplica; con más de una hay que mover el contador a Redis.
    """
    t = ahora if ahora is not None else time.monotonic()
    cola = _peticiones[actor]
    while cola and t - cola[0] > VENTANA_S:
        cola.popleft()
    if len(cola) >= LIMITE_POR_VENTANA:
        return False, 0
    cola.append(t)
    return True, LIMITE_POR_VENTANA - len(cola)


def reiniciar() -> None:
    _peticiones.clear()
