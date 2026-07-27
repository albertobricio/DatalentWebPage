# Release Notes — Website v2, Sprint 7 (Functional QA, content truth, indexability)

**Tag:** `v2-sprint-07`
**Scope:** make the site actually work and actually reach crawlers. Three strands: functional defects, content that violated the non-fabrication policy, and the two documented pages that had never been built. Site is now complete at 12 routes with no placeholders.

---

## The finding that reframed the sprint

A strategy document supplied mid-sprint claimed the site's content was not indexable. **That was verifiable and correct.** The production build emitted a single `index.html` whose entire `<body>` was:

```html
<body><app-root></app-root><script …></script></body>
```

No server bundle, no prerendered routes. Every route served that shell.

Consequence: all the per-page `<title>`, description, canonical, OpenGraph, Twitter Card and JSON-LD added across Sprints 2–6 was runtime-injected and invisible to any crawler that doesn't execute JS. Google's second wave does — so the site wasn't invisible, just deferred and unreliable — **but LinkedIn, Slack, WhatsApp and Bing do not**, which means the OG and Twitter tags could never have produced a link preview. For a B2B consultancy whose main sharing surface is LinkedIn, that was the single most valuable thing on the page and it was inert.

### How prerendering was achieved

Angular's own SSR path was attempted first and **abandoned deliberately**: the project is on Angular 20, `@angular/ssr` needs the `application` builder, and the `use-application-builder` migration spun up a temporary CLI v22 that wrote `"@angular/build": "^22.0.8"` into a v20 project. Pinning it back to `^20` hit an unresolvable peer conflict (`@angular/localize` ↔ `@angular/compiler`) that only `--legacy-peer-deps` could paper over. Reverted; build returned to green.

Instead: a post-build headless-Chrome step (`prerender.mjs`, `npm run build:prod`) renders all 12 routes to static HTML. A real browser also executes the existing `isPlatformBrowser`-gated JSON-LD, so **no SSR-safety refactor of six components was needed**.

**Result:** every route now serves 286–1641 words of real HTML where it previously served zero.

**Known tradeoff:** no hydration. Angular re-renders on boot and replaces the prerendered DOM — invisible to crawlers, a negligible repaint for users. If that ever matters, the proper fix is the Angular 22 upgrade.

---

## The bug I shipped, and fixed

**Canonical pointing at the homepage.** In Sprints 5–6 I added canonical handling to only two pages. The other eight inherited `index.html`'s `<link rel="canonical" href="https://www.datalentsolutions.com">` — which tells Google that `/faq`, `/contacto`, `/newsletter` and three service pages are **duplicates of the homepage and should be dropped from the index.** That is worse than having no canonical at all.

It was largely inert while nothing was prerendered. Prerendering would have baked it into static HTML where crawlers definitely obey it — so shipping prerendering without fixing this would have actively damaged the site's indexing.

Fixed by a new `SeoService` that owns title / description / keywords / canonical / OG / Twitter / JSON-LD in one place. It also collapsed **six** copies of the JSON-LD injection code and **two** of the canonical code, and removed `OnDestroy` boilerplate from six components. All 12 routes now self-canonicalise (`/home` intentionally points at `/`, since they serve identical content and should consolidate rather than compete).

---

## Functional fixes

| Defect | Impact |
|---|---|
| `email.service.ts` imported `environment.prod` directly | Bypassed Angular's `fileReplacements` entirely — the only file in the repo doing this |
| Newsletter's "Suscribirme" was `<a (click)>` with CSS-only `pointer-events: none` disable | Keyboard users could bypass the disabled state; not a real button |
| `postbuild` copied `404.html` to `dist/DatalentWebPage/` | Build outputs to `dist/datalent-web-page/` — silently failing on every build |
| FAQ page had **no `<h1>`** at all | Surfaced by prerender failing to find a heading to wait on |
| Pillar block emitted `h1 → h3` | WCAG 1.3.1 level skip, live since Sprint 2, on Home and Por qué Datalent |
| Footer columns were `<h3>` | On Contacto and FAQ (no page-level `h2`) this produced another `h1 → h3` skip |
| Prerender script overwrote its own shell | First version compounded a duplicate copy of every injected `<style>` per run (15 → 28 → 41). Shell is now snapshotted in memory, with a guard refusing to run against an already-prerendered `dist` |

Verified working: contact form validation and accessible errors, newsletter form, mobile menu (`aria-expanded` + `inert` toggling correctly), cookie banner consent persistence.

---

## Content truth

**Newsletter** published three unsourced figures — "80% de los errores de selección", "70% de precisión… *(Harvard Business Review, 2025)*", "redujo su rotación un 32%" — and had never adopted the "El Radar Agéntico" name every other page already used for it. Rebuilt around the approved format in `docs/business-audit-v2.md` and `.claude/templates/newsletter-issue-template.md`, describing what a subscriber receives each issue rather than fabricating a first issue. **Zero figures published.**

**FAQ** still sold the pre-v2 offer ("Smart Recruitment", "Upskilling & Reskilling" — neither is one of the six practices), claimed LatAm + Europe operations against a European-first positioning, and published "reducción de rotación hasta un 35 %". Replaced with the ten questions the business audit itself identified, covering every objection six personas said went unanswered: autonomy and human oversight, data residency and legal basis, bias testing, pay equity, ATS/HRIS integration, and software-vs-service.

**Sitewide sweep confirms zero fabricated statistics remain in any prerendered page.**

### Firm-scale claims

The site implied a multi-person boutique with a bench of area specialists. Datalent is currently **one practitioner operating as autónoma, pre-incorporation**. That is the same class of problem as the fabricated statistics — asserting capability that doesn't exist — and especially costly for a firm whose product is regulatory trust.

- Pillar 3: *"Criterio senior, escala boutique / Cada cuenta liderada por un experto senior del área"* → *"Criterio senior, trato directo / Trabajas siempre con quien diseña y ejecuta. Sin equipos junior de por medio."*
- Contact: *"un especialista del área correspondiente te responde"* → *"recibes respuesta directa de quien llevaría el proyecto"*
- FAQ: removed *"nuestro equipo directivo te acompañará personalmente"*

Left deliberately unchanged: the *"Habla con quien va a diseñar…, no con un formulario"* CTAs, which are **more** true for a single practitioner. The editorial "we" also stays — the decision was to keep the existing structure and correct the claims, not convert to first-person singular.

---

## New pages

**`/servicios`** (page-specs.md §2) — the structural home of Pillar 4. Answers the HR Technology Analyst's disqualifying "software or service?" question explicitly, lists all five practice pages with `service-catalog.md`'s Entry Point language, and presents the two named bundles (*Compliant Launch*, *Evidence-Based Talent*) as sellable packages rather than six loose line items. `CollectionPage` JSON-LD.

**`/por-que-datalent`** — the last page `site-map.md` documented but never had, and the final "Próximamente" in nav and footer. No spec entry of its own, so built strictly from `positioning.md`: the four pillars (via the shared component, so they cannot drift from Home) plus "What Datalent Is Not". No named-competitor callouts — `competitive-differentiation.md` is an internal battlecard, and naming Workday or Mercer publicly would pick a comparison `positioning.md` explicitly says not to pick.

Nav note: "Servicios" carries `children`, and `HeaderComponent` checks `children` before `path` — so giving the parent a path would have rendered a dropdown that silently swallowed the link. The hub is exposed as "Ver todos los servicios", the first dropdown child, which needs no change to the dropdown's keyboard/aria behaviour.

---

## Verified

- Production build and `tsc --noEmit`: clean, no warnings.
- All **12** routes prerendered with real content, correct per-page canonical, and correct structured data (`Organization` + `Service`/`ContactPage`/`CollectionPage`).
- **Every internal link resolves** to a prerendered file — zero dead links.
- **Every route: exactly one `<h1>`, no heading-level skips.**
- Zero fabricated statistics and zero "Próximamente" anywhere in the built site.
- Client-side navigation verified: canonical and JSON-LD swap correctly per route with no leakage.

## Follow-ups for the developer

1. **Deployment output path** — unchanged this sprint (`dist/datalent-web-page/`), but deploys must now publish the whole tree, since each route is its own `index.html` directory. Hosting needs to serve `/servicios/people-analytics/index.html` for that path rather than falling back to the root SPA shell.
2. **`.angular/cache` is tracked in git** (288 files). It's build cache and should be gitignored.
3. **`positioning.md` Pillar 3 wording** now differs from the site copy, which was corrected for the solo-practitioner reality. The doc should be updated to match rather than leaving the site as the only accurate source.
4. **Angular 20 → 22** remains the path to real SSR/hydration if the no-hydration repaint ever becomes a concern.
