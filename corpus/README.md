# Corpus normativo · Pay Transparency Compliance Agent

Base de conocimiento normativo del agente descrito en [`docs/pay-transparency-agent-architecture.md`](../docs/pay-transparency-agent-architecture.md).

Esto no es documentación. Es el activo del que depende la corrección de todo lo que el sistema afirme. Una cita mal recogida aquí se convierte en un informe indefendible ante inspección.

## Regla fundacional

**Cada afirmación normativa que el sistema emita debe poder trazarse a un fichero de este corpus, y cada fichero de este corpus debe poder trazarse a un texto oficial publicado.**

No se admite contenido redactado de memoria. Ni por una persona ni por un modelo. Si una fuente no se ha consultado, el registro correspondiente queda en estado `PENDIENTE_VERIFICACION` y el sistema no lo recupera.

## Estructura

```
corpus/
├── README.md                    este fichero
├── schema/
│   └── chunk-metadata.schema.json   contrato de metadatos, validado en ingesta
├── global/                      compartido entre todos los tenants
│   ├── ue/                      Derecho de la Unión
│   └── metodologia/             protocolo propio de Datalent
├── es/                          jurisdicción España
│   ├── MANIFEST.md              inventario de normas y su estado  ← empezar aquí
│   ├── vigente/                 norma en vigor y aplicable hoy
│   ├── tramitacion/             borradores y proyectos en curso
│   └── jurisprudencia/
└── eval/
    └── regression-suite.md      suite de regresión del corpus
```

## Los tres estados de una regla

Este modelo nace de un hallazgo concreto: a 29 de julio de 2026 **España no ha transpuesto la Directiva (UE) 2023/970**. Un motor de cumplimiento que asuma que los artículos de la Directiva son directamente exigibles a un empleador privado español produce falsos positivos y expone al cliente.

Toda regla del catálogo lleva uno de estos tres estados, y el agente debe comportarse distinto en cada uno:

| Estado | Qué significa | Cómo lo trata el agente |
|---|---|---|
| `VIGENTE` | Norma nacional en vigor, directamente exigible | Incumplirla es un hallazgo. Se reporta como tal, con sanción prevista |
| `INTERPRETATIVO` | Norma UE no transpuesta. Sin efecto directo horizontal entre particulares, pero los tribunales aplican interpretación conforme del Derecho nacional a la luz de la Directiva | No genera hallazgo de incumplimiento. Genera **riesgo interpretativo**: el juez puede leer la norma española a la luz de este texto. Se reporta en sección separada |
| `PREVISTO` | Borrador o proyecto en tramitación | No genera hallazgo. Genera **riesgo de preparación**: cuánto trabajo hay pendiente y qué plazo queda. Se reporta como horizonte |

Mezclar los tres en una sola puntuación de cumplimiento es el error que hace inútil un informe. Un cliente que lea "incumple el art. 5 de la Directiva" cuando ese artículo aún no es exigible en España pierde la confianza en todo lo demás que diga el documento.

> **Matiz jurídico.** Una directiva no transpuesta puede tener efecto directo vertical (frente al Estado y entidades del sector público) pero no horizontal entre particulares. La doctrina de interpretación conforme obliga al juez nacional a interpretar el Derecho interno a la luz de la directiva en la medida de lo posible. Esto significa que el art. 28 ET y el RD 902/2020 pueden ya hoy leerse con el criterio de la Directiva. `[VALIDATE: confirmación por asesoría laboral del alcance práctico de la interpretación conforme en materia de carga de la prueba retributiva, y del efecto directo vertical para clientes del sector público]`

## Jerarquía de autoridad

Campo `autoridad` del esquema de metadatos. Ante contradicción entre dos fragmentos, gana el de valor más bajo, y el Legal Agent debe señalar el conflicto de forma expresa en lugar de resolverlo en silencio.

| Valor | Fuente |
|---|---|
| 1 | Derecho originario y Reglamentos de la UE |
| 2 | Directivas de la UE |
| 3 | Norma nacional con rango de ley |
| 4 | Reglamento nacional (real decreto) |
| 5 | Convenio colectivo |
| 6 | Guía de autoridad administrativa (AEPD, Inspección de Trabajo, Comisión) |
| 7 | Jurisprudencia (se pondera aparte por instancia y firmeza) |
| 8 | Política interna del cliente |
| 9 | Metodología propia de Datalent |

## Reglas de troceado

Resumen operativo. El detalle y la justificación están en la sección 5.3 del documento de arquitectura.

- **Nunca se parte un artículo.** La unidad mínima es el artículo o el apartado numerado, para que el fragmento sea citable como "art. 9.1.c".
- **Los considerandos van aparte**, enlazados al artículo que interpretan.
- **Las tablas salariales no se vectorizan.** Van a base de datos relacional. Ninguna cifra se recupera nunca por similitud semántica.
- **Las descripciones de puesto van completas** en un solo fragmento: el sesgo de lenguaje es una propiedad del texto entero.

## Ciclo de actualización

```
Detección → Staging → Diff normativo → Revisión humana → Suite de regresión → Publicación
```

Nada entra en producción sin pasar la suite de `eval/regression-suite.md` y sin firma de la persona responsable de contenido jurídico. La versión anterior del corpus no se borra: cada informe emitido registra con qué versión se generó, para que un año después la conclusión siga siendo reproducible.

Fuentes de detección de cambio para España: BOE (API de datos abiertos), portal de participación pública del Ministerio de Trabajo, EUR-Lex para el texto consolidado de la Directiva.

## Qué falta

Ver `es/MANIFEST.md`, columna de estado. Ningún registro está verificado contra texto oficial todavía: el manifiesto es el plan de trabajo, no el corpus terminado.
