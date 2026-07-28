# Roadmap — Datalent Solutions

**Objective this document serves:** the capstone that sequences all eight other documents in this set — plus the open findings from `docs/website-audit.md`, `docs/business-audit-v2.md`, and `docs/framework-audit.md` — into one integrated path toward "the European reference in Agentic AI for HR." Every phase below names which other document it draws on, so this roadmap cannot silently drift from the strategy it's supposed to execute.

## Phase 0 — Foundation (Immediate, 0–6 weeks)

Fix what's actively broken before spending on growth — a GTM motion (`go-to-market.md`) built on top of unmeasurable, unsourced, or broken infrastructure produces unreliable signal about what's actually working.

- Install real analytics and fix the broken Google Reviews widget (`docs/website-audit.md`) — without this, no metric in `go-to-market.md`'s Metrics section is measurable.
- Correct or remove unsourced hero stats on the live site (`docs/website-audit.md`, `docs/business-audit-v2.md`) — direct prerequisite for `positioning.md` and `value-proposition.md` to be credible once published.
- Finalize the positioning statement and tagline in `positioning.md`, including the `[VALIDATE]`-flagged buyer-interview test.
- Confirm the `business-model.md` open validations (current revenue mix, team capacity per practice) — this roadmap's later phases assume real capacity exists to deliver against; that assumption needs a first check now, not after Phase 1 sales commitments are made.

**Success metric:** analytics live and reporting; zero unsourced quantitative claims remain on the public site; positioning statement finalized and internally circulated.

## Phase 1 — Prove It in Spain (Months 1–6)

Focus entirely on Tier 1 and Tier 2 Spanish clients (`ideal-client-profiles.md`, `go-to-market.md`'s Phase 1 geography). The objective is the firm's first genuinely evidence-backed case study — everything in `docs/business-audit-v2.md`'s findings traces back to the fact that none currently exist.

- Launch the corrected service catalog (`service-catalog.md`) with the two named bundles.
- Validate `pricing-strategy.md`'s price bands against the first 3–5 real engagements across at least two tiers.
- Produce the first newsletter issues in the "El Radar Agéntico" recurring format (`go-to-market.md`'s Marketing Engine, `.claude/templates/newsletter-issue-template.md`).
- Close at least one Tier 2 AI Governance or pay equity engagement and convert it into a sourced, dated, methodology-documented case study (`.claude/templates/case-study-template.md`) — the single highest-priority deliverable of this entire roadmap, since it's the input every later phase depends on.
- Pilot the Governed Agent Retainer with at least one client, even at a discounted introductory rate if justified per `pricing-strategy.md`'s Discounting Discipline exception process — this validates `business-model.md`'s most important and least-tested revenue stream.

**Success metric:** at least one published, sourced case study; retainer model piloted with at least one client; price bands validated or revised; newsletter cadence established (target: bi-weekly, per the template's own cadence assumption).

## Phase 2 — Establish the Category in the EU (Months 6–18)

Expand geographically to EU markets beyond Spain (`go-to-market.md`'s Phase 2) and begin pursuing Tier 3 opportunities — but only once Phase 1's case study exists, per `ideal-client-profiles.md`'s explicit sequencing note that Tier 3 pursuit should not run in parallel with an unproven track record.

- Expand content/SEO and partnership channels into at least one additional EU market.
- Pursue the first Tier 3 engagement via `go-to-market.md`'s warm-referral/account-based motion, using `competitive-differentiation.md`'s Workday battle plan as the primary playbook, since Tier 3's entry point is explicitly framed as independent governance validation of an existing platform pilot.
- Build the sales enablement collateral `docs/business-audit-v2.md`'s Enterprise Sales Director persona flagged as missing (security/procurement one-pagers, a data-residency statement) before, not during, the first Tier 3 procurement gate.
- Reassess `.claude/memory/competitive-landscape.md` and `competitive-differentiation.md` for any competitor repositioning (per that document's own Maintenance note) — a full 12–18 months is enough time for Visier, Mercer, or Workday to have shifted their own AI-governance messaging.

**Success metric:** presence (even early-stage) in at least one additional EU market; at least one Tier 3 engagement closed or in active late-stage pipeline; sales enablement collateral complete; competitive landscape re-validated.

## Phase 3 — Scale the Recurring Base, Consider LatAm (Months 18–36)

- Grow the Governed Agent Retainer base as the firm's primary recurring-revenue engine (`business-model.md`), now backed by 12+ months of real operating data rather than Phase 1's pilot assumptions.
- Only at this point, evaluate entering the Spanish-speaking LatAm market (`go-to-market.md`'s Phase 3) — and only with dedicated content, case studies, and (per `docs/business-analysis.md`'s original finding) a genuine substantiated presence, not a repeat of the unsubstantiated claim the original site made.
- Evaluate the methodology-licensing/training revenue stream (`business-model.md`'s fourth, later-phase stream) once the governance methodology has enough proven engagements behind it to be credibly taught rather than just applied.
- Revisit `.claude/integration/registry.yaml`'s framework itself for maintenance per its own `versioning.md` conventions — three years of real engagements is exactly the kind of accumulated learning `.claude/intelligence/learning-loop.md` was designed to promote into permanent knowledge; this is the point to actually run that promotion pipeline against real accumulated experience rather than the hypothetical scenarios it was designed against.

**Success metric:** retainer base is the largest single revenue stream; LatAm entry decision made deliberately (go or no-go, either is an acceptable outcome, silence is not); at least one `.claude/intelligence/learning-loop.md` promotion cycle completed against real operating history.

## Dependencies Across Phases

```
Phase 0 (fix infrastructure) ──▶ Phase 1 (prove it in Spain) ──▶ Phase 2 (establish EU category) ──▶ Phase 3 (scale + LatAm)
        │                              │                                │
        ▼                              ▼                                ▼
docs/website-audit.md fixes    first case study, retainer pilot   Tier 3 entry, competitive re-check
```

No phase should begin substantively ahead of the prior phase's success metric being met — this mirrors `.claude/execution/workflow-orchestrator.md`'s own checkpoint discipline (a phase transition requires its checkpoint's conditions verifiably met, not just time having passed).

## What Would Make This Roadmap Wrong

Stated explicitly, so it can be checked rather than assumed correct indefinitely:
- If Phase 1 produces zero convertible case studies after 6 months, that's a signal to revisit `ideal-client-profiles.md`'s tier definitions or `pricing-strategy.md`'s bands before pushing into Phase 2, not a signal to push through on schedule regardless.
- If the Governed Agent Retainer pilot in Phase 1 shows no client willing to pay for ongoing monitoring, `business-model.md`'s core recurring-revenue thesis needs re-examination before Phase 3 assumes it as the primary growth engine.
- If a competitor closes the "European + agentic + governed" gap `positioning.md` is built on before Phase 2 completes, `competitive-differentiation.md`'s shared wedge needs revisiting immediately, not at the next scheduled review.

## Cross-Document Consistency Note

This roadmap introduces no new claims, tiers, prices, or positioning of its own — every substantive decision it sequences is drawn from one of the other eight documents in this set, cited inline above. If a future revision changes any of those eight documents, this roadmap's phase content must be checked for consistency in the same revision pass.
