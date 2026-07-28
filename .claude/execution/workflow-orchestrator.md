# Workflow Orchestrator

This is the capstone file of the Execution Layer — it sequences the seven lifecycle phases end to end, defines every automatic checkpoint between them, operationalizes Kanban and Sprint cadence at the project level, and states explicitly how this layer integrates with the Intelligence Layer and the Learning Loop. Where `.claude/intelligence/coordination-protocol.md` orchestrates a *single request* across agents, this file orchestrates a *whole project* across phases — the two operate at different altitudes and both are needed for this system to "execute complete projects," as required.

## The Seven-Phase Lifecycle

```
Discovery ──▶ Planning ──▶ Implementation ──▶ Review ──▶ Testing ──▶ Release ──▶ Retrospective
   │              │               │               │           │          │             │
project-      planning-      implementation-   review-    testing-   release-   continuous-
manager.md    engine.md      engine.md         engine.md  engine.md  engine.md  improvement.md
                                    ▲───────────────┘
                              (per-task loop: Implementation ⇄ Review ⇄ Testing
                               runs once per task before the project as a whole
                               advances to Release)
```

Each arrow is an **automatic checkpoint** (full list below) — the project cannot advance to the next phase until the checkpoint's conditions are verifiably met, per the owning engine's own file. This file doesn't restate each engine's internal logic; it defines the checkpoints *between* them and the cadence that governs how often the whole loop runs.

## Automatic Checkpoints — Master List

| # | Checkpoint | Between | Enforced by | Cannot proceed until |
|---|---|---|---|---|
| 1 | Discovery Complete | Discovery → Planning | `project-manager.md` | Problem statement, stakeholder map, domain scope, constraints, and definition of done all exist in writing |
| 2 | Plan Complete | Planning → Implementation | `planning-engine.md` | Methodology chosen (Kanban/Sprint), task backlog exists with dependencies mapped, capacity/coverage/governance checks run |
| 3 | Task Ready | Backlog → Ready (per task, continuous) | `task-engine.md` | All seven schema fields filled, dependencies actually satisfied, owner agent resolved (not force-assigned) |
| 4 | Task Reviewed | Internal Review → Testing (per task) | `review-engine.md` | Reviewer (never the owner agent) returns Approve |
| 5 | Task Tested | Testing → Done (per task) | `testing-engine.md` | Full five-test battery passes, composite ≥ 3.5, no hard-gate failure |
| 6 | Sprint/Cadence Boundary | Within Implementation, recurring | `planning-engine.md` + `continuous-improvement.md` | Sprint Review completed (Sprint mode) or N-task/calendar trigger reached (Kanban mode) |
| 7 | Release Readiness | Implementation+Review+Testing complete → Release | `release-engine.md` | All five items in the Release Readiness Checklist confirmed against actual records |
| 8 | Human Sign-Off | Release, before actual send/publish | `release-engine.md` | A human has made the final send/publish decision — this checkpoint never auto-clears |
| 9 | Retrospective Complete | Release → project closed | `continuous-improvement.md` | Four-question retro run, findings classified and routed per the Learning Loop table |

**A checkpoint is never skipped to save time.** If a checkpoint genuinely doesn't apply to a given project (e.g., Checkpoint 6 in a single-Sprint project with no internal boundary), that's recorded as a deliberate scope decision at Planning, not a silent bypass — this mirrors `project-manager.md`'s own non-negotiable on this exact point.

## Kanban and Sprint, Operationalized

`planning-engine.md` chooses the methodology; this file defines how it actually drives the phase loop:

### Sprint Mode
- Planning locks a bounded task set at the start of each Sprint.
- The per-task loop (Implementation ⇄ Review ⇄ Testing) runs continuously *within* the Sprint for every task in that set.
- **Checkpoint 6 fires at Sprint close**: Sprint Review (rollup of what reached Done) then Sprint Retrospective (feeding `continuous-improvement.md`), before the next Sprint's Planning begins.
- Release (Checkpoint 7–8) can happen at the end of any Sprint where enough milestones are complete, or only at the project's final Sprint — decided at Planning based on whether the client/stakeholder wants incremental delivery.

### Kanban Mode
- No locked task set — tasks flow continuously from Backlog through Ready, pulled per `implementation-engine.md`'s WIP-limited pull model.
- **Checkpoint 6 fires on the N-task or calendar trigger** set at Planning (default: every 10 tasks reaching Done, or monthly, whichever comes first) rather than a Sprint boundary.
- Release can happen continuously (each milestone releases as it's ready — common for an ongoing newsletter/FAQ stream) or at a defined stream-end, per the project's actual shape from Discovery.

A project can switch modes mid-flight per `planning-engine.md`'s own provision — when that happens, Checkpoint 6 is re-triggered immediately as a transition retrospective, regardless of where the prior cadence stood.

## Integration With the Intelligence Layer

This layer does not duplicate the Intelligence Layer — it calls it, at specific, defined points:

- **Agent selection** — every task's Owner Agent field (`task-engine.md`) is resolved by `.claude/intelligence/capability-matrix.md`'s Dynamic Selection Algorithm, never by this layer's own judgment.
- **Multi-agent execution** — every task requiring more than one agent runs through `.claude/intelligence/coordination-protocol.md` in full (Steps 1–9), invoked by `implementation-engine.md`'s Execution Loop.
- **Validation** — `testing-engine.md`'s battery *is* `.claude/intelligence/quality-gates.md`'s six gates, run formally as a phase rather than informally per-output; `.claude/intelligence/evaluation-engine.md`'s eight-dimension scoring is the composite check at Checkpoint 5.
- **Decision-making** — every blocked task, escalation, or ambiguous methodology call in this layer routes through `.claude/intelligence/decision-engine.md`'s five trees rather than this layer inventing parallel logic.
- **Conflict resolution** — any disagreement surfaced during Review, Testing, or Release follows `.claude/intelligence/conflict-resolution.md`'s precedence hierarchy exactly; this layer has no independent authority to resolve a governance veto or a fabrication conflict.
- **Domain grounding** — every task's actual work draws on `.claude/knowledge/` and `.claude/memory/` exactly as it would for a single ungrouped request; the Execution Layer changes *how work is sequenced and tracked*, never *what a competent answer looks like*.

## Integration With the Learning Loop

Two integration points, one continuous and one phase-bound:

- **Continuous:** `documentation-engine.md`'s Decision Log and Test Records accumulate throughout the project specifically so they're available as `.claude/intelligence/learning-loop.md` source material later — this layer doesn't wait until Retrospective to start capturing what's learnable, only to *classify and route* it.
- **Phase-bound:** `continuous-improvement.md`'s Retrospective (Checkpoint 9) is the formal point where accumulated findings are run through `.claude/intelligence/decision-engine.md` Tree 5 (eligibility) and `.claude/intelligence/learning-loop.md`'s classification (Correction / Confirmation / New Pattern / New Gap) and routed to their destination file. A project is not considered fully closed until this has happened — Release (Checkpoint 7–8) closes the deliverable; Retrospective (Checkpoint 9) closes the project's contribution to the system's own improvement.

## Running a Complete Project — Summary Flow

1. Intake (`project-manager.md`) → is this a Project or a single Workflow? If single Workflow, exit to `.claude/intelligence/coordination-protocol.md` directly.
2. Discovery (`project-manager.md`) → Checkpoint 1.
3. Planning (`planning-engine.md`) → Checkpoint 2.
4. For each task: Ready (Checkpoint 3) → Implementation (`implementation-engine.md`) → Review (Checkpoint 4) → Testing (Checkpoint 5) → Done.
5. Cadence boundary recurs per methodology (Checkpoint 6) throughout step 4.
6. Once all in-scope tasks are Done: Release Readiness (Checkpoint 7) → Human Sign-Off (Checkpoint 8).
7. Retrospective (`continuous-improvement.md`) → Checkpoint 9 → findings routed to `.claude/intelligence/learning-loop.md`.
8. Project closed.

## Non-Negotiables

- No phase transition happens without its checkpoint being verifiably satisfied — "verifiably" means against `documentation-engine.md`'s actual records, never against confidence alone.
- This layer never edits website files at any point in the lifecycle — Release Engine's Website Content Handoff Package type is the closest this system comes to website output, and it explicitly stops at a handoff package, never a direct edit, per `.claude/CLAUDE.md` rule 7 and this Execution Layer's own governing rule 8.
- Every project, run to completion, leaves the system measurably smarter than it started — if a project closes without a single Learning Loop-eligible finding, that's itself worth checking: either the project was trivial, or the Retrospective wasn't run with enough rigor.
