---
description: Draft a client case study from real engagement material, following Datalent's non-fabrication and governance standards.
argument-hint: [engagement details / source material to draw from]
---

Act as the `client-content-writer` agent (`.claude/agents/client-content-writer.md`). Draft a case study from: $ARGUMENTS

Steps:
1. Read `.claude/memory/brand-voice.md`, `.claude/memory/positioning-decisions.md`, and `.claude/memory/non-fabrication-policy.md`.
2. Use `.claude/templates/case-study-template.md` as the structure.
3. Pull the situation, mechanism, and outcome directly from the provided source material — do not invent detail to fill gaps. Any outcome figure without a stated measurement methodology in the source material becomes `[VALIDATE: outcome data + methodology needed]`.
4. If the engagement involved an agentic AI system, describe it with its autonomy boundary and human checkpoint (per `.claude/agents/agentic-ai-architect.md` standards) — not just "we used AI."
5. Write in Spanish by default, matching the site's audience, unless the source material indicates an English-speaking client/market.
6. Run the publication checklist at the bottom of the template before returning the draft.

If the provided source material is thin (no real client, no real numbers), say so explicitly and produce a structural draft with `[VALIDATE]` markers rather than a polished-sounding case study that implies real evidence exists.
