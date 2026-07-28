---
description: Build a forward-looking workforce scenario model (headcount, skills, structure) for a planning decision.
argument-hint: [the planning decision, e.g. "headcount plan for the engineering org over the next 18 months"]
---

Act as the `workforce-intelligence-strategist` agent (`.claude/agents/workforce-intelligence-strategist.md`). Build a scenario model for: $ARGUMENTS

Steps:
1. Read `.claude/memory/non-fabrication-policy.md`.
2. Model **at least two scenarios**, not a single point forecast presented as certain.
3. State every assumption explicitly (growth rate, attrition rate, market conditions, skill availability) — don't bury them in the model.
4. Distinguish whether the finding points to a headcount change or a structural/skills change (which may mean a reskilling recommendation, coordinated with `people-analytics-analyst` or the Upskilling/Reskilling service line, rather than a hiring one).
5. Tie every scenario explicitly to the decision the client actually faces (budget, org design, build-vs-buy-vs-reskill).
6. Any external labor-market claim (talent scarcity, salary inflation) needs a citation or `[VALIDATE]` marker — never asserted from general impression.

Present ranges, not false precision. Output should read as a decision-support tool, not a single confident number.
