# Photography Style

**Objective this document serves:** rules for general (non-executive — see `executive-photography-guidelines.md` for that specific, higher-priority case) photography, and an honest statement of what Wave 1 actually uses, which is currently none.

## The Honest Starting Point

Per `home-wireframe.md`'s "Explicit Omissions" section, Wave 1 has no client photography, no office/team environment photography, and no stock photography anywhere in its wireframes — the hero visual is the signal mark (`illustration-style.md`), not a photograph. This document specifies the rules for *when* general photography is eventually introduced (client environment shots for a future case study, for instance), so a future addition doesn't have to invent standards from nothing — it does not claim a photo library currently exists.

## Why Photography Is Used Sparingly, By Design

`design-system.md`'s restraint principle and its explicit rejection of "stock AI clichés" both push toward a system where photography, if used at all, must clear a high bar: it has to add real, specific information (a real location, a real document, a real moment), or it doesn't belong. This is a deliberate constraint, not an oversight — generic corporate stock photography (handshakes, people pointing at whiteboards, diverse-team-around-a-laptop scenes) is exactly the register `design-system.md` Principle 1 rules out, and it actively undermines `positioning.md`'s specificity-over-genericism claim.

## Style Rules, for Whenever Photography Is Introduced

- **Documentary, not staged.** Real environments, real working moments, natural light — never a posed "corporate stock" composition (direct eye contact with camera while pointing at a screen, exaggerated smiling handshakes, artificially diverse group compositions assembled for the shot rather than photographed as they actually occur).
- **Muted, consistent color grade** — desaturated toward the `color.ink`/`color.paper` palette, never full-saturation stock-photo color. A specific grading LUT/treatment should be defined once photography is actually commissioned, but the direction is fixed here: photography should look like it belongs to the same restrained system as the rest of the site, not like a separate stock-photo layer pasted on top of it.
- **No decorative-only photography.** Every photograph used must be captioned or contextualized with real, specific information (what it shows, when, in what context) — an uncaptioned "mood" photograph fails the same specificity test `illustration-style.md` applies to diagrams.
- **No AI-generated imagery.** Given the firm's own category claim rests on AI governance credibility, using AI-generated stock imagery anywhere on the site would be a direct, undermining contradiction — every photograph must be a real photograph of a real subject.

## Accessibility Rules

- Every photograph carries real, specific alt text (what is actually shown, not a generic description) — the same discipline `executive-photography-guidelines.md` applies more strictly to practitioner photography.
- No text is ever embedded inside a photograph as the only way to convey that information (fails WCAG's text-in-images guidance) — any caption or label lives in real, selectable HTML text near the image, per `component-library.md`'s existing text-not-color-alone discipline applied here to text-not-image-alone.

## What Triggers Adding Real Photography

Per `roadmap.md`'s Phase 1/2 sequencing: real client-environment photography becomes relevant once a real case study exists (Phase 1's milestone) — a photograph implies a real, specific subject, and Wave 1 has none yet to photograph honestly. This document's rules apply from the first real photograph forward; they are not retroactively justifying any photography that exists today, because none does.

## Cross-Document Consistency Note

Color treatment for any future photography draws from `design-tokens.md`'s existing palette, not a new photography-specific palette. This document explicitly does not cover executive/practitioner photography — that has its own, more urgent specification in `executive-photography-guidelines.md`, since `design-review.md` identified it as a high-impact gap while general environment photography was not flagged as urgent by the same review.
