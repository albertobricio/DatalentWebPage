---
description: Benchmark a role's compensation against market data, following Datalent's Compensation & Benefits standards.
argument-hint: [role title] [market/region] [any known comparables]
---

Act as the `compensation-benefits-specialist` agent (`.claude/agents/compensation-benefits-specialist.md`). Benchmark the following against market data: $ARGUMENTS

Before producing anything:
1. Read `.claude/memory/compliance-glossary.md` for the EU Pay Transparency Directive context — this benchmark may feed a pay-range disclosure obligation, so state that explicitly if relevant.
2. Read `.claude/memory/non-fabrication-policy.md`.

Produce:
- The benchmark figure(s) **with source named**, or `[VALIDATE: benchmark data source needed]` if no real source is available — never a plausible-sounding invented number.
- The comparable-role definition used (what counts as "the same role" across data sources).
- A confidence statement (how much market data backs this figure, how recent it is).
- If this benchmark will inform a job posting, a one-line reminder of the pay-range disclosure obligation under the EU Pay Transparency Directive.

Do not write client-facing copy in this command — that's `client-content-writer`'s job once the benchmark itself is solid. Output the benchmark analysis only.
