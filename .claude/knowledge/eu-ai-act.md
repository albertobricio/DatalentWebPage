# Knowledge Domain: EU AI Act

This domain is distinct from `ai-governance.md`: that file covers governance practice generally (any framework, any jurisdiction); this file covers the specific legal structure, obligations, and employment-context application of the EU AI Act itself.

## 1. Core Concepts

- **The Act regulates by risk tier, not by technology type.** It doesn't ask "is this machine learning?" — it asks "what risk does this specific use pose to health, safety, or fundamental rights?"
- **Employment is explicitly named as a high-risk domain.** Annex III of the Act lists specific high-risk use-case categories, and Employment (point 4) explicitly includes recruitment/candidate screening, targeted job advertisement placement, evaluating candidates, and decisions on promotion, termination, and task allocation based on behavior or traits, and monitoring/evaluating performance.
- **Obligations are role-based: Provider vs. Deployer.** The organization that builds/places an AI system on the market (Provider) carries different, generally heavier, obligations than the organization that uses it under its own authority (Deployer) — but Deployer obligations are real and cannot be waived by pointing to the vendor.
- **The Act phases in over time, not on a single date.** Different provisions (prohibited practices, general-purpose AI model obligations, high-risk system obligations) apply on different timelines following the Act's entry into force in August 2024.
- **The Act operates alongside GDPR, not instead of it.** An HR AI system in the EU is typically subject to both simultaneously — AI Act obligations do not substitute for GDPR obligations (data protection, Article 22 on automated decision-making, DPIA requirements).

## 2. Terminology

- **Provider** — the natural or legal person that develops an AI system (or has one developed) and places it on the market or puts it into service under its own name.
- **Deployer** — the natural or legal person using an AI system under its own authority, other than for purely personal, non-professional use. Most companies using an HR-AI tool are Deployers, even if they didn't build it.
- **Importer / Distributor** — additional supply-chain roles with their own, generally lighter, obligations.
- **Conformity assessment** — the process (internal or via notified body, depending on the system) confirming a high-risk AI system meets the Act's requirements before it's placed on the market or put into service.
- **CE marking** — the conformity marking required for high-risk AI systems, analogous to CE marking for other regulated products in the EU.
- **Notified body** — an independent organization designated to carry out third-party conformity assessments for certain high-risk categories.
- **Fundamental Rights Impact Assessment (FRIA)** — an assessment certain deployers must conduct before using a high-risk AI system, evaluating its impact on fundamental rights — directly relevant to employment-context deployments.
- **AI regulatory sandbox** — a controlled environment national authorities may offer for testing innovative AI systems under regulatory supervision before full market deployment.
- **General-Purpose AI (GPAI) model** — a foundation-style model with broad applicability across many downstream uses, subject to its own separate set of provider obligations, including enhanced obligations for models presenting "systemic risk."
- **AI Office** — the EU-level body established to support consistent application of the Act, particularly for GPAI models.

## 3. Best Practices

- Determine your organization's role (Provider, Deployer, or both, per system) explicitly for every AI system in use — this determination changes which obligations actually apply.
- Run a Fundamental Rights Impact Assessment for any high-risk deployment in an employment context, even where not strictly mandatory, as a matter of defensible practice.
- Build technical documentation as the system is developed, not retroactively once a regulator or client asks for it.
- Track the phased applicability timeline actively — treat AI Act compliance as an ongoing program with multiple milestone dates, not a single deadline.
- Where a GPAI model is embedded inside a purchased or built HR tool, clarify separately whether the GPAI provider's obligations have been met — this is a distinct question from the HR tool's own high-risk obligations.
- Read AI Act obligations together with GDPR obligations for the same system — a compliance review addressing only one is incomplete.

## 4. Frameworks

- **The Act's own four-tier risk pyramid** — Unacceptable risk (prohibited outright, e.g., certain social scoring or manipulative practices) / High-risk (heavily regulated, includes most employment AI) / Limited risk (transparency obligations, e.g., disclosing AI interaction) / Minimal risk (no specific obligations beyond general law).
- **Annex III high-risk use-case taxonomy** — the Act's explicit list of high-risk domains, of which Employment (point 4) is one; other points cover biometric identification, critical infrastructure, education, essential services, law enforcement, migration, and administration of justice, among others.
- **Article 6 classification rules** — the legal test for whether a system counts as high-risk, generally by reference to its Annex III use case and whether it poses a significant risk to health, safety, or fundamental rights (with narrow exceptions).
- **Article 9 risk management system** — the ongoing, iterative risk management process required throughout a high-risk system's lifecycle, not a one-time assessment.
- **Article 14 human oversight** — the Act's specific requirement that high-risk systems be designed to allow effective human oversight, including the ability for a human to decide not to use the system, to override or reverse its output, or to intervene/interrupt its operation.
- **Article 27 Fundamental Rights Impact Assessment** — required for certain deployers (notably including many public-sector and employment-adjacent high-risk deployments) before putting a high-risk system into use.

## 5. Decision Trees

**Is this AI system in scope of the EU AI Act at all?**
- Does the system operate in the EU market, or does its output affect people located in the EU, regardless of where the provider is based? If yes → in scope, regardless of the provider's own jurisdiction (this is directly relevant when evaluating non-EU HR-tech vendors).

**Is this employment-related AI system High-risk under Annex III?**
- Does it screen, rank, filter, or evaluate candidates? → High-risk.
- Does it make or materially assist decisions on promotion, termination, or contractual employment terms? → High-risk.
- Does it allocate tasks based on individual behavior, personal traits, or characteristics? → High-risk.
- Does it monitor or evaluate the performance/behavior of people in a work-related relationship? → High-risk.
- If none of the above apply and the system has no material effect on an individual's employment-related rights or opportunities → likely outside Annex III's Employment category, but confirm against the full Annex III text and Article 6 rather than assuming.

**Are we the Provider or the Deployer for this system?**
- Did we build the system, or have it built under our own name/brand, and place it on the market or into service? → Provider (heavier obligations: risk management system, technical documentation, conformity assessment, registration).
- Did we acquire and use the system under our own authority, without building or rebranding it? → Deployer (lighter but real obligations: human oversight implementation, FRIA where applicable, monitoring, informing affected individuals in specific circumstances).
- Note: a single organization can be a Provider for one system and a Deployer for another, or even both for the same system if it substantially modifies a system it acquired.

## 6. Anti-Patterns

- Assuming that purchasing a vendor's AI tool eliminates the buying organization's own obligations — Deployer obligations exist independently and cannot be fully outsourced to the Provider.
- Treating the Act as a single compliance deadline rather than a phased timeline with different provisions applying at different points.
- Documenting only the "AI product" itself while ignoring the surrounding process requirements (human oversight design, monitoring plan, FRIA where applicable).
- Assuming an automated CV-screening or ranking tool is "just software" and therefore out of scope — this is one of the most explicitly named high-risk use cases in Annex III.
- Ignoring the separate obligations that may attach to an embedded General-Purpose AI model within an otherwise compliant HR tool.

## 7. KPIs

- % of AI systems with a completed Provider/Deployer role determination
- % of high-risk systems with a completed Fundamental Rights Impact Assessment
- % of high-risk systems with current, complete technical documentation
- Time-to-compliance for newly deployed or newly classified systems
- Count and distribution of AI systems in use by risk tier

## 8. Common Mistakes

- Underestimating how broadly Annex III's Employment category sweeps — most predictive or scoring-based HR tools default to High-risk, not Limited-risk.
- Conflating Limited-risk transparency obligations (e.g., disclosing AI interaction to a user) with the much heavier High-risk obligations (risk management, documentation, human oversight, conformity assessment) — these are materially different compliance burdens.
- Missing that a GPAI model embedded inside an HR tool may carry separate provider-level obligations independent of the HR tool's own high-risk classification.
- Failing to track the Act's phased applicability dates, assuming all obligations apply (or don't apply) uniformly from a single date.
- Treating AI Act compliance and GDPR compliance as separate, non-overlapping workstreams rather than a single, coordinated compliance review.

## 9. References to Standards

- **EU AI Act — Regulation (EU) 2024/1689** — entered into force August 2024; obligations phase in over roughly 6–36 months depending on the specific provision (prohibited practices apply earliest; GPAI obligations and high-risk obligations follow on separate, later timelines).
- **Annex III** — the high-risk use-case list, with Employment as point 4.
- **Article 6** — classification rules for high-risk systems.
- **Article 9** — risk management system requirement.
- **Article 14** — human oversight requirement.
- **Article 27** — Fundamental Rights Impact Assessment requirement.
- **GDPR — Regulation (EU) 2016/679** — must be read together with the AI Act for any system processing personal data, particularly Article 22 (automated decision-making) and Article 35 (DPIA).
- **Harmonized standards (forthcoming, via CEN-CENELEC)** — once published, these will provide a presumption of conformity for systems built to them; track their publication as a compliance-simplification opportunity.

## 10. Future Trends

- European Commission guidance and delegated acts progressively clarifying the precise boundaries of Annex III's Employment category as early enforcement experience accumulates.
- Publication of harmonized standards (CEN-CENELEC) that will let compliant organizations claim a presumption of conformity, likely becoming the practical compliance pathway most providers follow.
- Growing coordination between AI Act regulators and national labor/data protection authorities, closing gaps between AI-specific and general employment/data-protection enforcement.
- Likely emergence of sector-specific codes of practice for HR-tech providers, given how explicitly and centrally employment appears in Annex III.
- Increasing pressure on non-EU AI vendors (including major US HR-tech platforms) to demonstrate EU AI Act conformity to continue selling into the European market — a structural opening for EU-native providers who can demonstrate compliance natively rather than retrofitting it.
