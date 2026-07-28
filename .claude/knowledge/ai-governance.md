# Knowledge Domain: AI Governance

## 1. Core Concepts

- **Governance spans the full AI lifecycle**, not just the deployment moment: design → development → deployment → monitoring → retirement. Governance work done only at launch and never revisited is not governance, it's a one-time checkbox.
- **Risk-based, not one-size-fits-all.** Modern AI governance (regulatory and best-practice alike) scales obligations to the actual risk a system poses, rather than applying identical process to a low-stakes internal tool and a system deciding who gets hired.
- **Accountability requires a named owner.** "The AI decided" is never an acceptable account of a decision — governance requires a specific, named human or role accountable for each deployed system's behavior.
- **Documentation is a control, not paperwork.** Model cards, data sheets, and audit trails exist so that a system's behavior can be reconstructed and defended after the fact — their absence is itself a risk, independent of whether the system is currently working well.
- **Human oversight must be designed, not assumed.** A generic claim that "a human is in the loop" is not sufficient; oversight requires a specific, documented point in the workflow where a human can review, override, or halt the system before harm occurs.

## 2. Terminology

- **Risk tier** — the classification of an AI system's regulatory/operational risk level (see `eu-ai-act.md` for the EU's specific four-tier structure).
- **Conformity assessment** — the formal process (self-assessment or third-party, depending on risk tier) verifying an AI system meets applicable requirements before deployment.
- **Model card** — structured documentation of a model's intended use, performance characteristics, limitations, and training data provenance.
- **Datasheet for datasets** — structured documentation of a dataset's origin, composition, and known limitations, used to assess fitness for a given purpose.
- **Explainability (XAI)** — the capacity to describe, in terms a relevant human can understand, why a model produced a specific output.
- **Disparate impact** — see `people-analytics.md`; a core concern of any governance review touching a decision-influencing model.
- **Human-in-the-loop (HITL) / human oversight** — a designed checkpoint where a human can intervene before or after an AI system's action affects a person.
- **Audit trail** — a reconstructible record of a system's inputs, reasoning (where available), outputs, and any human intervention.
- **Red-teaming** — deliberately probing a system for failure modes, biases, or exploitable weaknesses before (and periodically after) deployment.
- **Post-market monitoring** — ongoing observation of a deployed system's real-world performance and incidents, as distinct from pre-deployment testing alone.
- **Provider vs. Deployer** — under the EU AI Act, the Provider builds/places the system on the market; the Deployer uses it under its own authority. Obligations differ materially by role, and a single organization can be both for different systems.

## 3. Best Practices

- Classify a system's risk tier before building or procuring it, not after it's already in production.
- Maintain a living model card and datasheet per system, updated as the system or its data changes — not a one-time document frozen at launch.
- Log every automated decision with enough context to reconstruct the reasoning behind it later.
- Run bias/disparate-impact audits before deployment, and on a defined recurring cadence afterward — bias can emerge or drift even in an unchanged model as the underlying population changes.
- Name a single accountable owner per deployed AI system, distinct from whoever built or procured it.
- Design a rollback/kill-switch capability before deployment, not as an emergency improvisation after an incident.
- Involve legal, compliance, and data protection functions from the design phase of any high-risk system, not at launch review.

## 4. Frameworks

- **NIST AI Risk Management Framework (AI RMF 1.0)** — four core functions: Govern (culture and structures for AI risk management), Map (context and risk identification), Measure (assessment and analysis of risk), Manage (risk response and monitoring). A widely-referenced, framework-agnostic starting point regardless of jurisdiction.
- **ISO/IEC 42001:2023** — the first international standard for an AI management system, structured like other ISO management-system standards (analogous to ISO 27001 for information security), enabling certification of an organization's AI governance practices.
- **ISO/IEC 23894:2023** — AI risk management guidance, complementary to ISO/IEC 42001.
- **EU AI Act risk pyramid** — Unacceptable (prohibited) / High-risk (heavily regulated) / Limited risk (transparency obligations) / Minimal risk (no specific obligations) — see `eu-ai-act.md` for full detail.
- **Three Lines of Defense (applied to AI risk)** — first line: the business/operational team building and using the system; second line: risk and compliance function providing oversight and challenge; third line: internal audit providing independent assurance.
- **OECD AI Principles** — international, values-based principles (inclusive growth, human-centered values, transparency, robustness, accountability) underlying much subsequent binding regulation, including elements of the EU AI Act.

## 5. Decision Trees

**What risk tier does this system fall under (practical governance starting point)?**
- Does the system make or materially influence a decision about a person's access to employment, promotion, termination, or similarly significant opportunity? If yes → treat as High-risk by default and require full governance controls, pending formal classification (see `eu-ai-act.md` for the EU-specific legal test).
- Does the system interact directly with people without disclosing it's an AI system? → At minimum, Limited-risk transparency obligations apply.
- Does the system have no material effect on any individual's rights or opportunities (e.g., an internal scheduling optimizer with no HR-decision content)? → Likely Minimal-risk, but confirm rather than assume.

**Do we need a full conformity assessment?**
- Is the system classified High-risk? → Yes, conformity assessment is required before deployment (self-assessment or third-party depending on the specific use case and applicable regulation).
- Is the system Limited or Minimal risk? → Full conformity assessment is not mandated, but documentation and monitoring remain good practice regardless.

## 6. Anti-Patterns

- **Governance bolted on after deployment** — building or buying a system first, then attempting to retrofit documentation and oversight once it's already in production or under regulatory scrutiny.
- **Ethics-statement-as-substitute** — publishing a values statement about responsible AI without corresponding process controls, documentation, or accountability structures behind it.
- **No named accountable owner** — a system whose governance responsibility is diffused across "the team" or "the vendor" with no single accountable individual.
- **One-time bias testing** — treating a bias audit as a launch-gate checkbox rather than a recurring control, missing drift as the underlying population or use pattern changes.
- **Vendor black-box acceptance** — deploying a third-party AI tool without any documentation of its logic, training data, or known limitations, and treating "the vendor handles that" as sufficient governance.

## 7. KPIs

- % of AI systems in use with a completed, current risk classification
- % of systems with an up-to-date model card / documentation
- Bias audit pass rate / disparate impact ratio, tracked over time per system
- AI incident count and mean-time-to-remediation
- Human override rate (frequency a human intervenes or corrects the system's output)
- Audit trail completeness (% of decisions with reconstructible reasoning)
- Time from AI incident detection to resolution

## 8. Common Mistakes

- Assuming that purchasing an AI tool from a vendor eliminates the buying organization's own governance obligations — deployer obligations exist independently of provider obligations under most modern AI regulation.
- Underestimating that HR/employment-related AI systems very frequently qualify as High-risk, and treating them with lighter governance because they "don't feel like" a high-stakes technical system.
- Skipping documentation because a system "isn't customer-facing" — internal-facing systems that influence employment decisions carry the same risk profile as external-facing ones.
- Conflating explainability with model simplicity — some legitimate use cases require complex models, which then require post-hoc explanation methods rather than an assumption that "complex" and "ungovernable" are the same thing.
- Treating a single red-team exercise before launch as sufficient, without ongoing post-market monitoring.

## 9. References to Standards

- **EU AI Act (Regulation (EU) 2024/1689)** — see `eu-ai-act.md` for full domain treatment.
- **NIST AI RMF 1.0** — voluntary, widely-adopted framework, useful even outside U.S. jurisdiction as a structuring tool.
- **ISO/IEC 42001:2023** — certifiable AI management system standard.
- **ISO/IEC 23894:2023** — AI risk management guidance.
- **ISO/IEC 23053** — framework for AI systems using machine learning.
- **OECD AI Principles (2019, updated 2024)** — foundational international principles underlying much binding regulation.
- **GDPR (Regulation (EU) 2016/679)**, especially **Article 22** (automated decision-making) and **Article 35** (Data Protection Impact Assessment) — directly overlapping obligations for any AI system processing personal data.
- **IEEE 7000-2021** — Ethically Aligned Design standard for autonomous and intelligent systems.

## 10. Future Trends

- Convergence of legal compliance (EU AI Act) with certifiable operational standards (ISO/IEC 42001) as the practical implementation path most organizations will follow.
- Growing market for independent third-party AI auditors, analogous to financial auditors, as high-risk system obligations mature.
- Standardized model cards becoming a default procurement requirement in enterprise RFPs, not just a best-practice recommendation.
- Increasing regulatory and public attention specifically on agentic/autonomous systems (see `agentic-ai.md`), likely to outpace generic AI governance guidance.
- Growing fragmentation across jurisdictions (EU AI Act vs. U.S. state-level AI employment laws vs. other regional regimes), increasing demand for jurisdiction-aware governance tooling and multi-framework compliance mapping.
