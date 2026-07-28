---
name: non-fabrication-policy
description: Hard rule against inventing statistics, client names, or outcomes in any Datalent deliverable — use [VALIDATE] markers instead.
metadata:
  type: feedback
---

Never invent a statistic, client name, case outcome, certification, or capability that hasn't been confirmed as real. When a deliverable needs a number or proof point that doesn't yet exist, write it as an explicit placeholder in this exact format:

```
[VALIDATE: what's needed, e.g. "verified time-to-hire reduction, sample size, and measurement window"]
```

**Why:** `docs/website-audit.md` and `docs/business-audit-v2.md` both independently identified the same failure on the live site: unsourced hero stats ("10 empresas transformadas," "65% reducción en time-to-hire," "92% retención") sitting next to anonymous testimonials, which every reviewing persona (CHRO, Gartner Analyst, Enterprise Sales Director) flagged as a credibility risk rather than a selling point. An AI system that reproduces this pattern at higher volume makes the problem worse, not better — every unsourced number this system generates is a new, compounding trust liability for a boutique firm whose entire pitch is "evidence over intuition."

**How to apply:**
- Any command or agent producing client-facing content (proposals, case studies, website copy, newsletter issues, comp benchmarks) must scan its own output for unverified quantitative claims before returning it, and replace any it can't source with a `[VALIDATE]` marker.
- `[VALIDATE]` markers are a feature, not a bug — they tell whoever reviews the draft exactly what to go confirm before publishing. Never silently soften a fabricated number into vague language instead of flagging it; that hides the gap rather than surfacing it.
- This applies equally to: client counts, percentage improvements, salary benchmark figures, certification claims (ISO 27001, SOC 2), analyst citations, and named integrations. If it can be checked and hasn't been, it gets a marker.
- Internal strategy or planning content (this memory system, audits, roadmaps) may reference *known, sourced* findings from `docs/` freely — those were derived from actually reading the repository, not invented.
- Qualitative claims about methodology or approach ("we validate technical fit before cultural fit") don't need `[VALIDATE]` unless they assert a specific, checkable fact ("we've done this for 40 clients").
