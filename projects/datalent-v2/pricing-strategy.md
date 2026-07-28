# Pricing Strategy — Datalent Solutions

**Objective this document serves:** a pricing structure consistent with `ideal-client-profiles.md`'s three tiers, `service-catalog.md`'s Entry Point / Design & Deployment / Retained shape, and `business-model.md`'s cost structure (senior expert time is the dominant cost).

**A note on the figures below:** every price band in this document is a **recommended starting point for the firm's first engagements, not a market-validated figure.** Per `.claude/memory/non-fabrication-policy.md`'s discipline applied to internal planning: presenting a made-up "market rate" as if it were researched would be exactly the kind of unsourced claim this entire system exists to prevent. These bands are derived from a stated methodology (day-rate logic, scope-based estimation) so they can be reasoned about and adjusted — they are not a claim that this is what the market has already proven it will pay.

## Pricing Philosophy

**Value-based, scope-anchored, not cost-plus.** Per `.claude/knowledge/compensation-total-rewards.md`'s own framework references, pricing should reflect the value and risk at stake for the client (a governance engagement protecting against EU AI Act non-compliance carries different stakes than a culture survey), not simply hours worked. Two structural principles:

1. **Diagnostics are priced to be a low-friction entry point**, not a profit center — their job is proving value fast enough to convert into Design & Deployment work.
2. **Governance and compliance work commands a premium** relative to comparable-effort analytics work, because the client's downside risk (regulatory exposure, reputational damage) is structurally higher — this is the same "value tracks risk, not just hours" logic `.claude/knowledge/compensation-total-rewards.md` applies to comp design, applied here to Datalent's own pricing.

## Pricing Structure by Engagement Type

### Entry Point — Diagnostics (fixed fee)
Scoped to a defined number of senior-practitioner days, sold as a fixed fee so the client has no ambiguity about cost before committing. Recommended starting bands, by ICP tier:

| ICP Tier | Recommended fixed-fee band | Basis |
|---|---|---|
| Tier 1 — Scaling PYME | €4,000 – €9,000 | 3–6 senior-practitioner days at a blended day-rate reflecting boutique/senior-only delivery (not junior-analyst rates) |
| Tier 2 — Multi-Country Mid-Market | €9,000 – €18,000 | 6–12 days, reflecting multi-country scope and the higher-stakes nature of a governance/compliance-triggered engagement |
| Tier 3 — Enterprise Pilot | €15,000 – €30,000 | 10–18 days, reflecting the buying-committee complexity and reputational stakes of an independent enterprise governance audit |

`[VALIDATE against the first 3–5 actual engagements per tier before treating these bands as reliable — see roadmap.md's Phase 1 pricing-validation milestone.]`

### Design & Deployment (project fee)
Scoped per engagement based on the specific deliverable (an agent spec and deployment, a full compensation structure, a workforce scenario model) — not a fixed band across all six practices, since scope varies too widely. Recommended approach: **scope in days at the same blended day-rate logic as the diagnostic tier**, quoted as a fixed project fee once scope is agreed, never open-ended time-and-materials — matching `.claude/knowledge/consulting-methodologies.md`'s own guidance that deliverable-based pricing suits a defined-scope engagement better than time-and-materials, and directly avoiding the scope-creep anti-pattern that framework flags.

### Retained — Governed Agent Retainer (recurring monthly fee)
This is the model's most structurally important price point, per `business-model.md`'s revenue-stream design. Recommended structure: a monthly fee scaled to the number of governed systems under monitoring and their EU AI Act risk tier (a High-risk system's monitoring obligation is materially heavier than a Limited-risk one, per `.claude/knowledge/eu-ai-act.md`).

| Governed system risk tier | Recommended monthly retainer band (per system) |
|---|---|
| High-risk (most HR-decision agents by default) | €1,500 – €3,500 / month |
| Limited/Minimal-risk | €500 – €1,200 / month |

`[VALIDATE: this is the least-tested price point in the entire structure, since it depends on a retainer relationship that per business-model.md's own open validations may not yet exist for any current client — treat this band as a hypothesis to test with the first Tier 2 governance engagement, not a settled number.]`

## Discounting Discipline

No standing discount schedule — a boutique, senior-judgment positioning (`positioning.md` Pillar 3) is undermined by a pricing structure that signals flexibility on value. Where a genuine strategic reason exists to price below band (a first reference client in a new tier or geography, explicitly tied to `roadmap.md`'s case-study milestones), that exception is recorded as a deliberate, time-limited decision — not a new baseline.

## Why Not Alternative Pricing Models

- **Not pure hourly/time-and-materials** — creates the wrong incentive (more hours, not better outcomes) and doesn't match a value-based positioning.
- **Not a flat SaaS-style subscription with no scoping** — inconsistent with `business-model.md`'s explicit rejection of a pure-platform model; every retainer is scoped to specific governed systems, not a generic access fee.
- **Not free/loss-leader diagnostics** — a genuinely free diagnostic undercuts the "senior judgment has real value" claim before the relationship even starts; the low end of the Tier 1 diagnostic band exists specifically to keep this affordable without being free.

## Cross-Document Consistency Note

Every band above is anchored to `ideal-client-profiles.md`'s three tiers and `service-catalog.md`'s Entry Point/Design & Deployment/Retained structure — no new tier or service shape is introduced here. `roadmap.md`'s Phase 1 explicitly includes validating these bands against real engagements before they're treated as final.
