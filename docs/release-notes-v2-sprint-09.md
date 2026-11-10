# Notas de versión: Website v2, Sprint 9

**Fecha:** 10 de noviembre de 2026.
**Alcance:** seguridad, SEO técnico, experiencia de uso y captación B2B. Como el Sprint 8, corrige lo construido y añade solo dos páginas: una de error 404 y una de confianza y cumplimiento.

**Estado: sin commitear y sin desplegar.** Verificado en local con build de producción, prerender de las 12 rutas y recorrido en navegador a 1440 px y 375 px.

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

## Pendiente, y no es código

1. **Textos legales.** La política de cookies publicada es una plantilla sin terminar y describe cookies publicitarias que la web no usa; el aviso de cookies pide consentimiento para una analítica que no existe; falta el aviso legal de la LSSI-CE. Ver `docs/seguridad.md`.
2. **Panel de EmailJS.** Límite de frecuencia, restricción de dominio y destinatario fijo en la plantilla.
3. **Search Console y Bing.** Sigue sin verificar. Sin eso no se puede pedir la reindexación del título nuevo ni enviar el sitemap.
4. **Analítica.** No hay ninguna. Las decisiones de este sprint se han tomado midiendo el sitio, no a los visitantes.
5. **Cabeceras HTTP.** GitHub Pages no las permite; el sitio sigue siendo embebible en un iframe ajeno. Se resuelve cambiando de alojamiento.
6. **Un caso real anonimizado**, que sigue siendo lo que más pesa en una decisión de compra.
