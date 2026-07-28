# Review Engine

Owns the fourth lifecycle phase: **Internal Review** — the first checkpoint after a task leaves `In Progress`, before it's subjected to the full validation battery in `testing-engine.md`. Review catches what a single owner agent, close to its own work, is least likely to catch itself.

## Purpose: Why Review Is Separate From Testing

Review is a **peer/specialist sanity check** — is this output coherent, complete against its stated Success Criteria, and not obviously wrong — run by someone other than the task's owner agent. Testing (`testing-engine.md`) is the **formal validation battery** — the full `.claude/intelligence/quality-gates.md` pipeline and `.claude/intelligence/evaluation-engine.md` scoring. Keeping them separate matters because Review is fast and catches gross issues cheaply, before spending the fuller Testing effort on something that isn't ready for it — the same logic as running a linter before a full test suite.

## Who Reviews

Per `.claude/intelligence/evaluation-engine.md`'s "Who Scores" principle (self-scoring alone is insufficient), the reviewer is never the task's owner agent:

| Task's owner agent | Default reviewer |
|---|---|
| `agentic-ai-architect` | `ai-governance-auditor` |
| `ai-governance-auditor` | `agentic-ai-architect` (functional sanity check — does the governance finding actually match what the system does) |
| `people-analytics-analyst` | `workforce-intelligence-strategist` (or vice versa — whichever wasn't the owner) |
| `compensation-benefits-specialist` | `total-rewards-strategist` (or vice versa) |
| `total-rewards-strategist` | `compensation-benefits-specialist` |
| `workforce-intelligence-strategist` | `people-analytics-analyst` |
| `competitive-positioning-analyst` | `client-content-writer` |
| `client-content-writer` | `competitive-positioning-analyst` |

This pairing isn't arbitrary — each reviewer sits adjacent to the owner's domain per `.claude/intelligence/knowledge-graph.md`'s relationship map, close enough to give a substantive check, far enough to not just rubber-stamp shared assumptions.

## The Review Checklist

Every task in `Internal Review` is checked against:

1. **Does the output actually satisfy the task's stated Success Criteria** (from `task-engine.md`'s schema) — not "is it good work" in the abstract, but the specific, checkable criteria set at task creation.
2. **Are all Inputs actually reflected** — did the owner agent use what was handed to it, or drift from the brief?
3. **Is every `[VALIDATE]` marker still present where needed** — a reviewer's job includes confirming no marker was quietly dropped to make the draft read more finished than it is (a specific, common failure mode worth checking for explicitly, per `.claude/memory/non-fabrication-policy.md`).
4. **Does the output correctly apply its domain's `.claude/knowledge/` framework(s)** — this is a lighter-weight version of `.claude/intelligence/quality-gates.md` Gate 2, run here first so Testing isn't the first time a domain error surfaces.
5. **Is anything about this output likely to fail a downstream gate** — the reviewer flags predictable Gate 1/3/4 issues now, before the formal Testing pass, so the owner agent can fix them in one pass rather than bouncing between phases repeatedly.

## Review Outcomes

- **Approve** — task moves to `Testing`.
- **Revise** — task returns to `In Progress` with the reviewer's specific findings attached (never a bare "needs work" — see `.claude/intelligence/quality-gates.md`'s own insistence on naming the lowest-scoring dimension explicitly; the same discipline applies here).
- **Reject** — rare; used when the task's own framing (Objective, Inputs) turns out to have been wrong at the source, in which case this routes back to `planning-engine.md` or `task-engine.md` to fix the task definition itself, not just the output.

## Review SLA

A task should not sit in `Internal Review` indefinitely — in Kanban mode, an unreviewed task blocks the reviewer's own WIP capacity from being fairly assessed (per `implementation-engine.md`'s WIP limits, review capacity should be planned for, not treated as free). In Sprint mode, Review must complete within the same Sprint the task was worked in — a task that can't clear Review before Sprint close is either carried over explicitly (recorded, not silently dropped) or descoped from the Sprint's Done count.

## Escalation From Review

If Review surfaces a genuine cross-agent disagreement (not just a fixable gap, but a real conflict about the right answer), it routes through `.claude/intelligence/conflict-resolution.md`'s precedence hierarchy — Review does not have independent authority to overrule a governance finding or invent a resolution outside that hierarchy; it applies the hierarchy or escalates per `.claude/intelligence/decision-engine.md` Tree 4 if the hierarchy doesn't cleanly resolve it.

## Non-Negotiables

- The reviewer is never the owner agent — no exceptions, even for small tasks, because self-review is precisely the gap this phase exists to close.
- A "Revise" outcome always carries specific, named findings — a task cannot bounce back to `In Progress` with vague feedback the owner agent has to guess at.
- Passing Review is necessary but not sufficient for `Done` — every task still proceeds to `testing-engine.md`'s full battery regardless of how clean Review was.
