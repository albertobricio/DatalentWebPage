# Architecture

> **INSTANTÁNEA DE LA v1, NO EL SITIO ACTUAL.** Documento de auditoría escrito
> antes de la reconstrucción v2. Se conserva porque explica de dónde venía el
> proyecto y por qué se tomaron varias decisiones, pero **nada de lo que
> describe sigue en pie**: no hay Tailwind por CDN, ni Leaflet, ni
> `MapComponent`, ni `main-topbar`, ni botón de chatbot sin integrar, ni
> `<style>` en línea dentro de `faq.component.html`, ni el script de Lucide, y
> la ruta de despliegue ya no es `dist/DatalentWebPage`.
>
> Para la arquitectura vigente: `projects/datalent-v2/` (especificaciones),
> `docs/seguridad.md` (postura de seguridad) y las notas de versión de cada
> sprint en este mismo directorio.

## Stack

- **Framework:** Angular 20, hybrid standalone/NgModule bootstrap
- **Language:** TypeScript 5.8 (no `strict` mode enabled in `tsconfig.json`)
- **Styling:** Three parallel systems — Angular component SCSS, a Tailwind CDN build (`<script src="https://cdn.tailwindcss.com">` in `index.html`), and hand-rolled CSS custom properties in `src/styles.scss` and an inline `<style>` block inside `faq.component.html`
- **Maps:** Leaflet 1.9 (`MapComponent`), currently disabled
- **Email delivery:** EmailJS (`@emailjs/browser`), client-side, no backend
- **Hosting:** GitHub Pages (static hosting only), custom domain via `CNAME` (`datalentsolutions.com`)
- **CI/CD:** GitHub Actions (`.github/workflows/deploy.yml`) — builds on push to `main`, deploys `dist/DatalentWebPage` to the `gh-pages` branch via `peaceiris/actions-gh-pages`
- **Backend:** none. This is a fully static SPA with no server, no API, no database.

## Application structure

```
src/
  app/
    app.component.ts/html/scss       — shell: topbar, router-outlet, footer, cookie banner
    app-routing.module.ts            — 3 routes: home, newsletter, faq
    app.module.ts                    — DEAD CODE (see below)
    components/
      home/          — single-page marketing content (hero, value prop, services,
                        differentiators, contact form, testimonials)
      main-topbar/    — header + nav + mobile menu + chatbot placeholder button
      footer/         — footer nav + legal links
      newsletter/     — standalone newsletter opt-in page
      faq/            — standalone FAQ page (accordion via native <details>)
      map/            — Leaflet map component (currently unused/disabled)
    directives/
      reveal.directive.ts — IntersectionObserver scroll-reveal animation
    providers/
      email.service.ts    — thin wrapper around EmailJS `send()`
  environments/
    environment.ts / environment.prod.ts — EmailJS keys + contact email (identical in both files)
  index.html            — all SEO meta, CSP, JSON-LD, Tailwind CDN script, Lucide icons CDN script
  styles.scss           — global font import + a *second*, unused set of CSS variables
```

Routing is a flat, three-route SPA (`home`, `newsletter`, `faq`) using hash-free `PathLocationStrategy`. Because GitHub Pages has no server-side rewrite rules, deep links are made to work via a `404.html` that redirects to `index.html` (client-side routing hack) — see `postbuild` script in `package.json`.

## Bootstrap: mixed standalone / NgModule pattern

`src/main.ts` calls `bootstrapApplication(AppComponent, …)`, Angular 20's standalone bootstrap API. All feature components (`HomeComponent`, `FooterComponent`, `MainTopbarComponent`, `NewsletterComponent`, `MapComponent`) are declared `standalone: true`. This is the modern, correct pattern for Angular 20.

However, `src/app/app.module.ts` still exists, declares an `NgModule` that imports `HomeComponent`, `MapComponent`, `NewsletterComponent`, `FooterComponent`, `MainTopbarComponent`, and provides `PathLocationStrategy` — **but nothing in `main.ts` references `AppModule`.** It is dead code left over from an initial `ng new` scaffold that was never deleted after the app was converted to standalone bootstrap. It currently has no effect on the running application (the actual `PathLocationStrategy` the app uses comes only from `AppRoutingModule` + Angular's router defaults) and risks confusing future contributors into editing a module that isn't wired to anything.

## Dead / disabled code

- **`MapComponent` is fully wired but never rendered.** It's imported and commented out in `home.component.ts` (`imports: [...] //MapComponent`) and its usage is commented out in `home.component.html` (`<!--<app-map></app-map>-->`). Per commit `4a01993` ("disabled map due to failures of SEO/Cybersec"), it was pulled for a reason — but the Leaflet dependency (~150KB), its CSS (`node_modules/leaflet/dist/leaflet.css` in `angular.json` global styles), and the component code all still ship in the production bundle with zero benefit.
- **`app.module.ts`** — see above, entirely unreferenced.
- **`faqs` array in `faq.component.ts`** (lines 33–90) is dead data. The FAQ template (`faq.component.html`) hardcodes 9 `<details>` blocks directly in markup instead of iterating over this array, and the array's content (7 items) has already drifted out of sync with what's actually rendered (9 items, different wording). Anyone editing FAQ content is likely to edit the wrong place.
- **`window['gtag']` consent calls in `app.component.ts`** (`acceptCookies`/`rejectCookies`) reference a Google tag that is never loaded anywhere in `index.html`. There is no Google Analytics, GTM, or any analytics/tracking script in the codebase at all. The cookie-consent-to-analytics wiring is a no-op today.
- **`chatbot placeholder` in `main-topbar.component.html`** — a floating button with a comment `<!-- Aquí se integraría el chatbot real -->` and no actual chat integration.
- **Commented-out "Descargar Guía Gratuita" secondary CTA** in `home.component.html` (lead magnet button, never implemented).

## Configuration & environments

`environment.ts` (dev) and `environment.prod.ts` are byte-for-byte identical — same EmailJS service/template/public IDs, same contact email. There is no actual dev/prod split (e.g., no staging EmailJS template, no debug flags). This isn't a security issue (EmailJS public keys are meant to be client-exposed), but it means the environment-file pattern is currently ceremonial rather than functional.

## Styling architecture fragmentation

Three independent design-token systems coexist and disagree with each other:

1. `index.html` inline Tailwind config: `dark-base: #0a0a0a`, `accent-cyan: #00eaff`
2. `src/styles.scss` CSS variables: `--color-primary: #00d4ff`, `--color-dark: #1a1a1a`, light-theme palette (`#f5f6fa` background) that is never actually used since the site is dark-themed
3. Inline `<style>` block embedded directly inside `faq.component.html` (not in `faq.component.scss`, which is empty): `--color-accent: #19caff`, `--color-panel: #0b3c59`

Three near-identical but distinct cyan values (`#00d4ff`, `#00eaff`, `#19caff`) are in play depending on which page/component you're looking at. `home.component.scss` alone is 673 lines and duplicates class names/patterns (e.g. `.testimonials`) that overlap with global styles. There is no single source of truth for the design system.

## Security posture (as implemented)

- CSP is delivered via `<meta http-equiv="Content-Security-Policy">` in `index.html` — this is the *only* mechanism available since GitHub Pages cannot set custom HTTP response headers. `SECURITY.md` and `README.md` both recommend HSTS, `X-Frame-Options`, `X-Content-Type-Options`, and CSP as HTTP headers, but **none of these can actually be enforced on the current hosting platform** except CSP-via-meta-tag (and meta-tag CSP cannot set `frame-ancestors` effectively in all browsers, cannot set HSTS at all, and cannot set `X-Frame-Options` at all). This is a documentation/reality mismatch, not just a gap.
- The CSP itself allows `'unsafe-inline'` and `'unsafe-eval'` in `script-src`, which are required today only because Tailwind's CDN build (`cdn.tailwindcss.com`) needs runtime JIT compilation. This significantly weakens the CSP's XSS protection value — it's close to not having one.
- `EmailService.sendMail()` has a commented-out email-format validation line and only checks `message.length > 2000`. No CAPTCHA/honeypot on either the contact form or the newsletter form — both are open to automated spam submissions with only client-side `required`/`type=email` HTML5 validation as a deterrent.
- No secrets are actually exposed (EmailJS keys are designed to be public), so this is a low-severity gap, not a breach risk.

## Build & deploy

- `npm run build:prod` → Angular production build → `postbuild` copies `404.html` into the output for SPA-routing-on-static-host support.
- GitHub Actions workflow triggers only on push to `main`, no PR preview builds, no test step in CI (despite `ng test` being configured via Karma/Jasmine — `*.spec.ts` files exist, e.g. `faq.component.spec.ts`, but CI never runs them).
- No lazy-loading (`loadComponent`/`loadChildren`) is used in `app-routing.module.ts` — all three route components are eagerly bundled into the initial chunk. For a 3-route site this has limited real-world impact today, but it's worth noting as the site grows.
