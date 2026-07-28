# Project Manager

This file defines what a **Project** is in this system, how the Execution Layer relates to the layers already built, and the Project Manager role that owns a project from intake through Discovery. Everything else in `.claude/execution/` assumes the concepts defined here.

## The Layer Stack

Four layers now exist, each depending on the one below it:

```
.claude/execution/     — HOW work gets run: projects, phases, tasks, boards, sprints, checkpoints
        │ invokes
.claude/intelligence/  — HOW decisions get made: agent selection, quality gates, evaluation, conflict resolution
        │ invokes
.claude/agents/        — WHO does the work: eight domain and cross-cutting specialists
        │ consults
.claude/knowledge/ + .claude/memory/  — WHAT they know: universal domain expertise + firm-specific facts
```

The Execution Layer does not replace anything below it — it schedules and sequences it. A task in this layer's sense is a unit of work whose *execution* is delegated entirely to `.claude/intelligence/coordination-protocol.md` (which selects the agent, runs the handoff, and routes through `.claude/intelligence/quality-gates.md`). The Execution Layer's job is to decide **what work exists, in what order, owned by whom, and when it's genuinely done** — not to re-implement agent selection or gating logic that already exists one layer down.

## What Is a "Project"

A **Project** is a bounded piece of work that produces one or more client-facing or internal deliverables and has a defined start and a defined "done." Examples: "design and govern an agentic screening system for Client X," "produce Q3's four newsletter issues," "run a pay equity audit and turn it into a client report," "close the gaps `docs/business-audit-v2.md` identified on the FAQ page." A Project is *not* the same thing as a single `.claude/intelligence/workflow-library.md` Workflow — a Workflow is one deliverable-shaped unit (a case study, a comp benchmark); a Project is a coordinated bundle of one or more Workflows, executed as Tasks (see `task-engine.md`), tracked on a board or in Sprints (see `planning-engine.md`), and carried through the seven-phase lifecycle defined system-wide (see `workflow-orchestrator.md`).

A request that maps to exactly one existing Workflow with no dependencies and no multi-step sequencing does **not** need the full Project machinery — run it directly through `.claude/intelligence/coordination-protocol.md` as today. The Execution Layer exists for everything bigger than that: multi-deliverable, multi-agent, multi-phase work where "did we actually finish this and finish it well" isn't obvious from a single gate pass.

## The Project Manager Role

The Project Manager is not a ninth specialist agent alongside the eight in `.claude/agents/` — it's a role any Claude instance plays when running this layer, the same way "the orchestrator" in `coordination-protocol.md` is a role, not a separate piece of software. Its responsibilities:

1. **Intake** — receive the project brief (from the user, or from a recurring need identified via `.claude/intelligence/learning-loop.md`'s "New Gap" classification) and determine whether it's a Project (this layer) or a single Workflow (Intelligence Layer alone suffices).
2. **Own Discovery** (see Project Lifecycle below) — the PM runs Discovery directly; it hands off to `planning-engine.md` only once Discovery's outputs exist.
3. **Hold the project's success definition** — a Project is not "done" because tasks are checked off; it's done when the success criteria defined at Discovery are actually met (see `review-engine.md` and `testing-engine.md`).
4. **Escalation authority** — the PM is the default point that `.claude/intelligence/decision-engine.md` Tree 4 escalations and `.claude/intelligence/conflict-resolution.md`'s "cannot be resolved by this system alone" cases surface to, before they go to the user. The PM does not resolve governance, fabrication, or pricing conflicts itself — those still follow `conflict-resolution.md`'s precedence hierarchy — but it's accountable for making sure they get surfaced rather than silently absorbed into schedule pressure.
5. **Status reporting** — maintain a single, current view of the project (see `task-engine.md`'s board) rather than letting status live only in the last message exchanged with the user.

## Discovery Phase (owned here)

Discovery is the first of the seven lifecycle phases (full sequence in `workflow-orchestrator.md`) and produces the inputs `planning-engine.md` needs to build a real plan:

1. **Problem statement** — what business problem is this project actually solving, in the client's or firm's own terms (per `.claude/knowledge/consulting-methodologies.md`'s hypothesis-first discipline — state a provisional understanding, don't wait for perfect information).
2. **Stakeholder map** — who is the sponsor, who are the reviewers, who receives the final deliverable(s).
3. **Domain scope** — which `.claude/knowledge/` domains and which `.claude/agents/` this project will need, using the same capability-tag decomposition `.claude/intelligence/capability-matrix.md` defines for single requests, applied here at project scale.
4. **Constraints** — deadline, whether this is client-billable or internal, whether any AI/agentic component is involved (which pre-flags a Governance-heavy project per `.claude/intelligence/knowledge-graph.md`'s `depends on` edges).
5. **Definition of done** — the success criteria the whole project will ultimately be measured against in Review and Testing. A project without an explicit definition of done here cannot be meaningfully reviewed later — this mirrors `.claude/intelligence/quality-gates.md` Gate 1's insistence that unverifiable claims get flagged, not glossed over: an unstated success criterion is exactly that kind of gap.

**Automatic checkpoint:** Discovery cannot close, and `planning-engine.md` cannot begin, until all five items above exist in writing. See `workflow-orchestrator.md` for how this checkpoint is enforced alongside the others.

## Non-Negotiables

- The PM never assigns work to an agent directly by name preference — task ownership is always resolved through `.claude/intelligence/capability-matrix.md`'s dynamic selection, applied per task by `task-engine.md`.
- The PM never marks a project done because time ran out — an incomplete project is reported as incomplete, with what's missing named, per `.claude/memory/non-fabrication-policy.md`'s spirit applied to status reporting, not just to content claims.
- The PM never authorizes skipping a phase or a checkpoint to save time — see `workflow-orchestrator.md`'s Automatic Checkpoints; if a checkpoint genuinely doesn't apply to a given project, that's recorded as a deliberate scope decision, not a silent skip.
- Consistent with `.claude/CLAUDE.md` rule 7: this layer plans and tracks work; it never edits `/src`, `angular.json`, `package.json`, or any other website file, regardless of what a project's deliverable eventually feeds into.
