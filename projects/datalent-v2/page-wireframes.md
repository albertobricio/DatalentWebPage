# Page Wireframes — Remaining Wave 1 Pages

**Objective this document serves:** wireframes for the six Wave 1 pages other than Home (already covered in `home-wireframe.md`). The four practice pages share one structural template (per `sprint-01.md`'s Content Blocks pattern) shown once, with a per-page content substitution table — Services hub and Contact each get their own wireframe, since their structures genuinely differ. Wireframe only, mobile-first, no code.

## Part A — Shared Template: Practice Service Page

Applies to: Agentic AI for HR, People Analytics, Compensation & Total Rewards, AI Governance (`/servicios/agentic-ai-rrhh`, `/servicios/people-analytics`, `/servicios/compensacion-total-rewards`, `/servicios/gobernanza-ia`).

### Mobile (base)

```
┌─────────────────────────────────────┐
│ [Logo]              [☰ MobileNav]    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ BreadcrumbComponent                  │
│ Inicio / Servicios / [Página actual] │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ PageHeroComponent                    │
│ Eyebrow: practice name               │
│ H1: page-specific value headline     │
│ Body-lg: one-line value statement    │
│ [CtaButtonComponent: page's Primary  │
│  CTA per page-specs.md]              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ H2: "Qué Hacemos" (Problem/Approach) │
│ Body: Entry Point → Design &         │
│ Deployment → Retained, in            │
│ service-catalog.md's own language    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ H2: Methodology/Evidence block       │
│ (page-specific — see substitution    │
│  table below)                        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ TrustFooterStripComponent            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ H3: "Sigue explorando"               │
│ Cross-link card(s) → 1–2 adjacent    │
│ pages, per page-specs.md Internal    │
│ Links field                          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ CTA banner — repeats page's Primary  │
│ CTA (single variant, not both —      │
│ unlike Home, this page's visitor     │
│ tier is already known from context)  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Footer (identical to Home's)         │
└─────────────────────────────────────┘
```

### Desktop (960px+) — Layout Changes Only

- Hero: two-column, matching Home's pattern (headline/CTA left, supporting visual right) for cross-page visual consistency, per `design-system.md` Pillar 4's "one system" principle.
- "Qué Hacemos" and Methodology/Evidence blocks: single wide column, max-width constrained (not full-bleed), since this is dense explanatory content best read at a controlled line-length — not laid out in a grid.
- Cross-link cards: side-by-side (2-column) rather than stacked.

### Per-Page Content Substitution Table

| Page | Hero headline (source: `page-specs.md`) | Methodology/Evidence block content | Cross-links |
|---|---|---|---|
| **Agentic AI for HR** | States the agentic-vs-automation distinction in one line | The full agentic-vs-automation test (`.claude/memory/positioning-decisions.md`), applied to one worked example; every capability statement paired with its governance-companion-sentence | → AI Governance (bidirectional), → Compliant Launch bundle on Services hub |
| **People Analytics** | States the methodology-transparency promise | An illustrative (clearly labeled, not real-data) example of a methodology disclosure; bias-testing statement with governance-companion-sentence | → Compensation & Total Rewards, → AI Governance |
| **Compensation & Total Rewards** | States the EU Pay Transparency Directive urgency | The raw-vs-adjusted pay gap distinction explained plainly; no specific gap percentage anywhere on the page | → People Analytics, → AI Governance (conditional) |
| **AI Governance** | States the independent-governance promise | EU AI Act risk-tier vocabulary used correctly per `.claude/knowledge/eu-ai-act.md`; explicit statement of what "risk tier with reasoning" looks like | → Agentic AI for HR (bidirectional), → FAQ trust block |

## Part B — Services Hub (`/servicios`)

### Mobile (base)

```
┌─────────────────────────────────────┐
│ [Logo]              [☰ MobileNav]    │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ BreadcrumbComponent: Inicio/Servicios │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ PageHeroComponent                    │
│ H1: "Seis Prácticas, un Sistema      │
│      Integrado"                      │
│ Body-lg: advisory-led/tech-enabled   │
│ framing (business-model.md)          │
│ [CtaButtonComponent: briefing]       │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ ServiceCardComponent × 6             │
│ (stacked; Workforce Intelligence     │
│  card shown as "Próximamente" per    │
│  site-map.md, never a dead link)     │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ H2: "Paquetes Integrados"            │
│                                       │
│ Card: "Compliant Launch"             │
│ (Agentic AI + AI Governance)         │
│ ──────────────────────────           │
│ Card: "Evidence-Based Talent"        │
│ (People Analytics + Comp & Total     │
│  Rewards)                            │
└─────────────────────────────────────┘
   ↑ Content source: service-catalog.md's Cross-Practice Bundles section
┌─────────────────────────────────────┐
│ CTA banner: briefing                 │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Footer                               │
└─────────────────────────────────────┘
```

### Desktop
- Service cards: 3-column grid (matching Home's treatment, for the exact same "one system" consistency reason).
- Bundle cards: 2-column, side by side.

## Part C — Contact / Book a Call (`/contacto`)

This page's structure differs most from the others because its job is conversion, not persuasion (`page-specs.md`'s Expected Conversion Role) — it is deliberately shorter and more form-forward than any other Wave 1 page.

### Mobile (base)

```
┌─────────────────────────────────────┐
│ [Logo]              [☰ MobileNav]    │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ H1: "Hablemos de tu Reto"            │
│ Body: honest response-time promise   │
│ (no calendar-booking claim unless    │
│  real — page-specs.md's honesty      │
│  requirement on this exact CTA)      │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Pre-filled context banner:           │
│ "Solicitud: [Diagnóstico Gratuito /  │
│  Briefing Ejecutivo]" — populated    │
│ from the ?motivo= query parameter,   │
│ editable if the visitor arrived      │
│ without one                          │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Form (Form Input × fields):          │
│  Nombre* · Email corporativo*        │
│  Empresa · Servicio de interés       │
│  (dropdown, defaults from motivo)    │
│  Mensaje*                            │
│  [ ] Acepto política de privacidad*  │
│  [Button primary: "Enviar Solicitud"]│
│ FormStatusMessage (role="alert")     │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Alternative: direct email fallback   │
│ + newsletter signup as lower-        │
│ commitment option                    │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Footer                               │
└─────────────────────────────────────┘
```

### Desktop
- Two-column: context/response-time promise left, form right — the only Wave 1 page using this particular split, since it's optimized for form completion, not narrative reading.

## Cross-Document Consistency Note

Every component referenced across both wireframe documents (`home-wireframe.md` and this one) is specified in `component-library.md` — no new component is introduced at the wireframe layer. Every content block's source document is named inline so a future content-drafting pass (`.claude/agents/client-content-writer.md`, per `sprint-01.md`'s Dependencies section) knows exactly which strategy document to pull from for each section, rather than improvising copy.
