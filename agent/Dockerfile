# Imagen del Pay Transparency Compliance Agent.
# Se construye desde la RAÍZ del repositorio, no desde agent/, porque el
# servicio necesita corpus/ para arrancar:
#     docker build -f agent/Dockerfile -t pta:0.1.0 .
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1
WORKDIR /app

COPY agent/requirements.txt agent/requirements.txt
RUN pip install --no-cache-dir -r agent/requirements.txt

COPY corpus/ corpus/
COPY agent/ agent/

# El log de auditoría necesita volumen persistente: si vive en la capa del
# contenedor, la cadena se pierde en cada despliegue y el registro del art. 12
# del Reglamento (UE) 2024/1689 deja de servir para nada.
ENV PTA_AUDIT_LOG=/var/lib/pta/audit.jsonl
VOLUME ["/var/lib/pta"]

RUN useradd -m -u 10001 pta && mkdir -p /var/lib/pta && chown -R pta /var/lib/pta
USER pta

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD python -c "import urllib.request;urllib.request.urlopen('http://localhost:8080/health')"

CMD ["python", "-m", "uvicorn", "agent.api:app", "--host", "0.0.0.0", "--port", "8080"]
