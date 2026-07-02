# Release Notes — Website v2, Sprint 2 (Home Page)

**Tag:** `v2-sprint-02`
**Scope:** full rebuild of Home (`/`, `/home`), plus two shared-component extensions it required.

## What shipped

- **New Home**, built section-by-section per `projects/datalent-v2/home-wireframe.md`: Hero (dual CTA + signal-mark visual) → four-pillar proof grid → five-card practice grid (one live, four honestly labeled "Próximamente") → "Cómo Trabajamos" → two-statement trust strip → closing dual-CTA banner. Copy sourced verbatim/paraphrased from `positioning.md`, `service-catalog.md`'s Entry Point language, and `business-model.md`'s Core Decision section — no invented claims, no statistics anywhere on the page (page-specs.md's Required Evidence rule).
- **New shared component:** `PillarProofBlockComponent` — renders the four canonical positioning pillars with no inputs, so the copy can't drift between future call sites.
- **Extended shared component:** `HeroComponent` gained two opt-in inputs (`secondaryCtaVariant`, `showSignalMark`), used only by Home; every other page using Hero is unaffected.
- **Relocated** `HomeComponent` from `src/app/components/home/` to `src/app/pages/home/`, matching the `pages/` convention established in Sprint 1. Old Home (Tailwind hero, emoji problem-cards, four-service grid, unattributed testimonials, broken `renderTrustIndexGoogleReviews()` call, stale meta keywords including "eurofirms, adecco") is fully removed.

## Defects fixed along the way

- **Duplicate/stale Organization JSON-LD.** `index.html` carried two separate `Organization` schema blocks, one still describing the pre-v2 positioning ("People Analytics, IA en RRHH y Recruitment Predictivo"). Collapsed to one block with current positioning language; Home no longer injects a redundant third copy.
- **Stale sitewide `<title>`/meta description/keywords/OG/Twitter tags** in `index.html` — updated to the current category framing ("Agentic AI para RR. HH., diseñada y gobernada en Europa").
- **WCAG AA contrast failure:** the "Próximamente" label (used on Home's inactive service cards and AI Governance's related-content cards) used `--color-mist` on paper, computing to ~2.2:1 — fixed to `--color-slate` (~5.9:1) in both places.
- **Broken canonical-tag pattern:** old Home called `Meta.updateTag({rel, href})`, which produces an invalid `<meta rel="canonical">` element (Angular's `Meta` service only ever creates `<meta>` tags). Removed; the real `<link rel="canonical">` already in `index.html` was always the one actually working.

## Verified

- Production build: clean, no warnings.
- `tsc --noEmit`: clean.
- Rendered in-browser at mobile (375px) and desktop (1280px): hero dual-CTA + signal mark, 4-column pillar grid, 3-column service grid (3+2, left-aligned second row), inline trust strip, side-by-side closing CTAs — all match the wireframe's desktop deltas.
- All CTA `href`s resolve correctly (`/contacto?motivo=diagnostico` / `?motivo=briefing`); the one live service card links to `/servicios/gobernanza-ia`, the four unbuilt ones show "Próximamente" with no `<a>` (no dead links).
- No console errors (the previously-recurring `renderTrustIndexGoogleReviews` `TypeError` is gone — that code no longer exists).
- Five-persona review (McKinsey Partner / Gartner HR Analyst / Workday Product Strategist / IDEO Design Director / Apple HIG Designer) against the built page: no section met the bar for a cut or rewrite — every "agente"/"agentic" mention ties to the autonomy-limit-plus-escalation mechanism, no unsourced stats, no generic filler headlines within the copy that wasn't already wireframe-mandated.

## Out of scope / not touched

- `/servicios` hub, and the four not-yet-built service pages (Agentic AI, People Analytics, Compensación & Total Rewards, Workforce Intelligence) — represented on Home only as honestly-labeled "Próximamente" cards, per `site-map.md`.
- No Lighthouse CLI run (not installed, and installing would require an on-the-fly network fetch of a Chrome binary in this environment) — performance/SEO/a11y were instead verified manually: no images on the page (hero visual is inline SVG, zero image weight), single `<h1>`, correct heading hierarchy (h1→h2→h3, no skipped levels), real anchor elements for every interactive control, and the contrast check above.
