# Postura de seguridad del sitio

Estado a 10 de noviembre de 2026. Cubre solo la web pública (`datalentsolutions.com`), no los sistemas de cliente.

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

### Noviembre de 2026: los avisos habían vuelto

El párrafo anterior dejó de ser cierto sin que nadie tocara el código. Entre julio y noviembre se publicaron avisos nuevos contra la misma versión de Angular, y el 10 de noviembre `npm audit --omit=dev` daba **8 vulnerabilidades de producción, 4 de severidad alta**. Dos tocaban directamente al sitio: `GHSA-hh8m-fm6v-7cvg` (bypass del saneador por host bindings de directivas) y `GHSA-jj27-h5hq-8x99` (XSS en i18n).

- Angular 20.3.26 → **20.3.35**. Producción vuelve a 0.
- Dependencias de desarrollo: de 49 avisos (5 críticos, 20 altos) a 21, todos moderados, con `npm audit fix` sin `--force`.

Lo que cambia para que no se repita:

- **`.github/dependabot.yml`**: propone cada semana las actualizaciones de npm y de las acciones de GitHub como pull request. No despliega nada por sí solo.
- **Paso de auditoría en `deploy.yml`**: `npm audit --omit=dev --audit-level=high` en cada despliegue. Avisa, no bloquea.
- **Acciones fijadas por SHA de commit** en `deploy.yml`. Ese workflow tiene permiso de escritura sobre el repositorio; una etiqueta como `@v4` se puede mover a otro commit y un SHA no.

Queda una cosa que no se hace desde el código: activar las **alertas de Dependabot** en GitHub (Settings → Code security), que avisan por correo cuando aparece un aviso contra una dependencia ya instalada.

### Fuentes autoalojadas

Se cargaban desde `fonts.googleapis.com`, lo que enviaba **la IP de cada visitante a Google** antes de pintar la página. Además de la cuestión de privacidad, contradecía el Pilar 2 del propio sitio: *"Datos alojados y gobernados bajo marco europeo, RGPD y EU AI Act"*. El LG München declaró en 2022 que incrustar Google Fonts sin consentimiento infringe el RGPD.

Inter y Source Serif 4 son SIL Open Font License 1.1, que permite el autoalojamiento. Se descargan solo los subconjuntos latin y latin-ext (Google servía siete, incluidos cirílico, griego y vietnamita).

**Resultado verificado: cero peticiones a terceros al cargar cualquier página.** Las únicas referencias externas que quedan son el enlace a LinkedIn del pie, que es navegación iniciada por la persona, y `api.emailjs.com`, contactado solo al enviar un formulario.

**Corrección de noviembre de 2026.** Eso no era del todo cierto: `index.html` llevaba `<link rel="preconnect" href="https://api.emailjs.com">`. Un preconnect no es una petición HTTP, pero abre la conexión, de modo que la IP de cada visitante llegaba a EmailJS en todas las páginas aunque nunca enviara el formulario. Eliminado. Ahora la conexión con EmailJS solo se abre al pulsar «Enviar solicitud».

De paso: los tres archivos de Inter (400, 600 y 700) eran el mismo archivo con tres nombres, porque Inter es una fuente variable. El navegador descargaba 48 kB tres veces. Ahora hay un único `inter-latin.woff2` con el rango de pesos 400–700.

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

### El formulario solo tiene protección contra abuso en el navegador

Contacto envía vía EmailJS desde el cliente. La clave pública de EmailJS está en el bundle **por diseño** (es pública, restringida por dominio).

Desde noviembre de 2026 el formulario lleva:

- **Campo trampa** (`referencia`), invisible y fuera del orden de tabulación. Si llega relleno, no se envía.
- **Tiempo mínimo** de 3 segundos entre abrir la página y enviar.
- **Espera de 60 segundos** entre dos envíos desde el mismo navegador.
- **Validación y limpieza** en `EmailService`: tipos estrictos (antes `any`), longitud máxima por campo y eliminación de caracteres de control, que es el vector de inyección de cabeceras de correo.

Nada de eso es protección real: todo corre en el navegador de quien envía, y quien llame a la API de EmailJS directamente con la clave pública se lo salta. Frena a los bots genéricos y los envíos repetidos por error.

**Pendiente, en el panel de EmailJS y sin tocar código:**

1. Activar el límite de frecuencia.
2. Restringir la clave al dominio `datalentsolutions.com`.
3. **Fijar el destinatario en la plantilla.** El formulario envía un parámetro `to_email`. Si la plantilla usa `{{to_email}}` como destinatario, cualquiera con la clave pública puede hacer que la cuenta envíe correo a la dirección que quiera. El destinatario debe estar escrito en la plantilla, no venir del navegador. Cuando esté fijado, se puede quitar `to_email` del código.

### Sin hidratación ni SSR

Documentado en `docs/release-notes-v2-sprint-07.md`. No es un problema de seguridad por sí mismo, pero cierra la puerta a CSP con nonce.

---

### Los textos legales no describen lo que hace la web

Hallazgo de noviembre de 2026. No es un fallo de código, pero es el riesgo más visible para una firma que vende gobernanza:

- **La web no instala ninguna cookie** (`document.cookie` vacío en todas las páginas) y la CSP impide cargar scripts de analítica o publicidad. Aun así, el aviso dice «Usamos cookies para mejorar tu experiencia y analizar el uso del sitio».
- **`cookie-policy.pdf` es una plantilla sin terminar.** Declara cookies publicitarias y de terceros (Google, Meta, LinkedIn, TikTok, Microsoft, Braze), conserva el rótulo «Ejemplo de texto de banner» y, donde debería ir la tabla de cookies, dice «(Se mantiene la tabla original actualizada…)».
- **`data-privacy.pdf`** afirma que el sitio usa cookies «con fines técnicos, analíticos y publicitarios», da el código postal 26400 (la política de cookies dice 16400) y un correo de DPD distinto (`dpd@` frente a `dpo@`).
- **No hay aviso legal** con los datos identificativos que exige la LSSI-CE (art. 10).

**Decisión de Gema (10 de noviembre de 2026): el aviso de cookies se queda como está.** No hay que volver a proponer retirarlo. Sigue pendiente la revisión de los dos PDF y del aviso legal, que corresponde a Gema y a quien la asesore legalmente.

### Publicado: `/.well-known/security.txt`

El archivo existía en la raíz del repositorio pero **nunca se desplegaba**: no estaba en los `assets` de `angular.json`. Además apuntaba a `www.` y caducaba el 22 de diciembre de 2026. Ahora vive en `src/.well-known/`, se copia en el build, caduca el 1 de noviembre de 2027 y el despliegue falla si falta. **Hay que renovar la fecha `Expires` antes de esa fecha.**

## Comprobado y correcto

- **`[innerHTML]`** solo recibe HTML escrito por el desarrollador desde `SITE_FAQ_ITEMS`. Ningún dato de usuario llega ahí. Documentado en el propio componente.
- **Aura** no procesa entrada de texto libre: guion cerrado, sin campo de escritura, sin superficie de inyección.
- **Enlaces externos** con `target="_blank"` llevan `rel="noopener noreferrer"`.
- **Sin secretos en el repositorio** más allá de las claves públicas de EmailJS, que están pensadas para ser públicas.
- **`referrer` en `strict-origin-when-cross-origin`**, que sí funciona vía meta.
