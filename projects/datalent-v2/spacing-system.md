# Spacing System — Brand Applications

**Objective this document serves:** extend `design-tokens.md`'s 8px-based UI spacing scale to the brand-identity contexts that scale doesn't already cover — logo clear space (referenced but not fully specified in `logo-principles.md`) and print/PDF collateral, which the current site has and Website v2 inherits.

## The Base Unit, Extended

`design-tokens.md` establishes an 8px base unit for UI spacing (`space.xs` through `space.3xl`). This document doesn't introduce a second, competing unit — it applies the same ratio logic to two contexts UI spacing tokens don't directly address: self-referential logo clear space, and physical/print collateral where pixels aren't the native unit.

## Logo Clear Space (Detail on `logo-principles.md`'s Rule)

`logo-principles.md` specifies clear space equal to the wordmark's own cap-height — a self-scaling rule. In practice: measure the cap-height of the "D" in "Datalent" at whatever size the lockup is reproduced, and that measurement is the minimum margin on all sides, before any other element (text, edge of page, another graphic) may appear. This rule scales correctly from a favicon to a building-scale application without this document needing to specify a table of fixed values per size — the self-referential unit is the point.

## Print and PDF Collateral

The current site links to two legal documents as flat PDFs (`cookie-policy.pdf`, `data-privacy.pdf`, both ~550KB, per `docs/website-audit.md`'s Performance findings) with no evident branded template — they read as generic exports, not as Datalent documents. This document doesn't redesign those PDFs (out of scope here), but specifies the spacing standard they and any future print/PDF collateral (proposal templates, one-pagers referenced in `go-to-market.md`'s sales enablement section) should be built to:

- **Margin:** a consistent outer margin on every page, derived proportionally from the same 8px-family ratio logic as the digital `space.xl`/`space.2xl` tokens, translated to print units (e.g., a generous ~32–40px-equivalent margin at standard document resolution) — generous enough to read as considered, not cramped, consistent with `design-system.md`'s "editorial, not dense" principle.
- **Baseline grid:** body text in any print document follows the same `type.body`/line-height relationship as the digital system (`design-tokens.md`'s `type.body` line-height of 1.6), so a printed page and a web page feel like the same voice, not two unrelated typographic systems.
- **Logo placement:** any branded document places the wordmark-only lockup (per `logo-principles.md`'s "most-used lockup" rule) at a fixed position (top-left or top-center, chosen once and held consistently across every document type), with its own clear-space rule applied identically to the digital version.

## Section Rhythm (Web)

Restating `design-tokens.md`'s existing `space.2xl`/`space.3xl` tokens here with their specific brand rationale: the large vertical gaps between major page sections (visible throughout `home-wireframe.md` and `page-wireframes.md`) are not empty space to be trimmed for density — they are a deliberate expression of `design-system.md`'s "editorial, not app-dashboard" register. A future implementation pass that compresses this rhythm to fit more content per screen would be undoing a specific, reasoned brand decision, not just adjusting a number.

## Cross-Document Consistency Note

No new base unit is introduced anywhere in this document — every value traces back to `design-tokens.md`'s existing 8px-family scale, applied to two contexts (logo clear space, print collateral) that scale doesn't explicitly reach. Any future redesign of `cookie-policy.pdf`/`data-privacy.pdf` (flagged as a real, if lower-priority, gap by `docs/website-audit.md`) should be built directly against this document's Print and PDF Collateral rules.
