# Conflict Resolution

Multi-agent collaboration produces disagreement — that's a feature, not a bug, when it's resolved by explicit rule rather than by whichever agent spoke last. This file defines the precedence hierarchy and the specific resolution procedures for the conflict types this system will actually encounter.

## Precedence Hierarchy

When two agents' outputs conflict and the specific rules below don't resolve it, apply this ordering — higher wins:

1. **`.claude/memory/non-fabrication-policy.md`** — always wins. No agent, no framework application, no deadline pressure overrides this. A more persuasive rewrite that introduces an unsourced claim loses to a less persuasive one that doesn't.
2. **`ai-governance-auditor`'s governance findings** — win over any domain specialist's functional enthusiasm. A governance objection blocks release regardless of how good the underlying agentic design or analysis is.
3. **`.claude/memory/positioning-decisions.md` and `.claude/memory/brand-voice.md`** — win over a specialist's preferred phrasing when the two conflict (e.g., a specialist wants to call something "agentic" for impact; positioning discipline says it fails the test — positioning wins).
4. **Evidence/data** — wins over a specialist's prior belief or general industry assumption. If `people-analytics-analyst`'s data contradicts `workforce-intelligence-strategist`'s assumption-based scenario, the data-grounded finding takes precedence, with the assumption revised.
5. **The more specific, narrowly-scoped agent** — wins over the more general one within its own declared domain (per `capability-matrix.md`'s primary-tag ownership). `compensation-benefits-specialist` outranks `total-rewards-strategist` on a pure benchmarking-methodology question, even though the latter consumes the former's output.
6. **User/human judgment** — wins over all of the above when explicitly given; the system defers to the user on anything the user has directly decided, per `.claude/CLAUDE.md`'s general principle that this system supports Datalent's people, it doesn't override them.

## Named Conflict Types and Resolutions

### Governance Veto
**Scenario:** `agentic-ai-architect` (or any specialist) has designed or described something `ai-governance-auditor` classifies as non-compliant, unclear-risk, or missing a required human checkpoint.
**Resolution:** `ai-governance-auditor`'s finding blocks delivery (Gate 3 failure, per `quality-gates.md`) regardless of how complete or elegant the rest of the design is. The originating agent revises to satisfy the governance finding — it does not get to argue the governance read is too strict and ship anyway. If the originating agent genuinely believes the governance classification is wrong, that disagreement is documented and escalated to the user (per `decision-engine.md` Tree 4), not silently overridden by either side.

### Fabrication vs. Persuasiveness
**Scenario:** `client-content-writer` or `competitive-positioning-analyst` wants to strengthen a claim, but doing so requires a number or fact that isn't verified.
**Resolution:** the claim gets a `[VALIDATE]` marker, full stop. "It would land better as a hard number" is never sufficient justification to invent one — see Precedence Hierarchy #1. This is the single most protected rule in the system because it's the specific failure mode `docs/website-audit.md` and `docs/business-audit-v2.md` both found live on the site already.

### Domain Specialist Disagreement
**Scenario:** two specialists reach different conclusions about the same underlying situation (e.g., `workforce-intelligence-strategist` reads a data pattern as a headcount gap; `people-analytics-analyst` reads the same data as a culture/retention issue).
**Resolution:** default to whichever conclusion the underlying data more directly supports (Precedence #4), not whichever agent has the more senior-sounding domain. If the data genuinely supports both readings (they're not mutually exclusive — it could be both), say so explicitly in the output rather than forcing a single answer for the sake of tidiness. If truly unresolved, present both positions to the user per `decision-engine.md` Tree 4 rather than silently picking one specialist's view.

### Positioning Ambition vs. Honesty
**Scenario:** `competitive-positioning-analyst` recommends a rewrite that would score better on Executive Relevance and Trust, but the stronger version implies a capability or scale Datalent doesn't currently have (per `.claude/memory/service-lines.md`).
**Resolution:** `.claude/memory/service-lines.md`'s accurate representation of actual capability wins (Precedence #3/#1 combined — this is really a fabrication question wearing a positioning costume). The rewrite improves the *argument* for what's real, never invents what isn't. This is explicitly called out in `.claude/agents/competitive-positioning-analyst.md`'s own non-negotiables.

### Scope Boundary Dispute
**Scenario:** an agent is asked to do work at the edge of or outside its declared scope (e.g., `total-rewards-strategist` asked to do pure benchmarking with no integration angle).
**Resolution:** the agent redirects to the correct specialist per `capability-matrix.md` rather than attempting the work anyway "since it's related." Scope discipline exists so each output gets the actually-most-qualified reasoning, not the most-available agent's best guess.

### Evaluation Disagreement
**Scenario:** the agent that produced an output scores it differently than the agent evaluating it under `evaluation-engine.md` (e.g., the originating specialist self-scores HR Quality a 4, the evaluator scores it a 2).
**Resolution:** the independent evaluator's score governs for gating purposes — self-scoring is a first pass, not the final word, precisely because self-assessment is the least reliable check in the pipeline (this is why `quality-gates.md` requires a different agent for Evidence/Governance scoring wherever possible). If the originating agent believes the evaluator is wrong, it can make its case, but the burden is on it to show the evaluator missed something concrete, not merely to disagree.

## What Cannot Be Resolved by This System Alone

Escalate to the user, per `decision-engine.md` Tree 4, rather than resolving autonomously, whenever a conflict involves:
- A pricing, contractual, or legal commitment.
- A genuine, unresolved disagreement about a governance risk classification (not a disagreement about whether to comply, but about what the correct classification actually is).
- A question about whether Datalent should claim a new service line or capability at all — that's a business decision, not a content decision.
- Any conflict that has recurred across multiple unrelated requests — a repeated conflict is itself a signal that a rule in this file, `capability-matrix.md`, or a `.claude/memory/` file needs to be updated, which is a `learning-loop.md` action, not another one-off resolution.
