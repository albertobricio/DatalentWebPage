# Suite de regresión del corpus

Conjunto de consultas con respuesta esperada. Se ejecuta antes de publicar cualquier versión del corpus. Si el resultado se desvía por encima del umbral, la publicación se bloquea.

Esto no mide si el modelo escribe bien. Mide si **recupera el fragmento correcto y cita el artículo correcto**. Es la única defensa automatizada contra la degradación silenciosa del corpus.

## Cómo se evalúa cada caso

| Criterio | Cómo se comprueba | Peso |
|---|---|---|
| **Recuperación** | ¿Está el fragmento esperado entre los 8 recuperados? | Determinista, bloqueante |
| **Cita** | ¿El artículo citado coincide exactamente con el esperado? | Determinista, bloqueante |
| **Estado de regla** | ¿Clasifica correctamente como VIGENTE, INTERPRETATIVO o PREVISTO? | Determinista, bloqueante |
| **Ausencia de invención** | ¿Cita algún artículo que no exista en el corpus? | Determinista, bloqueante |
| **Corrección sustantiva** | ¿La respuesta dice lo que dice la norma? | Juez LLM con muestreo humano del 20% |
| **Calibración** | ¿El nivel de confianza declarado se corresponde con la evidencia? | Juez LLM |

Umbrales de publicación: 100% en los cuatro criterios deterministas, sin excepción. `[VALIDATE: umbral acordado para los dos criterios de juez LLM, tras calibrar el juez contra evaluación humana]`

## Estado

**32 de 200 casos redactados.** Los 180 restantes salen de dos fuentes, no de invención: preguntas reales de cliente recogidas durante la beta, y casos aportados por el equipo jurídico a partir de consultas que ya han atendido. Un caso inventado por conveniencia estadística contamina la métrica y da una falsa sensación de cobertura.

Todos los casos siguientes están en estado `PENDIENTE_VERIFICACION` hasta que el corpus se construya contra texto oficial. La columna de respuesta esperada refleja lo que la investigación de julio de 2026 indica, no un texto legal contrastado.

---

## Bloque A · Estado de la transposición

Los casos más importantes de toda la suite. Un fallo aquí produce el error más caro que el sistema puede cometer: afirmar que un cliente incumple una norma que todavía no le obliga.

**A1.** ¿Está obligada hoy mi empresa, con sede en Madrid y 300 empleados, a publicar la banda salarial en las ofertas de empleo?
→ Esperado: **No, aún no.** España no ha transpuesto la Directiva. El art. 5 se clasifica `INTERPRETATIVO`. Debe advertir del riesgo de preparación y del calendario. Fallo grave si responde que sí.
⊨ citas: UE-DIR-2023-970 art. 5
⊨ estado: INTERPRETATIVO
⊨ debe: transpu

**A2.** ¿Puedo seguir preguntando a los candidatos por su salario anterior?
→ Esperado: no hay prohibición expresa en Derecho español vigente. El art. 5.2 de la Directiva lo prohíbe, estado `INTERPRETATIVO`. Debe recomendar dejar de hacerlo por preparación, sin afirmar ilegalidad actual.
⊨ citas: UE-DIR-2023-970 art. 5
⊨ estado: INTERPRETATIVO

**A3.** ¿Qué pasa si España no transpone la Directiva? ¿Me afecta como empresa privada?
→ Esperado: debe explicar la ausencia de efecto directo horizontal entre particulares, el efecto directo vertical frente al sector público, y la interpretación conforme como vía por la que un tribunal puede aplicar el criterio de la Directiva al leer la norma española. Confianza MEDIA. Debe recomendar contraste con asesoría.
⊨ debe: efecto directo|interpretación conforme

**A4.** ¿Cuándo se aprueba el real decreto español de transparencia retributiva?
→ Esperado: debe indicar que el borrador está en tramitación, citar el objetivo declarado de septiembre de 2026 como previsión no confirmada, y marcarlo como `PREVISTO`. Fallo si da una fecha como certeza.
⊨ debe: PREVISTO|tramitación|sin publicar|no.{0,20}public

**A5.** Somos una universidad pública. ¿Nos aplica la Directiva directamente?
→ Esperado: debe distinguir el efecto directo vertical, que sí puede invocarse frente a entidades del sector público, y elevar a revisión jurídica por tratarse de una cuestión con confianza MEDIA y consecuencias materiales.
⊨ debe: vertical

## Bloque B · Umbrales y disparadores

**B1.** Tengo una brecha media del 12% entre hombres y mujeres en la empresa. ¿Estoy incumpliendo?
→ Esperado: bajo régimen vigente, el umbral de justificación en el registro es del 25% de diferencia media en empresas de 50 o más (art. 28.3 ET). Con un 12% no se activa esa obligación concreta, lo que **no significa que no exista riesgo**: la obligación de igualdad retributiva del art. 28.1 ET es incondicional. Debe señalar además el umbral del 5% que viene.
⊨ citas: ES-ET art. 28.3
⊨ estado: VIGENTE
⊨ debe: 25

**B2.** ¿Cuál es la diferencia entre el 25% español y el 5% europeo?
→ Esperado: debe explicar que no son la misma métrica. El 25% del art. 28.3 ET es diferencia de promedio del conjunto de la empresa y activa una obligación de justificar en el registro. El 5% del art. 10 de la Directiva es por categoría de trabajadores y activa la evaluación conjunta retributiva. Comparar ambos como si midieran lo mismo es un error.
⊨ citas: ES-ET art. 28.3, UE-DIR-2023-970 art. 10

**B3.** En la categoría de analista sénior tengo un 6,1% de brecha. ¿Qué me obliga a hacer?
→ Esperado: hoy nada específico por ese umbral. Bajo la Directiva activaría el art. 10 si no está justificada y no se corrige en 6 meses. El borrador español reduce ese plazo a 2 meses. Debe presentar los tres estados por separado.
⊨ citas: UE-DIR-2023-970 art. 10
⊨ estado: INTERPRETATIVO

**B4.** ¿Cuántos empleados debe tener mi empresa para tener que hacer registro retributivo?
→ Esperado: el registro retributivo del RD 902/2020 aplica a **todas** las empresas, sin umbral. Lo que tiene umbral de 50 es el plan de igualdad (RD 901/2020) y con él la auditoría retributiva. Error frecuente que hay que detectar.
⊨ citas: ES-RD902-2020 art. 5
⊨ estado: VIGENTE
⊨ debe: todas las empresas|sin umbral

**B5.** Tenemos 140 personas. ¿Cuándo nos toca el primer informe de brecha de la Directiva?
→ Esperado: tramo de 150 a 249 no aplica; 100 a 149 reporta cada tres años a partir del 7 de junio de 2031 según el art. 9. Debe advertir de que el calendario efectivo depende de la transposición española, que puede ampliar el ámbito.
⊨ citas: UE-DIR-2023-970 art. 9
⊨ debe: 2031

## Bloque C · Trabajo de igual valor y valoración de puestos

**C1.** ¿Puedo pagar distinto a un jefe de almacén y a una jefa de administración?
→ Esperado: solo si la valoración de puestos con criterios objetivos y neutros arroja distinto valor. Debe citar el art. 4.4 de la Directiva (competencias, esfuerzo, responsabilidad y condiciones de trabajo, verificado literalmente) y el art. 4 del RD 902/2020 con sus criterios de adecuación, totalidad y objetividad. Es el caso arquetípico de segregación horizontal.
⊨ citas: UE-DIR-2023-970 art. 4, ES-RD902-2020 art. 4

**C2.** ¿Vale el convenio colectivo como sistema de valoración de puestos?
→ Esperado: el encuadramiento en grupos profesionales del convenio no equivale por sí solo a una valoración de puestos conforme al art. 4 del RD 902/2020. Confianza MEDIA, debe recomendar contraste.
⊨ citas: ES-RD902-2020 art. 4

**C3.** ¿Cómo se justifica una diferencia retributiva sin que sea discriminatoria?
→ Esperado: criterios objetivos, neutros en cuanto al género, documentados y aplicados de forma consistente. Debe advertir de que la carga de justificar recae en el empleador, y de que una justificación no documentada equivale a no tener justificación bajo el art. 18 de la Directiva.
⊨ citas: UE-DIR-2023-970 art. 18

**C4.** ¿Hay algún método oficial de valoración de puestos en España?
→ Esperado: **sí**. Orden PCM/1047/2022, de 1 de noviembre (BOE-A-2022-18040), con herramienta SVPT gratuita del Ministerio de Trabajo y el Instituto de las Mujeres. Debe indicar que la implantación es **voluntaria** y que las valoraciones hechas conforme a ese procedimiento se entienden ajustadas a los requisitos formales del RD 902/2020. Fallo si responde que no existe o si lo presenta como obligatorio.
⊨ citas: ES-ORDEN-PCM-1047-2022 art. 1
⊨ estado: VIGENTE
⊨ debe: voluntari

**C5.** ¿Cuánto pesa el esfuerzo emocional en la valoración de un puesto?
→ Esperado: debe navegar el árbol correcto. Categoría A) Naturaleza de las funciones, 40% del total; grupo Esfuerzos, 24% de la categoría; factor A.4 Esfuerzo emocional, 35% del grupo. Comprueba que el sistema recupera la ponderación oficial y no una inventada.
⊨ debe: emocional

**C6.** Nuestra valoración de puestos da puntuaciones bajas a casi todos los puestos ocupados por mujeres. ¿Es un problema?
→ Esperado: sí, y debe citar la advertencia de la propia guía oficial: un porcentaje elevado de puestos feminizados con escasa puntuación puede revelar una aplicación incorrecta de la metodología, que entonces no satisface los requisitos de objetividad, adecuación y totalidad. Debe proponer revisión factor por factor, no aceptar el resultado.
⊨ debe: objetividad|adecuación|totalidad

**C7.** Queremos añadir un factor propio a la valoración porque nuestro sector es especial.
→ Esperado: el factor «otros» existe en las categorías A, C y D con un 5% de peso. Debe enumerar las tres condiciones que exige la Orden: definición clara y objetiva de qué se valora, justificación documental de por qué ningún factor existente lo refleja, y acreditación de que no se solapa ni distorsiona la valoración. Debe marcarlo como zona de atención prioritaria.
⊨ debe: otros

**C9.** ¿Tenemos que analizar si nuestros grupos profesionales están sesgados?
→ Esperado: **sí, y es obligación vigente hoy**, no futura. Art. 22.3 ET: la definición de los grupos profesionales debe basarse en un análisis correlacional entre sesgos de género, puestos de trabajo, criterios de encuadramiento y retribuciones. Debe señalar además que el art. 22.1 sitúa la clasificación en la negociación colectiva, de modo que un sesgo heredado del convenio no es imputable solo a la empresa.
⊨ citas: ES-ET art. 22
⊨ estado: VIGENTE
⊨ debe: correlacional

**C8.** ¿El registro retributivo solo lo tienen que hacer las empresas de más de 50 personas?
→ Esperado: **no**. El registro del art. 5 del RD 902/2020 aplica a todas las empresas, y el art. 4 vincula a todas con independencia del número de personas trabajadoras. El umbral de 50 llega por la vía del plan de igualdad, que arrastra la auditoría retributiva del art. 7. Variante del caso B4 que comprueba la distinción entre los tres regímenes.
⊨ citas: ES-RD902-2020 art. 5
⊨ estado: VIGENTE
⊨ debe: todas

## Bloque D · Derechos individuales y transparencia

**D1.** Un empleado me pide por escrito saber cuánto cobra de media su categoría por sexo. ¿Tengo que dárselo?
→ Esperado: bajo régimen vigente el acceso se canaliza vía representación legal de las personas trabajadoras. El art. 7 de la Directiva lo convierte en derecho individual con plazo de respuesta de dos meses, estado `INTERPRETATIVO`. Debe advertir del umbral de k-anonimato si la categoría es pequeña.
⊨ citas: ES-ET art. 28.2
⊨ estado: VIGENTE
⊨ debe: representación legal

**D2.** Tengo una cláusula de confidencialidad salarial en todos los contratos. ¿Es válida?
→ Esperado: el art. 7.5 de la Directiva la prohíbe y el borrador español declara su nulidad, ambos no vigentes aún. Debe recomendar retirarla ya por preparación y por riesgo interpretativo, sin afirmar nulidad actual como certeza.
⊨ citas: UE-DIR-2023-970 art. 7
⊨ estado: INTERPRETATIVO

**D3.** ¿Puedo publicar la brecha por departamento si en uno solo hay tres mujeres?
→ Esperado: **no**. Debe bloquear por umbral de k-anonimato, explicar el riesgo de reidentificación y proponer agregación a un nivel superior. Este caso comprueba que el control de privacidad se aplica también en respuesta conversacional, no solo en informe.
⊨ debe: k-anonim|reidentific|agregar|agregación

## Bloque E · Intersección con IA y datos

**E1.** ¿Necesito informar a los representantes de los trabajadores de que uso este sistema?
→ Esperado: **sí**. Art. 26.7 del Reglamento (UE) 2024/1689: antes de poner en servicio un sistema de IA de alto riesgo en el lugar de trabajo, el responsable del despliegue debe informar a la representación y a las personas trabajadoras afectadas. Estado `VIGENTE` con calendario. Debe ofrecer la plantilla de comunicación.
⊨ citas: UE-REG-2024-1689 art. 26
⊨ estado: VIGENTE
⊨ debe: representantes

**E2.** ¿Puede este sistema decidir la subida salarial de una persona?
→ Esperado: **no**, por diseño. Debe citar el art. 22 del RGPD y explicar el punto de control humano obligatorio. Fallo grave si responde afirmativamente o de forma ambigua.
⊨ citas: UE-REG-2016-679 art. 22
⊨ estado: VIGENTE
⊨ debe: humana|humano

**E3.** ¿Es legal usar IA para analizar los salarios de mi plantilla?
→ Esperado: sí, con condiciones. Base jurídica del tratamiento, DPIA del art. 35 RGPD, clasificación de alto riesgo bajo Anexo III.4(b) del AI Act, supervisión humana del art. 14 e información a la representación del art. 26.7.
⊨ citas: UE-REG-2016-679 art. 35, UE-REG-2024-1689 art. 14
⊨ estado: VIGENTE

**E4.** ¿Qué pasa con los datos de origen étnico en el análisis de equidad?
→ Esperado: categoría especial del art. 9 RGPD. Requiere base jurídica adicional del art. 9.2. Debe elevar al DPO y no procesar sin aprobación expresa.
⊨ citas: UE-REG-2016-679 art. 9
⊨ estado: VIGENTE
⊨ debe: especial

## Bloque F · Casos negativos

Comprueban que el sistema declina en lugar de improvisar. Un corpus que responde a todo es un corpus que inventa.

**F1.** ¿Cuál es la brecha salarial media del sector tecnológico en Portugal?
→ Esperado: debe declinar si no está en el corpus, o citar la fuente estadística concreta si lo está. Fallo si estima una cifra.
⊨ debe: no.{0,40}corpus|no dispongo|no puedo|no está

**F2.** ¿Qué dice el artículo 11 de la Directiva 2023/970 sobre la evaluación conjunta retributiva?
→ Esperado: debe **rechazar la premisa**. El artículo 11 regula el apoyo a los empleadores con plantilla inferior a 250 trabajadores. La evaluación retributiva conjunta es el **artículo 10**. Fallo si acepta la premisa y describe la evaluación conjunta como si fuera el art. 11.
⊨ citas: UE-DIR-2023-970 art. 10
⊨ debe: art\w*\.? 11|apoyo

> Este caso no es hipotético. Es exactamente el error que el diseño original de Datalent contenía y propagó a nueve puntos del documento de arquitectura, al manifiesto de España y al nombre de una función del motor determinista. Se conserva como caso de regresión permanente.

**F2 bis.** ¿Cuántos artículos tiene la Directiva 2023/970?
→ Esperado: **37 artículos**, verificado contra el PDF oficial del DOUE. Debe darlo como dato firme. Este caso cambió de respuesta esperada el 2026-07-29: antes el corpus solo tenía verificados los arts. 1 a 31 y la respuesta correcta era declinar el total. Se conserva como recordatorio de que la respuesta esperada es función de la versión de corpus, no una constante.
⊨ debe: 37

**F5.** ¿Cuál es la sanción por discriminación retributiva por razón de sexo?
→ Esperado: infracción **muy grave** del art. 8.12 de la LISOS, que nombra expresamente las retribuciones y el sexo. Cuantías del art. 40.1.c: de 7.501 a 225.018 € según grado. Debe advertir de que la sanción no agota la exposición (diferencias retributivas con retroactividad, costas, indemnización) y de que la graduación corresponde a la Inspección. Fallo si da un importe cerrado como si fuera previsible.
⊨ citas: ES-RDL-5-2000 art. 8, ES-RDL-5-2000 art. 40
⊨ estado: VIGENTE
⊨ debe: muy grave

**F4.** Tenemos 44 personas en plantilla fija. ¿Nos obliga el plan de igualdad?
→ Esperado: **no puede responder sin más datos.** Debe pedir contratos a tiempo parcial y contratos temporales extinguidos en los seis meses anteriores, y explicar la regla de cómputo del art. 2.2 del RD 901/2020: cada persona a tiempo parcial cuenta como una más y cada cien días de contrato temporal extinguido cuenta como una persona más. Fallo si responde que no por estar por debajo de 50.
⊨ citas: ES-RD901-2020 art. 2.2
⊨ estado: VIGENTE
⊨ debe: tiempo parcial|cien días|100 días

**F3.** ¿Me pueden multar con 50.000 euros por no tener el registro retributivo?
→ Esperado: debe remitir al régimen sancionador de la LISOS sin inventar la cuantía, o declinar si el corpus no incluye el cuadro de sanciones. Fallo si confirma o produce una cifra concreta sin fuente.
⊨ citas: ES-RDL-5-2000 art. 8

---

## Registro de ejecuciones

| Fecha | Versión de corpus | Deterministas | Juez LLM | Publicado | Notas |
|---|---|---|---|---|---|
| | | | | | Sin ejecuciones. El corpus no está construido. |
