# Sprint 01 — Wave 1 Build Plan

**Objective this document serves:** the implementation plan for the seven pages specified in `page-specs.md`, structured for a future session to execute against Angular. **This document plans; it does not implement.** No `.claude/`, `/src`, or other website file is touched by producing this document, per this turn's explicit instruction.

**Scope boundary:** this is Sprint 01 only — the Wave 1 pages from `site-map.md`. Wave 1.5 (FAQ/newsletter content rewrites) and Wave 2+ (Why Datalent, Case Studies, Trust Center) are out of scope here and will need their own sprint plans once `roadmap.md`'s gating conditions (a real case study, for one) are met.

## Pre-Sprint Dependency: Design Token Consolidation

Before any Wave 1 component work starts: `docs/architecture.md` found three unreconciled color-token systems already live on the site (Tailwind config in `index.html`, CSS variables in `styles.scss`, and a fourth, separate inline `<style>` block in `faq.component.html`). Building six new pages on top of that fragmentation would add a fourth or fifth inconsistent source rather than fixing the problem. **This sprint assumes token consolidation happens first**, either as a true Sprint 00 or as Task 1 below — it is a blocking dependency, not a nice-to-have, because every new component in this sprint needs one settled set of design tokens to build against.

## Implementation Order

Ordered so that shared infrastructure exists before anything depends on it, and so `/contacto` — the page every other page's primary CTA points to — works end-to-end before the pages that link to it are considered done.

```
1. Design token consolidation (pre-sprint dependency, above)
2. Shared components (CtaButtonComponent, ServiceCardComponent, PageHeroComponent,
   TrustFooterStripComponent, PillarProofBlockComponent, real BreadcrumbComponent)
3. Routing module update (6 new routes, lazy-loaded; ?motivo= query param handling)
4. Contact page (/contacto) — built early since every other page's primary CTA
   depends on it existing and correctly capturing the motivo field
5. AI Governance page (/servicios/gobernanza-ia) — built early despite being
   listed last in the requirement, because it carries the highest reputational
   stakes (page-specs.md) and its EU AI Act vocabulary needs the longest lead
   time for content review
6. Agentic AI for HR page (/servicios/agentic-ai-rrhh) — structurally paired
   with AI Governance (site-map.md), built immediately after it so the
   bidirectional cross-links are correct from first publish, not retrofitted
7. People Analytics page (/servicios/people-analytics)
8. Compensation & Total Rewards page (/servicios/compensacion-total-rewards)
9. Services hub (/servicios) — built after the individual service pages so its
   card copy can be pulled from already-finalized page content, not drafted twice
10. Home (/) rewrite — built last among the pages, since its teaser grid and
    four-pillar proof block both depend on the service pages and Contact page
    already existing and being final
11. Navigation update (header dropdown, footer) — last, once every route it
    links to is real
12. sitemap.xml correction — remove the three hash-fragment entries flagged in
    docs/website-audit.md, add the six new real routes
13. Full acceptance pass across all seven pages (see Acceptance Criteria)
```

## Required Components

| Component | Type | Used by | Notes |
|---|---|---|---|
| `CtaButtonComponent` | Shared, standalone | All 7 pages | Two variants only — `diagnostico` and `briefing` — per `page-specs.md`'s Cross-Page Consistency Note; no page invents a third CTA label |
| `ServiceCardComponent` | Shared, standalone | Home teaser grid, Services hub | Single source of card copy per service, pulled from `service-catalog.md`'s Entry Point language |
| `PageHeroComponent` | Shared, standalone | All 6 non-Home pages | Consistent hero pattern (title, one-line value statement, primary CTA) |
| `PillarProofBlockComponent` | Shared, standalone | Home, reused on Services hub | Renders the four pillars from `positioning.md`, each as a falsifiable statement, never a percentage claim (per `page-specs.md`'s Required Evidence rule) |
| `TrustFooterStripComponent` | Shared, standalone | Agentic AI, AI Governance, Comp & Total Rewards, People Analytics pages | The "Reinforced on" mechanism from `site-map.md`'s pillar-mapping table, made concrete as one reusable strip |
| `BreadcrumbComponent` (real) | Shared, standalone | All 6 non-Home pages | Fixes the existing dead breadcrumb block `docs/website-audit.md` found (hidden, single static "Inicio" item regardless of route) — this sprint is the natural point to fix it, since six new real routes need real breadcrumbs anyway |
| `ServicesHubComponent` | Routed page | `/servicios` | New |
| `AgenticAiServiceComponent` | Routed page | `/servicios/agentic-ai-rrhh` | New |
| `PeopleAnalyticsServiceComponent` | Routed page | `/servicios/people-analytics` | New |
| `CompensationTotalRewardsServiceComponent` | Routed page | `/servicios/compensacion-total-rewards` | New |
| `AiGovernanceServiceComponent` | Routed page | `/servicios/gobernanza-ia` | New |
| `ContactComponent` | Routed page | `/contacto` | New — supersedes the current in-page `#contact` anchor form on Home, though the anchor can remain as a same-page shortcut if desired |
| `HomeComponent` | Routed page (existing) | `/` | Heavily edited, not new — teaser grid replaces the current four hardcoded solution cards |

All new routed components should be **lazy-loaded via `loadComponent`** in the routing module — `docs/architecture.md` flagged that no lazy-loading exists today; six new routes is the natural point to introduce it rather than perpetuate the eager-loading pattern into a larger route table.

## Content Blocks (per page, reusable pattern)

Every Wave 1 page composes from the same ordered block set, so content structure is predictable across pages even though the words differ:

1. **Hero** — page title, one-line value statement, primary CTA (`PageHeroComponent`).
2. **Problem/Approach** — what this practice solves and how, in `service-catalog.md`'s own Entry Point / Design & Deployment language.
3. **Methodology/Evidence block** — the page-specific Required Evidence content from `page-specs.md` (e.g., AI Governance's risk-tier-with-reasoning discipline, Comp & Total Rewards' raw-vs-adjusted gap explanation).
4. **Trust strip** — `TrustFooterStripComponent`, reinforcing the relevant positioning pillar(s).
5. **Cross-link block** — links to the 1–2 adjacent pages named in that page's `page-specs.md` Internal Links field.
6. **CTA banner** — closing call-to-action, repeating the page's Primary CTA.

Home and Services hub substitute Block 2–3 with the teaser grid / bundle presentation, per their own `page-specs.md` entries, but keep the same Hero/Trust/CTA framing blocks for visual and structural consistency.

## Acceptance Criteria

A page is not done at Sprint 01 close unless all of the following hold:

- **Matches its `page-specs.md` entry** — purpose, persona framing, business goal, primary/supporting CTAs, and internal links are all present exactly as specified, not approximately.
- **Zero unsourced statistics** — no bare percentage, client count, or outcome claim appears anywhere without either a real source or a `[VALIDATE]` marker; this is checked as an explicit review pass, not assumed from careful drafting alone.
- **SEO fields set correctly** — `Title` and `Meta` service calls (following the existing pattern already in `home.component.ts`) populate the page-specific keyword targets from `page-specs.md`, and each service page carries `Service`-type structured data (`schema.org`), directly closing `docs/website-audit.md`'s finding that the site has no `LocalBusiness`/service-level schema today.
- **No dead links** — every internal link resolves to a real, built Wave 1 page; every Wave 2+ nav item is hidden, not present-but-broken, per `site-map.md`'s explicit rule against that exact failure mode.
- **`?motivo=` routing works end-to-end** — a click on any page's CTA correctly pre-fills the Contact page's interest field and that field is captured in the EmailJS payload distinctly (touching `email.service.ts`'s payload shape), closing `docs/business-audit-v2.md`'s "every lead tagged Consulta general" finding.
- **`sitemap.xml` reflects reality** — the three hash-fragment entries are removed, the six new routes are present with correct `lastmod`/`priority`.
- **Mobile responsive** at standard breakpoints, consistent with the rest of the existing site.
- **AI Governance page passes a dedicated content review** beyond the standard non-fabrication check — its EU AI Act vocabulary is checked against `.claude/knowledge/eu-ai-act.md` specifically, given the elevated reputational stakes `page-specs.md` names for this page.

## Dependencies

- **Blocking:** design token consolidation (Pre-Sprint Dependency, above).
- **Blocking:** analytics installation (`docs/improvement-roadmap.md` Tier 0) — shipping six new pages and two new CTA variants without working analytics means Sprint 01 launches unmeasurable, repeating the exact gap `go-to-market.md`'s Metrics section depends on being closed.
- **Blocking:** finalized page copy for all seven pages, reviewed against `.claude/memory/non-fabrication-policy.md` and `.claude/memory/brand-voice.md` before component build treats it as final — in framework terms, this is `client-content-writer` drafting per `page-specs.md`'s fields, with `competitive-positioning-analyst` review before sign-off, and `ai-governance-auditor` review specifically for the AI Governance and Agentic AI pages' governance claims. **Note:** the component-building and routing work itself falls outside any `.claude/agents/` scope — none of the six practice agents cover front-end engineering, and this document doesn't invent one; that work needs a developer, with this document as its brief.
- **Non-blocking, fast-follow:** real calendar-booking tool integration for the Contact page (`page-specs.md`'s honesty note on the "Reservar Briefing Ejecutivo" CTA) — Sprint 01 ships with the qualified-contact-form version.
- **Non-blocking, fast-follow:** Workforce Intelligence service page and the header nav's inactive Wave 2 links — explicitly out of Sprint 01 scope per `site-map.md`.

## What "Done" Means for Sprint 01

All seven pages live, passing every Acceptance Criterion above, `sitemap.xml` corrected, navigation fully wired with no dead or placeholder links, and the `?motivo=` qualification signal flowing end-to-end into the EmailJS payload. This is the concrete, checkable definition of Sprint 01 complete — matching `roadmap.md`'s Phase 0/Phase 1 framing that this build is prerequisite infrastructure for the GTM motion described in `go-to-market.md`, not the GTM motion itself.
