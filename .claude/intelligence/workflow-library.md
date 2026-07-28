# Workflow Library

Every workflow in this system — whether invoked via an explicit `.claude/commands/` slash command or assembled dynamically by the orchestrator per `coordination-protocol.md` — is defined here with five required elements: **Trigger, Agents Involved, Decision Logic, Quality Gates, Success Metrics.** A workflow without all five is incomplete and shouldn't be run.

## Standard Workflows (mapped to `.claude/commands/`)

### Compensation Benchmark
**Trigger:** a request to benchmark a role's pay against market data (`.claude/commands/comp-benchmark.md`).
**Agents involved:** `compensation-benefits-specialist` (sole agent unless the benchmark feeds a Total Rewards deliverable, in which case `total-rewards-strategist` consumes the output downstream).
**Decision logic:** apply `.claude/knowledge/compensation-total-rewards.md`'s benchmarking frameworks (3-statistic benchmarking, job leveling discipline); apply `decision-engine.md` Tree 3 to determine gate applicability (Governance gate is N/A unless the benchmark itself is produced by an automated tool).
**Quality gates:** 1 (Non-Fabrication — every figure sourced or `[VALIDATE]`), 2 (Domain Accuracy), 5, 6. Gate 3/4 typically N/A per `quality-gates.md`'s applicability table.
**Success metrics:** benchmark figure has a named source; comparable-role definition stated; confidence level stated; Pay Transparency Directive disclosure reminder included if the benchmark feeds a job posting.

### Pay Equity Audit
**Trigger:** a request to audit pay equity for a client/dataset (`.claude/commands/pay-equity-audit.md`).
**Agents involved:** `compensation-benefits-specialist` (primary); `ai-governance-auditor` joins if any automated/algorithmic pay-setting tool is part of what's being audited (per `coordination-protocol.md` Step 5's mandatory-inclusion rule).
**Decision logic:** apply the pay-equity methodology in `.claude/knowledge/compensation-total-rewards.md` (raw gap vs. adjusted gap, control-factor regression); apply `.claude/knowledge/eu-ai-act.md`'s Pay Transparency Directive obligations checklist.
**Quality gates:** 1, 2, 5, 6; Gate 4 conditional on whether the report is client-facing.
**Success metrics:** both raw and adjusted gap reported (never raw alone); every figure sourced or `[VALIDATE]`; compliance checklist completed per `.claude/templates/pay-equity-audit-report-template.md`.

### Agentic AI Design
**Trigger:** a request to design/spec an agentic AI workflow (`.claude/commands/agent-design.md`).
**Agents involved:** `agentic-ai-architect` (primary), `ai-governance-auditor` (mandatory per `coordination-protocol.md` Step 5 — any `agentic-design` tag requires it).
**Decision logic:** apply the agentic-vs-automation test from `.claude/memory/positioning-decisions.md` and `.claude/knowledge/agentic-ai.md` first — if the workflow fails the test, redesign as assisted automation rather than forcing an agentic framing; then apply the 7-part spec structure from `.claude/templates/agent-spec-template.md`.
**Quality gates:** 1, 2, 3 (always — this workflow always touches governance), 5, 6; Gate 4 conditional on whether the spec is for internal use or will be shown to a client.
**Success metrics:** explicit autonomy boundary and escalation triggers defined (not generic); provisional EU AI Act risk tier stated with reasoning; no autonomy claim without a paired human checkpoint (Reasoning Pattern 5).

### AI Risk Classification
**Trigger:** a request to risk-classify an AI system (`.claude/commands/ai-risk-classify.md`); also runs automatically as part of Gate 3 whenever another workflow produces AI-related content.
**Agents involved:** `ai-governance-auditor` (sole agent; may request input from `agentic-ai-architect` if the system's functional design is unclear).
**Decision logic:** apply the seven-step classification workflow in `.claude/agents/ai-governance-auditor.md`, grounded in `.claude/knowledge/eu-ai-act.md`'s risk-tier decision tree.
**Quality gates:** 1, 3 (this workflow largely *is* Gate 3 — self-referential by design), 5, 6.
**Success metrics:** every field in `.claude/templates/ai-governance-brief-template.md` is either sourced/verified or explicitly listed as an open gap with an owner — never left ambiguously "fine."

### Case Study
**Trigger:** a request to draft a case study from real engagement material (`.claude/commands/case-study.md`).
**Agents involved:** `client-content-writer` (primary); pulls domain substance from whichever specialist owns the underlying engagement (e.g., `people-analytics-analyst` if it was a diagnostic engagement); `competitive-positioning-analyst` reviews before delivery.
**Decision logic:** Reasoning Pattern 3 (Evidence-First) applies strictly — situation, mechanism, and outcome must trace to provided source material; any gap becomes `[VALIDATE]`, never invented detail.
**Quality gates:** 1, 2, 4, 5, 6; Gate 3 conditional on whether an AI system is described in the case.
**Success metrics:** methodology stated for every outcome figure; if AI is involved, governance companion sentence present; publication checklist in `.claude/templates/case-study-template.md` fully run.

### Client Proposal
**Trigger:** a request to draft a proposal for one or more service lines (`.claude/commands/proposal.md`).
**Agents involved:** `client-content-writer` (primary, aggregator); the matching domain specialist(s) per the service line(s) named (see `capability-matrix.md`); `ai-governance-auditor` if AI/agentic work is proposed; `competitive-positioning-analyst` before delivery.
**Decision logic:** `.claude/memory/service-lines.md` governs how each practice is described; if the proposal implies a service Datalent doesn't actually offer at the requested scope, flag rather than write around it (per `client-content-writer`'s own non-negotiables).
**Quality gates:** 1, 2, 3 (conditional), 4, 5, 6.
**Success metrics:** pricing/timeline never invented (`[VALIDATE]` if not provided); "Nuestro Enfoque" section technically correct per the relevant specialist; would pass the Persona-Panel Stress Test for the buyer type implied.

### Newsletter Issue
**Trigger:** a request to draft the next "El Radar Agéntico" issue (`.claude/commands/newsletter-issue.md`).
**Agents involved:** `client-content-writer` (primary); `competitive-positioning-analyst` reviews before delivery.
**Decision logic:** strict adherence to the four-section recurring format in `.claude/templates/newsletter-issue-template.md` — consistency across issues is the point (per `.claude/knowledge/marketing.md`'s thought-leadership-as-citable-asset framework).
**Quality gates:** 1, 4, 5, 6; Gate 2 applies to whatever domain the featured case touches; Gate 3 conditional on whether the featured case is agentic-AI-related.
**Success metrics:** the "Dato" section has a real, dated source every time, no exceptions; the "Caso Agéntico" is real or clearly labeled illustrative.

### Positioning Check
**Trigger:** a request to review content against the six-persona panel and named competitors (`.claude/commands/positioning-check.md`); also runs as Gate 4 inside every other client-facing workflow.
**Agents involved:** `competitive-positioning-analyst` (sole agent for the review; if a rewrite is also requested, hands off to `client-content-writer`).
**Decision logic:** the six-persona method from `docs/business-audit-v2.md`, cross-referenced against `.claude/memory/competitive-landscape.md`.
**Quality gates:** this workflow largely *is* Gate 4; still subject to Gate 1 (no fabricated evidence introduced in a rewrite) if a rewrite is produced.
**Success metrics:** genuine (not diplomatic) verdict per persona; explicit answer to the "European leader in Agentic AI for HR" test from `.claude/memory/positioning-decisions.md`.

### Workforce Forecast
**Trigger:** a request to model a forward-looking workforce scenario (`.claude/commands/workforce-forecast.md`).
**Agents involved:** `workforce-intelligence-strategist` (primary); `people-analytics-analyst` if historical attrition/engagement data feeds the model as an input.
**Decision logic:** apply `.claude/knowledge/workforce-intelligence.md`'s scenario-planning frameworks; must model at least two scenarios, never a single point forecast presented as certain.
**Quality gates:** 1, 2, 5, 6; Gate 3 conditional on whether an AI-driven forecasting tool is described, not the forecast content itself.
**Success metrics:** every assumption stated explicitly; every scenario tied to an actual client decision; no external labor-market claim without a citation or `[VALIDATE]`.

### FAQ Entry
**Trigger:** a request to draft a new FAQ entry (`.claude/commands/faq-entry.md`).
**Agents involved:** `client-content-writer` (primary); `ai-governance-auditor` if the entry addresses AI/data/governance topics (a large share of the priority backlog per `docs/business-audit-v2.md`).
**Decision logic:** question phrased as a genuine skeptical buyer would ask it; answer includes governance companion sentence if AI-related; honest "not yet, here's the roadmap" preferred over evasive non-answers.
**Quality gates:** 1, 2, 3 (conditional), 4, 5, 6.
**Success metrics:** entry closes a specific gap named in `docs/business-audit-v2.md`'s FAQ "What's Missing" list, not a generic/softball question.

## Composite Workflows (cross-cutting, not a single command)

### Agentic AI System Launch
**Trigger:** a client engagement is moving an agentic AI system from design toward external description (proposal, case study, or website-bound copy).
**Agents involved:** `agentic-ai-architect` → `ai-governance-auditor` → `client-content-writer` → `competitive-positioning-analyst`, strictly sequential (each `depends on` edge in `knowledge-graph.md` enforced as a gate, per `coordination-protocol.md` Step 4).
**Decision logic:** the Agentic AI Design workflow and AI Risk Classification workflow both run in full before any client-content-writer drafting begins — governance is never retrofitted onto finished copy.
**Quality gates:** all six, in full, no exceptions — this is the highest-stakes workflow in the library given the firm's own positioning bet on defensible agentic AI claims.
**Success metrics:** composite evaluation score ≥ 4.0 (above the 3.5 default threshold, reflecting the elevated stakes) before delivery; zero gate failures on Evidence or Governance at any point in the chain.

### Full Client Proposal-to-Case-Study Lifecycle
**Trigger:** an engagement is proposed, executed, and later becomes a candidate case study.
**Agents involved:** whichever specialist(s) own the engaged service line(s), `client-content-writer`, `competitive-positioning-analyst`, plus `ai-governance-auditor` if applicable — reused across the Proposal workflow at intake and the Case Study workflow at close.
**Decision logic:** the Case Study workflow's methodology section must trace directly to what was actually delivered under the original Proposal — no outcome claim introduced at case-study stage that wasn't grounded in the engagement's actual scope.
**Quality gates:** both workflows' gates apply at their respective stages; additionally, at case-study stage, cross-check the claimed outcome against the original proposal's stated success criteria (if none were stated, that itself is a Gate 1 flag — an outcome can't be evidenced against a success criterion that was never defined).
**Success metrics:** case study's "Why This Matters Beyond This Client" section correctly avoids overgeneralizing from a single engagement (per `.claude/templates/case-study-template.md`).

### Website Content Handoff Package
**Trigger:** any deliverable intended to eventually be published to the live website (this system never edits `/src` directly per `.claude/CLAUDE.md` rule 7 — this workflow produces the handoff package, not the publication).
**Agents involved:** the originating specialist(s), `client-content-writer`, `competitive-positioning-analyst` (SEO and positioning both scored).
**Decision logic:** cross-reference against open findings in `docs/website-audit.md` — new website-bound copy should close a logged gap, not reproduce one.
**Quality gates:** all six, with SEO scored in Gate 5 (only workflow type where SEO is not N/A).
**Success metrics:** Executive Relevance and SEO dimensions both ≥ 4; explicit note to the user that this is a handoff package requiring manual publication, not a live change.

## Maintaining This Library

Add a new workflow entry here whenever a new `.claude/commands/` file is created, or whenever a recurring cross-cutting request pattern emerges that doesn't map to a single command (a `learning-loop.md` signal). A workflow missing any of the five required elements is not considered defined and should not be run as-is — complete it first.
