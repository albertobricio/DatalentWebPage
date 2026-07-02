# Release Notes — Website v2, Sprint 5 (Workforce Intelligence)

**Tag:** `v2-sprint-05`
**Scope:** new page at `/servicios/workforce-intelligence`, plus reciprocal-link updates across nav, footer, Home, AI Governance, and Compensation & Total Rewards.

## A note on sequencing

`site-map.md` marks Workforce Intelligence as Wave 2 — this page did not have an entry in `page-specs.md`'s Wave 1 spec set. This sprint explicitly brought it forward into implementation now, by direct instruction. Content, structure, and copy standards follow the same bar as the three Wave 1 service pages (Agentic AI, AI Governance, Compensation & Total Rewards) built in Sprints 3–4; no Wave 1 page spec was reopened or changed.

## What shipped

Nine sections, built entirely from existing shared components (Hero, Timeline, Card, Badge, Cta, FaqAccordion, Section — no new visual patterns):

- **Hero** — states the core message directly in the H1: "planificación estratégica de plantilla, no un dashboard más." Dual CTA (briefing primary, diagnóstico secondary), breadcrumb.
- **Qué es Workforce Intelligence** — forward-looking + external labor-market signal, scenario planning (never a single forecast), skills as the real planning unit, horizon-appropriate methods — explicitly distinguished from People Analytics' backward-looking territory.
- **Diferencia respecto a Workforce Planning tradicional** — four concrete contrasts: single-figure forecast → scenario, job/headcount → skills/capability (Skills-Based Organization), annual HR exercise → business planning cycle, internal-only data → cited external labor-market signal (Eurostat/INE, never general impression).
- **Framework Build · Buy · Borrow · Bot · Bridge** — all five levers explained with a real decision criterion each, including the Bot lever's explicit governance coordination requirement and a cross-link to the Agentic AI page.
- **Escenarios de uso** — six cards covering every use case named in the brief (planificación de plantilla, sucesión/talento crítico, análisis de skills, reorganizaciones, escenarios económicos/capacidad, decisión Build-Buy-Borrow-Bot), each with a mechanism-based description, no marketing filler.
- **Metodología Datalent** — a `Timeline` matching `service-catalog.md` §6's Entry → Design & Deployment → Retained structure, plus a KPI glossary (Critical Role Coverage, Internal Mobility, Skills Gap, Time to Productivity, Workforce Cost, Future Readiness) — each defined as a tracking concept, zero invented reference figures, explicitly tied to ISO 30414's human capital reporting framework.
- **FAQ** — four questions, including a direct "¿Esto es un dashboard de RR. HH.?" (No — that's People Analytics) and an EU AI Act governance answer for AI-assisted forecasting systems.
- **CTA final** — both CTA variants side by side.

JSON-LD `Service` schema, full meta set (title, description, keywords, robots), complete OpenGraph (`og:type`/`og:title`/`og:description`/`og:url`), and a dynamically-managed canonical `<link>`.

## A bug caught before it shipped

The canonical-link requirement needed a dynamic `<link rel="canonical">` update on page entry — but that link is a single, shared, non-view-encapsulated element (originally set once, statically, in `index.html`). No other page in the app manages it dynamically. Setting it on entry without resetting it on exit would have left every other route pointing at this page's URL after the user navigated away, since nothing else would ever correct it. Fixed by restoring the canonical to the site root in `ngOnDestroy()` — verified by navigating away and confirming the canonical reverted correctly.

## Reciprocal links (no more "Próximamente")

- `nav-items.ts` and `footer.component.ts` — both updated (footer keeps its own separate practices list from `nav-items.ts`, as found in Sprint 4).
- Home's service grid — the Workforce Intelligence card is now a real `FeatureCard` link.
- AI Governance's "Sigue explorando" — extended from a 2-card to a 3-card grid, adding Workforce Intelligence framed around AI-assisted scenario-forecasting governance (a genuine, evidence-grounded connection, not a forced link).
- Compensation & Total Rewards' "Sigue explorando" — extended from 1 card to 2, adding Workforce Intelligence framed around the Workforce Cost KPI's direct tie to budget planning.
- Agentic AI's page was deliberately left untouched beyond the sitewide nav/footer fix — it has no existing "related content" section, and adding one would have been a structural change beyond "only the links necessary to publish Workforce Intelligence." It still gets the reciprocal link via nav, footer, and Home.

## Five-persona audit

Gartner HR Analyst, McKinsey Partner, Fortune 500 CHRO, Apple HIG, IDEO Design Director — reviewed the built page against each lens. No section required a rewrite: the Build-Buy-Borrow-Bot-Bridge explanation ties a real decision criterion to every lever, all six scenario cards are distinct and evidence-based, the AI-governance FAQ answer pre-empts the exact question a sophisticated CHRO would ask, heading hierarchy and native accordion semantics are clean, and section-background rhythm matches every other page.

## Verified

- Production build: clean, no warnings (after removing an initially-unused `FeatureCardComponent` import — this page's own "Escenarios de uso" cards use plain `Card`/`Badge`, matching how Agentic AI's and Compensation's own use-case grids work; `FeatureCardComponent` is used on the two pages updated for reciprocal linking instead).
- `tsc --noEmit`: clean.
- Rendered in-browser at desktop (1280px), tablet (768px), and mobile (375px): hero, 3-column scenario grid, Timeline, KPI glossary, FAQ accordion — all correct at every breakpoint.
- Heading hierarchy: single `<h1>`, no skipped levels, verified via full DOM traversal.
- JSON-LD: two valid, non-conflicting `schema.org` objects (`Organization` + `Service`).
- Canonical link: correctly set on entry, correctly restored to site root on exit.
- All reciprocal links (nav, footer, Home, AI Governance, Compensation) resolve to `/servicios/workforce-intelligence`.
- Contrast: badge/text colors reuse already-verified tokens from prior sprints, no new colors introduced.
- No console errors.

## Out of scope / not touched

- `/servicios/people-analytics` (still doesn't exist) — no internal link added to it.
- Agentic AI page's own content (see Reciprocal Links note above).
- No Wave 1 page spec, positioning decision, or design-system rule was modified.
