# Context Priority

`docs/framework-audit.md` §8 flagged a real constraint: the system is ~46,000 words across 65 files, and nothing forces a complete read of all of it on every request — reliability scales with how much of the corpus a given session actually applies, not with how completely it's written. This file is the answer: an explicit priority order so that when context is limited (which is always, to some degree), what gets dropped is chosen deliberately rather than by accident of read order.

## The Four Tiers

### Tier 1 — Mandatory, Always, Full Text
Never summarized, never skipped, regardless of request size or type:
- `.claude/memory/non-fabrication-policy.md`
- `.claude/integration/registry.yaml` (at minimum, the entry for whatever's being invoked)
- `.claude/CLAUDE.md` (the constitution's operating rules section specifically)

These three are load-bearing for every single output the system produces — dropping any of them isn't a context-saving trade-off, it's a correctness failure. `.claude/intelligence/quality-gates.md` Gate 1 and Gate 3 both trace directly back to Tier 1 content; skipping it doesn't just weaken an output, it invalidates the gates meant to catch that output if it goes wrong.

### Tier 2 — Mandatory for Matching Scope, Full Text
Loaded in full whenever the request's capability tags or deliverable type match, per `routing.md`'s resolution:
- The target agent's full `registry.yaml` `loads.memory` and `loads.intelligence` lists.
- Any knowledge file where the agent is the **primary** consumer per `registry.yaml`'s `knowledge[].consumed_by`.
- The applicable `.claude/intelligence/quality-gates.md` gates and `.claude/intelligence/evaluation-engine.md` dimensions for the deliverable type, per `.claude/intelligence/decision-engine.md` Tree 3.

### Tier 3 — Load on Demand, Section-Level
Not loaded by default; loaded only when the specific judgment call requires it, and even then only the relevant section (per `resource-loader.md`'s knowledge-file section-jumping guidance):
- Knowledge files where the agent is a **secondary** consumer only.
- `.claude/knowledge/*.md` sections beyond Frameworks/Decision Trees (Future Trends, References to Standards) unless the request specifically concerns forward-looking strategy or standards compliance.
- `.claude/execution/*.md` files, unless `routing.md`'s Project-Scale Detection has fired — for a single-request workflow, the entire execution layer is Tier 4 (see below), not Tier 3.

### Tier 4 — Reference Only, Not Loaded Unless Explicitly Needed
- `docs/*.md` (the original website/business audits) — these ground `.claude/memory/`'s own claims but aren't re-read on every request; they're the *source* memory was built from, consulted only when memory itself is being revised (`.claude/intelligence/learning-loop.md`'s Correction pathway).
- `.claude/templates/*.md` for deliverable types other than the one currently being produced.
- `.claude/execution/*.md`, for any request `routing.md` determined is single-workflow scope, not project scope.

## Priority Under Genuine Context Pressure

If a session genuinely cannot hold everything Tier 1 + Tier 2 would imply (a very large multi-agent project-scale request, for instance), the drop order is the reverse of the tier list — Tier 4 drops first, then Tier 3, then the *non-agent-specific* portions of Tier 2 (e.g., a secondary-domain knowledge file within Tier 2's scope drops before a primary one). **Tier 1 never drops.** If honoring Tier 1 alone would already exceed available context (which should not happen given its size — three short, focused files), that's a signal to split the request into smaller pieces via `.claude/execution/task-engine.md`'s granularity discipline, not a signal to compromise Tier 1.

## Interaction With Gate Enforcement

`.claude/intelligence/quality-gates.md`'s two hard gates (Evidence, Governance) are exactly Tier 1 and Tier 2's content made operational. This is deliberate: the priority tiers here aren't just about efficiency, they're a ranking of *what the gates actually check*. A session that under-loads Tier 1/2 content isn't just working with less context — it's working with less of the exact material the hard gates test against, which means a gate "pass" under those conditions is unreliable in the specific way `docs/framework-audit.md` §8 warned about (the gap between "the rule exists" and "the rule is reliably followed").

## Non-Negotiables

- Tier 1 is loaded in full for every request without exception — there is no request small enough to justify skipping it.
- Tier assignment is determined by `registry.yaml`'s `consumed_by`/`loads` fields (primary vs. secondary), never by guessing what "feels" relevant — this keeps priority decisions traceable to the same single source of truth everything else in this layer uses.
- When forced to drop content under genuine pressure, the drop is logged (per `.claude/execution/documentation-engine.md`'s Decision Log, when running inside a tracked project) so a later reviewer can see what grounding was missing, not just that an output exists.
