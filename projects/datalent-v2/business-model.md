# Business Model — Datalent Solutions

**Objective this document serves:** define how Datalent Solutions actually makes money and delivers value on the path to becoming the European reference in Agentic AI for HR. Structured on Osterwalder's Business Model Canvas — a standard, citable framework — so every other document in this set (`service-catalog.md`, `pricing-strategy.md`, `go-to-market.md`) can build on one settled model rather than each implying a different one.

**Evidence basis:** grounded in the firm's actual current state (`docs/business-analysis.md`, `docs/business-audit-v2.md`), the market-gap findings from those audits, and the positioning direction already established in `.claude/memory/positioning-decisions.md`. Where this document proposes something new rather than describing something already true, it's marked as a recommendation, not a fact.

## The Core Decision This Document Makes

`docs/business-audit-v2.md`'s HR Technology Analyst persona flagged the live site as unable to answer "is this software or a service?" — a disqualifying ambiguity for enterprise buyers. This document resolves it: **Datalent is advisory-led and technology-enabled — not a SaaS platform, and not generalist staffing/consulting.** Concretely: Datalent designs, deploys, and governs AI agents and analytical systems *for* a client's HR function, staying accountable for the governance of what it builds, rather than (a) selling a self-serve product a client configures alone, or (b) delivering a report and walking away. This single decision is what every other document in this set assumes.

## Business Model Canvas

### Customer Segments
Three ICP tiers, detailed fully in `ideal-client-profiles.md`: Scaling PYME, Multi-Country Mid-Market Employer, Enterprise Innovation/Compliance Pilot. All three share one property that defines the segment boundary: an HR function serious enough to need governed, evidence-based systems, not simple headcount administration.

### Value Propositions
One per practice area, detailed fully in `value-proposition.md`. The unifying value proposition across all six: **decisions about people, backed by evidence and governed AI, that a European regulator, a works council, and a CFO would all independently sign off on.** No competitor in `competitive-differentiation.md`'s comparison set combines all three audiences' approval as a single design constraint.

### Channels
- **Direct, consultative sales** — the primary channel for Tier 2 and Tier 3 ICPs (see `go-to-market.md`), consistent with a boutique, senior-led delivery model that cannot support high-volume inbound self-serve.
- **Content and thought leadership** — the newsletter program (`docs/business-audit-v2.md`'s "El Radar Agéntico" redesign, operationalized via `.claude/commands/newsletter-issue.md`) and a corrected, evidence-based website (per `docs/website-audit.md`'s fixes) are the primary Tier 1 PYME channel, since that segment is more price-sensitive and earlier in its evaluation journey.
- **Partnerships** (recommended, not yet active) — see Key Partners below.

### Customer Relationships
High-touch and retained, not transactional. Every engagement begins with a scoped diagnostic (low commitment, clear entry point) and is designed to convert into an ongoing governance relationship — because AI governance, unlike a one-time recruitment project, is not something that's ever "finished" (a deployed agent needs continuous bias-audit and regulatory-alignment monitoring per `.claude/knowledge/eu-ai-act.md`). This is the structural basis for recurring revenue described below.

### Revenue Streams
Four streams, in order of maturity:

1. **Diagnostic / Assessment engagements** — fixed-fee, short-cycle entry point (e.g., an AI governance risk classification, a pay equity audit, a culture diagnostic). Low commitment for the client, high conversion intent for Datalent.
2. **Design & Deployment projects** — scoped, project-fee engagements: designing an agentic AI workflow, building a compensation structure, running a workforce scenario model. This is where most current revenue (per `docs/business-analysis.md`'s read of the live site's service lines) already sits.
3. **Governed Agent Retainer** *(recommended, new)* — a recurring monthly fee for ongoing human-oversight monitoring, bias-audit cadence, and regulatory-alignment updates on any agentic AI system Datalent has deployed. This is the model's most important addition: it converts AI Governance from a one-time deliverable into recurring revenue, and it's structurally defensible in a way flat project fees aren't — a client cannot let this lapse without accepting real compliance risk. See `pricing-strategy.md` for structure.
4. **Methodology licensing / training** *(recommended, later-phase, see `roadmap.md`)* — once Datalent has a proven, defensible governance methodology (the `.claude/` framework itself is the internal version of this), a codified version could be licensed or taught to internal HR/People Analytics teams at larger clients who want to run some of this in-house under Datalent's oversight. Not a Phase 1 revenue stream.

### Key Resources
- **Senior domain expertise across six practices** (Agentic AI, People Analytics, Compensation & Benefits, Total Rewards, AI Governance, Workforce Intelligence) — the resource that makes "boutique judgment, not junior-analyst pools" a real claim rather than a slogan.
- **The internal governance and delivery methodology** — the `.claude/` operating system built this session functions as Datalent's internal IP: a structured way to consistently produce evidence-based, governed deliverables. This is a genuine resource, not shelfware, as long as it stays the single source of truth it was designed to be (`.claude/integration/registry.yaml`).
- **European legal/regulatory grounding** — working fluency in GDPR, the EU AI Act, and the EU Pay Transparency Directive, current as of their real 2024–2026 provisions (`.claude/knowledge/eu-ai-act.md`, `.claude/knowledge/compensation-total-rewards.md`).

### Key Activities
- Diagnostic and design work per the six practice areas.
- Ongoing agent governance monitoring (the retainer stream's operational core).
- Evidence production: case studies, sourced newsletter content, published methodology — directly closing the credibility gap `docs/website-audit.md` and `docs/business-audit-v2.md` both identified.

### Key Partners *(recommended, not yet active — see `go-to-market.md`)*
- **ATS/HRIS vendors** for integration reach, rather than competing head-on with platforms like Workday or Visier on infrastructure — Datalent's agents and governance layer can sit alongside an existing HR-tech stack rather than replacing it.
- **European data hosting/infrastructure providers** to make the data-sovereignty claim in `positioning.md` concretely verifiable, not just asserted.
- **Legal/compliance boutiques** specializing in EU AI Act conformity assessment, for engagements requiring formal certification support beyond Datalent's own advisory scope.

### Cost Structure
Knowledge-based, not headcount-heavy: the dominant cost is senior expert time, not delivery infrastructure — consistent with the boutique positioning and the advisory-led (not platform) revenue model. `[VALIDATE: current cost structure, team size, and utilization rates against actual firm financials before using this section for real financial planning — this canvas describes the intended shape of the model, not verified current figures.]`

## Why This Model, Not the Alternatives

- **Not pure SaaS** (unlike Visier/Workday): a boutique firm cannot out-build platform incumbents on infrastructure, and "boutique judgment" is incompatible with a self-serve product motion. Competing as software would mean competing on the dimension where Datalent is structurally weakest.
- **Not pure generalist advisory** (unlike Mercer/Korn Ferry/Deloitte at their broadest): a project-fee-only model has no recurring revenue and no defensible moat — any competent competitor can pitch the same one-off engagement. The Governed Agent Retainer is what a pure advisory-only model lacks.
- **Advisory-led, technology-enabled, with a recurring governance layer** is the one shape that matches the actual differentiation claim in `positioning.md`: European, governed, boutique-judgment agentic AI is inherently an ongoing relationship, not a delivered artifact.

## Open Validations Before This Model Is Finalized

Per `.claude/memory/non-fabrication-policy.md`'s discipline, applied to internal strategy the same as client-facing content:
- `[VALIDATE]` actual current revenue mix across the (currently undocumented) existing engagements, to confirm how far Stream 3 (retainer) is from zero today.
- `[VALIDATE]` team capacity — how many senior practitioners currently exist per practice area, since the model's core resource claim depends on this being real, not aspirational.
- `[VALIDATE]` whether any client relationship already exists that could pilot the Governed Agent Retainer model before it's sold more broadly.
