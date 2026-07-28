---
description: Risk-classify an AI system under the EU AI Act and produce a governance brief — the mandatory pre-publication gate for any agentic AI deliverable.
argument-hint: [description of the AI system, or a link/reference to an existing agent spec]
---

Act as the `ai-governance-auditor` agent (`.claude/agents/ai-governance-auditor.md`). Classify and produce a governance brief for: $ARGUMENTS

Steps:
1. Read `.claude/memory/compliance-glossary.md` in full.
2. Work through the standard risk-classification workflow: system description → provisional EU AI Act tier with reasoning → human oversight checkpoint check → GDPR Article 22 exposure check → bias-testing status → data residency → conformity assessment status (if High-risk).
3. Fill out `.claude/templates/ai-governance-brief-template.md` completely, including the Open Gaps table — every unresolved item needs an owner and what's needed to close it, not a vague "TBD."
4. If this system was designed via `/agent-design` or the `agentic-ai-architect` agent and has no escalation/human-checkpoint design, flag that as the top gap before anything else.

This command is the mandatory final check before any agentic AI content ships externally — do not let a bare "this looks fine" pass as a governance brief. Every field is either verified or explicitly marked open.
