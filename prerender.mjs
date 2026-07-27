/**
 * Post-build prerender step.
 *
 * Why this exists: the production build emits a single index.html whose
 * <body> is just `<app-root></app-root>` plus script tags. Google's second
 * indexing wave does execute JS, but LinkedIn, Slack, WhatsApp and Bing do
 * not — so every OpenGraph and Twitter Card tag on the site was inert for
 * link previews, and service-page indexing was deferred and unreliable.
 *
 * Why headless Chrome rather than @angular/ssr: the project is on Angular
 * 20 and Angular's SSR path needs 22 (see docs/release-notes-v2-sprint-07.md).
 * Rendering in a real browser also means the existing isPlatformBrowser-gated
 * JSON-LD / canonical / meta injection in the page components runs exactly as
 * written and gets captured — no SSR-safety refactor of six components needed.
 *
 * Known tradeoff: there is no hydration. Angular re-renders on boot and
 * replaces the prerendered DOM. That is invisible to crawlers (which read the
 * served HTML) and costs a negligible repaint for real users.
 */
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import puppeteer from 'puppeteer';

const DIST = 'dist/datalent-web-page';
const PORT = 4321;

// Must stay in sync with src/app/app-routing.module.ts. '/' is rendered
// separately because it redirects to /home and needs to overwrite the
// root index.html shell.
const ROUTES = [
  '/',
  '/home',
  '/newsletter',
  '/faq',
  '/contacto',
  '/servicios/gobernanza-ia',
  '/servicios/agentic-ai-rrhh',
  '/servicios/compensacion-total-rewards',
  '/servicios/workforce-intelligence',
  '/servicios/people-analytics',
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
};

// The pristine shell is read ONCE, up front, and every SPA fallback is served
// from this in-memory copy. Reading it from disk per request would be wrong:
// this script overwrites dist/index.html with the prerendered '/' output, so
// later routes in the same run would be served an already-rendered document,
// boot Angular on top of it, and accumulate a second copy of every injected
// <style>. That compounded on each run (observed: 15 -> 28 -> 41 style blocks
// for byte-identical content) until this was fixed.
const SHELL = await readFile(join(DIST, 'index.html'), 'utf8');

// Guard the other half of the same hazard: running this script twice without
// an intervening `ng build` would pick up a polluted shell as its baseline.
// Negative lookahead matters: a pristine shell is `<app-root></app-root>`, so
// a naive `>\s*\S` check matches the '<' of the closing tag and rejects it.
if (!/<app-root[^>]*>\s*<\/app-root>/.test(SHELL)) {
  console.error(
    'dist/index.html already contains prerendered markup.\n' +
      'Run `ng build --configuration production` first, then prerender.',
  );
  process.exit(1);
}

/** Static server with SPA fallback, so client-side routes resolve. */
function serve() {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      const url = decodeURIComponent(req.url.split('?')[0]);
      const filePath = join(DIST, url);
      const ext = extname(filePath);

      if (ext && existsSync(filePath)) {
        res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' });
        res.end(await readFile(filePath));
        return;
      }
      res.writeHead(200, { 'Content-Type': MIME['.html'] });
      res.end(SHELL);
    });
    server.listen(PORT, () => resolve(server));
  });
}

const server = await serve();
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
let failures = 0;

for (const route of ROUTES) {
  const page = await browser.newPage();
  try {
    await page.goto(`http://localhost:${PORT}${route}`, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Angular has rendered when app-root has children and a real <h1> exists.
    await page.waitForFunction(
      () => document.querySelector('app-root')?.children.length > 0 && !!document.querySelector('h1'),
      { timeout: 30000 },
    );

    // An <h1> is necessary but not sufficient: Angular injects each
    // component's encapsulated styles as <style> elements progressively, so
    // capturing as soon as the heading appears truncates them (observed: 15
    // style blocks on '/' vs 28 on '/home' for byte-identical content). A
    // fixed settle is deterministic where polling for a stable count was not,
    // and a couple of seconds per route is free in a build step.
    await new Promise((r) => setTimeout(r, 2500));

    const html = await page.content();
    const h1 = await page.$eval('h1', (el) => el.textContent.trim()).catch(() => '');
    const hasJsonLd = html.includes('application/ld+json');

    // Fail loudly rather than silently shipping an empty shell.
    if (!h1) throw new Error('rendered without an <h1>');

    const outPath =
      route === '/' ? join(DIST, 'index.html') : join(DIST, route, 'index.html');
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, html, 'utf8');

    const kb = (Buffer.byteLength(html) / 1024).toFixed(0);
    console.log(`  ✔ ${route.padEnd(42)} ${kb.padStart(4)} kB  ld+json:${hasJsonLd ? 'yes' : 'NO'}  h1:"${h1.slice(0, 40)}"`);
  } catch (err) {
    failures++;
    console.error(`  ✘ ${route.padEnd(42)} ${err.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();
server.close();

if (failures) {
  console.error(`\nPrerender failed for ${failures} route(s).`);
  process.exit(1);
}
console.log(`\nPrerendered ${ROUTES.length} routes into ${DIST}/`);
