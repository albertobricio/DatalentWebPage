# Release Notes — Website v2, Sprint 3 (Agentic AI for HR)

**Tag:** `v2-sprint-03`
**Scope:** new page at `/servicios/agentic-ai-rrhh`, plus reciprocal-link fixes across Home, AI Governance, and the global nav.

## What shipped

New page per `page-specs.md` §3, built entirely from shared components (Hero, Timeline, Card, Badge, Cta, Section) plus native `<details>/<summary>` for the FAQ. Nine sections:

- **Hero** — dual framing: the page a search for the category term should land on.
- **¿Qué es la IA agéntica?** — the agentic-vs-automation test from `.claude/memory/positioning-decisions.md`, stated in full and applied to one real example (candidate screening), contrasting the agentic version against assisted automation.
- **Por qué importa la gobernanza** — GDPR Article 22 as the legal backbone, plus the "independent governance layer, not a platform replacement" argument from `competitive-differentiation.md`'s Workday battlecard.
- **Human-in-the-loop** — HITL / HOTL / no-checkpoint definitions from `.claude/knowledge/agentic-ai.md`, stating Datalent's default Level 2–3 autonomy posture.
- **Implicaciones del Reglamento Europeo de IA** — Annex III Employment, Article 14 (human oversight), Article 27 (FRIA), Provider/Deployer determination — scoped to what it means for agent *design*, with a link out to the full compliance treatment on the AI Governance page.
- **Casos de uso empresariales típicos** — three cards, each pairing an autonomy claim with its escalation trigger in the same sentence (Reasoning Pattern 5).
- **Metodología de entrega** — a `Timeline` mirroring `service-catalog.md` §1's Entry → Design & Deployment → Retained structure, with the middle step's anatomy matching `agent-spec-template.md` exactly.
- **FAQ** — three questions, including the exact "¿Vuestra IA toma decisiones de forma autónoma...?" answer from `docs/business-audit-v2.md`'s Q6 rewrite, verbatim.
- **CTA** — "Reservar Briefing Ejecutivo" (primary CTA per spec) plus a link to the AI Governance page.

JSON-LD: a `Service` block (same shape as AI Governance's), additive to — not duplicating — the site-wide `Organization` block in `index.html`.

## Reciprocal-link fixes

Now that this page is real, three places that previously showed it as a "Próximamente" placeholder were updated to real links:

- `src/app/layout/nav-items.ts` — the single source of truth for header and footer nav; both now link to `/servicios/agentic-ai-rrhh`.
- Home's service grid — the Agentic AI card is now a `FeatureCardComponent` with a real link, matching how the Gobernanza de IA card already worked.
- AI Governance's "Sigue explorando" section — the Agentic AI card is now a real `FeatureCardComponent` link instead of a `Card` with a "Próximamente" span.

## Verified

- Production build: clean, no warnings.
- `tsc --noEmit`: clean.
- Rendered in-browser at mobile (375px) and desktop (1280px): hero, EU AI Act section, 3-column use-case grid (mobile stacks), Timeline, FAQ accordion — all present and correctly laid out.
- Heading hierarchy: single `<h1>`, no skipped levels (h1→h2→h3 throughout).
- Both JSON-LD blocks on the page parse as valid, non-conflicting schema.org objects (`Organization` + `Service`).
- All CTA links resolve correctly (`/contacto?motivo=briefing`, `/servicios/gobernanza-ia`).
- No console errors.

## Out of scope / not touched

- `/servicios` hub (still doesn't exist) — the "Compliant Launch bundle" internal link `page-specs.md` mentions was skipped rather than linking to a page that doesn't exist yet.
- The general `/faq` page's content (still pre-v2) — this page's own on-page FAQ carries the specific Q&A `page-specs.md` calls for; the "Ver todas las preguntas frecuentes" link points at the existing `/faq` route as-is.
