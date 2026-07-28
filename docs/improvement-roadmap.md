# Improvement Roadmap

This backlog is ordered by **business impact** (leads generated, trust built, or risk avoided) rather than technical convenience. Each item references the finding in [website-audit.md](website-audit.md) or [architecture.md](architecture.md) it addresses. No code has been changed — this is a plan for future work.

Effort is a rough sizing (S = hours, M = 1-2 days, L = multi-day) assuming one developer already familiar with this codebase.

## Tier 0 — Do first (foundational, blocks measuring everything else)

| # | Item | Why it's #1-tier | Effort |
|---|------|----|--------|
| 1 | **Install real analytics (GA4 or privacy-friendly alternative) and wire the existing `gtag` consent code to it** | The cookie banner already calls `window['gtag'](...)` on accept/reject — the consent UX is built, but there's no analytics script to receive it. Without this, no other conversion/SEO decision on this list can be validated with data. Highest leverage single change in the repo. | S |
| 2 | **Fix the broken TrustIndex Google Reviews widget** (`home.component.ts` `renderTrustIndexGoogleReviews()` targets `#googleReviews`, which doesn't exist in the template) | This is a live bug silently failing on every homepage load — the "social proof" section either shows nothing or errors quietly. Social proof directly affects conversion for a boutique/unknown consultancy. | S |
| 3 | **Fix `og:image`** (points to a non-existent `assets/og-image.png`) | Every LinkedIn/WhatsApp/social share of the site currently renders broken. For a B2B lead-gen site relying on referral/social sharing, this actively suppresses inbound traffic quality. | S |

## Tier 1 — High impact on lead generation & trust

| # | Item | Why | Effort |
|---|------|-----|--------|
| 4 | **Add spam protection to the contact and newsletter forms** (honeypot field is free/fast; reCAPTCHA v3 if bot volume justifies it) | Protects the actual sales pipeline from being polluted and protects the EmailJS quota from abuse. Directly protects revenue-generating channel. | S–M |
| 5 | **Route contact-form submissions with the actual service of interest instead of a hardcoded "Consulta general"** — capture which service anchor/section the visitor came from, or add a service dropdown | The site already segments into 4 services with distinct URLs (`#recruitment`, `#diagnostico`, `#upskilling`, `#ia-automatizacion`); this signal is generated but thrown away today. Better-qualified leads convert faster and let the team prioritize response. | S |
| 6 | **Source or remove the unverified hero stats** (10 empresas, 65%, 92%) — either attach a real methodology/date, or reframe as qualitative claims until enough client data exists to back them | These are the first thing every visitor sees. Unsourced big numbers next to first-name-only testimonials read as unverifiable to a skeptical B2B buyer; fixing this either strengthens or removes a credibility risk. | S (content decision, not engineering) |
| 7 | **Add `FAQPage` JSON-LD structured data to `/faq`** | Direct, low-effort path to FAQ rich results in Google search, which measurably improve click-through rate for exactly this content shape. The content already exists and is clean; this is schema-only work. | S |
| 8 | **Consolidate the duplicate `Organization` JSON-LD blocks in `index.html` into one, and fill in `google-site-verification`** | Removes ambiguity for search engines and unblocks actually verifying/using Search Console, which is needed to see real indexing/query data (ties back to Tier 0's analytics gap). | S |
| 9 | **Add `/newsletter` and `/faq` to `sitemap.xml`; remove the hash-fragment "pages"** (`/#services`, `/#contact`, `/#faq`) | The sitemap currently omits two real, unique-content routes and includes three URLs that provide no indexing value. Straightforward fix, direct SEO impact. | S |

## Tier 2 — Performance (affects bounce rate, mobile experience, Core Web Vitals/SEO ranking factor)

| # | Item | Why | Effort |
|---|------|-----|--------|
| 10 | **Replace the Tailwind CDN runtime build with a proper build-time Tailwind (or PostCSS) integration, or remove Tailwind and consolidate on the existing SCSS system** | Likely the single largest avoidable performance cost in the app — CDN Tailwind ships an unpurged runtime compiler and blocks rendering. Also currently the reason `'unsafe-inline'`/`'unsafe-eval'` are needed in the CSP (see item 15). Fixing this improves both performance and security posture at once. | M |
| 11 | **Remove the disabled `MapComponent` and the Leaflet dependency entirely** (or actually re-enable it with the SEO/security issue from commit `4a01993` fixed) | Currently shipping ~150KB of dead weight on every page load for a feature that renders nothing. Either ship it or remove it — the in-between costs users load time for zero benefit. | S |
| 12 | **Pin the Lucide icons CDN script to a specific version** instead of `@latest` | Removes both a caching inefficiency and the risk of an unannounced breaking change shipping straight to production. | S |
| 13 | **Compress `cookie-policy.pdf` (564KB) and `data-privacy.pdf` (552KB)** | Both are linked from high-traffic touchpoints (cookie banner, contact-form consent checkbox); compressing is low-effort and improves load feel at the exact moment a user is deciding whether to consent/submit. | S |

## Tier 3 — Accessibility (legal/reputational risk + real user exclusion)

| # | Item | Why | Effort |
|---|------|-----|--------|
| 14 | **Convert the 15 `<a (click)="...">` pseudo-links (nav, footer, in-page CTAs) to real `<button>` elements or add proper `role`/`tabindex`/keyboard handling** | These are currently unusable via keyboard navigation and mis-announced by screen readers. For a company selling "evidence-based, people-first" positioning, shipping an inaccessible site undercuts the brand story, and this is also a straightforward legal-exposure reducer in the EU. | M |
| 15 | **Add `aria-expanded` state to the mobile menu toggle and audit ARIA usage on the cookie banner and chatbot launcher button** | Only 3 `aria-*` attributes exist across the whole template layer today despite several interactive-state UI patterns (hamburger menu, cookie banner, floating chatbot button). | S |
| 16 | **Mark decorative emoji icons `aria-hidden="true"`** in the "Qué Resolvemos" problem cards | Prevents screen readers from announcing raw emoji descriptions mid-heading. | S |

## Tier 4 — Security & CSP hardening

| # | Item | Why | Effort |
|---|------|-----|--------|
| 17 | **Tighten the CSP once Tailwind CDN is removed** (item 10) — drop `'unsafe-inline'`/`'unsafe-eval'` from `script-src` | The current CSP's protective value is significantly weakened by these two directives, which exist only to support the Tailwind CDN runtime compiler. This is a direct unlock from item 10, not independent work. | S (after item 10) |
| 18 | **Reconcile `SECURITY.md`/`README.md` claims with GitHub Pages' real capabilities** — either move hosting to a platform that supports custom response headers (Cloudflare Pages, Netlify, Vercel) to actually deliver HSTS/`X-Frame-Options`/`X-Content-Type-Options`, or update the docs to stop claiming header-level protections that cannot be enforced on static GitHub Pages hosting | Current documentation overstates the site's actual security posture — HSTS and `X-Frame-Options` literally cannot be set via GitHub Pages. This is worth a deliberate decision (host migration vs. doc correction), not a silent gap. | M (decision) + S (docs) or L (migration) |

## Tier 5 — Architecture cleanup (developer velocity, not user-facing)

| # | Item | Why | Effort |
|---|------|-----|--------|
| 19 | **Delete the unused `app.module.ts`** (dead NgModule, unreferenced by `main.ts`) | Removes a source of confusion for future contributors who might assume it's the real app composition root. | S |
| 20 | **Delete or wire up the dead `faqs` array in `faq.component.ts`** (unused, and already out of sync with the hardcoded template content) | Prevents a future content edit landing in the wrong place. | S |
| 21 | **Centralize the `scrollToSection`/`openFaq`/`openNewsletter` navigation logic**, currently copy-pasted with inconsistent naming (`openFaq` vs `openfaq`, `isFaq` vs `isfaq`) across `app.component.ts`, `footer.component.ts`, and `main-topbar.component.ts` | Reduces the chance that the `setTimeout(50)` scroll race-condition (see UX audit) gets fixed in one copy and not the others. | M |
| 22 | **Consolidate the three parallel color-token systems** (Tailwind config in `index.html`, `styles.scss` CSS variables, and the inline `<style>` block in `faq.component.html`) into one design-token source | Currently three different near-identical cyans (`#00d4ff`, `#00eaff`, `#19caff`) are in use depending on page. Fixing this is what makes item 10 (Tailwind removal) clean rather than a bigger rewrite. | M |

## Strategic / content decisions (not pure engineering — flagged for the business owner)

- **Resolve the meta-keyword inconsistency**: homepage keywords currently target job-seeker/competitor-brand search terms (`ofertas de trabajo de tarancon`, `eurofirms`, `adecco`) while the rest of the site is a B2B consultancy pitch to HR leaders. Decide deliberately whether job-seeker SEO is a real secondary goal or remove it (see [business-analysis.md](business-analysis.md)).
- **Decide the AI positioning's evidentiary backing**: "IA generativa" is prominent in the title tag and meta description, but no page substantiates methodology, tooling, or a case study. Either produce that substantiating content (a methodology page, a named-technique case study) or soften the claim — this is a credibility/SEO decision, not a code fix.
- **Decide whether the chatbot launcher button should be built, hidden, or removed** — a visible, non-functional affordance currently sits on every page.
- **Decide whether the "Descargar Guía Gratuita" lead magnet is coming back** — it's commented out in the hero with no connected asset; either ship the guide or remove the residual code path.
