# Expert Knowledge Layer

This is not documentation about Datalent or this repository. It is **permanent domain expertise** — the professional knowledge a genuine senior practitioner in each field carries, independent of any single engagement or client. Every agent in `.claude/agents/` must consult the matching file(s) here before making a domain judgment call, the same way a real consultant draws on their training and the literature before advising a client.

## How this differs from `.claude/memory/`

| | `.claude/memory/` | `.claude/knowledge/` |
|---|---|---|
| Scope | Firm-specific: Datalent's own decisions, brand voice, competitive position | Universal: the field's concepts, frameworks, and standards — true regardless of which firm is using them |
| Changes when | Datalent's strategy or market position changes | The underlying field's frameworks or regulations change |
| Answers | "What has Datalent decided?" | "What does a genuine expert in this field know?" |

Both should inform any real deliverable. Memory tells an agent *who Datalent is*; knowledge tells an agent *what a real expert in this domain would know and check before advising anyone*.

## Domains

Each file below follows the same ten-section structure, so any agent can navigate any domain the same way:

1. **Core Concepts** — the foundational ideas a practitioner must understand before doing anything else in this field.
2. **Terminology** — precise definitions. Sloppy vocabulary is the fastest way to sound like an amateur in front of an expert buyer.
3. **Best Practices** — what disciplined, competent practice actually looks like.
4. **Frameworks** — named, citable models and methodologies a real practitioner would reference by name.
5. **Decision Trees** — the actual branching logic experts use to make a judgment call, not just a list of considerations.
6. **Anti-Patterns** — named failure modes to recognize and avoid, not just "don't do bad things."
7. **KPIs** — how competent practice is actually measured in this field.
8. **Common Mistakes** — the specific, recurring errors even experienced practitioners make.
9. **References to Standards** — the real bodies, regulations, and published frameworks this domain is accountable to.
10. **Future Trends** — where the field is credibly heading, so agents don't advise from a static or outdated model of the domain.

| Domain | File |
|---|---|
| Agentic AI | [agentic-ai.md](agentic-ai.md) |
| HR Strategy | [hr-strategy.md](hr-strategy.md) |
| People Analytics | [people-analytics.md](people-analytics.md) |
| Compensation & Total Rewards | [compensation-total-rewards.md](compensation-total-rewards.md) |
| AI Governance | [ai-governance.md](ai-governance.md) |
| EU AI Act | [eu-ai-act.md](eu-ai-act.md) |
| Workforce Intelligence | [workforce-intelligence.md](workforce-intelligence.md) |
| Enterprise Sales | [enterprise-sales.md](enterprise-sales.md) |
| Marketing | [marketing.md](marketing.md) |
| Consulting Methodologies | [consulting-methodologies.md](consulting-methodologies.md) |

## How agents should use this layer

- **Consult before advising, not after.** An agent producing a comp benchmark, an agent spec, or a governance brief should reason from the relevant knowledge file's frameworks and decision trees, not from first principles or generic instinct.
- **Cite the framework by name** when it shapes a recommendation ("using the Build-Buy-Borrow-Bot framework..." not just "we recommend hiring"). This is what separates a domain expert from a generic assistant.
- **Cross-domain deliverables consult multiple files.** A pay equity audit touches both `compensation-total-rewards.md` and `eu-ai-act.md`/`ai-governance.md` if any automated tooling is involved. An agentic AI recruitment spec touches `agentic-ai.md`, `ai-governance.md`, `eu-ai-act.md`, and `hr-strategy.md` (for the underlying talent decision it serves).
- **This layer does not override `.claude/memory/non-fabrication-policy.md`.** Knowledge here is general field expertise (named frameworks, real regulations, standard KPIs) — it is not a license to assert Datalent-specific facts, client outcomes, or certifications that haven't been verified. Applying a framework correctly and fabricating a result are different things; this layer supports the former and never justifies the latter.
- **This layer is not marketing content and produces none.** It exists so agents reason like domain experts internally — it is reference material, not copy to publish.
