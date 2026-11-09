"""Servicio HTTP del Pay Transparency Compliance Agent.

    uvicorn agent.api:app --reload --port 8080
    http://localhost:8080/docs

Qué funciona sin credenciales y qué no, dicho sin ambigüedad:

  /health                     siempre
  /v1/job-postings:analyze    siempre. Capa determinista completa
  /v1/guard:check             siempre. Útil para enganchar en CI
  /v1/audit:verify            siempre
  /v1/chat:query              503 sin ANTHROPIC_API_KEY

Todos los /v1/ exigen cabecera X-API-Key contra PTA_API_KEYS. Con PTA_ENV=production
y sin claves configuradas, el servicio NO arranca.

No hay multi-tenant. No es un descuido: fingir aislamiento es peor que no
tenerlo. Entra en fase 2, con `tenant_id` y RLS desde el esquema de datos.
"""
from __future__ import annotations

import os
import sys
import time
import uuid
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from fastapi import FastAPI, HTTPException, Request  # noqa: E402
from fastapi.responses import JSONResponse  # noqa: E402
from pydantic import BaseModel, Field  # noqa: E402

from pta import audit, auth, corpus as corpus_mod, guard, ofertas, prompts, registry  # noqa: E402

auth.comprobar_arranque()

VERSION = "0.1.0"

app = FastAPI(
    title="Pay Transparency Compliance Agent",
    version=VERSION,
    description=(
        "Análisis de cumplimiento en transparencia retributiva sobre corpus "
        "normativo verificado. Toda cita normativa se resuelve contra un "
        "registro de artículos verificados; las que no resuelven se rechazan."
    ),
)

LOG = audit.por_defecto()


def _hay_credenciales() -> bool:
    return bool(os.environ.get("ANTHROPIC_API_KEY")) or \
        (Path.home() / ".config" / "anthropic").exists()


@app.middleware("http")
async def puerta(request: Request, call_next):
    """Autenticación, límite de peticiones y rastro.

    El rastro registra la ETIQUETA de la clave, no la clave ni la IP a secas:
    el art. 12 del Reglamento (UE) 2024/1689 pide un registro atribuible, y la
    IP de un proxy no atribuye nada.
    """
    rid = str(uuid.uuid4())
    t0 = time.perf_counter()
    protegida = request.url.path.startswith("/v1/")

    identidad = None
    if protegida:
        identidad = auth.identificar(request.headers.get("X-API-Key"))
        if identidad is None:
            LOG.anotar("rechazo_auth", actor="desconocido", request_id=rid,
                       ruta=request.url.path)
            return JSONResponse(
                status_code=401,
                content={"detail": "Clave de API ausente o inválida. Envíala en "
                                   "la cabecera X-API-Key."},
                headers={"X-Request-Id": rid})

        admitida, restantes = auth.dentro_de_limite(identidad.actor)
        if not admitida:
            LOG.anotar("rechazo_limite", actor=identidad.actor, request_id=rid,
                       ruta=request.url.path)
            return JSONResponse(
                status_code=429,
                content={"detail": f"Límite de {auth.LIMITE_POR_VENTANA} peticiones "
                                   f"por {auth.VENTANA_S}s superado."},
                headers={"X-Request-Id": rid, "Retry-After": str(auth.VENTANA_S)})
        request.state.restantes = restantes

    respuesta = await call_next(request)
    ms = round((time.perf_counter() - t0) * 1000, 1)
    if protegida:
        LOG.anotar("http", actor=identidad.actor, request_id=rid,
                   metodo=request.method, ruta=request.url.path,
                   estado=respuesta.status_code, ms=ms)
        respuesta.headers["X-RateLimit-Remaining"] = str(getattr(request.state, "restantes", 0))
    respuesta.headers["X-Request-Id"] = rid
    return respuesta


# --------------------------------------------------------------------------- health

class Salud(BaseModel):
    version: str
    prompt: str
    corpus_documentos: int
    corpus_tokens_aprox: int
    estrategia: str
    instrumentos: int
    articulos_verificados: int
    credenciales: bool
    autenticacion: str
    endpoints_degradados: list[str]


@app.get("/health", response_model=Salud, tags=["operación"])
def health() -> Salud:
    c = corpus_mod.cargar()
    reg = registry.cargar()
    creds = _hay_credenciales()
    return Salud(
        version=VERSION,
        prompt=prompts.VERSION,
        corpus_documentos=len(c.documentos),
        corpus_tokens_aprox=c.tokens_aprox,
        estrategia="rag" if c.necesita_rag else "corpus-en-prompt",
        instrumentos=len(reg),
        articulos_verificados=sum(len(i.articulos) for i in reg.values()),
        credenciales=creds,
        autenticacion=("clave-api" if os.environ.get("PTA_API_KEYS")
                       else "ABIERTA (solo desarrollo)"),
        endpoints_degradados=[] if creds else ["/v1/chat:query"],
    )


# --------------------------------------------------------------------------- ofertas

class OfertaIn(BaseModel):
    texto: str = Field(min_length=20, description="Texto íntegro de la oferta de empleo")


class HallazgoOut(BaseModel):
    eje: str
    codigo: str
    titulo: str
    fragmento: str
    mecanismo: str
    base: str
    confianza: str


class OfertaOut(BaseModel):
    riesgo: int
    nivel: str
    banda_declarada: bool
    hallazgos: list[HallazgoOut]
    a_revision_humana: list[str] = Field(
        description="Códigos con confianza BAJA. No se incluyen en el informe al "
                    "cliente: un falso positivo erosiona la confianza en los verdaderos.")
    aviso: str


@app.post("/v1/job-postings:analyze", response_model=OfertaOut, tags=["ofertas"])
def analizar_oferta(body: OfertaIn) -> OfertaOut:
    a = ofertas.analizar(body.texto)
    return OfertaOut(
        riesgo=a.riesgo, nivel=a.nivel, banda_declarada=a.banda_declarada,
        hallazgos=[HallazgoOut(**{k: getattr(h, k) for k in
                                  ("eje", "codigo", "titulo", "fragmento",
                                   "mecanismo", "base", "confianza")})
                   for h in a.hallazgos],
        a_revision_humana=[h.codigo for h in a.revisables],
        aviso=("Análisis determinista. No constituye asesoramiento jurídico y no "
               "afirma intención discriminatoria: describe efecto potencial. La "
               "Directiva (UE) 2023/970 no está transpuesta en España, de modo que "
               "los hallazgos marcados INTERPRETATIVO no son incumplimientos."),
    )


# --------------------------------------------------------------------------- guardia

class GuardIn(BaseModel):
    texto: str
    jurisdiccion: str = "ES"


class GuardOut(BaseModel):
    apto: bool
    citas: list[str]
    hallazgos: list[dict]


@app.post("/v1/guard:check", response_model=GuardOut, tags=["gobernanza"])
def comprobar(body: GuardIn) -> GuardOut:
    r = guard.revisar(body.texto, body.jurisdiccion)
    return GuardOut(
        apto=r.apto,
        citas=[f"{ref} art. {art} ({est})" for ref, art, est in r.citas],
        hallazgos=[{"codigo": h.codigo, "nivel": h.nivel, "mensaje": h.mensaje,
                    "fragmento": h.fragmento} for h in r.hallazgos],
    )


# --------------------------------------------------------------------------- chat

class ChatIn(BaseModel):
    pregunta: str = Field(min_length=5)
    jurisdiccion: str = "ES"


class ChatOut(BaseModel):
    respuesta: str
    apto: bool
    intentos: int
    citas: list[str]
    uso: dict


@app.post("/v1/chat:query", response_model=ChatOut, tags=["asistente"])
def consultar(body: ChatIn) -> ChatOut:
    if not _hay_credenciales():
        raise HTTPException(
            503,
            "El asistente normativo requiere credenciales del proveedor de modelo. "
            "Define ANTHROPIC_API_KEY o autentica con `ant auth login`. El resto "
            "de endpoints funciona sin ellas.")
    from pta.assistant import preguntar
    r = preguntar(body.pregunta, body.jurisdiccion)
    return ChatOut(
        respuesta=r.texto, apto=r.apto, intentos=r.intentos,
        citas=[f"{ref} art. {art} ({est})" for ref, art, est in r.revision.citas],
        uso=r.uso)


# --------------------------------------------------------------------------- auditoría

@app.get("/v1/audit:verify", tags=["gobernanza"])
def verificar_auditoria() -> dict:
    integra, motivo = LOG.verificar()
    return {"integra": integra, "motivo": motivo}


@app.exception_handler(Exception)
async def error_no_controlado(request: Request, exc: Exception) -> JSONResponse:
    LOG.anotar("error", actor="sistema", ruta=request.url.path, tipo=type(exc).__name__)
    return JSONResponse(500, content={"detail": "error interno"})
