# Imports

A flat, skimmable, per-file index of the "loads/depends_on" direction only — if you have one file open and want to know what it pulls in, this is faster to scan than parsing `registry.yaml` or tracing `dependency-map.md`'s relational tables. Every line here is sourced directly from a `registry.yaml` field; this file adds no new declarations of its own.

## Agents

```
agentic-ai-architect.md
  imports: memory/positioning-decisions, memory/compliance-glossary,
           knowledge/agentic-ai, knowledge/ai-governance, knowledge/eu-ai-act,
           intelligence/capability-matrix, intelligence/coordination-protocol,
           intelligence/quality-gates, intelligence/reasoning-patterns,
           templates/agent-spec-template

ai-governance-auditor.md
  imports: memory/compliance-glossary, memory/non-fabrication-policy,
           knowledge/ai-governance, knowledge/eu-ai-act, knowledge/agentic-ai,
           intelligence/capability-matrix, intelligence/coordination-protocol,
           intelligence/quality-gates, intelligence/reasoning-patterns,
           intelligence/conflict-resolution, intelligence/evaluation-engine,
           templates/ai-governance-brief-template

people-analytics-analyst.md
  imports: memory/service-lines, memory/non-fabrication-policy,
           knowledge/people-analytics, knowledge/hr-strategy, knowledge/ai-governance,
           intelligence/capability-matrix, intelligence/coordination-protocol,
           intelligence/quality-gates, intelligence/reasoning-patterns

compensation-benefits-specialist.md
  imports: memory/compliance-glossary, memory/non-fabrication-policy,
           knowledge/compensation-total-rewards, knowledge/eu-ai-act,
           intelligence/capability-matrix, intelligence/coordination-protocol,
           intelligence/quality-gates, intelligence/reasoning-patterns

total-rewards-strategist.md
  imports: memory/service-lines, memory/non-fabrication-policy,
           knowledge/compensation-total-rewards, knowledge/hr-strategy, knowledge/people-analytics,
           intelligence/capability-matrix, intelligence/coordination-protocol,
           intelligence/quality-gates, intelligence/reasoning-patterns

workforce-intelligence-strategist.md
  imports: memory/non-fabrication-policy,
           knowledge/workforce-intelligence, knowledge/people-analytics, knowledge/hr-strategy,
           intelligence/capability-matrix, intelligence/coordination-protocol,
           intelligence/quality-gates, intelligence/reasoning-patterns

competitive-positioning-analyst.md
  imports: memory/positioning-decisions, memory/competitive-landscape, memory/non-fabrication-policy,
           knowledge/marketing, knowledge/enterprise-sales, knowledge/hr-strategy,
           intelligence/capability-matrix, intelligence/coordination-protocol,
           intelligence/quality-gates, intelligence/reasoning-patterns, intelligence/evaluation-engine,
           templates/competitive-battlecard-template

client-content-writer.md
  imports: memory/brand-voice, memory/positioning-decisions, memory/non-fabrication-policy,
           knowledge/consulting-methodologies, knowledge/marketing,
           intelligence/capability-matrix, intelligence/coordination-protocol,
           intelligence/quality-gates, intelligence/reasoning-patterns, intelligence/workflow-library,
           templates/case-study-template, templates/client-proposal-template,
           templates/newsletter-issue-template, templates/faq-entry-template
```

## Commands

```
agent-design.md       imports: agents/agentic-ai-architect (+ agents/ai-governance-auditor, mandatory), templates/agent-spec-template
ai-risk-classify.md   imports: agents/ai-governance-auditor (+ agents/agentic-ai-architect, optional), templates/ai-governance-brief-template
case-study.md         imports: agents/client-content-writer (+ dynamic specialist, + agents/competitive-positioning-analyst), templates/case-study-template
comp-benchmark.md     imports: agents/compensation-benefits-specialist
faq-entry.md          imports: agents/client-content-writer (+ agents/ai-governance-auditor, conditional), templates/faq-entry-template
newsletter-issue.md   imports: agents/client-content-writer (+ agents/competitive-positioning-analyst, mandatory), templates/newsletter-issue-template
pay-equity-audit.md   imports: agents/compensation-benefits-specialist (+ agents/ai-governance-auditor, conditional), templates/pay-equity-audit-report-template
positioning-check.md  imports: agents/competitive-positioning-analyst (→ agents/client-content-writer, handoff), templates/competitive-battlecard-template
proposal.md           imports: agents/client-content-writer (+ dynamic specialists, + agents/ai-governance-auditor conditional, + agents/competitive-positioning-analyst mandatory), templates/client-proposal-template
workforce-forecast.md imports: agents/workforce-intelligence-strategist (← agents/people-analytics-analyst, input)
```

## Knowledge

```
agentic-ai.md                  imports: nothing (leaf reference file)
ai-governance.md                imports: nothing
eu-ai-act.md                    imports: nothing
hr-strategy.md                  imports: nothing
people-analytics.md             imports: nothing
compensation-total-rewards.md   imports: nothing
workforce-intelligence.md       imports: nothing
enterprise-sales.md             imports: nothing
marketing.md                    imports: nothing
consulting-methodologies.md     imports: nothing
```

Knowledge files are intentionally leaves in the dependency graph — they're universal domain expertise, not dependent on anything else in `.claude/`. This is a structural sanity check worth stating plainly: if a future edit ever adds a `depends_on` to a knowledge file, that's worth double-checking against `.claude/knowledge/README.md`'s own definition of what belongs in this layer.

## Intelligence

```
knowledge-graph.md       imports: nothing
capability-matrix.md     imports: intelligence/knowledge-graph
evaluation-engine.md     imports: memory/non-fabrication-policy
quality-gates.md         imports: intelligence/evaluation-engine, memory/non-fabrication-policy
decision-engine.md       imports: intelligence/capability-matrix
reasoning-patterns.md    imports: memory/non-fabrication-policy, knowledge/consulting-methodologies, knowledge/agentic-ai
coordination-protocol.md imports: intelligence/capability-matrix, intelligence/decision-engine
workflow-library.md      imports: intelligence/quality-gates
conflict-resolution.md   imports: memory/non-fabrication-policy
learning-loop.md         imports: intelligence/decision-engine
```

## Execution

```
project-manager.md       imports: intelligence/decision-engine, intelligence/conflict-resolution
planning-engine.md       imports: execution/project-manager, intelligence/capability-matrix, intelligence/knowledge-graph, knowledge/consulting-methodologies
task-engine.md           imports: execution/planning-engine, intelligence/capability-matrix, intelligence/knowledge-graph
implementation-engine.md imports: execution/task-engine, intelligence/coordination-protocol
review-engine.md         imports: execution/implementation-engine, intelligence/evaluation-engine
testing-engine.md        imports: execution/review-engine, intelligence/quality-gates, intelligence/evaluation-engine
documentation-engine.md  imports: execution/* (all), intelligence/learning-loop, knowledge/consulting-methodologies
release-engine.md        imports: execution/testing-engine, execution/documentation-engine
continuous-improvement.md imports: execution/release-engine, intelligence/learning-loop, intelligence/decision-engine
workflow-orchestrator.md imports: execution/* (all 9 others), intelligence/coordination-protocol, intelligence/quality-gates, intelligence/decision-engine
```

## Maintenance

This file is generated conceptually from `registry.yaml` and must stay in sync with it — if you update a `loads`/`depends_on`/`invokes` field in the registry, update the matching entry here in the same pass. If the two ever disagree, `registry.yaml` governs (per its own header); treat a disagreement here as a bug in this file, not in the registry.
