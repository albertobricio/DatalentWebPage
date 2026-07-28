# Routing

This file is `bootstrap.md` Steps 4–5 made explicit: how an incoming request actually resolves to an agent, a command, or an execution-layer entry point. It formalizes `.claude/intelligence/decision-engine.md` Tree 1 and `.claude/intelligence/capability-matrix.md`'s Dynamic Selection Algorithm, but sources its data from `registry.yaml` rather than from re-reading every agent and command file fresh each time. It also carries the two routing rules that close the orphan-file gaps `docs/framework-audit.md` found (§5, §6).

## Routing Decision Sequence

```
1. Does the request explicitly name a .claude/commands/ slash command?
     Yes → look up that command's `invokes` field in registry.yaml.commands
           → route directly to the named primary agent (+ mandatory/conditional agents)
     No  → continue

2. Decompose the request into capability tags (registry.yaml agents[].primary_tags /
   secondary_tags vocabulary — same tags .claude/intelligence/capability-matrix.md defines)

3. Is this a PROJECT-SCALE request?  (see Project-Scale Detection below)
     Yes → route to execution/project-manager.md, per the routing_rule declared on
           registry.yaml's execution.project-manager and execution.workflow-orchestrator
           entries — THIS IS THE RULE THAT RESOLVES THE execution/ ORPHAN FINDING
           FROM docs/framework-audit.md §5/§6
     No  → continue

4. Is this a BATTLECARD request?  (see Battlecard Detection below)
     Yes → route to competitive-positioning-analyst with
           templates/competitive-battlecard-template.md attached — THIS IS THE RULE
           THAT RESOLVES THE ORPHANED-TEMPLATE FINDING FROM docs/framework-audit.md §5
     No  → continue

5. Score every agent in registry.yaml.agents against the decomposed tags
   (primary_tags match = +2, secondary_tags match = +1 — identical scoring to
   .claude/intelligence/capability-matrix.md's Dynamic Selection Algorithm,
   now reading primary_tags/secondary_tags directly from the registry instead
   of re-deriving them from each agent's prose)

6. Single agent covers all required tags at primary strength?
     Yes → single-agent workflow, proceed to bootstrap.md Step 6 for that agent
     No  → multi-agent workflow; sequence per registry.yaml's depends_on /
           knowledge-graph.md edges, or run in parallel if tags are independent
           (identical logic to .claude/intelligence/decision-engine.md Tree 2)

7. Any required tag scores 0 across every agent?
     Yes → Coverage Gap. Check registry.yaml's `coverage_gap` field on the relevant
           knowledge file (hr-strategy.md and enterprise-sales.md both carry one) —
           surface it explicitly per .claude/intelligence/capability-matrix.md's
           existing Coverage Gap procedure. Never force-assign the nearest scorer.
     No  → proceed to bootstrap.md Step 6
```

## Project-Scale Detection

A request is project-scale (routes to `execution/`, not a single agent) when any of the following hold:
- It explicitly asks for a multi-deliverable engagement, a full client engagement lifecycle, or names a deadline/milestone structure.
- It maps to more than one `registry.yaml` command/workflow with a sequencing or scheduling relationship between them (not just multiple independent single-shot requests).
- The user explicitly invokes Kanban/Sprint language, a project name, or asks to "kick off," "plan," or "track" something ongoing.

Before this rule existed, no path in the system reached `execution/` at all (confirmed in `docs/framework-audit.md` §5/§6 — zero inbound references from `commands/` or `agents/`). This detection step is the concrete fix: it's a routing-layer decision, not a new command, so it closes the gap without requiring a new `.claude/commands/` file.

## Battlecard Detection

A request is a battlecard request when it asks to compare Datalent against a specific named competitor (Mercer, Korn Ferry, Visier, Deloitte, Workday, or a newly-named one) in a structured, reusable format — as distinct from a general `positioning-check` review of a piece of content. `positioning-check.md`'s command remains the entry point; this rule is what tells the invoked `competitive-positioning-analyst` to additionally load `templates/competitive-battlecard-template.md` when the request's shape calls for it, per `registry.yaml`'s now-updated `templates.competitive-battlecard-template.used_by` entry.

## Mandatory-Inclusion Overrides

These fire regardless of the scoring in Step 5 — identical to `.claude/intelligence/coordination-protocol.md` Step 5, restated here because routing is where they actually get applied at request time:

- Any request touching tags `agentic-design`, `bias-audit`, or `governance-classification` **always** includes `ai-governance-auditor`, even if it doesn't win the tag-scoring comparison.
- Any client-facing or market-facing output **always** includes `competitive-positioning-analyst` before delivery.

## Fallback for Agents With No Dedicated Command

`registry.yaml` shows `people-analytics-analyst` and `total-rewards-strategist` with empty `invoked_by.commands` lists (`docs/framework-audit.md` §6). Routing still reaches them correctly via Step 5's tag-scoring — a request tagged `attrition-analysis` or `culture-diagnostic` scores `people-analytics-analyst` highest regardless of whether a slash command exists for it. The missing command is a convenience gap (a user can't type a single memorable slash command for these agents), not a reachability gap — routing's tag-based scoring was always agent-first, command-name-matching is only Step 1's shortcut when it applies.

## Non-Negotiables

- Step 1 (explicit command match) is a shortcut, not a bypass of Steps 2–7's tag logic entirely — a command still carries its `mandatory`/`conditional` agent inclusions from `registry.yaml`, which are themselves derived from the same tag-based mandatory-inclusion rules.
- Project-scale and battlecard detection (Steps 3–4) run before generic tag-scoring (Step 5), because both are structural request shapes that generic capability scoring alone wouldn't reliably catch — a request to "govern our new screening agent across its full lifecycle" could otherwise score highest for a single agent when it actually needs the full `execution/` treatment.
- A Coverage Gap is always surfaced, never silently resolved by picking the closest-scoring agent — this is unchanged from `.claude/intelligence/capability-matrix.md` and restated here because routing is the layer that would otherwise be tempted to paper over it for the sake of always returning an answer.
