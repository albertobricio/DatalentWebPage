# Illustration Style

**Objective this document serves:** what's allowed to fill the visual space `design-system.md` explicitly reserved but left unspecified — "a restrained supporting visual" on the Home and service-page heroes (`home-wireframe.md`, `page-wireframes.md`), and the concept explainers several service pages genuinely need. Illustration here is functional, not decorative — every use case below is grounded in an actual content need already identified in `page-specs.md` or `page-wireframes.md`, not an abstract design flourish.

## The Rule Illustration Exists to Serve

`design-system.md` explicitly rules out "stock 'AI' visual clichés (circuit-board patterns, glowing brain/neuron imagery, particle animations)" as generic and undercutting the category-creation goal. This document is the positive specification that rule implies: if not that, then what.

**Illustration in this system is diagrammatic, not decorative.** An illustration must explain a real concept or it doesn't belong on the page — this is the same discipline `page-specs.md` applies to statistics (no unearned claim) applied to imagery (no unearned visual complexity).

## Style Rules

- **Geometric line construction only** — built from the same primitives as `logo-principles.md`'s signal mark (circles, arcs, straight connecting lines, consistent stroke weight) — one visual grammar across mark, icon, and diagram, never three unrelated illustration languages competing on the same page.
- **Monochrome or two-tone only** — `color.ink` alone, or `color.ink` + `color.signal` for a diagram that needs to distinguish two states (e.g., "within autonomy boundary" vs. "escalated to human"). Never a full-color illustration palette, never a gradient fill.
- **No characters, no people, no isometric "tech illustration" scenes** — the genre of illustration common on SaaS marketing sites (stylized people at laptops, floating UI cards, isometric office scenes) is explicitly out of scope; it's decorative, generic, and contributes nothing a real diagram wouldn't do better for this specific content.
- **Every illustration is annotated with real text labels**, not left to be self-explanatory through visual metaphor alone — this is both an accessibility requirement (a diagram's meaning must not depend on visual interpretation alone) and a trust requirement (`design-review.md`'s IDEO Design Director finding: specificity builds trust; a labeled diagram is specific, an abstract shape is not).

## Primary Use Case: The Autonomy Boundary Diagram

The single most important illustration in the system, specified concretely rather than left generic, directly serving `page-wireframes.md`'s Agentic AI for HR page Methodology/Evidence block (which currently calls for "the full agentic-vs-automation test... applied to one worked example"):

**Construction:** a bounded region (the arc from `logo-principles.md`'s signal mark, drawn larger and fully annotated) containing 2–3 labeled points representing steps an agent can take autonomously within its defined limit, with one clearly-marked point at the boundary's edge labeled "Punto de escalado" (escalation point) connecting outward to a separate, fixed circle labeled "Supervisión humana" (human oversight). This is the same solid-circle-plus-bounded-arc grammar as the logo mark, now doing explanatory work instead of identity work — reinforcing `positioning.md` Pillar 1 visually every time it appears, not just asserting it in copy.

**Where it's used:** the Agentic AI for HR page (primary), optionally referenced at smaller scale on the AI Governance page (secondary, since the two pages are structurally paired per `site-map.md`).

## Secondary Use Case: Process/Flow Diagrams

For any service page needing to show a sequence (e.g., Compensation & Total Rewards' "raw gap → control factors applied → adjusted gap" methodology, which `page-wireframes.md` requires be "explained plainly, not just referenced") — a simple horizontal step diagram: labeled nodes connected by straight lines, no more than 4 steps, same monochrome/two-tone construction rule as above.

## What This System Does Not Include (Yet)

No illustration is specified for Home's hero "supporting visual" beyond referring back to the signal mark itself, scaled up — `home-wireframe.md` intentionally left this open, and this document resolves it minimally: **the Home hero's supporting visual is the signal mark, large-scale, not a new bespoke illustration.** This keeps the identity consistent (the first thing a visitor sees is the same mark that appears in the header, footer, and favicon, not a fourth unrelated graphic) and avoids commissioning decorative illustration this system's own restraint principle would have to immediately justify.

## Cross-Document Consistency Note

Every illustration in this system uses only `design-tokens.md`'s existing `color.ink`/`color.signal`/`color.paper` tokens and the same geometric grammar as `logo-principles.md`'s signal mark and `iconography.md`'s icon construction — illustration is not a fourth, independent visual language, it's the largest-scale expression of the same one.
