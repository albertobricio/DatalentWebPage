# Planning Engine

Owns the second lifecycle phase: turning Discovery's outputs (`project-manager.md`) into a real, executable plan — a methodology choice, a milestone breakdown, and an initial task backlog. Planning produces the inputs `task-engine.md` needs to actually create tasks.

## Step 1 — Milestone Breakdown

Apply MECE structuring (`.claude/intelligence/reasoning-patterns.md` Pattern 2) to Discovery's problem statement: break the project into milestones that are mutually exclusive (no overlapping scope) and collectively exhaustive (nothing in the definition-of-done is left uncovered). Each milestone should map to one or more `.claude/intelligence/workflow-library.md` Workflows — if a milestone doesn't map to an existing Workflow, either it decomposes further into ones that do, or it's flagged as needing a new Workflow definition (a `.claude/intelligence/learning-loop.md` "New Pattern" signal, not something Planning invents ad hoc).

## Step 2 — Methodology Selection: Kanban or Sprint

Not every project should run the same way. Apply this decision tree:

1. **Is the full scope known and stable at Discovery, with a hard external deadline** (e.g., a client commitment date, a regulatory deadline like the EU Pay Transparency Directive transposition)?
   - Yes → **Sprint**. Time-boxed iterations create the forcing function a fixed deadline needs.
   - No → continue.
2. **Is this a continuous stream of similar, loosely-related requests rather than one bounded deliverable** (e.g., an ongoing newsletter cadence, an ongoing stream of FAQ entries and comp benchmarks with no single "done")?
   - Yes → **Kanban**. There's no natural iteration boundary; flow-based tracking fits better than artificial sprint boxes.
   - No → continue.
3. **Does the project involve significant uncertainty at Discovery** (scope likely to change as work reveals what's actually needed — common for a first-of-its-kind agentic AI system design)?
   - Yes → **Kanban**, with a checkpoint (see `workflow-orchestrator.md`) to re-evaluate switching to Sprint once scope stabilizes.
   - No → **Sprint** by default, since a stable, bounded scope benefits from the cadence and forced reflection Sprints provide.

A project can switch methodology mid-flight if a checkpoint reveals the original choice no longer fits (e.g., a Kanban-tracked exploratory project stabilizes into a well-scoped deliverable set and converts to Sprint) — record the switch and why, per `documentation-engine.md`.

### Kanban Mode
- Continuous flow, pull-based: an agent (via `task-engine.md`'s owner-agent assignment) pulls the next Ready task when capacity allows, rather than work being pushed on a schedule.
- **WIP limits** apply per owner-agent-role to prevent any one specialist's queue from silently growing unbounded — see `implementation-engine.md` for the enforced limit.
- No fixed iteration boundary; checkpoints are triggered by board state (e.g., every N tasks completed) rather than by calendar.
- Best fit: newsletter cadence, ongoing FAQ/comp-benchmark requests, maintenance-style work on an already-shipped agentic system.

### Sprint Mode
- Time-boxed iterations (a Sprint length is set at Planning — default 2 weeks unless the project's deadline dictates otherwise).
- **Sprint Planning** — at the start of each Sprint, pull a bounded set of tasks from the backlog sized to the team's (agents') realistic throughput; a Sprint's task set is locked once planning closes, per the fixed-scope logic that makes Sprints useful — new work identified mid-sprint goes to the backlog for the next Sprint, not injected ad hoc (unless it's a Gate 1/Gate 3 failure requiring rework of already-committed work, which takes priority over new scope by definition).
- **Sprint Review** — held at Sprint close; this is not the same as `review-engine.md`'s per-deliverable review, but a rollup: which tasks reached Done, which didn't, and why.
- **Sprint Retrospective** — feeds directly into `continuous-improvement.md` and, from there, `.claude/intelligence/learning-loop.md`.
- Best fit: a bounded, deadline-driven project like an agentic AI system launch or a multi-part client proposal-to-delivery engagement.

## Step 3 — Initial Task Backlog Generation

For each milestone from Step 1, generate the initial set of tasks using `task-engine.md`'s schema. At Planning time, every task needs at minimum: objective, the Workflow(s) it invokes, and its known dependencies on other tasks or milestones (per `.claude/intelligence/knowledge-graph.md`'s `depends on` edges — e.g., any task tagged `agentic-design` generates an implicit dependent governance-review task before it can close, per `.claude/intelligence/coordination-protocol.md` Step 5's mandatory-inclusion rule). Owner-agent assignment can be deferred to task creation time (`task-engine.md` resolves it dynamically) rather than fixed at Planning — Planning defines *what* work exists and its sequencing constraints, not *who* does it, keeping with the system-wide rule against fixed routing.

## Step 4 — Capacity and Risk Check

Before Planning closes:
- **Capacity check** — does the task backlog imply more parallel work in any single owner-agent's domain than the WIP limit (Kanban) or realistic Sprint throughput (Sprint) allows? If so, resequence or flag the timeline as at risk — don't silently overcommit.
- **Coverage check** — does any task's required capability tag hit a Coverage Gap per `.claude/intelligence/capability-matrix.md`? If so, surface it now, at Planning, not mid-Implementation when it's more expensive to resolve.
- **Governance check** — does the project touch `agentic-design`, `bias-audit`, or `governance-classification` anywhere in the backlog? If so, flag the project as Governance-heavy — this changes checkpoint frequency in `workflow-orchestrator.md` and review depth in `review-engine.md`.

**Automatic checkpoint:** Planning cannot close, and Implementation cannot begin, until the task backlog exists with dependencies mapped, a methodology is chosen, and the capacity/coverage/governance checks above have been run and any flags recorded — not silently resolved by assumption.

## Non-Negotiables

- Methodology (Kanban vs. Sprint) is chosen by the decision tree above, not by default habit or by whichever the previous project used.
- A milestone that doesn't map to an existing or clearly-specifiable Workflow doesn't get force-fit into one — it's flagged, per `.claude/intelligence/decision-engine.md` Tree 1's Coverage Gap handling.
- Planning never fixes an owner agent to a task by name preference — see `task-engine.md` for the dynamic assignment mechanism this hands off to.
