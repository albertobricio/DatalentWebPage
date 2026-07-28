# Implementation Engine

Owns the third lifecycle phase: actually executing tasks that have reached the `Ready` state in `task-engine.md`'s board model. Implementation is where `.claude/intelligence/coordination-protocol.md` gets invoked for real, once per task.

## The Execution Loop

For each task pulled into `In Progress`:

1. **Confirm readiness** — re-verify the task's Dependencies are actually satisfied (not just marked so) and Inputs are actually present. If not, return the task to `Blocked — Dependency` rather than starting on incomplete material.
2. **Invoke the owner agent** via `.claude/intelligence/coordination-protocol.md` Steps 5–7 (mandatory collaboration rules, handoff format, aggregation) — Implementation does not reinvent agent invocation; it calls the Intelligence Layer's existing protocol per task.
3. **Apply the relevant reasoning patterns** — the owner agent applies `.claude/intelligence/reasoning-patterns.md` as normal; Implementation's job is to make sure the task's framing (objective, inputs, success criteria) gives the agent what it needs to apply them, not to override the agent's own reasoning.
4. **Produce the Output** exactly as scoped in the task's Outputs field — no silent scope expansion ("while I was at it, I also...") without creating a new task for the additional work, per `task-engine.md`'s granularity discipline.
5. **Move to `Internal Review`** once the owner agent considers the output complete against its Success Criteria — Implementation does not self-certify Done; that requires passing `review-engine.md` and `testing-engine.md` first.

## Pull, Not Push

Kanban and Sprint tasks both move to `In Progress` by being *pulled* by capacity, not pushed onto an agent regardless of its current load:

- **Kanban mode:** a task can only be pulled into `In Progress` if the owner agent's role is under its WIP limit (see below). If at limit, the task stays `Ready` until capacity frees up — this is deliberate backpressure, not a bug; an agent-role with unlimited concurrent `In Progress` tasks produces shallower work across all of them.
- **Sprint mode:** the Sprint's locked task set (from `planning-engine.md`) defines what's eligible to pull; within that set, the same WIP discipline applies per agent-role.

### WIP Limits (default, per owner-agent-role, per project)

| Owner agent role | Default concurrent `In Progress` limit |
|---|---|
| `agentic-ai-architect` | 2 |
| `ai-governance-auditor` | 2 (governance review is inherently serial — see Non-Negotiables) |
| `people-analytics-analyst` | 2 |
| `compensation-benefits-specialist` | 2 |
| `total-rewards-strategist` | 2 |
| `workforce-intelligence-strategist` | 2 |
| `competitive-positioning-analyst` | 3 (review-type work is typically faster per task than origination) |
| `client-content-writer` | 3 |

These defaults can be adjusted per project at Planning if capacity analysis (`planning-engine.md` Step 4) shows they're wrong for the project's actual shape — but the adjustment is recorded, not silently ignored mid-project.

## Handoffs During Implementation

When a task's execution requires a sequential multi-agent handoff (per `.claude/intelligence/coordination-protocol.md` Step 4's dependency-driven sequencing), the handoff uses the exact structured format defined there — `FROM / TO / DELIVERABLE SO FAR / OPEN QUESTIONS / WHAT'S NEEDED`. Implementation's added responsibility: log the handoff against the task record (see `documentation-engine.md`) so a stalled or reassigned task doesn't lose context.

## Blocked-Task Handling

A task enters `Blocked` (with its required sub-state) whenever:
- A dependency it needs turns out not to actually be satisfied (`Blocked — Dependency`) — return it, don't attempt to work around the gap with an assumption (that would violate `.claude/intelligence/reasoning-patterns.md` Pattern 7, Escalation Reasoning).
- The owner-agent resolution hits a Coverage Gap mid-task, e.g., scope turned out broader than Planning anticipated (`Blocked — Coverage Gap`).
- The owner agent hits a question requiring escalation per `.claude/intelligence/decision-engine.md` Tree 4 or a conflict per `.claude/intelligence/conflict-resolution.md` (`Blocked — Escalation`).

A blocked task is surfaced at the next checkpoint (see `workflow-orchestrator.md`) — it does not sit silently; Kanban's continuous-flow nature especially means a blocked task needs an active owner (the PM, per `project-manager.md`) chasing resolution, not just a status label.

## Non-Negotiables

- `ai-governance-auditor`'s WIP limit of 2 is a floor, not a target to raise for throughput — governance review quality degrades faster under parallel load than most other roles, given the stakes `.claude/intelligence/quality-gates.md` Gate 3 assigns it (a hard gate).
- No task moves from `In Progress` directly to `Done` — it always passes through `Internal Review` and `Testing` first, per `task-engine.md`'s board model; Implementation cannot self-certify completion.
- Scope discovered mid-task that exceeds the task's original Objective becomes a new task (routed back through `task-engine.md`'s schema and `capability-matrix.md`'s assignment), not an informal expansion of the current one.
