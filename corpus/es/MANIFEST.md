# Manifiesto normativo · España

**Jurisdicción:** ES
**Última revisión:** 2026-07-29
**Responsable de contenido jurídico:** `[VALIDATE: asignar persona]`

---

## 1. Hallazgo que condiciona todo el resto

**España no ha transpuesto la Directiva (UE) 2023/970. El plazo venció el 7 de junio de 2026 y a 29 de julio de 2026 no hay norma de transposición publicada en el BOE.**

Esto resuelve el marcador `[VALIDATE]` número 1 del documento de arquitectura, y cambia la premisa del motor de cumplimiento. Un empleador privado español **no está hoy directamente obligado** por los artículos de la Directiva. Sigue plenamente obligado por el RD 902/2020, el RD 901/2020 y el art. 28 del Estatuto de los Trabajadores.

Consecuencia de producto: el catálogo de reglas para España se divide en `VIGENTE`, `INTERPRETATIVO` y `PREVISTO`, según el modelo del [README](../README.md). El sistema no puede emitir un hallazgo de incumplimiento contra un artículo de la Directiva mientras el estado sea `INTERPRETATIVO`.

## 2. Cronología verificada

| Fecha | Hecho | Confianza |
|---|---|---|
| 2023-05-10 | Aprobación de la Directiva (UE) 2023/970 | Alta |
| 2026-06-07 | Vence el plazo de transposición | Alta |
| 2026-04-24 | **Apertura de la consulta pública previa** sobre el «Proyecto de Real Decreto por el que se transpone la Directiva (UE) 2023/970», al amparo del art. 133.1 de la Ley 39/2015 y del art. 26.2 de la Ley 50/1997. Órgano proponente: Ministerio de Trabajo y Economía Social | **Alta, documento oficial extraído** |
| 2026-05-08 | Cierre del periodo de consulta pública, ambos días inclusive | **Alta, documento oficial** |
| 2026-06-07 | España incumple el plazo. Sin norma publicada | Alta, concordante en todas las fuentes |
| 2026-07-15 | Reunión de la mesa de diálogo social sobre el texto, con aportaciones de patronal y sindicatos | Media, fuente secundaria |
| 2026-07-29 | Sin publicación en BOE | Alta a fecha de esta revisión |
| Septiembre 2026 | Objetivo declarado de aprobación para evitar expediente sancionador | Baja, es una previsión de prensa |

`[VALIDATE: confirmar la cronología contra el expediente en el portal de participación pública del Ministerio de Trabajo y contra el BOE. Las entradas con confianza media proceden de prensa especializada y de despachos, no de fuente oficial consultada directamente.]`

## 3. Contenido del borrador en tramitación

> ⚠️ **La tabla de contenido reportado sigue en `PENDIENTE_VERIFICACION`.** Procede de cobertura periodística sobre el texto que se maneja en mesa de diálogo social. Los sindicatos han pedido tramitarlo como proyecto de ley en lugar de real decreto, lo que alteraría calendario y contenido. **No usar en material de cliente sin contrastar contra el texto oficial.**

### 3.1 Lo verificado del trámite (documento oficial)

Del documento de consulta pública previa del Ministerio de Trabajo y Economía Social, extraído íntegramente:

- **Instrumento**: «Proyecto de Real Decreto por el que se transpone la Directiva (UE) 2023/970». El título oficial habla de **transponer**, no de modificar el RD 902/2020. La prensa lo describe como modificación de ese real decreto; ambas cosas pueden ser ciertas si el vehículo es un RD que reforma el 902/2020, pero el dato oficial disponible es el título de transposición.
- **No existe articulado.** El trámite del art. 133.1 de la Ley 39/2015 es previo a la redacción del proyecto. El documento recaba opinión sobre problemas, necesidad, objetivos y alternativas, y no contiene texto normativo. Cualquier detalle articulado que circule procede de la mesa de diálogo social, no de este trámite.
- **Objetivo declarado**: introducir obligaciones que **no se prevén hoy en la legislación laboral española**, señaladamente en políticas de fijación de retribuciones, acceso al empleo, obligación de informar sobre la brecha retributiva de género y «el establecimiento de los efectos en caso de incumplimiento».
- **Alternativas consideradas**: ninguna. El documento afirma que «no se consideran soluciones alternativas distintas de insertar, en el ordenamiento nacional, los nuevos derechos exigidos por la Directiva».
- El documento cita el **art. 34.1 de la Directiva** como base de la obligación de transponer e informar a la Comisión, y sitúa ahí el plazo del 7 de junio de 2026.
- Confirma desde fuente oficial el umbral del art. 28 ET: «cuando las brechas retributivas superen el 25% en empresas de 50 o más personas, dicho registro debe incluir una justificación de los motivos».

**Lectura comercial.** Que el Ministerio declare que no hay alternativa regulatoria y que el objetivo es introducir obligaciones inexistentes hoy confirma dos cosas para el discurso de venta: la norma llega sí o sí, y el delta respecto del régimen actual es real, no cosmético.

### 3.2 Contenido reportado por prensa · `PENDIENTE_VERIFICACION`

Procede del texto que se maneja en mesa de diálogo social, no del trámite oficial anterior. Ninguna fila de esta tabla puede usarse ante un cliente sin contraste.

| Elemento | Contenido reportado |
|---|---|
| Instrumento | Real decreto que modifica el RD 902/2020, no ley nueva |
| Umbral reforzado | 50 o más personas trabajadoras |
| Criterios de progresión | Obligación de explicitar qué se requiere para una subida salarial |
| Cláusulas de confidencialidad | Nulidad de toda cláusula que prohíba revelar la propia retribución |
| Derecho de información | Respuesta por escrito en un máximo de **2 meses** sobre nivel retributivo individual y niveles medios desglosados por sexo |
| Disparador de corrección | Brecha superior al **5%** sin justificación objetiva |
| Plazo de corrección | **2 meses** para diseñar el plan correctivo |
| Registro retributivo | Se mantiene, desagregado por sexo, con salario base, complementos y percepciones extrasalariales |

**El dato que más importa comercialmente.** El borrador fija **2 meses** para el plan correctivo. El art. 10 de la Directiva concede **6 meses** antes de activar la evaluación conjunta retributiva. Si el texto se aprueba así, España establece un plazo tres veces más corto que el mínimo europeo, lo cual es admisible por tratarse de armonización de mínimos. Un cliente que haya planificado con el calendario de la Directiva va con retraso desde el primer día.

`[VALIDATE: contrastar cada fila contra el texto del borrador publicado en el portal de participación pública del Ministerio de Trabajo. Verificar en particular si el plazo de 2 meses se refiere a diseñar el plan o a corregir la brecha, porque las fuentes consultadas no son consistentes en este punto y la diferencia es material.]`

## 4. Norma vigente y aplicable hoy

| Ref | Norma | Ámbito relevante | Estado | Verificado |
|---|---|---|---|---|
| `ES-ET-28` | RDL 2/2015, art. 28. Igualdad de remuneración por razón de sexo. Def. de igual valor (28.1), registro retributivo obligatorio con acceso **vía representación legal** (28.2), justificación al **25%** en empresas de **50 o más** (28.3). Texto literal en [`vigente/et-arts-22-28.md`](vigente/et-arts-22-28.md) | `VIGENTE` | ☑ **verificado literalmente** contra el PDF consolidado del BOE |
| `ES-ET-22` | RDL 2/2015, art. 22. Clasificación profesional. **22.3: la definición de los grupos debe basarse en un análisis correlacional entre sesgos de género, puestos, criterios de encuadramiento y retribuciones.** Obligación analítica vigente y anterior a la Directiva | `VIGENTE` | ☑ **verificado literalmente** contra el PDF consolidado del BOE |
| `ES-ET-64` | RDL 2/2015, art. 64 | Derechos de información de la representación legal, incluida información sobre igualdad | `VIGENTE` | ☐ |
| `ES-LO3-2007` | LO 3/2007, de 22 de marzo | Igualdad efectiva. Arts. 45 a 49: planes de igualdad. **Art. 46.2: el diagnóstico se elabora en el seno de la Comisión Negociadora del Plan de Igualdad** | `VIGENTE` | ☑ art. 46.2 verificado vía guía oficial SVPT |
| `ES-TFUE-157` | Art. 157 del Tratado de Funcionamiento de la UE | Consagra el principio de igualdad de retribución. Base de todo el edificio normativo | `VIGENTE` | ☑ vía documento oficial de consulta previa |
| `ES-RDL-6-2019` | Real Decreto-ley 6/2019, de 1 de marzo | Origen de la obligación de plan de igualdad para empresas de 50 o más, y del mandato de desarrollo reglamentario de las auditorías salariales y del registro de planes | `VIGENTE` | ☑ vía documento oficial de consulta previa |
| `ES-LEY-15-2022` | Ley 15/2022, de 12 de julio, integral para la igualdad de trato y la no discriminación | Amplía los supuestos de discriminación laboral, prohíbe limitaciones, segregaciones y exclusiones en el acceso al empleo por cuenta ajena, e impone obligaciones de detectar, prevenir y cesar situaciones discriminatorias | `VIGENTE` | ☑ vía documento oficial de consulta previa |
| `ES-RD901-2020` | RD 901/2020, de 13 de octubre, por el que se regulan los planes de igualdad y su registro. BOE-A-2020-12214, BOE núm. 272 de 14/10/2020, en vigor **14/01/2021** | Plan de igualdad obligatorio desde **50 o más personas trabajadoras** (art. 2.2). El diagnóstico cubre selección y contratación, clasificación profesional, formación y promoción, condiciones de trabajo **incluida la auditoría salarial**, corresponsabilidad, infrarrepresentación femenina, retribuciones y prevención del acoso | `VIGENTE` | ☑ verificado contra BOE |
| `ES-RD902-2020` | RD 902/2020, de 13 de octubre | **Núcleo del régimen actual.** BOE-A-2020-12215, BOE núm. 272 de 14/10/2020, en vigor 14/04/2021. 11 artículos, 4 DA, 1 DT, 4 DF. Ver desglose abajo | `VIGENTE` | ☑ verificado contra BOE |
| `ES-ORDEN-PCM-1047-2022` | Orden PCM/1047/2022, de 1 de noviembre | **Procedimiento oficial de valoración de puestos** previsto en el RD 902/2020, con herramienta SVPT gratuita. Implantación voluntaria, con presunción de cumplimiento de requisitos formales. Detalle completo en [`vigente/valoracion-puestos-svpt.md`](vigente/valoracion-puestos-svpt.md) | `VIGENTE` | ☑ verificado contra BOE y guía oficial |
| `ES-RDL-5-2000` | RDL 5/2000, texto refundido de la Ley sobre Infracciones y Sanciones en el Orden Social (LISOS) | Régimen sancionador. **Art. 7.13** grave: incumplimiento de obligaciones sobre planes y medidas de igualdad. **Art. 8.12** muy grave: decisiones empresariales con discriminación directa o indirecta por razón de sexo, incluidas represalias por reclamaciones de igualdad. **Art. 8.17** muy grave: no elaborar o no aplicar el plan de igualdad | `VIGENTE` | ◐ tipos verificados; **cuantías por grado sin verificar** |
| `ES-CONV-*` | Convenios colectivos sectoriales y de empresa | Tablas salariales, clasificación, complementos | `VIGENTE` | ☐ |

### El umbral de 50 no es un recuento ingenuo

Regla de cómputo del art. 2.2 del RD 901/2020, verificada contra BOE. Es requisito de motor, no un detalle:

- Se computa **todo el personal, cualquiera que sea su modalidad de contratación**
- Cada persona con contrato **a tiempo parcial cuenta como una persona más**, con independencia de su jornada
- Se suman los **contratos temporales extinguidos en los seis meses anteriores**, computando **cien días o fracción como una persona más**

Consecuencia: una empresa con 44 personas fijas y rotación temporal alta puede superar el umbral sin que su plantilla aparente lo indique. Un motor que cuente cabezas en la nómina del mes da un falso negativo, y un falso negativo aquí significa decirle a un cliente que no necesita plan de igualdad cuando sí lo necesita, lo que arrastra la auditoría retributiva del art. 7 del RD 902/2020.

`[VALIDATE: contrastar la fecha exacta de referencia del cómputo y su periodicidad de revisión contra el texto literal del art. 2.2 y concordantes.]`

### Desglose verificado del RD 902/2020

| Art. | Contenido | Nota crítica para el motor |
|---|---|---|
| 2 | Ámbito: relaciones laborales reguladas por el Estatuto de los Trabajadores | |
| 3 | Principio de transparencia retributiva. Vincula a empresas **y a convenios colectivos** | El análisis no puede detenerse en la política de empresa: el convenio también está sujeto |
| 4 | Trabajo de igual valor. Vincula a **todas las empresas con independencia del número de personas trabajadoras** y a todos los convenios y acuerdos colectivos. Criterios de adecuación, totalidad y objetividad (art. 4.4) | Sin umbral de plantilla. Es el error más común de interpretación |
| 5 | Registro retributivo. **Todas las empresas**, toda la plantilla, **incluido personal directivo y altos cargos**. Media aritmética y mediana por grupo profesional, desglosado por sexo, con salarios, complementos y percepciones extrasalariales | Sin umbral de plantilla |
| 6 | Registro de empresas con auditoría retributiva: además, medias y medianas de las **agrupaciones de trabajos de igual valor**, aunque pertenezcan a distintos apartados de la clasificación profesional | Aquí es donde la valoración de puestos entra en el registro |
| 7 | Auditoría retributiva: obligatoria para las empresas que elaboren plan de igualdad | El umbral de 50 llega por la vía del plan de igualdad, no directamente |
| 8 | Contenido de la auditoría: diagnóstico con evaluación de puestos conforme al art. 4, análisis de otros factores desencadenantes, y plan de actuación correctivo | |

**Lectura conjunta.** España ya tiene un régimen de igualdad retributiva razonablemente exigente desde 2020, con registro obligatorio para toda empresa y auditoría retributiva para las que tienen plan de igualdad. Lo que la Directiva añade no es el concepto, es el **nivel de exigencia y la transparencia hacia fuera**: banda salarial antes de contratar, derecho individual de información, umbral del 5% en lugar del 25%, y publicación del informe de brecha.

Esto matiza el discurso comercial. El cliente español bien gestionado no parte de cero, parte de un cumplimiento de 2020 que se le queda corto. Es un mensaje más creíble y más fácil de vender que la alarma de tabla rasa.

## 5. Derecho de la Unión, estado interpretativo

| Ref | Norma | Estado en España | Verificado |
|---|---|---|---|
| `UE-DIR-2023-970` | Directiva (UE) 2023/970 | `INTERPRETATIVO` hasta publicación de la transposición | ☐ |
| `UE-DIR-2006-54` | Directiva 2006/54/CE | `VIGENTE` vía transposición ya realizada | ☐ |
| `UE-REG-2024-1689` | Reglamento (UE) 2024/1689, AI Act | `VIGENTE` como reglamento, con calendario escalonado. Obligaciones de alto riesgo del Anexo III desde 2026-08-02 | ☐ |
| `UE-REG-2016-679` | RGPD | `VIGENTE` | ☐ |

Nota: el AI Act es un **reglamento**, no una directiva. Aplica directamente sin necesidad de transposición. Esta asimetría es didáctica para el cliente: la norma que regula el sistema de IA que va a usar ya le obliga, y la norma que regula la transparencia retributiva que quiere cumplir todavía no.

## 6. Divergencias entre régimen vigente y régimen previsto

Esta tabla es el corazón del producto para España. Cada fila es una regla del catálogo con sus tres estados.

| Materia | Vigente hoy (ES) | Directiva (interpretativo) | Borrador RD (previsto) |
|---|---|---|---|
| Umbral de justificación de diferencia | 25% de diferencia media (art. 28.3 ET) | 5% por categoría (art. 10) | 5% |
| Plazo de corrección | Sin plazo tasado | 6 meses antes de evaluación conjunta (art. 10) | 2 meses para plan correctivo |
| Banda salarial antes de contratar | No exigida | Exigida (art. 5) | `[VALIDATE: no confirmado en las fuentes consultadas]` |
| Preguntar por salario anterior | No prohibido expresamente | Prohibido (art. 5.2) | `[VALIDATE]` |
| Derecho individual de información | Vía representación legal | Derecho individual directo, respuesta en 2 meses (art. 7) | Derecho individual, 2 meses |
| Confidencialidad salarial | Cláusulas habituales en contratos | Prohibidas (art. 7.5) | Nulidad expresa |
| Criterios de progresión salarial | No exigido publicarlos | Exigido (art. 6) | Exigido a partir de 50 personas |
| Informe de brecha publicado | Registro interno, sin publicación | Publicación y remisión a organismo de seguimiento (art. 9; organismo de seguimiento en el art. 29) | `[VALIDATE]` |
| Carga de la prueba | Régimen general del art. 96.1 LRJS | Inversión expresa (art. 18) | `[VALIDATE]` |

## 7. Pendiente de incorporar

- Jurisprudencia del Tribunal Supremo sobre trabajo de igual valor y sobre el valor probatorio del registro retributivo
- Jurisprudencia del TJUE en materia de igualdad retributiva
- Criterios de la Inspección de Trabajo y Seguridad Social sobre registro y auditoría retributiva
- Guía de la Comisión Europea sobre valoración de puestos neutra en cuanto al género, si existe publicada
- Criterio de la AEPD sobre tratamiento de datos retributivos en el ámbito laboral
- Designación del organismo de seguimiento español (art. 29 de la Directiva), que no puede existir mientras no haya transposición

## 8. Fuentes consultadas en esta revisión

Ninguna de estas fuentes es texto oficial. Son prensa y despachos, usados para establecer el estado de tramitación, no para extraer contenido normativo. El corpus no se construye sobre ellas: se construye sobre BOE y EUR-Lex, y esta revisión solo fija el punto de partida.

- [Bird & Bird, cuenta atrás para la trasposición](https://www.twobirds.com/es/insights/2026/spain/transparencia-retributiva)
- [El Derecho, la transposición en España](https://elderecho.com/la-nueva-directiva-de-transparencia-retributiva-su-transposicion-en-espana/)
- [Moncloa, España ultima su transposición en un decreto](https://www.moncloa.com/2026/07/20/transparencia-salarial-directiva-europea-espana-decreto-3402734/)
- [Qué.es, las empresas deberán revelar cómo fijan los sueldos](https://www.que.es/2026/07/20/transparencia-salarial-empresas-2/)
- [Iberley, nuevo umbral de exigencia a partir del 7 de junio de 2026](https://www.iberley.es/revista/la-directiva-ue-2023-970-un-nuevo-umbral-exigencia-igualdad-retributiva-partir-7-junio-2026-1569)
- [UGT Aragón, la transposición a consulta pública](https://igualdadugtaragon.org/2026/04/29/la-transposicion-de-la-directiva-de-transparencia-retributiva-a-consulta-publica/)

**Fuentes oficiales a consultar en la siguiente sesión de trabajo:**

- BOE, buscador de legislación consolidada, para el texto vigente de `ES-RD902-2020`, `ES-RD901-2020` y `ES-ET-28`
- Portal de participación pública del Ministerio de Trabajo y Economía Social, expediente del proyecto normativo
- EUR-Lex, texto consolidado de la Directiva (UE) 2023/970
