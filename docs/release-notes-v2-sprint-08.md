# Notas de versión — Website v2, Sprint 8

**Alcance:** colorimetría, honestidad de la redacción, UX medida, marca, asistente Aura, seguridad e indexabilidad. A diferencia de los sprints anteriores, este no construyó páginas nuevas: corrigió lo construido. Casi todo lo que sigue son defectos que ya estaban en producción.

---

## El hallazgo que ordenó el sprint

Varias peticiones seguidas de "mejora la estética" tenían una causa común que no era estética: **el trabajo se commiteaba y no se desplegaba**. En una ronda, el usuario repitió la petición palabra por palabra porque estaba mirando el sitio en vivo y no había cambiado nada. Desde entonces, cada tanda termina en despliegue verificado.

Segunda lección del mismo tipo: **cuatro veces la verificación falló antes que el código.** Un `grep` que no contaba acentos escapados en un bundle minificado, una comprobación lanzada 20 segundos después del deploy sin dar tiempo a la propagación de GitHub Pages, dos consultas servidas desde la caché de Varnish. En los cuatro casos estuve a punto de informar de un fallo inexistente. **Cualquier verificación de este sitio dentro de los 10 minutos posteriores a un despliegue necesita anti-caché, o no significa nada.**

---

## Colorimetría

El diagnóstico salió de medir tonos, no de opinar. Los tokens estaban partidos en dos familias opuestas: superficies cálidas (paper 60°, paper-alt 48°, border 45°, bronze 38°) contra texto y grises fríos (ink 218°, slate 220°, mist 220°).

Lo que de verdad fallaba: **el acento vivía en 220°, el mismo tono exacto que `slate`, `mist` y `border-dark`.** Los grises de texto eran el azul desaturado. Sin distancia cromática, el acento no podía leerse como decisión de marca.

Ahora la rampa neutra completa es cálida (36–46°) y el azul es lo único frío, con unos 180° de separación. Los 18 pares de contraste que importan quedan verificados y anotados token a token.

De paso apareció un problema que el cambio de acento habría empeorado: el acento también se usa como **primer plano sobre `--color-ink`** (hover de enlaces del pie, focus rings en secciones oscuras, relleno de los botones primarios de cada banner). Ahí daba 1.69:1. Ya fallaba antes con el azul anterior a 2.68:1. Nuevo `--color-signal-on-dark` a 7.63:1.

---

## Redacción

Medido antes de tocar: **114 guiones largos en 10.816 palabras**, uno cada 41 en Workforce Intelligence, y la figura "X, no Y" **diez veces en una sola página**. Según el catálogo de WikiProject AI Cleanup ese es el indicador aislado más fiable de texto generado por modelo.

Reescritas las 12 rutas conservando cada afirmación, cifra y referencia normativa. Resultado: **cero guiones largos en las 10.816 palabras del sitio**.

Se conservó deliberadamente "No automatizamos decisiones; automatizamos trabajo": una antítesis aislada y memorable es buena prosa. El defecto era la acumulación.

También fuera: los cuatro emoji de la newsletter (un robot rotulando "Caso Agéntico" en una firma que vende gobernanza de IA), tres titulares con mayúscula inglesa en cada palabra, los cinco asteriscos del formulario (marcaban la mayoría en vez de la excepción, sin leyenda que los explicara) y **los siete avisos de política** del tipo "no publicamos cifras inventadas", que eran metacomentario defensivo. De esos siete, dos llevaban información real que se rescató antes de borrar.

---

## Correcciones de fondo

**"Seis prácticas" que eran cinco.** El sitio tiene 5 páginas de servicio y 5 enlaces de navegación, pero afirmaba "seis prácticas" en **nueve sitios de cara al usuario**, incluidos el `<h1>` y el `<title>` SEO del hub. Una respuesta del FAQ decía "seis" y a continuación enumeraba cinco. Se heredó de `.claude/CLAUDE.md`, que cuenta Compensación & Benefits y Total Rewards por separado, sin cuadrarlo con lo que se construyó. Queda documentada la divergencia para que nadie cambie una sin la otra.

**Pilar 03.** Fuera "Sin equipos junior de por medio".

---

## UX, todo medido

| Hallazgo | Antes | Después |
|---|---|---|
| Objetivos táctiles bajo 24×24 en móvil | 19, el peor a 17 px | 0 |
| Bordes izquierdos distintos en la misma página | 2 (247 px de desajuste a partir de 1280 px) | 1 |
| CTA de cierre | 2 idénticos `btn--primary` | primario + secundario |
| Racha máxima de párrafos seguidos | 8 | 1 |
| Pares término/definición semánticos | 0 | 31 |
| Altura de la cabecera (texto partido) | 86 px | 61 px |

El desajuste de márgenes tenía tres causas acumuladas, y la peor era que **`app-hero` no usaba contenedor**: el `<h1>` y las migas se renderizaban en x=0 mientras el logo y todos los `h2` estaban a 160 px, en todas las páginas.

Al arreglarlo apareció un cuarto problema: `--measure-body` estaba en `ch`, unidad relativa a la fuente de cada elemento, así que el mismo token daba 795 px en un párrafo y 1132 px en un `h2`, o sea ningún límite en los titulares.

---

## Destello de estilos sin aplicar

Angular servía la hoja global con `media="print"` más un `onload`, su optimización de CSS crítico. `.visually-hidden`, `.skip-link` y `ul,ol{list-style:none}` vivían **solo** ahí. Durante esa ventana quedaban a la vista el enlace de salto, el `<h2>` "Nuestros pilares" que existe solo para lectores de pantalla, y los bullets de la navegación.

Lo peor era qué exponía: contenido que solo debería percibir quien usa un lector de pantalla. Corregido con `inlineCritical: false`.

---

## Marca

Símbolo reconstruido en SVG y montado en cabecera y pie. **Es una reconstrucción a partir de una imagen, no el archivo de marca**: las terminaciones de los arcos del original van en bisel y las de la reconstrucción son perpendiculares, y los colores están estimados a ojo.

Se resolvió en tres iteraciones. Lo que fallaba: aperturas de arco de ±22° cuando el original ronda ±62° (con aperturas pequeñas los trazos se cruzan en el solape), un degradado en unidades de caja delimitadora que sobre una línea de altura cero no renderiza nada, y anillos terminales mellados porque la barra los atravesaba por el centro.

Nuevo `scripts/generar-marca.mjs` (`npm run marca`) que deriva favicon, apple-touch-icon e imagen OpenGraph de **una sola fuente**. Cuando llegue el vector real se sustituye ese SVG y se relanza el script.

Antes de esto: `favicon.ico` pesaba **0 bytes**, `og:image` apuntaba a un PNG **inexistente** (toda compartición en LinkedIn salía sin imagen, lo que anulaba el trabajo de prerenderizado del Sprint 7) y el logo del `Organization` era el icono dorado de personas de la v1.

---

## Aura

Asistente guiado, **determinista y sin modelo de lenguaje**. Dos razones, y la segunda pesa más: el sitio es estático sin backend, así que una clave de API acabaría legible en el bundle; y este sitio afirma en dos páginas que un chatbot no es un agente, de modo que un widget generativo sin gobernanza en el escaparate de una firma que vende gobernanza de IA sería la contradicción más cara posible. La v1 ya tuvo un botón de chatbot que no abría nada.

Las 10 preguntas frecuentes se extrajeron a `shared/content/faq-items.ts`, fuente única para `/faq` y para Aura.

**Se rechazó poner un retrato humano como imagen de Aura.** Un rostro fotorrealista comunica "hay una persona al otro lado" más deprisa de lo que cualquier texto lo desmiente, y el Reglamento Europeo de IA obliga a que se sepa que se interactúa con un sistema de IA cuando no resulte evidente. Se usa una marca abstracta con la gramática del signal mark.

---

## Seguridad

Ver `docs/seguridad.md` para el detalle. Lo esencial:

- **358 kB de JavaScript de terceros sin `integrity`** cargados desde unpkg, para un componente de iconos que no se usaba en ninguna plantilla. Eliminado.
- **Angular 20.3.2 → 20.3.26**, ocho avisos de severidad alta cerrados. Dos importaban aquí: XSS por atributos de script en SVG sin sanear (el sitio tiene tres SVG en línea) y dos bypass del saneador (el FAQ usa `[innerHTML]`). **Dependencias de producción: 0 vulnerabilidades.**
- **Fuentes autoalojadas.** Se cargaban de Google, enviando la IP de cada visitante antes de pintar la página, contra el Pilar 2 del propio sitio. Verificado: **cero peticiones a terceros al cargar**.
- **`frame-ancestors 'none'` no estaba haciendo nada.** El navegador ignora esa directiva cuando la CSP llega por `<meta>`. Eliminada en vez de dejarla dando falsa seguridad.

---

## Indexabilidad

`robots.txt` y `sitemap.xml`, que no existían. El sitemap se genera dentro de `prerender.mjs` a partir de las rutas que acaba de prerenderizar, y excluye `/home` porque canonicaliza a `/`.

Añadido `WebSite` schema, la señal que usa Google para decidir el nombre de sitio que muestra.

Eliminado leaflet: `MapComponent` no se usaba en ninguna parte pero su CSS ocupaba **10,1 kB de los 20 kB del CSS global**, y desde el arreglo del destello esa hoja bloquea el primer pintado. **CSS global: 20,0 kB → 9,6 kB.**

---

## Pendiente

1. **Un caso trabajado real y anonimizado.** Es lo único que separa este sitio de "no compraría", según su propia auditoría. Necesita material del cliente.
2. **El archivo de marca vectorial**, para sustituir la reconstrucción.
3. **Verificación en Search Console.** `google-site-verification` está vacío; sin propiedad verificada no se puede pedir reindexación, y los buscadores siguen mostrando el título y la descripción de la v1.
4. **Límite de frecuencia en EmailJS**, desde su panel, sin tocar código.
5. **Cabeceras HTTP de seguridad.** GitHub Pages no las permite: el sitio es hoy embebible en un iframe ajeno. Se resuelve cambiando de alojamiento.
6. **El retrato**, si se decide usarlo, en "quién lleva tu proyecto" y no en el asistente.
