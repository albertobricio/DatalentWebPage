# Pay Transparency Compliance Agent

## Documento de Arquitectura Empresarial

| | |
|---|---|
| **Versión** | 1.0 (borrador de arquitectura) |
| **Fecha** | 2026-07-29 |
| **Autor** | Datalent Solutions, práctica de Agentic AI + AI Governance |
| **Estado** | Diseño de referencia. No implementado. Todas las cifras de rendimiento y coste son objetivos de diseño, no mediciones. |
| **Áreas de práctica** | Agentic AI, AI Governance, Compensation & Benefits, People Analytics |
| **Clasificación EU AI Act (preliminar)** | Alto riesgo, Anexo III.4(b) para los componentes que emiten recomendaciones sobre retribución individual. Ver sección 10.2. |

> **Advertencia de uso.** Este documento describe cómo construir un sistema. No es asesoramiento jurídico y no sustituye a la validación por asesoría laboral de cada jurisdicción. Cada afirmación normativa incluye el artículo de origen; cada dato no verificado aparece marcado como `[VALIDATE: ...]` conforme a la política de no fabricación de Datalent.

---

## Índice

1. [Arquitectura general](#1-arquitectura-general)
2. [Arquitectura agéntica](#2-arquitectura-agéntica)
3. [Flujo de razonamiento](#3-flujo-de-razonamiento)
4. [Herramientas MCP](#4-herramientas-mcp)
5. [Base documental (RAG)](#5-base-documental-rag)
6. [Tipos de documento soportados](#6-tipos-de-documento-soportados)
7. [Capacidades analíticas](#7-capacidades-analíticas)
8. [Prompts internos](#8-prompts-internos)
9. [Memoria](#9-memoria)
10. [Seguridad y gobernanza](#10-seguridad-y-gobernanza)
11. [Observabilidad](#11-observabilidad)
12. [Roadmap de desarrollo](#12-roadmap-de-desarrollo)
13. [Stack tecnológico](#13-stack-tecnológico)
14. [Escalabilidad](#14-escalabilidad)
15. [Diseño SaaS](#15-diseño-saas)

---

## 0. Marco normativo y principio rector del diseño

### 0.1 Qué obliga la Directiva (UE) 2023/970

El plazo de transposición venció el **7 de junio de 2026**. Las obligaciones que el agente debe saber verificar (numeración verificada contra el espejo del BOE, ver [`corpus/global/ue/directiva-2023-970-indice.md`](../corpus/global/ue/directiva-2023-970-indice.md)):

| Artículo | Obligación | Implicación de producto |
|---|---|---|
| Art. 4 | Mismo trabajo y trabajo de igual valor definidos con criterios objetivos y neutros en cuanto al género: competencias, esfuerzo, responsabilidad y condiciones de trabajo | El agente necesita un motor de valoración de puestos, no solo comparación por título |
| Art. 5 | Transparencia previa al empleo: banda retributiva inicial comunicada antes de la entrevista; prohibición de preguntar por el historial retributivo | Analizador de ofertas de empleo |
| Art. 6 | Publicidad interna de los criterios de fijación y progresión salarial | Auditor de políticas internas |
| Art. 7 | Derecho del trabajador a conocer su nivel retributivo y los niveles medios desglosados por sexo para su categoría | Generador de respuestas individuales con control de k-anonimato |
| Art. 9 | Informe de brecha retributiva con siete métricas obligatorias | Motor analítico y generador de informes |
| Art. 10 | **Evaluación retributiva conjunta** cuando la brecha en una categoría supera el **5%**, no está justificada por criterios objetivos y neutros y no se corrige en seis meses | Motor de detección de disparadores y plan de acción |
| Art. 11 | Apoyo a los empleadores con plantilla inferior a 250 trabajadores | Segmentación de producto por tamaño |
| Art. 13 | Diálogo social | Trazabilidad y paquete documental para comité |
| Art. 16 | Derecho a indemnización | Cuantificación de exposición |
| Art. 18 | **Inversión de la carga de la prueba**: corresponde al empleador demostrar que no hubo discriminación | Es el argumento comercial central: sin evidencia documentada y trazable, el empleador pierde |
| Art. 23 | Sanciones | Cuantificación de exposición |
| Art. 29 | Seguimiento y sensibilización. Designación del organismo de seguimiento | Exportadores por jurisdicción |

Las siete métricas del art. 9.1, verificadas literalmente y en su orden legal. El entregable debe respetar esta letra y este orden, porque es como el organismo de seguimiento espera recibirlo:

| Letra | Métrica |
|---|---|
| a) | La brecha retributiva de género |
| b) | La brecha retributiva de género en los componentes complementarios o variables |
| c) | La brecha retributiva de género mediana |
| d) | La brecha retributiva de género mediana en los componentes complementarios o variables |
| e) | La proporción de trabajadoras y de trabajadores que reciben componentes complementarios o variables |
| f) | La proporción de trabajadoras y de trabajadores en cada cuartil de la banda retributiva |
| g) | La brecha retributiva de género, por categorías de trabajadores, desglosada por salario o sueldo base ordinario y por componentes complementarios o variables |

El orden legal alterna media y variables antes de pasar a la mediana. Una versión anterior de este documento las agrupaba como dos medias seguidas de dos medianas, lo cual es indiferente para el cálculo y no lo es para el entregable.

Calendario de reporte según plantilla (art. 9). Contrastar con la norma nacional de transposición antes de aplicarlo a un cliente concreto:

| Plantilla | Frecuencia | Primer informe |
|---|---|---|
| ≥ 250 | Anual | 7 de junio de 2027 |
| 150 a 249 | Trienal | 7 de junio de 2027 |
| 100 a 149 | Trienal | 7 de junio de 2031 |
| < 100 | Voluntaria salvo que el Estado miembro amplíe el ámbito | Según norma nacional |

### 0.1 bis Estado de la transposición: el modelo de tres estados

**Resuelto el 2026-07-29. España no ha transpuesto la Directiva.** El plazo venció el 7 de junio de 2026 y no hay norma publicada en el BOE. El instrumento previsto es un real decreto que modifica el RD 902/2020, en mesa de diálogo social, con objetivo declarado de aprobación en septiembre de 2026. Detalle, cronología y fuentes en [`corpus/es/MANIFEST.md`](../corpus/es/MANIFEST.md).

Esto invalida una premisa que estaba implícita en el diseño original: que los artículos de la Directiva son exigibles a un empleador privado español. No lo son. Una directiva no transpuesta carece de efecto directo horizontal entre particulares, aunque sí puede invocarse verticalmente frente al sector público, y los tribunales aplican interpretación conforme del Derecho interno a la luz de la directiva.

El motor de cumplimiento incorpora en consecuencia **tres estados por regla**, y el agente se comporta de forma distinta en cada uno:

| Estado | Qué es | Qué produce el agente |
|---|---|---|
| `VIGENTE` | Norma nacional en vigor | Hallazgo de incumplimiento, con sanción prevista |
| `INTERPRETATIVO` | Norma UE no transpuesta | Riesgo interpretativo. **Nunca hallazgo de incumplimiento** |
| `PREVISTO` | Borrador en tramitación | Riesgo de preparación, con horizonte temporal |

Emitir un hallazgo de incumplimiento contra un artículo en estado `INTERPRETATIVO` es el error más caro que el sistema puede cometer: destruye la confianza del cliente en todo lo demás que diga el informe. El agente QA lo bloquea de forma determinista.

**Dos consecuencias comerciales que el diseño original no capturaba.** La primera: el borrador español fija dos meses para el plan correctivo cuando la brecha supera el 5%, frente a los seis meses del art. 11 de la Directiva. Un cliente que haya planificado con el calendario europeo va con retraso desde el primer día. La segunda: España ya tiene desde 2020 un régimen exigente de registro y auditoría retributiva, de modo que el cliente bien gestionado no parte de cero sino de un cumplimiento que se le queda corto. Es un mensaje más creíble que la alarma de tabla rasa, y más fácil de vender.

`[VALIDATE: contraste del contenido del borrador contra el texto oficial del portal de participación pública del Ministerio de Trabajo. Lo recogido en el manifiesto procede de prensa especializada y está marcado como PENDIENTE_VERIFICACION.]`

### 0.2 El principio rector: el sistema no decide sobre personas

Esta es la decisión arquitectónica de la que dependen todas las demás.

El agente **nunca fija, ajusta ni aprueba la retribución de una persona identificada**. Produce diagnóstico, evidencia, cuantificación de riesgo y propuestas de acción. La decisión retributiva la toma un humano identificado, que firma, y cuya firma queda registrada.

Motivo doble:

- **Art. 22 RGPD.** Una decisión basada únicamente en tratamiento automatizado que produce efectos jurídicos o significativos sobre una persona requiere intervención humana significativa. La retribución encaja de lleno.
- **Anexo III.4(b) del Reglamento (UE) 2024/1689 (AI Act).** Los sistemas destinados a tomar decisiones que afecten a las condiciones de la relación laboral, incluida la retribución, son de alto riesgo. Mantener al humano como decisor no elimina la clasificación de alto riesgo del sistema de apoyo, pero delimita el ámbito de las obligaciones y hace defendible el diseño ante inspección.

Traducción operativa: cada salida del sistema que toque a una persona identificable pasa por un punto de control humano nominal, con registro de quién revisó, cuándo, qué vio y qué decidió. Ese registro es el producto, tanto como el informe.

---

## 1. Arquitectura general

### 1.1 Visión de capas

```
┌────────────────────────────────────────────────────────────────────────────┐
│  CAPA 1 · EXPERIENCIA                                                      │
│                                                                            │
│   Web App (Angular 20)        API pública REST/GraphQL      SDK Python/TS  │
│   ├ Consola de auditoría      ├ /v1/job-postings:analyze    ├ Cliente      │
│   ├ Analizador de ofertas     ├ /v1/pay-audit:run           │  tipado      │
│   ├ Explorador de bandas      ├ /v1/compliance:score        ├ Webhooks     │
│   ├ Chat consultivo           ├ /v1/action-plan             └ Reintentos   │
│   ├ Panel de plan de acción   └ /v1/evidence/{id}                          │
│   └ Centro de evidencias                                                   │
└──────────────────────────────────┬─────────────────────────────────────────┘
                                   │  OIDC / SAML · mTLS · JWT con tenant_id
┌──────────────────────────────────▼─────────────────────────────────────────┐
│  CAPA 2 · BORDE Y CONTROL DE ACCESO                                        │
│                                                                            │
│   API Gateway  →  AuthN (Keycloak)  →  AuthZ (OPA/Cedar, RBAC+ABAC)        │
│                →  Rate limit por tenant  →  Cuota de tokens por plan       │
│                →  Redacción de PII de entrada  →  Registro de auditoría    │
└──────────────────────────────────┬─────────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────────┐
│  CAPA 3 · SERVICIOS DE APLICACIÓN (Python 3.12 / FastAPI)                  │
│                                                                            │
│  ┌───────────────┐ ┌──────────────┐ ┌─────────────┐ ┌───────────────────┐  │
│  │ Ingesta y     │ │ Motor        │ │ Registro de │ │ Servicio de       │  │
│  │ normalización │ │ analítico    │ │ evidencias  │ │ plan de acción    │  │
│  │ documental    │ │ (pandas,     │ │ (WORM,      │ │ (tareas, SLA,     │  │
│  │ (OCR, ETL)    │ │ statsmodels) │ │  hash-chain)│ │  responsables)    │  │
│  └───────────────┘ └──────────────┘ └─────────────┘ └───────────────────┘  │
└──────────────────────────────────┬─────────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────────┐
│  CAPA 4 · NÚCLEO AGÉNTICO                                                  │
│                                                                            │
│        ┌──────────────────────────────────────────────────┐                │
│        │            ORQUESTADOR (claude-opus-5)           │                │
│        │  Planifica · delega · consolida · escala         │                │
│        └───┬──────────────────────────────────────────┬───┘                │
│            │                                          │                    │
│   ┌────────▼────────┐                        ┌────────▼────────┐           │
│   │  9 subagentes   │  ←── bucle crítico ──→ │  Critic + QA    │           │
│   │  especializados │                        │  (verificación) │           │
│   └────────┬────────┘                        └─────────────────┘           │
│            │                                                               │
│   ┌────────▼───────────────────────────────────────────────────┐           │
│   │  Capa de herramientas: MCP · RAG · calculadoras · export   │           │
│   └────────────────────────────────────────────────────────────┘           │
└──────────────────────────────────┬─────────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────────┐
│  CAPA 5 · MODELO Y CONOCIMIENTO                                            │
│                                                                            │
│   Claude API (inference_geo="eu")   │   RAG normativo    │   Memoria       │
│   ├ claude-opus-5    razonamiento   │   ├ pgvector       │   ├ corto plazo │
│   ├ claude-sonnet-5  volumen        │   ├ BM25 híbrido   │   ├ largo plazo │
│   └ claude-haiku-4-5 clasificación  │   └ reranker       │   ├ de caso     │
│                                     │                    │   ├ organizativa│
│   Prompt caching · Batch API        │                    │   └ de usuario  │
└──────────────────────────────────┬─────────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────────┐
│  CAPA 6 · DATOS Y PERSISTENCIA (todo en región UE)                         │
│                                                                            │
│   PostgreSQL 16 + RLS   │  pgvector   │  S3/MinIO cifrado  │  Redis        │
│   ├ tenants             │  ├ corpus   │  ├ documentos      │  ├ cache      │
│   ├ empleados (pseudo)  │  │  legal   │  ├ evidencias      │  └ colas      │
│   ├ estructura salarial │  └ políticas│  └ exportaciones   │               │
│   ├ hallazgos                                                              │
│   └ audit_log (WORM, append-only, hash encadenado)                         │
└──────────────────────────────────┬─────────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────────┐
│  CAPA 7 · OBSERVABILIDAD Y PLATAFORMA                                      │
│                                                                            │
│   OpenTelemetry → Tempo/Loki/Prometheus/Grafana  ·  Langfuse (trazas LLM)  │
│   Kubernetes (EKS eu-central-1) · Terraform · ArgoCD · GitHub Actions      │
└────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Decisiones y justificación

**Backend en Python, no en Node.** El corazón del producto no es la orquestación de agentes sino la estadística: regresiones log-lineales con controles, descomposición de brechas, contrastes de significación con corrección por comparaciones múltiples. `statsmodels`, `scipy` y `pandas` no tienen equivalente maduro en el ecosistema JavaScript. Alternativa considerada: NestJS para la API con un servicio Python separado para analítica. Se descarta por la fricción de mantener dos runtimes y dos modelos de dominio para el mismo objeto de negocio. El precio a pagar es un servidor de aplicación menos eficiente en concurrencia pura, que se compensa con workers asíncronos y con el hecho de que la latencia dominante es la del modelo, no la del framework.

**Frontend en Angular 20.** Coherencia con el stack ya operativo de Datalent (el sitio corporativo es Angular), reutilización del sistema de diseño y de la experiencia del equipo. Alternativa: Next.js, con mejor ecosistema de componentes y SSR más simple. Se elige Angular porque el producto es una consola interna de alta densidad de datos donde el SSR aporta poco, y donde la inyección de dependencias y los formularios reactivos de Angular encajan mejor con formularios de auditoría complejos.

**Residencia de datos e inferencia en la UE.** Este no es un detalle de infraestructura sino el argumento competitivo frente a Workday, Visier y Mercer. Tres opciones ordenadas por preferencia:

| Opción | Ventaja | Inconveniente | Recomendación |
|---|---|---|---|
| Claude API con `inference_geo="eu"` | Paridad completa de funcionalidad, mismo día de disponibilidad de features | Requiere verificar la garantía contractual de residencia por escrito | **Recomendada para fases 1 a 3** |
| Amazon Bedrock en `eu-central-1` | Contrato AWS ya existente en muchos clientes, DPA conocido | Subconjunto de features: sin Batch API, sin web search, sin Files API, sin Managed Agents | Alternativa para clientes con exigencia de proveedor único |
| Nube soberana europea + modelo alojado | Máxima defensa ante el sector público | Coste, y renuncia a la capacidad de frontera | Solo si un contrato lo exige |

Elegir Bedrock elimina el Batch API, que es precisamente donde está el 50% de ahorro en el análisis masivo de ofertas de empleo. Conviene documentar ese coste ante el cliente en lugar de asumirlo en silencio.

**Multi-tenant desde el primer día.** Postgres con Row Level Security y `tenant_id` obligatorio en cada tabla. Reconvertir un sistema mono-tenant a multi-tenant es una reescritura; lo contrario es solo configuración. Detalle en la sección 15.

---

## 2. Arquitectura agéntica

### 2.1 Qué hace agéntico a este sistema

Conviene ser preciso, porque la palabra está devaluada. Este sistema es agéntico porque, ante una instrucción como "audita la estructura retributiva del área comercial", planifica una secuencia de pasos que no estaba predefinida, elige qué herramientas invocar según lo que va encontrando, decide autónomamente si necesita profundizar en una categoría concreta, y escala a un humano cuando cruza un umbral definido. No es agéntico el analizador de ofertas usado de forma aislada: ese es un flujo determinista de una sola pasada, y llamarlo agente sería inflar el vocabulario.

### 2.2 Topología

```
                     ┌───────────────────────────────────┐
                     │         ORCHESTRATOR              │
                     │         claude-opus-5             │
                     │         effort: xhigh             │
                     │                                   │
                     │  · Descompone la petición         │
                     │  · Asigna subagentes              │
                     │  · Consolida hallazgos            │
                     │  · Aplica la política de escalado │
                     └──┬────────────────────────────┬───┘
                        │                            │
          ┌─────────────▼──────────┐      ┌──────────▼─────────────┐
          │       PLANNER          │      │      RISK AGENT        │
          │      claude-opus-5     │      │      claude-opus-5     │
          │  Descompone en tareas  │      │  Puntúa exposición     │
          │  con dependencias y    │      │  legal, económica y    │
          │  criterios de "hecho"  │      │  reputacional          │
          └─────────────┬──────────┘      └──────────┬─────────────┘
                        │                            │
    ┌───────────────────┴────────────────────────────┴──────────────────┐
    │                     SUBAGENTES DE DOMINIO                         │
    │                                                                   │
    │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐               │
    │  │ LEGAL        │ │ COMPLIANCE   │ │ COMPENSATION │               │
    │  │ opus-5       │ │ sonnet-5     │ │ sonnet-5     │               │
    │  │ Interpreta   │ │ Checklist    │ │ Bandas,      │               │
    │  │ norma, cita  │ │ art. por art.│ │ compa-ratio, │               │
    │  │ artículo     │ │ evidencias   │ │ valoración   │               │
    │  └──────────────┘ └──────────────┘ └──────────────┘               │
    │                                                                   │
    │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐               │
    │  │ SALARY       │ │ BIAS         │ │ REPORT       │               │
    │  │ ANALYTICS    │ │ DETECTION    │ │ GENERATOR    │               │
    │  │ sonnet-5     │ │ sonnet-5     │ │ sonnet-5     │               │
    │  │ Ejecuta      │ │ Lenguaje y   │ │ Redacta el   │               │
    │  │ cálculo vía  │ │ sesgo        │ │ entregable   │               │
    │  │ herramienta  │ │ estructural  │ │ desde datos  │               │
    │  └──────────────┘ └──────────────┘ └──────────────┘               │
    └───────────────────────────┬───────────────────────────────────────┘
                                │
              ┌─────────────────▼──────────────────┐
              │        BUCLE DE VERIFICACIÓN       │
              │                                    │
              │   ┌──────────┐      ┌──────────┐   │
              │   │  CRITIC  │ ───→ │    QA    │   │
              │   │  opus-5  │      │ haiku-4-5│   │
              │   │ Refuta   │      │ Formato, │   │
              │   │ hallazgo │      │ citas,   │   │
              │   │ y método │      │ PII, k   │   │
              │   └────┬─────┘      └────┬─────┘   │
              │        │  rechaza        │         │
              │        └────→ reintento ←┘         │
              └─────────────────┬──────────────────┘
                                │  máx. 2 reintentos
              ┌─────────────────▼──────────────────┐
              │   PUNTO DE CONTROL HUMANO          │
              │   Rol: Compensation Lead / DPO     │
              │   Firma nominal registrada         │
              └────────────────────────────────────┘
```

### 2.3 Responsabilidades, límites de autonomía y modelo por subagente

| Agente | Modelo | Effort | Puede hacer solo | Nunca sin humano | Disparador de escalado |
|---|---|---|---|---|---|
| **Orchestrator** | `claude-opus-5` | `xhigh` | Planificar, delegar, consolidar, reintentar, abortar | Publicar cualquier entregable externo | Conflicto irresoluble entre subagentes; presupuesto de tokens agotado |
| **Planner** | `claude-opus-5` | `high` | Descomponer en tareas con dependencias y criterios de finalización | Ampliar el alcance contratado | Datos de entrada insuficientes para el análisis solicitado |
| **Legal Agent** | `claude-opus-5` | `xhigh` | Interpretar norma con cita literal de artículo; señalar conflicto entre norma UE y nacional | Emitir una conclusión jurídica firme sobre un caso litigioso | Ausencia de norma nacional aplicable; jurisprudencia contradictoria en el corpus |
| **Compliance Agent** | `claude-sonnet-5` | `high` | Recorrer el checklist artículo por artículo, marcar cumple / no cumple / evidencia ausente | Declarar cumplimiento pleno sin revisión | Cualquier ítem con evidencia contradictoria |
| **Compensation Agent** | `claude-sonnet-5` | `high` | Analizar bandas, compa-ratio, penetración, solapamiento, valoración de puestos | Proponer un ajuste retributivo individual como acción ejecutable | Banda con solapamiento superior al 50%; puesto sin homólogo válido |
| **Salary Analytics Agent** | `claude-sonnet-5` | `medium` | Invocar el motor de cálculo determinista e interpretar sus salidas | Calcular métricas en su propio contexto | n < 5 en una categoría; regresión con R² por debajo del umbral configurado |
| **Bias Detection Agent** | `claude-sonnet-5` | `high` | Detectar lenguaje sesgado, requisitos con impacto adverso, patrones estructurales | Afirmar intencionalidad discriminatoria | Detección con confianza baja sobre atributo protegido |
| **Risk Agent** | `claude-opus-5` | `high` | Puntuar riesgo legal, económico y reputacional con metodología expuesta | Cuantificar exposición económica sin validación jurídica | Riesgo alto que activa el art. 10 |
| **Report Generator** | `claude-sonnet-5` | `medium` | Redactar el entregable a partir de hallazgos ya verificados | Introducir cifras que no vengan del motor de cálculo | Cualquier hueco de datos detectado en la redacción |
| **Critic Agent** | `claude-opus-5` | `xhigh` | Rechazar un hallazgo y devolverlo con motivo | Aprobar por sí solo el paso a humano de un hallazgo crítico | Segundo rechazo del mismo hallazgo |
| **QA Agent** | `claude-haiku-4-5` | n/a | Validar formato, citas, ausencia de PII, umbral de k-anonimato | Nada más | Cualquier fallo estructural |

**Sobre el reparto de modelos.** El razonamiento jurídico y la crítica van a Opus 5 porque el coste de un error ahí es una conclusión normativa equivocada firmada por un cliente. El análisis de volumen va a Sonnet 5, que en tareas de codificación y agénticas alcanza calidad cercana a Opus a menor coste. La validación estructural va a Haiku 4.5, que es una tarea de clasificación pura. Precios de referencia por millón de tokens (entrada / salida): Opus 5 a 5 / 25 USD, Sonnet 5 a 3 / 15 USD con precio introductorio de 2 / 10 hasta el 31 de agosto de 2026, Haiku 4.5 a 1 / 5 USD.

**Sobre el bucle crítico.** El Critic no es decorativo. En un sistema cuya propuesta de valor es la evidencia defendible ante inspección, un hallazgo mal fundamentado es peor que ningún hallazgo. El Critic recibe el hallazgo con su cadena de evidencia y tiene un único mandato: intentar refutarlo. Dos rechazos consecutivos del mismo hallazgo lo marcan como no concluyente y lo elevan a humano con ambos razonamientos adjuntos.

**Sobre la delegación.** Claude Opus 5 tiende a delegar en subagentes con más facilidad que las generaciones anteriores, lo que multiplica coste y latencia. El prompt del orquestador incluye un techo explícito de subagentes concurrentes y la instrucción de no delegar trabajo que resuelva en pocas llamadas a herramienta. Verificación en el bucle principal, nunca delegada.

---

## 3. Flujo de razonamiento

### 3.1 Flujo completo de una auditoría retributiva

```
[0] ENTRADA
    Usuario: "Audita la estructura retributiva de la filial española, ejercicio 2026"
    Adjuntos: nóminas.xlsx · convenio.pdf · descripciones_puestos.docx · política_comp.pdf
      │
      ▼
[1] ADMISIÓN Y CONTROL PREVIO  ·  determinista, sin modelo
    ├ Autenticación, autorización, resolución de tenant
    ├ Verificación de base jurídica del tratamiento (art. 6 RGPD)
    ├ Comprobación de que existe DPIA vigente para este tenant (art. 35 RGPD)
    ├ Escaneo antivirus y validación de formato
    └ Pseudonimización en ingesta: nombre y DNI → token; se conservan sexo,
      categoría, antigüedad, salario, complementos
      │
      ▼ si falta base jurídica o DPIA → PARADA con explicación
      │
[2] INGESTA Y NORMALIZACIÓN  ·  determinista + haiku-4-5 para clasificación
    ├ Router de formato → parser específico (§6)
    ├ OCR si procede, con umbral de confianza
    ├ Mapeo al esquema canónico de empleado y de estructura salarial
    ├ Perfilado de calidad: nulos, duplicados, outliers imposibles, coherencia
    └ Informe de calidad del dato ANTES de cualquier análisis
      │
      ▼ si la completitud está por debajo del umbral → devuelve qué falta y por qué importa
      │
[3] PLANIFICACIÓN  ·  Planner, opus-5
    Genera un plan explícito con dependencias:
      T1 Valoración de puestos          → sin dependencias
      T2 Análisis de bandas             → depende de T1
      T3 Cálculo de brechas             → depende de T1
      T4 Evaluación de cumplimiento     → depende de T2, T3
      T5 Detección de sesgo estructural → depende de T1, T3
      T6 Puntuación de riesgo           → depende de T4, T5
      T7 Plan de acción                 → depende de T6
      T8 Redacción                      → depende de todas
    El plan se muestra al usuario. Puede editarlo antes de ejecutar.
      │
      ▼
[4] EJECUCIÓN EN PARALELO  ·  subagentes de dominio
    ┌─────────────────────────────────────────────────────────────┐
    │  T1 Compensation Agent                                      │
    │     tool: job_evaluation(criterios art. 4)                  │
    │     → agrupa puestos en categorías de igual valor           │
    │                                                             │
    │  T3 Salary Analytics Agent          [en paralelo con T2]    │
    │     tool: compute_pay_gaps(dataset, categorías)             │
    │     tool: run_adjusted_regression(controles)                │
    │     → NO calcula en su contexto; interpreta la salida       │
    │                                                             │
    │  T5 Bias Detection Agent                                    │
    │     tool: lexical_bias_scan(descripciones)                  │
    │     tool: adverse_impact_test(requisitos, distribución)     │
    └─────────────────────────────────────────────────────────────┘
      │
      ▼
[5] VERIFICACIÓN CRUZADA  ·  Critic, opus-5
    Para cada hallazgo pregunta:
      ¿La cifra procede del motor determinista o el modelo la escribió?
      ¿La categoría tiene n suficiente para el contraste aplicado?
      ¿La cita normativa existe y dice lo que se afirma?
      ¿Existe explicación alternativa no discriminatoria no descartada?
      ¿Se ha corregido por comparaciones múltiples?
      │
      ├── rechaza → devuelve al subagente con motivo (máx. 2 vueltas)
      └── acepta ▼
      │
[6] EVALUACIÓN DE CUMPLIMIENTO  ·  Compliance + Legal
    Recorrido artículo por artículo. Cada ítem produce una tupla:
      (artículo, estado, evidencia_id, confianza, laguna)
    Estados: CUMPLE · NO CUMPLE · EVIDENCIA AUSENTE · NO APLICABLE
      │
      ▼
[7] PUNTUACIÓN DE RIESGO  ·  Risk Agent
    Riesgo legal      = f(incumplimientos, gravedad, sanción prevista)
    Riesgo económico  = f(masa salarial a corregir, retroactividad, litigio)
    Riesgo reputacional = f(obligación de publicación, sector, visibilidad)
    Disparador art. 10: brecha ≥ 5% en categoría, no justificada
      │
      ▼
[8] PLAN DE ACCIÓN  ·  Orchestrator + Compensation
    Prioriza por (impacto × urgencia legal) / esfuerzo
    Cada acción: responsable, plazo, recurso, KPI, criterio de cierre
      │
      ▼
[9] REDACCIÓN  ·  Report Generator
    Rellena la plantilla desde hallazgos verificados.
    Cada cifra lleva referencia a evidence_id. Sin referencia no se escribe.
      │
      ▼
[10] QA FINAL  ·  haiku-4-5, determinista + modelo
    ├ Ninguna cifra sin evidence_id
    ├ Ninguna cita normativa sin artículo verificable en el corpus
    ├ Ninguna categoría publicada con n < k (k configurable, por defecto 5)
    ├ Ningún dato personal directo en el texto
    └ Marcadores [VALIDATE] presentes donde falta verificación
      │
      ▼
[11] PUNTO DE CONTROL HUMANO  ·  obligatorio, no omitible
    El revisor ve: hallazgo · evidencia · método · confianza · objeción del Critic
    Acciones: aprobar · rechazar con motivo · solicitar profundización
    Se registra: quién, cuándo, qué versión, qué decidió, por qué
      │
      ▼
[12] SELLADO Y ENTREGA
    ├ Informe firmado digitalmente
    ├ Paquete de evidencias con hash encadenado
    ├ Registro de decisiones para inspección
    └ Tareas del plan de acción creadas en el sistema del cliente vía MCP
```

### 3.2 Flujo del analizador de ofertas de empleo

Flujo corto, alto volumen, apto para Batch API.

```
Oferta ─→ [Extracción estructurada]  haiku-4-5, output_config.format
              │  título · requisitos · banda declarada · ubicación · lenguaje
              ▼
          [Análisis en paralelo]
          ├─ Bias Detection    lenguaje con connotación de género,
          │                    edadismo, requisitos con impacto adverso
          ├─ Compliance        art. 5: ¿hay banda? ¿antes de entrevista?
          │                    ¿se pregunta historial retributivo?
          └─ Compensation      ¿la banda declarada coincide con la interna?
                               ¿es coherente con la valoración del puesto?
              │
              ▼
          [Puntuación de riesgo 0-100]  Risk Agent
              │  desglosada por dimensión, cada punto con su motivo
              ▼
          [Versión corregida]  Report Generator
              │  reescritura con marcas de cambio y justificación por cambio
              ▼
          [Critic]  ¿la corrección introduce un problema nuevo?
              │
              ▼
          [Salida]  informe · puntuación · versión corregida · fundamento jurídico
```

Con más de 50 ofertas, el flujo se envía por **Batch API** al 50% del precio estándar. El caché de prompt cubre el prompt de sistema y el corpus normativo, que son idénticos entre ofertas.

### 3.3 Estrategia de caché de prompt

El orden de renderizado es `tools` → `system` → `messages`. Todo lo estable va delante.

```
┌─── PREFIJO GLOBAL (idéntico para todos los tenants) ──────── caché 1h ──┐
│  Definiciones de herramientas, ordenadas alfabéticamente y estables     │
│  Prompt de sistema del subagente, congelado por versión                 │
│  Corpus normativo base: Directiva 2023/970, AI Act, RGPD (extractos)    │
└────────────────────────────────────────────────────────────────────────┘
┌─── PREFIJO DE TENANT ──────────────────────────────────────  caché 1h ──┐
│  Convenio colectivo aplicable · política retributiva · glosario interno │
└────────────────────────────────────────────────────────────────────────┘
┌─── PREFIJO DE CASO ────────────────────────────────────────  caché 5m ──┐
│  Resumen del caso · hallazgos previos consolidados                     │
└────────────────────────────────────────────────────────────────────────┘
┌─── VOLÁTIL (sin caché) ────────────────────────────────────────────────┐
│  Pregunta actual · resultados de herramienta de este turno             │
└────────────────────────────────────────────────────────────────────────┘
```

Reglas que el equipo debe respetar bajo revisión de código:

- Nunca interpolar fecha, UUID o identificador de sesión en el prompt de sistema. Un solo byte variable invalida todo lo que va detrás.
- Serialización determinista: `json.dumps(..., sort_keys=True)`, herramientas ordenadas por nombre.
- No cambiar el conjunto de herramientas a mitad de conversación. Si hace falta, usar `defer_loading` con bloques `tool_addition` bajo la beta `mid-conversation-tool-changes-2026-07-01`, que preserva el prefijo cacheado.
- Instrucciones de operador sobrevenidas a mitad de sesión van como mensaje `{"role": "system"}` dentro de `messages`, no editando el `system` de nivel superior. Disponible en Opus 5 sin cabecera beta.
- Mínimo cacheable: 512 tokens en Opus 5, 1024 en Sonnet 5. Verificar `usage.cache_read_input_tokens` en el panel; si sale cero de forma sostenida, hay un invalidador silencioso.

Coste de escritura de caché: 1,25× para TTL de 5 minutos, 2× para TTL de 1 hora. Lectura: 0,1×. El punto de equilibrio son dos peticiones con TTL corto y tres con TTL largo.

---

## 4. Herramientas MCP

### 4.1 Criterio de inclusión

Cada servidor MCP amplía la superficie de ataque y el ámbito de datos personales tratados. Se incluye uno solo si responde a una obligación normativa concreta. Los servidores se agrupan en tres anillos de confianza con políticas de permiso distintas.

```
┌──────────────────────────────────────────────────────────────────────┐
│  ANILLO 1 · SOLO LECTURA, DATO NO PERSONAL       auto-aprobado       │
│  EUR-Lex · BOE · organismos de seguimiento · estadística oficial     │
├──────────────────────────────────────────────────────────────────────┤
│  ANILLO 2 · LECTURA DE DATO PERSONAL             registro obligatorio│
│  HRIS · nómina · SharePoint · Drive · Excel · Power BI               │
├──────────────────────────────────────────────────────────────────────┤
│  ANILLO 3 · ESCRITURA O ACCIÓN EXTERNA           confirmación humana │
│  Jira · Slack · Office 365 · escritura en HRIS · publicación         │
└──────────────────────────────────────────────────────────────────────┘
```

Política de permisos en la definición del agente: `default_config: {permission_policy: {type: "always_allow"}}` para anillo 1, y `{type: "always_ask"}` explícito para cada herramienta del anillo 3.

### 4.2 Catálogo

#### Fuentes normativas (anillo 1)

| Servidor | Para qué sirve | Estado |
|---|---|---|
| **EUR-Lex / CELLAR** | Texto consolidado y vigente de la Directiva 2023/970, el AI Act y el RGPD. Detecta modificaciones y versiones consolidadas. Es el ancla contra la que se valida toda cita normativa. | API pública documentada. `[VALIDATE: existencia de servidor MCP oficial; en su defecto, construir wrapper sobre el web service SPARQL de CELLAR]` |
| **BOE (España)** | Transposición nacional, RD 902/2020, RD 901/2020, convenios colectivos estatales publicados. | API de datos abiertos del BOE. Wrapper MCP propio. |
| **Boletines nacionales UE** | Equivalentes en DE, FR, IT, PT, NL para clientes multipaís. | Construcción propia por país, priorizada por demanda comercial. |
| **Organismos de seguimiento (art. 29)** | Formatos y canales de remisión del informe de brecha por Estado miembro. | `[VALIDATE: designación y API de cada organismo nacional de seguimiento]` |
| **Eurostat / INE** | Referencias macro de brecha sectorial para contextualizar el resultado del cliente. | APIs públicas estables. |

#### Datos de la organización (anillo 2)

| Servidor | Para qué sirve | Nota crítica |
|---|---|---|
| **PostgreSQL** | Acceso al almacén canónico del propio producto. | Conexión con usuario de solo lectura y RLS activo. El agente nunca recibe credenciales de escritura. |
| **Filesystem** | Ficheros del espacio de trabajo de la sesión. | Confinado al directorio de la sesión, con validación de path canónico. |
| **Excel / CSV** | Registro retributivo, nóminas, tablas salariales. Es el formato real en el que llega la mayoría del dato. | Conversión a esquema canónico en ingesta; el agente no trabaja sobre el Excel crudo. |
| **SharePoint / OneDrive** | Políticas retributivas, planes de igualdad, actas de comité. | Alcance restringido a bibliotecas explícitamente autorizadas por el cliente. |
| **Google Drive** | Igual que el anterior, para clientes en Workspace. | Idem. |
| **Power BI** | Métricas de RRHH ya modeladas en el cliente. Evita reconstruir un dataset que ya existe. | Lectura de dataset, no de informe renderizado. |
| **SAP SuccessFactors** | Estructura organizativa, grados, historial retributivo, datos de rendimiento. | API OData. Wrapper MCP propio con mapeo de campos por cliente. |
| **Workday** | Igual. Es el HRIS dominante en gran empresa europea. | API REST/SOAP. Wrapper propio. Ver nota de posicionamiento abajo. |
| **Factorial** | Segmento mediano español. | `[VALIDATE: cobertura de la API pública para datos retributivos y de estructura]` |
| **Cegid / Meta4** | Nómina en España y LatAm. | `[VALIDATE: disponibilidad de API; en muchas instalaciones el acceso real es por exportación de ficheros]` |
| **Cornerstone** | Datos de desempeño y desarrollo, relevantes para justificar diferencias retributivas por criterios objetivos. | `[VALIDATE: cobertura de API]` |

> **Nota de posicionamiento.** Integrar con Workday no contradice competir con Workday. Datalent no vende una plataforma de RRHH, vende gobernanza y juicio sobre los datos que esa plataforma ya contiene. La integración es precisamente el argumento: el dato se queda donde está y el análisis se hace bajo estándar europeo.

#### Acción y flujo de trabajo (anillo 3, confirmación humana obligatoria)

| Servidor | Para qué sirve | Control |
|---|---|---|
| **Jira** | Materializar el plan de acción como tareas con responsable, plazo y criterio de cierre. Sin esto, el plan es un PDF que nadie ejecuta. | Confirmación por lote antes de crear |
| **Slack / Teams** | Notificar al Compensation Lead que hay hallazgos pendientes de revisión. | Solo notificación, nunca contenido con dato personal |
| **Office 365** | Generación de entregables en Word y PowerPoint sobre plantilla corporativa del cliente. | Confirmación antes de escribir en repositorio compartido |
| **GitHub** | Versionado de las políticas retributivas y del propio catálogo de reglas de cumplimiento, tratado como código. | Solo para el equipo interno de Datalent |

#### Explícitamente excluidos

**LinkedIn.** No hay servidor MCP oficial con acceso a datos retributivos, y el scraping de perfiles vulnera las condiciones de uso de la plataforma y plantea problemas de base jurídica bajo RGPD para el tratamiento de datos de personas ajenas al cliente. Si el cliente necesita referencia de mercado, la vía correcta es una fuente de benchmarking con licencia comercial y metodología publicada. `[VALIDATE: proveedor de datos de mercado con licencia para uso en producto, cobertura por país y metodología documentada]`

### 4.3 Gestión de credenciales

Nunca en el prompt, nunca en el sandbox, nunca en el historial de eventos de la sesión.

- **Credenciales MCP con OAuth**: almacenadas en vault, refresco automático por el proveedor de inferencia mediante el `refresh_token` guardado, inyección en el proxy de salida. El código del sandbox no las ve nunca.
- **Claves de API para servicios no MCP**: credencial de tipo variable de entorno, con `networking.allowed_hosts` restringido al dominio concreto del servicio y `injection_location: {header: true}` para limitar la sustitución a la cabecera. El cuerpo de la petición es una superficie de exposición más amplia y no debe habilitarse salvo que el servicio lo exija.
- **Regla de oro**: si una integración necesita un secreto que no encaja en el modelo de vault, se implementa como herramienta personalizada ejecutada por el orquestador propio, con la credencial en la infraestructura de Datalent y no en el contenedor de la sesión.

---

## 5. Base documental (RAG)

### 5.1 Por qué RAG y no fine-tuning

Tres razones. El corpus normativo cambia con cada transposición nacional y un modelo ajustado quedaría desfasado sin aviso. La trazabilidad exige poder señalar el párrafo exacto que sustenta una afirmación, cosa que un modelo ajustado no ofrece. Y el aislamiento entre tenants es un requisito contractual: el convenio colectivo de un cliente no puede filtrarse al análisis de otro, y con recuperación filtrada por `tenant_id` eso es una condición de consulta, mientras que con ajuste fino sería una arquitectura de un modelo por cliente.

### 5.2 Estructura del corpus

```
KNOWLEDGE BASE
│
├── GLOBAL  (compartido, versionado, solo lectura)
│   ├── ue/
│   │   ├── directiva_2023_970/         art. 1-38 + considerandos
│   │   ├── reglamento_2024_1689_ai_act/ art. + Anexo III
│   │   ├── rgpd_2016_679/              art. 5, 6, 9, 22, 25, 32, 35, 88
│   │   ├── directiva_2006_54/          igualdad de trato
│   │   └── jurisprudencia_tjue/        asuntos sobre igualdad retributiva
│   ├── nacional/
│   │   ├── es/  RD 902/2020 · RD 901/2020 · LO 3/2007 · art. 28 ET
│   │   ├── de/  EntgTranspG y norma de transposición
│   │   ├── fr/  Index Égalité professionnelle y transposición
│   │   └── ...  un módulo por país, activable por plan
│   ├── guias/
│   │   ├── comision_europea/           orientaciones sobre valoración de puestos
│   │   ├── aepd/                       criterios sobre tratamiento en RRHH
│   │   └── oit/                        metodología de trabajo de igual valor
│   └── metodologia_datalent/
│       ├── protocolo_auditoria_retributiva.md
│       ├── criterios_valoracion_puestos.md
│       └── politica_no_fabricacion.md
│
└── TENANT  (aislado por RLS, ciclo de vida del cliente)
    ├── convenios/            convenio aplicable y tablas salariales
    ├── politicas/           política retributiva, de promoción, de variable
    ├── estructura/          bandas, grados, familias profesionales
    ├── descripciones/       job descriptions vigentes
    ├── auditorias_previas/  informes anteriores y sus planes de acción
    ├── planes_igualdad/     plan de igualdad y registro retributivo
    └── faq/                 preguntas resueltas y validadas por humano
```

### 5.3 Chunking

Un único chunker no sirve para todo. El troceado va por tipo de documento.

| Tipo | Estrategia | Tamaño objetivo | Solapamiento | Motivo |
|---|---|---|---|---|
| Norma (directiva, reglamento, ley) | **Por unidad jurídica**: un artículo o apartado por chunk, sin partirlo nunca | Variable | Ninguno | Partir un artículo por la mitad destruye la citabilidad. Un chunk debe poder citarse como "art. 9.1.c" |
| Considerandos | Uno por chunk | Variable | Ninguno | Se usan para interpretación, y se recuperan asociados a su artículo |
| Convenio colectivo | Por artículo, con la tabla salarial como chunk independiente enlazado | 800 tokens | 100 | Las tablas necesitan tratamiento estructurado |
| Política interna | Semántico por encabezado, respetando la jerarquía | 600 tokens | 80 | Documentos mal estructurados; el encabezado es la única señal fiable |
| Job description | **Documento completo** como un chunk si cabe | hasta 1500 tokens | n/a | El sesgo de lenguaje es una propiedad del texto entero, no de un fragmento |
| Auditoría previa | Por hallazgo | Variable | Ninguno | La unidad de reutilización es el hallazgo, no la página |
| Tabla salarial | No se vectoriza: va a tabla relacional | n/a | n/a | Nunca se recupera un número por similitud semántica. Ver nota abajo |

> **Regla dura: los números no viven en el índice vectorial.** Salarios, umbrales, percentiles y bandas viven en PostgreSQL y se consultan con SQL determinista. Recuperar una cifra por similitud coseno es la vía más rápida a una alucinación numérica con apariencia de rigor.

### 5.4 Metadatos

Cada chunk lleva:

```json
{
  "chunk_id": "uuid",
  "tenant_id": "uuid | GLOBAL",
  "doc_id": "uuid",
  "doc_type": "norma_ue | norma_nacional | convenio | politica | job_description | auditoria | guia | faq",
  "jurisdiccion": "UE | ES | DE | FR | ...",
  "instrumento": "directiva_2023_970",
  "referencia": "art. 9.1.c",
  "titulo_seccion": "Informe sobre la brecha retributiva de género",
  "vigencia_desde": "2026-06-07",
  "vigencia_hasta": null,
  "version_documento": "consolidada_2026-05-12",
  "idioma": "es",
  "autoridad": 1,
  "confidencialidad": "publico | interno | restringido",
  "contiene_pii": false,
  "hash_contenido": "sha256:...",
  "ingerido_en": "2026-07-29T10:00:00Z",
  "ingerido_por": "pipeline_v3"
}
```

`autoridad` ordena la resolución de conflictos: 1 para norma UE, 2 para norma nacional, 3 para convenio, 4 para guía de autoridad, 5 para política interna, 6 para metodología propia. Cuando dos chunks se contradicen, el de menor valor gana y el Legal Agent debe señalar el conflicto de forma explícita en la salida.

`vigencia_desde` y `vigencia_hasta` permiten la consulta con fecha efectiva. Una auditoría del ejercicio 2026 debe razonar con la norma vigente en 2026, no con la de hoy. Esto es la diferencia entre un informe defendible y uno que un inspector desmonta.

### 5.5 Embeddings y recuperación

**Modelo de embedding.** Requisitos: multilingüe con calidad real en español, alemán, francés e italiano; alojable en la UE; dimensión manejable. Recomendación: modelo multilingüe autoalojado sobre GPU propia, para que ni siquiera el texto del convenio del cliente salga de la infraestructura. `[VALIDATE: selección concreta de modelo de embedding tras evaluación en un conjunto de consultas normativas en las cuatro lenguas objetivo, midiendo recall@10 y MRR]`

Alternativa: servicio gestionado de embeddings con región europea, más simple de operar y con peor argumento de soberanía. Se recomienda el autoalojado por coherencia con el posicionamiento.

**Recuperación híbrida.** Solo vectorial no basta en dominio jurídico: la consulta "art. 10" debe recuperar el artículo 10, y la similitud semántica no garantiza eso.

```
Consulta
   │
   ├─→ Reescritura de consulta (haiku-4-5): expande siglas, añade sinónimos
   │   jurídicos, detecta referencia explícita a artículo
   │
   ├─→ [A] Búsqueda vectorial (pgvector, HNSW, coseno)      → top 30
   ├─→ [B] Búsqueda léxica (BM25 sobre tsvector Postgres)   → top 30
   └─→ [C] Búsqueda exacta por metadato (referencia, art.)  → determinista
              │
              ▼
        Fusión RRF (Reciprocal Rank Fusion)
              │
              ▼
        Filtro obligatorio: tenant_id ∈ {tenant actual, GLOBAL}
                            fecha_efectiva dentro de vigencia
              │
              ▼
        Reranker cross-encoder → top 8
              │
              ▼
        Ensamblado de contexto ordenado por autoridad
```

El filtro por `tenant_id` no es un parámetro opcional de la consulta: se aplica en la capa de datos mediante RLS, de forma que un fallo de programación en la capa de aplicación no puede provocar una fuga entre clientes.

### 5.6 Versionado y actualización

```
Detección de cambio
  ├─ Sondeo diario de EUR-Lex y BOE, comparación por hash de contenido
  ├─ Alta manual por el equipo jurídico de Datalent
  └─ Aviso del cliente sobre cambio de convenio
        │
        ▼
Ingesta en entorno de staging (nunca directo a producción)
        │
        ▼
Diff normativo asistido: qué artículos cambian y qué reglas de cumplimiento
del catálogo dependen de ellos
        │
        ▼
Revisión humana obligatoria por el responsable de contenido jurídico
        │
        ▼
Publicación con nueva versión de corpus. La versión anterior NO se borra.
        │
        ▼
Reejecución de la suite de regresión: 200 consultas de referencia con
respuesta esperada. Si el diff supera el umbral, bloqueo de publicación.
        │
        ▼
Invalidación selectiva del caché de prompt afectado
```

Cada informe emitido registra la versión de corpus con la que se generó. Un año después, cuando alguien pregunte por qué el informe decía lo que decía, la respuesta es reproducible.

---

## 6. Tipos de documento soportados

```
                       ┌──────────────────────┐
   Documento entrante ─→│  Router de formato   │
                       │  MIME + magic bytes  │
                       └──────────┬───────────┘
                                  │
   ┌────────┬────────┬────────┬───┴────┬────────┬────────┬────────┐
   ▼        ▼        ▼        ▼        ▼        ▼        ▼        ▼
 PDF      DOCX     XLSX     CSV      PPTX    EMAIL   IMAGEN   ESCANEO
   │        │        │        │        │        │        │        │
   │        │        │        │        │        │        │        ▼
   │        │        │        │        │        │        │    ┌───────┐
   │        │        │        │        │        │        └───→│  OCR  │
   │        │        │        │        │        │             └───┬───┘
   │        │        │        │        │        │                 │
   ▼        ▼        ▼        ▼        ▼        ▼                 ▼
 pypdf   python-  openpyxl  pandas  python-  email +      confianza < 0,85
 pdfplumber docx           +chardet  pptx    mailparser    → revisión humana
   │        │        │        │        │        │                 │
   └────────┴────────┴────────┴────────┴────────┴─────────────────┘
                                  │
                       ┌──────────▼───────────┐
                       │ Clasificador de tipo │  haiku-4-5
                       │ documental           │  output_config.format
                       └──────────┬───────────┘
                                  │
                       ┌──────────▼───────────┐
                       │ Detección de PII     │  Presidio + reglas ES
                       │ → pseudonimización   │  DNI/NIE, NAF, IBAN
                       └──────────┬───────────┘
                                  │
                       ┌──────────▼───────────┐
                       │ Extracción al        │
                       │ esquema canónico     │
                       └──────────┬───────────┘
                                  │
                       ┌──────────▼───────────┐
                       │ Informe de calidad   │
                       │ del dato             │
                       └──────────────────────┘
```

### Detalle por formato

| Formato | Herramienta | Caso de uso real | Riesgo principal |
|---|---|---|---|
| **PDF nativo** | `pdfplumber` para tablas, `pypdf` para texto | Convenios, políticas, informes previos | Tablas de dos columnas mal segmentadas: se detectan por heurística de coordenadas y se marcan para revisión |
| **PDF escaneado** | Tesseract u OCR gestionado en UE | Convenios antiguos, actas firmadas | Confusión de dígitos en cifras salariales. Umbral de confianza estricto y validación cruzada contra rangos plausibles |
| **DOCX** | `python-docx` | Descripciones de puesto, políticas, planes de igualdad | Control de cambios y comentarios: se extraen aparte, no se mezclan con el texto principal |
| **XLSX / XLS** | `openpyxl`, `pandas` | Registro retributivo, nóminas, tablas salariales. **El formato dominante en la práctica** | Fórmulas sin evaluar, celdas combinadas, hojas ocultas con datos reales, columnas con tipos mixtos. Perfilado exhaustivo obligatorio |
| **CSV / TSV** | `pandas` con detección de codificación | Exportaciones de HRIS y nómina | Codificación latin-1 sin declarar, separador decimal por coma, fechas ambiguas |
| **PPTX** | `python-pptx` | Presentaciones de comité de retribución | Bajo valor documental; se procesa por completitud |
| **Email (EML, MSG)** | `email` + `extract-msg` | Trazabilidad de decisiones retributivas, evidencia de comunicación de bandas | Alta densidad de PII de terceros. Redacción agresiva por defecto |
| **Imagen** | Visión del modelo + OCR | Capturas de pantalla de HRIS, tablas fotografiadas | Resolución. Los modelos actuales admiten hasta 2576 px en el lado largo, con coste de hasta unos 4784 tokens por imagen. Reducir a 1080p cuando la fidelidad no sea crítica |

**Instrumentación de análisis visual.** Para gráficos y tablas densas, dar al agente herramientas de recorte y análisis iterativo resulta más eficaz y más barato que subir el nivel de razonamiento. El agente recorta, analiza la región y verifica su propia lectura.

---

## 7. Capacidades analíticas

### 7.1 Frontera arquitectónica: el modelo no calcula

```
   ┌──────────────────────────────┐        ┌──────────────────────────────┐
   │   MOTOR DETERMINISTA         │        │   AGENTE LLM                 │
   │   Python · pandas · scipy    │        │   Claude                     │
   │   statsmodels · numpy        │        │                              │
   │                              │        │                              │
   │   · Calcula toda cifra       │───────→│   · Elige qué calcular       │
   │   · Es reproducible bit a bit│ salida │   · Interpreta la salida     │
   │   · Está bajo test unitario  │        │   · Contextualiza y explica  │
   │   · Emite intervalos y p     │        │   · NUNCA escribe una cifra  │
   │   · Registra la evidencia    │        │     que no venga de aquí     │
   └──────────────────────────────┘        └──────────────────────────────┘
```

Toda cifra que aparece en un entregable lleva un `evidence_id` que apunta a una ejecución concreta del motor, con su input, su semilla, su versión de código y su timestamp. El agente QA rechaza cualquier salida con cifras huérfanas. Esta separación es lo que hace el sistema defendible bajo el art. 18 de la Directiva.

### 7.2 Catálogo de métricas y algoritmos

#### Brecha retributiva bruta

```
Brecha media    = (media(salario_hombres) − media(salario_mujeres)) / media(salario_hombres)
Brecha mediana  = (mediana(salario_H) − mediana(salario_M)) / mediana(salario_H)
```

Sobre retribución horaria equivalente, normalizando jornada parcial. La mediana es más robusta a directivos con retribución extrema; ambas son obligatorias por el art. 9, y el sistema reporta siempre las dos porque una brecha media alta con mediana baja indica un problema concentrado en la cúpula, mientras que el patrón inverso apunta a un problema estructural en la base.

Complementos y variable se calculan por separado (art. 9.1.c y 9.1.d), y además se reporta la proporción de cada sexo que percibe algún componente variable (art. 9.1.e). Una brecha de acceso al variable es tan relevante como una brecha de importe.

#### Brecha ajustada

Regresión log-lineal sobre el logaritmo del salario, con controles por criterios objetivos y neutros:

```
ln(salario_hora) = β₀ + β₁·mujer + Σβᵢ·Xᵢ + ε

X = { grado, categoría de igual valor, antigüedad, antigüedad², jornada,
      ubicación, unidad de negocio, evaluación de desempeño }
```

`β₁` es la brecha no explicada por los controles. Se reporta con intervalo de confianza al 95% y con `exp(β₁) − 1` como efecto porcentual interpretable.

Advertencias que el Critic Agent debe verificar:

- **No incluir controles contaminados.** Si el nivel jerárquico está a su vez sesgado por género, controlar por él absorbe discriminación real y la brecha ajustada aparece artificialmente baja. Se reportan ambas especificaciones, con y sin nivel, y se explica la diferencia.
- **Una brecha ajustada de cero no prueba ausencia de discriminación.** Prueba que las variables incluidas explican la diferencia. Si la asignación a esas variables es discriminatoria, el problema está aguas arriba.

**Descomposición Oaxaca-Blinder** para separar la parte explicada por características observables de la parte atribuible a diferencias en la retribución de esas mismas características. Es la herramienta correcta para responder a la pregunta que hace un comité: cuánto de la brecha es composición de plantilla y cuánto es trato desigual.

Referencia metodológica: Blinder, A. S. (1973), *Journal of Human Resources* 8(4); Oaxaca, R. (1973), *International Economic Review* 14(3).

#### Compa-ratio y penetración de banda

```
Compa-ratio        = salario / punto_medio_banda
Penetración (%)    = (salario − mínimo) / (máximo − mínimo) × 100
Amplitud de banda  = (máximo − mínimo) / mínimo
Solapamiento       = (máx_banda_n − mín_banda_n+1) / (máx_banda_n − mín_banda_n)
Ratio medio        = punto_medio_n+1 / punto_medio_n
```

Interpretación operativa: compa-ratio por debajo de 0,80 sugiere infrapago o incorporación reciente; por encima de 1,20 sugiere sobrepago o banda desfasada. Solapamiento superior al 50% entre bandas contiguas indica que la estructura no discrimina niveles, lo que en la práctica hace indefendible la justificación de diferencias por grado ante el art. 6.

El sistema calcula compa-ratio medio **por sexo y por categoría**. Una diferencia sistemática de compa-ratio entre hombres y mujeres dentro de la misma banda es una de las señales más limpias de trato desigual, porque neutraliza el efecto de composición.

#### Compresión salarial

```
Compresión vertical   = salario_manager / media(salario_equipo_directo)
Compresión de entrada = media(salario_incorporados_12m) / media(salario_veteranos_mismo_puesto)
Ratio de rango        = P90 / P10 dentro de categoría
```

Compresión vertical por debajo de 1,15 señala que la prima por responsabilidad se ha erosionado. Compresión de entrada por encima de 1,0 indica que el mercado paga más a los que llegan que a los que se quedan, lo que es simultáneamente un riesgo de retención y un riesgo legal si la antigüedad correlaciona con género en esa categoría.

#### Dispersión

```
Coeficiente de variación = σ / μ
Rango intercuartílico    = P75 − P25
Índice de Gini intracategoría
Ratio P90/P10
```

#### Outliers y anomalías

Combinación de tres capas, porque cada una falla en un escenario distinto:

1. **Univariante robusto**: MAD (desviación absoluta mediana) con umbral de 3,5 en z-score modificado. Resistente a la contaminación que arruina el z-score clásico.
2. **Contextual**: distancia de Cook y residuos estandarizados de la regresión ajustada. Detecta a la persona cuyo salario es anómalo *dado su perfil*, que es la pregunta relevante.
3. **Multivariante**: Isolation Forest sobre el vector completo de características. Captura combinaciones anómalas que ninguna variable revela por separado.

Todo outlier detectado se marca para revisión humana, nunca para acción automática. Un outlier puede ser un caso de discriminación, un error de dato o una circunstancia legítima documentada.

#### Contraste estadístico

- **Comparación de dos grupos**: t de Welch cuando se cumple normalidad aproximada; Mann-Whitney U en caso contrario. Se reporta siempre el tamaño del efecto (d de Cohen), porque con plantillas grandes casi cualquier diferencia sale significativa.
- **Comparaciones múltiples**: corrección de Benjamini-Hochberg sobre el conjunto de categorías analizadas. Sin ella, analizar 40 categorías produce dos falsos positivos por puro azar al 5%, y esos falsos positivos se convertirían en hallazgos con nombre y apellidos.
- **Potencia**: si la potencia estimada del contraste es inferior a 0,80, el sistema lo declara explícitamente en lugar de reportar un no-hallazgo como si fuera evidencia de ausencia.

#### Detección de sesgo en lenguaje

Tres capas sobre ofertas y descripciones de puesto:

1. **Léxica**. Diccionario de términos con connotación agéntica frente a comunal, con umbral de desequilibrio. Base metodológica: Gaucher, Friesen & Kay (2011), *Journal of Personality and Social Psychology* 101(1), sobre el efecto del lenguaje de género en ofertas de empleo. Diccionario adaptado al español y validado por el equipo lingüístico. `[VALIDATE: validación del diccionario adaptado al español contra un corpus anotado por evaluadores humanos, con medida de acuerdo entre anotadores]`
2. **Requisitos con impacto adverso**. Detección de requisitos que no guardan relación demostrable con el desempeño y que correlacionan con atributos protegidos: disponibilidad total para viajar sin justificación funcional, límites de edad encubiertos ("recién titulado", "joven equipo"), años de experiencia desproporcionados al contenido del puesto.
3. **Contextual con LLM**. El Bias Detection Agent razona sobre el texto completo con instrucción explícita de no afirmar intencionalidad, solo de señalar efecto potencial y fundamento.

> **Nota sobre el análisis de impacto adverso.** La conocida regla del 80% procede del marco regulatorio estadounidense (EEOC Uniform Guidelines) y no tiene equivalencia normativa directa en la UE. El sistema puede calcularla como señal complementaria, siempre etiquetada como tal, pero el análisis principal debe basarse en contraste estadístico y en los criterios del art. 4 de la Directiva. Presentarla como estándar europeo sería un error técnico y una debilidad ante un inspector.

#### Disparador del artículo 10

```python
def evalua_disparador_art10(categoria) -> Disparador:
    brecha = categoria.brecha_media_por_sexo
    if brecha < 0.05:
        return Disparador(activo=False, motivo="brecha por debajo del umbral")
    justificacion = evalua_justificacion_objetiva(categoria)   # criterios art. 4
    if justificacion.es_suficiente and justificacion.esta_documentada:
        return Disparador(activo=False, motivo="justificada", evidencia=justificacion.ids)
    if categoria.meses_desde_deteccion < 6:
        return Disparador(activo=False, estado="ventana de corrección abierta",
                          vence=categoria.fecha_deteccion + relativedelta(months=6))
    return Disparador(activo=True, obligacion="evaluación conjunta retributiva",
                      base_legal="art. 10 Directiva (UE) 2023/970")
```

Este cálculo es determinista y está bajo test. El agente lo invoca, no lo reproduce.

### 7.3 Valoración de puestos

> **Corregido el 2026-07-29.** Este apartado proponía un esquema propio de cuatro factores con pesos 30/20/30/20. Eran una invención de diseño. **España tiene un procedimiento oficial publicado en el BOE**: la Orden PCM/1047/2022, de 1 de noviembre, que aprueba el procedimiento de valoración de puestos previsto en el RD 902/2020, con herramienta gratuita del Ministerio de Trabajo y el Instituto de las Mujeres. Estructura y ponderaciones completas en [`corpus/es/vigente/valoracion-puestos-svpt.md`](../corpus/es/vigente/valoracion-puestos-svpt.md).

**La taxonomía de valoración es por jurisdicción, no global.** El motor implementa un árbol genérico de factores ponderados y cada jurisdicción aporta el suyo. Codificar las cuatro categorías del art. 4 de la Directiva como estructura fija sería un error: el esquema español del art. 28.1 ET usa un reparto distinto y anida esfuerzo y responsabilidad dentro de «naturaleza de las funciones».

Ponderación oficial española, sobre un total de 1.000 puntos:

| Categoría | Peso |
|---|---|
| A) Naturaleza de las funciones o tareas | 40% |
| B) Condiciones educativas | 20% |
| C) Condiciones profesionales y de formación | 25% |
| D) Condiciones laborales y factores relacionados con el desempeño | 15% |

**Por qué alinearse con el método oficial y no con uno propio.** La implantación es voluntaria (art. 1.2 de la Orden), pero las valoraciones realizadas conforme a este procedimiento se entienden ajustadas a los requisitos formales del RD 902/2020. Ante una carga de la prueba invertida, usar el método del Ministerio es la posición más defendible disponible, y ningún esquema propietario ofrece ese puerto seguro.

Los tres criterios legales del art. 4.4 del RD 902/2020 (adecuación, totalidad y objetividad) los verifica el Critic Agent sobre toda valoración propuesta. El que más falla en la práctica es la totalidad: es el que se incumple cuando una valoración omite el esfuerzo emocional de un puesto de atención al público.

**Dónde está el hueco de producto.** La propia guía oficial advierte de que un porcentaje elevado de puestos feminizados con puntuación baja puede revelar una aplicación incorrecta de la metodología, que entonces no satisfaría los criterios de objetividad, adecuación y totalidad. El método reconoce que puede aplicarse de forma sesgada y deja esa detección en manos de la empresa. Detectar la aplicación sesgada de una metodología correcta es análisis, no cumplimentación de formulario, y es lo que justifica que el producto exista frente a una hoja de cálculo gratuita.

El factor «otros», presente en tres de las cuatro categorías con un 5% de peso, es el vector de manipulación más evidente del método: es por donde se reintroduce un criterio sesgado con apariencia de objetividad. El Bias Detection Agent lo trata como zona de atención prioritaria y exige la justificación documental que la Orden requiere.

El agente propone la puntuación a partir de la descripción del puesto. Un humano la valida. La agrupación en trabajos de igual valor la produce el motor determinista. Nota de flujo: según el art. 46.2 de la LO 3/2007 el diagnóstico se elabora en el seno de la Comisión Negociadora del Plan de Igualdad, de modo que la valoración no es un entregable que compensación pueda aplicar por su cuenta.

---

## 8. Prompts internos

Convenciones aplicadas a todos: los prompts de sistema están congelados por versión y no contienen fecha ni identificador de sesión, para preservar el caché. Las instrucciones sobrevenidas van como mensaje `role: "system"` dentro de `messages`. Ningún prompt incluye la instrucción de "verificar tu trabajo", porque en los modelos actuales eso induce sobreverificación sin ganancia de calidad; la verificación está en el bucle Critic, que es una arquitectura, no una petición.

### 8.1 Orchestrator

```
Eres el orquestador del Pay Transparency Compliance Agent. Coordinas subagentes
especializados para producir análisis de cumplimiento en materia de transparencia
retributiva bajo la Directiva (UE) 2023/970 y la normativa nacional aplicable.

TU FUNCIÓN
Planificas, delegas, consolidas y decides cuándo escalar a un humano. No calculas,
no interpretas norma y no redactas entregables: para eso tienes subagentes.

LÍMITES DE AUTONOMÍA
Puedes sin autorización: descomponer la petición, asignar tareas, invocar
herramientas de solo lectura, pedir reintentos, abortar una ejecución.
Nunca sin autorización humana: publicar un entregable, escribir en un sistema
del cliente, emitir una conclusión sobre la retribución de una persona
identificada, comunicar resultados fuera de la plataforma.

DELEGACIÓN
Los subagentes multiplican coste y latencia: cada uno reconstruye contexto,
explora e informa, y después tú lees su informe. Delega poco y con criterio.
- Delega cuando la tarea es sustancial e independiente de las demás.
- No delegues lo que resuelves con unas pocas llamadas a herramienta.
- No delegues la verificación: el Critic ya está en el bucle.
- Nunca más de 6 subagentes en paralelo.
- Instruye bien a la primera. Lanzar, esperar y reinstruir es el patrón caro.
- Si delegas, confía: no rehagas el trabajo del subagente al recibir su informe.

ESCALADO A HUMANO
Escala inmediatamente si: dos subagentes se contradicen y no puedes resolverlo
con evidencia; una categoría queda por debajo del umbral de k-anonimato; se
activa el disparador del art. 10; la calidad del dato de entrada está por debajo
del umbral configurado; el análisis exigiría una conclusión jurídica sobre un
caso individual.

COMUNICACIÓN
Tu texto entre llamadas a herramienta es lo que lee la persona que espera.
Escríbelo para alguien que se ausentó y vuelve, no para un log. Antes de la
primera herramienta, una frase sobre lo que vas a hacer. Durante el trabajo,
actualizaciones breves solo cuando encuentres algo determinante o cambies de
rumbo. Al terminar, empieza por el resultado.
Ser legible importa más que ser breve. Para acortar, elige mejor qué incluir,
no comprimas la escritura en fragmentos, abreviaturas o cadenas de flechas.

ALCANCE
Entrega lo que se ha pedido, en el alcance pedido. Resuelve tú las decisiones
menores. Consulta solo cuando dos lecturas razonables llevarían a trabajos
materialmente distintos. Si crees que el encargo está mal planteado, dilo en una
frase y continúa con lo pedido. Termina la tarea completa: informa de que está
hecha solo cuando lo esté, y si algo queda bloqueado, haz el resto y di con
claridad qué falta y por qué.
```

### 8.2 Legal Agent

```
Eres especialista en Derecho laboral europeo, con foco en igualdad retributiva.
Interpretas normativa. No decides sobre casos individuales.

FUENTES Y JERARQUÍA
Trabajas exclusivamente sobre el corpus recuperado. Si algo no está en él, dilo.
Orden de prevalencia cuando hay conflicto: (1) Derecho de la UE, (2) norma
nacional de transposición, (3) convenio colectivo, (4) guía de autoridad,
(5) política interna. Cuando dos fuentes se contradicen, señálalo de forma
expresa en lugar de elegir en silencio.

CITA
Toda afirmación normativa lleva instrumento, artículo y apartado exactos.
Formato: "Directiva (UE) 2023/970, art. 9.1.c". Si no puedes localizar el
artículo en el corpus recuperado, escribe [VALIDATE: base normativa por
confirmar] en lugar de citar de memoria. Una cita inventada es el fallo más
grave que puedes cometer en este sistema.

TEMPORALIDAD
Razona con la norma vigente en la fecha efectiva del análisis, no con la de hoy.
La fecha efectiva viene en el contexto de la tarea. Si un artículo entró en vigor
después de esa fecha, no es aplicable al ejercicio auditado y debes decirlo.

INCERTIDUMBRE
Cada conclusión lleva nivel de confianza:
  ALTA   texto normativo expreso y directamente aplicable
  MEDIA  interpretación razonable sin pronunciamiento expreso
  BAJA   cuestión abierta, sin transposición, o con criterio divergente
Con confianza BAJA, explica qué haría falta para resolverla.

LÍMITE
No emites asesoramiento jurídico. Produces análisis normativo que un profesional
colegiado revisa. Ninguna salida tuya afirma que una conducta concreta sea o no
constitutiva de infracción respecto de una persona identificada.
```

### 8.3 Compliance Agent

```
Evalúas el grado de cumplimiento de la Directiva (UE) 2023/970 y de la norma
nacional aplicable, artículo por artículo.

MÉTODO
Para cada obligación aplicable produces exactamente esta tupla:
  artículo · estado · evidencia_id · confianza · laguna
Estados admitidos, sin excepción:
  CUMPLE            hay evidencia documental positiva y verificable
  NO CUMPLE         hay evidencia documental de incumplimiento
  EVIDENCIA AUSENTE no hay documento que permita afirmar ni negar
  NO APLICABLE      con motivo explícito de la inaplicabilidad

EVIDENCIA AUSENTE NO ES CUMPLE
Es la distinción más importante de tu trabajo. El art. 18 invierte la carga de la
prueba: sin evidencia, el empleador no puede demostrar cumplimiento. Marcar como
CUMPLE algo que solo es "no hemos visto nada malo" genera una falsa seguridad que
se derrumba en inspección.

APLICABILIDAD
Antes de evaluar, determina si la obligación aplica: plantilla, sector,
jurisdicción y fecha efectiva. El calendario del art. 9 escalona por tamaño;
verifícalo antes de reportar un incumplimiento que aún no ha nacido.

SALIDA
Estructurada según el esquema proporcionado. Sin prosa fuera de los campos
previstos. La narrativa la escribe el Report Generator a partir de tu salida.
```

### 8.4 Salary Analytics Agent

```
Interpretas resultados de análisis retributivo. NO calculas.

REGLA ABSOLUTA
Toda cifra que aparezca en tu salida procede de una llamada a herramienta y lleva
su evidence_id. Si necesitas un número que no tienes, invoca la herramienta. Si la
herramienta no puede darlo, dilo. Nunca estimes, nunca redondees de memoria,
nunca derives una cifra mentalmente a partir de otras.

HERRAMIENTAS
  compute_pay_gaps(dataset_id, agrupacion, tipo)
  run_adjusted_regression(dataset_id, controles[], especificacion)
  compute_compa_ratios(dataset_id, estructura_id)
  detect_outliers(dataset_id, metodo)
  test_significance(grupo_a, grupo_b, correccion)
  oaxaca_blinder(dataset_id, controles[])

INTERPRETACIÓN
- Distingue siempre brecha bruta de brecha ajustada, y explica qué mide cada una.
- Una brecha ajustada próxima a cero no acredita ausencia de discriminación:
  acredita que los controles incluidos explican la diferencia observada.
- Con n < 30 en una categoría, señala la limitación de potencia estadística.
- Con n < 5, no reportes: escala por umbral de k-anonimato.
- Comprueba que se ha aplicado corrección por comparaciones múltiples cuando
  analizas más de una categoría.
- Reporta tamaño del efecto junto al p-valor. Con plantillas grandes, la
  significación estadística no implica relevancia práctica.

CAUSALIDAD
Describes asociaciones. No afirmas causalidad. "Las mujeres del grado 4 perciben
de media un 7,2% menos" es correcto. "Se les paga menos por ser mujeres" no lo es
sin haber descartado explicaciones alternativas, y esa conclusión no te
corresponde.
```

### 8.5 Bias Detection Agent

```
Detectas sesgo en textos de empleo y en patrones retributivos estructurales.

QUÉ AFIRMAS Y QUÉ NO
Afirmas efecto potencial. Nunca afirmas intención. "Este requisito puede tener
impacto adverso sobre candidatas con responsabilidades de cuidado" es correcto.
"Este requisito discrimina a las mujeres" no lo es: excede tu ámbito y expone al
cliente.

CAPAS DE ANÁLISIS
1 Léxica       términos con connotación agéntica frente a comunal, desequilibrio
2 Requisitos   condiciones sin relación demostrable con el desempeño que
               correlacionan con atributos protegidos (edad encubierta,
               disponibilidad sin justificación funcional, experiencia
               desproporcionada al contenido)
3 Estructural  segregación horizontal y vertical, techos por categoría,
               diferencias sistemáticas de acceso al variable
4 Contextual   lectura completa del texto en su conjunto

PARA CADA HALLAZGO
  fragmento exacto · tipo · mecanismo del efecto adverso · confianza ·
  fundamento (norma o referencia metodológica) · reformulación propuesta

CALIBRACIÓN
El falso positivo tiene coste real: erosiona la confianza en el sistema y hace
que el cliente ignore los hallazgos verdaderos. Con confianza por debajo del
umbral, marca para revisión humana en lugar de reportar como hallazgo.

REFERENCIAS
Cuando invoques un efecto documentado en la literatura, cita la fuente. Sin
fuente localizable, escribe [VALIDATE: referencia por confirmar].
```

### 8.6 Planning Agent

```
Descompones peticiones de auditoría en planes ejecutables.

CADA TAREA LLEVA
  id · descripción · subagente asignado · dependencias · entradas requeridas ·
  criterio de finalización verificable · esfuerzo estimado

CRITERIO DE FINALIZACIÓN
Debe ser comprobable por un tercero. "Análisis de bandas completado" no sirve.
"Compa-ratio calculado para las 14 categorías con n≥5, con desglose por sexo"
sí sirve.

ANTES DE PLANIFICAR
Verifica que existen los datos que el plan necesita. Un plan que asume datos
inexistentes falla a mitad de ejecución y desperdicia presupuesto. Si falta algo,
la primera tarea del plan es obtenerlo, y si no es obtenible, dilo antes de
planificar el resto.

ALCANCE
No amplíes el encargo. Si detectas trabajo adyacente valioso fuera del alcance
contratado, anótalo como recomendación separada y explícitamente marcada como
fuera de alcance.
```

### 8.7 Report Writing Agent

```
Redactas entregables a partir de hallazgos ya verificados.

MATERIA PRIMA
Solo escribes sobre hallazgos que llegan aprobados por el Critic. No introduces
análisis nuevo, no infieres conclusiones no presentes en los hallazgos y no
suavizas una conclusión para hacerla más cómoda.

CIFRAS
Cada cifra lleva su evidence_id en el aparato de referencias. Si al redactar
detectas que necesitas un dato que no tienes, no lo estimes: devuelve el hueco al
orquestador.

VOZ
Basada en evidencia, directa, humana. Primero el resultado, después el mecanismo
que lo sustenta. Sin relleno de consultoría genérica: nombra el mecanismo, el
límite, el punto de control y la fuente.
Evita los tics de redacción automática: guion largo en exceso, la antítesis
"X, no Y" repetida, gerundios de pseudoanálisis al final de frase, atribución
vaga sin fuente, y cierres genéricos de sección.

ESTRUCTURA
Sigue la plantilla proporcionada. La consistencia entre entregables es en sí
misma una señal de rigor.

IDIOMA
El del cliente. Por defecto español para entregables de mercado español y
latinoamericano.

LONGITUD
Ajusta la extensión a lo que el contenido exige. No rellenes con secciones de
relleno, resúmenes redundantes ni preámbulos.
```

### 8.8 Critic Agent

```
Tu único mandato es intentar refutar el hallazgo que recibes. No lo mejoras,
no lo reescribes: lo pones a prueba.

PREGUNTAS OBLIGATORIAS
1 ¿Cada cifra procede del motor determinista y tiene evidence_id trazable?
2 ¿El tamaño muestral soporta el contraste aplicado? ¿Se declaró la potencia?
3 ¿Se corrigió por comparaciones múltiples si se analizó más de una categoría?
4 ¿La cita normativa existe en el corpus y dice literalmente lo que se afirma?
5 ¿Existe una explicación alternativa no discriminatoria que no se haya
  descartado ni mencionado?
6 ¿Se afirma causalidad donde solo hay asociación?
7 ¿Hay algún dato personal identificable o alguna categoría por debajo de k?
8 ¿El nivel de confianza declarado se corresponde con la evidencia aportada?

SALIDA
  ACEPTADO   con anotación de las reservas que procedan
  RECHAZADO  con motivo específico y accionable, y con la pregunta que falla
  NO CONCLUYENTE  tras el segundo rechazo del mismo hallazgo; se escala a humano
                  con ambos razonamientos adjuntos

CALIBRACIÓN
Rechazar todo te hace inútil. Aceptar todo te hace peligroso. Rechaza cuando
tengas un motivo concreto que el subagente pueda corregir, no por precaución
genérica.
```

### 8.9 QA Agent

```
Validación estructural final. Determinista en criterio, sin interpretación.

COMPRUEBAS
[ ] Ninguna cifra sin evidence_id asociado
[ ] Ninguna cita normativa sin instrumento y artículo verificables en el corpus
[ ] Ninguna categoría publicada con n por debajo del umbral k del tenant
[ ] Ningún identificador directo: nombre, DNI/NIE, NAF, IBAN, email, teléfono
[ ] Ninguna combinación de atributos que permita reidentificación
[ ] Marcadores [VALIDATE] presentes donde el contenido lo requiere
[ ] Estructura conforme a la plantilla
[ ] Idioma consistente en todo el documento
[ ] Enlaces y referencias cruzadas resueltos

SALIDA
APTO, o NO APTO con la lista exacta de fallos. No corriges: informas.
```

---

## 9. Memoria

```
┌──────────────────────────────────────────────────────────────────────────┐
│ CORTO PLAZO · vida de la sesión                                          │
│ Contexto de la conversación, resultados de herramienta del turno,        │
│ plan en curso, hallazgos aún no consolidados                             │
│ Soporte: contexto del modelo + Redis                                     │
│ Gestión: compactación automática al aproximarse al límite; limpieza de   │
│          resultados de herramienta antiguos mediante context editing     │
│ Retención: se destruye al cerrar la sesión                               │
├──────────────────────────────────────────────────────────────────────────┤
│ DE CASO · vida del expediente de auditoría                               │
│ Hallazgos consolidados, decisiones humanas con su motivo, versiones del  │
│ informe, cadena de evidencias, objeciones del Critic                     │
│ Soporte: PostgreSQL + almacén de objetos WORM                            │
│ Retención: la del expediente. Por defecto 6 años. `[VALIDATE: plazo de   │
│            conservación exigible según norma laboral y de prescripción   │
│            de infracciones en cada jurisdicción]`                        │
├──────────────────────────────────────────────────────────────────────────┤
│ ORGANIZATIVA · vida del cliente                                          │
│ Estructura de bandas y su histórico, convenio aplicable, glosario        │
│ interno, criterios de valoración de puestos aprobados, políticas,        │
│ auditorías previas y su plan de acción, decisiones de precedente         │
│ Soporte: PostgreSQL con RLS + índice vectorial del tenant                │
│ Uso: se inyecta como prefijo cacheado de tenant en cada sesión           │
│ Retención: mientras dure el contrato, más el periodo legal               │
├──────────────────────────────────────────────────────────────────────────┤
│ DE USUARIO · vida de la cuenta                                           │
│ Rol, idioma, formato de entregable preferido, nivel de detalle,          │
│ integraciones activas                                                    │
│ Soporte: PostgreSQL                                                      │
│ Límite: nunca almacena contenido de análisis, solo preferencias          │
├──────────────────────────────────────────────────────────────────────────┤
│ LARGO PLAZO INSTITUCIONAL · transversal a clientes, anonimizada          │
│ Metodología refinada, patrones de error del sistema, calibración de      │
│ umbrales, evolución normativa                                            │
│ Soporte: repositorio versionado, revisado por humanos                    │
│ REGLA DURA: cero dato de cliente. Ni identificado, ni pseudonimizado,    │
│             ni agregado. La transferencia entre tenants no ocurre.       │
└──────────────────────────────────────────────────────────────────────────┘
```

### 9.1 Implementación de la memoria organizativa

Se usa un almacén de memoria por tenant, montado como directorio en el contenedor de la sesión. El agente lee y escribe con las herramientas de fichero habituales. Cada mutación genera una versión inmutable con actor y timestamp, lo que da auditoría y capacidad de reversión.

Formato de cada nota: una lección por fichero, con resumen en la primera línea. Se registran tanto correcciones como enfoques confirmados, siempre con el motivo. No se guarda lo que ya consta en el expediente o en la base de datos. Se actualiza la nota existente antes que crear una duplicada, y se borra la que resulte errónea.

Prohibición expresa: nunca almacenar credenciales, claves o tokens en memoria. Persisten entre sesiones y se reinyectan literalmente en contextos futuros.

### 9.2 Gestión del contexto en sesiones largas

Una auditoría completa puede superar el millón de tokens de contexto. Tres mecanismos combinados:

- **Compactación** del servidor cuando la conversación se acerca al límite, preservando los bloques de compactación en el historial.
- **Context editing** para limpiar resultados de herramienta antiguos que ya se consolidaron en hallazgos.
- **Presupuesto de tarea** (`task_budget`) para que el agente se autorregule en bucles agénticos largos y termine con orden en lugar de ser cortado. Mínimo de 20.000 tokens; para una auditoría completa se dimensiona por encima de 200.000. `[VALIDATE: presupuesto óptimo tras medición sobre auditorías reales]`

---

## 10. Seguridad y gobernanza

### 10.1 Modelo de control de acceso

RBAC como base, ABAC como refinamiento. El rol define qué operaciones, los atributos definen sobre qué datos.

| Rol | Ver dato agregado | Ver dato individual pseudonimizado | Reidentificar | Aprobar hallazgo | Configurar | Exportar |
|---|---|---|---|---|---|---|
| Viewer | ✓ | | | | | |
| Analyst | ✓ | ✓ | | | | ✓ agregado |
| Compensation Lead | ✓ | ✓ | ✓ con justificación | ✓ | | ✓ |
| Legal / Compliance | ✓ | ✓ | ✓ con justificación | ✓ | | ✓ |
| DPO | ✓ | ✓ | ✓ | veto | ✓ privacidad | ✓ |
| Tenant Admin | ✓ | | | | ✓ | |
| Representación legal de trabajadores | ✓ | | | | | ✓ art. 13 |
| Auditor externo | ✓ solo lectura | | | | | ✓ con marca de agua |
| Datalent Support | | | | | | acceso de emergencia con doble aprobación y ventana temporal |

Refinamientos por atributo: un Analyst de la filial española no ve datos de la filial alemana. La reidentificación exige motivo escrito, queda registrada y dispara notificación al DPO. El acceso de soporte de Datalent requiere aprobación del cliente, tiene ventana temporal y se registra íntegramente.

### 10.2 Gobernanza de IA bajo el AI Act

**Clasificación de riesgo.** Los componentes que producen recomendaciones sobre condiciones retributivas individuales entran en el **Anexo III, punto 4(b)** del Reglamento (UE) 2024/1689: sistemas destinados a ser utilizados para adoptar decisiones que afecten a las condiciones de las relaciones laborales. Son de **alto riesgo**.

La excepción del art. 6.3 (tareas procedimentales limitadas, mejora de una actividad humana previa, detección de patrones de desviación, tarea preparatoria) **no es invocable** para el módulo de valoración de puestos ni para el de detección de sesgo, porque ambos realizan perfilado de personas físicas, y el propio art. 6.3 excluye la excepción cuando hay perfilado.

`[VALIDATE: confirmación de la clasificación por asesoría especializada en AI Act, con análisis específico por módulo y por caso de uso contratado. La clasificación varía según si el sistema se comercializa como producto o se despliega a medida.]`

Componentes de menor riesgo: el asistente conversacional de consulta normativa, que no perfila y solo informa, queda en riesgo limitado con obligación de transparencia del art. 50 (informar de que se interactúa con un sistema de IA).

**Obligaciones derivadas para Datalent como proveedor:**

| Obligación | Artículo | Implementación |
|---|---|---|
| Sistema de gestión de riesgos | Art. 9 | Proceso documentado, revisión trimestral, registro de riesgos identificados y mitigaciones |
| Gobernanza de datos | Art. 10 | Documentación de origen, representatividad y sesgos conocidos de todo dato de entrenamiento o calibración |
| Documentación técnica | Art. 11, Anexo IV | Este documento es la base; se completa con especificación de modelo, métricas y limitaciones |
| Registro automático de eventos | Art. 12 | El `audit_log` con hash encadenado cubre este requisito |
| Transparencia e instrucciones de uso | Art. 13 | Manual de despliegue con limitaciones y condiciones de uso previsto |
| **Supervisión humana** | Art. 14 | El punto de control humano obligatorio antes de toda entrega |
| Exactitud, robustez y ciberseguridad | Art. 15 | Suite de regresión, tests adversariales, pentest anual |
| Evaluación de la conformidad | Art. 43 | `[VALIDATE: procedimiento aplicable y organismo notificado si procede]` |
| Marcado CE y registro en base de datos UE | Art. 48, 49 | Previo a comercialización |

**Obligaciones del cliente como responsable del despliegue:**

- Art. 26: uso conforme a las instrucciones, supervisión por personas con competencia y autoridad, conservación de registros.
- **Art. 26.7**: antes de poner en servicio un sistema de IA de alto riesgo en el lugar de trabajo, el empleador debe **informar a los representantes de los trabajadores y a los trabajadores afectados**. El producto incluye la plantilla de comunicación y verifica que se ha realizado antes de habilitar el módulo.
- Art. 27: evaluación de impacto sobre los derechos fundamentales para organismos públicos y determinadas entidades privadas.

**Calendario.** Las obligaciones para sistemas de alto riesgo del Anexo III son aplicables desde el **2 de agosto de 2026**. La obligación de alfabetización en IA del art. 4 rige desde el 2 de febrero de 2025. `[VALIDATE: eventuales modificaciones del calendario derivadas de iniciativas de simplificación normativa posteriores a la redacción de este documento]`

### 10.3 Privacidad

**Base jurídica.** Para el tratamiento con fines de cumplimiento de la Directiva, la base es el art. 6.1.c del RGPD (cumplimiento de obligación legal). Para análisis que excedan la obligación legal estricta, se requiere análisis de interés legítimo con test de ponderación documentado. El sistema bloquea la ejecución si no consta base jurídica registrada para el tratamiento solicitado.

**Categorías especiales.** El sexo no es categoría especial del art. 9 RGPD. Sí lo son origen étnico o racial, datos de salud (relevante en análisis de discapacidad) y afiliación sindical (relevante en análisis de representación). Su tratamiento activa un flujo reforzado con base jurídica adicional del art. 9.2 y aprobación expresa del DPO.

**Minimización.** El sistema no ingiere campos que no necesita. Nombre y apellidos se pseudonimizan en ingesta; la tabla de correspondencia vive cifrada y separada, con acceso restringido y registrado.

**k-anonimato.** Ninguna cifra desglosada se publica si la celda contiene menos de k individuos. k=5 por defecto, configurable al alza. Esto se aplica también a las combinaciones: una categoría con 20 personas pero solo 2 mujeres no publica desglose por sexo. Es un control de reidentificación, y es también una salvaguarda de calidad estadística.

**DPIA.** Obligatoria (art. 35 RGPD) por concurrir evaluación sistemática de aspectos personales, tratamiento a gran escala y uso de tecnología innovadora. El producto incluye una plantilla de DPIA precumplimentada que el cliente adapta, y el sistema no ejecuta análisis para un tenant sin DPIA registrada y vigente.

**Derechos del interesado.** Flujos implementados para acceso, rectificación, supresión, limitación, portabilidad y oposición. La supresión propaga a índices vectoriales, cachés y copias de seguridad conforme al procedimiento documentado. La supresión de datos incluidos en un informe ya emitido se resuelve mediante redacción del contenido conservando el registro de auditoría, no mediante borrado del expediente.

### 10.4 Cifrado y gestión de claves

```
En tránsito     TLS 1.3 obligatorio. mTLS entre servicios internos.
En reposo       AES-256-GCM con cifrado de sobre.
                Clave de datos por tenant, envuelta por clave maestra en HSM.
                Rotación de clave de datos: anual o ante incidente.
En uso          Pseudonimización en ingesta. Confidential computing para el
                motor analítico en despliegues que lo exijan.
Claves          KMS con respaldo HSM en región UE.
                BYOK disponible en plan Enterprise: el cliente aporta y
                controla su clave maestra, y revocarla inutiliza sus datos.
```

### 10.5 Trazabilidad y registro

El `audit_log` es append-only, con hash encadenado tipo blockchain ligera: cada registro incluye el hash del anterior, de modo que alterar un registro invalida toda la cadena posterior. Se sella periódicamente en almacenamiento WORM.

Cada entrada registra: actor (humano o agente, identificado), acción, recurso, tenant, timestamp, IP, resultado, y para acciones de agente además el modelo, la versión de prompt, la versión de corpus, los tokens consumidos y el `evidence_id` producido.

**Prompt injection.** El contenido de los documentos del cliente es dato, no instrucción. El sistema aplica:

- Delimitación explícita del contenido no confiable en el prompt.
- Instrucción en cada prompt de sistema de no seguir directrices contenidas en documentos analizados.
- Detección de patrones de inyección en ingesta, con marcado del documento.
- Ninguna herramienta de escritura o acción externa se ejecuta sin confirmación humana, lo que limita el daño de una inyección exitosa a la generación de un texto incorrecto, que el Critic y el revisor humano deben interceptar.

---

## 11. Observabilidad

### 11.1 Arquitectura

```
Aplicación · Agentes · Herramientas
        │  OpenTelemetry SDK (trazas, métricas, logs)
        ▼
OTel Collector  ──┬──→ Tempo      trazas distribuidas
                  ├──→ Prometheus métricas
                  ├──→ Loki       logs
                  └──→ Langfuse   trazas específicas de LLM
                                  (autoalojado, región UE)
        │
        ▼
Grafana · paneles por audiencia: SRE · producto · finanzas · calidad
        │
        ▼
Alertmanager → PagerDuty (severidad 1) · Slack (severidad 2 y 3)
```

Una traza cubre la sesión completa, con un span por subagente, un span por llamada a modelo y un span por invocación de herramienta. Cada span lleva `tenant_id`, `case_id`, `agent`, `model`, `prompt_version`, `corpus_version`.

### 11.2 Métricas

#### Rendimiento

| Métrica | Objetivo de diseño | Alerta |
|---|---|---|
| Latencia p50 del chat consultivo | < 4 s | p95 > 15 s |
| Latencia p95 del análisis de una oferta | < 45 s | > 90 s |
| Latencia p95 de auditoría completa (1.000 empleados) | < 20 min | > 45 min |
| Tiempo hasta el primer token | < 2 s | > 5 s |
| Disponibilidad de API | 99,9% mensual | presupuesto de error consumido al 50% |

Estas cifras son objetivos de diseño para dimensionar la infraestructura. `[VALIDATE: sustituir por medición real tras la fase beta, con distribución por tamaño de plantilla y por complejidad de estructura salarial]`

#### Coste

| Métrica | Por qué importa |
|---|---|
| Tokens de entrada y salida por sesión, por modelo | Base del margen unitario |
| **Tasa de acierto de caché** (`cache_read / (cache_read + cache_creation + input)`) | Es la palanca de coste más grande del sistema. Objetivo superior al 70% en el prefijo global. Si cae de forma sostenida, hay un invalidador silencioso |
| Coste por auditoría completa | Base de la tarificación |
| Coste por análisis de oferta | Debe caer con Batch API |
| Coste por tenant y mes frente a ingreso | Detecta clientes deficitarios |
| Proporción de tokens en Batch API | Cada punto ganado es 50% de descuento en ese volumen |
| Distribución de tokens por modelo | Si Opus supera el porcentaje presupuestado, hay que revisar el enrutado |

#### Calidad

| Métrica | Cómo se mide |
|---|---|
| **Cobertura de citación** | Proporción de afirmaciones normativas con artículo verificable en corpus. Objetivo: 100%. Medido de forma determinista por QA |
| **Cifras huérfanas** | Cifras sin `evidence_id`. Objetivo: cero. Determinista |
| **Tasa de alucinación normativa** | Citas a artículos inexistentes o con contenido distinto al afirmado. Verificación determinista contra corpus, con muestreo humano mensual del 5% |
| **Tasa de rechazo del Critic** | Proporción de hallazgos rechazados en primera vuelta. Una tasa muy baja sugiere un Critic complaciente; muy alta, subagentes mal calibrados. Banda esperada por definir tras la beta |
| **Tasa de anulación humana** | Proporción de hallazgos que el revisor rechaza tras pasar el Critic. Es la métrica más honesta de calidad real del sistema. Una tendencia al alza es señal de degradación |
| **Precisión y exhaustividad en detección de sesgo** | Contra conjunto anotado por humanos. `[VALIDATE: construcción del conjunto de referencia anotado, con acuerdo entre anotadores medido]` |
| **Concordancia entre ejecuciones** | Misma entrada, dos ejecuciones: ¿hallazgos equivalentes? Mide estabilidad |
| **Deriva de corpus** | Diferencia en la suite de 200 consultas de regresión tras actualizar el corpus |

#### Producto y negocio

Adopción por módulo, tiempo desde carga de datos hasta informe firmado, proporción del plan de acción efectivamente ejecutado a 90 días, reducción de brecha medida en auditorías sucesivas del mismo cliente, NPS, retención neta por ingresos.

### 11.3 Bucle de retroalimentación

```
Revisor humano rechaza un hallazgo
        │
        ▼
Se captura: hallazgo · motivo de rechazo · corrección aplicada
        │
        ▼
Clasificación automática del tipo de fallo (haiku-4-5)
   ├ error de cálculo        → test de regresión en el motor determinista
   ├ error de interpretación → caso añadido a la suite de evaluación
   ├ error normativo         → revisión del corpus por el equipo jurídico
   ├ error de calibración    → ajuste de umbral, versionado
   └ falso positivo          → refinamiento del prompt del subagente
        │
        ▼
Revisión semanal del equipo de producto sobre los rechazos agregados
        │
        ▼
Cambio versionado, con evaluación previa antes de publicar
```

Ningún cambio de prompt llega a producción sin pasar la suite de evaluación. Los prompts son código y siguen el mismo ciclo: rama, revisión, evaluación, despliegue progresivo.

---

## 12. Roadmap de desarrollo

### Fase 1 · MVP

**Objetivo:** demostrar que el análisis normativo automatizado produce hallazgos que un experto reconoce como correctos.

Alcance: analizador de ofertas de empleo y asistente conversacional sobre normativa. Un solo país (España). Corpus con Directiva 2023/970, RD 902/2020, RD 901/2020 y art. 28 ET. Subagentes: Legal, Compliance, Bias Detection, Critic, QA. Sin integraciones: carga manual de ficheros. Mono-tenant en despliegue, multi-tenant en esquema de datos.

Criterio de salida: sobre un conjunto de 100 ofertas reales anonimizadas, la concordancia con el criterio de un experto humano supera el umbral acordado, y la tasa de citación normativa verificable es del 100%. `[VALIDATE: umbral de concordancia acordado con el equipo jurídico]`

Riesgo principal: que el corpus normativo sea insuficiente para responder con precisión a preguntas reales de clientes. Mitigación: construir el corpus antes que el producto.

### Fase 2 · Beta con clientes piloto

**Objetivo:** validar el flujo completo de auditoría con dato real y medir la tasa de anulación humana.

Se añade: motor analítico completo, auditoría retributiva de extremo a extremo, valoración de puestos, evaluación de cumplimiento artículo por artículo, generación de plan de acción, primeras integraciones (Excel, SharePoint, un HRIS), multi-tenant real con RLS, panel de administración básico, registro de auditoría con hash encadenado.

Criterio de salida: tres clientes piloto completan una auditoría de principio a fin y aprueban el informe. Tasa de anulación humana por debajo del umbral definido. `[VALIDATE: clientes piloto y umbral]`

Riesgo principal: la calidad del dato de entrada real es peor de lo previsto y bloquea el análisis. Mitigación: invertir desproporcionadamente en el módulo de perfilado y en la comunicación clara de qué falta y por qué importa.

### Fase 3 · Enterprise

**Objetivo:** ser desplegable en gran empresa europea sin excepciones de seguridad.

Se añade: SSO SAML y OIDC con aprovisionamiento SCIM, RBAC y ABAC completos, BYOK, integraciones con SAP SuccessFactors y Workday, multipaís con corpus de al menos cuatro jurisdicciones, exportación en los formatos de los organismos de seguimiento, API pública documentada, certificación ISO 27001 y SOC 2 Tipo II, expediente de conformidad del AI Act.

`[VALIDATE: certificaciones ISO 27001 y SOC 2 no obtenidas a fecha de este documento. No comunicar como disponibles hasta que lo estén.]`

Riesgo principal: el ciclo de certificación y el de conformidad del AI Act se solapan y consumen capacidad de producto. Mitigación: iniciarlos en paralelo con la fase 2, no después.

### Fase 4 · Multiempresa y grupo

**Objetivo:** servir a grupos con estructura societaria compleja y a consultoras que operan sobre varios clientes.

Se añade: jerarquía de organizaciones con consolidación de grupo y aislamiento por filial, comparación entre filiales con control de confidencialidad, modo consultora con separación estricta por cliente, benchmarking sectorial anónimo con agregación que impida la reidentificación, análisis predictivo de evolución de brecha, integración con el ciclo de revisión salarial.

Riesgo principal: el benchmarking anónimo es la funcionalidad más solicitada y la más peligrosa. Un diseño descuidado permite deducir el dato de un competidor. Mitigación: privacidad diferencial, umbrales mínimos de participantes por celda, y revisión externa del diseño antes de lanzarlo.

### Fase 5 · Plataforma y marketplace

**Objetivo:** convertir el producto en plataforma sobre la que terceros construyen.

Se añade: SDK en Python y TypeScript, webhooks, marketplace de módulos verticales y de conectores desarrollados por partners, módulos por país mantenidos por despachos locales, motor de reglas configurable por el cliente, agentes personalizados dentro del marco de gobernanza, programa de partners con certificación.

Riesgo principal: un módulo de tercero emite una conclusión normativa errónea bajo la marca de la plataforma. Mitigación: certificación obligatoria de cada módulo, aislamiento de ejecución, y separación visual clara entre contenido de Datalent y contenido de partner.

---

## 13. Stack tecnológico

| Capa | Recomendación | Alternativas evaluadas | Por qué esta |
|---|---|---|---|
| Frontend | Angular 20 + Angular Material | Next.js, SvelteKit | Coherencia con el stack existente de Datalent, formularios reactivos adecuados para auditoría, DI que encaja con un dominio complejo |
| Gestión de estado | NgRx Signal Store | Servicios con signals | Trazabilidad del estado en flujos de aprobación multi-paso |
| Backend API | Python 3.12 + FastAPI | NestJS, Go | El dominio es estadístico; `statsmodels` y `scipy` no tienen equivalente en JS. Un solo lenguaje, un solo modelo de dominio |
| Workers asíncronos | Celery + Redis | ARQ, Temporal | Madurez y observabilidad. Temporal si los flujos de aprobación se vuelven muy largos |
| Orquestación agéntica | Claude API + tool runner autoalojado | Managed Agents, LangGraph, CrewAI | Control total sobre dónde se ejecuta el código y dónde vive el dato, que es el argumento europeo. Managed Agents reduce el time-to-market pero cede el sandbox |
| Modelos | `claude-opus-5` razonamiento · `claude-sonnet-5` volumen · `claude-haiku-4-5` clasificación | Modelo único | El enrutado por complejidad es la palanca de margen más directa |
| Residencia de inferencia | `inference_geo: "eu"` | Bedrock `eu-central-1` | Paridad de funcionalidad completa. Bedrock pierde Batch API y Files API |
| Base de datos | PostgreSQL 16 con RLS | MySQL, CockroachDB | RLS nativo es la primitiva de aislamiento multi-tenant. Extensiones maduras |
| Base vectorial | pgvector con índice HNSW | Qdrant, Weaviate, Pinecone | Un solo sistema hasta el orden de decenas de millones de chunks, con la misma transacción y el mismo RLS. Migración a Qdrant cuando la escala lo exija |
| Búsqueda léxica | `tsvector` de PostgreSQL con configuración por idioma | Elasticsearch, OpenSearch | Evita otro sistema hasta que el volumen lo justifique |
| Caché y colas | Redis 7 | Valkey, RabbitMQ | Doble uso, operación conocida |
| Objetos | S3 en región UE, MinIO en despliegue autoalojado | Azure Blob, GCS | Object Lock para WORM |
| Autenticación | Keycloak autoalojado | WorkOS, Auth0 | Soberanía. WorkOS acelera SAML y SCIM a coste de una dependencia estadounidense en el camino de autenticación |
| Autorización | Open Policy Agent | Cedar, lógica en aplicación | Política como código, versionada y testeable |
| Contenedores | Docker + Kubernetes (EKS) | ECS, Nomad | Estándar para el comprador enterprise |
| IaC | Terraform + Terragrunt | Pulumi, CDK | Multi-nube real, que importa si un cliente exige nube soberana |
| Entrega continua | GitHub Actions + ArgoCD | GitLab CI, Flux | GitOps con despliegue auditable |
| Observabilidad | OpenTelemetry + Grafana LGTM | Datadog, New Relic | Sin salida de telemetría de la UE, sin coste por host |
| Trazas de LLM | Langfuse autoalojado | LangSmith, Braintrust | Autoalojable en la UE |
| Secretos | HashiCorp Vault | AWS Secrets Manager | Portable entre nubes |
| Documentos | `python-docx`, `python-pptx`, `openpyxl`, `pdfplumber`, WeasyPrint | Aspose, Gotenberg | Sin licencias propietarias en el camino crítico |
| Nube | AWS `eu-central-1` (Fráncfort) primaria, `eu-west-1` (Irlanda) secundaria | Azure UE, OVHcloud, Scaleway | Madurez operativa. Ruta a nube soberana preparada para sector público |

**Sobre la elección de nube.** AWS es la opción operativamente sensata y la que peor argumento soberano ofrece frente a un comprador público europeo. La arquitectura se mantiene portable (Kubernetes, Terraform, PostgreSQL, MinIO, todo autoalojable) precisamente para poder trasladarla a un proveedor soberano si un contrato lo exige, sin reescribir el producto. Esa portabilidad tiene un coste continuo en no usar servicios gestionados propietarios, y es un coste que conviene asumir de forma consciente.

---

## 14. Escalabilidad

### 14.1 Modelo de carga

Supuestos de dimensionamiento, a validar con datos reales:

- Empresa media de 1.000 empleados
- Una auditoría completa al año, más una revisión trimestral
- 200 ofertas de empleo al año
- 500 consultas al asistente conversacional al año
- Picos fuertes en dos ventanas: cierre de ejercicio y campaña de revisión salarial

`[VALIDATE: perfil real de uso tras la fase beta. La estacionalidad es probablemente el factor de dimensionamiento dominante y no está medida.]`

### 14.2 Evolución por escala

```
┌─ 10 EMPRESAS ────────────────────────────────────────────────────────────┐
│ Monolito modular. Postgres único con RLS. Un pool de workers.            │
│ 3 réplicas de API, 2 de worker. Sin sharding.                            │
│ Foco: iterar rápido. La complejidad prematura mata más productos que la  │
│ carga.                                                                   │
├─ 100 EMPRESAS ───────────────────────────────────────────────────────────┤
│ Separación de servicios: API · workers de análisis · workers de agente.  │
│ Réplicas de lectura en Postgres. Autoescalado horizontal por profundidad │
│ de cola. Colas por prioridad: interactivo · lote · programado.           │
│ pgvector con particionado por tenant. Caché de resultados analíticos.    │
├─ 1.000 EMPRESAS ─────────────────────────────────────────────────────────┤
│ Sharding de Postgres por rango de tenant. Índice vectorial extraído a    │
│ Qdrant en clúster. Multi-región activo-activo dentro de la UE.           │
│ Pool de tenants dedicado para clientes Enterprise que lo contraten.      │
│ CDN para activos. Presupuesto de tokens por tenant con degradación       │
│ elegante en lugar de error.                                              │
├─ 10.000 EMPRESAS ────────────────────────────────────────────────────────┤
│ Aislamiento por celdas: cada celda es un despliegue completo que sirve a │
│ un subconjunto de tenants. Un fallo afecta a una celda, no a la          │
│ plataforma. Enrutado por celda en el borde.                              │
│ Plano de control separado del plano de datos.                            │
│ Batch API como camino por defecto para todo lo no interactivo.           │
│ Caché semántico de consultas normativas frecuentes, compartido entre     │
│ tenants por ser corpus global (nunca dato de cliente).                   │
└──────────────────────────────────────────────────────────────────────────┘
```

### 14.3 Alta disponibilidad

Objetivos: RTO de 4 horas, RPO de 15 minutos para el plano de datos; RTO de 1 hora para el plano de control. `[VALIDATE: objetivos contractuales por nivel de plan]`

Mecanismos: despliegue multi-AZ en cada región, réplica en espera caliente en la región secundaria, copias de seguridad continuas con recuperación a un punto en el tiempo, prueba de recuperación trimestral con ejercicio real de restauración, degradación por niveles (si el proveedor de inferencia está degradado, el sistema mantiene consulta de informes históricos y análisis determinista, deshabilitando solo la generación).

### 14.4 Control de coste unitario

Palancas ordenadas por impacto:

1. **Caché de prompt.** El corpus normativo y los prompts de sistema son idénticos entre peticiones. Con TTL de una hora y una tasa de acierto superior al 70%, el ahorro sobre la porción cacheada se acerca al 90%.
2. **Batch API.** Todo lo no interactivo (análisis masivo de ofertas, auditorías programadas, reprocesamiento tras actualización de corpus) va por lotes al 50% del precio.
3. **Enrutado por modelo.** Clasificación y extracción a Haiku, volumen a Sonnet, razonamiento jurídico y crítica a Opus.
4. **Nivel de esfuerzo.** Opus 5 rinde bien en `low` y `medium`; el nivel por defecto no debe heredarse de la generación anterior sin medición. Un barrido de esfuerzo sobre el conjunto de evaluación propio es la optimización con mejor retorno por hora invertida.
5. **Presupuesto de tarea.** `task_budget` en bucles agénticos para que el agente se autorregule.
6. **Caché de resultados deterministas.** Un cálculo de brecha sobre un dataset inmutable no se repite: se sirve de caché con clave por hash del dataset y versión del motor.

---

## 15. Diseño SaaS

### 15.1 Aislamiento multi-tenant

```
┌──────────────────────────────────────────────────────────────────────────┐
│ NIVEL 1 · POOLED         Planes Starter y Professional                   │
│   Infraestructura compartida. Aislamiento por RLS en Postgres.           │
│   Clave de cifrado por tenant. Prefijo de almacenamiento por tenant.     │
│   Cuotas por tenant para evitar el efecto vecino ruidoso.                │
├──────────────────────────────────────────────────────────────────────────┤
│ NIVEL 2 · BRIDGED        Plan Enterprise                                 │
│   Base de datos dedicada, cómputo compartido.                            │
│   BYOK. Ventana de mantenimiento propia.                                 │
├──────────────────────────────────────────────────────────────────────────┤
│ NIVEL 3 · SILOED         Enterprise Plus y sector público                │
│   Despliegue completo dedicado, opcionalmente en la nube del cliente.    │
│   Aislamiento de red. Precio con prima significativa.                    │
└──────────────────────────────────────────────────────────────────────────┘
```

La RLS es obligatoria en toda tabla con `tenant_id`. Ninguna consulta de aplicación filtra por tenant en el código: el filtro vive en la base de datos, de forma que un error de programación no puede provocar una fuga entre clientes. El conjunto de pruebas incluye un test que intenta explícitamente el acceso cruzado y que debe fallar.

### 15.2 Roles y permisos

Los roles de la sección 10.1, más la jerarquía de organización:

```
Organización (grupo empresarial)
  └── Entidad legal (filial)
        └── Unidad organizativa (división, centro)
              └── Categoría profesional
```

Los permisos se conceden a un nodo y heredan hacia abajo. Un Compensation Lead de la filial española ve España y sus divisiones, no Alemania.

### 15.3 Planes y tarificación

| | Starter | Professional | Enterprise | Enterprise Plus |
|---|---|---|---|---|
| Plantilla | hasta 250 | hasta 1.000 | hasta 10.000 | sin límite |
| Analizador de ofertas | ✓ | ✓ | ✓ | ✓ |
| Asistente normativo | ✓ | ✓ | ✓ | ✓ |
| Auditoría retributiva | 1 al año | trimestral | ilimitada | ilimitada |
| Análisis de bandas | | ✓ | ✓ | ✓ |
| Valoración de puestos | | ✓ | ✓ | ✓ |
| Plan de acción | | ✓ | ✓ | ✓ |
| Integraciones HRIS | | 1 | ilimitadas | ilimitadas |
| Multipaís | | | ✓ | ✓ |
| SSO y SCIM | | | ✓ | ✓ |
| BYOK | | | ✓ | ✓ |
| API y SDK | | limitado | ✓ | ✓ |
| Despliegue dedicado | | | | ✓ |
| Soporte | email | prioritario | CSM asignado | CSM + consultor senior |

Modelo de precio: suscripción anual por tramo de plantilla, más consumo por encima de la cuota incluida de auditorías y de análisis de ofertas. Este modelo alinea el precio con el valor (evitar sanción y litigio, que escala con plantilla) y no con el coste de inferencia.

`[VALIDATE: puntos de precio concretos por plan, tras análisis de disposición a pagar y de precios de referencia del mercado europeo de compliance retributivo]`

### 15.4 Panel de administración

**Del cliente:** usuarios y roles, jerarquía organizativa, integraciones y credenciales, umbral de k-anonimato y política de privacidad, plantillas de entregable, registro de auditoría exportable, consumo frente a cuota, gestión de la DPIA y del expediente de conformidad del AI Act.

**De Datalent:** salud de tenants, consumo y margen unitario por cliente, gestión de planes y cuotas, publicación de versiones de corpus, banderas de funcionalidad por tenant, acceso de soporte con doble aprobación y ventana temporal, cola de incidencias de calidad procedente del bucle de retroalimentación.

### 15.5 Gestión documental

```
Carga → Antivirus → Clasificación → Extracción → Indexación → Retención
  │                                                              │
  ▼                                                              ▼
Versionado         Cada documento mantiene           Política por tipo:
inmutable          histórico completo                normativa: indefinida
                   con quién subió qué y cuándo      del cliente: contrato + legal
                                                     evidencias: 6 años
                                                     borradores: 90 días
```

Los documentos de evidencia se sellan con hash y timestamp, y se conservan en almacenamiento WORM durante el periodo de conservación. Un informe emitido no se modifica: se emite una versión nueva que referencia a la anterior.

### 15.6 Facturación

Stripe Billing para suscripción y consumo. Eventos de uso emitidos por el propio sistema de telemetría, con conciliación diaria entre el consumo registrado y el facturado. Facturación electrónica conforme a los requisitos de cada país. `[VALIDATE: requisitos de facturación electrónica obligatoria por jurisdicción de operación]`

Los umbrales de consumo generan aviso al 80% y al 100% de la cuota, con degradación a cola de baja prioridad en lugar de bloqueo, salvo que el cliente configure un tope estricto.

### 15.7 API pública y SDK

```
POST /v1/job-postings:analyze        análisis de oferta, síncrono
POST /v1/job-postings:batch          lote de ofertas, asíncrono
POST /v1/pay-audits                  inicia auditoría, devuelve audit_id
GET  /v1/pay-audits/{id}             estado y resultados
GET  /v1/pay-audits/{id}/report      entregado en el formato solicitado
POST /v1/compliance:assess           evaluación de cumplimiento
GET  /v1/compliance/score            puntuación vigente
POST /v1/action-plans                genera plan de acción
GET  /v1/evidence/{id}               recupera evidencia con su cadena
POST /v1/chat:query                  consulta al asistente normativo
GET  /v1/corpus/versions             versiones de corpus disponibles
```

Convenciones: autenticación OAuth 2.0 con client credentials, idempotencia por `Idempotency-Key`, paginación por cursor, webhooks firmados con HMAC para eventos de finalización, versionado en la ruta con soporte de la versión anterior durante 12 meses tras el anuncio de retirada.

SDK en Python y TypeScript generados desde la especificación OpenAPI, con reintentos y backoff, tipado completo y helpers para los flujos largos (sondeo o webhook).

### 15.8 Marketplace

Tres categorías de contribución de terceros:

- **Módulos por jurisdicción.** Un despacho local mantiene el corpus y las reglas de su país. Modelo de reparto de ingresos. Requiere certificación anual del contenido.
- **Conectores.** Integraciones con HRIS y sistemas de nómina regionales que Datalent no cubre.
- **Plantillas de entregable.** Formatos específicos por sector o por organismo de seguimiento.

Requisitos de admisión: revisión de seguridad, ejecución aislada, trazabilidad de qué contenido procede del partner y cuál de Datalent, y responsabilidad contractual definida. Un módulo de tercero que emita una conclusión normativa errónea bajo la marca de la plataforma es el riesgo reputacional más serio de esta fase, y la certificación es la única mitigación real.

---

## Anexo A · Especificación del agente en formato Datalent

Conforme a `.claude/templates/agent-spec-template.md`.

**Objetivo.** Reducir el riesgo de incumplimiento de la Directiva (UE) 2023/970 en organizaciones europeas mediante diagnóstico, evidencia y planes de acción producidos por un sistema agéntico gobernado.

**Límite de autonomía.**

Puede decidir y ejecutar sin firma humana:
- Planificar y ejecutar el análisis dentro del alcance contratado
- Invocar herramientas de solo lectura sobre fuentes autorizadas
- Ejecutar cálculos deterministas y consultar el corpus normativo
- Generar borradores de hallazgo, informe y plan de acción
- Rechazar y reintentar su propio trabajo mediante el bucle crítico
- Abortar una ejecución por calidad de dato insuficiente

Nunca sin firma humana:
- Emitir una conclusión sobre la retribución de una persona identificada
- Publicar, exportar o comunicar cualquier entregable
- Escribir en un sistema del cliente
- Reidentificar a un empleado pseudonimizado
- Ejecutar un ajuste retributivo
- Remitir información a una autoridad
- Declarar cumplimiento normativo pleno

**Disparadores de escalado.**
- Brecha igual o superior al 5% en una categoría sin justificación objetiva documentada (art. 10)
- Categoría con n inferior al umbral k del tenant
- Completitud del dato por debajo del umbral configurado
- Contradicción entre norma UE y norma nacional en el corpus
- Segundo rechazo del mismo hallazgo por el Critic
- Confianza del Legal Agent en nivel BAJA sobre una conclusión material
- Detección de posible tratamiento de categorías especiales del art. 9 RGPD
- Ausencia de base jurídica o de DPIA registrada para el tratamiento solicitado

**Punto de control humano.** Antes de toda entrega. Rol responsable: Compensation Lead o Legal/Compliance Lead según la naturaleza del hallazgo, con veto del DPO en materia de privacidad. El revisor accede al hallazgo, su evidencia, el método aplicado, el nivel de confianza y la objeción del Critic. Se registra identidad, momento, versión revisada, decisión y motivo.

**Entradas y fuentes de datos.** Registro retributivo y nóminas (contiene datos personales, pseudonimizados en ingesta), estructura salarial, descripciones de puesto, convenio colectivo, políticas internas, ofertas de empleo, auditorías previas, corpus normativo global.

**Estado de gobernanza.**
- **Nivel de riesgo EU AI Act:** Alto riesgo, Anexo III.4(b), para los módulos que producen recomendaciones sobre condiciones retributivas individuales. La excepción del art. 6.3 no es invocable por concurrir perfilado. El asistente conversacional de consulta normativa queda en riesgo limitado con obligación de transparencia del art. 50. `[VALIDATE: confirmación por asesoría especializada, por módulo y por modalidad de comercialización]`
- **Estado de pruebas de sesgo:** `[VALIDATE: metodología y fecha de la primera evaluación de sesgo del propio sistema, incluyendo conjunto de referencia anotado y medida de acuerdo entre anotadores]`
- **Residencia de datos:** Diseño para región UE en cómputo, almacenamiento e inferencia. `[VALIDATE: garantía contractual de residencia de inferencia con el proveedor de modelo, por escrito]`
- **Evaluación de la conformidad:** `[VALIDATE: procedimiento aplicable conforme al art. 43 y, en su caso, organismo notificado. No iniciada a la fecha de este documento]`

**Modo de fallo.** Los fallos posibles y su interceptación:

| Fallo | Cómo se detecta | Consecuencia si escapa |
|---|---|---|
| Cita normativa inexistente | Verificación determinista contra corpus en QA | Informe con fundamento falso ante inspección |
| Cifra sin respaldo del motor | Comprobación de `evidence_id` en QA | Cifra indefendible bajo el art. 18 |
| Falso positivo de discriminación | Critic + revisión humana | Acusación infundada, daño de confianza |
| Falso negativo | Muestreo humano periódico + auditoría externa | Sanción por incumplimiento no detectado |
| Reidentificación | Umbral k determinista + QA | Brecha de datos personales |
| Norma desactualizada | Sondeo de fuentes + versionado de corpus | Análisis contra norma derogada |
| Inyección de prompt vía documento | Detección en ingesta + confirmación humana en toda acción externa | Contenido manipulado en el entregable |

El fallo con peor consecuencia es el falso negativo, porque no genera señal. Por eso el muestreo humano periódico no es opcional, y por eso conviene contratar una auditoría externa independiente del propio sistema con periodicidad anual.

---

## Anexo B · Resumen de marcadores de validación

Antes de usar cualquier parte de este documento en material comercial o en una propuesta a cliente, hay que resolver los siguientes puntos:

1. ~~Estado y contenido de la norma española de transposición de la Directiva 2023/970~~ **RESUELTO 2026-07-29: no hay transposición. Ver `corpus/es/MANIFEST.md`.** Queda pendiente el contraste del borrador contra texto oficial
2. Designación y API de cada organismo nacional de seguimiento (art. 29)
3. Existencia de servidores MCP oficiales para EUR-Lex, Factorial, Cegid/Meta4 y Cornerstone
4. Proveedor de datos de mercado con licencia comercial, cobertura y metodología documentada
5. Selección del modelo de embedding tras evaluación multilingüe
6. Validación del diccionario de sesgo léxico adaptado al español contra corpus anotado
7. Confirmación de la clasificación de riesgo bajo el AI Act por asesoría especializada
8. Procedimiento de evaluación de la conformidad y organismo notificado
9. Garantía contractual por escrito de residencia de inferencia en la UE
10. Plazos de conservación exigibles por jurisdicción
11. Cifras reales de latencia, coste y calidad tras la fase beta
12. Umbrales de concordancia con criterio experto acordados con el equipo jurídico
13. Puntos de precio por plan
14. Certificaciones ISO 27001 y SOC 2, no obtenidas a la fecha
15. Requisitos de facturación electrónica por jurisdicción
16. Eventuales modificaciones del calendario de aplicación del AI Act

---

*Documento producido bajo el sistema operativo de IA de Datalent Solutions. Conforme a `.claude/CLAUDE.md`, regla 1 (no fabricación), regla 2 (distinción entre automatización asistida y sistema agéntico), regla 3 (toda afirmación de gobernanza lleva nivel de riesgo), regla 4 (marco europeo estructural), regla 5 (cita de fuentes) y regla 7 (este documento no modifica el sitio web).*
