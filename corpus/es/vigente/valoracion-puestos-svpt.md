# Valoración de puestos de trabajo · Procedimiento oficial español

| | |
|---|---|
| **Ref corpus** | `ES-ORDEN-PCM-1047-2022` |
| **Norma** | Orden PCM/1047/2022, de 1 de noviembre, por la que se aprueba y se publica el procedimiento de valoración de los puestos de trabajo previsto en el Real Decreto 902/2020 |
| **BOE** | BOE-A-2022-18040, publicada 2022-11-03, en vigor 2022-11-04 |
| **Autoridad** | 4 (reglamento nacional) |
| **Estado regla** | `VIGENTE` |
| **Verificación** | `VERIFICADO` contra BOE y contra la guía oficial de uso publicada por el Ministerio de Trabajo e Instituto de las Mujeres |
| **Elaborado por** | Mesa técnica de diálogo social. Ministerio de Trabajo y Economía Social, Instituto de las Mujeres. Cofinanciado por el FSE (POISES 2014-2020) |

---

## 1. Por qué esto cambia el diseño del producto

La sección 7.3 del documento de arquitectura proponía un esquema de puntos por factor con cuatro dimensiones y ponderaciones por defecto de 30/20/30/20, tomadas de la práctica habitual del sector. **Eran una invención de diseño.** España tiene un procedimiento oficial publicado en el BOE, con factores, subfactores y ponderaciones definidos, elaborado en mesa de diálogo social y con perspectiva de género explícita.

Construir el motor de valoración sobre un esquema propio cuando existe uno oficial sería un error competitivo y de cumplimiento. El motor se alinea con este procedimiento para España.

**El argumento decisivo es el puerto seguro.** La orden establece que la implantación es **voluntaria** para las empresas (art. 1.2), pero las valoraciones realizadas conforme a este procedimiento se entienden ajustadas a los requisitos formales del RD 902/2020. Para un cliente que va a tener que defender su valoración de puestos ante inspección o ante un juzgado con la carga de la prueba invertida, usar el método oficial del Ministerio es la posición más defendible que existe. Ningún esquema propietario, por bueno que sea, ofrece eso.

## 2. Diferencia estructural con la Directiva

No coinciden, y esto importa para el diseño multipaís.

| Directiva (UE) 2023/970, art. 4 | Art. 28.1 ET y art. 4.2 RD 902/2020 |
|---|---|
| Competencias | A) Naturaleza de las funciones o tareas |
| Esfuerzo | B) Condiciones educativas |
| Responsabilidad | C) Condiciones profesionales y de formación |
| Condiciones de trabajo | D) Condiciones laborales y factores relacionados con el desempeño |

En el esquema español, **esfuerzo y responsabilidad no son categorías de primer nivel**: están anidados dentro de A) Naturaleza de las funciones. Un motor que codifique las cuatro categorías de la Directiva como estructura fija no mapea contra el método oficial español.

Consecuencia de arquitectura: la taxonomía de valoración es **por jurisdicción**, no global. El motor tiene un modelo de datos genérico de árbol de factores ponderados, y cada jurisdicción aporta su árbol. El de España es el de este documento.

## 3. Criterios legales que debe satisfacer toda valoración

Art. 4.4 RD 902/2020, citado literalmente en la guía oficial:

- **Adecuación.** Los factores relevantes deben ser los relacionados con la actividad y que efectivamente concurran en ella, incluida la formación necesaria.
- **Totalidad.** Deben tenerse en cuenta todas las condiciones que singularizan el puesto, sin que ninguna se invisibilice o se infravalore.
- **Objetividad.** Deben existir mecanismos claros que identifiquen los factores tenidos en cuenta y que no dependan de factores o valoraciones sociales que reflejen estereotipos de género.

El Critic Agent verifica estos tres criterios sobre cualquier valoración que el sistema proponga. La totalidad es el que más falla en la práctica: es el criterio que se incumple cuando una valoración omite el esfuerzo emocional de un puesto de atención al público.

## 4. Características del método

- Construido sobre un total de **1.000 puntos**
- **Normalizado**: aplicable a cualquier empresa, con independencia de tamaño o sector
- **Integral**: todos los factores se valoran en todos los puestos, con posibilidad de asignar nivel cero cuando el factor no concurre
- **Cuantitativo y ponderado**: valor numérico por puesto, lo que garantiza comparabilidad
- **Analítico y con perspectiva de género**: los factores buscan dar visibilidad a cualidades socialmente atribuidas a lo femenino que la valoración tradicional suele omitir
- La valoración se realiza **puesto por puesto**, y después la herramienta agrupa los de igual valor

Referencias metodológicas declaradas en la guía: la guía del Défenseur des droits francés para evaluación no discriminatoria de empleos de predominancia femenina, el Mini-Kit *Step by Step to Pay Equity* de la Pay Equity Commission de Ontario, y la guía de trabajo de igual valor del Departamento de Trabajo y Empleo del Gobierno Vasco.

## 5. Ponderación oficial

Anexo I de la guía de uso. Método escalonado: peso de categoría, después peso de grupo dentro de categoría, después peso de factor dentro de grupo, después peso de subfactor dentro de factor.

### Pesos de categoría

| Categoría | Peso |
|---|---|
| A) Naturaleza de las funciones o tareas | **40%** |
| B) Condiciones educativas | **20%** |
| C) Condiciones profesionales y de formación | **25%** |
| D) Condiciones laborales y factores relacionados con el desempeño | **15%** |

### A) Naturaleza de las funciones o tareas · 40%

| Grupo | % en categoría | Factor | % en grupo | Subfactor | % en factor |
|---|---|---|---|---|---|
| Polivalencia | 30 | A.1 Polivalencia o definición extensa de obligaciones | 100 | | |
| Esfuerzos | 24 | A.2 Esfuerzo físico | 30 | A.2.1 Posición continuada y posturas forzadas | 20 |
| | | | | A.2.2 Movimientos repetitivos | 20 |
| | | | | A.2.3 Esfuerzo visual | 20 |
| | | | | A.2.4 Esfuerzo auditivo | 20 |
| | | | | A.2.5 Otros tipos de esfuerzo físico | 20 |
| | | A.3 Esfuerzo mental | 35 | | |
| | | A.4 Esfuerzo emocional | 35 | | |
| Responsabilidad y autonomía | 41 | A.5 Responsabilidad de organización, coordinación y supervisión | 30 | A.5.1 Responsabilidad de organización y coordinación | 50 |
| | | | | A.5.2 Responsabilidad de supervisión de resultados y calidad | 50 |
| | | A.6 Responsabilidades funcionales | 35 | A.6.1 Responsabilidad sobre el bienestar de las personas | 40 |
| | | | | A.6.2 Responsabilidad económica | 25 |
| | | | | A.6.3 Responsabilidad sobre información confidencial | 35 |
| | | A.7 Autonomía | 35 | | |
| Otros | 5 | A.8 Otros factores relativos a la naturaleza de las funciones | 100 | | |

### B) Condiciones educativas · 20%

| Grupo | % en categoría | Factor | % en grupo |
|---|---|---|---|
| Enseñanza reglada | 100 | B.1 Enseñanza reglada | 100 |

### C) Condiciones profesionales y de formación · 25%

| Grupo | % en categoría | Factor | % en grupo | Subfactor | % en factor |
|---|---|---|---|---|---|
| Conocimientos y comprensión | 45 | C.1 Conocimientos y comprensión | 100 | C.1.1 Procedimientos, materiales, equipos y máquinas | 15 |
| | | | | C.1.2 Competencias digitales | 15 |
| | | | | C.1.3 Gestión de la diversidad | 10 |
| | | | | C.1.4 Conocimiento o dominio de idioma extranjero | 17,5 |
| | | | | C.1.5 Formación no reglada | 17,5 |
| | | | | C.1.6 Experiencia | 10 |
| | | | | C.1.7 Actualización de conocimientos | 15 |
| Aptitudes y habilidades sociales | 50 | C.2 Aptitudes | 50 | C.2.1 Destreza | 25 |
| | | | | C.2.2 Minuciosidad | 25 |
| | | | | C.2.3 Aptitudes sensoriales | 25 |
| | | | | C.2.4 Capacidad para plantear ideas y soluciones | 25 |
| | | C.3 Habilidades sociales | 50 | C.3.1 Capacidad comunicativa | 35 |
| | | | | C.3.2 Capacidad emocional | 30 |
| | | | | C.3.3 Capacidad de resolución de conflictos | 35 |
| Otros | 5 | C.4 Otros factores relacionados con las condiciones profesionales | 100 | | |

### D) Condiciones laborales y factores relacionados con el desempeño · 15%

| Grupo | % en categoría | Factor | % en grupo | Subfactor | % en factor |
|---|---|---|---|---|---|
| Entorno | 60 | D.1 Entorno | 100 | D.1.1 Condiciones físicas | 50 |
| | | | | D.1.2 Condiciones psicosociales | 50 |
| Condiciones organizativas | 35 | D.2 Condiciones organizativas | 100 | D.2.1 Horarios, descansos y vacaciones | 50 |
| | | | | D.2.2 Desplazamientos y viajes | 50 |
| Otros | 5 | D.3 Otros factores relacionados con las condiciones laborales | 100 | | |

## 6. Escalas de nivel

Cada factor se puntúa por niveles. Reglas de construcción según la guía: el primer grado corresponde a los puestos de menor presencia del aspecto descrito y el más alto a los de mayor presencia; los grados deben cubrir intervalos de amplitud constante o lo más uniforme posible; los niveles deben ser umbrales claros y reconocibles; y se prefieren escalas con intervalos cuantitativos frente a cualitativas.

Ejemplo, A.1 Polivalencia:

1. Diversas tareas dentro de una única función
2. Ocasionalmente, tareas de una función distinta de la ordinaria
3. Frecuentemente, tareas de una función distinta de la ordinaria
4. De forma ordinaria, dos funciones diferenciadas
5. De forma ordinaria, tres o más funciones diferenciadas

Los factores de esfuerzo físico (A.2), mental (A.3) y emocional (A.4) se valoran con una matriz de **intensidad por frecuencia**, con tramos de frecuencia respecto de la jornada semanal: de vez en cuando (hasta el 30%), normalmente (más del 30% y hasta el 60%), siempre o casi siempre (más del 60%).

`[VALIDATE: extraer las escalas de nivel completas de los 25 factores y subfactores desde la guía oficial. Este documento recoge la estructura y las ponderaciones, no el detalle de niveles de cada factor.]`

## 7. El factor «otros»

Existe en las categorías A, C y D con un peso del 5%. Su uso es opcional y está sujeto a condiciones que el agente debe verificar:

- La empresa debe definir de forma clara y objetiva qué aspectos quiere valorar con él
- Debe justificar documentalmente por qué su organización, actividad o sector no encuentra reflejo en ningún otro factor
- Debe acreditar que no se solapa con los factores existentes y que no introduce distorsiones en la valoración

Este factor es el vector de manipulación más evidente del método: es por donde se puede reintroducir un criterio sesgado con apariencia de objetividad. El Bias Detection Agent lo trata como zona de atención prioritaria y exige la justificación documental antes de aceptar la valoración.

## 8. Salidas de la herramienta oficial que el producto debe replicar o superar

La herramienta del Ministerio produce agrupaciones de trabajos de igual valor, un mapa de puestos, la puntuación total por puesto, el detalle de valoración por puesto, un **análisis de aplicación por sexo de los factores y subfactores**, y la distribución de mujeres y hombres en cada agrupación con clasificación de la agrupación como feminizada, masculinizada o equilibrada.

El tercero de esos gráficos es el más interesante y el que justifica que el producto exista. La guía advierte de que **un mayor porcentaje de puestos feminizados con escasa puntuación puede revelar una aplicación incorrecta de la propia metodología**, que entonces no satisfaría los requisitos de objetividad, adecuación y totalidad. Es decir: el método oficial reconoce que puede aplicarse de forma sesgada, y deja la detección de ese sesgo en manos de la empresa.

Ahí está el hueco de producto. Detectar la aplicación sesgada de una metodología correcta es análisis, no cumplimentación de formulario, y es exactamente lo que un modelo con un buen catálogo de patrones puede hacer mejor que una hoja de cálculo.

## 9. Participación de la representación legal

Art. 46.2 LO 3/2007: la elaboración del diagnóstico se realiza en el seno de la Comisión Negociadora del Plan de Igualdad. La valoración de puestos es uno de los componentes de la obligación de diagnóstico del art. 8 RD 902/2020.

Consecuencia de producto: la valoración de puestos no es un entregable que el departamento de compensación pueda generar y aplicar por su cuenta. El flujo debe contemplar la aportación a la comisión negociadora, y el paquete documental debe estar preparado para esa mesa.

## 10. Fuentes

- [BOE-A-2022-18040, Orden PCM/1047/2022](https://www.boe.es/buscar/doc.php?id=BOE-A-2022-18040)
- [Guía de uso de la Herramienta de Valoración de Puestos de Trabajo, abril de 2022](https://www.igualdadenlaempresa.es/asesoramiento/herramientas-igualdad/docs/2022_04_01_Guia_Uso_Heramienta_SVPT.pdf) (42 páginas, extraída íntegramente)
- [BOE-A-2020-12215, Real Decreto 902/2020](https://www.boe.es/buscar/act.php?id=BOE-A-2020-12215)
