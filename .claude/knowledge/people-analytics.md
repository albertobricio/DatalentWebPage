# Knowledge Domain: People Analytics

## 1. Core Concepts

- **The analytics maturity progression: descriptive → diagnostic → predictive → prescriptive.** Descriptive answers "what happened" (attrition was 15% last quarter). Diagnostic answers "why" (attrition concentrated in tenure 12–18 months, correlated with manager change). Predictive answers "what's likely next" (this employee has an elevated attrition risk score). Prescriptive answers "what should we do" (intervene with these three actions, ranked by expected impact). Most organizations — and most vendor tools — overstate how far up this ladder they actually operate.
- **Data lineage matters as much as the finding.** A number without a stated source, sample size, and time window is not an analytic finding; it's an assertion.
- **Correlation is not causation.** People analytics is unusually prone to confounded findings (e.g., "high performers who leave had lower engagement scores" could reflect disengagement causing departure, or departure decisions causing later disengagement in the survey — the direction matters for what to do about it).
- **Ethical analytics is a design constraint, not an afterthought.** Any analysis that could influence a decision about a real person (hiring, promotion, termination, compensation) inherits the same bias/fairness obligations as a formal HR decision process, whether or not it's labeled a "model."
- **Explainability is not optional for HR use cases.** A model that can't explain why it produced a given score is unsuitable for any decision materially affecting a person, regardless of its accuracy.

## 2. Terminology

- **HRIS** — Human Resources Information System, the system of record for employee data.
- **ATS** — Applicant Tracking System, the system of record for recruitment/candidate data.
- **eNPS** — Employee Net Promoter Score, a single-item engagement proxy; useful as a trend indicator, weak as a standalone diagnostic.
- **Regretted vs. non-regretted attrition** — departures the organization would have preferred to prevent, versus departures that were neutral or positive for the organization; conflating the two into a single "turnover rate" hides the real signal.
- **Cohort analysis** — comparing groups defined by a shared starting point (e.g., hire month) over time, to isolate tenure-stage effects from calendar-time effects.
- **Survival analysis** — a statistical method estimating the probability of an event (e.g., departure) occurring by a given time, accounting for employees who haven't yet left ("censored" data) rather than only analyzing those who already have.
- **Feature engineering** — constructing the input variables a predictive model actually uses, often the single biggest driver of model quality.
- **Explainability / XAI** — methods for making a model's output interpretable to a human (e.g., which factors drove a specific prediction), distinct from overall model accuracy.
- **Disparate impact** — a facially neutral practice or model that produces a substantially different outcome rate across protected groups, regardless of intent.
- **4/5ths (80%) rule** — a common practical threshold: if the selection rate for any group is less than 80% of the rate for the group with the highest selection rate, adverse impact is indicated and warrants investigation.

## 3. Best Practices

- State data lineage (source system, sample size, time window, exclusions) on every analysis, not just the headline finding.
- Validate any predictive model against a genuine holdout sample before trusting its output operationally.
- Run bias/disparate-impact testing on any model that influences a people decision, before deployment and on a recurring cadence after.
- Use language that reflects actual certainty — "associated with," not "causes," unless the analysis design genuinely supports a causal claim (e.g., a controlled experiment).
- Visualize and communicate uncertainty (confidence intervals, sample size caveats), not just point estimates.
- Pair every analytic finding with a recommended action — an insight with no decision attached is a dashboard, not people analytics.
- Triangulate self-report survey data (engagement, sentiment) with behavioral data (attrition, mobility, performance) rather than relying on either alone.

## 4. Frameworks

- **Bersin/Deloitte People Analytics Maturity Model** — four stages: Reactive (ad hoc reporting) → Operational (regular dashboards) → Advanced (predictive modeling) → Predictive/Prescriptive (embedded in decision workflows). Most organizations self-report a higher stage than their actual practice reflects — use this framework to assess honestly, not aspirationally.
- **The Analytics Value Chain** — Data → Insight → Decision → Action → Outcome. A common failure point is stopping at Insight without a defined path to Decision and Action.
- **Davenport's DELTA model** — Data, Enterprise (organization-wide, not siloed), Leadership (executive sponsorship), Targets (business-aligned objectives), Analysts (actual capability) — a diagnostic for whether an organization is actually ready for advanced analytics, not just whether it has data.
- **4/5ths (80%) rule** — practical screening threshold for adverse impact in selection processes (see Terminology); a starting flag for investigation, not a legal safe harbor on its own.

## 5. Decision Trees

**Is this finding ready for a predictive model, or should it stay descriptive/diagnostic?**
- Is there sufficient historical outcome data (both positive and negative cases) to train and validate a model? If no → stay diagnostic; a model trained on insufficient data will overfit and mislead.
- Has the relationship been validated as more than a spurious correlation (e.g., via a diagnostic deep-dive or controlled comparison)? If no → investigate further before modeling.
- If yes to both → predictive modeling may be justified, with mandatory bias testing before any operational use.

**Should this finding go to a dashboard, or trigger a direct intervention?**
- Is the finding actionable by a specific role within their existing authority (e.g., a manager can address a team-level engagement driver)? → Route to that role's dashboard with a recommended action.
- Does the finding require a policy or systemic change beyond any individual manager's authority? → Escalate to a decision-maker with a prescriptive recommendation, not just a data point.

## 6. Anti-Patterns

- **Vanity dashboards** — extensive visualization with no decision or owner attached to any metric shown.
- **Black-box scoring** — deploying a composite score (e.g., a "flight risk" or "culture fit" score) without documenting what inputs feed it and how they're weighted.
- **Small-sample overreach** — segmenting data so finely (e.g., by team of 4) that findings are statistical noise, then acting on them as if robust.
- **Survivorship bias in attrition analysis** — analyzing only the traits of people who stayed, without properly accounting for those who left, especially in engagement-driver analysis.
- **Hypothesis-free analysis** — running broad correlational scans across many variables without a prior hypothesis, then treating whatever correlation surfaces as meaningful (multiple-comparisons problem).

## 7. KPIs

- Predictive model accuracy, precision, and recall against a genuine holdout set
- Data completeness rate (% of required fields populated across the relevant population)
- Time-to-insight (from question asked to answer delivered)
- Adoption rate — % of eligible managers/leaders actually using analytics outputs in a decision
- Decision-to-action conversion rate — % of analytic recommendations that result in a tracked action
- Disparate impact ratio against the 4/5ths threshold, tracked on a recurring cadence for any model influencing people decisions

## 8. Common Mistakes

- Presenting a correlational finding using causal language ("X causes Y") without a design that supports it.
- Ignoring survivorship bias when analyzing what "good" looks like using only current, retained employees.
- Segmenting analyses down to samples too small to be statistically meaningful, then treating the result as reliable.
- Deploying a scoring or predictive model into an operational decision without a documented bias audit.
- Over-relying on annual engagement survey data as the sole sentiment signal, ignoring response-rate bias and recency effects.

## 9. References to Standards

- **ISO 30414** — Human Capital Reporting guidelines, several of which (turnover, diversity, leadership) are core people-analytics metrics.
- **Uniform Guidelines on Employee Selection Procedures** — origin of the 4/5ths rule; U.S.-originated but widely referenced internationally as a practical adverse-impact screening heuristic.
- **SIOP Principles for the Validation and Use of Personnel Selection Procedures** — professional standard for validating any tool (including predictive models) used in selection decisions.
- **GDPR Article 22** — right not to be subject to a decision based solely on automated processing with legal or similarly significant effects; directly constrains how predictive people-analytics outputs can be operationalized in the EU.
- **APA/SIOP standards for psychometric validity** — reliability, validity, and adverse-impact standards applicable to any scoring instrument, algorithmic or traditional.

## 10. Future Trends

- Shift from periodic (annual) engagement surveys toward continuous/real-time listening mechanisms.
- Growing adoption of causal inference and experimentation (A/B testing) methods in HR, moving beyond purely correlational analysis.
- Integration of skills-graph data into people analytics, connecting workforce analytics with skills-based workforce planning (see `workforce-intelligence.md`).
- Increasing regulatory scrutiny of algorithmic HR tools generally (see `eu-ai-act.md`), raising the bar for explainability and bias documentation as a baseline expectation, not a differentiator.
- Generative AI used to produce narrative insight summaries from dashboards — valuable for accessibility, but requiring the same grounding/hallucination discipline as any other AI-generated HR content (see `agentic-ai.md`).
