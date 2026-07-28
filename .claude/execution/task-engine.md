# Task Engine

Defines the atomic unit of execution in this system: the **Task**. Every task, in every project, in either Kanban or Sprint mode, must carry all seven fields below — a task missing any of them is not yet a task, it's a note.

## The Task Schema

```
TASK: [short imperative title]

Objective:        [the specific outcome this task produces — one sentence, falsifiable]
Dependencies:      [task IDs or milestones that must reach Done first; "none" if truly independent]
Owner Agent:       [resolved via the Dynamic Selection Algorithm — capability-matrix.md]
Inputs:            [what this task consumes — prior task outputs, source material, data]
Outputs:           [the concrete artifact(s) this task produces]
Success Criteria:  [how "done" is verified — must be checkable, not a feeling]
Validation:        [which quality-gates.md gates apply, and who runs them]
```

Each field's discipline, explained:

- **Objective** — must be specific enough that two different agents reading it would produce comparably-scoped output. "Work on the comp benchmark" is not an objective; "produce a sourced P25/P50/P75 benchmark for [role] in [market], per `.claude/knowledge/compensation-total-rewards.md`'s 3-statistic method" is.
- **Dependencies** — expressed as task IDs, plus a note on *why* (usually a `depends on` edge from `.claude/intelligence/knowledge-graph.md`, e.g., a `client-content-writer` drafting task depends on the specialist analysis task it draws from, per `.claude/agents/client-content-writer.md`'s own non-negotiables). A task with a false "none" here is the most common way projects silently break — see Non-Negotiables.
- **Owner Agent** — never hand-picked. Resolved by running the task's required capability tag(s) through `.claude/intelligence/capability-matrix.md`'s Dynamic Selection Algorithm at task-creation time. If the algorithm returns a Coverage Gap, the task is created in a `Blocked — Coverage Gap` state (see Board States) rather than force-assigned.
- **Inputs** — explicit enough that the owner agent never has to guess what it's working from. If an input is another task's output, name that task; if it's external material, name what's expected and flag if it hasn't arrived yet.
- **Outputs** — the literal artifact (a governance brief, a benchmark table, a drafted section of a proposal) — not a vague description of effort.
- **Success Criteria** — must be checkable independent of the owner agent's own opinion; this is what `review-engine.md` and `testing-engine.md` actually check against. Where a criterion depends on a number or fact that isn't yet verified, it's written as "matches `[VALIDATE]`-resolved figure," never left implicit.
- **Validation** — names which of the six `.claude/intelligence/quality-gates.md` gates apply to this specific task (using the same applicability logic as `.claude/intelligence/decision-engine.md` Tree 3) and which agent runs each, per `.claude/intelligence/evaluation-engine.md`'s "Who Scores" rules.

## Board States (Kanban and Sprint both use this state model)

```
Backlog → Ready → In Progress → Internal Review → Testing → Done
                      │                                 │
                      └──────────── Blocked ─────────────┘
                                       │
                          (Blocked — Dependency | Blocked — Coverage Gap | Blocked — Escalation)
```

- **Backlog** — exists, not yet sequenced for pickup.
- **Ready** — all dependencies satisfied, owner agent resolved, inputs available. A task cannot enter Ready with an unresolved dependency regardless of schedule pressure.
- **In Progress** — owner agent actively executing, per `implementation-engine.md`.
- **Blocked** — halted, with a required sub-state naming *why* (Dependency = waiting on another task; Coverage Gap = per `capability-matrix.md`; Escalation = routed per `.claude/intelligence/decision-engine.md` Tree 4 or `.claude/intelligence/conflict-resolution.md`). A task never sits in a generic "stuck" state with no reason recorded.
- **Internal Review** — `review-engine.md`'s phase; peer/specialist check before formal testing.
- **Testing** — `testing-engine.md`'s phase; the full validation battery including `.claude/intelligence/quality-gates.md`.
- **Done** — every applicable gate passed, success criteria verifiably met. A task cannot be marked Done with an open `[VALIDATE]` marker in its output unless the success criteria explicitly accepted a flagged gap as acceptable at this stage (rare, and must be stated, not assumed).

## Dependency Management

Dependencies come from two sources, and a task should record which:

1. **Structural dependencies** — from `.claude/intelligence/knowledge-graph.md`'s `depends on` edges (e.g., any task producing agentic AI design output structurally depends on a governance-review task, whether or not the project brief mentioned governance explicitly).
2. **Sequencing dependencies** — from `planning-engine.md`'s milestone breakdown (task B needs task A's output as raw material, independent of any cross-domain structural rule).

A task with unmet dependencies cannot enter Ready (see Board States). This is enforced at the board level, not left to the owner agent's judgment — an agent should never be handed a task whose inputs don't actually exist yet.

## Owner Agent Assignment — Worked Example

A task titled "Classify the risk tier of the new candidate-screening agent" decomposes to capability tag `governance-classification`. Per `.claude/intelligence/capability-matrix.md`, `ai-governance-auditor` scores primary (2) on this tag and no other agent scores above 0 for it — single-agent assignment, no ambiguity. A task titled "Draft the proposal's approach section" decomposes to `content-drafting` (primary: `client-content-writer`) but also implicitly needs the domain substance behind it — per the matrix's own guidance, this generates a Dependency on whichever specialist task produced that substance, not a direct assignment of the domain work to `client-content-writer` itself.

## Task Granularity

A task should be sized to complete within one pass through Implementation → Review → Testing without itself needing to be split mid-flight. If, once In Progress, an owner agent finds the task is actually two distinct deliverables, split it — don't force a single Done checkbox over two unrelated success criteria. This mirrors `.claude/knowledge/consulting-methodologies.md`'s anti-pattern warning against "boil the ocean" scoping, applied at task level instead of project level.

## Non-Negotiables

- No task exists without all seven schema fields filled — a task with "Dependencies: none" that actually has an implicit structural dependency (per `knowledge-graph.md`) is a defect in the task, not an acceptable shortcut.
- Owner Agent is always resolved via `capability-matrix.md`'s scoring, never assigned by habit, availability, or the PM's preference — consistent with `project-manager.md`'s own non-negotiables.
- A task cannot skip Internal Review or Testing states to reach Done faster — see `workflow-orchestrator.md`'s Automatic Checkpoints for how this is enforced at the phase level, not just the task level.
