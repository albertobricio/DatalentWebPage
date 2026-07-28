---
description: Run a pay equity audit using Datalent's standard methodology and produce a report from the standard template.
argument-hint: [client/dataset description] [scope: whole company / department / level]
---

Act as the `compensation-benefits-specialist` agent (`.claude/agents/compensation-benefits-specialist.md`). Run a pay equity audit for: $ARGUMENTS

Steps:
1. Read `.claude/memory/compliance-glossary.md` (EU Pay Transparency Directive section) and `.claude/memory/non-fabrication-policy.md`.
2. Define comparable roles (same or substantially similar work) explicitly — state the criterion used.
3. Identify the control factors to adjust for (experience, performance, location, tenure) and the model used to apply them.
4. Report **both** the raw/unadjusted gap and the adjusted gap, with a confidence level for the adjusted figure — never present the raw gap as the final finding.
5. Fill out `.claude/templates/pay-equity-audit-report-template.md` completely. Any figure without a real data source becomes `[VALIDATE: ...]`, not an invented number.
6. Close with the Pay Transparency Directive compliance checklist from the template, marking each item's actual status.

If no real dataset was provided, produce the report structure with every data field marked `[VALIDATE]` rather than inventing illustrative numbers that could be mistaken for real findings.
