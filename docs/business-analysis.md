# Business Analysis

*Based solely on content present in the repository (copy, meta tags, structured data, testimonials, FAQ). No external research was performed.*

## What Datalent Solutions sells

Datalent Solutions is positioned as a **boutique HR/people-analytics consultancy** ("firma boutique") based in Tarancón, Cuenca (Spain), targeting **PYMES (SMEs) and larger companies**, with stated service reach across Spain, Europe, and Latin America (`areaServed: ES, MX, CO, AR, CL` in the Organization schema; footer language claims "trabajamos globalmente en Latinoamérica y Europa").

Four core service lines (from the `services` section and FAQ):

1. **Recruitment Predictivo** — predictive/evidence-based hiring: cultural fit, motivational fit, skills validation, an "internal Target Score," employer branding, retention-focused onboarding.
2. **Diagnóstico y Desarrollo (Organizacional)** — culture/engagement measurement, bias analysis, internal mobility, productivity/equity diagnostics.
3. **Upskilling & Reskilling** — measurable learning programs, digital competencies, employability/performance improvement.
4. **IA y Automatización para PYMES** — recruitment process automation, automated reporting/dashboards, internal chatbots/intelligent support.

## Positioning: HR

The HR positioning is built on a "**evidence + technology + human empathy**" triad, repeated consistently across hero copy, the "why us" section, FAQ, and the newsletter. Key differentiators claimed:

- **Technical rigor in evaluation**: "Evaluaciones realizadas por expertos en ingeniería y ciencia de datos, no por reclutadores generalistas" — explicitly positions against generalist recruiters/staffing agencies.
- **Geographic focus**: Spain/Europe market expertise as a trust signal (useful against large international platforms with less local nuance).
- **Speed**: "Rapidez y Precisión... pipeline especializado," reinforced by a stat claim of 65% time-to-hire reduction.
- **No lock-in**: FAQ explicitly states no long-term contracts/permanence requirements ("Creemos en relaciones basadas en confianza y resultados, no en cláusulas") — a trust-building answer to a likely objection for a small/unproven firm.
- **Outcome-oriented, not report-oriented**: "No entregamos informes que nadie lee: proponemos acciones aplicables" — directly targets a common complaint about traditional HR/culture consultancies.

Headline stats used as social proof (hero section): **10 empresas transformadas, 65% reducción en time-to-hire, 92% retención en primer año.** These are presented as hard numbers with no methodology, source, or date attached anywhere in the code or content — see [website-audit.md](website-audit.md) for the credibility risk this creates given the small stated client count (10).

## Positioning: AI

AI is positioned as an *enabler* of the HR value proposition, not a standalone product line — it appears woven through all four services (predictive models for fit/attrition, generative AI for automation, IA-driven dashboards, internal chatbots) rather than sold separately. The "IA y Automatización para PYMES" line is the most explicit AI product surface, but even there the framing is operational efficiency (process automation, reporting, support chatbots) rather than differentiated AI IP.

This is a **coherent but generic** AI narrative: "IA generativa," "analítica predictiva," and "automatización" appear in the title tag, meta description, hero, and services grid, but no content anywhere (case study, methodology page, whitepaper, or even a single named tool/technique) substantiates *how* the AI is built, what data it uses, or what makes it defensible versus a generic vendor claiming the same buzzwords. For a company whose meta description leads with "IA generativa," this is a positioning gap: the AI claim currently rests entirely on adjectives, not evidence.

## Target audience signals

- **Primary stated audience**: PYMES (repeated in meta keywords, services section, testimonials context) — i.e., small/mid-size companies, not enterprise.
- **Secondary/implicit audience**: larger companies ("grandes empresas" in the meta description) — this is a broader ICP claim not really substantiated by the "boutique firm, 10 clients" narrative elsewhere; there's tension between "boutique/personal" positioning and "we also serve large enterprises."
- **Buyer persona**: content is written for HR leaders / people leaders / founders directly responsible for hiring and culture decisions (not for individual job-seekers, despite the newsletter meta keywords oddly targeting "ofertas de trabajo de tarancon... eurofirms, adecco" — see below).
- Testimonials use first-name-plus-initial only (María G., Juan R., Sandra L., Carlos P.) with no company names, titles, or LinkedIn-verifiable identities — standard for early-stage social proof, but weaker than named/logo'd testimonials would be.

## Notable content inconsistency: newsletter/home meta keywords

`home.component.ts` sets page keywords to `'ofertas de trabajo de tarancon, ofertas de empleo de tarancon, vacantes de tarancon, eurofirms, adecco'` — i.e., job-board/job-seeker search terms and **competitor brand names** (Eurofirms and Adecco are staffing agencies). This is inconsistent with the rest of the site's B2B-consultancy-to-HR-leaders positioning and reads like a leftover experiment in ranking for local job-seeker traffic and/or competitor-name SEO. It's worth a deliberate decision: is Datalent also trying to capture job-seeker search traffic in Tarancón, or was this accidental copy-paste that should be removed? As written, it dilutes the primary ICP focus (see roadmap).

## Business model inference

- No pricing, packages, or self-serve purchase path anywhere — this is a **lead-generation site**, not a transactional one. The entire commercial motion funnels through: contact form → (presumably) sales conversation → "diagnóstico gratuito" (free diagnostic call).
- The primary CTA across the whole site is "Solicitar Diagnóstico Gratuito" (request a free diagnostic) — a classic B2B-services lead magnet. FAQ confirms: "Agenda una reunión de diagnóstico gratuita. En menos de 60 min analizaremos tu caso..."
- A secondary funnel exists via the **newsletter** ("Decidir con criterio humano y precisión analítica") — positioned as a thought-leadership/nurture channel, separate from the main sales CTA, aimed at building trust before a sales conversation.
- There is a commented-out **third funnel stage** in the hero — a "Descargar Guía Gratuita" (download free guide) lead-magnet CTA that was scaffolded but never shipped or connected to any actual asset.

## Legal / compliance posture

Privacy policy and cookie policy are provided as static PDFs (not HTML pages), consent is gated behind a mandatory checkbox on the contact form and a cookie banner with accept/reject. This reflects real GDPR-consciousness (reasonable for a company serving Spain/EU), but PDF-only policies are harder to keep current, harder to deep-link into from specific consent contexts, and are not crawlable/indexable the way HTML policy pages would be.
