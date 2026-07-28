# Knowledge Domain: Workforce Intelligence

This domain is distinct from `people-analytics.md`: People Analytics is primarily backward/current-state (what happened, what's happening now, inside the organization). Workforce Intelligence is forward-looking (what will the organization need) and combines internal planning with external labor-market signal.

## 1. Core Concepts

- **Workforce intelligence = internal forward planning + external labor-market signal.** A workforce plan built only on internal data (current headcount, current attrition trend) without external market context (talent scarcity, salary inflation, skills availability) is incomplete.
- **Scenario planning, not point forecasting.** The future is uncertain by definition; a credible workforce plan presents a small number of distinct scenarios with stated assumptions, not a single confident number.
- **Skills, not just headcount, is the real planning unit.** "We need 10 more people" is a weaker planning statement than "we need these specific skills, which could come from 10 hires, 15 reskilled internal moves, or a combination" — the skills lens opens more levers than a pure headcount lens.
- **Critical/pivotal roles deserve disproportionate planning attention** (see `hr-strategy.md`) — generic workforce sizing across all roles equally wastes planning effort on roles where variance doesn't matter much strategically.
- **Time horizon changes the right method.** Near-term (operational, 0–12 months) planning is different in method and precision from long-term (strategic, 3+ years) scenario planning; conflating the two produces false precision at the long end and insufficient rigor at the short end.

## 2. Terminology

- **Labor Market Intelligence (LMI)** — external data on talent supply, demand, compensation trends, and skills availability, typically drawn from job-posting data, government labor statistics, and salary survey trend data.
- **Skills taxonomy / skills graph** — a structured model of skills and their relationships (adjacencies, prerequisites), used to plan reskilling paths and assess capability gaps beyond simple job titles.
- **Scenario planning** — modeling multiple plausible futures based on differing key assumptions, rather than a single forecast.
- **Workforce segmentation** — dividing the workforce into meaningful groups (by criticality, skill type, or strategic value) for differentiated planning, rather than treating the whole workforce uniformly.
- **Critical / pivotal role** — see `hr-strategy.md`; a role whose performance or availability variance has outsized strategic impact.
- **Build-Buy-Borrow-Bot(-Bridge)** — the standard talent-sourcing decision framework (see Frameworks below).
- **Demand forecasting** — projecting future workforce/skills requirements based on business plans and assumptions.
- **Internal talent marketplace** — a platform/practice enabling employees to move to internal opportunities (projects, gigs, roles) based on skills match, functioning as an internal "buy vs. build" mechanism.
- **Time-to-skill** — how long it realistically takes to develop a given skill internally, a key input to the build-vs-buy decision.

## 3. Best Practices

- Always produce multiple scenarios (commonly 2–3: e.g., baseline, accelerated growth, downside) rather than a single forecast presented as certain.
- Separate the headcount question from the skills question explicitly — a gap can be closed by hiring, reskilling, redeploying, or automating, and these are different decisions with different costs and timelines.
- Cite every external labor-market claim to a real, checkable source (job-posting volume data, government labor statistics, a named salary survey) — never assert market conditions from general impression.
- Revisit workforce plans on a cadence tied to the actual business planning cycle (e.g., aligned to budget cycles), not as an isolated annual HR exercise disconnected from financial planning.
- Identify critical/pivotal roles first, and concentrate the most rigorous planning effort there rather than spreading equal effort across the entire workforce.
- Stress-test any plan against at least one downside scenario, not only growth scenarios.

## 4. Frameworks

- **Build-Buy-Borrow-Bot(-Bridge)** (extending Boudreau/Cascio) — five talent-sourcing levers: Build (develop internally), Buy (hire externally), Borrow (contract/interim/partner), Bot (automate the task instead of staffing it), Bridge (redeploy/transition talent out gracefully where no longer needed). A comprehensive workforce plan considers all five levers, not just hiring.
- **3-Horizon workforce planning** — Horizon 1: near-term, operational, high-precision planning; Horizon 2: mid-term, tactical, moderate uncertainty; Horizon 3: long-term, strategic, scenario-based with wide uncertainty bands. Using the wrong horizon's method (e.g., false precision at Horizon 3) is a common planning failure.
- **Skills-Based Organization (SBO) model** — organizing workforce planning, mobility, and pay around skills rather than fixed jobs, increasingly used to make Build/Buy/Borrow/Bot decisions more granular and faster.
- **Scenario planning matrix (2x2)** — building scenarios along two orthogonal, high-uncertainty, high-impact axes (e.g., "market growth: high/low" × "talent availability: high/low") to generate structurally distinct, non-arbitrary scenarios rather than an unstructured list of guesses.

## 5. Decision Trees

**Build, buy, borrow, or automate this capability?**
- Is the skill available (or developable within the needed time-to-skill) in the internal talent pool? → Build.
- Is the skill scarce externally, mission-critical, and needed long-term, with budget available? → Buy.
- Is the need temporary, highly specialized, or uncertain in duration? → Borrow.
- Is the task itself a candidate for automation or an agentic AI workflow (see `agentic-ai.md`) rather than requiring a person at all? → Bot — but only after confirming this doesn't just relocate the risk into an ungoverned AI deployment (coordinate with `ai-governance.md`).

**Is this a headcount gap or a skills gap?**
- Does the organization have the right number of people but the wrong capabilities for what's coming? → Skills gap — prioritize reskilling/redeployment levers.
- Does the organization lack sufficient people regardless of skill mix? → Headcount gap — prioritize hiring levers, but still assess whether internal mobility can partially close it first.

## 6. Anti-Patterns

- Presenting a single-point headcount forecast as if it were certain, with no stated assumptions or alternative scenario.
- Building a workforce plan in isolation from the financial/business plan, producing a plan the business can't actually fund or doesn't structurally support.
- Relying on self-reported skills inventories that are never validated against actual capability, producing an inaccurate picture of true internal skills supply.
- Defaulting to external hiring without first assessing internal mobility/redeployment potential.
- Building a plan once and never revisiting it as market or business conditions change materially.

## 7. KPIs

- Forecast accuracy — actual vs. planned headcount/skills mix, tracked retrospectively over time to calibrate future planning
- Time-to-fill for critical/pivotal roles specifically (not just organization-wide average, which can mask critical-role problems)
- Internal fill rate — % of open roles filled via internal mobility vs. external hire
- Skills-gap closure rate — progress against identified capability gaps over a defined period
- Workforce plan-to-business-plan alignment score (a qualitative/structured check that the workforce plan and the financial/business plan are mutually consistent)
- Scenario-plan refresh cadence adherence — whether plans are actually revisited on the intended schedule

## 8. Common Mistakes

- Treating external labor-market commentary as established fact without a cited, checkable source.
- Conflating a hiring plan (headcount only) with a genuine workforce plan (which includes skills mix, structure, and sourcing-lever mix across Build/Buy/Borrow/Bot).
- Ignoring reskilling as a viable lever and defaulting reflexively to external hiring, even where time-to-skill would make reskilling competitive.
- Failing to stress-test a plan against a downside scenario, leaving the organization unprepared if growth assumptions don't materialize.
- Applying long-horizon planning precision expectations to short-horizon operational plans, or vice versa — using the wrong horizon's method for the question at hand.

## 9. References to Standards

- **ISO 30414** — includes workforce planning-related human capital metrics within its broader reporting framework.
- **World Economic Forum Future of Jobs Report** — a widely cited methodology and dataset for macro labor-market and skills-trend analysis.
- **OECD Skills for Jobs database** — methodology and data source for skills-supply/demand analysis at a national/sectoral level.
- **National labor statistics agencies** (e.g., Eurostat at the EU level, INE in Spain) — the primary, citable source standard for any labor-market claim used in a workforce intelligence deliverable; general impression or unsourced "market conditions" claims should always be replaced with a named source from bodies like these.

## 10. Future Trends

- Shift from periodic, survey-based labor-market intelligence toward real-time data feeds (job-posting analytics, wage trend APIs), enabling continuous rather than periodic re-forecasting.
- Skills graphs and AI-driven skills-adjacency mapping becoming standard infrastructure underlying workforce planning, replacing static job-based taxonomies.
- Increasing use of agentic AI (see `agentic-ai.md`) for continuous, always-on scenario re-forecasting rather than discrete, periodic planning cycles — with the same governance discipline (see `ai-governance.md`, `eu-ai-act.md`) applying to any such system that influences workforce decisions.
- Convergence of internal talent marketplaces with workforce intelligence platforms, enabling real-time build-vs-buy-vs-borrow decisions rather than decisions made only at planning-cycle checkpoints.
