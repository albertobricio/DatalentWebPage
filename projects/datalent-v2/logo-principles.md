# Logo Principles

**Objective this document serves:** the direct answer to `design-review.md`'s top finding — "the only visual-identity instruction in the entire system is one placeholder sentence" (`home-wireframe.md`'s "an abstract geometric mark reflecting the governed system concept"). This document replaces that placeholder with a real, constructible concept and the rules governing it. It specifies principles and construction logic; it is not a finished vector logo, which requires actual design execution outside this text-based specification.

## Approach: Wordmark-Primary, One Constructed Mark

Per `design-system.md`'s restraint principle, the identity is **wordmark-primary** — "Datalent Solutions" set correctly is the identity's main asset, the way most credible professional-services and consulting firms build their mark (a wordmark reads as established and confident; an elaborate pictorial logo more often reads as the opposite for this category). One constructed signal-mark exists alongside it for use where a wordmark doesn't fit (favicon, social avatar, watermark) — not as a decorative addition to every wordmark instance.

## The Wordmark

- **Typeface:** Inter, Bold (700) weight, set in the brand's primary sans — not the editorial serif introduced in `typography-rules.md` for headline moments. A logotype should be more stable and timeless than a marketing headline typeface; keeping it in the functional, permanent typeface family (Inter) rather than the display serif is a deliberate choice to avoid the logo aging with a typographic trend.
- **Case:** sentence case ("Datalent Solutions"), not the current site's all-caps treatment (`main-topbar.component.html`'s `DATALENT SOLUTIONS`) — all-caps at logo scale reads louder and less restrained than the "premium enterprise, minimalist" direction calls for; sentence case is quieter and more confident.
- **Letter-spacing:** slightly tightened from Inter's default at large display sizes (a standard type-design correction — large-scale bold sans tends to look loose at default tracking), specified as a small negative adjustment, not a dramatic one.
- **Color:** `color.ink` on light surfaces, white/`color.paper` on `color.ink` dark surfaces. No gradient version, no secondary-color version, ever — a wordmark with multiple approved color treatments is a wordmark without real discipline.

## The Signal Mark: A Concrete Concept, Not a Placeholder

Constructed from two forms, directly representing the firm's core claim (`positioning.md` Pillar 1, Governed Autonomy) rather than an arbitrary abstract shape:

- **A solid circle** — the fixed point, representing human judgment: constant, anchoring, never in motion.
- **A single precise arc**, open at one point (not a full ring), intersecting the circle's upper-right quadrant — representing a bounded range of autonomous action: a defined limit, not an unconstrained field. The opening in the arc is the "escalation point" — the one place the boundary isn't closed, where control returns to the fixed center.

Rendered in a single color only (`color.ink` or `color.signal` — never both together, never a gradient between them), built on a strict geometric grid (arc radius, circle diameter, and stroke weight all derived from one consistent unit, the same discipline `.claude/knowledge-graph.md`'s and `design-tokens.md`'s single-source-of-truth principle applies elsewhere in this system). No 3D effect, no drop shadow, no glow — consistent with `design-tokens.md`'s explicit rejection of the current site's glow treatment.

This mark is deliberately legible as a diagram, not just a logo — the same visual logic should reappear, larger and annotated, as the actual autonomy-boundary diagram specified in `illustration-style.md` for the Agentic AI for HR page. The mark and the explanatory diagram are the same idea at two different scales, which is a stronger, more coherent system than an arbitrary logo mark that means nothing outside the header.

## Lockup

- **Primary lockup:** signal mark + wordmark, mark to the left, on one baseline, separated by a fixed space derived from `spacing-system.md`'s clear-space unit.
- **Mark-only lockup:** used only where space is genuinely constrained (favicon, app icon, social avatar) — never used interchangeably with the primary lockup as a stylistic choice.
- **Wordmark-only lockup:** used wherever the mark-only lockup isn't required and full-width space is available (page headers, footer, formal documents) — this is the default, most-used lockup, not the mark+wordmark version, per the wordmark-primary approach above.

## Clear Space and Minimum Size

- **Clear space:** a minimum margin around the entire lockup (mark or wordmark) equal to the cap-height of the wordmark's "D" — a standard, self-referential clear-space rule that scales correctly at any size, rather than a fixed pixel value that breaks at small or large scale.
- **Minimum size:** the primary lockup is never reproduced smaller than a size where the signal mark's open arc remains visually distinct from a closed ring — below that size, use the mark-only lockup at icon scale (favicon) or the wordmark-only lockup, never a shrunk primary lockup that reads as a solid dot.

## Misuse Rules

Stated explicitly, matching `design-system.md`'s own "what this aesthetic deliberately avoids" discipline:

- Never rotate, skew, or distort either the mark or the wordmark.
- Never recolor outside the two approved treatments (ink-on-light, white-on-dark) — no brand-color gradient fills, no photographic fills, no outline-only "ghost" version used decoratively.
- Never add a drop shadow, glow, bevel, or any dimensional effect — this is the single most important misuse rule given the current site's glow-heavy visual signature is exactly what `design-system.md` breaks from.
- Never place the mark or wordmark on a busy photographic or illustrated background without a solid-color safe area behind it — legibility and restraint both depend on this.
- Never use the mark-only lockup where the wordmark-only or primary lockup would fit — the mark is a space-constrained fallback, not a stylistic default.

## Cross-Document Consistency Note

The signal mark's construction (solid circle + bounded arc) is the same visual grammar `illustration-style.md` uses for the Agentic AI page's autonomy-boundary diagram, and its color usage draws only from `design-tokens.md`'s existing `color.ink`/`color.signal`/`color.paper` tokens — no new color is introduced for the logo. The wordmark's typeface is Inter, consistent with `typography-rules.md`'s decision to reserve the new editorial serif for headline/display moments only, never the permanent identity mark.
