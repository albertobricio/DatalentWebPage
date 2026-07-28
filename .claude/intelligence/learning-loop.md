# Learning Loop

A system that produces the same quality of output on request 500 as request 1 isn't actually learning — it's just executing. This file defines how an accepted decision, a corrected mistake, or a validated judgment call stops being a one-off outcome and becomes **permanent knowledge** that shapes every future request. This is what makes the system adaptive rather than static.

## The Promotion Pipeline

```
Output delivered (passed quality-gates.md)
   │
   ▼
User accepts / uses the output
   │
   ▼
Eligibility check — decision-engine.md Tree 5
   │ eligible
   ▼
Classify the learning: Correction | Confirmation | New Pattern | New Gap
   │
   ▼
Determine destination file (see routing table below)
   │
   ▼
Check for conflict with existing content in that file
   │
   ├─ conflicts ──▶ Update existing entry, versioned (see Versioning below)
   │
   └─ no conflict ──▶ Append new entry, linked to source
   │
   ▼
Promoted — now permanent, informs all future requests
```

## Eligibility (summary — full logic in `decision-engine.md` Tree 5)

A learning is eligible for promotion only if: (1) it isn't built on an unresolved `[VALIDATE]` marker, and (2) it's generalizable beyond the single engagement that produced it. Client-specific facts (an exact salary figure, a named individual's data) never get promoted into `.claude/memory/` or `.claude/knowledge/` — they stay in the engagement record only. What gets promoted is the *reusable* insight underneath — a corrected methodology, a validated framework application, a new competitive fact, a newly-discovered gap in the system itself.

## Classifying the Learning

### Correction
An accepted output revealed that an existing memory/knowledge file was wrong, outdated, or incomplete — e.g., a competitor changes their positioning and `.claude/memory/competitive-landscape.md`'s comparison table is now stale, or a knowledge-file framework was applied and found to not actually fit the HR context as described.
**Destination:** update the existing file directly. This is the highest-priority learning type — an uncorrected known error compounds across every future request that reads the stale file.

### Confirmation
A judgment call that wasn't previously codified worked well and the user validated it (accepted without pushback, or explicitly confirmed it was the right call) — e.g., a particular way of framing a governance gap in a proposal landed well with a client.
**Destination:** add as a new entry in the relevant `.claude/memory/` file (if firm-specific — how Datalent should communicate) or `.claude/knowledge/` file (if it's a generalizable field insight).

### New Pattern
A recurring reasoning approach emerged across multiple requests that isn't yet named in `reasoning-patterns.md` or a domain's decision trees.
**Destination:** add a new pattern to `reasoning-patterns.md`, or a new branch/tree to `decision-engine.md` or the relevant `.claude/knowledge/*.md` file's Decision Trees section.

### New Gap
A request repeatedly hit a Coverage Gap (per `capability-matrix.md`), a repeated conflict (per `conflict-resolution.md`'s closing section), or a repeated escalation (per `decision-engine.md` Tree 4) on the same underlying question.
**Destination:** flag explicitly to the user as a structural gap — a new agent, a new knowledge domain, or a new command may be warranted. This is the one learning type this system does **not** self-promote; adding new agents/domains is a design decision for a human to make, not something the loop does autonomously.

## Routing Table — Where Learnings Go

| Learning is about... | Destination |
|---|---|
| Datalent's own positioning, brand voice, or strategic decisions | `.claude/memory/` |
| A competitor's moves or the competitive landscape | `.claude/memory/competitive-landscape.md` |
| A general field framework, terminology, or standard (true regardless of firm) | `.claude/knowledge/` |
| A reusable cross-domain reasoning habit | `.claude/intelligence/reasoning-patterns.md` |
| A recurring orchestration or gating judgment call | `.claude/intelligence/decision-engine.md` |
| An agent's actual capability boundary proving different from its documented one | `.claude/intelligence/capability-matrix.md` |
| A workflow needing a new step, gate, or metric | `.claude/intelligence/workflow-library.md` |
| A recurring conflict needing a named resolution rule | `.claude/intelligence/conflict-resolution.md` |
| A structural gap (missing agent/domain/command) | Flagged to the user — not self-promoted, per "New Gap" above |

## Versioning and Traceability

Every promoted entry must be traceable back to the decision that generated it — when updating a `.claude/memory/` or `.claude/knowledge/` file, note in the edit (or in a changelog note within the file, consistent with how `.claude/memory/positioning-decisions.md` and `.claude/memory/competitive-landscape.md` already cite `docs/business-audit-v2.md` as their source) what prompted the change and when. A knowledge base that can't explain *why* it believes something is no more trustworthy than an agent that can't cite a source — the same Evidence-First discipline (`reasoning-patterns.md` Pattern 3) applies to the system's own self-updates, not just to client-facing claims.

When a Correction overwrites prior content, don't silently delete the old claim — note what changed and why, the same way `.claude/memory/positioning-decisions.md` already states "this is a living decision, not a permanent one... update this file and `competitive-landscape.md` together" when the competitive landscape shifts.

## Staleness Review

Not all permanent knowledge stays true forever. Some files carry a higher decay rate than others and need periodic re-verification rather than being treated as permanently correct:

| File type | Decay risk | Review trigger |
|---|---|---|
| `.claude/memory/competitive-landscape.md` | High — competitors reposition | Any time a competitor's messaging is newly observed, or at minimum each time `positioning-check` surfaces a mismatch |
| Regulatory content (`.claude/knowledge/eu-ai-act.md`, Pay Transparency Directive references) | High — law and guidance evolve | Any time a governance workflow surfaces a discrepancy with current regulatory text; treat dates cited in these files as a freshness checkpoint, not a permanent fact |
| `.claude/memory/service-lines.md` | Medium — changes when Datalent's actual offerings change | Whenever a proposal or case study would otherwise misrepresent current capability |
| `.claude/knowledge/` general frameworks (Pyramid Principle, MEDDIC, WorldatWork model, etc.) | Low — established professional frameworks change slowly | Opportunistic — update if a newer edition/version of a named framework materially changes its guidance |
| `.claude/intelligence/` orchestration files (this layer) | Medium — evolves as the agent roster and workflows evolve | Any time an agent, command, or knowledge domain is added or removed, per each file's own Maintenance section |

A stale fact treated as permanently true is a worse failure than an acknowledged gap — the same principle `.claude/memory/non-fabrication-policy.md` applies to unverified claims applies here to unrefreshed ones. When in doubt about whether a promoted learning is still current, mark it for review rather than continuing to reason from it silently.
