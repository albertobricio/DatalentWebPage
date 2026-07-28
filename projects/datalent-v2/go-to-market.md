# Go-to-Market — Datalent Solutions

**Objective this document serves:** how Datalent actually reaches, sells to, and closes each ICP tier — channels, sales motion, marketing engine, and geographic sequencing, all consistent with `ideal-client-profiles.md`'s three tiers and `business-model.md`'s revenue streams.

## Geographic Sequencing

Three phases, resolving the tension `docs/business-analysis.md` flagged (the live site's Organization schema claims service across Spain, Mexico, Colombia, Argentina, and Chile with zero substantiating content):

- **Phase 1 — Spain.** Home market, existing relationships, Spanish-language content already matches the audience (per `.claude/memory/brand-voice.md`). All early case studies and reference clients should come from here.
- **Phase 2 — EU / Eurozone.** Once Phase 1 has produced at least one Tier 2 case study, expand to other EU markets where the European-by-design positioning pillar (`positioning.md`) has the same regulatory grounding (EU AI Act, GDPR, Pay Transparency Directive apply uniformly across the bloc).
- **Phase 3 — Spanish-speaking Latin America.** Opportunistic, relationship-led expansion (Mexico, Colombia, Argentina, Chile) — but explicitly *not* claimed as an active market until Phase 3 actually begins. `docs/business-analysis.md`'s finding stands: claiming LatAm service today with zero LatAm content or case studies is a credibility risk, not a strength. The website and any GTM collateral should not claim this market before Phase 3.

## Channel Strategy by ICP Tier

### Tier 1 — Scaling PYME
**Primary channel: content and inbound.** This segment researches independently before engaging a boutique firm and is price-sensitive enough that expensive outbound sales motion doesn't pay back. The channel mix:
- A corrected, evidence-based website (closing every gap in `docs/website-audit.md` — working analytics, sourced claims, a functioning FAQ trust section).
- The newsletter program ("El Radar Agéntico," per `.claude/commands/newsletter-issue.md` and `docs/business-audit-v2.md`'s redesign), building the citable thought-leadership record Tier 1 buyers self-evaluate against before a first call.
- SEO targeting the *correct* keyword set — per `docs/business-analysis.md`'s finding, the live site currently mixes B2B-consultancy and job-seeker/competitor-brand search terms; this GTM plan uses only the former.

### Tier 2 — Multi-Country Mid-Market Employer
**Primary channel: direct, consultative sales**, using `.claude/knowledge/enterprise-sales.md`'s frameworks — MEDDIC-style qualification, explicit Economic Buyer / Champion identification, since this tier's buying committee (per `ideal-client-profiles.md`) spans CHRO, HR Technology, Compensation, and often Legal.
**Secondary channel: partnerships** (per `business-model.md`'s Key Partners) — an EU AI Act compliance boutique or an ATS/HRIS implementation partner is well-positioned to refer exactly this tier's trigger event (an internal compliance question about an existing AI tool).
**Sales motion:** lead with the lowest-friction entry point that matches the trigger event — an AI governance risk classification or a pay equity audit, never a broad "let's discuss your HR strategy" opener, which is too slow for this tier's typically compliance-driven urgency.

### Tier 3 — Enterprise Innovation / Compliance Pilot
**Primary channel: warm referral and account-based outreach**, not cold outbound — per `.claude/knowledge/enterprise-sales.md`, a buying committee this size and this compliance-sensitive rarely responds to unsolicited contact. The realistic path in is via: a Tier 2 client that has grown or been acquired into Tier 3 scope, a partner referral (see Key Partners), or direct outreach specifically timed to a public signal (a competitor's or the client's own announced AI-in-HR pilot).
**Sales motion:** narrow, defensible entry (a single-system governance audit), never an attempt to sell the full six-practice catalog upfront — this tier's buying committee needs to see independence and rigor proven on one bounded engagement before trusting a broader relationship.

## Marketing Engine

Three components, each tied to a specific gap already documented in this session's prior audits:

1. **Website correction** (`docs/website-audit.md`, `docs/business-audit-v2.md`) — install real analytics (currently absent entirely), fix the broken Google Reviews widget, source or remove the unsourced hero stats, add the FAQ trust block on AI governance/data residency, and correct the sitemap/structured-data gaps. This is prerequisite infrastructure, not a parallel workstream — without working analytics, no GTM channel above is measurable.
2. **Newsletter as a research asset**, not commentary — the "El Radar Agéntico" recurring format (`.claude/templates/newsletter-issue-template.md`), sourced every issue, building toward the same kind of citable authority Deloitte's Human Capital Trends or Mercer's Global Talent Trends carry, per `.claude/knowledge/marketing.md`'s thought-leadership-maturity framework.
3. **Case study production**, sequenced with `roadmap.md` — the single highest-leverage marketing asset this firm currently lacks entirely (`docs/business-audit-v2.md`'s Enterprise Sales Director persona verdict: "I can't hand this URL to a procurement committee").

## Sales Enablement

- `competitive-differentiation.md`'s five battle plans are the standing reference for every competitive deal conversation.
- `.claude/templates/client-proposal-template.md` and `.claude/commands/proposal.md` are the standard proposal-generation path — every proposal should route through `.claude/agents/competitive-positioning-analyst.md`'s review before it reaches a prospect, per this system's own quality gates.
- Security/procurement readiness collateral (an AI governance one-pager, a data-residency statement) should exist *before* the first Tier 2/3 deal reaches a procurement gate, not be improvised in response to one — `docs/business-audit-v2.md`'s Enterprise Sales Director persona flagged this exact gap.

## Metrics

Per `.claude/knowledge/enterprise-sales.md`'s standard KPIs, applied to this GTM plan specifically:
- Pipeline coverage ratio (target: 3–4x quota, standard B2B benchmark) — `[VALIDATE once quota is set per pricing-strategy.md]`.
- Content-to-opportunity conversion rate for the Tier 1 inbound channel.
- Multithreaded-contact count per Tier 2/3 opportunity (a proxy for buying-committee coverage, per `.claude/knowledge/enterprise-sales.md`'s anti-pattern warning against single-threaded deals).
- Case-study count and recency — directly tracked against `roadmap.md`'s milestones.

## Cross-Document Consistency Note

Channel and motion choices here are derived entirely from `ideal-client-profiles.md`'s three tiers and `business-model.md`'s revenue streams — no new segment or revenue mechanism is introduced in this document. Geographic phasing here is the same three-phase sequence `roadmap.md` uses for its own timeline.
