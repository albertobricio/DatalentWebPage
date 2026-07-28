---
name: compliance-glossary
description: EU AI Act, GDPR, and EU Pay Transparency Directive terms, used consistently across every governance-related deliverable.
metadata:
  type: reference
---

Use these terms precisely and consistently. Getting AI governance vocabulary wrong is worse than not using it — it's exactly the kind of unsubstantiated claim `.claude/memory/non-fabrication-policy.md` prohibits.

**How to apply:** any deliverable describing an AI system's risk posture should use this vocabulary rather than inventing looser language, and should mark the actual risk tier / legal basis as `[VALIDATE]` unless it has genuinely been assessed for the engagement in question.

- **EU AI Act risk tiers** — the EU's risk-based classification for AI systems: *Unacceptable risk* (prohibited), *High risk* (includes most AI used in employment/HR decisions — recruitment, promotion, termination — subject to the strictest obligations: risk management, data governance, human oversight, technical documentation, conformity assessment), *Limited risk* (transparency obligations, e.g. disclosing AI interaction), *Minimal risk* (no specific obligations). **Most agentic AI use cases Datalent designs for HR — screening, cultural-fit scoring, promotion/attrition prediction — sit in the High-risk tier by default**; this must be stated explicitly wherever such a system is described, not left implicit.
- **Human oversight (EU AI Act requirement for high-risk systems)** — a documented point at which a human can review, override, or halt an AI system's output before it takes effect on a person. This is the same concept as the "human checkpoint" language in `.claude/memory/positioning-decisions.md` — use the two interchangeably but always specify *where* in the workflow it sits.
- **Conformity assessment** — the formal process a high-risk AI system must pass before deployment under the EU AI Act. Don't claim a system has passed this unless it genuinely has; use `[VALIDATE]` otherwise.
- **GDPR — data residency** — where personal data is physically stored and processed. A claim of "European data residency" requires naming the actual hosting jurisdiction; don't imply EU residency from a Spain-based mailing address alone.
- **GDPR — Article 22 (automated decision-making)** — individuals have the right not to be subject to a decision based solely on automated processing that produces legal or similarly significant effects, without meaningful human involvement. This is the legal backbone of why Datalent's agentic AI systems must always route final person-affecting decisions through a human, not just a design preference.
- **EU Pay Transparency Directive** — EU directive requiring employers to disclose pay information (e.g., pay ranges in job postings, gender pay gap reporting) with a member-state transposition deadline of 7 June 2026. As of this system's creation (2026-07-02), that deadline has passed — this is a live, current compliance driver for any Compensation & Benefits or Total Rewards deliverable, not a future consideration. See `.claude/agents/compensation-benefits-specialist.md`.
- **Bias auditing** — the practice of systematically testing an AI system's outputs for disparate impact across protected characteristics. Any People Analytics or Agentic AI deliverable describing a predictive or scoring model should state whether/how bias auditing is performed, or flag it as `[VALIDATE]`.
