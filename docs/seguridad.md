# Postura de seguridad del sitio

Estado a 28 de julio de 2026. Cubre solo la web pública (`datalentsolutions.com`), no los sistemas de cliente.

## Resuelto

### Se eliminó la carga de JavaScript de terceros

`index.html` cargaba `https://unpkg.com/lucide@0.469.0`: **358 kB de JavaScript ejecutable desde un CDN público, sin atributo `integrity`**. Sin comprobación de integridad, cualquier compromiso de unpkg o secuestro del paquete habría ejecutado código arbitrario en el sitio, con acceso completo al DOM, incluida la página del formulario de contacto.

Servía a `IconComponent`, que **no se usaba en ninguna plantilla**. Riesgo máximo, beneficio cero. Eliminados script y componente.

### Angular actualizado, 8 avisos de severidad alta cerrados

De 20.3.2 a 20.3.26. Los que importaban aquí:

| Aviso | Por qué afectaba a este sitio |
|---|---|
| `GHSA-jrmj-c5cx-3cw6` XSS vía atributos de script en SVG sin sanear | El sitio tiene SVG en línea: logotipo, diagrama de límite de autonomía y avatar de Aura |
| `GHSA-58w9-8g37-x9v5` y `GHSA-f3m7-gqxr-g87x`, bypass del saneador | El acordeón del FAQ usa `[innerHTML]` y depende por completo del saneador de Angular |
| `GHSA-g93w-mfhg-p222`, `GHSA-prjf-86w9-mfqv` XSS en i18n | Menor, el sitio no usa i18n |

**Dependencias de producción: 0 vulnerabilidades.** Quedan 17 en dependencias de desarrollo (`webpack-dev-server`, `postcss`, `uuid`, `brace-expansion`, `@hono/node-server`) que no se empaquetan y nunca llegan al navegador.

### Fuentes autoalojadas

Se cargaban desde `fonts.googleapis.com`, lo que enviaba **la IP de cada visitante a Google** antes de pintar la página. Además de la cuestión de privacidad, contradecía el Pilar 2 del propio sitio: *"Datos alojados y gobernados bajo marco europeo, RGPD y EU AI Act"*. El LG München declaró en 2022 que incrustar Google Fonts sin consentimiento infringe el RGPD.

Inter y Source Serif 4 son SIL Open Font License 1.1, que permite el autoalojamiento. Se descargan solo los subconjuntos latin y latin-ext (Google servía siete, incluidos cirílico, griego y vietnamita).

**Resultado verificado: cero peticiones a terceros al cargar cualquier página.** Las únicas referencias externas que quedan son el enlace a LinkedIn del pie, que es navegación iniciada por la persona, y `api.emailjs.com`, contactado solo al enviar un formulario.

### CSP endurecida

```
default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
img-src 'self' data:; font-src 'self'; connect-src 'self' https://api.emailjs.com;
base-uri 'self'; form-action 'self'; object-src 'none'
```

Cambios: fuera `unpkg.com` de `script-src`, fuera los dominios de Google de `style-src` y `font-src`, `img-src` acotado (antes `https:` permitía cualquier imagen de cualquier origen) y añadido `object-src 'none'`.

`'unsafe-inline'` se mantiene en `style-src` por necesidad: Angular inyecta los estilos de componente en línea. Eliminarlo exige nonces por petición, que requieren servidor.

---

## Limitaciones conocidas, no resueltas

### No hay cabeceras HTTP de seguridad

**GitHub Pages no permite definir cabeceras de respuesta.** Consecuencias concretas:

- **`frame-ancestors` no funciona.** Estaba declarado como `'none'` dentro de la CSP en `<meta>`, pero el navegador **ignora esa directiva** cuando la política llega por meta etiqueta; solo surte efecto como cabecera HTTP. Se ha eliminado para no dar una falsa sensación de protección. **El sitio es hoy embebible en un iframe de terceros**, con el riesgo de clickjacking que eso implica.
- Tampoco pueden establecerse `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy` como cabecera (existe la meta equivalente, que sí funciona) ni `Permissions-Policy`.

**Cómo se resolvería:** servir el sitio detrás de Cloudflare Pages, Netlify o similar, que permiten cabeceras por configuración. Es un cambio de alojamiento, no de código, y traería además `frame-ancestors` real, HSTS y `Permissions-Policy`.

### El formulario no tiene protección contra abuso

Contacto y newsletter envían vía EmailJS desde el cliente. La clave pública de EmailJS está en el bundle **por diseño** (es pública, restringida por dominio), pero no hay límite de frecuencia propio ni prueba anti-bot. Un actor decidido puede automatizar envíos hasta agotar la cuota del plan de EmailJS.

Mitigación disponible sin backend: activar el límite de frecuencia y la restricción de dominio en el panel de EmailJS.

### Sin hidratación ni SSR

Documentado en `docs/release-notes-v2-sprint-07.md`. No es un problema de seguridad por sí mismo, pero cierra la puerta a CSP con nonce.

---

## Comprobado y correcto

- **`[innerHTML]`** solo recibe HTML escrito por el desarrollador desde `SITE_FAQ_ITEMS`. Ningún dato de usuario llega ahí. Documentado en el propio componente.
- **Aura** no procesa entrada de texto libre: guion cerrado, sin campo de escritura, sin superficie de inyección.
- **Enlaces externos** con `target="_blank"` llevan `rel="noopener noreferrer"`.
- **Sin secretos en el repositorio** más allá de las claves públicas de EmailJS, que están pensadas para ser públicas.
- **`referrer` en `strict-origin-when-cross-origin`**, que sí funciona vía meta.
