# Release Notes — Website v2, Sprint 4.5 (Architecture Consolidation)

**Tag:** `v2-sprint-04-5`
**Scope:** pure refactor — no new pages, no content changes, no redesign. Extracted duplicated implementation across five page components into shared, reusable pieces.

## What changed

### 1. New shared `FaqAccordionComponent`

`src/app/shared/components/faq-accordion/` — takes a `readonly FaqItem[]` (`{ question: string; answer: string }`) and renders native `<details>/<summary>` accordion items. Replaces three near-identical hand-written copies of the same accordion markup and ~60-line CSS block (FAQ page, Agentic AI, Compensation & Total Rewards).

- **Native `<details>/<summary>`** — free keyboard support (Tab to focus, Enter/Space to toggle), preserved exactly as it was on all three pages.
- **WCAG AA** — same `:focus-visible` outline, same contrast-checked colors as before.
- **Configurable items** — any page can now add an FAQ section with a data array instead of hand-written markup.
- Answers render via `[innerHTML]` (Angular's default sanitizer applies) so the FAQ page's two answers that need `<ul>`/`<blockquote>` still work, alongside plain-paragraph answers on the other two pages — one component now serves both cases.

### 2. New shared content-pattern utilities

`src/styles/theme/_content-patterns.scss` — global (not view-encapsulated) utility classes/mixin, forwarded from `theme/index.scss`, replacing per-page copies of:

- `.section-intro` (was `.section__intro`, 3 copies)
- `.section-disclaimer` (was `.section__disclaimer`, 2 copies)
- `.text-link` (was `.section__link` / `.related-grid__link`, plus the link inside `.faq-more`, 4 copies)
- `.faq-more` (2 copies)
- `.cta-banner` / `.cta-banner__actions` / `.cta-banner__link` (4 copies)
- `@mixin card-grid($columns)` + `.card-grid--2` / `.card-grid--3` (was `.use-case-grid`, `.engagement-grid`, `.service-grid`, `.related-grid` — 4 copies, 2 different column counts)
- `.card-grid__soon` (was `.service-grid__soon` / `.related-grid__soon`, 2 copies)
- `.trust-strip` (2 copies)

Class names changed where a page-scoped BEM name (`section__intro`) became a flat global utility name (`section-intro`) — this is a CSS class rename only, not a content or structural change; every template using the old name was updated to the new one.

### 3. Dead code removed

`FaqComponent` had an unused `faqs` property (title/content array) that was never referenced by the template — the template hardcoded nine different question/answer pairs directly in HTML. Converted the actual rendered nine items into the new `FaqItem[]` data array and removed the dead property entirely.

## A real bug found and fixed during the audit

Auditing the three FAQ-accordion copies for exact duplication surfaced a genuine, previously-invisible defect: the FAQ page's `details[open]` used `--color-paper-alt` for the open-state background (visibly different from its `--color-paper` page background), but the Agentic AI and Compensation & Total Rewards pages (written in Sprints 3 and 4) used `--color-paper` — identical to their own section background, making the "item is open" highlight completely invisible on both pages. Verified via `getComputedStyle` before and after: `detailsBg` and `sectionBg` were byte-identical (`rgb(250, 250, 248)`) pre-fix, and visibly different (`rgb(241, 240, 236)` vs `rgb(250, 250, 248)`) post-fix. The shared `FaqAccordionComponent` now uses `--color-paper-alt`, matching the FAQ page's original, correct behavior everywhere.

## A specificity risk caught before it shipped

Moving `.cta-banner h2 { margin-bottom: ... }` and `.card-grid--N h3 { margin-top: 0; }` from page-scoped (Angular view-encapsulated) SCSS into global utility classes created a real risk: a page's own `h2 { margin-bottom: var(--space-lg); }` rule compiles with an attribute selector from Angular's encapsulation, so a naively-written global `.cta-banner h2` selector would tie its specificity exactly and leave the outcome to source/injection order — fragile and not guaranteed. Fixed by writing `.container.cta-banner` (both classes always co-occur on the same element, verified across all four call sites) and by nesting the grid's `h3`/`p` overrides one level deeper (`app-card h3` / `app-feature-card h3`), both of which reliably outrank the encapsulated single-element selector regardless of load order. Verified visually post-build that heading spacing inside cards and CTA banners is unchanged.

## Duplication reduction (measured)

```
15 files changed, 197 insertions(+), 709 deletions(-)
```

Plus two new shared files:

- `src/styles/theme/_content-patterns.scss` — 154 lines (one definition, 5 call sites)
- `src/app/shared/components/faq-accordion/` — 126 lines across `.ts`/`.html`/`.scss` (one definition, 3 call sites)

Net: **-512 lines removed from page components, +280 lines of new shared code, for a net reduction of 232 lines sitewide** — while consolidating what were 3–4 duplicated copies of each pattern into exactly one.

Per-file SCSS reduction:

| File | Before → After |
|---|---|
| `agentic-ai.component.scss` | 159 → 17 lines |
| `compensation-total-rewards.component.scss` | 152 → 27 lines |
| `ai-governance.component.scss` | 97 → 16 lines |
| `faq.component.scss` | 134 → 64 lines |
| `home.component.scss` | 69 → 10 lines |

## Affected pages

Home, FAQ, Agentic AI, Compensation & Total Rewards, AI Governance — all five verified to render identically pre/post-refactor at mobile (375px) and desktop (1280px), including grid column counts, card spacing, CTA banner layout, and (now-fixed) FAQ open-state contrast.

## Maintenance improvement

Before this sprint, fixing the cross-browser accordion-marker bug (Sprint 4) required editing three files by hand, and the open-state contrast bug existed silently in two of them for two sprints before this audit caught it. Any future accordion fix, card-grid column change, or CTA-banner style change now happens in one file and applies everywhere automatically — the next FAQ-carrying page a developer builds gets the fix for free instead of needing to remember to copy it correctly a fourth time.

## Verified

- Production build: clean, no warnings. Lazy chunk sizes *decreased* for all three affected service pages (Agentic AI −3.18kB, Compensation −2.93kB, AI Governance −1.82kB raw), while global `styles.css` grew by +2.09kB (the shared code now living once instead of duplicated per-chunk) — a net sitewide payload reduction.
- `tsc --noEmit`: clean.
- Rendered in-browser at mobile (375px) and desktop (1280px) for all five affected pages: hero, grids, trust strips, FAQ accordions, CTA banners all pixel-identical to pre-refactor screenshots.
- FAQ accordion toggle/close-others behavior verified intact via direct `toggle` event dispatch (the synthetic `.click()` unreliability on `<details>` in this preview harness was already documented as a testing-tool limitation in Sprint 1.5, not an app defect).
- No console errors on any page.
