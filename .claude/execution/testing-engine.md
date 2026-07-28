# Testing Engine

Owns the fifth lifecycle phase: **Testing** — the formal validation battery every task passes before it can reach `Done`. There is no compiled code in this system's deliverables, so "testing" here means something specific: systematically trying to break a consulting/content/governance deliverable the way a skeptical buyer, regulator, or auditor would, before they get the chance to. This phase is where `.claude/intelligence/quality-gates.md` and `.claude/intelligence/evaluation-engine.md` are actually run in full.

## The Five Test Types

### 1. Non-Fabrication Testing
**What it does:** exhaustively scans the output for every checkable claim (statistic, client name, outcome, capability, certification) and verifies each is either sourced or carries a `[VALIDATE]` marker. This is `.claude/intelligence/quality-gates.md` Gate 1, run formally rather than as a self-check.
**Pass/fail:** binary — any single unverified claim found is a fail (Evidence score of 0, a hard gate per `.claude/intelligence/evaluation-engine.md`). There is no partial credit here.
**Who runs it:** whichever agent is least invested in the claim being true — typically not the owner agent, per the same logic as `review-engine.md`'s reviewer pairing.

### 2. Persona-Panel Adversarial Testing
**What it does:** for any client-facing or market-facing output, run the six-persona panel from `.claude/agents/competitive-positioning-analyst.md` (CHRO, Compensation Director, People Analytics Director, HR Technology Analyst, Gartner Analyst, Enterprise Sales Director) as an adversarial test, not a courtesy read — each persona is trying to find a reason not to buy/trust/cite this output.
**Pass/fail:** a genuine "no" from any persona is a finding, logged with the specific objection (per `.claude/intelligence/reasoning-patterns.md` Pattern 6); the test doesn't require unanimous approval to pass, but every "no" needs an explicit accept-the-risk or fix-it decision — it cannot be silently ignored.
**Who runs it:** `competitive-positioning-analyst`.

### 3. Governance/Compliance Testing
**What it does:** for any output touching an AI system or automated process, formally verify the EU AI Act risk tier is stated with reasoning, the human oversight checkpoint is named, bias-audit status is stated or flagged, and data residency is stated or flagged — per `.claude/knowledge/eu-ai-act.md` and `.claude/agents/ai-governance-auditor.md`. This is `.claude/intelligence/quality-gates.md` Gate 3, run formally.
**Pass/fail:** binary hard gate — Governance score of 0 blocks regardless of every other test's result.
**Who runs it:** `ai-governance-auditor`, always, no exceptions.

### 4. Domain-Accuracy Testing
**What it does:** verifies the output correctly applies its domain's framework(s) from `.claude/knowledge/` and doesn't exhibit a named anti-pattern from that same file. This is `.claude/intelligence/quality-gates.md` Gate 2, run formally (Review already ran a lighter pass — this is the rigorous version).
**Pass/fail:** HR Quality or AI Quality score ≤ 2 is a fail, routing to revision (not necessarily a hard block, unless it compounds into a Gate 1 or Gate 3 failure).
**Who runs it:** the specialist agent owning the matching capability tag per `.claude/intelligence/capability-matrix.md`.

### 5. Regression Testing
**What it does:** checks the output against existing `.claude/memory/` and `.claude/knowledge/` content for contradiction — does this deliverable state something that conflicts with a prior firm position (`.claude/memory/positioning-decisions.md`), a previously-published competitive claim (`.claude/memory/competitive-landscape.md`), or a prior client-facing commitment from an earlier deliverable in the same project? This is the one test type with no direct predecessor in `.claude/intelligence/quality-gates.md` — it's specific to running *projects* over time rather than single one-off requests, where drift across multiple deliverables becomes possible.
**Pass/fail:** a genuine contradiction found is a `.claude/intelligence/conflict-resolution.md` case — resolve per that file's precedence hierarchy (e.g., if the new output's claim is better-evidenced than the stale memory entry, this is a `.claude/intelligence/learning-loop.md` Correction candidate, not just a fix to the current output).
**Who runs it:** whichever agent has visibility into the project's prior deliverables — typically the PM (`project-manager.md`) flags candidates for the owning specialist to check.

## Full Battery Sequencing

Tests run in this order (matching `.claude/intelligence/quality-gates.md`'s own sequencing logic — no point running an adversarial persona test on content that's about to be thrown out for fabrication):

```
1. Non-Fabrication Testing        (hard gate)
2. Domain-Accuracy Testing
3. Governance/Compliance Testing  (hard gate, conditional on AI content)
4. Regression Testing
5. Persona-Panel Adversarial Testing (conditional on client-facing)
   │
   ▼
6. Composite scoring — .claude/intelligence/evaluation-engine.md (all 8 dimensions)
   │
   ▼
Pass (composite ≥ 3.5, no hard-gate failures) → Done
Fail → back to In Progress with the specific failing test(s) named
```

This is the same six-gate structure as `.claude/intelligence/quality-gates.md`, made explicit as the formal Testing phase of the project lifecycle rather than a per-output pipeline description — Testing *is* where that pipeline actually executes for every task in a project.

## Test Records

Every test run is logged against the task (see `documentation-engine.md`): which test types ran, pass/fail per type, and the composite score. A task that passes Testing without a logged record didn't actually pass — the record is what `review-engine.md`'s SLA and `workflow-orchestrator.md`'s checkpoints rely on to confirm Testing genuinely happened rather than being assumed.

## Non-Negotiables

- Non-Fabrication and Governance/Compliance testing are hard gates — a high composite score elsewhere never compensates for a failure in either, exactly matching `.claude/intelligence/evaluation-engine.md`'s own rule.
- A task cannot reach `Done` with an open Regression Testing contradiction — either the new output is fixed, or the stale prior content is corrected via `.claude/intelligence/learning-loop.md`, but the contradiction cannot simply be left standing in both places.
- Persona-Panel testing must produce genuine verdicts, not diplomatic ones — per `.claude/agents/competitive-positioning-analyst.md`'s own non-negotiable; a Testing phase that only ever passes isn't testing anything.
