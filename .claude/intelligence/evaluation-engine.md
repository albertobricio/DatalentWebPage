# Evaluation Engine

Every output produced by this system is scored against eight dimensions before it can be marked as ready for delivery. This file defines what each dimension measures, how it's scored, which dimensions are hard gates versus soft-weighted, and how the dimensions combine into a delivery decision. `quality-gates.md` is the pipeline that invokes this engine; this file is the scoring logic itself.

## Scoring Scale

Every dimension is scored **0–5**:

| Score | Meaning |
|---|---|
| 0 | Absent, or actively wrong/harmful (e.g., a fabricated statistic, a missing governance statement on an agentic claim) |
| 1 | Present but seriously deficient |
| 2 | Below the bar — recognizable attempt, not acceptable to ship |
| 3 | Meets the minimum bar — acceptable, not distinguished |
| 4 | Strong — meets the bar with genuine rigor |
| 5 | Exceptional — the kind of output that would independently impress the harshest relevant persona in `docs/business-audit-v2.md` |

## The Eight Dimensions

### 1. Business Value
**Measures:** does this output drive an actual decision, revenue outcome, retention outcome, or risk reduction — or is it just information with nothing attached?
**Score 0–1 if:** no decision or action is implied anywhere in the output.
**Score 4–5 if:** the output explicitly states what decision it supports and for whom (echoes `.claude/agents/people-analytics-analyst.md`'s "end with a decision, not just a description" standard).
**Applies to:** all deliverable types.

### 2. HR Quality
**Measures:** domain correctness against the relevant `.claude/knowledge/` file(s) — HR Strategy, People Analytics, Compensation & Total Rewards, or Workforce Intelligence, as applicable.
**Score 0–1 if:** it misuses a named framework, ignores an obvious best practice from the matching knowledge file, or exhibits a listed anti-pattern.
**Score 4–5 if:** it correctly applies a named framework and would read as competent to the matching persona (e.g., People Analytics Director, Compensation Director) from `docs/business-audit-v2.md`.
**Applies to:** any output touching HR Strategy, People Analytics, Compensation & Total Rewards, or Workforce Intelligence.

### 3. AI Quality
**Measures:** technical/agentic soundness — correct use of the agentic-vs-automation distinction, a real autonomy boundary, a real escalation trigger (per `.claude/knowledge/agentic-ai.md` and `.claude/agents/agentic-ai-architect.md`).
**Score 0 if:** the word "agentic" is used for something that fails the test in `.claude/memory/positioning-decisions.md` (a human-triggered, human-reviewed-every-step process described as autonomous).
**Score 4–5 if:** autonomy boundary, escalation triggers, and human checkpoint are all explicit and specific (not generic).
**Applies to:** any output describing an AI system or agent.

### 4. Governance
**Measures:** EU AI Act risk-tier statement, human-oversight design, bias-audit status, data-residency statement — per `.claude/knowledge/eu-ai-act.md` and `.claude/knowledge/ai-governance.md`.
**Score 0 if:** an AI system is described with no governance companion sentence at all.
**Score 4–5 if:** risk tier is stated with reasoning (not just asserted), and every unconfirmed governance fact carries a `[VALIDATE]` marker rather than an implied "it's fine."
**Applies to:** any output describing an AI system; **not applicable** (mark N/A, not 0) to outputs with no AI component.

### 5. Evidence
**Measures:** is every statistic, client outcome, or capability claim sourced or explicitly marked `[VALIDATE]`, per `.claude/memory/non-fabrication-policy.md`?
**Score 0 if:** any single unverified number or claim is presented as fact.
**Score 5 only if:** every checkable claim is either sourced with a citation or explicitly flagged.
**Applies to:** all deliverable types. **This is a hard gate — see below.**

### 6. Trust
**Measures:** tone discipline per `.claude/memory/brand-voice.md` — falsifiable, specific claims over generic adjective-stacking ("líder," "innovador"); governance-paired AI claims; no overclaiming relative to what's actually true of the engagement.
**Score 0–1 if:** it reads like generic consultancy filler, or claims a capability (e.g., a certification, a comp practice) Datalent doesn't actually have per `.claude/memory/service-lines.md`.
**Score 4–5 if:** claims are specific and falsifiable, and the voice matches the firm's established tone.
**Applies to:** all client-facing deliverable types.

### 7. SEO
**Measures:** for anything intended for the live website specifically — structured data correctness, meta/title discipline, internal linking, keyword-to-audience match (per `.claude/knowledge/marketing.md`'s AEO/SEO trend content and `docs/website-audit.md`'s findings).
**Not applicable** to internal deliverables, proposals, or anything not destined for `/src` publication (this system does not modify website files — see `.claude/CLAUDE.md` rule 7 — so this dimension mostly governs *copy intended to be handed off* for someone else to publish).
**Score 4–5 if:** the copy would close, not reproduce, a gap already logged in `docs/website-audit.md`.
**Applies to:** website-copy-intended deliverables only; mark N/A otherwise.

### 8. Executive Relevance
**Measures:** would a CHRO, Economic Buyer, or Gartner-Analyst-equivalent persona (per `docs/business-audit-v2.md` and `.claude/agents/competitive-positioning-analyst.md`) find this valuable enough to act on, versus filing it away?
**Score 0–1 if:** the output only survives a first-touch/SMB-inbound read and would not survive a procurement committee or board-level skeptic.
**Score 4–5 if:** it would pass the six-persona panel with genuine (not diplomatic) "would buy/would cite" verdicts.
**Applies to:** all client-facing and market-facing deliverable types; lower weight for pure internal working documents (still score, but weight 0 in the composite — see below).

## Hard Gates vs. Weighted Dimensions

Two dimensions are **hard gates**: a score of 0 on either **blocks delivery outright**, regardless of every other dimension's score. No composite averaging can compensate for a failure here.

- **Evidence** — because a single fabricated number is a compounding trust liability (see `.claude/memory/non-fabrication-policy.md`); no amount of polish elsewhere offsets it.
- **Governance** (when applicable) — because an ungoverned AI claim is a regulatory and reputational exposure, not a style issue.

The remaining six dimensions are **weighted** into a composite score (see below) and inform a revise-vs-ship judgment, but a low score on any one of them alone doesn't hard-block — it routes to revision per `quality-gates.md`.

## Composite Scoring

Default weights (adjustable per deliverable type — see `workflow-library.md` for per-workflow overrides):

| Dimension | Default weight |
|---|---|
| Business Value | 15% |
| HR Quality | 15% |
| AI Quality | 10% (0% if N/A) |
| Governance | 15% (0% if N/A — redistribute proportionally to remaining dimensions) |
| Evidence | 20% |
| Trust | 15% |
| SEO | 5% (0% if N/A) |
| Executive Relevance | 5% |

**Composite = weighted average, on the 0–5 scale.** A composite ≥ 3.5 with no hard-gate failures is the default delivery threshold (see `quality-gates.md` for how this threshold is actually enforced in the pipeline, and for the revise-and-resubmit loop when it isn't met).

## Who Scores

The evaluating agent must be different from the producing agent wherever the capability matrix supports it (see `capability-matrix.md`) — `competitive-positioning-analyst` is the default scorer for Trust, Executive Relevance, and SEO; `ai-governance-auditor` is the default scorer for Governance and AI Quality; the originating specialist self-scores Business Value and HR Quality as a first pass, but Evidence is checked by whichever agent is closest to final assembly (typically `client-content-writer`) as a last-mile scan, per its own non-fabrication self-check requirement. Self-scoring alone on Evidence or Governance is not sufficient — see `quality-gates.md`.
