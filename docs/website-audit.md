# Website Audit

Findings only — no code was changed to produce this document. Severity is rated by likely business impact, not just technical severity.

## SEO

### Critical
- **Zero analytics/tracking is actually installed.** `app.component.ts` calls `window['gtag'](...)` on cookie consent, but no GA4/GTM/any analytics script is loaded anywhere in `index.html` or elsewhere. The site currently has **no way to measure traffic, behavior, or conversions** at all. Every other SEO/conversion recommendation is unverifiable without this.
- **Sitemap only lists 4 URLs, and 3 of them are hash fragments of the homepage** (`/#services`, `/#contact`, `/#faq`), not real crawlable pages. The actual routed pages `/newsletter` and `/faq` (real Angular routes with unique content, title, and meta tags) are **missing from `sitemap.xml` entirely**. Hash-fragment URLs provide no SEO value in a sitemap — search engines index the base URL, not the fragment.
- **No `FAQPage` structured data** on `/faq`, despite the page being a textbook rich-result candidate (9 clean Q&A pairs in native `<details>` markup). This is a missed opportunity for FAQ rich snippets in search results, which meaningfully improve click-through rate for exactly this kind of content.

### High
- **Duplicate `Organization` JSON-LD blocks** in `index.html` (two separate `<script type="application/ld+json">` blocks both declaring `@type: Organization` with overlapping-but-different fields). Search engines may pick either or get confused; should be merged into one authoritative block.
- **`google-site-verification` meta tag is present but empty** (`content=""`) — Search Console verification via this method is not actually functioning.
- **`og:image` points to `https://www.datalentsolutions.com/assets/og-image.png`, which does not exist** in `src/assets/` (confirmed: no file of that name anywhere in the repo). Every social share (LinkedIn, WhatsApp, Slack, X) of this site will render with a broken/missing preview image.
- **No `LocalBusiness` schema**, only generic `Organization`, despite the company having a physical address (Tarancón, Cuenca) used both in the Organization schema and footer. `LocalBusiness` schema is what drives Google Maps/local pack visibility — relevant since the map was explicitly disabled for other reasons (see architecture doc), removing another local-signal channel.
- **Single-language site (`lang="es"`) with no `hreflang`**, despite Organization schema claiming service across ES/MX/CO/AR/CL and `availableLanguage: ["Spanish", "English"]`. If Latin America and English-speaking prospects are a real target, there's no internationalization scaffolding at all, and the language claim in structured data is not backed by actual content.
- **Meta keywords on the homepage include competitor brand names and unrelated job-seeker search terms** (`eurofirms, adecco, ofertas de trabajo de tarancon`) — see [business-analysis.md](business-analysis.md). Beyond the strategic confusion, `meta keywords` also carries no ranking weight in modern Google/Bing algorithms, so this is pure content debt.

### Medium
- `robots.txt` is minimally valid (`Disallow:` = allow all) but doesn't reference any crawl-delay or block on non-content routes; low risk given the site's small size.
- No breadcrumb is actually visible/functional — the "Breadcrumbs SEO" block in `app.component.html` is `class="hidden"` and only ever contains one static "Inicio" item regardless of route, so the `BreadcrumbList` schema is not accurate for `/newsletter` or `/faq`.
- Stat claims in the hero (10 empresas, 65%, 92%) have no attached source/date and no citation — search engines and users alike increasingly discount unsourced statistical claims; combined with only 4 testimonials with first-name-only attribution, the credibility signal is thinner than the design implies.

## Performance

### High
- **Tailwind CSS is loaded from CDN (`cdn.tailwindcss.com`) and JIT-compiled in the browser at runtime**, in addition to Angular's own compiled SCSS bundle. This is explicitly called out by Tailwind's own documentation as unsuitable for production: it ships the full unpurged runtime compiler, blocks rendering until it executes, and cannot be cached/optimized the way a build-time Tailwind integration or the site's existing SCSS approach can. This is very likely the single largest avoidable performance cost on the site.
- **Lucide icons loaded via `<script src="https://unpkg.com/lucide@latest">`** — unpinned version (`@latest`) is both a performance issue (no long-term caching, resolves differently over time) and a stability risk (a breaking change in Lucide ships to production with zero warning, since nothing in the repo pins a version).
- **Leaflet (~150KB) ships in every page load** despite `MapComponent` being fully disabled/unused (see architecture doc). This is dead weight on every route, not just the homepage.
- Two large, non-optimized PDFs sit in `src/assets/` (`cookie-policy.pdf` 564KB, `data-privacy.pdf` 552KB) — not render-blocking, but worth compressing given they're linked from the cookie banner and contact-form consent checkbox, both high-traffic UI touchpoints.

### Medium
- No lazy-loading of routes (`loadComponent`) in `app-routing.module.ts` — for a 3-route site the practical cost is currently low, but this should be addressed before more routes are added.
- Google Fonts (`Roboto` in `styles.scss`, `Inter` in `home.component.scss`) are imported via `@import url(...)` in two different SCSS files rather than preloaded/self-hosted — `@import` in CSS is render-blocking and slower than a `<link rel="preload">`/self-hosted font strategy. Two different font families are loaded for what should likely be one consistent typographic system (see design section).
- `index.html` already declares `<link rel="preconnect">` for the CDN/API origins it uses — that part is done correctly.

## Accessibility

### High
- **Fifteen instances of `<a (click)="...">` with no `href` attribute**, used as buttons throughout navigation, footer, and CTAs (e.g., `main-topbar.component.html`, `footer.component.html`, `faq.component.html`). These are not real links: they are not keyboard-focusable by default, don't respond to Enter/Space without extra work, and are not announced as buttons by screen readers. Every one of these should be a native `<button>` or have `role="button"` + `tabindex="0"` + keyboard handlers.
- **Zero `alt` attributes and zero `<img>` tags found in any component template** — this isn't a violation in itself (the site currently uses no `<img>` elements; the logo is text, icons are Lucide/emoji), but it does mean the site currently has no images to communicate visually distinct content, and if images are added later (team photos, logos, diagrams) alt-text discipline will need to be established from scratch — there's no existing pattern to follow.
- **Emoji used as the only signifier for problem/solution icons** (⏱️ 🎯 ✓ 🚀 ⚙️ 📊 in the "Qué Resolvemos" grid) with no `aria-hidden="true"` or accompanying `aria-label`, meaning screen readers will announce raw emoji names/descriptions interrupting the flow of each card's heading.
- Only **3 total `aria-*` attributes** exist across the entire template codebase (checked with `grep -rn 'aria-' src/app --include='*.html'`), for a site with a mobile hamburger menu, an accordion FAQ, a cookie banner, and a chatbot launcher — all patterns that standardly need ARIA state (`aria-expanded`, `aria-controls`, `aria-live`, etc.).

### Medium
- Mobile menu toggle (`main-topbar.component.ts` `toggleMobileMenu()`) has an `aria-label="Abrir menú"` on the button itself, but doesn't toggle `aria-expanded` based on open/closed state, and the label doesn't change to "Cerrar menú" when open.
- Form status message (`<div id="form-status" ... role="alert">`) is correctly using `role="alert"` on both the contact form and newsletter form — this is a genuine accessibility strength worth preserving.
- FAQ accordion uses native `<details>/<summary>`, which is a strong accessibility choice (free keyboard support, free screen-reader semantics) — better than the custom-JS approach many sites use. The manual "close others when one opens" JS in `faq.component.ts` (`ngAfterViewInit`) works with the native element without breaking its semantics, which is good.
- Color contrast wasn't independently measured in this audit (no rendering/screenshot tooling was used, per "no code changes" scope), but the light-theme CSS variables defined in `styles.scss` (`--color-text-light: #666666` on `--color-light: #f8f9fa`) are never actually applied anywhere against the site's real dark theme, so they carry no real accessibility risk today — they're simply unused.

## UX

### High
- **The site is architecturally a single long-scroll homepage plus two isolated sub-pages** (`/newsletter`, `/faq`) that are visually and structurally disconnected from the homepage's design language: `faq.component.html` ships its own embedded `<style>` block with different CSS variables and a different cyan (`#19caff` vs. the homepage's `#00eaff`), producing a visible, if subtle, brand inconsistency when a user navigates from home to FAQ.
- Every internal nav link (topbar, footer, in-page CTAs) that targets a homepage section does `router.navigate(['/'])` followed by a `setTimeout(..., 50)` before calling `scrollIntoView`. This is a **race-condition-prone pattern**: 50ms is a guess, not a guarantee that the route has finished rendering, especially on slower devices/connections — on a slow load this will silently fail to scroll to the target section.
- Duplicate/inconsistent method naming across near-identical components: `footer.component.ts` has `openFaq()`, `main-topbar.component.ts` has `openfaq()` (lowercase f) and a separate unused `isfaq()`/`isFaq()` naming split from `app.component.ts`'s `isFaq()`. Not user-visible, but signals the navigation logic has been copy-pasted three times instead of centralized, which increases the odds of exactly the kind of scroll-timing bug above being fixed in one place and not the others.

### Medium
- The chatbot button in `main-topbar.component.html` is visible on every page but does nothing (`<!-- Aquí se integraría el chatbot real -->`) — a non-functional affordance is worse for trust than no affordance at all, since users who click it get no feedback.
- The "Descargar Guía Gratuita" secondary CTA is commented out in the hero, leaving only a single primary CTA. This isn't necessarily wrong (single strong CTA can outperform two competing ones) but it suggests unfinished work rather than a deliberate simplification, especially paired with the newsletter's own unconnected lead-magnet framing.
- Testimonials ("RESEÑAS DE GOOGLE" section) load a third-party widget script (`cdn.trustindex.io/loader.js`) at runtime via `Renderer2.appendChild`, appended into a `#googleReviews` element — but no element with `id="googleReviews"` exists anywhere in `home.component.html` (confirmed by reading the full template). This call will silently fail (`appendChild` on `null` throws, but it's unguarded) every time the homepage loads. **This looks like a live bug**, not just a design note — worth the user's attention even though it falls outside "architecture."

## Conversion

### Critical
- With no analytics installed (see SEO section), **there is currently no way to know the contact-form or newsletter conversion rate, drop-off points, or which service/CTA drives leads.** This should be the first fix, because every other conversion recommendation below is a hypothesis until it can be measured.
- Contact form has no spam protection (no CAPTCHA/honeypot) beyond HTML5 `required`/`type="email"`. A lead-gen form with no bot protection risks both spam pollution of the sales pipeline and — depending on the EmailJS plan's rate limits — potential service disruption from automated abuse.

### High
- The single primary CTA label ("Solicitar Diagnóstico Gratuito") is strong and consistent site-wide — a genuine strength, not a finding to fix.
- Hero stats (10 empresas, 65%, 92%) are the first thing a visitor sees and are unsourced. For a small/boutique firm, unverifiable big numbers can undercut trust rather than build it, especially next to testimonials with first-name-only attribution and no company names/logos.
- Newsletter signup captures email via raw DOM query (`document.getElementById('email')`) rather than the Angular form model already bound via `ngModel`/`#emailCtrl="ngModel"` on the same input — functionally works today, but it means client-side validation state (`emailCtrl.invalid`) and the actual submitted value are read from two different sources, which is fragile if the template changes.
- No progressive profiling or service-specific routing on the contact form — every inquiry, regardless of which of the 4 services (or which of the in-page service anchors like `#recruitment`, `#diagnostico`, `#upskilling`, `#ia-automatizacion`) a visitor arrived from, submits with a hardcoded `service_interest: 'Consulta general'` (see `home.component.ts` `onSubmit`). This throws away valuable lead-qualification signal that the site's own IA/URL structure already captures.

### Medium
- No exit-intent, scroll-depth, or secondary lead-capture mechanism exists outside the bottom-of-page contact form and the separate `/newsletter` route — a visitor who doesn't scroll all the way down or navigate to `/newsletter` has no other conversion opportunity.
- Trust signals (client logos, certifications, team credentials, case studies with real names/numbers) are absent; the "why us" differentiators are asserted in prose rather than evidenced.
