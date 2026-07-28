# Context Loader

`bootstrap.md` Step 6 says "load the agent's full registered load set." This file defines *how* that actually happens — ordering, deduplication, and what to do when something in the set can't be loaded. Where `bootstrap.md` is the sequence of *phases*, this file is the mechanics of the one phase (context assembly) that does the heaviest lifting.

## Assembly Order

Load in this order, not registry-declaration order (YAML array order in `registry.yaml` is not meaningful — it's alphabetical/logical grouping, not a load sequence):

1. **Constitution** — `.claude/CLAUDE.md` (already loaded by `bootstrap.md` Step 2; not reloaded).
2. **Mandatory-always memory** — per `.claude/integration/context-priority.md` Tier 1, regardless of the specific agent.
3. **Agent-specific memory** — the rest of the target agent's `registry.yaml` `loads.memory` list.
4. **Knowledge** — the target agent's `loads.knowledge` list, in the order registry.yaml lists them (primary domain first, secondary domains after — this ordering is preserved from `.claude/intelligence/capability-matrix.md`'s own primary/secondary distinction).
5. **Intelligence** — the target agent's `loads.intelligence` list.
6. **Templates** — only if the request is producing a deliverable type that uses one (per `registry.yaml`'s `commands[].uses_templates`, not the agent's own template list, since a given agent may support several deliverable types with different templates — `client-content-writer` is the clearest case, with four templates registered but only one relevant to any single request).

This order is deliberate: firm-specific grounding (memory) before universal domain expertise (knowledge) before orchestration rules (intelligence) — an agent should know *who Datalent is* before *what the field knows* before *how the system wants it to behave*, mirroring `.claude/knowledge/README.md`'s own framing of memory vs. knowledge.

## Deduplication

In a multi-agent request (per `.claude/intelligence/coordination-protocol.md` Step 4's sequential/parallel split), several agents typically share load-set entries — every agent's `registry.yaml` entry includes `capability-matrix`, `coordination-protocol`, `quality-gates`, and `reasoning-patterns` in its `intelligence` list, and `non-fabrication-policy` is mandatory for all. Load each shared file **once** for the whole request, not once per agent — `bootstrap.md`'s Idempotency section already establishes this at the phase level; this is the file-level mechanic that makes it concrete. Track what's already been loaded in the current request's context and skip re-loading an identical path.

## Handling a Missing or Broken Load Target

If a file listed in an agent's `registry.yaml` load set doesn't actually exist at the declared path (a stale registry entry — see `.claude/integration/validation-map.md`), don't silently skip it and proceed as if the agent has everything it needs. Flag the gap explicitly in the working output ("this response is missing grounding from `[path]`, which the registry declares as required but which could not be loaded") rather than letting the agent produce output that looks fully-grounded but isn't. This mirrors `.claude/memory/non-fabrication-policy.md`'s own logic applied to the loading mechanism itself: an unverified/unavailable input should be disclosed, not papered over.

## Partial Loading for Narrow Requests

Not every request needs an agent's full registered set loaded in full detail. A narrow, well-scoped request (e.g., a single comp-benchmark figure lookup) doesn't require re-reading all of `.claude/knowledge/compensation-total-rewards.md`'s ten sections if only its Frameworks and KPIs sections are relevant — `.claude/integration/context-priority.md` governs this trade-off (what's mandatory in full vs. summarizable vs. skippable for a given request shape). Context Loader's job is to apply that priority ruling, not to always force a maximal load regardless of request size.

## What Gets Handed to the Agent

The assembled context is not just a concatenation of file contents — it's organized into the same four tiers as the Assembly Order above, with a short header noting which `registry.yaml` entry justified each inclusion (so the agent, and anyone reviewing its output later via `.claude/execution/documentation-engine.md`'s Decision Log, can trace *why* a given piece of grounding was present). This traceability is what makes `.claude/intelligence/learning-loop.md`'s promotion pipeline workable later — a learning can only be traced back to its source if the source was ever recorded as having been loaded in the first place.

## Non-Negotiables

- Assembly order is memory → knowledge → intelligence → templates, always — not the order a particular agent's own file happens to mention things, which (per `docs/framework-audit.md` §1.2) was incomplete anyway.
- A shared dependency is loaded once per request, never once per agent, in any multi-agent workflow.
- A missing load target is disclosed, never silently skipped.
