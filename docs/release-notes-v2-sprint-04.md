# Release Notes — Website v2, Sprint 4 (Compensation & Total Rewards)

**Tag:** `v2-sprint-04`
**Scope:** new page at `/servicios/compensacion-total-rewards`, a cross-browser accordion-marker fix propagated to three pages, and a nav/footer consistency fix.

## What shipped

New page per `page-specs.md` §5 — the direct fix for `docs/business-audit-v2.md`'s original finding that the Compensation Director persona had zero content on the live site. Covers both `service-catalog.md` §3 (Comp & Benefits) and §4 (Total Rewards) as one page, matching that document's own note that Total Rewards nests inside the Comp & Benefits relationship rather than standing alone. Nine sections, built entirely from shared components (Hero, Timeline, Card, Badge, FeatureCard, Cta, Section):

- **Hero** — dual CTA (briefing primary, diagnóstico secondary), per the spec's persona-driven CTA choice.
- **Por qué importa la estrategia retributiva** — pay philosophy (lead/match/lag), job architecture as the foundation, internal-equity-vs-external-competitiveness tension.
- **Transparencia retributiva** — the raw-vs-adjusted pay gap distinction *explained*, not just referenced, per the page spec's Required Evidence rule. No gap percentage or benchmark figure appears anywhere on the page — that's client-specific engagement output, never generic marketing content.
- **Directiva Europea de Transparencia Retributiva** — Directive (EU) 2023/970, framed as a live compliance driver (transposition deadline 7 June 2026 has already passed), with the four minimum requirements from `.claude/templates/pay-equity-audit-report-template.md`'s compliance checklist.
- **Marco de Total Rewards** — the WorldatWork five-element model (compensation, benefits, well-being, recognition, development/career).
- **Casos de consultoría típicos** — three cards: pay equity audit, market benchmark + pay structure design, Total Rewards audit.
- **Metodología de entrega** — a `Timeline` combining both practices' Entry → Design & Deployment → Retained structure, explicitly noting Total Rewards has no standalone retained stream.
- **FAQ** — three questions, including "¿Ofrecéis servicios de equidad retributiva o benchmarking salarial?" answered affirmatively now that the practice is represented (unlike the earlier `docs/business-audit-v2.md` draft's placeholder "no, roadmap" answer).
- **CTA** — both CTA variants side by side, plus a `FeatureCard` cross-link to AI Governance (AI-assisted pay equity monitoring needs its own risk classification).

JSON-LD: a `Service` block, additive to the site-wide `Organization` block.

## Defects fixed along the way

- **Cross-browser FAQ-accordion marker bug.** `<summary>` elements only had `::-webkit-details-marker` hidden, which doesn't suppress modern Chromium's native `list-style: disclosure-closed` marker — every accordion on the site was showing both a native triangle *and* the custom `+`/`−` indicator. Fixed by adding `display: block` to `summary` (removes the native list-item marker without affecting the element's native toggle behavior, which comes from HTML semantics, not CSS display). Fixed in all three places it existed: the FAQ page, the Agentic AI page, and this new page (AI Governance has no FAQ section, so it never had the bug).
- **Footer/nav practice-list inconsistency.** `nav-items.ts` already treated "Compensación y Total Rewards" as one combined entry, but `footer.component.ts` kept its own separate list with "Compensación y Beneficios" and "Total Rewards" as two different unlinked items — a factual mismatch now that there's exactly one page covering both. Merged into one entry, matching `nav-items.ts`.
- **Footer's "Agentic AI" entry was still unlinked.** Sprint 3 updated `nav-items.ts` for the header/mobile-menu but missed that the footer keeps its own separate `PRACTICES` list — the footer link was silently stale since Sprint 3. Fixed alongside the Compensation entry.

## Verified

- Production build: clean, no warnings. `tsc --noEmit`: clean.
- Rendered in-browser at mobile (375px) and desktop (1280px): dual-CTA hero, 3-column engagement grid (mobile stacks), Timeline, FAQ accordion (single marker now) — all correct.
- Both JSON-LD blocks parse as valid, non-conflicting schema.org objects.
- Every internal link on the page resolves to a real, registered route (`/`, `/servicios/agentic-ai-rrhh`, `/servicios/gobernanza-ia`, `/newsletter`, `/faq`, `/contacto` + query params) — no dead links.
- Footer PDF assets (`data-privacy.pdf`, `cookie-policy.pdf`) confirmed to exist on disk.
- No console errors.

## Out of scope / not touched

- People Analytics page (still doesn't exist) — the spec's "→ People Analytics page" internal link was skipped rather than linking to a page that doesn't exist yet, consistent with how prior sprints handled the same gap for other unbuilt pages.
