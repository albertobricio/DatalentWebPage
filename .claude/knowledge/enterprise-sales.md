# Knowledge Domain: Enterprise Sales

## 1. Core Concepts

- **Enterprise sales is a multi-stakeholder process, not a single-buyer transaction.** A complex B2B enterprise deal typically involves 6–10 stakeholders with different priorities (economic, technical, user, procurement, legal, security), and treating it as a single-contact sale is the most common structural error.
- **Qualification discipline separates real pipeline from busy work.** A defined qualification methodology (see Frameworks) exists precisely so deals are pursued based on evidence of fit and winnability, not optimism.
- **The Economic Buyer and the Champion are usually different people.** The Champion has internal credibility and wants you to win; the Economic Buyer controls budget and must be convinced independently — conflating the two is a common, costly mistake.
- **Procurement, security, and legal review are gates, not formalities.** For any vendor touching sensitive data (employment/candidate data is a clear example), these reviews determine deal velocity as much as the product pitch does.
- **Land-and-expand is usually more realistic than land-big for an unproven vendor.** A scoped pilot with defined success criteria, followed by expansion, de-risks the buyer's decision and is often the only realistic path for a vendor without an established enterprise track record.

## 2. Terminology

- **MEDDIC / MEDDPICC** — a B2B sales qualification framework: Metrics, Economic Buyer, Decision Criteria, Decision Process, (Paper Process), Identify Pain, Champion, (Competition) — used to assess how real and winnable a deal actually is.
- **Champion** — an internal stakeholder with genuine influence and credibility who actively wants the vendor to win and will advocate internally.
- **Economic Buyer** — the person with actual budget authority and final sign-off on the purchase decision.
- **RFP / RFI** — Request for Proposal / Request for Information, formal procurement documents used in structured enterprise buying processes.
- **Land-and-expand** — a go-to-market motion starting with a small, scoped initial deal (land) and growing the account over time (expand), as opposed to attempting to close the full potential deal size upfront.
- **ACV / ARR** — Annual Contract Value / Annual Recurring Revenue, standard metrics for deal and business sizing in recurring-revenue B2B models.
- **Pipeline coverage ratio** — total qualified pipeline value divided by the sales target, commonly targeted around 3–4x to reliably hit quota given typical win rates.
- **Multithreading** — building relationships with multiple stakeholders within a target account, rather than relying on a single point of contact.
- **Procurement gate / security review** — a formal checkpoint (data security, compliance documentation, contractual terms) a deal must pass before it can close, especially for vendors handling sensitive data.

## 3. Best Practices

- Qualify every opportunity against a defined methodology (e.g., MEDDIC) rather than pursuing deals based on enthusiasm or urgency alone.
- Identify the Economic Buyer and the Champion as distinct people early, and build a plan to engage both.
- Prepare security, compliance, and governance documentation (see `ai-governance.md`, `eu-ai-act.md`) proactively, before a procurement team requests it — for an AI vendor handling employment data, this is frequently the actual deal-blocking gate, not the product pitch.
- Use a defined pilot/proof-of-concept with explicit, agreed success criteria and a clear path to a full contract — an open-ended "let's try it" pilot rarely converts cleanly.
- Multithread relationships across the buying committee deliberately; a single-threaded deal is fully exposed if that one contact leaves, goes quiet, or loses internal influence.
- Never promise capability that doesn't exist yet to close a deal — for a firm whose entire credibility rests on evidence over claims (see `.claude/memory/non-fabrication-policy.md`), an overpromised enterprise deal is a reputational risk that outweighs the immediate revenue.

## 4. Frameworks

- **MEDDIC / MEDDPICC** — the standard enterprise qualification framework (see Terminology); a deal without clear answers to each letter is a deal at real risk regardless of how positive conversations feel.
- **Challenger Sale (Teach–Tailor–Take Control)** — a sales approach emphasizing bringing the buyer new insight (teach), tailoring the message to specific stakeholder concerns (tailor), and confidently guiding the buying process (take control) rather than purely responding to stated requirements.
- **SPIN Selling (Situation–Problem–Implication–Need-payoff)** — a structured questioning framework moving a buyer conversation from surface situation questions through to the buyer articulating the value of solving the problem themselves.
- **Miller Heiman Strategic Selling** — identifies multiple buying influences in a complex sale (Economic, User, Technical, Coach), a useful complement to MEDDIC's Economic Buyer/Champion distinction.
- **The enterprise buying-committee model** — treating the buying process as engaging a committee (commonly 6–10 stakeholders in complex B2B deals, per Gartner B2B buying research) rather than a single decision-maker.

## 5. Decision Trees

**Is this an SMB self-serve lead or an enterprise-motion opportunity?**
- Does the deal require multi-stakeholder sign-off, formal procurement/security review, or a custom contract? → Enterprise motion — invest in qualification, multithreading, and procurement-readiness collateral.
- Is the buyer a single decision-maker with authority to self-serve or close quickly with minimal formal process? → SMB/self-serve motion — optimize for speed and low-friction conversion instead.

**Do we have a real Champion, or just an interested user?**
- Does this person have genuine influence with the Economic Buyer and internal credibility to advocate for the purchase? → Real Champion — invest relationship-building time here.
- Is this person enthusiastic about the product but without organizational influence or a path to the Economic Buyer? → Interested user only — valuable for product feedback, but do not mistake this relationship for deal progress; find the actual Champion separately.

## 6. Anti-Patterns

- Pitching product features to a single contact with no visibility into or engagement with the broader buying committee.
- Running a sales process with no defined qualification framework, treating every lead as equally real and equally winnable.
- Running an open-ended free pilot with no defined success criteria or conversion path, which rarely converts and consumes disproportionate delivery resource.
- Ignoring procurement/security/compliance readiness until it's requested late in the process, causing avoidable, deal-killing delays.
- Over-promising capability not yet built or validated in order to close a deal — a direct violation of evidence-based positioning discipline and a compounding trust risk if discovered post-sale.

## 7. KPIs

- Pipeline coverage ratio (commonly targeted 3–4x quota)
- Average sales cycle length
- Win rate by stage (to identify where deals are actually being lost, not just overall win rate)
- ACV/ARR per deal
- POC-to-close conversion rate
- Number of multithreaded contacts per opportunity
- Procurement-gate pass rate and average time-in-gate

## 8. Common Mistakes

- Confusing an enthusiastic user champion with the actual Economic Buyer, and misjudging deal progress as a result.
- Under-investing in security/compliance readiness for a vendor whose product touches sensitive employment data — this is a structurally higher bar than for a typical SaaS sale and should be resourced accordingly (see `ai-governance.md`, `eu-ai-act.md`).
- Entering competitive deals with no clearly differentiated point of view (see `marketing.md`'s positioning discipline), defaulting to feature-by-feature comparison the buyer's committee will do anyway.
- Failing to multithread, leaving a deal fully exposed to a single relationship's continuity.
- Treating a pilot as equivalent to a sale, without tracking it against explicit, pre-agreed success criteria.

## 9. References to Standards

- **MEDDIC Academy / Force Management** — primary published sources for the MEDDIC/MEDDPICC methodology.
- **Miller Heiman Group (part of Korn Ferry)** — originators of the Strategic Selling framework.
- **Gartner B2B Buying Journey research** — the widely cited source documenting the typical 6–10 stakeholder size of complex B2B buying committees.
- **CSO Insights / Sales Mastery benchmarking research** — industry benchmarking data on sales cycle length, win rates, and pipeline coverage norms.

## 10. Future Trends

- AI-assisted deal qualification and buying-signal detection becoming standard sales-operations tooling.
- Procurement processes placing increasing emphasis on AI governance and compliance documentation as an explicit gating requirement — directly relevant to any HR-AI vendor's sales readiness (see `ai-governance.md`, `eu-ai-act.md`).
- Growth of product-led-growth (self-serve pilot before enterprise contract) motions even within otherwise enterprise-sales-led companies, blurring the SMB/enterprise decision-tree boundary.
- Continued growth in average buying-committee size, further increasing the return on disciplined multithreading and stakeholder-specific enablement content.
