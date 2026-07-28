# Reasoning Patterns

Domain knowledge (`.claude/knowledge/`) tells an agent *what* a real expert knows. This file tells an agent *how* to think regardless of which domain it's operating in — the reusable cognitive habits that separate a domain expert from a system that merely has access to domain facts. Every agent should apply the relevant patterns below on every task, not just when explicitly reminded.

## Pattern 1 — Hypothesis-First

**From:** `.claude/knowledge/consulting-methodologies.md` (hypothesis-driven consulting).
**When to apply:** any analytical task — a diagnosis, an audit, a data analysis.
**Steps:** state a provisional answer before gathering all the evidence → identify what would prove or disprove it → gather evidence specifically against that test → revise the hypothesis if the evidence doesn't support it, don't cherry-pick evidence that does.
**Failure mode if skipped:** unfocused, "boil the ocean" analysis that describes everything and concludes nothing — exactly the anti-pattern named in `consulting-methodologies.md`.

## Pattern 2 — MECE Structuring

**From:** `.claude/knowledge/consulting-methodologies.md` (Pyramid Principle, issue trees).
**When to apply:** whenever presenting findings with more than two supporting points.
**Steps:** structure supporting arguments so they are Mutually Exclusive (no overlap) and Collectively Exhaustive (nothing relevant left out) → lead with the answer, not the build-up (Minto's Pyramid Principle) → let the reader stop reading after the headline and still have the right takeaway.
**Failure mode if skipped:** findings that overlap and repeat themselves while missing an obvious angle no reader would forgive being absent.

## Pattern 3 — Evidence-First / Cite-or-Flag

**From:** `.claude/memory/non-fabrication-policy.md`.
**When to apply:** every single claim involving a number, a name, an outcome, or a capability.
**Steps:** before writing any checkable claim, ask "do I have a real source for this?" → if yes, cite it → if no, write `[VALIDATE: what's needed]` instead of a plausible-sounding invented value → never resolve uncertainty by picking the more convenient-sounding number.
**Failure mode if skipped:** the exact failure `docs/website-audit.md` and `docs/business-audit-v2.md` both independently found on the live site — unsourced stats next to thin social proof, read by every skeptical persona as a credibility risk rather than a strength.

## Pattern 4 — Reflection / Self-Critique Before Output

**From:** `.claude/knowledge/agentic-ai.md` (reflection/self-critique pattern in agent design).
**When to apply:** as a final pass on any drafted output, before it enters `quality-gates.md`.
**Steps:** re-read the draft as if reviewing someone else's work → ask "what would the harshest relevant persona from `docs/business-audit-v2.md` object to here?" → ask "is there a claim in here I wouldn't be comfortable defending under direct questioning?" → fix what fails either test before submission, don't wait for the gate to catch it.
**Failure mode if skipped:** gates catch what self-review should have caught first, wasting a revision cycle and signaling the agent isn't actually applying its own standards, just performing them when checked.

## Pattern 5 — Governance-Companion-Sentence

**From:** `.claude/memory/brand-voice.md` and `.claude/knowledge/eu-ai-act.md`.
**When to apply:** any sentence describing what an AI system or agent does.
**Steps:** for every "the agent does X," immediately pair it with "and the human checkpoint is Y" → never let an autonomy claim stand alone without its governance boundary in the same breath.
**Failure mode if skipped:** exactly the gap `docs/business-audit-v2.md` found across the live site — AI capability described with zero accompanying governance signal, which every HR Technology Analyst and Gartner Analyst persona flagged as disqualifying.

## Pattern 6 — Persona-Panel Stress Test

**From:** `.claude/agents/competitive-positioning-analyst.md`, originating in `docs/business-audit-v2.md`'s six-persona method.
**When to apply:** any client-facing or market-facing content before it's considered final.
**Steps:** run the content past each of the six personas (CHRO, Compensation Director, People Analytics Director, HR Technology Analyst, Gartner Analyst, Enterprise Sales Director) → give each a genuine verdict, not a diplomatic non-answer → if a persona would object, fix the content, don't argue the persona is being unfair.
**Failure mode if skipped:** content that reads well internally but collapses under real buyer or analyst scrutiny — the entire reason `docs/business-audit-v2.md` exists as a separate audit from the technical one.

## Pattern 7 — Escalation Reasoning

**From:** `decision-engine.md` (Tree 4).
**When to apply:** whenever confidence is genuinely uncertain, not just when a task is hard.
**Steps:** distinguish "this is difficult but I have what I need" from "I am missing something I cannot substitute with judgment" → for the latter, escalate per `decision-engine.md` rather than filling the gap with a plausible guess → state exactly what's missing when escalating, not just "I'm not sure."
**Failure mode if skipped:** an agent quietly papers over a real gap with confident-sounding text, which is a more dangerous failure than an obvious error because it's harder to catch downstream.

## Pattern 8 — Decision-Tree-First

**From:** `decision-engine.md` and every domain-specific tree in `.claude/knowledge/`.
**When to apply:** before reasoning freeform about a judgment call that a named tree already covers.
**Steps:** check whether a relevant tree already exists (domain-specific in `.claude/knowledge/`, orchestration-level in `decision-engine.md`) → follow it explicitly, citing which branch was taken and why → only reason from first principles when no tree applies, and if that happens repeatedly for the same question, that's a `learning-loop.md` signal a new tree is needed.
**Failure mode if skipped:** inconsistent judgment calls across similar situations — the same question answered differently on different days because it was re-derived from scratch each time instead of applying a stable, named decision procedure.

## How These Patterns Compose

A single deliverable typically applies several of these in sequence: Hypothesis-First and Decision-Tree-First shape the initial analysis → MECE Structuring organizes the findings → Evidence-First and Governance-Companion-Sentence discipline every claim as it's written → Reflection catches what's left → Persona-Panel Stress Test validates it against real buyer skepticism if client-facing → Escalation Reasoning is the safety valve running throughout, not just at the end. None of these patterns substitutes for actual domain knowledge in `.claude/knowledge/` — they're how that knowledge gets applied rigorously rather than recited.
