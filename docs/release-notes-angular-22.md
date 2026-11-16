# Notas de versión: migración de Angular 20 a Angular 22

**Fecha:** 14 y 15 de noviembre de 2026.
**Alcance:** migración técnica. No cambia ningún texto, página, estilo ni comportamiento visible de la web.

**Estado: fusionada en `main` como `b1bce30` (pull request 12) y desplegada el 15 de noviembre de 2026.** El resultado en producción está en el apartado «Despliegue». Los apartados anteriores a ese se escribieron antes de fusionar y describen las pruebas hechas sobre la rama.

---

## Por qué

Angular 20 deja de recibir parches de seguridad el 28 de noviembre de 2026. Angular 22 tiene soporte activo hasta junio de 2027 y LTS hasta junio de 2028.

| Versión | Estado | Publicada | Soporte activo hasta | LTS hasta |
|---|---|---|---|---|
| 22 | Activa | 3 de junio de 2026 | junio de 2027 | junio de 2028 |
| 21 | LTS | 19 de noviembre de 2025 | 3 de junio de 2026 | junio de 2027 |
| 20 | LTS | 28 de mayo de 2025 | 19 de noviembre de 2025 | 28 de noviembre de 2026 |

Fuente: tabla de versiones con soporte del repositorio de Angular (`adev/src/content/reference/releases.md`, la misma que publica angular.dev/reference/releases), consultada el 14 de noviembre de 2026.

Dependabot ignora a propósito los saltos de versión mayor de Angular (`.github/dependabot.yml`). Esta es la migración manual que esa regla deja pendiente.

---

## Qué cambia

| Paquete | Antes | Después |
|---|---|---|
| Angular (`@angular/core` y el resto) | 20.3.35 | 22.2.6 |
| `@angular/cli` | 20.3.42 | 22.2.7 |
| Builder | `@angular-devkit/build-angular:browser` (Webpack) 20.3.42 | `@angular/build:application` 22.2.7 |
| TypeScript | 5.8.3 | 6.0.3 |
| `zone.js` | 0.15.1 | 0.16.3 |
| `tslib` | 2.8.1 | 2.9.1 (viene de `main`, no de la migración) |
| `rxjs`, `@emailjs/browser`, `puppeteer` | sin cambios | sin cambios |
| Paquetes en el lockfile | 1.044 | 624 |

### Los commits, en orden

1. **De 20.3.35 a 21.2.26** con `ng update`. Añade `provideZoneChangeDetection()` en `src/main.ts`: desde la 21, Angular solo programa la detección de cambios de zone.js si se le pide, y esta web sigue usando zone.js. TypeScript pasa a 5.9.
2. **De 21.2.26 a 22.2.6** con `ng update`. TypeScript pasa a 6.0. Tres ajustes a mano para que compilara:
   - `tsconfig.json` pierde `baseUrl` y `downlevelIteration`, que TypeScript 6 trata como error por obsoletos. El único import que dependía de `baseUrl` (en `email.service.ts`) pasa a ruta relativa.
   - `ng update` dejó a la vez `strictTemplates: false` y un bloque `extendedDiagnostics`, y Angular 22 rechaza esa combinación (error NG4003). Se quitaron los dos. Queda el valor por defecto de la 22, que es la comprobación estricta de plantillas.
   - Esa comprobación sacó dos errores de tipos, corregidos sin cambio de comportamiento: los `queryParams` del segundo botón del hero y el tipo del evento en el listener de tabulador del menú móvil.
3. **Builder `application`** en lugar de `browser`. Detalle en el apartado siguiente.
4. **`zone.js` 0.16.3.** Angular 20 solo admitía la 0.15. La 0.16.3 incluye correcciones de endurecimiento, y su único cambio incompatible es dejar de dar soporte a Internet Explorer y al Edge antiguo.
5. **Fusión de `main`**, que avanzó cuatro commits durante la migración (`tslib` 2.9.1 y tres acciones de GitHub). El lockfile se regeneró con `npm install`; no se resolvió a mano.
6. **Dependabot y documentación.**

Lo que la 22 cambia y aquí no afecta, comprobado en el código:

- Los componentes sin estrategia de detección declarada pasan a ser `OnPush`. Los 37 componentes del sitio ya declaraban `OnPush`.
- `paramsInheritanceStrategy` pasa a `always`. Ninguna ruta tiene parámetros.
- Desaparecen Hammer.js, `ComponentFactoryResolver`, `provideRoutes` y el backend XHR por defecto de `HttpClient`. El sitio no usa ninguno.
- TypeScript 6 activa `strict` por defecto. El código compila sin cambios.

### El builder

En Angular 22 el builder `browser` sigue funcionando, pero está marcado como obsoleto junto con todo el soporte de Webpack, y el paquete `@angular-devkit/build-angular` aparece como obsoleto en npm. Se pasó a `@angular/build:application` con la migración oficial (`ng update @angular/cli --name use-application-builder`), que dejaba tres cosas mal:

- **Carpeta de salida.** Escribía en `dist/datalent-web-page/browser`. `prerender.mjs` y `deploy.yml` esperan los archivos en `dist/datalent-web-page`. Corregido con `outputPath.browser: ""` en `angular.json`.
- **Script `prerender`.** Lo borraba de `package.json`. Restaurado.
- **`defaultProject`.** Clave que ya no es válida y provocaba un aviso en cada comando. Eliminada.

`inlineCritical: false` se conserva. Con un build de prueba se comprobó qué pasa si se activa: el builder deja la hoja de estilos con `media="print"` y añade un `<script>` en línea para activarla, que la CSP del sitio bloquea.

Medido con red lenta simulada (150 ms de latencia, 1,6 Mbps de bajada, procesador cuatro veces más lento, móvil de 375 px, mediana de cinco cargas). «Angular listo» es el momento en que Angular sustituye el HTML prerenderizado:

| Ruta | `main` (20, Webpack) | 22 con Webpack | 22 con `application` |
|---|---|---|---|
| `/` | 1.895 ms, 153 kB de JS | 1.970 ms, 165 kB | 1.722 ms, 124 kB |
| `/faq` | 2.034 ms, 158 kB | 2.125 ms, 170 kB | 1.986 ms, 128 kB |
| `/contacto` | 2.140 ms, 173 kB | 2.251 ms, 188 kB | 2.109 ms, 146 kB |
| `/servicios/agentic-ai-rrhh` | 2.109 ms, 163 kB | 2.189 ms, 176 kB | 2.054 ms, 136 kB |

El JavaScript está medido comprimido con gzip. Quedarse en Webpack con Angular 22 habría sido algo más lento y pesado que `main`; con el builder nuevo la web descarga entre un 16 % y un 19 % menos de JavaScript que `main`, según la ruta. La medición se hizo antes de subir `zone.js` y `tslib`, y no es Lighthouse (ver «Lo que no se pudo comprobar»).

El builder nuevo reparte el código en más archivos: la portada pide 5 archivos de JavaScript donde antes pedía 3, y una página de servicio pide 8 donde antes pedía 5.

---

## Comprobaciones

Todas sobre el build de producción (`npm ci` y `npm run build:prod`), servido con un servidor estático local que imita a GitHub Pages. Se guardó el `dist` de `main` antes de empezar y se comparó con el de la rama. Navegador: Chrome 157 en modo headless, con Puppeteer. axe-core 4.14.0.

| Comprobación | `main` | Rama |
|---|---|---|
| `npm ci` y `npm run build:prod` | sin errores | sin errores |
| `index.html` generados | 12 | 12 |
| `404.html` con `noindex` | sí | sí |
| `.well-known/security.txt` | sí | sí |
| `index.html` de la raíz prerenderizado | sí | sí |
| Rutas con un único `h1` | 13 de 13 | 13 de 13 |
| Rutas con canónico único y JSON-LD | 13 de 13 | 13 de 13 |
| Scripts en línea ejecutables en el HTML | 0 | 0 |
| Atributos `on*` (incluido `onload`) | 0 | 0 |
| Aviso de cookies en el HTML estático | 0 | 0 |
| Infracciones de CSP en navegador (26 cargas) | 0 | 0 |
| Peticiones a terceros al cargar (26 cargas) | 0 | 0 |
| Cookies | 0 | 0 |
| Salto de maquetación (CLS) máximo | 0 | 0 |
| Desbordamiento horizontal | 0 | 0 |
| axe-core, con el aviso de cookies a la vista (26 estados) | 0 infracciones | 0 infracciones |
| axe-core, con el aviso ya respondido (26 estados) | 0 infracciones | 0 infracciones |
| `npm audit --omit=dev` | 0 | 0 |
| `npm audit` completo | 21 moderadas | 0 |

Las 13 rutas son las 12 del prerender más la 404. Las 26 cargas son esas 13 rutas en móvil (375 px) y en escritorio (1.440 px). axe se pasó con las reglas WCAG 2.0, 2.1 y 2.2 en niveles A y AA.

**HTML prerenderizado.** En las 12 rutas y la 404 son idénticos a los de `main`: `lang`, título, descripción, `robots`, canónico, la CSP, las etiquetas Open Graph y Twitter, cada bloque JSON-LD (comparado ya interpretado, clave por clave), el `h1`, todos los encabezados, el texto completo de la página y la lista de enlaces. `styles.css` y todos los archivos de `assets` son idénticos byte a byte. Lo único que cambia en el HTML son los nombres de los archivos de JavaScript y tres `<link rel="modulepreload">` nuevos.

**Uso real.** Un recorrido automático repetido sobre los dos builds, en móvil y escritorio, da el mismo resultado en todo lo que anota:

- Aviso de cookies: aparece, se rechaza, se recuerda al recargar, se reabre desde «Configurar cookies» y recibe el foco, se acepta. `document.cookie` sigue vacío en todo momento.
- Aura: se abre, muestra el mismo primer mensaje y las mismas opciones, avanza al elegir y se cierra con Escape devolviendo el foco al lanzador.
- Preguntas frecuentes: las 12 preguntas, abrir y cerrar.
- Menú móvil (abrir, bloqueo del scroll, foco, Escape, navegar) y desplegable de escritorio (abrir, Escape, clic fuera, navegar).
- Formulario de contacto: los mismos campos, los mismos mensajes de error al enviar vacío y con un email inválido. No se envió ningún formulario: las peticiones a EmailJS estaban cortadas en la prueba y no llegó a intentarse ninguna.
- Aspecto: posición, tamaño y estilos calculados de cada elemento de cada página, tanto en carga directa como navegando dentro de la aplicación sin recargar.

`initialNavigation: 'enabledBlocking'` sigue en `src/app/app-routing.module.ts` sin tocar.

`ng serve` arranca con el builder nuevo y pinta las páginas con Angular 22.2.6 sin errores de consola.

Para saber que estas pruebas detectan lo que dicen detectar, se pasaron sobre una copia del build manipulada a propósito con un script en línea, un `onload`, un aviso de cookies en el HTML, una imagen de otro dominio y una cookie. Señalaron las cinco cosas.

---

## Despliegue (15 de noviembre)

**Antes de fusionar.** El pull request 12 se construyó en GitHub con `.github/workflows/pr-build.yml`, sobre la fusión de la rama con `main`: instalación, build, prerender y verificación sin errores. Eso confirma que la versión de Node del runner sirve para Angular 22.

Además de las pruebas de la rama, se hizo una revisión aparte sobre un build local de esa fusión, comparándolo con la web publicada ese día (Angular 20): 22 cargas (11 rutas en móvil y en escritorio) sin ninguna diferencia, axe-core sin infracciones en 37 estados y navegación interna por 8 páginas sin recargas ni errores.

**La fusión.** Se hizo con commit de fusión y no aplastada, para conservar un commit por paso (ver «Cómo volver atrás»). `deploy.yml` terminó con todos sus pasos correctos en unos 90 segundos.

**En producción.** Se guardó una foto de la web publicada justo antes de fusionar y se comparó con la de después:

| Comprobación | Resultado |
|---|---|
| 11 rutas en móvil (375 px) y escritorio (1.280 px), antes y después | 22 cargas, 0 diferencias |
| Errores de consola, infracciones de CSP, peticiones a terceros, cookies | 0 |
| axe-core (WCAG 2.0, 2.1 y 2.2, niveles A y AA), 37 estados | 0 infracciones |
| Aviso de cookies: posición, foco, rechazar, reabrir, visitante que ya decidió | igual que antes |
| 12 páginas con 200, URL inexistente con 404 y `noindex`, `security.txt`, `robots.txt`, `sitemap.xml`, `llms.txt` | correcto |

La comparación se hace con Angular ya arrancado y cubre título, descripción, `robots`, canónico, etiquetas Open Graph y Twitter, JSON-LD, encabezados, texto completo, enlaces, controles, número de elementos y altura de la página. También varias interacciones: el diálogo de Aura (abrir, avanzar, cerrar), el menú móvil, las preguntas frecuentes y los cuatro mensajes de error del formulario enviado vacío, con el foco en el primer campo. No se envió ningún formulario.

**Lighthouse en producción**, perfil móvil, versión 13.6.0. «Antes» es la medición del 14 de noviembre con Angular 20:

| Página | Rendimiento | JavaScript transferido | LCP | Tiempo de bloqueo |
|---|---|---|---|---|
| Portada | 99 → 99 | 154 → 126 kB | 1,1 → 2,1 s | 130 → 60 ms |
| Contacto | 98 → 99 | 174 → 147 kB | 1,0 → 0,9 s | 160 → 120 ms |
| Confianza | 99 → 100 | 161 → 131 kB | 0,9 → 0,9 s | 110 → 40 ms |
| Agentic AI | 99 → 100 | 164 → 137 kB | 1,0 → 1,0 s | 140 → 60 ms |

Accesibilidad, buenas prácticas y SEO dan 100 en las cuatro, igual que antes. El salto de maquetación (CLS) es 0.

**El LCP de la portada es el único dato que empeora, y la causa no está confirmada.** Es una cifra simulada por Lighthouse. Se repitió en cuatro pasadas (entre 2,09 y 2,12 s) y sigue por debajo del umbral de 2,5 s. En esas mismas pasadas, el LCP observado fue de 0,25 a 0,44 s. Medido aparte en un navegador con red y procesador lentos (150 ms de latencia, 1,6 Mbps, procesador cuatro veces más lento), el título de la portada se pinta a los 0,7 s y no vuelve a registrarse ningún candidato posterior.

**Visto en esa misma medición:** en `/contacto`, el elemento más grande de la página se vuelve a pintar a los 2,2 s, cuando Angular sustituye el HTML prerenderizado. No se midió con Angular 20, así que no se sabe si es nuevo. Es el coste de prerenderizar sin hidratación (punto 6 de las decisiones).

---

## Lo que sigue sin comprobar

El despliegue real, la versión de Node del runner, Lighthouse y la comparación con el `main` más reciente figuraban aquí antes de fusionar. Ya están comprobados; ver «Despliegue».

- **Otros navegadores.** Todo se probó en Chrome 157. No se probó Safari, Firefox ni un móvil real. El builder nuevo compila para los navegadores de «Baseline widely available».
- **El envío real del formulario.** Enviar uno habría mandado un correo de verdad. `@emailjs/browser` sigue en la misma versión (4.4.1) y el código que lo llama no cambia.
- **Lectores de pantalla.** axe-core es una comprobación automática. No se hizo prueba manual con VoiceOver ni NVDA.

Nota sobre la última pasada: se hizo con el portátil con la tapa cerrada, que se dormía en ciclos de hasta 15 minutos. Un prerender falló por tiempo de espera en una ruta mientras el equipo dormía. Repetido, pasó limpio a la primera.

---

## Decisiones que quedan para Gema

1. **Fusionar y desplegar.** Hecho el 15 de noviembre de 2026 por pull request (el 12). Ver «Despliegue».

2. **Quitar Karma y Jasmine.** Propuesta: quitarlos. El repositorio no tiene ninguna prueba (`*.spec.ts`), ni `karma.conf`, ni un objetivo `test` en `angular.json`, ni lo tenía antes de la migración. `npm test` termina con «Cannot determine project or target for command». No se ha quitado nada. Lo que saldría:
   - De `devDependencies`: `karma`, `karma-chrome-launcher`, `karma-coverage`, `karma-jasmine`, `karma-jasmine-html-reporter`, `jasmine-core` y `@types/jasmine`.
   - Los archivos `src/test.ts` y `tsconfig.spec.json`.
   - Los scripts `test`, `lint` y `e2e` de `package.json`, que no tienen objetivo detrás.

   Con eso desaparecen también tres avisos de paquetes obsoletos que salen en cada `npm ci` (`glob` 7, `inflight`, `rimraf` 3), que solo arrastra Karma. Si más adelante se quieren pruebas, el ejecutor por defecto de Angular 22 es Vitest.

3. **Quitar dos paquetes de Angular que no se usan.** `@angular/animations` no se importa en ningún archivo, y `@angular/platform-browser-dynamic` solo lo usa `src/test.ts`. Los dos están marcados como obsoletos en la 22. Tiene sentido quitarlos junto con el punto 2.

4. **Los pull requests de Dependabot abiertos.** Estado a 15 de noviembre, después de fusionar. Desde ese día cada uno se construye solo con `pr-build.yml`:
   - `zone.js` 0.16.3 (PR 8): Dependabot lo cerró al fusionar la migración, que ya lo incluye.
   - `jasmine-core` 7.0.2 (PR 9): el build falla en la instalación. `@types/jasmine` 7.0.0 (PR 6) y `karma-jasmine-html-reporter` 2.3.0 (PR 14) construyen. Los tres se cierran sin fusionar si se acepta el punto 2.
   - `@types/node` 26 (PR 7): construye. La migración no lo toca (sigue en la serie 20). El despliegue usa Node 22, así que lo coherente sería la serie 22 de los tipos y no la 26.
   - `@emailjs/browser` 5.0.3 (PR 13): construye, pero es un salto de versión mayor de la librería que envía el formulario de contacto. El build no prueba que el envío funcione: antes de fusionarlo hay que leer sus notas de versión y hacer un envío real.

5. **Una regla nueva en Dependabot.** Además de actualizar los comentarios, se añadió una regla para que no proponga saltos de `zone.js` fuera del rango que admite Angular, igual que ya hacía con TypeScript. Si no se quiere, son cuatro líneas de `.github/dependabot.yml`.

6. **Prerender nativo con hidratación.** Con el builder `application` ya es posible sustituir `prerender.mjs` por `@angular/ssr`. No se ha hecho: es un proyecto aparte, obliga a revisar los componentes que inyectan JSON-LD solo en navegador y hay que comprobar que la hidratación no meta scripts en línea que la CSP bloquee.

7. **La próxima migración.** Angular 22 sale de soporte activo en junio de 2027 y de LTS en junio de 2028.

### Cómo volver atrás

Cada paso es un commit. Revertir el del builder devuelve Webpack sin tocar Angular 22, y revertir el de `zone.js` vuelve a la 0.15.1, que Angular 22 también admite.
