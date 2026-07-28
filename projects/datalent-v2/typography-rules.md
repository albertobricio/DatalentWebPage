# Typography Rules

**Objective this document serves:** usage rules layered on top of `design-tokens.md`'s type *values* (sizes, weights, line-heights) — and the resolution of `design-review.md`'s specific finding that "Inter-only... risks the system reading as generic tech company minimalism rather than European consulting minimalism," which that review explicitly flagged as argued from only one side.

## Resolving the Inter-Only Question

`design-review.md`'s finding is accepted, and weighed properly this time: Inter alone, used identically to how most SaaS products use it, does not differentiate Datalent from the exact "generic tech" register the whole design system exists to move away from. The performance argument for staying single-family (avoiding a second font load, `design-tokens.md`'s original reasoning) is real but not decisive against a differentiation cost this specific to the firm's category-creation goal.

**Decision: a second typeface is introduced, but scoped narrowly.** `type.display` (page H1s and hero headlines only — the highest-impact, lowest-frequency text on any page) is set in **Source Serif 4**, a refined, highly legible, open-source editorial serif. Every other type token — `type.h2` through `type.label`, all UI text, all body copy — stays Inter. This is a deliberate, narrow exception, not a reopening of the single-family decision generally: the serif appears in perhaps one or two places per page, never in running body text, never in UI chrome (buttons, nav, forms), so the performance cost stays minimal (one additional weight of one additional face, not a full second type system) while the differentiation benefit lands exactly where it matters — the first thing a visitor reads on every page.

**Why Source Serif 4 specifically:** it reads as institutional and considered rather than decorative or "magazine-editorial" (a genre risk with a more expressive serif) — appropriate for "European consulting," not "lifestyle publication." It's open-source and well-supported, consistent with Inter's own licensing register, so this isn't introducing a licensing or availability risk alongside the typographic one.

## Hierarchy Usage Rules

- `type.display` (Source Serif 4): the page's single H1 only. Never used for a subheading, never used twice on one page, never used in a button or nav element.
- `type.h2` (Inter, 700): major section headings — the "Nuestras Prácticas," "Qué Hacemos" level of the hierarchy in `home-wireframe.md`/`page-wireframes.md`.
- `type.h3` (Inter, 600): card and subsection headings — service card titles, pillar block titles.
- `type.body-lg` / `type.body` / `type.body-sm`: per `design-tokens.md`'s existing definitions, unchanged.

A page that skips a level (an H3 with no preceding H2) breaks both the visual rhythm and the semantic heading order `design-system.md`'s accessibility commitments require — this is a hard rule, not a style preference.

## Reading Measure

**New token, closing `design-review.md`'s Readability finding directly:** `type.measure` = 65–75 characters per line for `type.body` and `type.body-lg` content. Applied via a `max-width` constraint on any text-block container, independent of the page's overall grid width — a wide desktop container does not mean body paragraphs should stretch to fill it; they stay within this measure regardless of the surrounding layout's width.

## Capitalization Rules

- **Sentence case for all headings** (`type.display` through `type.h3`) — "Diseñamos y gobernamos agentes de IA," not "Diseñamos Y Gobernamos Agentes De IA." This is quieter and more restrained than title case, consistent with `design-system.md`'s overall register, and a deliberate departure from the current site's mixed and inconsistent capitalization patterns.
- **`type.label` (buttons, badges, form labels) uses sentence case as well**, not the current site's all-caps button treatment — matching `logo-principles.md`'s decision to move the wordmark itself away from all-caps for the same reason.

## Numeral Style

- **Tabular (fixed-width) numerals for any data presented in a table or aligned list** — comp benchmarks, pay-equity figures, any future case-study metric — so columns of numbers align correctly. Proportional numerals for numerals appearing inline within body prose.
- **No superscript/decorative numeral treatment anywhere** (footnote-style superscripts are acceptable for actual footnote references, e.g., citing a source per `.claude/memory/non-fabrication-policy.md`'s citation discipline — but never as a decorative device).

## Bilingual (Spanish-first) Rules

- **Both typefaces must render Spanish diacritics and `ñ` correctly at every weight used** — confirmed before either typeface is approved for implementation, not assumed. This is a basic but frequently-skipped requirement for a Spanish-first site.
- **Standard curly quotation marks (" ")** are used for the practical web-implementation register, rather than the traditional Spanish angular quotes (« ») — a deliberate, pragmatic choice for digital consistency and easier implementation, noted here explicitly so it reads as a decision, not an oversight of Spanish typographic convention.
- **Em-dash usage follows the same restrained register as the rest of the voice** (`tone-of-voice.md`) — used for a genuine aside or emphasis, not decoratively stacked.

## Cross-Document Consistency Note

Every size, weight, and line-height value referenced above is defined once in `design-tokens.md` — this document adds usage rules and the one narrowly-scoped serif exception; it does not redefine any value `design-tokens.md` already specifies. The `type.measure` token introduced here should be added to `design-tokens.md`'s own Typography section at the next revision of that file, so it lives with the rest of the type scale rather than only in this usage-rules document.
