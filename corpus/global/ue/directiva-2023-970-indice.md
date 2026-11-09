# Directiva (UE) 2023/970 · Índice de artículos verificado

| | |
|---|---|
| **Ref corpus** | `UE-DIR-2023-970` |
| **Título** | Directiva (UE) 2023/970 del Parlamento Europeo y del Consejo, de 10 de mayo de 2023, por la que se refuerza la aplicación del principio de igualdad de retribución entre hombres y mujeres por un mismo trabajo o un trabajo de igual valor a través de medidas de transparencia retributiva y de mecanismos para su cumplimiento |
| **Publicación** | DOUE, 17 de mayo de 2023. Entrada en vigor: 6 de junio de 2023 |
| **Espejo BOE** | [DOUE-L-2023-80668](https://www.boe.es/buscar/doc.php?id=DOUE-L-2023-80668) |
| **Autoridad** | 2 (directiva UE) |
| **Estado regla en España** | `INTERPRETATIVO` (sin transposición a 2026-07-29) |
| **Verificación** | `VERIFICADO` arts. 1 a 31 contra el espejo del BOE. Arts. 32 en adelante `PENDIENTE_VERIFICACION`: el documento consultado aparece truncado |

---

## Por qué existe este fichero

Durante su construcción, este índice detectó un **error de cita propagado por todo el diseño del producto**: el documento de arquitectura situaba la evaluación conjunta retributiva en el artículo 11. Está en el **artículo 10**. El artículo 11 regula el apoyo a empleadores con plantilla inferior a 250 trabajadores, que es materia distinta.

El error aparecía en nueve puntos del documento de arquitectura, en el manifiesto de España y en dos casos de la suite de regresión, incluido el nombre de una función del motor determinista (`evalua_disparador_art11`).

Es la justificación empírica de haber construido el corpus antes que el producto. Un motor de cumplimiento con esa cita habría emitido informes que citaban el artículo equivocado, y bajo el art. 18 (inversión de la carga de la prueba) un informe con la cita mal es un informe que no defiende a nadie.

## Índice verificado

### Capítulo I · Disposiciones generales

| Art. | Título |
|---|---|
| 1 | Objeto |
| 2 | Ámbito de aplicación |
| 3 | Definiciones |
| 4 | Mismo trabajo y trabajo de igual valor |

### Capítulo II · Transparencia retributiva

| Art. | Título |
|---|---|
| 5 | Transparencia retributiva previa al empleo |
| 6 | Transparencia en las políticas de fijación de las retribuciones y de progresión retributiva |
| 7 | Derecho a la información |
| 8 | Accesibilidad de la información |
| 9 | Información sobre la brecha retributiva entre trabajadores y trabajadoras |
| **10** | **Evaluación retributiva conjunta** |
| 11 | Apoyo a los empleadores con una plantilla inferior a 250 trabajadores |
| 12 | Protección de datos |
| 13 | Diálogo social |

### Capítulo III · Vías de reparación y cumplimiento efectivo

| Art. | Título |
|---|---|
| 14 | Defensa de los derechos |
| 15 | Procedimientos en nombre o en favor de los trabajadores |
| 16 | Derecho a indemnización |
| 17 | Otras vías de reparación |
| **18** | **Inversión de la carga de la prueba** |
| 19 | Probar la realización del mismo trabajo o de un trabajo de igual valor |
| 20 | Acceso a las pruebas |
| 21 | Plazos de prescripción |
| 22 | Costas procesales |
| **23** | **Sanciones** |
| 24 | Igualdad de retribución en los contratos y concesiones públicos |
| 25 | Victimización y protección frente a un trato menos favorable |
| 26 | Relación con la Directiva 2006/54/CE |

### Capítulo IV · Disposiciones horizontales

| Art. | Título |
|---|---|
| 27 | Nivel de protección |
| 28 | Organismos de fomento de la igualdad |
| 29 | Seguimiento y sensibilización |
| 30 | Negociación y acciones colectivas |
| 31 | Estadísticas |

### Capítulo V · Disposiciones finales

Resuelto contra el PDF oficial del DOUE (L 132, 17.5.2023, pp. 21-44), extraído íntegramente.

| Art. | Título |
|---|---|
| 32 | Divulgación de la información |
| 33 | Aplicación |
| **34** | **Transposición** |
| 35 | Presentación de informes y revisión |
| 36 | Entrada en vigor |
| 37 | Destinatarios |

**La Directiva tiene 37 artículos.** Dato verificado, no estimado.

**Art. 34.1, literal.** «Los Estados miembros pondrán en vigor las disposiciones legales, reglamentarias y administrativas necesarias para dar cumplimiento a lo establecido en la presente Directiva **a más tardar el 7 de junio de 2026**. Informarán inmediatamente de ello a la Comisión.» El segundo párrafo añade una obligación poco citada: al informar, los Estados presentarán un resumen de los resultados de la evaluación de impacto de sus medidas de transposición **respecto de los trabajadores y empleadores con plantilla inferior a 250 trabajadores**.

**Art. 31 · Estadísticas.** Los Estados facilitan anualmente a Eurostat datos nacionales sin ajustar, desglosados por sexo, sector económico, jornada, control económico (propiedad pública o privada) y edad. Fecha concreta: **se transmiten a partir del 31 de enero de 2028 para el año de referencia 2026**.

**Art. 33 · Aplicación.** Los Estados pueden confiar a los interlocutores sociales la aplicación de la Directiva, incluidas a) el desarrollo de las herramientas o metodologías analíticas del art. 4.2 y b) sanciones pecuniarias equivalentes a multas, siempre que sean efectivas, proporcionadas y disuasorias.

> Merece atención: la herramienta SVPT española se elaboró precisamente en mesa técnica de diálogo social. Es el art. 33.a) en funcionamiento antes incluso de la transposición.

**Art. 35 · Presentación de informes y revisión.** A más tardar el **7 de junio de 2031** los Estados informan a la Comisión sobre el cumplimiento de la Directiva.

> **Nota de proceso, y no es menor.** Este apartado se resolvió tras dos intentos fallidos y una respuesta errónea. Una extracción automatizada del mismo PDF afirmó que la Directiva terminaba en el art. 34, que el art. 31 modificaba la Directiva 2006/54/CE, que el art. 32 era la transposición y que el art. 34 era «Destinatarios», contradiciéndose además a sí misma sobre cuál era el artículo de entrada en vigor. Todo falso. La extracción local del PDF con `pdfplumber` lo resolvió sin ambigüedad.
>
> Regla operativa para este corpus: **los documentos normativos largos se extraen en local, nunca se resumen de forma remota.** Un resumen de un texto legal extenso produce alucinaciones estructurales con apariencia de precisión, que es la forma más peligrosa de error para este producto.

## Contenido verificado de los artículos clave

**Art. 4 · Mismo trabajo y trabajo de igual valor.** Cuatro apartados. El 1 obliga a los Estados a garantizar que los empleadores dispongan de estructuras retributivas que aseguren la igualdad de retribución. El 2 obliga a los Estados a facilitar herramientas y metodologías analíticas para evaluar y comparar el valor del trabajo con sistemas de evaluación profesional neutros respecto al género. El 3 habilita a la Comisión a actualizar directrices de la Unión sobre esos sistemas, en consulta con el Instituto Europeo de la Igualdad de Género.

El **apartado 4** es el operativo: las estructuras retributivas deben permitir evaluar si los trabajadores están en situación comparable mediante criterios objetivos y neutros con respecto al género, que **incluirán las competencias, el esfuerzo, la responsabilidad y las condiciones de trabajo, y, si procede, cualquier otro factor que sea pertinente** para el puesto o empleo específico.

> Contrastar con el esquema español: el art. 28.1 ET y el art. 4.2 del RD 902/2020 usan otro reparto (naturaleza de las funciones, condiciones educativas, condiciones profesionales y de formación, condiciones laborales), donde esfuerzo y responsabilidad quedan anidados dentro de la primera categoría. Ambos esquemas son compatibles en el fondo y distintos en la forma. Ver [`../../es/vigente/valoracion-puestos-svpt.md`](../../es/vigente/valoracion-puestos-svpt.md).

**Art. 5 · Transparencia retributiva previa al empleo.** Los solicitantes de empleo tienen derecho a recibir del empleador potencial información sobre la retribución inicial o la banda retributiva inicial.

**Art. 7 · Derecho a la información.** Los empleadores facilitarán la información en un plazo razonable y, en cualquier caso, en **los dos meses** siguientes a la fecha de la solicitud.

**Art. 9 · Información sobre la brecha retributiva.** Calendario por plantilla:

| Plantilla | Periodicidad | Primer informe |
|---|---|---|
| ≥ 250 | Anual | 7 de junio de 2027 |
| 150 a 249 | Cada tres años | 7 de junio de 2027 |
| 100 a 149 | Cada tres años | 7 de junio de 2031 |

**Las siete métricas del art. 9.1, verificadas literalmente y en su orden legal.** El motor de informes debe respetar esta letra y este orden, porque es como el organismo de seguimiento espera recibirlo:

| Letra | Métrica |
|---|---|
| a) | La brecha retributiva de género |
| b) | La brecha retributiva de género en los componentes complementarios o variables |
| c) | La brecha retributiva de género mediana |
| d) | La brecha retributiva de género mediana en los componentes complementarios o variables |
| e) | La proporción de trabajadoras y de trabajadores que reciben componentes complementarios o variables |
| f) | La proporción de trabajadoras y de trabajadores en cada cuartil de la banda retributiva |
| g) | La brecha retributiva de género, por categorías de trabajadores, desglosada por salario o sueldo base ordinario y por componentes complementarios o variables |

Nota: el orden legal alterna media y variables antes de pasar a la mediana (a, b, c, d), no agrupa las dos medias y después las dos medianas. El diseño original del producto las ordenaba de la segunda forma. Es cosmético para el cálculo y no lo es para el entregable.

**Art. 10 · Evaluación retributiva conjunta.** Umbral del **5%** de diferencia retributiva media no justificada, con plazo de **seis meses** para subsanar antes de que se active la evaluación conjunta.

**Art. 18 · Inversión de la carga de la prueba.** Corresponde al empleador demostrar que no ha habido discriminación. Es el artículo que sostiene toda la propuesta de valor del producto: sin evidencia documentada y trazable, el empleador pierde.

**Art. 23 · Sanciones.**

`[VALIDATE: contenido literal del art. 23, incluidos criterios de graduación de la sanción.]`

## Nota sobre el organismo de seguimiento

El diseño original atribuía al art. 10 la remisión al organismo de seguimiento. Es incorrecto: el art. 10 es la evaluación conjunta. La designación del organismo de seguimiento corresponde al art. 29 (seguimiento y sensibilización), y la remisión del informe probablemente esté dentro del propio art. 9.

`[VALIDATE: localizar el apartado exacto que regula la remisión del informe de brecha al organismo de seguimiento y la publicación.]`

## Fuente

- [BOE, espejo del DOUE: DOUE-L-2023-80668](https://www.boe.es/buscar/doc.php?id=DOUE-L-2023-80668)
- EUR-Lex bloquea el acceso automatizado en las cuatro variantes de URL probadas (HTML, PDF, ELI y `uri` estándar). El espejo del BOE es la vía de acceso operativa para este corpus.
