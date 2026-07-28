# Tone of Voice

**Objective this document serves:** the canonical, detailed brand voice specification. `.claude/memory/brand-voice.md` is its operational summary — the condensed version the AI content system (`.claude/agents/client-content-writer.md` and related) actually reads before drafting. This document is the source; that one is the derived, operational excerpt. If the two ever diverge, this document governs, and `.claude/memory/brand-voice.md` should be updated to match — not the reverse.

## Voice Attributes

Four pairs, each stated as "this, not that" so the distinction is checkable, not just aspirational:

### Evidence-led, not hype-led
Every claim is either sourced or explicitly flagged as unverified (`[VALIDATE]`) — the voice never borrows confidence from an unearned number. This is the single most load-bearing voice attribute in the entire system, given `docs/website-audit.md` and `docs/business-audit-v2.md` both independently found the opposite pattern on the current site.

> **Not:** "Reducimos el time-to-hire hasta un 65%."
> **Instead:** "Medimos el time-to-hire de cada proceso desde el primer día, con metodología documentada — para que la mejora, cuando llega, se pueda demostrar, no solo afirmar."

### Precise, not vague
Specific mechanisms, named frameworks, stated limits — never a generic adjective doing the work a real detail should do (`.claude/memory/brand-voice.md`'s existing rule against "líder," "innovador," "de clase mundial" carries forward unchanged here, as the anchor example of this attribute).

> **Not:** "Nuestra IA es innovadora y de vanguardia."
> **Instead:** "Cada agente tiene un límite de autonomía definido contigo, y un punto de escalado a una persona — documentado, no implícito."

### Confident, not boastful
States what Datalent does and why it's the right approach, without needing to claim superiority over unnamed competitors or inflate scale. Confidence here comes from specificity and restraint, not from volume or superlatives — directly consistent with `design-system.md`'s visual restraint principle applied to language.

> **Not:** "Somos la consultora líder en IA para RRHH en España."
> **Instead:** "Diseñamos y gobernamos sistemas de IA para RRHH bajo estándares europeos — con el mismo rigor que aplicaríamos si fuéramos nosotros quienes tuviéramos que responder ante un regulador."

### Warm, not clinical
`design-review.md`'s IDEO Design Director finding applies to language as much as to imagery: an evidence-led, governance-heavy voice can tip into cold or bureaucratic if every sentence is a compliance statement. The voice stays human — it addresses a real person's real pressure (a CHRO under regulatory deadline, a founder who's outgrown gut-feel hiring), not an abstract "organization."

> **Not:** "El sistema garantiza el cumplimiento normativo aplicable."
> **Instead:** "Sabemos que la fecha límite de la Directiva de Transparencia Retributiva ya pasó — y sabemos lo que es intentar resolver esto con un Excel y buena voluntad."

## Register: Address and Formality

**Informal "tú," not formal "usted"** — continuing the register already present in the current site's existing FAQ copy ("Agenda una reunión... te presentaremos"), not changing it. This is a deliberate, confirmed choice: modern Spanish B2B and professional-services copy increasingly uses "tú" even at the enterprise tier, and switching to "usted" now would be a bigger, unjustified departure from the site's established voice than staying consistent with it. Formality is carried by precision and evidence discipline, not by grammatical distance from the reader.

## Language Default

Spanish for all client- and market-facing content, matching `.claude/memory/brand-voice.md`'s existing rule — this document doesn't change that decision, only elaborates the voice within it. English only for an explicitly English-speaking engagement or internal strategy documents (also unchanged from the existing rule).

## The Governance-Companion-Sentence Habit, as a Voice Trait

Not just a compliance requirement (`.claude/intelligence/reasoning-patterns.md` Pattern 5) — stylistically, pairing every autonomy claim with its human-checkpoint in the same breath is also what makes the voice sound *considered* rather than *promotional*. "El agente cribba candidatos" is a promotional sentence. "El agente cribba candidatos y escala los casos límite a una persona" is a considered one. This habit should be treated as a voice signature, not only a governance obligation.

## What The Voice Never Does

- Never uses an unsourced statistic or an unverifiable superlative (`.claude/memory/non-fabrication-policy.md`, restated here as a voice rule, not just a content rule).
- Never uses the word "agentic"/"agéntico" for something that fails the autonomy test in `.claude/memory/positioning-decisions.md` — a vocabulary discipline, not just a factual one.
- Never apologizes for or hedges a genuine gap (a missing service line, an unanswered question) with vague language — states it plainly, per `.claude/agents/compensation-benefits-specialist.md`'s existing standard: "an honest 'no, and here's our roadmap' beats an evasive non-answer."
- Never uses exclamation points or forced urgency ("¡Actúa ahora!") — inconsistent with both the restraint principle and the evidence-led attribute; urgency, where real (a regulatory deadline), is conveyed through the fact itself, not through punctuation.

## Cross-Document Consistency Note

`.claude/memory/brand-voice.md` remains the file the AI content system actually operates from day to day — this document doesn't replace that operational role, it grounds it. Any future update to voice rules should be made here first, with `.claude/memory/brand-voice.md` updated in the same pass to stay a faithful (if condensed) summary, consistent with `.claude/intelligence/learning-loop.md`'s own versioning discipline applied to brand documentation specifically.
