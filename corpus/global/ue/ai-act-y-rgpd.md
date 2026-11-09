# Reglamento de IA y RGPD · artículos verificados

| | |
|---|---|
| **Refs corpus** | `UE-REG-2024-1689`, `UE-REG-2016-679` |
| **Autoridad** | 1 (reglamentos de la UE) |
| **Estado regla** | `VIGENTE`. Son **reglamentos**, directamente aplicables sin transposición |
| **Verificación** | `VERIFICADO_PARCIAL`. Texto literal extraído de los PDF oficiales del DOUE |

> **La asimetría que conviene explicar al cliente.** La norma que regula el sistema de IA que va a usar ya le obliga y es directamente aplicable. La norma que regula la transparencia retributiva que quiere cumplir todavía no está transpuesta en España. Reglamento frente a directiva.

---

## Reglamento (UE) 2024/1689 · Reglamento de Inteligencia Artificial

De 13 de junio de 2024. DOUE de 12 de julio de 2024, 144 páginas. Espejo BOE: [DOUE-L-2024-81079](https://www.boe.es/buscar/doc.php?id=DOUE-L-2024-81079).

### Anexo III, punto 4 · Empleo, gestión de los trabajadores y acceso al autoempleo

Literal:

> a) Sistemas de IA destinados a ser utilizados para la contratación o la selección de personas físicas, en particular para publicar anuncios de empleo específicos, analizar y filtrar las solicitudes de empleo y evaluar a los candidatos
>
> b) Sistemas de IA destinados a ser utilizados para **tomar decisiones que afecten a las condiciones de las relaciones de índole laboral** o a la promoción o rescisión de relaciones contractuales de índole laboral, para la asignación de tareas a partir de comportamientos individuales o rasgos o características personales o para supervisar y evaluar el rendimiento y el comportamiento de las personas en el marco de dichas relaciones

La retribución es una condición de la relación laboral. La clasificación de alto riesgo del Pay Transparency Compliance Agent se apoya en el punto 4(b), y el analizador de ofertas de empleo cae además bajo el 4(a).

### Art. 6 · Reglas de clasificación de alto riesgo

El apartado 2 remite al Anexo III. El apartado 3 abre una excepción cuando el sistema no plantee un riesgo importante, aplicable si concurre alguna de estas condiciones:

- a) tarea de procedimiento limitada
- b) mejorar el resultado de una actividad humana previamente realizada
- c) detectar patrones de decisión o desviaciones sin sustituir ni influir en la valoración humana previa sin revisión adecuada
- d) tarea preparatoria para una evaluación

**Y el párrafo que cierra la puerta, literal:**

> No obstante lo dispuesto en el párrafo primero, los sistemas de IA a que se refiere el anexo III **siempre se considerarán de alto riesgo cuando el sistema de IA efectúe la elaboración de perfiles de personas físicas**.

Esto confirma la afirmación de la sección 10.2 de la arquitectura: la excepción del art. 6.3 **no es invocable** para los módulos de valoración de puestos ni de detección de sesgo, porque ambos elaboran perfiles de personas físicas. Verificado, no deducido.

El art. 6.4 añade que el proveedor que considere que su sistema del Anexo III no es de alto riesgo **debe documentar esa evaluación antes de introducirlo en el mercado**, y queda sujeto a la obligación de registro del art. 49.2.

### Art. 14 · Supervisión humana

Los sistemas de alto riesgo se diseñan para poder ser vigilados de manera efectiva por personas físicas durante su uso, con herramientas de interfaz humano-máquina adecuadas. Las medidas serán **proporcionales a los riesgos, al nivel de autonomía y al contexto de uso**.

Esa proporcionalidad al nivel de autonomía es la razón por la que el punto de control humano del agente no es negociable: cuanto más autónomo sea el sistema, más exigente debe ser la supervisión.

### Art. 26 · Obligaciones del responsable del despliegue

Es el cliente, no Datalent, quien asume estas. Apartados relevantes: usar el sistema conforme a las instrucciones (26.1), **encomendar la supervisión humana a personas con la competencia, formación y autoridad necesarias** (26.2), asegurar que los datos de entrada sean pertinentes y representativos en la medida en que controle esos datos (26.4), y vigilar el funcionamiento e informar de incidentes graves (26.5).

**Art. 26.7, literal:**

> Antes de poner en servicio o utilizar un sistema de IA de alto riesgo en el lugar de trabajo, los responsables del despliegue que sean empleadores **informarán a los representantes de los trabajadores y a los trabajadores afectados** de que estarán expuestos a la utilización del sistema de IA de alto riesgo.

Consecuencia de producto: el sistema no debe habilitarse para un tenant sin constancia de que esa comunicación se ha realizado. Es una obligación del cliente, y el producto la facilita con plantilla y registro.

### Art. 4 · Alfabetización en materia de IA

Proveedores y responsables del despliegue adoptan medidas para que su personal tenga un nivel suficiente de alfabetización en IA, atendiendo a conocimientos, experiencia, formación y contexto de uso.

### Art. 113 · Calendario, literal

> Será aplicable a partir del **2 de agosto de 2026**. No obstante:
> a) los capítulos I y II serán aplicables a partir del **2 de febrero de 2025**;
> b) el capítulo III sección 4, el capítulo V, el capítulo VII, el capítulo XII y el artículo 78, a partir del **2 de agosto de 2025**, a excepción del artículo 101;
> c) el **artículo 6, apartado 1**, y las obligaciones correspondientes, a partir del **2 de agosto de 2027**.

Lectura para el producto: las obligaciones de alto riesgo por Anexo III (art. 6.2) entran con la fecha general del **2 de agosto de 2026**. La fecha de 2027 es solo para el art. 6.1, que cubre los sistemas integrados en productos del Anexo I y no aplica aquí. El art. 4 sobre alfabetización está en el capítulo I, luego rige desde el 2 de febrero de 2025.

`[VALIDATE: comprobar si alguna iniciativa posterior de simplificación normativa ha modificado este calendario. La corrección de errores DOUE-L-2025-81474 existe y no se ha revisado.]`

---

## Reglamento (UE) 2016/679 · RGPD

De 27 de abril de 2016. Aplicable desde el 25 de mayo de 2018. Espejo BOE: [DOUE-L-2016-80807](https://www.boe.es/buscar/doc.php?id=DOUE-L-2016-80807).

### Art. 22 · Decisiones individuales automatizadas, incluida la elaboración de perfiles

> 1. Todo interesado tendrá derecho a no ser objeto de una decisión basada únicamente en el tratamiento automatizado, incluida la elaboración de perfiles, que produzca efectos jurídicos en él o le afecte significativamente de modo similar.

Excepciones del apartado 2: necesidad contractual, autorización por Derecho de la Unión o nacional con salvaguardias, o consentimiento explícito. En los casos a) y c) el responsable debe garantizar **como mínimo el derecho a obtener intervención humana, a expresar su punto de vista y a impugnar la decisión**.

Es el fundamento jurídico del principio rector del sistema: el agente nunca decide sobre la retribución de una persona identificada. No es una preferencia de diseño.

### Art. 35 · Evaluación de impacto relativa a la protección de datos

Obligatoria cuando el tratamiento entrañe un alto riesgo, y **en particular** en caso de:

> a) evaluación sistemática y exhaustiva de aspectos personales de personas físicas que se base en un tratamiento automatizado, como la elaboración de perfiles, y sobre cuya base se tomen decisiones que produzcan efectos jurídicos para las personas físicas o que les afecten significativamente

El apartado 2 obliga a recabar el asesoramiento del delegado de protección de datos si ha sido nombrado. La DPIA del producto encaja de lleno en la letra a).

### Art. 9 · Categorías especiales de datos

Prohibido, salvo excepciones del apartado 2, el tratamiento de datos que revelen **origen étnico o racial, opiniones políticas, convicciones religiosas o filosóficas o afiliación sindical**, y de datos genéticos, biométricos identificativos, de salud, o relativos a la vida u orientación sexuales.

**El sexo no figura en esta lista.** Es la razón por la que el análisis de brecha de género no activa el art. 9, mientras que un análisis de equidad por origen étnico o por afiliación sindical sí lo hace y exige base jurídica adicional del apartado 2.

### Art. 88 · Tratamiento en el ámbito laboral

Habilita a los Estados miembros a establecer, por ley o **por convenio colectivo**, normas más específicas para el tratamiento de datos de trabajadores, incluidas expresamente las relativas a **igualdad y diversidad en el lugar de trabajo**.

Consecuencia de producto: el convenio colectivo aplicable puede contener reglas de tratamiento de datos que se sumen al RGPD. El motor ya trata el convenio como fuente para la parte retributiva; también lo es para la parte de protección de datos.

## Fuentes

- [Reglamento (UE) 2024/1689, PDF oficial del DOUE](https://www.boe.es/doue/2024/1689/L00001-00144.pdf) · 144 páginas, extraído íntegramente
- [Reglamento (UE) 2016/679, PDF oficial del DOUE](https://www.boe.es/doue/2016/119/L00001-00088.pdf) · 88 páginas, extraído íntegramente
