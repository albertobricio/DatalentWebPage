# Versioning

`docs/framework-audit.md` §9 flagged that no versioning or changelog convention existed anywhere in `knowledge/`, `intelligence/`, or `execution/` — so "when was this rule last true" was unanswerable from the files themselves. This file establishes that convention, anchored on `registry.yaml` (which now carries `registry_version` and `last_updated` fields) rather than retrofitting version headers into all 65 existing files.

## Versioning Scheme

Semantic versioning (`MAJOR.MINOR.PATCH`), applied to the registry as the whole system's version of record:

- **MAJOR** — a change that breaks existing routing or load assumptions: an agent removed, a capability tag renamed, a layer restructured. Anything that would make an old `registry.yaml` snapshot actively wrong (not just incomplete) about how the system behaves.
- **MINOR** — a new file added and correctly registered (a new agent, command, knowledge domain, or workflow), or a new capability tag introduced. Additive, non-breaking.
- **PATCH** — a correction to an existing entry: fixing a stale `path`, resolving a newly-found contradiction (the way `resolved_conflicts` entries were added), closing an orphan.

`registry.yaml` starts at `1.0.0` — the version at which the Integration Layer first achieved zero orphans and zero unresolved contradictions from `docs/framework-audit.md` (per `validation-map.md`'s "Known Current State").

## What Triggers a Version Bump

| Event | Bump | Where recorded |
|---|---|---|
| New agent, command, knowledge domain, or execution file added and registered | MINOR | `registry.yaml`'s relevant section + this file's Changelog |
| A `docs/framework-audit.md`-style contradiction found and resolved | PATCH | `registry.yaml`'s `resolved_conflicts` + this file's Changelog |
| An orphan found and closed | PATCH | `registry.yaml`'s `orphans_resolved` + this file's Changelog |
| A `.claude/intelligence/learning-loop.md` Correction is promoted into `memory/` or `knowledge/` | PATCH (or MINOR if the correction adds new registrable content) | The promoted file itself (per `learning-loop.md`'s own Versioning and Traceability section) + this file's Changelog |
| A capability tag is renamed or an agent's scope is restructured | MAJOR | `registry.yaml`'s `agents[].primary_tags`/`secondary_tags` + this file's Changelog |

## Changelog

Every version bump gets an entry here — this is the answer to "when was this rule last true" that `docs/framework-audit.md` found missing. Newest first.

```
1.0.0 — 2026-07-02 — Initial Integration Layer.
  - registry.yaml created covering all 65 pre-existing files across
    constitution, agents, commands, memory, templates, knowledge,
    intelligence, and execution.
  - Zero orphans: competitive-battlecard-template.md and the entire
    execution/ layer (both flagged in docs/framework-audit.md §5/§6)
    now have registered consumers/entry points via routing.md.
  - Three contradictions from docs/framework-audit.md §7 resolved in
    registry.yaml's resolved_conflicts section (AI Quality scorer
    assignment, six-gate equivalence claim, testing-engine.md internal
    ordering).
  - Two Coverage Gaps (hr-strategy.md, enterprise-sales.md) and two
    command-less agents (people-analytics-analyst, total-rewards-
    strategist) carried forward from the prior audit as documented,
    unresolved-by-design gaps, not silently fixed or hidden.
```

## Relationship to the Learning Loop

`.claude/intelligence/learning-loop.md` already defines *what* qualifies as a promotable learning and *where* it routes (its Routing Table). This file defines the versioning consequence of that promotion: every successful promotion is a PATCH or MINOR bump, logged in the Changelog above, with a pointer back to the source decision — the same traceability requirement `learning-loop.md` already imposes on the destination file, now also imposed on the registry that tracks it. A promotion that updates `.claude/memory/competitive-landscape.md` (say) but never touches this Changelog is incomplete: the content changed, but the system's own record of *when* and *why* didn't.

## Staleness Review, Versioned

`.claude/intelligence/learning-loop.md`'s staleness-review table names decay risk per file type (high for `competitive-landscape.md` and regulatory content, medium for `service-lines.md`, low for established frameworks). This file adds the versioning consequence: a staleness-review-triggered correction to a high-decay-risk file is always at least a PATCH bump with a Changelog entry naming what changed — a silent correction to `.claude/memory/compliance-glossary.md` (for instance) with no version record would recreate exactly the "unanswerable staleness" problem `docs/framework-audit.md` §9 identified in the first place, just one layer deeper.

## Non-Negotiables

- Every version bump gets a Changelog entry in this file — no bump without a corresponding line explaining what changed and citing its source (an audit finding, a Retrospective, a Correction).
- `registry_version` in `registry.yaml` and the latest entry in this file's Changelog must always agree — if they diverge, that's itself a `validation-map.md` finding (Version Monotonicity) worth fixing before trusting either.
- MAJOR bumps are rare by design — most system growth (new agents, new domains) should be MINOR, additive, and non-breaking, consistent with how every layer in this system has been built so far: additively, without modifying what already worked.
