# Design Tokens — The Single Source of Truth

**Objective this document serves:** replace `docs/architecture.md`'s three unreconciled color-token systems (Tailwind config in `index.html`, CSS variables in `styles.scss`, and a fourth inline `<style>` block in `faq.component.html`) with exactly one. Every value below is the only value of its kind in Website v2 — no page, no component, defines a competing token.

**No implementation here.** These are specified values and their rationale, not CSS custom properties or SCSS variables — that translation happens when `sprint-01.md` (or its successor) is actually executed against Angular.

## Color

### Core Palette

| Token | Value | Role |
|---|---|---|
| `color.ink` | `#14171C` | Primary text on light surfaces; primary dark surface itself |
| `color.paper` | `#FAFAF8` | Primary background surface (warm off-white, not pure white — softer, more editorial) |
| `color.paper-alt` | `#F1F0EC` | Secondary surface (card backgrounds, section alternation) |
| `color.signal` | `#2952CC` | Primary accent — links, primary CTA background, active states |
| `color.signal-dark` | `#1E3D99` | Signal hover/pressed state |
| `color.bronze` | `#A6803D` | Secondary accent — premium/trust markers, sparingly used, decorative and large-scale only (never body text; see Contrast Verification) |
| `color.slate` | `#5B6270` | Secondary/muted text on light surfaces (captions, metadata) |
| `color.mist` | `#A8ACB4` | Secondary/muted text on dark (`ink`) surfaces only — not safe on light surfaces, see below |
| `color.border` | `#DDDBD4` | Default hairline border on light surfaces |
| `color.border-dark` | `#33363D` | Default hairline border on dark surfaces |

### Semantic / Status

| Token | Value | Role |
|---|---|---|
| `color.success` | `#1E7A4C` | Confirmation states (form submitted, etc.) |
| `color.warning` | `#8A5A0A` | Caution states — deliberately a darker, muted amber rather than a bright yellow, to stay within the restrained palette |
| `color.error` | `#B3261E` | Error/validation states |

All three semantic colors are specified dark enough to pass 4.5:1 against `color.paper` as text (see Contrast Verification) — status colors are used for both text and icons, so they're held to the stricter text threshold even where a component might only need the 3:1 non-text minimum.

## Contrast Verification

Every functional pair below was checked against the WCAG 2.x relative-luminance contrast formula. Method: convert sRGB → linear RGB per channel, compute relative luminance `L = 0.2126R + 0.7152G + 0.0722B`, then contrast ratio `(L₁+0.05)/(L₂+0.05)` for the lighter/darker pair. **These are hand-computed using the correct WCAG formula, not asserted** — but per `.claude/memory/non-fabrication-policy.md`'s discipline applied to this document specifically, they should still be re-verified with an automated contrast-checking tool before implementation, since a hand computation, however carefully done, is not the same as a tool-verified one.

| Pair | Computed ratio | WCAG AA requirement | Result |
|---|---|---|---|
| `color.ink` text on `color.paper` | 17.19 : 1 | 4.5 : 1 (normal text) | Pass, well above AAA (7:1) too |
| `color.signal` text/links on `color.paper` | 6.34 : 1 | 4.5 : 1 (normal text) | Pass |
| White text on `color.signal` (primary button) | 6.63 : 1 | 4.5 : 1 (normal text) | Pass |
| White text on `color.ink` (dark-surface sections) | 17.96 : 1 | 4.5 : 1 (normal text) | Pass |
| `color.mist` text on `color.ink` (dark-surface secondary text) | 7.89 : 1 | 4.5 : 1 (normal text) | Pass |
| `color.slate` text on `color.paper` (light-surface secondary text) | 5.86 : 1 | 4.5 : 1 (normal text) | Pass |
| `color.mist` text on `color.paper` | 2.18 : 1 | 4.5 : 1 (normal text) | **Fail — do not use.** `color.mist` is a dark-surface-only token; `color.slate` is its light-surface equivalent. This pairing is documented here specifically as a guardrail against the mistake of treating the two muted-text tokens as interchangeable. |

`color.bronze` is not included in this table because it is specified as decorative/large-scale-only (borders, icons, badge backgrounds with white/ink text on top, dividers) — never as body text on its own. Any future use of `color.bronze` as a text color must be contrast-checked against this same methodology before approval; none is pre-approved by this document.

## Typography

**Single typeface family: Inter.** The current site already loads Inter (in `home.component.scss`) alongside a second, unused-in-practice Roboto import (in `styles.scss`) — `docs/architecture.md` flagged this as a minor fragmentation. Website v2 standardizes on Inter alone: it's already proven on the live site, it's a well-built, professional, highly-legible typeface at both UI and display sizes, and consolidating to one family is both more minimalist (per `design-system.md` Principle 1) and removes a redundant font-load (a small but real performance win, consistent with `docs/website-audit.md`'s performance findings).

*Considered and rejected: pairing Inter with a serif display face for an "editorial consulting" flourish.* Rejected because it adds a second font-load for a effect the minimalist principle doesn't require — hierarchy is achieved through weight, size, and spacing instead (see Type Scale below), keeping the system genuinely single-family.

### Type Scale (mobile-first — base sizes; desktop scale-up noted where it applies)

| Token | Size (base / desktop) | Weight | Line-height | Usage |
|---|---|---|---|---|
| `type.display` | 32px / 48px | 700 | 1.1 | Page H1, hero headline |
| `type.h2` | 24px / 32px | 700 | 1.2 | Section headings |
| `type.h3` | 19px / 22px | 600 | 1.3 | Card/subsection headings |
| `type.body-lg` | 18px / 18px | 400 | 1.6 | Lead paragraphs, hero subtext |
| `type.body` | 16px / 16px | 400 | 1.6 | Default body text |
| `type.body-sm` | 14px / 14px | 400 | 1.5 | Captions, metadata, footer text |
| `type.label` | 13px / 13px | 600 | 1.2 | Buttons, badges, form labels (uppercase, tracked +0.02em) |

All body-text sizes (`body-lg`, `body`, `body-sm`) stay constant across breakpoints — only display/heading sizes scale up at desktop, consistent with mobile-first practice (shrinking a desktop-authored scale down to mobile is exactly the anti-pattern `design-system.md` Principle 4 rules out).

## Spacing

An 8px base unit, scaling geometrically — predictable, and standard enough that it maps cleanly onto most CSS utility conventions without this document needing to prescribe implementation:

| Token | Value |
|---|---|
| `space.xs` | 4px |
| `space.sm` | 8px |
| `space.md` | 16px |
| `space.lg` | 24px |
| `space.xl` | 40px |
| `space.2xl` | 64px |
| `space.3xl` | 96px |

`space.2xl`/`space.3xl` are reserved for section-level vertical rhythm (the generous whitespace `design-system.md` calls for); `space.xs`–`space.lg` govern component-internal spacing.

## Radius, Border, Elevation

- `radius.sm` = 4px (inputs, small badges), `radius.md` = 8px (cards, buttons), `radius.lg` = 16px (large panels/hero containers) — restrained, not the fully-rounded "pill" style associated with the consumer-SaaS register `design-system.md` rules out.
- `border.width` = 1px hairline only — no heavy borders; hierarchy comes from spacing and type, not border weight.
- **No glow/drop-shadow-as-decoration.** A single, minimal `elevation.sm` (a very subtle, low-opacity shadow for cards that need to visually lift off the page, e.g., a dropdown) is the only shadow token in the system — directly ruling out the current site's `box-shadow: 0 0 15px rgba(0, 234, 255, 0.6)` glow-on-hover pattern (`home.component.scss`), which is exactly the visual signature `design-system.md` identifies as off-brand for this direction.

## Breakpoints

Matching `design-system.md`'s Grid & Layout System: `bp.base` = 0px, `bp.tablet` = 600px, `bp.desktop` = 960px, `bp.wide` = 1280px.

## Motion

- `motion.fast` = 150ms, `motion.default` = 250ms, `motion.slow` = 400ms — all using a standard ease-out curve, never a bouncy/elastic curve (consistent with restraint over decoration).
- Every transition token has a stated reduced-motion fallback: instant (0ms) state change, no animated transition, per `design-system.md`'s WCAG commitment on `prefers-reduced-motion`.

## Cross-Document Consistency Note

`component-library.md`'s every component references these tokens by name, never a new or one-off value. Both wireframe documents specify layout in terms of the Spacing and Breakpoint tokens above, not arbitrary pixel values.
