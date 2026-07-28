# Validation Map

`registry.yaml` is only a single source of truth (requirement 8) if it stays *true*. This file defines what checks the registry's own declarations against reality, so a stale or wrong entry gets caught rather than silently trusted — the same discipline `.claude/memory/non-fabrication-policy.md` demands of client-facing claims, applied here to the framework's claims about itself.

## What Gets Validated

| Check | Rule | Catches |
|---|---|---|
| **Path existence** | Every `path:` field in `registry.yaml` must resolve to a real file in the repository | A registry entry pointing at a renamed or deleted file |
| **ID referential integrity** | Every agent/command/knowledge/etc. `id` referenced in another entry's `loads`, `invokes`, `consumed_by`, or `depends_on` must exist as a real entry elsewhere in `registry.yaml` | A typo'd reference, or a reference to a file that was removed without cleaning up who pointed to it |
| **No new orphans** | Every file in `.claude/` (excluding this `integration/` layer itself) must appear as a target in at least one `loads`, `invokes`, `consumed_by`, or `depends_on` field somewhere in the registry | Reintroducing the exact failure mode `docs/framework-audit.md` §5 found — a file added later with no declared consumer |
| **No dangling `coverage_gap`** | A knowledge file marked `coverage_gap` must have zero agents listed as *primary* consumer across the whole registry, consistent with `.claude/intelligence/knowledge-graph.md`'s own Coverage Gaps section | A knowledge domain claiming "no owner" while an agent has quietly been declared its primary consumer elsewhere — the two must agree |
| **Bidirectional consistency** | If agent A's `loads.knowledge` lists domain K, then K's `consumed_by.agents` must list A, and vice versa | A one-way declaration slipping back in — exactly the failure this whole layer exists to prevent, now checked mechanically rather than trusted by construction |
| **Command/agent invocation symmetry** | If command C's `invokes` names agent A, then A's `invoked_by.commands` must list C (unless A has no dedicated command, in which case its `invoked_by.commands` is explicitly empty with a `note`, not silently absent) | A command that claims to invoke an agent the agent itself doesn't know is one of its entry points |
| **Conflict resolutions reference real findings** | Every entry under `resolved_conflicts` must cite a real section of `docs/framework-audit.md` and name real, existing files as `conflicting_files` | A fabricated or stale "resolution" to a problem that was never actually found or already fixed elsewhere |
| **Version monotonicity** | `registry_version` in `registry.yaml` only increases, never resets or skips backward, per `versioning.md`'s scheme | A registry accidentally reverted to a stale copy |

## When Validation Runs

- **On `bootstrap.md` Step 1** (loading the registry) — a lightweight pass: does the registry parse as valid YAML, and do the specific entries needed for *this* request pass Path Existence and ID Referential Integrity? A full-registry sweep on every single request is unnecessary overhead; targeted validation of what's actually being used is sufficient for normal operation.
- **On any edit to `registry.yaml` itself** — the full table above runs in full. This is the point where an inconsistency is cheapest to catch, before it propagates into a request that trusted a bad entry.
- **On `.claude/execution/continuous-improvement.md`'s Retrospective** (per `learning-loop.md`'s promotion pipeline) — any newly-promoted file (a new agent, a new knowledge domain, a new workflow) must get a `registry.yaml` entry as part of promotion, and that entry is validated in full before the promotion is considered complete. A promotion that adds a file without registering it recreates exactly the orphan problem this layer exists to close — see Non-Negotiables.

## What Happens on a Validation Failure

Per the same escalation discipline as the rest of the system (`.claude/intelligence/decision-engine.md` Tree 4): a validation failure is surfaced, not silently patched around. Specifically:
- A **Path Existence** failure blocks any request that depended on the missing file's Tier 1/2 content (`context-priority.md`) — this is not a "proceed with a gap noted" situation, since it likely means the registry itself is stale enough to not be trustworthy for that entry.
- A **referential integrity** or **bidirectional consistency** failure is logged and the request proceeds using whichever side of the broken pair is more conservative (e.g., if an agent claims to load a knowledge file but the knowledge file doesn't list that agent as a consumer, treat the load as valid but flag the registry for correction — better to over-ground than under-ground while the inconsistency gets fixed).
- A **new orphan** found during a Retrospective-driven promotion blocks the promotion from being marked complete until the new file has a registered consumer or an explicit, deliberate Coverage Gap marker (the same honest-gap pattern already used for `hr-strategy.md` and `enterprise-sales.md`).

## Known Current State

As of this registry's creation, running the table above against `registry.yaml` as written finds:
- **Zero orphans** — every file in the seven prior layers now has at least one declared consumer (the two `docs/framework-audit.md` orphans are explicitly resolved via `orphans_resolved`).
- **Two deliberate Coverage Gaps** (`hr-strategy.md`, `enterprise-sales.md`) — correctly marked, not hidden.
- **Two agents with empty `invoked_by.commands`** (`people-analytics-analyst`, `total-rewards-strategist`) — correctly marked with a `note`, not silently empty; reachable via `routing.md`'s tag-scoring regardless.
- **Three `resolved_conflicts` entries**, each citing a real `docs/framework-audit.md` section.

## Non-Negotiables

- A file added to any `.claude/` layer after this registry's creation is not considered integrated until it has a `registry.yaml` entry that passes every check in the table above — "I added the file" and "I integrated the file" are different claims, and only the second one satisfies this layer's purpose.
- Validation failures are surfaced, never silently resolved by picking whichever interpretation is more convenient in the moment.
- This file's table is itself a declaration subject to the same discipline as everything else — if a new failure mode is found (the way `docs/framework-audit.md` found the original three), add a row here rather than fixing it once and letting the fix go undocumented.
