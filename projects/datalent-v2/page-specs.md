# Page Specifications — Wave 1 (First Release)

**Objective this document serves:** a complete, buildable spec for each of the seven first-release pages named in the requirement, each covering all ten required fields. Every claim, persona, and CTA below is sourced from a specific strategy document already in `projects/datalent-v2/` — none is invented at this layer.

**Standing rule across every page below (Required Evidence section):** per `.claude/memory/non-fabrication-policy.md`, no page in Wave 1 may publish a specific outcome statistic, client count, or named client logo. `roadmap.md`'s Phase 1 has not yet produced a case study. Every page's Required Evidence field states what's needed before a stronger claim can be made — until then, pages lead with methodology, governance, and specificity of approach, not unproven numbers. This is the direct, page-level enforcement of the same finding `docs/website-audit.md` and `docs/business-audit-v2.md` both raised against the current site.

---

## 1. Home (`/`)

- **Purpose:** establish the category ("Agentic AI for HR, European-governed"), state the four positioning pillars, and route every visitor to the correct next step for their tier.
- **Target persona:** broad entry point, but primary is the **CHRO/HR Director** persona (`ideal-client-profiles.md` Tier 1) since this is the segment most likely to arrive here directly rather than via a targeted service page.
- **Business goal:** qualify and route — split traffic toward `/contacto?motivo=diagnostico` (Tier 1) or `/contacto?motivo=briefing` (Tier 2/3), and toward the relevant service page for anyone who already knows what they need.
- **SEO goal:** rank for the core category terms ("agentic AI RRHH," "IA agéntica recursos humanos," "people analytics España") — explicitly excluding job-seeker and competitor-brand terms (per `docs/business-analysis.md`'s finding that the current site's meta-keywords include "eurofirms," "adecco," and job-board terms that dilute the B2B positioning; Wave 1 keyword strategy corrects this, not repeats it).
- **Primary CTA:** dual — "Solicitar Diagnóstico Gratuito" / "Reservar Briefing Ejecutivo" (see `site-map.md`'s CTA Placement section).
- **Supporting CTAs:** "Ver Servicios" (→ `/servicios`), newsletter signup, "Preguntas Frecuentes" (→ `/faq`).
- **Required evidence:** zero unsourced statistics (replacing the current site's "10 empresas, 65%, 92%" pattern per `docs/website-audit.md`); the four-pillar proof grid uses qualitative, falsifiable statements (e.g., "cada agente tiene límites de autonomía definidos y un punto de control humano documentado") rather than percentages; any future case-study teaser slot stays hidden/unbuilt until `roadmap.md` Phase 1 delivers real content, not populated with a placeholder that reads as real.
- **Internal links:** → all six service pages (teaser grid, five live in Wave 1, Workforce Intelligence held per `site-map.md` until Wave 2), → `/contacto` (both CTA variants), → `/faq`, → `/newsletter`.
- **Expected conversion role:** top-of-funnel awareness/consideration hub — the page most likely to be a visitor's first touch, and the page responsible for correctly routing them onward rather than converting directly itself.

---

## 2. Services Hub (`/servicios`)

- **Purpose:** present the six practices as one integrated system (Pillar 4), not six disconnected offerings — the structural home of "Integrated Full Talent Lifecycle."
- **Target persona:** **HR Technology Analyst** persona (`docs/business-audit-v2.md`) — the buyer trying to determine "what exactly do you offer, and is this software or a service" before going deeper.
- **Business goal:** resolve the software-vs-service ambiguity explicitly (per `business-model.md`'s core decision: advisory-led, technology-enabled) and route to the correct individual service page.
- **SEO goal:** rank as the authoritative hub page for "servicios de RRHH con IA" / "consultoría people analytics y gobernanza IA" — the page Google should surface for a broad service-category query, funneling long-tail traffic to the specific service pages.
- **Primary CTA:** "Reservar Briefing Ejecutivo" (this persona is further along the evaluation journey than a first-touch Tier 1 visitor).
- **Supporting CTAs:** individual "Ver servicio →" links into each of the six service cards; the two named bundles from `service-catalog.md` ("Compliant Launch," "Evidence-Based Talent") presented as explicit cross-practice packages, not just six isolated cards.
- **Required evidence:** each service card's one-line description must match `service-catalog.md`'s Entry Point language exactly (no drift between what this hub promises and what the dedicated page delivers); the "advisory-led, technology-enabled" framing must appear explicitly on this page, since it's the page most directly answering the HR Technology Analyst's disqualifying question from `docs/business-audit-v2.md`.
- **Internal links:** → all six service pages, → the two bundle anchors, → `/contacto`, → `/por-que-datalent` (Wave 2, inactive link per `site-map.md` until built).
- **Expected conversion role:** consideration-stage hub — a visitor here is past "what is Datalent" and into "which of these do I need," so its job is disambiguation and routing, not first-touch persuasion.

---

## 3. Agentic AI for HR (`/servicios/agentic-ai-rrhh`)

- **Purpose:** define the agentic-vs-automation distinction concretely (Pillar 1) and describe the actual service (`service-catalog.md` §1: Agentic Workflow Feasibility Review → agent spec → Governed Agent Retainer).
- **Target persona:** **HR Technology Analyst** and the **Gartner-Analyst-equivalent internal evaluator** (`ideal-client-profiles.md` Tier 3) — buyers specifically trying to determine whether "agentic" here is real or marketing language.
- **Business goal:** drive bookings of the Agentic Workflow Feasibility Review (`service-catalog.md`'s Entry Point) and, for Tier 3 visitors arriving via a platform-vendor-pilot trigger, position the independent-governance-review angle from `competitive-differentiation.md`'s Workday battlecard.
- **SEO goal:** own the category term itself — "agentic AI RRHH," "IA agéntica recursos humanos," "agentes de IA gobernados RRHH" — this is the single most important page for `positioning.md`'s category-creation goal, since it's the page a search for the category term should land on.
- **Primary CTA:** "Reservar Briefing Ejecutivo."
- **Supporting CTAs:** link to the AI Governance page (the two are structurally paired per `positioning.md`), FAQ deep-link to the "¿Vuestra IA toma decisiones de forma autónoma...?" entry (`docs/business-audit-v2.md`'s FAQ rewrite).
- **Required evidence:** the agentic-vs-automation test itself (`.claude/memory/positioning-decisions.md`'s definition) stated in full and applied to a real example — this page is where the definition has to hold up under scrutiny, since it's the page that makes or breaks the category claim; every capability description follows Reasoning Pattern 5 (`.claude/intelligence/reasoning-patterns.md`) — a governance-companion-sentence for every autonomy claim, no exceptions on this page specifically.
- **Internal links:** → AI Governance page (bidirectional), → `/contacto`, → the Compliant Launch bundle on `/servicios`.
- **Expected conversion role:** decision-stage for Tier 2/3, consideration-stage for Tier 1 — the page a technically-skeptical buyer reads closely before booking, so its job is to survive scrutiny, not just to persuade quickly.

---

## 4. People Analytics (`/servicios/people-analytics`)

- **Purpose:** describe the diagnostic-first, methodology-transparent approach (`service-catalog.md` §2) and differentiate from a pure dashboard/BI product (Visier's terrain, per `competitive-differentiation.md`).
- **Target persona:** **People Analytics Director** (`docs/business-audit-v2.md`).
- **Business goal:** drive bookings of a culture/engagement/attrition diagnostic; for Tier 2 prospects already running Visier or a similar platform, position as the methodology-validation layer, not a replacement platform (`competitive-differentiation.md`'s Visier battlecard).
- **SEO goal:** "people analytics España," "diagnóstico de cultura organizacional con datos," "análisis de rotación basado en evidencia" — deliberately not competing on the generic "HR software" query cluster Visier already owns.
- **Primary CTA:** "Solicitar Diagnóstico Gratuito" (this practice's entry point is the most naturally Tier-1-accessible of the six).
- **Supporting CTAs:** link to Compensation & Total Rewards page (natural adjacency — attrition analysis often surfaces a comp question) and to the "Evidence-Based Talent" bundle on `/servicios`.
- **Required evidence:** the methodology-transparency claim (`value-proposition.md`'s People Analytics value statement: "with the methodology shown, not just the number") must be demonstrated on-page, not just asserted — e.g., a described (not fabricated) example of what a methodology disclosure looks like, clearly marked as illustrative; any bias-testing claim carries the same governance-companion-sentence discipline as the Agentic AI page, since predictive scoring work is explicitly bias-audit-relevant per `.claude/knowledge/ai-governance.md`.
- **Internal links:** → Compensation & Total Rewards page, → AI Governance page (for any predictive/scoring component), → `/contacto`.
- **Expected conversion role:** consideration-to-decision for Tier 1/2 — typically a warmer visitor already sold on "we need data-driven HR," needing to be convinced Datalent's specific approach is trustworthy.

---

## 5. Compensation & Total Rewards (`/servicios/compensacion-total-rewards`)

- **Purpose:** cover both `service-catalog.md` §3 and §4 as one page (matching that document's own note that Total Rewards typically nests inside the Comp & Benefits relationship rather than standing alone), anchored on the live EU Pay Transparency Directive compliance driver.
- **Target persona:** **Compensation Director** (`docs/business-audit-v2.md`) — the persona the current live site has zero content for at all, per `docs/business-audit-v2.md`'s original finding; this page is the direct fix.
- **Business goal:** drive bookings of a pay equity audit or market benchmark (`service-catalog.md`'s Entry Point), positioned against the live regulatory deadline for urgency.
- **SEO goal:** "auditoría de brecha salarial España," "cumplimiento directiva transparencia retributiva UE," "benchmarking salarial RRHH" — high-intent, compliance-driven search terms tied to a real, dated regulatory trigger (`.claude/knowledge/compensation-total-rewards.md`'s EU Pay Transparency Directive entry).
- **Primary CTA:** "Reservar Briefing Ejecutivo" (comp/pay-equity engagements typically involve Legal/Compliance stakeholders per `ideal-client-profiles.md` Tier 2, warranting the higher-touch CTA by default).
- **Supporting CTAs:** "Solicitar Diagnóstico Gratuito" as a secondary option for a Tier 1 visitor with a simpler benchmarking need; link to the pay equity audit methodology explanation.
- **Required evidence:** the raw-vs-adjusted pay gap distinction (`.claude/templates/pay-equity-audit-report-template.md`'s own non-negotiable) must be explained on this page, not just referenced — this is the credibility test for a Compensation Director persona specifically, per `.claude/agents/compensation-benefits-specialist.md`'s standard against reporting an unadjusted gap as if it were the final finding; no specific benchmark figure or gap percentage appears anywhere on this public page (that's client-specific engagement output, never generic marketing content, per `pricing-strategy.md`'s own restraint on publishing unvalidated figures applied here to a different kind of number).
- **Internal links:** → People Analytics page, → AI Governance page (if any automated pay-setting tool is discussed), → `/contacto`.
- **Expected conversion role:** decision-stage — this persona typically arrives already aware of the regulatory deadline and searching for a specific solution, so the page's job is proving competence quickly, not generating awareness.

---

## 6. AI Governance (`/servicios/gobernanza-ia`)

- **Purpose:** the deepest structural home of Pillars 1 and 2 together — risk classification, human oversight design, bias-audit methodology, data residency (`service-catalog.md` §5).
- **Target persona:** **HR Technology Analyst** and an implied **Legal/Compliance** stakeholder (`ideal-client-profiles.md` Tier 2/3's buying committee) — this page is written to survive being forwarded internally to Legal, not just read by HR.
- **Business goal:** drive bookings of an EU AI Act risk classification engagement (`service-catalog.md`'s Entry Point — "the fastest, most defensible product in the entire catalog") and seed the Governed Agent Retainer conversation.
- **SEO goal:** "clasificación de riesgo IA Reglamento Europeo," "cumplimiento EU AI Act RRHH," "auditoría de sesgo IA selección de personal" — regulatory-compliance search intent, the highest-value keyword cluster for Tier 2/3 given the EU AI Act's binding timeline.
- **Primary CTA:** "Reservar Briefing Ejecutivo."
- **Supporting CTAs:** link to Agentic AI for HR page, FAQ deep-links to the governance/data-residency/bias-audit entries from `docs/business-audit-v2.md`'s "Confianza, Datos e IA Agéntica" block.
- **Required evidence:** correct, current EU AI Act vocabulary throughout — risk tiers, Provider/Deployer roles, Article 22/GDPR interplay — sourced from `.claude/knowledge/eu-ai-act.md` and `.claude/knowledge/compliance-glossary.md`'s actual definitions, not loosely paraphrased; every governance claim on this page follows `.claude/knowledge/eu-ai-act.md`'s own standard of stating the risk tier *with reasoning*, never asserted bare; no claim of a completed conformity assessment or certification unless one is real (`[VALIDATE]` explicitly if this page is drafted before that's confirmed true).
- **Internal links:** → Agentic AI for HR page (bidirectional), → `/faq`'s trust block, → `/contacto`.
- **Expected conversion role:** decision-stage, often the final page before a Tier 2/3 contact form submission — the page carrying the most reputational weight of the seven, since a factual error here would undermine the entire European-governance positioning pillar it exists to prove.

---

## 7. Contact / Book a Call (`/contacto`)

- **Purpose:** the universal conversion destination for both CTA tiers, replacing the current single in-page anchor form with a dedicated, qualification-aware page.
- **Target persona:** all — this page's job is to route correctly, not to persuade (persuasion already happened on whichever page sent the visitor here).
- **Business goal:** capture a correctly-qualified lead — specifically fixing `docs/business-audit-v2.md`'s finding that every current submission is tagged "Consulta general" regardless of which service or CTA the visitor actually engaged with.
- **SEO goal:** minimal — this page is a conversion destination, not a discovery page; light optimization only for branded/direct-navigation queries ("contactar Datalent Solutions").
- **Primary CTA:** the form submission itself, pre-filled/pre-selected by the `?motivo=` query parameter carried from whichever page linked here (diagnostico / briefing / a specific service name).
- **Supporting CTAs:** a direct email fallback (`gmorales@datalentsolutions.com`, per the existing site's established contact pattern), newsletter signup as a lower-commitment alternative for a visitor not ready to submit a full inquiry.
- **Required evidence:** an honest CTA label — "Reservar Briefing Ejecutivo" must not imply an automated calendar-booking flow (e.g., Calendly-style instant scheduling) unless one is actually integrated; Wave 1 ships with a qualified-contact-form promising a scheduled follow-up within a stated response window, and real calendar-tool integration is a fast-follow noted in `sprint-01.md`'s dependencies, not silently implied as already present — this is the same non-fabrication discipline applied to a UX affordance, not just a written claim.
- **Internal links:** ← inbound from every other Wave 1 page; outbound → `/faq` (for a visitor who lands here with a question better answered there than by a form).
- **Expected conversion role:** bottom-of-funnel, the single conversion event this entire IA is built to produce — every other page's "Expected conversion role" ultimately points here.

## Cross-Page Consistency Note

Persona assignments above map 1:1 to `docs/business-audit-v2.md`'s six-persona panel and `ideal-client-profiles.md`'s three tiers — no new persona is introduced at the page-spec layer. CTA labels are identical across every page (no page invents a new call-to-action phrase) so that `sprint-01.md`'s component plan can build exactly two CTA button variants and reuse them everywhere, rather than one-off buttons per page.
