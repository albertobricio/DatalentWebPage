# Decision Engine

This file holds the system's **meta-level decision trees** — the branching logic used to run the system itself (which agent(s) to invoke, whether a gate applies, when to escalate). It is distinct from the **domain-specific** decision trees already embedded in each `.claude/knowledge/*.md` file (e.g., "lead, match, or lag the market?" in `compensation-total-rewards.md`, or "build, buy, borrow, or automate?" in `workforce-intelligence.md`) — those answer a domain question; these answer an *orchestration* question. A specialist agent uses its knowledge file's tree to decide what to recommend; the orchestrator uses this file's trees to decide who should be doing the recommending, and under what constraints.

## Notation

Every tree below follows the same format: a question, its possible answers, and where each answer leads. Follow the branches in order — don't skip ahead to a later branch's answer without resolving the earlier question first, since later branches assume earlier ones have already been decided.

## Tree 1 — Request Triage

The first tree run on any incoming request.

1. **Does the request map to an existing command in `.claude/commands/`?**
   - Yes → use that command's defined workflow in `workflow-library.md` directly; skip to Tree 2 only if the request also has scope beyond that command's normal bounds.
   - No → continue.
2. **Decompose the request into capability tags** using the vocabulary in `capability-matrix.md`.
3. **Does at least one agent score above 0 on the full required tag set (combined, per the Dynamic Selection Algorithm in `capability-matrix.md`)?**
   - Yes → proceed to Tree 2.
   - No → this is a Coverage Gap (see `knowledge-graph.md`). Surface it to the user explicitly rather than force-assigning the nearest agent.

## Tree 2 — Single-Agent vs. Multi-Agent

1. **Does one agent's primary tags cover 100% of the required tag set?**
   - Yes → single-agent workflow. Proceed directly to that agent.
   - No → continue.
2. **Do the required tags span domains connected by a `depends on` edge in `knowledge-graph.md`** (e.g., `agentic-design` + `governance-classification`)?
   - Yes → multi-agent workflow, sequenced: the dependency's agent (e.g., `ai-governance-auditor`) must review before the dependent agent's (e.g., `agentic-ai-architect`'s) output is finalized — see `coordination-protocol.md` for the handoff mechanics.
   - No (the tags are independent, e.g., a comp benchmark plus an unrelated attrition analysis) → multi-agent workflow, parallel: agents can work independently and their outputs are assembled at the end, typically by `client-content-writer`.

## Tree 3 — Gate Applicability

Use this when a deliverable type isn't already covered in `quality-gates.md`'s applicability table (e.g., a novel request type).

1. **Does the output make any checkable factual claim (a number, a name, an outcome)?**
   - Yes → Gate 1 (Non-Fabrication) is required. Always.
2. **Does the output describe an AI system, agent, or automated decision process?**
   - Yes → Gate 3 (Governance) is required.
   - No → Gate 3 is N/A.
3. **Will this output be seen by anyone outside Datalent** (a client, prospect, or the public)?
   - Yes → Gate 4 (Brand & Positioning) is required.
   - No → Gate 4 is N/A, and Trust/Executive Relevance are weighted to 0 in the Gate 5 composite per `evaluation-engine.md`.
4. **Is this output destined for the live website specifically?**
   - Yes → SEO dimension is scored in Gate 5.
   - No → SEO is N/A.

## Tree 4 — Escalate to Human

Run this whenever an agent (or the orchestrator itself) is uncertain whether to proceed autonomously.

1. **Does proceeding require asserting a fact that cannot be verified from provided material or `.claude/memory/` / `.claude/knowledge/`?**
   - Yes → do not proceed with an assertion. Either mark `[VALIDATE]` and continue (if the deliverable can still be useful with the gap flagged) or escalate to the user if the entire deliverable depends on that one fact.
2. **Does the request require a decision `conflict-resolution.md` identifies as human-only** (pricing commitments, legal/compliance sign-off, anything with irreversible external consequence)?
   - Yes → escalate immediately; do not attempt to resolve autonomously regardless of how confident any agent is.
3. **Has the same output failed the same quality gate more than twice** (per `quality-gates.md`'s escalation clause)?
   - Yes → escalate with the specific recurring blocker named, rather than continuing to iterate.
4. **Do two agents produce genuinely conflicting recommendations that `conflict-resolution.md`'s precedence rules don't cleanly resolve?**
   - Yes → escalate, presenting both positions rather than silently picking one.
5. **None of the above?** → proceed autonomously within the agent's defined scope.

## Tree 5 — Learning-Loop Eligibility

Run this after a deliverable is accepted/used by the user (see `learning-loop.md` for the full promotion pipeline; this tree is just the eligibility gate).

1. **Was the accepted output built on a `[VALIDATE]`-marked or otherwise unverified claim?**
   - Yes → not eligible for promotion until the validation is actually resolved.
2. **Is the insight/decision generalizable beyond this one engagement** (a reusable framework application, a corrected agent behavior, a new competitive fact), or is it client-specific and non-reusable (a single client's exact salary figures)?
   - Generalizable → eligible; proceed to `learning-loop.md`'s promotion pipeline.
   - Client-specific only → not eligible for `knowledge/` or `memory/` promotion; stays in the deliverable/engagement record only.
3. **Does it correct or contradict something already stated in an existing `.claude/memory/` or `.claude/knowledge/` file?**
   - Yes → treat as a required update, not just an addition — see `learning-loop.md`'s versioning requirement.
   - No → straightforward addition.

## Adding New Trees

If a recurring orchestration question doesn't fit the five trees above, add a new tree to this file rather than letting individual agents improvise the logic ad hoc each time — an undocumented, repeatedly-reasoned-from-scratch decision is exactly the kind of inconsistency this whole intelligence layer exists to remove.
