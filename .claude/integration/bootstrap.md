# Bootstrap

This is the procedure that closes `docs/framework-audit.md` §1.2 for real. That finding was: an agent invoked exactly as its own file describes will never open `.claude/knowledge/`, `.claude/intelligence/`, or `.claude/execution/`, because nothing in its own text tells it to. This file is the instruction that runs *before* any agent or command's own instructions do — it's the missing step, added once, here, instead of thirty-nine times across every agent and command file.

## The Rule

**Whichever Claude instance is about to invoke an agent, run a command, or execute a workflow must run this boot sequence first.** This applies whether the entry point is a `.claude/commands/` slash command, a direct agent invocation, or a project-scale request reaching `.claude/execution/`. Skipping bootstrap and going straight to an agent's own "Before you start" instructions is exactly the gap `docs/framework-audit.md` identified — this file exists so that stops being the default path.

## Boot Sequence

```
1. Load .claude/integration/registry.yaml
      → this is always step 1, no exceptions — everything downstream
        depends on knowing the registry's declarations, not the
        individual file's self-description

2. Load .claude/CLAUDE.md
      → the constitution — note its known_gap per the registry entry
        (it predates knowledge/, intelligence/, execution/, integration/);
        treat registry.yaml as authoritative on folder structure

3. Load mandatory-always memory files
      → per .claude/integration/context-priority.md's priority tiers,
        at minimum .claude/memory/non-fabrication-policy.md loads
        regardless of what's being requested

4. Resolve the request
      → decompose into capability tags and run the request through
        .claude/integration/routing.md (which formalizes
        .claude/intelligence/decision-engine.md Tree 1 and
        .claude/intelligence/capability-matrix.md's scoring, now
        driven by registry.yaml data rather than by re-reading
        every agent file to infer its scope)

5. Resolve the agent(s) or execution entry point
      → routing.md returns either: a single agent, a multi-agent set,
        an execution/ entry point (project-scale request), or a
        Coverage Gap flag

6. Load that agent's FULL registered load set from registry.yaml
      → this is the actual fix: pull registry.yaml's `agents[].loads`
        entry for the selected agent(s) and load every file listed —
        memory, knowledge, intelligence, and templates — not just
        whatever the agent's own "Before you start" section names.
        See .claude/integration/context-loader.md for the assembly
        mechanics and .claude/integration/resource-loader.md for how
        each file type is actually read.

7. Proceed to normal execution
      → single request: .claude/intelligence/coordination-protocol.md
      → project-scale request: .claude/execution/workflow-orchestrator.md
      → either way, the agent now has everything registry.yaml says
        it needs, not just what its own file happened to mention
```

## Why Step 6 Is the Load-Bearing Step

Compare what an agent's own file says to load versus what `registry.yaml` says to load — `.claude/integration/dependency-map.md`'s "Per-Agent Load Chain" table makes this concrete. Take `agentic-ai-architect`: its own file names two memory files. `registry.yaml` names those same two memory files *plus* three knowledge files (`agentic-ai`, `ai-governance`, `eu-ai-act`) and four intelligence files (`capability-matrix`, `coordination-protocol`, `quality-gates`, `reasoning-patterns`). Without Step 6, that agent runs on roughly 30% of the context the system's own design says it needs. Bootstrap's job is making Step 6 non-optional.

## Idempotency

Bootstrap runs once per request, not once per agent in a multi-agent workflow — Step 1–4 produce a shared understanding of the request and the registry that every subsequently-invoked agent in the same request reuses, rather than each agent re-running its own private bootstrap and potentially resolving the registry or the request differently. `.claude/integration/context-loader.md` handles deduplication across agents within a single bootstrapped request.

## Failure Handling

- **`registry.yaml` fails to load or is malformed:** do not silently fall back to each agent's own self-description as if that were equivalent — that's the exact pre-integration-layer state `docs/framework-audit.md` flagged as broken. Surface the failure; treat it the same as a `.claude/intelligence/decision-engine.md` Tree 4 escalation (missing information that can't be substituted with judgment).
- **A registry entry references a path that no longer exists:** this is a `.claude/integration/validation-map.md` violation — flag it rather than proceeding on stale data.
- **Routing (Step 4–5) returns a Coverage Gap:** proceed per `.claude/intelligence/capability-matrix.md`'s existing Coverage Gap procedure — surface it to the user, don't force an assignment.

## Non-Negotiables

- Step 1 (load `registry.yaml`) is never skipped, including for requests that look simple enough to route "obviously" to one agent — the registry is what makes agent selection dynamic rather than habitual, per the system's own founding requirement in `.claude/intelligence/capability-matrix.md`.
- Step 6's load set comes from `registry.yaml`, never from re-reading only the target agent's own file — that reversion is precisely the gap this entire layer exists to close.
