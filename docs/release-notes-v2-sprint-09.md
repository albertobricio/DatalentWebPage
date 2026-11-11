# Notas de versión: Website v2, Sprint 9

**Fecha:** 10 de noviembre de 2026.
**Alcance:** seguridad, SEO técnico, experiencia de uso y captación B2B. Como el Sprint 8, corrige lo construido y añade solo dos páginas: una de error 404 y una de confianza y cumplimiento.

**Estado: confirmado y subido en la rama `web/sprint-9-seguridad-seo-b2b`, sin fusionar en `main` y sin desplegar.** El despliegue se lanza al llegar a `main`. Verificado en local con build de producción, prerender de las 12 rutas y recorrido en navegador a 1440 px y 375 px.

---

## Lo que estaba roto y no se veía

| Hallazgo | Antes | Después |
|---|---|---|
| Vulnerabilidades en dependencias de producción | 8 (4 altas) | 0 |
| Vulnerabilidades en dependencias de desarrollo | 49 (5 críticas) | 21, todas moderadas |
| Página de contacto en un móvil de 375 px | 497 px de ancho, texto cortado | 375 px |
| Enlace «Contáctanos» del final del FAQ | llevaba a la portada | banner con el CTA a `/contacto` |
| URL que ve el visitante en la portada | `/home` | `/` |
| «Inicio» marcado como activo en la cabecera | nunca | sí |
| Descargas de la fuente Inter en la primera visita | 3 del mismo archivo (145 kB) | 1 (48 kB) |
| Conexión con EmailJS al abrir cualquier página | sí (`preconnect`) | solo al enviar el formulario |
| `security.txt` publicado | no (no se copiaba al build) | sí |
| URL inexistente | redirigía a la portada | página 404 con `noindex` |
| Páginas con migas en datos estructurados | 0 | 9 |
| Páginas con sus preguntas en datos estructurados | 0 | 5 |

El desbordamiento en móvil venía de un `<select>`: mide lo que mide su opción más larga, y una columna de rejilla en `1fr` no encoge por debajo de su contenido. Solución: `minmax(0, 1fr)`.

---

## Seguridad

Detalle en `docs/seguridad.md`. Lo esencial:

- Angular 20.3.26 → 20.3.35. En julio el sitio estaba a cero avisos; en noviembre tenía ocho sin que nadie hubiera tocado nada. Por eso se añaden Dependabot y un paso de auditoría en el despliegue.
- Acciones de GitHub fijadas por SHA en `deploy.yml`, que tiene permiso de escritura sobre el repositorio.
- Formulario: campo trampa, tiempo mínimo de envío, espera entre envíos, y validación con tipos estrictos en `EmailService` (antes aceptaba `any`).
- Eliminados de la raíz `robots.txt`, `sitemap.xml` y `.well-known/assetlinks.json`: no se desplegaban y contradecían a los reales (dominio con `www.`, URLs con `#`).

---

## SEO

- **Portada en `/`.** `/home` queda como redirección y se sigue prerenderizando para no romper enlaces.
- **Título de la portada.** De «Datalent Solutions | Agentic AI para RR. HH. gobernada en Europa» a «IA para recursos humanos, gobernada en Europa | Datalent». La portada y `/servicios/agentic-ai-rrhh` competían por el mismo término; ahora la portada va al término amplio y la página de servicio conserva el específico.
- **Datos estructurados.** `SeoService` emite `BreadcrumbList` y `FAQPage` a partir de las mismas listas que pintan las migas y el acordeón, en un único `@graph` por página. Solo se marcan preguntas visibles en la página.
- **Directiva `robots`.** `SeoService` sustituía la de `index.html` por un «index, follow» a secas y se perdían `max-snippet` y `max-image-preview`. Corregido.
- **Enlazado interno.** Nueva columna «Servicios» en el pie con las cinco páginas de práctica, que son las que llevan el schema `Service`. Antes el menú y el pie solo enlazaban a `/servicios#ancla`.
- **404 real**, generado por el prerender a partir de `NotFoundComponent`.

---

## Experiencia de uso

- **Contacto.** El formulario ya no desaparece tras una línea verde: al enviar se sustituye por una confirmación que recibe el foco. Con errores, el foco va al primer campo inválido. En móvil el formulario queda justo debajo del titular; antes había tres pantallas de texto por delante.
- **«Qué pasa después».** Tres pasos junto al formulario, con el texto que ya estaba en el FAQ y en Home.
- **FAQ** alineada con el resto del sitio (era la única página con el titular centrado y en azul) y con el mismo banner de cierre.
- **Foco al navegar.** Tras cada cambio de ruta el foco pasa al `<main>`. Antes se quedaba en el enlace pulsado y un lector de pantalla no anunciaba la página nueva.
- **Cabecera.** «Soluciones» se marca como activo en `/servicios/*`, y el desplegable se cierra con Escape o con un clic fuera.

---

## B2B

- **Cualificación en el formulario.** Dos campos opcionales: teléfono y tamaño de empresa, con los tramos de la definición europea de pyme (Recomendación 2003/361/CE). Viajan dentro del mensaje, así que llegan sin tocar la plantilla de EmailJS.
- **`/confianza`.** Página para quien revisa a un proveedor desde compras, legal o TI. No afirma nada nuevo: reúne lo que ya decían el FAQ y las páginas de servicio, y añade hechos comprobables de la propia web. **Pendiente de revisión de Gema antes de publicar.**

---

## Segunda pasada: accesibilidad y rendimiento medidos (11 de noviembre)

### Accesibilidad

Auditoría con axe-core (reglas WCAG 2.0, 2.1 y 2.2 en niveles A y AA, más buenas prácticas) sobre el build de producción: las 12 páginas y la 404, en móvil y escritorio, y además con Aura abierta, con el menú móvil abierto y con el formulario mostrando errores. **29 estados, 0 infracciones** tras corregir tres cosas, todas anteriores al sprint:

| Hallazgo | Dónde | Arreglo |
|---|---|---|
| Enlace dentro de un párrafo distinguible solo por el color (1,5:1 frente al texto; WCAG 1.4.1 pide 3:1 u otra señal) | Workforce Intelligence | Los enlaces dentro de párrafos y definiciones se subrayan en todo el sitio |
| Región con scroll propio inalcanzable con teclado (WCAG 2.1.1) | Diagrama de límite de autonomía, en móvil | `tabindex`, rol y nombre accesible |
| Dos cabeceras de sitio para un lector de pantalla | Panel de Aura abierto | El `<header>` del panel pasa a `<div>` |

### La redirección a HTTPS impedía probar el sitio

`src/main.ts` redirigía a `https://<host>/`, sin el puerto, en cualquier host que no fuera `localhost`. Abrir el sitio en `127.0.0.1` o en la IP de la red local, que es como se prueba en un móvil real, llevaba a una página de error del navegador. Lighthouse usa `127.0.0.1`, así que tampoco se podía auditar. Ahora la redirección solo actúa en `datalentsolutions.com`.

### Rendimiento

Lighthouse 13, perfil móvil, sobre el build de producción servido en local. El servidor local no comprime, así que los tiempos absolutos salen peores que en GitHub Pages; lo que vale es la comparación.

| | Antes | Después |
|---|---|---|
| Salto de maquetación (CLS) en Contacto, Confianza y Agentic AI | 0,93 | 0 |
| Puntuación de rendimiento en esas tres páginas | 52 a 53 | 79 a 81 |
| CLS y rendimiento en la portada | 0 y 98 | 0 y 99 |
| Accesibilidad, buenas prácticas y SEO (5 páginas medidas) | sin medir | 100 en las tres |

El umbral de «bueno» para el CLS es 0,1. El salto venía de la falta de hidratación: en cualquier página que no fuera la portada, Angular sustituía el HTML prerenderizado por cabecera, contenido vacío y pie, el pie subía hasta arriba, y volvía a bajar al llegar el código de la página. Con `initialNavigation: 'enabledBlocking'` Angular no pinta hasta tener la página entera. Comprobado fotograma a fotograma con la red limitada: no hay ningún instante en blanco en el relevo.

**Lo que queda sin resolver.** En esas mismas páginas Lighthouse da un LCP de 5 a 6 s, frente a 1,2 s en la portada. El contenido está en pantalla desde el primer pintado (1,2 a 1,6 s), pero como Angular vuelve a crear los elementos al arrancar, Lighthouse fecha el LCP en ese momento. Medido con la API del navegador (`PerformanceObserver`) el LCP coincide con el primer pintado. No se ha podido determinar cuál de las dos cifras verán los datos de campo de Google. La solución de fondo es la hidratación real, que exige prerenderizar con Angular SSR en lugar de con Puppeteer: es una migración, no un ajuste.

---

## Pendiente, y no es código

1. **Textos legales.** La política de cookies publicada es una plantilla sin terminar y describe cookies publicitarias que la web no usa; el aviso de cookies pide consentimiento para una analítica que no existe; falta el aviso legal de la LSSI-CE. Ver `docs/seguridad.md`.
2. **Panel de EmailJS.** Límite de frecuencia, restricción de dominio y destinatario fijo en la plantilla.
3. **Search Console y Bing.** Sigue sin verificar. Sin eso no se puede pedir la reindexación del título nuevo ni enviar el sitemap.
4. **Analítica.** No hay ninguna. Las decisiones de este sprint se han tomado midiendo el sitio, no a los visitantes.
5. **Cabeceras HTTP.** GitHub Pages no las permite; el sitio sigue siendo embebible en un iframe ajeno. Se resuelve cambiando de alojamiento.
6. **Un caso real anonimizado**, que sigue siendo lo que más pesa en una decisión de compra.
