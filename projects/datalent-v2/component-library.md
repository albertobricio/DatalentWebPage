# Component Library — Specification

**Objective this document serves:** one specification per reusable component, covering every component named in `sprint-01.md`'s Required Components table plus the foundational atoms they're built from. Every component draws exclusively from `design-tokens.md` — no component below introduces a new color, size, or spacing value.

**No implementation here.** Anatomy, states, and accessibility behavior are specified; no HTML, CSS, or Angular template code appears in this document.

## Foundational Atoms

### Button
**Anatomy:** label text (`type.label`) + optional leading/trailing icon, `radius.md`, minimum touch target 44×44px per `design-system.md`'s WCAG commitment.
**Variants:** `primary` (`color.signal` background, white text — the CTA default), `secondary` (transparent background, `color.ink` text, `border.width` hairline border), `ghost` (text-only, `color.signal`, used for tertiary actions like "Ver servicio →").
**States:** default, hover (`color.signal-dark` background for primary; `color.paper-alt` background for secondary/ghost), focus (a visible 2px `color.signal` outline offset 2px — never suppressed), active/pressed (slightly darker + 1px inset feel via no added shadow, just color shift, consistent with the no-glow rule), disabled (reduced opacity, `cursor: not-allowed` semantics, `aria-disabled="true"`).
**Accessibility:** rendered as a real `<button>` or `<a href>` with a real destination — never a styled `<div>` or an `<a>` with no `href`, directly closing the 15-instance pseudo-link finding in `docs/website-audit.md`. Every button has a discernible accessible name (visible text, or `aria-label` if icon-only).
**Content rule:** label is always a verb phrase ("Reservar Briefing," never "Briefing") — matching `.claude/memory/brand-voice.md`'s falsifiable-and-specific standard applied to UI copy.

### CtaButtonComponent
**Extends:** Button, `primary` variant, fixed to exactly two content variants per `page-specs.md`'s Cross-Page Consistency Note:
- `diagnostico` — label "Solicitar Diagnóstico Gratuito," routes to `/contacto?motivo=diagnostico`.
- `briefing` — label "Reservar Briefing Ejecutivo," routes to `/contacto?motivo=briefing`.
No third variant exists — a page needing a different call-to-action uses the `ghost` Button variant instead, not a new CtaButtonComponent variant, keeping the two-CTA discipline `page-specs.md` established intact at the component layer.

### Link (inline text link)
**Anatomy:** `color.signal` text, underline on hover/focus (not underlined by default in body copy, to avoid visual noise — but this is a deliberate exception that requires the surrounding context to make links identifiable by more than color alone, e.g., inline links are introduced with clear lead-in language; NAVIGATIONAL links, by contrast, are always underlined or otherwise non-color-dependent, so as not to rely on color alone per WCAG 1.4.1).
**Accessibility:** meets the same 44×44px target-size guidance where a link functions as a standalone tappable element (e.g., a "Ver servicio →" card link); inline text links within a paragraph are exempted from the target-size minimum per standard WCAG guidance for inline content.

### Badge / Tag
**Anatomy:** `type.label` text, `radius.sm`, used for the practice-area labels (e.g., "AI Governance") on cards and for the `[VALIDATE]`-style internal editorial flags during content review (never shown to a live site visitor — an internal-only variant).
**Variants:** `neutral` (`color.paper-alt` background, `color.ink` text), `accent` (`color.bronze` background at reduced opacity, `color.ink` text — the "premium marker" use of the bronze token described in `design-tokens.md`).

### Form Input
**Anatomy:** label (always visible, never placeholder-only — placeholder-as-label is a WCAG anti-pattern this spec explicitly rules out), input field (`radius.sm`, `color.border` hairline, `color.paper` background), helper/error text slot below.
**States:** default, focus (2px `color.signal` outline), error (`color.error` border + icon + message, message is programmatically associated via `aria-describedby`, not color alone), disabled.
**Accessibility:** every input has a real, associated `<label>` (via `for`/`id`, not just visual proximity); required fields are marked both visually (`*` plus text, not just an asterisk) and programmatically (`aria-required`).

## Composite Components (from `sprint-01.md`'s Required Components)

### PageHeroComponent
**Anatomy:** eyebrow/category label (`type.label`, e.g., "Agentic AI"), `type.display` headline, `type.body-lg` one-line value statement, primary CtaButtonComponent, optional breadcrumb slot above the eyebrow.
**Layout:** mobile — single column, generous `space.2xl` top/bottom padding; desktop — content constrained to a readable max-width (per `design-system.md`'s "editorial, not full-bleed" container rule), left-aligned, never centered (centered hero text at long headline lengths reads as "landing page template," not "consulting firm" — a deliberate, stated choice).
**Used by:** all six non-Home pages, per `sprint-01.md`.

### ServiceCardComponent
**Anatomy:** Badge (practice name), `type.h3` title, 2–3 line `type.body` description (pulled verbatim from `service-catalog.md`'s Entry Point language, per `sprint-01.md`'s single-source-of-copy rule), ghost-variant "Ver servicio →" link.
**Layout:** mobile — full-width stacked cards; desktop — grid, 3 columns at `bp.desktop`, per `design-tokens.md`'s spacing scale for gutters (`space.lg`).
**States:** default, hover (subtle `elevation.sm` lift only — no glow, no scale-transform, per `design-system.md`'s restraint principle, a deliberate correction of the current site's `.service-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 25px -5px rgba(0, 234, 255, 0.2)... }` glow-and-jump pattern).
**Used by:** Home teaser grid, Services hub.

### PillarProofBlockComponent
**Anatomy:** four equal-weight blocks (one per `positioning.md` pillar), each: short icon or numeral marker (not a decorative illustration — text/numeral only, per `design-system.md`'s anti-cliché rule), `type.h3` pillar name, one falsifiable `type.body` statement (never a percentage claim, per `page-specs.md`'s Required Evidence rule for Home).
**Layout:** mobile — single column stack; desktop — 4-column row, equal width, `space.lg` gutters.
**Used by:** Home, referenced as reusable on Services hub per `sprint-01.md`.

### TrustFooterStripComponent
**Anatomy:** a single horizontal strip, `color.paper-alt` background, containing 2–3 short trust statements (e.g., "Cada agente, con límite de autonomía documentado" / "Alojamiento y gobernanza de datos europeos") rendered as plain text with a small Badge-style marker, not icons-as-decoration.
**Layout:** mobile — stacked; desktop — inline row, evenly spaced.
**Used by:** Agentic AI, AI Governance, People Analytics, Compensation & Total Rewards pages, per `sprint-01.md`.

### BreadcrumbComponent (real, replacing the current dead one)
**Anatomy:** `Inicio / Servicios / [Current Page]`-style trail, `type.body-sm`, `color.slate` for inactive segments, `color.ink` for the current page (not a link).
**Accessibility:** wrapped in `<nav aria-label="breadcrumb">` with an actual `<ol>` list structure reflecting the real current route — directly replacing the current site's hidden, always-static "Inicio"-only breadcrumb block found in `docs/website-audit.md`.
**Used by:** all six non-Home pages.

### MobileNav
**Anatomy:** hamburger trigger (Button, icon-only, `aria-label="Abrir menú"`/`"Cerrar menú"` depending on state) + slide-out or expand panel containing the full header nav structure from `site-map.md`.
**States:** closed, open — the trigger's `aria-expanded` attribute reflects state accurately at all times, directly fixing the gap `docs/website-audit.md` found (the current toggle sets a label but never toggles `aria-expanded`).
**Accessibility:** focus is trapped within the open panel; `Escape` closes it and returns focus to the trigger button — standard disclosure-pattern behavior, specified here as a requirement rather than left to implementation discretion.

### FaqAccordionItem
**Anatomy:** question (`type.h3`, acts as the toggle), answer content (`type.body`, revealed on expand).
**Accessibility:** native `<details>/<summary>` semantics are kept from the current implementation (`docs/website-audit.md` correctly flagged this as a genuine existing strength — free keyboard and screen-reader support) — Website v2 preserves this pattern rather than replacing it with a custom-JS accordion, restyled only to match the new token system.

### FormStatusMessage
**Anatomy:** a single text region below any form, `role="alert"` (preserving the one other pattern `docs/website-audit.md` flagged as already correct on the current site), styled per `color.success`/`color.error` semantic tokens depending on outcome.

## Cross-Document Consistency Note

Every component above is referenced by name in `home-wireframe.md` and `page-wireframes.md` — neither wireframe document introduces a layout element that doesn't map to a component specified here, and this document introduces no component that isn't actually used in at least one wireframe.
