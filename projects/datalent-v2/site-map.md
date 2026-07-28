# Site Map — Datalent Solutions v2

**Objective this document serves:** the information architecture that carries `positioning.md`'s four pillars, `ideal-client-profiles.md`'s three tiers, and `service-catalog.md`'s six practices into an actual page structure — the bridge between business strategy and the Angular build (`sprint-01.md`).

**Scope note:** this document plans the *information architecture only*. No Angular code, routing module, or component is touched here — that starts once `sprint-01.md` is executed in a future session.

## How the Positioning Spine Maps Onto the Site

Requirement 1 asks the site map to "reflect" the four pillars. A pillar isn't a nav tab — it's a claim that needs a structural home and reinforcement elsewhere. This table is the traceability record:

| Pillar | Primary IA home | Reinforced on |
|---|---|---|
| **Governed Autonomy** | AI Governance service page (`/servicios/gobernanza-ia`) | Agentic AI for HR page, Home's proof grid, FAQ's "Confianza, Datos e IA Agéntica" block |
| **European by Design** | AI Governance service page (shared home with Pillar 1 — they're structurally paired per `positioning.md`) | Every service page's trust footer, Home's proof grid, footer legal links |
| **Senior Judgment, Boutique Scale** | Why Datalent page *(Wave 2)* | Home's proof grid, every service page's "who leads this" note, Contact page's response-time promise |
| **Integrated Full Talent Lifecycle** | Services hub (`/servicios`) | Home's service teaser grid, cross-links between every service page |

No page is built to "cover" a pillar alone — each pillar has one deep home and at least two reinforcement points, consistent with `.claude/knowledge/marketing.md`'s positioning-consistency guidance (repetition across touchpoints, not a single statement page).

## Full Site Tree, by Release Wave

```
/ (Home)                                                              [Wave 1]
├── /servicios (Services hub)                                        [Wave 1]
│   ├── /servicios/agentic-ai-rrhh (Agentic AI for HR)                [Wave 1]
│   ├── /servicios/people-analytics (People Analytics)                [Wave 1]
│   ├── /servicios/compensacion-total-rewards (Comp & Total Rewards)  [Wave 1]
│   ├── /servicios/gobernanza-ia (AI Governance)                      [Wave 1]
│   └── /servicios/workforce-intelligence (Workforce Intelligence)    [Wave 2]
├── /contacto (Contact / Book a call)                                 [Wave 1]
├── /faq (FAQ — restructured, existing route kept for SEO continuity) [Wave 1.5]
├── /newsletter (El Radar Agéntico — content rewrite, route kept)     [Wave 1.5]
├── /por-que-datalent (Why Datalent)                                  [Wave 2]
├── /casos-de-exito (Case Studies hub + individual case pages)        [Wave 2 — content-gated, see below]
├── /confianza (Trust & Governance Center)                            [Wave 2/3]
└── (ICP-specific / localized landing pages)                          [Wave 3]
```

**Wave 1** = this document's scope and `sprint-01.md`'s build target: the seven pages named in the requirement. **Wave 1.5** = immediate next sprint, not part of `sprint-01.md`, content-only changes to two already-existing routes (no new IA). **Wave 2/3** = sequenced against `roadmap.md`'s Phase 1/2 milestones — most importantly, `/casos-de-exito` cannot launch with real content until `roadmap.md` Phase 1 produces an actual case study; building the route with placeholder/fabricated outcomes would violate `.claude/memory/non-fabrication-policy.md` and undo the exact credibility fix this whole IA exists to deliver. It appears here for completeness, not for Sprint 01 construction.

## Navigation Structure

### Header Navigation (primary)
```
Inicio | Servicios ▾ | Por qué Datalent* | Recursos ▾ | Contacto
                │                              │
                ├─ Agentic AI para RR.HH.      ├─ Insights (Radar Agéntico)
                ├─ People Analytics            └─ FAQ
                ├─ Compensación & Total Rewards
                ├─ Gobernanza de IA
                └─ Workforce Intelligence*
```
`*` = Wave 2, present in nav design now (so the information architecture doesn't need re-work later) but the link is inactive/hidden until its page exists — never a dead link, per `docs/website-audit.md`'s own standard against unfinished-looking affordances (the "chatbot button that does nothing" finding applies equally to nav links pointing nowhere).

### Footer Navigation
Mirrors `service-catalog.md`'s six practices exactly (not a curated subset) — the footer is where a full, honest inventory of the offer belongs, consistent with `positioning.md` Pillar 4's "integrated, not six disconnected point solutions" claim: seeing all six listed together, footer-wide, is itself part of making that claim visible.

### Primary CTA Placement
Two CTAs persist site-wide in the header/sticky bar, carrying forward the tiered-CTA split already designed in `docs/business-audit-v2.md`'s Home rewrite:
- **"Solicitar Diagnóstico Gratuito"** (Tier 1 / SMB entry point) → routes to `/contacto?motivo=diagnostico`
- **"Reservar Briefing Ejecutivo"** (Tier 2/3 / enterprise entry point) → routes to `/contacto?motivo=briefing`

Both land on the same `/contacto` page (see `page-specs.md`), differentiated by a pre-filled interest field — this avoids building two separate contact pages while still preserving the qualification signal `docs/business-audit-v2.md` flagged as currently lost (every lead tagged "Consulta general" regardless of entry point).

## URL and Naming Conventions

- Spanish-first slugs, matching `.claude/memory/brand-voice.md`'s default-to-Spanish rule for market-facing content, with English category terms kept untranslated where the live site already sets that precedent (`People Analytics` appears in English in the current title tag) and where `positioning.md` deliberately keeps a term in English as the category name (`Agentic AI`).
- `/servicios/*` as the consistent parent path for all service pages — this is also what makes the Services hub → service page → Contact funnel traceable in analytics once `docs/website-audit.md`'s analytics fix ships, and what keeps `sitemap.xml` (also flagged as broken — hash-fragment "pages" with no real content) honest going forward: every sitemap entry under Wave 1 will be a real, unique-content route, not an anchor.

## What This Site Map Deliberately Does Not Include Yet

- **No pricing page.** `pricing-strategy.md`'s bands are explicitly marked `[VALIDATE]` against real engagements — publishing them before Phase 1 validation would lock in unvalidated numbers publicly. Pricing stays a conversation that happens after the diagnostic entry point, not a published page, until `roadmap.md`'s Phase 1 success metric (validated bands) is met.
- **No LatAm-localized content or claims**, consistent with `go-to-market.md`'s Phase 3 sequencing and `docs/business-analysis.md`'s original finding that the live site's LatAm claim (`areaServed: MX, CO, AR, CL`) is currently unsubstantiated.
- **No claimed case studies, client logos, or specific outcome statistics anywhere in Wave 1** — every Wave 1 page's `page-specs.md` entry states this explicitly under Required Evidence.

## Cross-Document Consistency Note

Every practice named in this site map is one of `.claude/CLAUDE.md`'s six; every tier this IA is designed to convert is one of `ideal-client-profiles.md`'s three; every CTA matches `business-model.md`'s revenue-stream entry points. No new service, tier, or claim is introduced at the IA layer that wasn't already established in the business strategy layer.
