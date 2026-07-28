# Continuous Improvement

Owns the seventh and final lifecycle phase: **Retrospective**. This is the engine that makes the Execution Layer connect back into `.claude/intelligence/learning-loop.md` — a project that ends at Release without a Retrospective is a missed opportunity to make the whole system better, not just a slightly incomplete project.

## Retrospective Cadence

- **Sprint mode projects:** a Retrospective at the close of every Sprint (per `planning-engine.md`), plus a final project-level Retrospective at overall Release.
- **Kanban mode projects:** no natural Sprint boundary, so Retrospective triggers on a checkpoint basis instead — every N tasks reaching `Done` (default N=10, adjustable at Planning) or at a fixed calendar cadence (default monthly for an ongoing Kanban stream), whichever comes first — plus always at Release if the Kanban stream has a defined end.

## Retrospective Format

Structured around four questions, answered against the actual project record (`documentation-engine.md`) — not general impression:

1. **What went well** — which decisions, task framings, or agent assignments produced clean passes through Review and Testing on the first attempt? These are Confirmation candidates.
2. **What didn't** — which tasks bounced back from Review or Testing more than once, which Coverage Gaps surfaced, which `.claude/intelligence/conflict-resolution.md` cases needed escalation? These are Correction or New Gap candidates.
3. **What recurred** — did the same reasoning approach, the same decision-tree branch, or the same objection from a persona test show up across multiple unrelated tasks in this project? These are New Pattern candidates.
4. **What's still open** — any disclosed known gap carried through Release (per `release-engine.md`'s readiness checklist) — these need an owner and a plan, not just a mention.

## Routing Findings Into the Learning Loop

This is the direct integration point with `.claude/intelligence/learning-loop.md` — every Retrospective finding is classified using that file's exact taxonomy before being routed:

| Retrospective finding | Learning Loop classification | Destination (per `learning-loop.md`'s routing table) |
|---|---|---|
| A task framing or agent pairing worked cleanly and the user confirmed the output without pushback | Confirmation | `.claude/memory/` (if firm-specific) or `.claude/knowledge/` (if generalizable) |
| A `.claude/memory/` or `.claude/knowledge/` file was found stale or wrong during this project | Correction | Update the existing file directly, versioned per `learning-loop.md`'s Versioning and Traceability |
| A reasoning approach or decision-tree branch recurred across tasks without being named anywhere yet | New Pattern | `.claude/intelligence/reasoning-patterns.md` or `.claude/intelligence/decision-engine.md`, as appropriate |
| A Coverage Gap, repeated conflict, or repeated escalation recurred | New Gap | Flagged to the user — never self-promoted, exactly as `learning-loop.md` specifies |
| A Kanban-vs-Sprint methodology choice, WIP limit, or checkpoint cadence proved wrong for this project's actual shape | New Pattern (execution-layer-specific) | `planning-engine.md`, `implementation-engine.md`, or `workflow-orchestrator.md`, as appropriate — this layer learns about itself the same way the Intelligence Layer does about domain work |

Before any finding is routed, run `.claude/intelligence/decision-engine.md` Tree 5 (Learning-Loop Eligibility) against it — a finding built on an unresolved `[VALIDATE]` marker, or one that's genuinely client-specific and non-generalizable, doesn't get promoted, exactly as that tree specifies.

## Metrics Review

Retrospective also reviews the project's own numbers against `.claude/intelligence/evaluation-engine.md` and `task-engine.md`:

- Average composite evaluation score across the project's tasks, and its trend over time (improving, flat, degrading).
- Review/Testing bounce-back rate (how many tasks needed more than one pass) — a rising rate is itself a signal worth a New Pattern or Correction finding, not just a number to report.
- Time-in-`Blocked` per sub-state (Dependency / Coverage Gap / Escalation) — a high Coverage Gap rate across a project is a strong New Gap signal.
- Checkpoint pass rate (see `workflow-orchestrator.md`) — how often a phase transition happened cleanly on the first attempt versus needed rework.

## The Continuous Improvement Backlog

Findings that are real but not urgent enough to action immediately (e.g., a New Pattern candidate that needs one more project's evidence before it's confidently generalizable) go onto a standing backlog rather than being dropped. This backlog is itself reviewed at the start of each new project's Discovery (`project-manager.md`) — a pattern seen twice is stronger evidence than a pattern seen once, and the backlog is what lets the system notice the second occurrence.

## Non-Negotiables

- Every project, regardless of size, gets at least one Retrospective before being considered fully closed — skipping it to save time is exactly the kind of "boil the ocean vs. ship and never learn" tradeoff this file exists to prevent.
- No Retrospective finding is promoted into permanent knowledge without passing `.claude/intelligence/decision-engine.md` Tree 5's eligibility check first.
- Retrospective findings are grounded in `documentation-engine.md`'s actual record, not reconstructed from memory of how the project felt.
