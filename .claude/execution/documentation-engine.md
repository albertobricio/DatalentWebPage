# Documentation Engine

This is a cross-cutting engine, not a single lifecycle phase — it runs continuously across Discovery through Retrospective, maintaining the project's own record of itself. Its outputs are what makes `review-engine.md`'s SLA enforceable, `testing-engine.md`'s test records real, and `.claude/intelligence/learning-loop.md`'s promotion pipeline possible — a learning can't be promoted from a decision that was never actually recorded.

## What Gets Documented

### Project Record
Created at Discovery (`project-manager.md`), updated through the lifecycle: problem statement, stakeholder map, domain scope, constraints, definition of done, methodology chosen (Kanban/Sprint, per `planning-engine.md`) and why, and the current lifecycle phase.

### Task Records
Every task's full schema (`task-engine.md`), its board-state history (when it moved from `Ready` to `In Progress` to `Internal Review` etc.), and — critically — every handoff message exchanged during multi-agent execution (per `.claude/intelligence/coordination-protocol.md` Step 6's structured format). A task record without its handoff history loses exactly the context `coordination-protocol.md` insisted on capturing in the first place.

### Test Records
Per `testing-engine.md`: which of the five test types ran, pass/fail per type, the full `.claude/intelligence/evaluation-engine.md` composite score and per-dimension breakdown, and the specific findings on any failure.

### Decision Log
Every non-trivial judgment call made during the project — which branch of a `.claude/intelligence/decision-engine.md` tree was taken and why, every `.claude/intelligence/conflict-resolution.md` case and its resolution, every escalation and its outcome. This is the project's own audit trail, and it exists for the same reason `.claude/knowledge/eu-ai-act.md` requires technical documentation for high-risk AI systems: a decision that can't be reconstructed later is a decision nobody can actually be held accountable for or learn from.

### Validation Marker Ledger
A running list of every `[VALIDATE]` marker introduced anywhere in the project's outputs, whether resolved yet or not. This is what prevents a marker from being quietly dropped between Review and Testing (a specific failure mode `review-engine.md`'s checklist already checks for per-task; the ledger is the project-wide view across all tasks at once) and lets `release-engine.md` verify nothing unresolved is about to ship.

## Traceability

Every task links back to the milestone it belongs to (`planning-engine.md`), which links back to the problem statement and definition of done (`project-manager.md`'s Discovery output). This chain is what makes it possible to answer "does this project's output actually solve the problem it was for" at Review and Testing time, rather than just "did all the tasks get checked off" — the same discipline `.claude/knowledge/consulting-methodologies.md` names as a common consulting failure mode (recommendations disconnected from implementation feasibility, or in this case, tasks disconnected from the actual problem).

## Governance-Specific Documentation

For any project touching `agentic-design`, `bias-audit`, or `governance-classification` (per `.claude/intelligence/capability-matrix.md`'s tags), the Documentation Engine additionally maintains what `.claude/knowledge/eu-ai-act.md` calls technical documentation: the agent's autonomy boundary and escalation triggers as specified (`.claude/templates/agent-spec-template.md`), the governance brief (`.claude/templates/ai-governance-brief-template.md`), and the bias-audit and data-residency status at time of delivery. This isn't optional project record-keeping for these projects — it's the artifact a regulator or client security reviewer would actually ask for, per the Enterprise Sales objection `docs/business-audit-v2.md` identified ("nothing here helps me pre-sell this internally to security, legal, or procurement").

## Format and Storage

Documentation lives with the project, not scattered across conversation history — a project record should be reconstructable by someone who wasn't present for any of the individual task executions. This system does not prescribe a specific file format or location beyond `.claude/execution/` itself (this file defines the discipline; where a live project's records physically live — a dedicated project folder, a `docs/` subfolder, etc. — is a deployment detail outside this framework's scope, and must never be `/src` or any website file per `.claude/CLAUDE.md` rule 7).

## Feeding the Learning Loop

At Retrospective (`continuous-improvement.md`), the Decision Log and Test Records are the primary source material for `.claude/intelligence/learning-loop.md`'s classification step (Correction / Confirmation / New Pattern / New Gap) — a retrospective that isn't grounded in the actual documented record degenerates into recollection and impression, which is a weaker input than the record itself.

## Non-Negotiables

- No task reaches `Done` (`task-engine.md`) without its Test Record actually existing, not just implied by the task's state.
- The Validation Marker Ledger is checked at `release-engine.md`'s readiness gate — an unresolved marker on the ledger blocks release unless explicitly accepted as a known, disclosed gap (never silently shipped as if resolved).
- Documentation is written as the project proceeds, not reconstructed retroactively at Retrospective — a reconstructed decision log is a recollection, not a record, and `.claude/memory/non-fabrication-policy.md`'s spirit applies here too: don't assert a decision rationale was X if it wasn't actually captured as X at the time.
