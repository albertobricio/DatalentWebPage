"""Registro de auditoría con hash encadenado.

Cubre el art. 12 del Reglamento (UE) 2024/1689, que obliga a los sistemas de IA
de alto riesgo a registrar automáticamente los acontecimientos durante su ciclo
de vida.

Append-only. Cada entrada incluye el hash de la anterior, de modo que alterar
un registro invalida toda la cadena posterior y `verificar()` lo detecta. No es
criptografía fuerte contra un atacante con acceso de escritura al fichero
completo, que podría recalcular la cadena entera: es integridad frente a la
edición puntual, que es el escenario realista en una inspección.

[VALIDATE: para producción, sellar periódicamente el último hash en
 almacenamiento WORM o en un servicio de timestamping. Sin ese anclaje externo
 la cadena es reconstruible.]
"""
from __future__ import annotations

import hashlib
import json
import os
import threading
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

GENESIS = "0" * 64
_lock = threading.Lock()


def _hash(payload: str, previo: str) -> str:
    return hashlib.sha256(f"{previo}{payload}".encode()).hexdigest()


@dataclass
class Registro:
    path: Path

    def __post_init__(self) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)

    def _ultimo_hash(self) -> str:
        if not self.path.exists():
            return GENESIS
        ultimo = GENESIS
        with self.path.open(encoding="utf-8") as f:
            for linea in f:
                if linea.strip():
                    ultimo = json.loads(linea)["hash"]
        return ultimo

    def anotar(self, accion: str, actor: str, **datos) -> dict:
        """Añade una entrada. Nunca modifica ni borra las anteriores."""
        with _lock:
            previo = self._ultimo_hash()
            cuerpo = {
                "ts": datetime.now(timezone.utc).isoformat(timespec="milliseconds"),
                "accion": accion,
                "actor": actor,
                "datos": datos,
                "previo": previo,
            }
            payload = json.dumps(cuerpo, ensure_ascii=False, sort_keys=True)
            entrada = {**cuerpo, "hash": _hash(payload, previo)}
            with self.path.open("a", encoding="utf-8") as f:
                f.write(json.dumps(entrada, ensure_ascii=False) + "\n")
            return entrada

    def entradas(self) -> list[dict]:
        if not self.path.exists():
            return []
        return [json.loads(l) for l in self.path.read_text(encoding="utf-8").splitlines() if l.strip()]

    def verificar(self) -> tuple[bool, str]:
        """Recorre la cadena. Devuelve (íntegra, motivo)."""
        previo = GENESIS
        for i, e in enumerate(self.entradas(), 1):
            if e["previo"] != previo:
                return False, f"entrada {i}: rompe el encadenamiento"
            cuerpo = {k: e[k] for k in ("ts", "accion", "actor", "datos", "previo")}
            payload = json.dumps(cuerpo, ensure_ascii=False, sort_keys=True)
            if _hash(payload, previo) != e["hash"]:
                return False, f"entrada {i}: contenido alterado"
            previo = e["hash"]
        return True, f"cadena íntegra, {len(self.entradas())} entradas"


def por_defecto() -> Registro:
    ruta = os.environ.get("PTA_AUDIT_LOG")
    return Registro(Path(ruta) if ruta else Path(__file__).resolve().parents[1] / "var" / "audit.jsonl")
