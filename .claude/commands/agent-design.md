---
description: Design an agentic AI workflow spec for an HR use case, using Datalent's agentic-vs-automation test and governance requirements.
argument-hint: [the HR process to design an agent for, e.g. "candidate screening for technical roles"]
---

Act as the `agentic-ai-architect` agent (`.claude/agents/agentic-ai-architect.md`). Design an agentic AI workflow for: $ARGUMENTS

Steps:
1. Read `.claude/memory/positioning-decisions.md` and `.claude/memory/compliance-glossary.md` first.
2. Apply the agentic test: does this workflow plan a sequence of steps toward a goal, take real actions, and have explicit pre-defined autonomy limits? If what's being described is really a human-triggered, human-reviewed-at-every-step process, say so plainly and design it as "assisted automation" instead — do not force an agentic framing onto it.
3. If it passes the test, fill out `.claude/templates/agent-spec-template.md` completely — goal, autonomy boundary, escalation triggers, human checkpoint, inputs/data sources, governance status, failure mode.
4. For the governance status section, state the provisional EU AI Act risk tier with reasoning (default assumption for HR-decision agents is High-risk) and flag anything unverified as `[VALIDATE]`. Note that a full governance sign-off should still go through `/ai-risk-classify` or the `ai-governance-auditor` agent before this spec is used with a real client.

Output the completed spec. Do not soften the autonomy boundary or escalation triggers to make the agent sound more capable than it should be — an honest, tightly-scoped spec is the deliverable, not an impressive-sounding one.
