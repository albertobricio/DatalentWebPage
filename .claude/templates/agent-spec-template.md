<!--
Template: Agentic AI Workflow Specification
Used by: .claude/agents/agentic-ai-architect.md
Fill every section. Do not delete the Governance Status or Failure Mode sections — an agent spec without them is incomplete per .claude/CLAUDE.md operating rule #3.
-->

# Agent Spec: [Agent Name]

**Practice area:** Agentic AI
**Client / Engagement:** [name or VALIDATE]
**Date:** [YYYY-MM-DD]
**Author:** [name]

## 1. Goal
[One sentence: the outcome this agent is working toward.]

## 2. Autonomy Boundary
**May decide and execute without human sign-off:**
- [ ]

**May never do alone — always requires human sign-off:**
- [ ]

## 3. Escalation Triggers
[The specific conditions that route a case to a human. Be concrete — "ambiguous fit" is not concrete; "cultural-fit score within 5 points of the cutoff threshold" is.]
- [ ]

## 4. Human Checkpoint
[Exactly where in the workflow a human reviews or can override the agent — before action, after action, or both. Name the role responsible.]

## 5. Inputs and Data Sources
[What the agent reads, and from where. Flag any personal/candidate data explicitly.]
- [ ]

## 6. Governance Status
- **EU AI Act risk tier:** [High-risk / Limited risk / Minimal risk — with reasoning, or VALIDATE]
- **Bias-testing status:** [VALIDATE or describe methodology + date]
- **Data residency:** [VALIDATE or state hosting jurisdiction]
- **Conformity assessment (if High-risk):** [VALIDATE or state status]

*For a full governance review, hand this section to `.claude/agents/ai-governance-auditor.md`.*

## 7. Failure Mode
[What happens if the agent is wrong, and how that's caught.]

---
*Non-fabrication check: every unverified figure or status above should read `[VALIDATE: ...]`, not an invented placeholder value. See `.claude/memory/non-fabrication-policy.md`.*
