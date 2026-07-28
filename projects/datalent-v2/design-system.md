# Design System — Principles

**Objective this document serves:** the design philosophy every visual decision in `design-tokens.md`, `component-library.md`, and the two wireframe documents must trace back to. This document contains no implementation — no CSS, no Angular, no code of any kind — only the principles and their rationale.

**Evidence basis:** the four positioning pillars (`positioning.md`), the six-persona panel's verdicts on the current site (`docs/business-audit-v2.md`), and the technical/accessibility findings in `docs/website-audit.md` and `docs/architecture.md`.

## The Core Design Decision: A Deliberate Break From the Current Aesthetic

The live site today is dark-mode, neon-cyan (`#00eaff`/`#00d4ff`/`#19caff` — three unreconciled values, per `docs/architecture.md` §Styling architecture fragmentation), glow-shadow, tech-startup-coded. That aesthetic reads as *consumer SaaS* or *gaming-adjacent*, not as *European advisory firm*. This is a real strategic mismatch, not just a taste preference: `docs/business-audit-v2.md`'s six-persona panel found the current site fails the CHRO, Gartner Analyst, and Enterprise Sales Director personas specifically on credibility grounds — and visual register is part of credibility. A CHRO evaluating a boutique advisory partner (`positioning.md` Pillar 3: Senior Judgment) does not expect a neon glow aesthetic; that register belongs to product-led-growth consumer software, which is explicitly the model `business-model.md` rejected.

**Website v2's aesthetic direction is Minimalist European Consulting: restrained, high-contrast, content-forward, credible through precision rather than decoration.** Think the register of an Oliver Wyman, Boston Consulting Group, or a well-designed European regulator's public site — not a dark-mode developer tool.

## How Each Positioning Pillar Becomes a Visual Principle

| Pillar (`positioning.md`) | Visual translation |
|---|---|
| **Governed Autonomy** | Precision and restraint in the interface itself — no gratuitous motion, no auto-playing anything, every interactive element behaves predictably. A UI that respects the user's control is a small, consistent echo of a governance-first product philosophy. |
| **European by Design** | A light-forward, paper-and-ink palette (not dark-mode-by-default) — dark-mode-first reads as a specifically American/Silicon-Valley tech convention; a light, editorial palette reads closer to European institutional and consulting design. Generous whitespace, echoing continental European print and editorial design traditions rather than dense app-dashboard density. |
| **Senior Judgment, Boutique Scale** | Typographic hierarchy does the work color and decoration would otherwise do — confidence expressed through scale and spacing precision, not through visual noise. A senior consultant's slide deck is spare, not busy; the site should read the same way. |
| **Integrated Full Talent Lifecycle** | One consistent component system and one token set used identically across all six practice pages (`component-library.md`, `design-tokens.md`) — visual consistency *is* the proof of "integrated system, not six disconnected point solutions." A site that looked different page to page would visually contradict this pillar regardless of what the copy said. |

## Core Principles

1. **Restraint over decoration.** No gradient glows, no neon accents, no decorative animation without functional purpose. Every visual element must earn its place by supporting comprehension or hierarchy — this is the literal definition of minimalism applied here, not just an aesthetic preference.
2. **Content-forward.** Typography and whitespace are the primary design tools. Color is used sparingly and purposefully (primarily for CTAs, links, and governance/trust signaling), never as decoration for its own sake.
3. **One token system, no exceptions.** Every page, every component, draws from `design-tokens.md` alone. This directly closes `docs/architecture.md`'s finding of three competing, unreconciled color-token systems (Tailwind config, `styles.scss`, and a fourth inline `<style>` block in `faq.component.html`) — Website v2 has exactly one source of truth, matching the same single-source-of-truth discipline `.claude/integration/registry.yaml` established for the framework layer.
4. **Mobile-first, not mobile-adapted.** Every wireframe in this set is authored starting from the smallest viewport and built up, not designed for desktop and then compressed down — per the explicit requirement, and because `.claude/knowledge/marketing.md`'s and `docs/website-audit.md`'s own findings suggest a B2B buyer's first touch is increasingly likely to be a mobile search result, not a desktop session.
5. **Accessible by construction, not by retrofit.** WCAG AA is a design input, not a QA checklist run after the fact — every color pair in `design-tokens.md` is contrast-checked before it's specified, every interactive component in `component-library.md` states its keyboard and screen-reader behavior as part of the spec, not as an addendum.

## WCAG AA Commitments (Specific, Not Aspirational)

Directly closing the accessibility gaps `docs/website-audit.md` found on the current site:

- **Contrast:** every text/background pair used anywhere in the system meets or exceeds WCAG AA's 4.5:1 (normal text) or 3:1 (large text ≥24px/19px-bold, and non-text UI component boundaries) — see `design-tokens.md`'s Contrast Verification table for the actual computed ratios per pair.
- **Real interactive elements, not pseudo-links.** `docs/website-audit.md` found 15 instances of `<a>` elements with no `href`, used as buttons — functionally unreachable by keyboard and mis-announced by screen readers. Website v2's component library specifies real `<button>` semantics for every non-navigational action; `component-library.md`'s `CtaButtonComponent` and `NavLink` specs state this explicitly.
- **Touch targets ≥44×44px** on every interactive element, per WCAG 2.5.5 (Target Size, AAA in WCAG 2.1 but treated as a hard requirement here regardless, since it's also a baseline mobile-usability requirement independent of the AA/AAA distinction).
- **Visible focus states** on every interactive element, specified per-component in `component-library.md` — not the browser default, but not suppressed either (the current site does not visibly suppress focus outlines, which is good; v2 makes visible, on-brand focus states an explicit spec requirement rather than an accident of not having removed the default).
- **`aria-expanded` and equivalent state attributes** on every disclosure/toggle component (mobile menu, FAQ accordion) — `docs/website-audit.md` found the current mobile menu toggle lacks this; the `component-library.md` `MobileNav` spec requires it.
- **Motion respects `prefers-reduced-motion`.** Any transition or reveal-on-scroll behavior (the current site's `RevealDirective` pattern) must have a reduced-motion equivalent specified — stated as a requirement in `component-library.md`, not left to implementation discretion.
- **Semantic heading order.** Exactly one `<h1>` per page, strictly nested headings below it — a wireframe-level requirement enforced in both wireframe documents.

## Grid & Layout System

- **Mobile-first breakpoints:** base (0–599px), tablet (600–959px), desktop (960–1279px), wide (1280px+) — a four-tier system, simpler than the current unspecified ad hoc breakpoints, chosen to be easy to reason about consistently across every wireframe.
- **12-column grid** at desktop/wide, collapsing to a single-column stack at base/tablet — standard, predictable, and it's what lets the "one system, six practice pages" consistency principle (Pillar 4, above) actually hold in practice.
- **Container max-width:** content never spans the full viewport at wide breakpoints — a fixed, generous max-width with balanced margins is part of the "editorial, not dashboard" register.

## What This Aesthetic Deliberately Avoids

Stated explicitly, matching `positioning.md`'s own "What Datalent Is Not" discipline applied to visual design:

- No dark-mode-by-default — light, paper-forward surfaces are primary; a dark surface may exist for specific high-contrast moments (see `design-tokens.md`'s Ink surface) but is never the default reading mode.
- No glow/neon shadow effects, no gradient-heavy CTAs — these are the exact visual signature of the current site's fragmented cyan system and read as consumer-tech, not consulting.
- No stock "AI" visual clichés (circuit-board patterns, glowing brain/neuron imagery, particle animations) — these are generic and would undercut the specificity `positioning.md`'s category-creation goal depends on.
- No dense, app-dashboard-style information density on marketing pages — that register belongs inside a logged-in product experience, which this site is not (per `business-model.md`'s explicit "not a SaaS platform" decision).

## Cross-Document Consistency Note

Every principle above is a constraint the other four documents in this set must satisfy, not a suggestion — `design-tokens.md`'s actual values, `component-library.md`'s actual component specs, and both wireframe documents' actual layouts are all checked against this document, not the reverse.
