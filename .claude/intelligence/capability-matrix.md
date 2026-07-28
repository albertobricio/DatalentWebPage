# Capability Matrix

This is what makes agent selection **dynamic instead of fixed routing**. A fixed-routing system maps request keywords straight to an agent name. This system instead scores every agent's actual capability fit against the request's needs and selects whoever scores highest — including selecting more than one agent, or none, when that's what the evidence says. See `coordination-protocol.md` for how the orchestrator actually runs this scoring at request time.

## Capability Tag Vocabulary

A controlled set of tags, so scoring is consistent instead of ad hoc. Every agent below is profiled against these tags; every incoming request gets decomposed into these same tags before matching (see `decision-engine.md` → Request Triage Tree).

| Tag | Meaning |
|---|---|
| `agentic-design` | Specifying an AI agent's autonomy boundary, escalation logic, workflow |
| `governance-classification` | EU AI Act risk-tiering, GDPR exposure, oversight design |
| `bias-audit` | Testing a model/process for disparate impact |
| `attrition-analysis` | Backward-looking turnover/retention data analysis |
| `culture-diagnostic` | Engagement, culture, sentiment analysis |
| `comp-benchmark` | Market salary benchmarking |
| `pay-equity` | Pay gap analysis, adjusted/unadjusted gap methodology |
| `total-rewards-synthesis` | Integrating pay + benefits + development + recognition |
| `workforce-scenario` | Forward-looking headcount/skills scenario modeling |
| `labor-market-signal` | External labor-market data interpretation |
| `positioning-review` | Persona-panel / buyer-objection stress test |
| `competitive-benchmark` | Comparison against named competitors |
| `content-drafting` | Producing client-facing prose (proposal, case study, newsletter, FAQ) |
| `hr-operating-model` | Org design, HRBP model, strategic workforce alignment (see Coverage Gap note below) |
| `sales-methodology` | MEDDIC/buying-committee framing for proposals (see Coverage Gap note below) |

## Agent Capability Profiles

| Agent | Primary tags (strong, score 2) | Secondary tags (adequate, score 1) | Produces | Confidence signal (trust it alone) | Escalation signal (don't trust it alone) |
|---|---|---|---|---|---|
| `agentic-ai-architect` | `agentic-design` | `governance-classification` (provisional only) | Agent specs | Request is scoped to one workflow with a clear goal | Any High-risk classification needs `ai-governance-auditor` sign-off before it's final — see `conflict-resolution.md` |
| `ai-governance-auditor` | `governance-classification`, `bias-audit` | `agentic-design` (review only, not authoring) | Governance briefs, risk classifications | Request is a compliance/risk question | Should never originate an agent's functional design — that's `agentic-ai-architect`'s job |
| `people-analytics-analyst` | `attrition-analysis`, `culture-diagnostic` | `bias-audit` (flags, doesn't certify), `hr-operating-model` (diagnostic angle only) | Data analyses, diagnostic narratives | Backward/current-state data question with a defined dataset | If the request is forward-looking (scenario/planning), it's `workforce-intelligence-strategist`'s tag, not this agent's |
| `compensation-benefits-specialist` | `comp-benchmark`, `pay-equity` | `governance-classification` (Pay Transparency Directive only) | Benchmarks, pay equity audits | Request has a defined role/population and a real or requestable data source | If the request is about connecting comp to retention/engagement strategy, that's `total-rewards-synthesis` — hand off to `total-rewards-strategist` |
| `total-rewards-strategist` | `total-rewards-synthesis` | `comp-benchmark` (consumes, doesn't produce), `attrition-analysis` (consumes) | Total rewards strategy/statements | Request explicitly spans more than one reward pillar (pay + benefits + development + recognition) | If the request is pure pay-structure work with no integration angle, that's over-scoped for this agent — route to `compensation-benefits-specialist` |
| `workforce-intelligence-strategist` | `workforce-scenario`, `labor-market-signal` | `attrition-analysis` (consumes as input), `hr-operating-model` (structural-change angle) | Scenario models, forecasts | Request is explicitly forward-looking with a decision attached (budget, org design, build/buy/borrow) | If there's no decision attached, this becomes an academic exercise — flag rather than produce a model with nothing to decide |
| `competitive-positioning-analyst` | `positioning-review`, `competitive-benchmark` | `sales-methodology` (positioning angle only) | Persona-panel reviews, battlecards | Any client-facing content pre-publication | Should never be skipped for external content — see `quality-gates.md` |
| `client-content-writer` | `content-drafting` | all tags (synthesis/writing only, not origination) | Proposals, case studies, newsletters, FAQ entries | Underlying domain content already exists from a specialist agent | Should never originate domain analysis itself — if asked to, it must request the analysis from the matching specialist first, per its own agent definition |

## Coverage Gap Tags

`hr-operating-model` and `sales-methodology` have no agent carrying them as a primary tag — this mirrors the Coverage Gaps documented in `knowledge-graph.md`. When a request scores highest against one of these tags alone:

1. Do not force-assign the nearest-scoring agent as if it were a real match.
2. Surface the gap to the user explicitly: "this request centers on [tag], which no current agent owns as a primary capability — closest available is [agent] for [reason], with the following limitation: [state it]."
3. Log the gap — repeated requests against an uncovered tag are a `learning-loop.md` signal that a new agent may be warranted.

## Dynamic Selection Algorithm

This is the procedure the orchestrator runs for every request — see `coordination-protocol.md` for where this fits in the full intake flow.

1. **Decompose the request into capability tags** (1 to n tags from the vocabulary above). A request naming a role and "market rate" → `comp-benchmark`. A request to "design an agent that screens candidates" → `agentic-design` (+ implicitly `governance-classification`, since any agentic design touching HR decisions triggers governance per `knowledge-graph.md`'s `depends on` edge).
2. **Score every agent** against the tag set: +2 per primary-tag match, +1 per secondary-tag match, 0 otherwise. Sum per agent.
3. **Rank agents by score.** If exactly one agent's score covers all required tags at primary-tag strength, that's a **single-agent workflow**.
4. **If no single agent covers all tags at primary strength**, select the minimum set of agents whose combined primary tags cover the full required set — this is a **multi-agent workflow**. Order execution using the `depends on` / `feeds` edges in `knowledge-graph.md` (a dependency's agent runs, or at minimum gates, before the dependent agent's output is finalized).
5. **If a required tag has zero agents scoring above 0**, that's a Coverage Gap — apply the Coverage Gap procedure above rather than assigning a poor-fit agent.
6. **Always append `competitive-positioning-analyst`** to the agent set if the output is client-facing (per `quality-gates.md` — this is a standing rule, not a scored match, because positioning review is a required gate, not an optional capability pick).
7. **Always append `ai-governance-auditor`** to the agent set if any selected agent's tags include `agentic-design`, `bias-audit`, or `governance-classification` and it wasn't already selected — see `conflict-resolution.md` for its veto authority once involved.

## Maintenance

Update this matrix whenever an agent's scope changes or a new agent is added — an orchestrator scoring against a stale matrix will make wrong selections silently. Treat this file as authoritative over any agent's own self-description if the two ever disagree; reconcile by updating both, not by trusting whichever was more recently reasoned about.
