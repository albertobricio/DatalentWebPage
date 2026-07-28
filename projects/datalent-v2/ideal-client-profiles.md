# Ideal Client Profiles — Datalent Solutions

**Objective this document serves:** define exactly who Datalent sells to, with enough specificity that `pricing-strategy.md`, `go-to-market.md`, and `value-proposition.md` can all target the same three segments consistently, rather than each implicitly assuming a different buyer.

**Evidence basis:** derived from `docs/business-analysis.md`'s finding that the current site targets an unresolved mix of "PYMES" and "grandes empresas" with no clear segmentation, and from `positioning.md`'s boutique/senior-judgment model, which structurally cannot serve every company size equally well. Buyer personas reuse the six-persona panel already established and validated in `docs/business-audit-v2.md`, for continuity rather than inventing new ones.

## Why Three Tiers, Not One

A boutique, senior-led firm (per `business-model.md`) cannot serve a 20-person startup and a 20,000-person multinational with the same engagement model, price point, or sales motion. `docs/business-analysis.md` flagged this exact tension as unresolved on the live site ("boutique/personal" positioning claiming to also serve "grandes empresas"). These three tiers resolve it by defining a distinct engagement shape per segment, rather than one blurred pitch.

## Tier 1 — Scaling PYME

**Firmographics:** 80–400 employees, Spain or EU-based, growth-stage (often PE-backed or founder-led scaling past its first HR hire), single or dual-country operation.

**HR maturity signal:** has a formal HR function but no dedicated People Analytics or AI governance capability yet; likely running a generic ATS with no predictive or governed-AI layer.

**Trigger events:** headcount growth outpacing hiring quality/speed; a first attempt at systematic culture/engagement measurement; a founder or new HR Director wanting to professionalize before scaling further.

**Buyer persona (primary):** the **CHRO/HR Director persona** from `docs/business-audit-v2.md`'s panel — at this size, often the most senior HR person in the company, reporting directly to the CEO, balancing strategic ambition against limited internal analytical capacity.

**Entry point:** a fixed-fee diagnostic (Recruitment Predictivo assessment or a culture/engagement diagnostic) — low commitment, fast time-to-value, matches this segment's price sensitivity and shorter sales cycle.

**Why this tier fits Datalent:** exactly the segment the current site's "PYMES" language already targets, but currently without evidence or governance credibility (`docs/website-audit.md`). Lowest barrier to entry, fastest proof-point generation for `roadmap.md`'s early case-study needs.

**Why this tier alone isn't enough:** lower deal size (`pricing-strategy.md`), higher price sensitivity, and less natural fit for the Governed Agent Retainer revenue stream (`business-model.md`) since AI governance stakes are lower at this scale — a P1 lead-generation segment, not the segment that proves the AI-governance differentiation.

## Tier 2 — Multi-Country Mid-Market Employer

**Firmographics:** 400–2,500 employees, operating across two or more EU countries (or Spain plus at least one other EU market), established HR-tech stack (an ATS/HCM already in place — Workday, SAP SuccessFactors, or a comparable platform).

**HR maturity signal:** has begun or is actively planning AI-assisted HR processes (recruitment automation, engagement analytics) but lacks a formal AI governance layer — exactly the gap `.claude/knowledge/eu-ai-act.md` identifies as High-risk-by-default and under-addressed by most HR-tech deployments today.

**Trigger events:** an internal or external audit flags EU AI Act exposure in existing HR-tech; a works council or legal/compliance function raises a governance question about an AI tool already in use; expansion into a new EU country triggers a compensation/pay-equity review under the EU Pay Transparency Directive.

**Buyer persona (primary):** the **CHRO** and **HR Technology Analyst** personas together — this is the tier where the "is this software or a service" ambiguity `docs/business-audit-v2.md` flagged matters most, because this buyer is actively running a vendor evaluation process and needs the answer clearly stated. The **Compensation Director** persona is also frequently in-scope here given the Pay Transparency Directive trigger.

**Entry point:** an AI governance risk classification engagement (`.claude/commands/ai-risk-classify.md`'s underlying workflow) or a pay equity audit — both diagnostic, both directly tied to a live regulatory deadline, both naturally converting into the Governed Agent Retainer.

**Why this tier fits Datalent:** this is the segment where Pillar 2 (European by Design) and Pillar 4 (integrated six practices) do the most competitive work — large enough to have real AI/compliance exposure, not yet large enough to have an in-house AI governance function of their own, and not well served by Workday/Visier (who built the platform but don't sell independent governance) or by Mercer/Deloitte (who sell governance advisory but no defined agentic AI capability).

**This is the primary revenue-target tier** — the clearest fit for `business-model.md`'s full four-stream model, including the recurring retainer.

## Tier 3 — Enterprise Innovation / Compliance Pilot

**Firmographics:** 2,500+ employees, already running a major HCM platform, dedicated (if small) internal People Analytics or AI/Innovation function.

**HR maturity signal:** actively piloting or evaluating agentic AI in HR (often via the incumbent platform vendor's own roadmap — e.g., a Workday Illuminate pilot) and needs an **independent** European governance partner to validate, audit, or co-design the deployment, because the platform vendor cannot credibly self-certify its own compliance posture to a skeptical Legal/Compliance function.

**Trigger events:** a platform vendor pitches an agentic AI feature and internal Legal/Compliance/Works Council pushes back requiring independent governance review; an EU AI Act conformity assessment deadline approaches for a specific High-risk use case already in production.

**Buyer persona (primary):** the **Gartner Analyst-equivalent internal evaluator** and **HR Technology Analyst** personas, with the **CHRO** as ultimate economic buyer and Legal/Compliance as a mandatory secondary stakeholder — this tier's buying committee is the largest and slowest of the three, consistent with `.claude/knowledge/enterprise-sales.md`'s buying-committee research.

**Entry point:** a scoped AI Governance audit of an existing or piloted system — narrow, defensible, doesn't require displacing the incumbent platform relationship, which is the only realistic way into an account this size without an existing foothold.

**Why this tier fits Datalent:** validates the "European governance layer, independent of the platform" thesis at the scale where it matters most reputationally — a credible Tier 3 case study is disproportionately valuable for `roadmap.md` and `competitive-differentiation.md`'s Workday battle plan specifically.

**Why this tier is not the primary near-term focus:** longest sales cycle, largest buying committee, and the least forgiving of an unproven case-study record — `roadmap.md` sequences Tier 3 pursuit *after* Tier 2 has produced verifiable proof points, not in parallel from day one.

## Disqualifying Criteria (Who Is Not a Fit)

Explicit, because an ICP without exclusions isn't one:

- **Micro-businesses under ~50 employees with no formal HR function** — insufficient scope for evidence-based, governed work; better served by a generic HR software tool, not a boutique advisory relationship.
- **Buyers seeking pure staffing/RPO volume hiring** — mismatched to Datalent's evidence-and-governance model; this is precisely the "eurofirms/adecco" competitor-adjacent search intent `docs/business-analysis.md` flagged as diluting the current site's positioning, and it should be actively screened out, not chased.
- **Organizations unwilling to engage on AI governance at all** (wanting AI capability with no human-oversight discussion) — a direct conflict with Pillar 1 of `positioning.md`; not a fundable compromise.
- **Non-European buyers with no EU operating footprint**, at least in Phases 1–2 of `go-to-market.md`'s geographic sequencing — the European-by-design pillar has less differentiating power outside the EU regulatory context it's built around.

## Cross-Document Consistency Note

These three tiers are the fixed reference point for `pricing-strategy.md` (tier-specific price bands), `go-to-market.md` (tier-specific channels and sales motion), and `value-proposition.md` (tier-specific value propositions). Any future revision to these tiers must be propagated to those three documents in the same pass.
