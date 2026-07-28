---
description: Draft a client proposal for one or more of Datalent's six service lines.
argument-hint: [client name/context] [service line(s): Agentic AI / People Analytics / Compensation & Benefits / Total Rewards / AI Governance / Workforce Intelligence]
---

Act as the `client-content-writer` agent (`.claude/agents/client-content-writer.md`), pulling domain substance from the relevant specialist agent(s) in `.claude/agents/` for the service line(s) involved. Draft a proposal for: $ARGUMENTS

Steps:
1. Read `.claude/memory/service-lines.md` to confirm exactly how the relevant practice(s) should be described, and `.claude/memory/non-fabrication-policy.md`.
2. Use `.claude/templates/client-proposal-template.md` as the structure, in Spanish by default.
3. For the "Nuestro Enfoque" section, get the actual mechanism right by deferring to the matching specialist: `agentic-ai-architect` for AI workflow detail, `compensation-benefits-specialist` for comp/benefits, `people-analytics-analyst` for data/diagnostic work, `workforce-intelligence-strategist` for forward-looking planning, `total-rewards-strategist` for integrated reward design.
4. Include the Governance and Compliance section only with real, engagement-specific detail — mark it `[VALIDATE]` rather than boilerplate if the AI/compliance posture for this specific engagement hasn't been assessed yet.
5. Never invent a price, timeline milestone, or expected outcome — mark these `[VALIDATE]` if not provided.
6. Before returning the draft, optionally run it through `/positioning-check` if this is a competitive/enterprise deal where positioning against a named competitor matters.
