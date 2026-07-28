# Home Wireframe (`/`)

**Objective this document serves:** the section-by-section layout for Home, mobile-first per `design-system.md` Principle 4, built entirely from `component-library.md`'s components and satisfying every field in `page-specs.md`'s Home entry. Wireframe only — no visual design, no code, layout and content structure only.

**Reading the wireframes:** boxes represent layout regions, not final visual treatment. Annotations below each box name the component (`component-library.md`) and content source (which strategy document the copy must trace to).

## Mobile (base, 0–599px) — Primary Authoring Viewport

```
┌─────────────────────────────────────┐
│ [Logo]              [☰ MobileNav]    │  ← sticky header, color.paper, 1px color.border bottom
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Eyebrow: "Agentic AI para RR.HH."   │
│                                       │
│  H1 (type.display):                  │
│  "Diseñamos y gobernamos agentes     │
│   de IA para RR.HH., con criterio    │
│   humano en cada decisión."          │
│                                       │
│  Body-lg: one-line value statement   │
│  tying Pillar 1 + Pillar 4 together  │
│                                       │
│  [CtaButtonComponent: briefing]      │
│  [Button ghost: diagnostico]         │
└─────────────────────────────────────┘
   ↑ PageHeroComponent (Home variant — no breadcrumb, since this is the root)
     Content source: positioning.md's Positioning Statement + Tagline Candidates

┌─────────────────────────────────────┐
│  PillarProofBlockComponent           │
│  (stacked, 1 of 4 shown per screen)  │
│                                       │
│  ① Governed Autonomy                 │
│  "Cada agente opera con límites de   │
│   autonomía documentados y un        │
│   punto de control humano."          │
│  ─────────────────────────────       │
│  ② European by Design                │
│  "Datos alojados y gobernados bajo   │
│   marco europeo, RGPD y EU AI Act."  │
│  ─────────────────────────────       │
│  ③ Senior Judgment, Boutique Scale   │
│  "Cada cuenta liderada por un        │
│   experto senior del área."          │
│  ─────────────────────────────       │
│  ④ Integrated Talent Lifecycle       │
│  "Seis prácticas, un solo sistema."  │
└─────────────────────────────────────┘
   ↑ Content source: positioning.md's Four Positioning Pillars, verbatim mapping
     Non-negotiable: no percentage or statistic in any of the 4 statements (page-specs.md Required Evidence)

┌─────────────────────────────────────┐
│  H2: "Nuestras Prácticas"            │
│                                       │
│  [ServiceCardComponent]              │
│  Agentic AI para RR.HH.       →      │
│  [ServiceCardComponent]              │
│  People Analytics              →      │
│  [ServiceCardComponent]              │
│  Compensación & Total Rewards →      │
│  [ServiceCardComponent]              │
│  Gobernanza de IA              →      │
│  [ServiceCardComponent]              │
│  Workforce Intelligence*       →      │
│  (*inactive card — Wave 2, see       │
│   site-map.md; shown greyed/disabled │
│   with "Próximamente" label, never   │
│   a dead link)                       │
└─────────────────────────────────────┘
   ↑ ServiceCardComponent × 5, stacked full-width
     Content source: service-catalog.md Entry Point descriptions, verbatim

┌─────────────────────────────────────┐
│  H2: "Cómo Trabajamos"               │
│  Body: advisory-led, technology-     │
│  enabled framing — direct answer to  │
│  the "software or service?" question │
└─────────────────────────────────────┘
   ↑ Content source: business-model.md's Core Decision section

┌─────────────────────────────────────┐
│  TrustFooterStripComponent           │
│  (stacked on mobile)                 │
└─────────────────────────────────────┘
   ↑ Content source: positioning.md Pillars 1–2

┌─────────────────────────────────────┐
│  H2: "Empieza tu Diagnóstico"        │
│  [CtaButtonComponent: diagnostico]   │
│  [CtaButtonComponent: briefing]      │
└─────────────────────────────────────┘
   ↑ Closing CTA banner — both variants shown together here specifically,
     since Home is the one page where the visitor's tier isn't yet known
     (every other page defaults to one primary CTA per page-specs.md)

┌─────────────────────────────────────┐
│  Footer: 6 practice links (full      │
│  inventory, per site-map.md Footer   │
│  Nav spec) | Legal | Newsletter      │
│  signup | Social                     │
└─────────────────────────────────────┘
```

## Desktop (960px+) — Layout Changes Only

Content and order are identical to mobile (per `design-system.md`'s mobile-first principle — desktop is a layout adaptation, not a re-authoring):

- **Header:** MobileNav hamburger replaced by full horizontal nav (`site-map.md`'s Header Navigation tree, with the `Servicios ▾` and `Recursos ▾` dropdowns).
- **Hero:** two-column — headline/CTA block left (max-width constrained per `component-library.md`'s "never centered" rule), a restrained supporting visual right (an abstract geometric mark reflecting the "governed system" concept — explicitly not a stock AI cliché per `design-system.md`; exact treatment is a visual-design decision outside this wireframe's scope, this document only reserves the layout region).
- **Pillar block:** 4-column row instead of a stack, equal width, per `component-library.md`'s `PillarProofBlockComponent` desktop spec.
- **Service cards:** 3-column grid (5 cards → a 3+2 layout, second row left-aligned not centered, consistent with the non-centered principle).
- **Trust strip:** inline horizontal row instead of stacked.
- **Closing CTA banner:** two buttons shown side by side, not stacked.

## Section-by-Section Traceability

| Section | Component(s) | Content source | page-specs.md field satisfied |
|---|---|---|---|
| Header | `MobileNav` / full nav | `site-map.md` Header Navigation | Internal links |
| Hero | `PageHeroComponent` (Home variant) | `positioning.md` | Purpose, primary CTA |
| Pillar proof | `PillarProofBlockComponent` | `positioning.md` | Required evidence (no stats) |
| Service grid | `ServiceCardComponent` × 5 | `service-catalog.md` | Internal links, business goal (routing) |
| How we work | — (plain content block) | `business-model.md` | Business goal (disambiguation) |
| Trust strip | `TrustFooterStripComponent` | `positioning.md` Pillars 1–2 | Required evidence |
| Closing CTA | `CtaButtonComponent` × 2 | `page-specs.md` | Primary CTA |
| Footer | — (plain content block) | `site-map.md` Footer Navigation | Internal links, supporting CTAs (newsletter) |

## Explicit Omissions (and Why)

- **No case study / testimonial section.** `roadmap.md` Phase 1 has not yet produced real evidence; per `page-specs.md`'s standing rule, this section is not built empty-but-present (which would invite a placeholder that reads as real) — it's simply absent from Wave 1's Home wireframe and added only once real content exists.
- **No client logo strip.** Same reasoning — no client roster currently exists to honestly display.
- **No numeric stat anywhere on this page** — directly enforced at the wireframe level, not left to a later content pass to catch.
