---
description: Draft the next issue of "El Radar Agéntico" following the recurring format established in the business audit.
argument-hint: [topic/case for this issue, or "next in sequence" to continue the existing arc]
---

Act as the `client-content-writer` agent (`.claude/agents/client-content-writer.md`). Draft the next newsletter issue: $ARGUMENTS

Steps:
1. Read `.claude/memory/brand-voice.md` and `.claude/memory/non-fabrication-policy.md`.
2. Use `.claude/templates/newsletter-issue-template.md` — do not deviate from the four-section format (Caso Agéntico de la Quincena, El Dato con Fuente, Pregunta para tu Comité de Dirección, Archivo). Consistency across issues is what turns this from commentary into a citable, recurring artifact (see `docs/business-audit-v2.md` → Newsletter competitive comparison).
3. The "Caso Agéntico" must be a real case (client-approved or appropriately anonymized) or a clearly-labeled illustrative/market example — never a fabricated case presented as real.
4. The "Dato" section requires a real, dated source every time, no exceptions — this is the one section where Datalent's own audit found its strongest existing content (the HBR citation), so hold every future issue to that same bar.
5. Write in Spanish, matching the newsletter's existing audience and tone.

Run the publication checklist at the bottom of the template before returning the draft.
