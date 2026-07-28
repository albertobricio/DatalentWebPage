# Coordination Protocol

This file defines how the orchestrator actually runs a request end-to-end, and the **explicit collaboration rules** agents follow when working together. "The orchestrator" is not a separate piece of software — it's the role whichever Claude instance is handling a request plays, by following this protocol. Multi-agent collaboration in this system happens through the explicit rules below, not through agents improvising how to hand work to each other.

## The Orchestrator Role

The orchestrator's job, every time:
1. Understand what's being asked.
2. Select the right agent(s) — dynamically, via `capability-matrix.md`, never by fixed keyword-to-agent routing.
3. Sequence or parallelize their work correctly.
4. Pass structured handoffs between them.
5. Run the result through `quality-gates.md`.
6. Deliver, or escalate per `decision-engine.md` Tree 4 if something can't be resolved autonomously.

## Step-by-Step Protocol

### Step 1 — Intake
Read the request in full. If it matches an existing `.claude/commands/` workflow, note that (see `workflow-library.md`), but still run Step 2 — a command match tells you the *shape* of the work, not automatically which agent(s) fit best if the request has extended beyond the command's normal scope.

### Step 2 — Capability Decomposition
Apply `decision-engine.md` Tree 1: break the request into capability tags from `capability-matrix.md`'s vocabulary. Be specific — "help with comp" is not a tag; `comp-benchmark` or `pay-equity` or `total-rewards-synthesis` are.

### Step 3 — Dynamic Agent Selection
Run the Dynamic Selection Algorithm in `capability-matrix.md` against the tags from Step 2. This produces either a single agent, an ordered/parallel set of agents, or a Coverage Gap flag. **Never substitute this scoring process with "I'll just use the agent that sounds closest"** — that's fixed routing by another name, and it's explicitly what this system is designed not to do.

### Step 4 — Sequencing Decision
Apply `decision-engine.md` Tree 2. Two agents run **sequentially** when a `depends on` edge in `knowledge-graph.md` connects their domains (the dependency's agent must complete or gate before the dependent agent's output is final). Two agents run **in parallel** when their required tags are independent (no edge connects them) — in that case, don't make one wait on the other artificially.

### Step 5 — Mandatory Collaboration Rules

These rules apply regardless of what the capability-matrix scoring alone would suggest — they're hard requirements, not scored preferences:

- **Any output touching `agentic-design`, `bias-audit`, or `governance-classification` MUST include `ai-governance-auditor` in the agent set**, even if another agent scores higher overall. Governance is not optional just because a domain specialist is confident.
- **Any client-facing or market-facing output MUST include `competitive-positioning-analyst`** before delivery, per `quality-gates.md` Gate 4.
- **`client-content-writer` MUST NOT originate domain analysis.** If it's asked to write something and the underlying analysis doesn't exist yet, it requests that analysis from the matching specialist first (per its own agent definition) — it does not fill the gap itself, even under time pressure.
- **A specialist agent MUST NOT silently absorb a Coverage Gap tag** (`hr-operating-model`, `sales-methodology`) as if it were a natural part of its scope — see `capability-matrix.md`'s Coverage Gap procedure.

### Step 6 — Handoff Format

When Agent A's output feeds Agent B (sequential handoff), structure the handoff as:

```
FROM: [agent name]
TO: [agent name]
DELIVERABLE SO FAR: [what was produced]
OPEN QUESTIONS / FLAGS: [anything unresolved, including any [VALIDATE] markers]
WHAT'S NEEDED FROM YOU: [the specific next contribution]
```

This is what makes collaboration explicit rather than implicit — Agent B should never have to guess what Agent A actually finished versus assumed. Unresolved `[VALIDATE]` markers **must** carry forward in the handoff, never silently dropped because the next agent didn't ask about them.

### Step 7 — Aggregation
When multiple agents' outputs need to combine into one deliverable, `client-content-writer` is the default aggregator (per its role as the synthesis/writing layer in `capability-matrix.md`) unless the deliverable is a pure governance artifact, in which case `ai-governance-auditor` aggregates.

### Step 8 — Route to Quality Gates
Every aggregated or single-agent output goes through `quality-gates.md` before being considered done. No exceptions, including for outputs the orchestrator itself feels confident about — confidence is not a gate.

### Step 9 — Deliver or Escalate
If gates pass: deliver, per the definition of "delivery" in `quality-gates.md` (ready for human decision, not autonomously published). If gates fail repeatedly or a conflict can't be resolved: apply `decision-engine.md` Tree 4 and `conflict-resolution.md`.

## Parallel Execution Rules

When agents run in parallel (Step 4, independent tags):
- Each agent works from the same original request context — no agent should have to infer what another parallel agent is doing.
- Parallel outputs are not considered final individually; they're only final once aggregated (Step 7) and gated (Step 8) together, since a governance conflict or positioning inconsistency between two parallel outputs might only be visible once they're combined.

## What This Protocol Deliberately Does Not Do

It does not let any single agent unilaterally decide it can skip another agent's mandatory involvement (Step 5) because it judges the task simple enough — that judgment call belongs to the orchestrator applying this protocol and `decision-engine.md`, not to the specialist agent optimizing for speed. Consistency across requests matters more than any single request's efficiency.
