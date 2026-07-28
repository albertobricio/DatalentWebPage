# Release Engine

Owns the sixth lifecycle phase: **Release** — the controlled handoff of a completed, tested project (or milestone within it) to whoever receives it. Release is deliberately the most restrained engine in this layer: its default action is to prepare and checklist, never to autonomously publish or send.

## Release Readiness Checklist

A project or milestone cannot enter Release until every item below is true, verified against the actual records in `documentation-engine.md` — not asserted from memory:

1. **Every task in scope has reached `Done`** per `task-engine.md`'s board model (passed Review and Testing, not just Implementation).
2. **The Validation Marker Ledger has no unresolved `[VALIDATE]` marker**, unless a marker is explicitly accepted as a disclosed, known gap — in which case it's carried forward *visibly* into the released deliverable, not silently dropped (per `.claude/memory/non-fabrication-policy.md`: an unresolved gap flagged is honest; an unresolved gap hidden is not).
3. **Definition of Done from Discovery is actually met** (`project-manager.md`) — not just "tasks are checked off," but the original problem statement's success criteria are satisfiable by what was produced.
4. **All applicable `.claude/intelligence/quality-gates.md` gates passed** across every deliverable in scope, with composite scores at or above threshold per `.claude/intelligence/evaluation-engine.md`.
5. **Any Governance-heavy project has current technical documentation** per `documentation-engine.md`'s Governance-Specific Documentation section — this cannot be backfilled after release.

**Automatic checkpoint:** Release cannot begin until all five are confirmed true and recorded — this is enforced the same way Discovery→Planning and Planning→Implementation checkpoints are (see `workflow-orchestrator.md`).

## Release Types

Not every release is "publish to the world" — this system produces several distinct release types, each with a different destination and different residual obligation:

| Release type | Destination | What Release Engine actually does |
|---|---|---|
| **Client delivery** | The client, directly | Package the deliverable(s) with the release readiness checklist confirmed; hand to the user for actual sending — this system never sends client communications autonomously. |
| **Internal knowledge promotion** | `.claude/memory/` or `.claude/knowledge/` | Route to `.claude/intelligence/learning-loop.md`'s promotion pipeline via `continuous-improvement.md` — this is a Release type specifically because a promoted learning is now "live" and shaping future work, the same weight as shipping to a client. |
| **Website content handoff package** | The user, for manual publication | Per `.claude/intelligence/workflow-library.md`'s "Website Content Handoff Package" workflow — produces the package and an explicit note that this requires manual publication. **Never** touches `/src` or any website file directly, per `.claude/CLAUDE.md` rule 7 and this layer's own governing rule 8. |
| **Governance artifact filing** | Project/firm compliance record | The governance brief and technical documentation become part of the permanent project record (`documentation-engine.md`), retained for the same reason `.claude/knowledge/eu-ai-act.md` requires ongoing conformity evidence, not just a point-in-time check. |

## What Release Engine Never Does

- **Never sends or publishes anything autonomously.** Every release type above ends with a human decision point — this matches `.claude/intelligence/quality-gates.md`'s own definition of "delivery" (ready for a human decision, not an autonomous action) and `.claude/CLAUDE.md` rule 7's absolute prohibition on touching website files.
- **Never releases a project with a known hard-gate failure "just this once."** Non-Fabrication and Governance failures (per `testing-engine.md` and `.claude/intelligence/evaluation-engine.md`) block release exactly as they block any single output — a project deadline is never sufficient justification to override a hard gate; if the deadline and the gate genuinely conflict, that's a `.claude/intelligence/decision-engine.md` Tree 4 escalation, not a Release Engine override.
- **Never treats a partial delivery as a full one without saying so.** If only some milestones are ready, Release Engine packages what's ready and explicitly states what isn't, rather than presenting a partial result as complete.

## Versioning

Each release is a discrete, numbered version tied to the project record — if a released deliverable is later revised (e.g., following a `.claude/intelligence/conflict-resolution.md`-driven correction discovered post-release), the revision is a new version with a note on what changed and why, following the same discipline `.claude/intelligence/learning-loop.md` requires for updates to promoted knowledge. A released deliverable is never silently swapped for a corrected one without a record of the correction.

## Release Notes

Every release includes a short, factual summary: what's included, what (if anything) is a disclosed known gap, and — for internal knowledge promotions specifically — which `.claude/memory/` or `.claude/knowledge/` files were updated and why, feeding directly into `continuous-improvement.md`'s retrospective input.

## Non-Negotiables

- The Release Readiness Checklist is run against actual records, never against the releasing agent's confidence that the records probably check out.
- A hard-gate failure blocks release with no override path within this engine's own authority — only escalation per `conflict-resolution.md`'s "cannot be resolved by this system alone" list can move it forward, and that still requires a human decision.
- Every release, of every type, ends with a human in the loop before anything actually reaches its destination.
