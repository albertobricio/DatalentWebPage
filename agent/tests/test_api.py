"""Tests del servicio HTTP y del registro de auditoría.

Con TestClient, sin levantar servidor. La API es determinista salvo el endpoint
del asistente, que se comprueba únicamente en su modo degradado.
"""
from __future__ import annotations

import os
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

# Aislar el log de auditoría antes de importar la app.
_tmp = tempfile.mkdtemp()
os.environ["PTA_AUDIT_LOG"] = str(Path(_tmp) / "audit.jsonl")
os.environ["PTA_API_KEYS"] = "acme:clave-de-prueba-acme"
os.environ.pop("PTA_ENV", None)

from fastapi.testclient import TestClient  # noqa: E402

from api import app  # noqa: E402
from pta import audit  # noqa: E402

c = TestClient(app, raise_server_exceptions=False,
               headers={"X-API-Key": "clave-de-prueba-acme"})
sin_clave = TestClient(app, raise_server_exceptions=False)

OFERTA_MALA = ("Buscamos un Ingeniero ambicioso, recién titulado, con plena "
               "disponibilidad. Indícanos tus pretensiones económicas.")
OFERTA_BUENA = ("Buscamos una persona candidata para Ingeniero/a de Software. "
                "Banda retributiva: 38.000 - 46.000 € brutos anuales. "
                "Valoramos colaboración y escucha.")


def test_health_declara_lo_que_esta_degradado():
    r = c.get("/health")
    assert r.status_code == 200
    d = r.json()
    assert d["estrategia"] == "corpus-en-prompt"
    assert d["instrumentos"] >= 10
    assert d["articulos_verificados"] >= 60
    if not d["credenciales"]:
        assert "/v1/chat:query" in d["endpoints_degradados"], \
            "sin credenciales, health debe decir qué endpoint no responde"


def test_analiza_oferta_problematica():
    r = c.post("/v1/job-postings:analyze", json={"texto": OFERTA_MALA})
    assert r.status_code == 200
    d = r.json()
    assert d["nivel"] in ("MEDIO", "ALTO")
    assert not d["banda_declarada"]
    codigos = {h["codigo"] for h in d["hallazgos"]}
    assert "C1_SIN_BANDA" in codigos and "C2_HISTORIAL_RETRIBUTIVO" in codigos


def test_oferta_correcta_sale_con_riesgo_bajo():
    d = c.post("/v1/job-postings:analyze", json={"texto": OFERTA_BUENA}).json()
    assert d["banda_declarada"] and d["nivel"] == "BAJO", d


def test_la_respuesta_lleva_el_aviso_de_no_transposicion():
    d = c.post("/v1/job-postings:analyze", json={"texto": OFERTA_MALA}).json()
    assert "no está transpuesta" in d["aviso"]
    assert "no afirma intención" in d["aviso"] or "efecto potencial" in d["aviso"]


def test_texto_demasiado_corto_se_rechaza():
    assert c.post("/v1/job-postings:analyze", json={"texto": "hola"}).status_code == 422


def test_guard_como_servicio():
    d = c.post("/v1/guard:check", json={
        "texto": "[[UE-DIR-2023-970 art. 5|VIGENTE]] le obliga desde ya."}).json()
    assert not d["apto"]
    assert any(h["codigo"] == "G4_ESTADO_INCORRECTO" for h in d["hallazgos"])


def test_chat_degrada_con_mensaje_util():
    r = c.post("/v1/chat:query", json={"pregunta": "¿Debo publicar la banda?"})
    if r.status_code == 503:
        assert "ANTHROPIC_API_KEY" in r.json()["detail"]
        assert "resto de endpoints funciona" in r.json()["detail"]
    else:
        assert r.status_code == 200 and "respuesta" in r.json()


def test_cada_peticion_v1_deja_rastro():
    antes = len(audit.por_defecto().entradas())
    c.post("/v1/job-postings:analyze", json={"texto": OFERTA_BUENA})
    assert len(audit.por_defecto().entradas()) == antes + 1


def test_cadena_de_auditoria_integra():
    c.post("/v1/job-postings:analyze", json={"texto": OFERTA_BUENA})
    d = c.get("/v1/audit:verify").json()
    assert d["integra"], d["motivo"]


def test_la_manipulacion_del_log_se_detecta():
    reg = audit.Registro(Path(_tmp) / "manipulado.jsonl")
    reg.anotar("analisis", "ana", riesgo=20)
    reg.anotar("analisis", "ana", riesgo=80)
    reg.anotar("analisis", "ana", riesgo=15)
    assert reg.verificar()[0]

    lineas = reg.path.read_text(encoding="utf-8").splitlines()
    lineas[1] = lineas[1].replace('"riesgo": 80', '"riesgo": 10')
    reg.path.write_text("\n".join(lineas) + "\n", encoding="utf-8")

    integra, motivo = reg.verificar()
    assert not integra, "editar una entrada debe romper la cadena"
    assert "entrada 2" in motivo, motivo


def test_sin_clave_no_se_pasa():
    r = sin_clave.post("/v1/job-postings:analyze", json={"texto": OFERTA_BUENA})
    assert r.status_code == 401
    assert "X-API-Key" in r.json()["detail"]


def test_clave_invalida_no_se_pasa():
    r = TestClient(app, raise_server_exceptions=False,
                   headers={"X-API-Key": "no-soy-una-clave"}).post(
        "/v1/job-postings:analyze", json={"texto": OFERTA_BUENA})
    assert r.status_code == 401


def test_health_queda_abierto_para_el_healthcheck():
    assert sin_clave.get("/health").status_code == 200


def test_el_rastro_registra_la_etiqueta_no_la_ip():
    from pta import auth as _auth
    _auth.reiniciar()
    c.post("/v1/job-postings:analyze", json={"texto": OFERTA_BUENA})
    ultima = audit.por_defecto().entradas()[-1]
    assert ultima["actor"] == "acme", ultima


def test_produccion_sin_claves_no_arranca():
    from pta import auth as _auth
    os.environ["PTA_ENV"] = "production"
    guardadas = os.environ.pop("PTA_API_KEYS")
    try:
        try:
            _auth.comprobar_arranque()
            raise AssertionError("debería haber fallado el arranque")
        except RuntimeError as e:
            assert "PTA_API_KEYS" in str(e)
    finally:
        os.environ["PTA_API_KEYS"] = guardadas
        os.environ.pop("PTA_ENV", None)


def test_limite_de_peticiones():
    from pta import auth as _auth
    _auth.reiniciar()
    for _ in range(_auth.LIMITE_POR_VENTANA):
        assert _auth.dentro_de_limite("acme")[0]
    admitida, restantes = _auth.dentro_de_limite("acme")
    assert not admitida and restantes == 0
    _auth.reiniciar()


def test_openapi_se_genera():
    d = c.get("/openapi.json").json()
    assert "/v1/job-postings:analyze" in d["paths"]
    assert d["info"]["version"]


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
