/**
 * Genera los activos de marca derivados a partir de UNA sola fuente:
 * src/assets/logo-simbolo.svg
 *
 *   - favicon.ico            (contenedor ICO con carga PNG de 32x32)
 *   - assets/favicon-32.png
 *   - assets/favicon-180.png (apple-touch-icon)
 *   - assets/og-image.png    (1200x630, para LinkedIn, Slack y WhatsApp)
 *
 * Por qué existe este script en vez de haber metido los ficheros a mano: el
 * símbolo actual es una reconstrucción, no el archivo de marca. Cuando llegue
 * el vector real basta con sustituir logo-simbolo.svg y volver a lanzar esto;
 * los cuatro derivados se regeneran coherentes entre sí. Hecho a mano, dentro
 * de seis meses el favicon y la imagen social serían versiones distintas del
 * logo.
 *
 * Uso: npm run marca
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import puppeteer from 'puppeteer';

const RAIZ = process.cwd();
const SVG = join(RAIZ, 'src/assets/logo-simbolo.svg');
const ASSETS = join(RAIZ, 'src/assets');

const PAPEL = '#faf9f6';
const TINTA = '#1a1815';
const PIZARRA = '#5e594e';

const simbolo = await readFile(SVG, 'utf8');

const navegador = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

/** Renderiza un fragmento HTML a PNG con fondo transparente o sólido. */
async function aPng(html, ancho, alto, transparente) {
  const p = await navegador.newPage();
  await p.setViewport({ width: ancho, height: alto, deviceScaleFactor: 1 });
  await p.setContent(
    `<!doctype html><meta charset="utf-8">
     <style>
       html,body{margin:0;padding:0;width:${ancho}px;height:${alto}px;
         background:${transparente ? 'transparent' : PAPEL};
         font-family:system-ui,-apple-system,'Segoe UI',sans-serif;}
       *{box-sizing:border-box}
     </style>${html}`,
    { waitUntil: 'load' },
  );
  const buf = await p.screenshot({ omitBackground: !!transparente, type: 'png' });
  await p.close();
  return buf;
}

// ---------------------------------------------------------------- iconos
// El símbolo es 2:1, así que en un lienzo cuadrado se centra y se deja aire.
const iconoHtml = (lado) => `
  <div style="width:${lado}px;height:${lado}px;display:grid;place-items:center;padding:${Math.round(lado * 0.08)}px">
    <div style="width:100%">${simbolo}</div>
  </div>`;

const png32 = await aPng(iconoHtml(32), 32, 32, true);
const png180 = await aPng(iconoHtml(180), 180, 180, true);
await writeFile(join(ASSETS, 'favicon-32.png'), png32);
await writeFile(join(ASSETS, 'favicon-180.png'), png180);

// ------------------------------------------------------------------ ICO
// Un .ico admite carga PNG desde Windows Vista, así que el contenedor es
// una cabecera de 6 bytes más una entrada de 16 y el PNG tal cual.
function empaquetarIco(png, lado) {
  const cab = Buffer.alloc(6);
  cab.writeUInt16LE(0, 0); // reservado
  cab.writeUInt16LE(1, 2); // tipo: icono
  cab.writeUInt16LE(1, 4); // número de imágenes
  const ent = Buffer.alloc(16);
  ent.writeUInt8(lado === 256 ? 0 : lado, 0); // ancho (0 = 256)
  ent.writeUInt8(lado === 256 ? 0 : lado, 1); // alto
  ent.writeUInt8(0, 2); // colores de paleta
  ent.writeUInt8(0, 3); // reservado
  ent.writeUInt16LE(1, 4); // planos
  ent.writeUInt16LE(32, 6); // bits por píxel
  ent.writeUInt32LE(png.length, 8);
  ent.writeUInt32LE(6 + 16, 12); // desplazamiento hasta los datos
  return Buffer.concat([cab, ent, png]);
}
await writeFile(join(RAIZ, 'src/favicon.ico'), empaquetarIco(png32, 32));

// ------------------------------------------------------- imagen OpenGraph
// 1200x630 es la proporción que recortan LinkedIn, Slack y WhatsApp. El texto
// va grande porque en la vista previa se muestra a un tercio de su tamaño.
const og = await aPng(
  `<div style="width:1200px;height:630px;display:flex;flex-direction:column;
       justify-content:center;gap:36px;padding:0 96px;background:${PAPEL}">
     <div style="width:300px">${simbolo}</div>
     <div>
       <div style="font-size:68px;font-weight:700;color:${TINTA};letter-spacing:-0.01em">
         Datalent Solutions
       </div>
       <div style="font-size:34px;color:${PIZARRA};margin-top:14px;max-width:900px;line-height:1.35">
         Agentic AI para RR.&nbsp;HH., diseñada y gobernada en Europa
       </div>
     </div>
   </div>`,
  1200,
  630,
  false,
);
await writeFile(join(ASSETS, 'og-image.png'), og);

await navegador.close();

const kb = (b) => `${(b.length / 1024).toFixed(1)} kB`;
console.log(`  src/favicon.ico          ${kb(empaquetarIco(png32, 32))}`);
console.log(`  assets/favicon-32.png    ${kb(png32)}`);
console.log(`  assets/favicon-180.png   ${kb(png180)}`);
console.log(`  assets/og-image.png      ${kb(og)}`);
console.log('\nActivos de marca regenerados desde src/assets/logo-simbolo.svg');
