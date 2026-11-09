# Pay Transparency Compliance Agent · implementación

Fase 1 del roadmap de [`docs/pay-transparency-agent-architecture.md`](../docs/pay-transparency-agent-architecture.md): asistente normativo sobre el corpus verificado de [`corpus/`](../corpus/).

## Poner en marcha

```bash
pip install -r agent/requirements.txt
export ANTHROPIC_API_KEY=...        # o bien:  ant auth login
python agent/cli.py estado
python agent/cli.py preguntar "¿Tengo que publicar la banda salarial en mis ofertas?"
```

Sin credenciales funciona igualmente todo lo determinista, que es la mitad del sistema:

```bash
python agent/tests/test_guard.py    # 10 tests de la guardia
python agent/tests/test_harness.py  #  7 tests del arnés
python agent/tests/test_ofertas.py  # 11 tests del analizador de ofertas
python agent/tests/test_api.py      # 17 tests del servicio, auth y auditoría
python agent/cli.py oferta oferta.txt
python agent/cli.py estado          # diagnóstico de corpus y registro
python agent/cli.py casos           # los 32 casos de regresión
python agent/cli.py guard fichero   # pasa un texto por la guardia
```

## Las dos decisiones que definen esta implementación

### 1. Sin RAG, y a propósito

La arquitectura especifica pgvector con HNSW, BM25, fusión RRF y reranker cross-encoder. **No está construido, y no debe construirse todavía.**

El corpus verificado son ~15k tokens. Cabe entero en el prompt de un modelo con ventana de 1M, con caché de una hora que lo deja en 0,1x de coste a partir de la segunda llamada. Montar la pila vectorial hoy sería resolver un problema de escala inexistente, y a cambio introduciría la clase de fallo más peligrosa para este producto: recuperar el fragmento equivocado y responder con aplomo sobre el artículo que no era.

`cli.py estado` vigila el umbral y avisa cuando toque cambiar de estrategia:

- **~150k tokens de corpus**, o
- **aparición de corpus por tenant** que impidan un prefijo compartido cacheado

Hasta entonces, el corpus va en el prompt.

### 2. El modelo no cita en prosa libre

Toda referencia normativa se emite en formato canónico:

```
[[UE-DIR-2023-970 art. 10|INTERPRETATIVO]]
[[ES-ET art. 28.3|VIGENTE]]
```

Una guardia determinista (`pta/guard.py`, sin modelo) resuelve cada token contra `corpus/registry.json` y **rechaza la respuesta entera** si algo falla. El agente reintenta una vez con los errores concretos como mensaje de operador, y si vuelve a fallar devuelve el rechazo en lugar de una respuesta indefendible.

Esto no es validación de formato. Es la única defensa del sistema que no puede alucinar, y por eso es la que decide.

## Qué comprueba la guardia

| Código | Qué intercepta |
|---|---|
| `G1` | Instrumento inexistente en el registro |
| `G2` | Artículo no verificado, aunque esté dentro del rango del instrumento |
| `G3` | Estado de regla no reconocido |
| `G4` | Estado incorrecto. Marcar como `VIGENTE` la Directiva no transpuesta |
| `G5` | Referencia normativa en prosa suelta, fuera del formato verificable |
| `G6` | Afirmar incumplimiento apoyándose en norma `INTERPRETATIVO` o `PREVISTO` |
| `G7` | Importe económico junto a un instrumento cuyas cuantías no están verificadas |
| `G8` | Importe que no coincide con ninguna cuantía verificada del instrumento |

`G2` merece una nota. Que la Directiva tenga 37 artículos no autoriza a citar el 19: solo son citables los artículos cuyo contenido está verificado en el corpus. Citar por deducción del rango es precisamente el fallo que este registro existe para impedir.

`G7` y `G8` ilustran cómo la guardia madura con el corpus. Mientras las cuantías de la LISOS no estaban verificadas, `G7` bloqueaba **cualquier** importe: seguro pero inútil. Verificadas, `G7` deja paso a `G8`, que compara contra la lista de cuantías reales. Un importe verosímil pero inexacto es peor que ninguno, porque el cliente presupuesta con él.

`G4` y `G6` son el mismo error visto desde dos ángulos, y es el que Datalent cometió en su propio documento de arquitectura antes de construir el corpus. El test `test_estado_incorrecto_es_el_error_del_diseno_original` lo conserva como regresión permanente.

## Estructura

```
agent/
├── cli.py                  estado · guard · casos · preguntar
├── requirements.txt
├── pta/
│   ├── registry.py         carga corpus/registry.json
│   ├── guard.py            guardia determinista  ← el núcleo
│   ├── corpus.py           corpus a bloques cacheados
│   ├── prompts.py          prompts congelados por versión
│   ├── assistant.py        llamada al modelo + bucle de guardia
│   └── evalsuite.py        lee la suite de regresión desde markdown
└── tests/test_guard.py
```

La suite de regresión vive en markdown dentro de `corpus/`, no en código, porque la mantiene el equipo jurídico y no debe requerir tocar Python para añadir un caso.

## Arnés de evaluación

```bash
python3 agent/cli.py eval --replay agent/tests/fixtures/replay-demo.json
python3 agent/cli.py eval --only A1,B4 --juez        # en vivo, requiere clave
python3 agent/cli.py eval --out resultados.json
```

Dos capas, deliberadamente asimétricas:

- **Determinista y bloqueante.** Guardia, citas requeridas, estado declarado, patrones exigidos y prohibidos. Sin modelo, reproducible. Un solo fallo bloquea la publicación del corpus.
- **Juez, informativo.** Un modelo puntúa corrección sustantiva y calibración contra la respuesta esperada en prosa. **Nunca bloquea por sí solo**: un juez que decide publicaciones es un juez que hay que auditar, y este no está calibrado todavía.

Los casos llevan aserciones comprobables en líneas `⊨` dentro del propio markdown, de modo que el equipo jurídico añade casos sin tocar Python:

```
**A1.** ¿Está obligada hoy mi empresa a publicar la banda salarial?
→ Esperado: No, aún no. España no ha transpuesto la Directiva...
⊨ citas: UE-DIR-2023-970 art. 5
⊨ estado: INTERPRETATIVO
⊨ debe: transpu
```

El modo `--replay` ejecuta la capa determinista sobre respuestas grabadas. Sirve para probar el arnés y para reejecutar la suite tras tocar la guardia sin volver a pagar tokens.

## Analizador de ofertas de empleo

```bash
python3 agent/cli.py oferta oferta.txt
```

Cinco ejes deterministas, con puntuación de riesgo 0-100:

| Eje | Detecta | Confianza |
|---|---|---|
| `cumplimiento` | Ausencia de banda retributiva · solicitud de historial retributivo | ALTA |
| `sesgo` | Genérico masculino sin forma inclusiva | ALTA |
| `edad` | Titulación reciente, «equipo joven», topes de experiencia, límites de edad | MEDIA |
| `disponibilidad` | Disponibilidad total o para viajar sin justificación funcional | MEDIA |
| `lexico` | Desequilibrio agéntico frente a comunal | **BAJA** |

Tres decisiones que conviene no revertir sin pensarlo:

**El eje léxico nunca sale con confianza alta.** La base metodológica (Gaucher, Friesen y Kay, 2011) es sobre inglés, y la adaptación al español no está validada contra corpus anotado. Sus hallazgos van a revisión humana, no al informe del cliente. Un falso positivo erosiona la confianza en los hallazgos verdaderos.

**Un hallazgo por eje, no uno por coincidencia.** Cuatro marcadores de edad son un problema, no cuatro. Contarlos por separado infla la puntuación y hace que un único defecto sature el informe.

**La ausencia de banda salarial se reporta como `INTERPRETATIVO`.** No es incumplimiento en España hoy. El analizador respeta el modelo de tres estados igual que el asistente, y hay un test que lo fija.

## Servicio HTTP

```bash
python3 -m uvicorn agent.api:app --port 8080 --reload
open http://localhost:8080/docs
```

| Endpoint | Sin credenciales |
|---|---|
| `GET /health` | ✅ Declara qué está degradado y por qué |
| `POST /v1/job-postings:analyze` | ✅ Capa determinista completa |
| `POST /v1/guard:check` | ✅ La guardia como servicio, enganchable en CI |
| `GET /v1/audit:verify` | ✅ Integridad de la cadena |
| `POST /v1/chat:query` | ❌ 503 con instrucciones concretas |

**No hay multi-tenant, y no es un descuido.** Fingir aislamiento es peor que no tenerlo. Entra en fase 2, con `tenant_id` y RLS desde el esquema de datos.

### Registro de auditoría

`pta/audit.py` implementa el registro automático de acontecimientos que exige el art. 12 del Reglamento (UE) 2024/1689. Append-only, con hash encadenado: editar una entrada rompe la cadena y `/v1/audit:verify` lo detecta. Hay un test que lo demuestra manipulando el fichero.

No es criptografía fuerte contra quien pueda reescribir el fichero entero y recalcular la cadena. Es integridad frente a la edición puntual, que es el escenario de inspección. Para producción falta anclar el último hash en WORM o en un servicio de timestamping.

### Autenticación

Todos los `/v1/` exigen cabecera `X-API-Key` contra `PTA_API_KEYS`:

```bash
export PTA_API_KEYS="acme:$(openssl rand -hex 24),beta:$(openssl rand -hex 24)"
curl -H "X-API-Key: $CLAVE" localhost:8080/v1/job-postings:analyze -d '{"texto":"..."}'
```

Formato `etiqueta:clave`, separadas por comas. Solo se guarda el SHA-256, la comparación es en tiempo constante, y **el registro de auditoría anota la etiqueta, no la IP**: el art. 12 del Reglamento (UE) 2024/1689 pide un registro atribuible, y la IP de un proxy no atribuye nada.

**Con `PTA_ENV=production` y sin `PTA_API_KEYS`, el servicio no arranca.** Un servicio de cumplimiento sin autenticación es peor que ninguno, porque aparenta control donde no lo hay. En desarrollo sí admite acceso anónimo, y `/health` lo declara como `ABIERTA (solo desarrollo)`.

Límite de 60 peticiones por minuto y clave, en memoria del proceso. Con varias réplicas el límite efectivo se multiplica por el número de instancias: antes de escalar horizontalmente hay que mover el contador a Redis.

`/health` queda abierto, porque lo necesita el healthcheck del orquestador.

### Contenedor

```bash
docker build -f agent/Dockerfile -t pta:0.1.0 .
docker run -p 8080:8080 -v pta-audit:/var/lib/pta pta:0.1.0
```

Se construye desde la raíz del repositorio porque el servicio necesita `corpus/`. El log de auditoría va a volumen: en la capa del contenedor se perdería en cada despliegue y el registro dejaría de servir para nada.

### Despliegue

`agent/fly.toml` está listo. Región **`mad` (Madrid)**, y eso no es estético: toda la propuesta de valor frente a Workday y Visier es la residencia europea del dato, así que desplegar en `iad` contradiría el producto.

```bash
fly volumes create pta_audit --region mad --size 1
fly secrets set PTA_API_KEYS="acme:$(openssl rand -hex 24)"
fly deploy --config agent/fly.toml --dockerfile agent/Dockerfile
```

Una sola instancia a propósito, por el límite de peticiones en memoria.

`.github/workflows/agent-ci.yml` ejecuta los 41 tests, la suite en replay y una comprobación de que el corpus sigue por debajo del umbral de RAG. **Deliberadamente sin `ANTHROPIC_API_KEY`**: si algún día la capa determinista deja de pasar sin credenciales, es una regresión de diseño.

## Pendiente

- **Ejecución en vivo**: falta correr los 32 casos contra el modelo. Necesita credenciales. Es lo único que separa la suite de estar completa.
- **Respuestas grabadas**: el fixture cubre 11 de 32 casos. Las 21 restantes salen de la primera ejecución en vivo con `--out`, que produce el fichero de replay para las siguientes.
- **Graduación de la sanción**: el corpus tiene el rango legal del art. 40 LISOS, no los criterios de graduación del art. 39. El sistema da rangos, no importes previstos, y eso es lo correcto: la graduación es competencia de la Inspección.
- **Exposición total**: la multa no la agota. Faltan por modelar diferencias retributivas con retroactividad, costas e indemnización. Presentar solo la multa infravalora el riesgo.
- **Capa de modelo del analizador**: hoy es solo determinista. Falta lo que las reglas no alcanzan: justificación funcional de un requisito, contexto, y la versión corregida de la oferta con marcas de cambio.
- **Léxico de sesgo validado**: el eje léxico es indicativo hasta que se contraste contra un corpus anotado con acuerdo entre anotadores medido.
- **Multi-tenant**: nada de esto tiene aún noción de tenant. Entra en fase 2, y el esquema de datos debe nacer con `tenant_id` y RLS desde el principio.

## Nota de ubicación

Este código vive en el repositorio del sitio web por comodidad de arranque. No pertenece aquí: `src/`, `angular.json` y `package.json` son de la web y este agente no los toca. Cuando pase de prototipo, `agent/` y `corpus/` deben salir a su propio repositorio.
