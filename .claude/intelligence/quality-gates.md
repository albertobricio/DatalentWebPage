# Quality Gates

**No output leaves this system without passing this pipeline.** This is the mechanical enforcement of `.claude/CLAUDE.md`'s operating rules and the requirement that every output be evaluated before delivery. `evaluation-engine.md` defines *how* to score; this file defines *the sequence of checks* and *what happens on failure*.

## The Gate Sequence

Gates run in this order. A failure at any gate stops the pipeline — later gates don't run on content that already failed an earlier one, since there's no point scoring governance on a draft that's about to be rewritten for fabrication anyway.

```
Draft produced
   │
   ▼
Gate 1: Non-Fabrication Scan  ──fail──▶ Revise (originating agent)
   │ pass
   ▼
Gate 2: Domain Accuracy Check ──fail──▶ Revise (originating agent, or escalate to matching knowledge/ specialist)
   │ pass
   ▼
Gate 3: Governance Gate (conditional) ──fail──▶ Revise or block (ai-governance-auditor has final say — see conflict-resolution.md)
   │ pass / N/A
   ▼
Gate 4: Brand & Positioning Gate (conditional: client-facing only) ──fail──▶ Revise (competitive-positioning-analyst + client-content-writer)
   │ pass / N/A
   ▼
Gate 5: Evaluation Engine Composite Scoring ──below threshold──▶ Revise (targeted at the lowest-scoring dimension)
   │ pass
   ▼
Gate 6: Human-Readiness Check ──fail──▶ Revise
   │ pass
   ▼
Delivered
```

## Gate Definitions

### Gate 1 — Non-Fabrication Scan
**Runs on:** every output, no exceptions.
**Checks:** every statistic, client name, outcome, certification, and capability claim is either sourced or marked `[VALIDATE: ...]`, per `.claude/memory/non-fabrication-policy.md`.
**Who runs it:** the originating agent, as a mandatory self-check before submission (already required by each agent's own definition) — then re-checked independently by `client-content-writer` if the output passes through it, since a second pass catches what self-review misses.
**Failure = Evidence score of 0 in `evaluation-engine.md`,** which is a hard gate. This is the single most important check in the pipeline given the firm's own audits (`docs/website-audit.md`, `docs/business-audit-v2.md`) identified unsourced claims as its live credibility risk.

### Gate 2 — Domain Accuracy Check
**Runs on:** any output making a domain-specific claim (HR Strategy, People Analytics, Compensation & Total Rewards, Workforce Intelligence, Agentic AI, Marketing, Enterprise Sales, Consulting Methodologies).
**Checks:** the output correctly applies the relevant `.claude/knowledge/` file's frameworks and doesn't exhibit a listed anti-pattern from that file.
**Who runs it:** the specialist agent who owns the matching capability tag per `capability-matrix.md`, even if a different agent (e.g., `client-content-writer`) produced the final prose.
**Failure = HR Quality or AI Quality score ≤ 2** in `evaluation-engine.md` — routes to revision, not a hard block, unless the inaccuracy also triggers Gate 1 or Gate 3.

### Gate 3 — Governance Gate (conditional)
**Runs on:** any output describing an AI system, agent, or automated decision process.
**Checks:** EU AI Act risk tier stated with reasoning, human oversight checkpoint named, bias-audit status stated or flagged, data residency stated or flagged — per `.claude/knowledge/eu-ai-act.md` and `.claude/agents/ai-governance-auditor.md`.
**Who runs it:** `ai-governance-auditor`, always — this agent cannot be skipped for AI-related content regardless of how confident the originating agent is (see `conflict-resolution.md` for its veto authority).
**Failure = Governance score of 0** in `evaluation-engine.md`, a hard gate. **This gate does not run** (mark N/A) for outputs with no AI/automation component — don't force a governance review onto, say, a pure comp benchmark with no AI scoring involved.

### Gate 4 — Brand & Positioning Gate (conditional: client-facing only)
**Runs on:** any output intended for a client, prospect, or the public (proposals, case studies, website copy, newsletter issues, FAQ entries, battlecards).
**Checks:** tone matches `.claude/memory/brand-voice.md`; positioning matches `.claude/memory/positioning-decisions.md`; agentic-vs-automation vocabulary discipline held; would survive the six-persona panel per `.claude/agents/competitive-positioning-analyst.md`.
**Who runs it:** `competitive-positioning-analyst`.
**Failure = Trust or Executive Relevance score ≤ 2** — routes to revision. **Does not run** on purely internal working documents (a draft governance brief for internal review, an intermediate data analysis) — those skip straight to Gate 5 with Trust/Executive Relevance weighted to 0 per `evaluation-engine.md`.

### Gate 5 — Evaluation Engine Composite Scoring
**Runs on:** every output that has passed Gates 1–4 (or had them marked N/A).
**Checks:** full eight-dimension scoring per `evaluation-engine.md`, composite ≥ 3.5 threshold.
**Who runs it:** whichever agent(s) `evaluation-engine.md`'s "Who Scores" section assigns per dimension — never only the originating agent scoring its own work end-to-end.
**Failure:** composite below 3.5 routes back to the originating agent with the lowest-scoring dimension(s) named explicitly — a generic "needs improvement" is not sufficient feedback to route on.

### Gate 6 — Human-Readiness Check
**Runs on:** every output, as the final check.
**Checks:** a single holistic question — "would a competent, honest senior practitioner at Datalent actually send this as-is?" This catches anything the mechanical gates above miss (awkward phrasing, a technically-passing-but-hollow claim, a `[VALIDATE]` marker left in a spot that reads as broken rather than intentional).
**Who runs it:** the same agent that ran Gate 5, as a closing check — not a new agent, to avoid infinite gate proliferation, but explicitly a distinct mental check from the scoring pass.
**Failure:** revise; if this gate fails twice on the same output, escalate to the user rather than continuing to iterate autonomously — see `decision-engine.md`'s escalation tree.

## Gate Applicability by Deliverable Type

| Deliverable type | Gate 1 | Gate 2 | Gate 3 | Gate 4 | Gate 5 | Gate 6 |
|---|---|---|---|---|---|---|
| Agent spec (`agent-design`) | Required | Required | Required | N/A (internal) | Required | Required |
| Governance brief (`ai-risk-classify`) | Required | Required | Required (self, by definition) | N/A | Required | Required |
| Comp benchmark (`comp-benchmark`) | Required | Required | N/A unless AI-scored | N/A (internal) | Required | Required |
| Pay equity audit (`pay-equity-audit`) | Required | Required | N/A unless automated tooling used | Conditional (if client-facing report) | Required | Required |
| Case study (`case-study`) | Required | Required | Conditional (if AI system described) | Required | Required | Required |
| Proposal (`proposal`) | Required | Required | Conditional | Required | Required | Required |
| Newsletter issue (`newsletter-issue`) | Required | Required | Conditional | Required | Required | Required |
| Positioning review (`positioning-check`) | Required | N/A (it's a review, not a domain claim itself) | N/A | Required (it IS this gate) | Required | Required |
| Workforce forecast (`workforce-forecast`) | Required | Required | N/A unless AI-driven forecasting tool described | N/A (internal) | Required | Required |
| FAQ entry (`faq-entry`) | Required | Required | Conditional (governance/data questions) | Required | Required | Required |

## What "Delivery" Means

An output that passes all applicable gates is ready to hand to the user. Passing the pipeline does **not** mean it's automatically published to the website, sent to a client, or otherwise made externally live — this system, per `.claude/CLAUDE.md` rule 7, never silently ships anything; a human always makes the final send/publish decision. "Delivered" here means "ready for that human decision," not "autonomously sent."

## Escalation on Repeated Failure

If the same output fails the same gate more than twice, stop iterating autonomously and surface the specific, recurring blocker to the user — this is both a `conflict-resolution.md` trigger and, if the pattern recurs across multiple unrelated requests, a `learning-loop.md` signal that a knowledge or memory file needs correction rather than the individual output needing more revision cycles.
