# Release Notes — Website v2, Sprint 6 (People Analytics)

**Tag:** `v2-sprint-06`
**Scope:** new page at `/servicios/people-analytics` — the sixth and final Wave 1/2 practice page, completing the full six-practice buildout. Plus reciprocal-link updates and two dead-import cleanups surfaced by that completion.

## What shipped

New page per `page-specs.md` §4, built entirely from shared components (Hero, Timeline, Card, Badge, FaqAccordion, Cta, Breadcrumb — no new components). Nine sections:

- **Hero** — primary CTA is "Solicitar Diagnóstico Gratuito" (`diagnostico`), not the `briefing`-first pattern the other three service pages use — this is the one deliberate departure, per the page spec's own note that this practice's entry point is the most naturally Tier-1-accessible of the six.
- **Qué es People Analytics** — evidence-based HR framed as an explicit data → insight → decision → action chain; a dedicated distinction between HR Analytics (operational reporting on RR. HH.'s own processes) and People Analytics (workforce data as a strategic asset tied to business outcomes); correlation-vs-causation, data lineage, and interpretability/no-black-box-scoring all covered with the same rigor `.claude/knowledge/people-analytics.md` specifies.
- **Nivel de madurez analítica** — the full Descriptive → Diagnostic → Predictive → Prescriptive → Decision Intelligence ladder (Bersin/Deloitte model, extended with Gartner's Decision Intelligence framing), including the honest caveat that most organizations self-report a higher stage than they actually practice. Decision Intelligence is tied directly to GDPR Article 22 and the EU AI Act — not a separate compliance afterthought.
- **Metodología Datalent** — a `Timeline` mirroring `service-catalog.md` §2's Entry → Design & Deployment → Retained structure, plus an illustrative methodology-disclosure example (bracketed placeholders, explicitly marked as non-real) satisfying the page spec's Required Evidence rule that methodology transparency has to be demonstrated, not just asserted.
- **Casos de uso** — three cards: culture/engagement diagnostic, attrition analysis with raw-cohort methodology, and bias/equity audit of an existing process *or model* — the last one carrying the Visier-validation-layer positioning from `competitive-differentiation.md`'s battlecard ("compete on methodology transparency, not dashboard polish").
- **KPIs alineados con ISO 30414** — six indicators (model accuracy, data completeness, time-to-insight, adoption rate, decision-to-action conversion, disparate impact ratio), each defined as a tracking concept with zero reference figures.
- **FAQ** — four questions, including the HR Analytics vs. People Analytics distinction, the Visier-validation-layer question answered affirmatively, and predictive-model governance tied to GDPR Art. 22 / EU AI Act with a link to the AI Governance page.
- **CTA final** — both CTA variants, diagnóstico first.

Full SEO surface per this sprint's explicit ask: Title, description, keywords, a per-page canonical `<link>` (set on enter, restored to the site root on destroy — see Defect below), Open Graph (`type`/`title`/`description`/`url`), Twitter Card tags, and a `Service`-type JSON-LD block additive to the site-wide `Organization` block.

## A defect avoided before it shipped

Sprint 5 introduced dynamic canonical-link management for the Workforce Intelligence page but the *pattern* itself — mutating the single shared, non-view-encapsulated `<link rel="canonical">` on enter without restoring it on exit — would leak into every other route the user visits afterward, since no other page manages its own canonical. This sprint's People Analytics page reuses the same mutate-on-enter logic, so the existing `ngOnDestroy` restore-to-root fix (verified working via direct navigation test: canonical correctly reset to `https://www.datalentsolutions.com` after clicking "Inicio") was carried over identically rather than re-introducing the leak.

## Reciprocal links — the six-practice buildout completes

- `nav-items.ts` and `footer.component.ts`: People Analytics was the last unlinked entry in both — now real. **Every one of the six HR practices has a live page and a real link**, sitewide.
- Home's People Analytics card converted from `Card`+`Badge`+"Próximamente" to a real `FeatureCard` link. With this change, **Home's service grid has zero placeholder cards left** — all five cards (Agentic AI, People Analytics, Compensación & Total Rewards, Gobernanza de IA, Workforce Intelligence) are real links. `CardComponent` and `BadgeComponent` are consequently no longer used anywhere in `home.component.ts` and were removed as dead imports.
- AI Governance's "Sigue explorando" grid gained a fourth card (People Analytics — bias-audit governance), extending `card-grid--2` to `card-grid--3`.
- Workforce Intelligence's own "Qué es" section already named People Analytics in its differentiating sentence ("eso es People Analytics") — turned that existing mention into a real link rather than adding new copy.
- Confirmed via sitewide grep: the only remaining "Próximamente" anywhere on the site is "Por qué Datalent" (a genuinely different, still-unbuilt page) — zero stale placeholders remain for any of the six practices.

## Verified

- Production build: clean, no warnings (after removing the two now-dead Home imports). `tsc --noEmit`: clean.
- Rendered in-browser at mobile (375px), tablet (768px), and desktop (1280px): hero with diagnóstico-first dual CTA, 3-column "Casos de uso" grid, Timeline, illustrative methodology card, FAQ accordion (single marker, correct open-state contrast) — all correct at every breakpoint.
- Heading hierarchy: single `<h1>`, no skipped levels, verified via full h1/h2/h3 DOM dump.
- SEO tags validated via direct DOM inspection: title, description, keywords, canonical (page-specific, confirmed reset on navigation away), OG tags, Twitter Card tags, and exactly 2 non-conflicting JSON-LD blocks (`Organization` + `Service`).
- Every internal link on the page resolves to a real, registered route — no dead links.
- No console errors (one transient webpack-dev-server disconnect/reconnect during testing was a dev-server connectivity blip, not an application defect — confirmed by a clean server restart rendering the identical page correctly).

## Five-persona audit

Gartner HR Analyst, McKinsey Partner, Fortune 500 CHRO, Apple HIG, IDEO Design Director all reviewed the built page — no section required a rewrite. Every claim traces to `.claude/knowledge/people-analytics.md` or `.claude/knowledge/hr-strategy.md`'s actual frameworks (Bersin/Deloitte maturity model, the 4/5ths rule, GDPR Art. 22), so the audit served as verification rather than correction, consistent with how the Sprint 5 audit played out.

## Out of scope / not touched

- The "Evidence-Based Talent" bundle link on `/servicios` (page spec's supporting CTA) — skipped, since the `/servicios` hub still doesn't exist, consistent with how every prior sprint has handled this same gap.
