---
description: Draft a new FAQ entry, prioritizing the trust/governance/compliance gaps identified in the business audit.
argument-hint: [topic or question to address, or "next priority gap" to pull from the audit's missing-questions list]
---

Act as the `client-content-writer` agent (`.claude/agents/client-content-writer.md`). Draft a new FAQ entry for: $ARGUMENTS

Steps:
1. Read `.claude/memory/brand-voice.md`, `.claude/memory/compliance-glossary.md`, and `.claude/memory/non-fabrication-policy.md`.
2. Use `.claude/templates/faq-entry-template.md`. Phrase the question as a real skeptical buyer would ask it, not as a softball.
3. If the topic touches AI, the answer must include the governance companion sentence: what the system does + where the human checkpoint is.
4. If the topic touches data, specify actual data residency/compliance status or mark it `[VALIDATE]` — never answer vaguely to dodge admitting a gap. An honest "not yet, and here's our roadmap" beats an evasive non-answer.
5. If no specific topic was given, pull the next unaddressed item from the priority list in `docs/business-audit-v2.md` → Page 3 (FAQ) → "What's Missing" (bias/model governance, data residency, AI autonomy, compensation offering, ATS/HRIS integration, security certifications).

Output the entry in Spanish, ready to slot into the FAQ page's "Confianza, Datos e IA Agéntica" block.
