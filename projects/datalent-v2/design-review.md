# Design Review — Website v2 Design System

**Scope:** `design-system.md`, `design-tokens.md`, `component-library.md`, `home-wireframe.md`, `page-wireframes.md` — the five UX specification documents, as written. This is a review, not a redesign — no new token, component, or layout is proposed here; only findings and, where a finding is high-impact enough to warrant it, a direction for someone else to design toward.

**Panel:** five reviewers, each with a genuinely different mandate, so a finding that survives all five is worth taking seriously and a finding only one of them raises is worth weighing accordingly.

| Reviewer | What they're actually checking |
|---|---|
| **Creative Director** | Does this cohere as one confident creative point of view, or does it read as a checklist? |
| **Pentagram Partner** | Is there an actual identity here, or only an interface? Would this survive being put next to a real, world-class brand system? |
| **IDEO Design Director** | Does the system serve the human on the other end of it — does it build trust the way a person actually builds trust, not just the way a spec sheet claims to? |
| **Enterprise UX Director** | Will this convert and scale across real enterprise buying journeys, or does it optimize for looking good in a wireframe review? |
| **Gartner Digital Experience Analyst** | Where does this actually sit against the category's real maturity curve — Workday, Visier, Mercer, Deloitte's own digital presence — not against an idealized competitor? |

---

## Panel Reactions, in Voice

**Creative Director:** "The point of view is real and it's argued, not just asserted — the break from the neon-cyan direction is the right call and the rationale in `design-system.md` actually holds up. But a point of view expressed only through restraint and a type scale isn't yet a *creative* idea. Right now this is a very well-reasoned absence of bad decisions. I want to see one deliberate, ownable creative choice — a mark, a distinctive layout signature, something — not just 'we removed the glow.'"

**Pentagram Partner:** "Where's the identity? I can tell you the button radius, the hairline border weight, the exact contrast ratio of every text color — and I cannot tell you what the logo looks like, what the photography direction is, or what makes this system recognizably *Datalent* rather than recognizably *well-executed enterprise SaaS template*. A token system is not a brand. This is a very competent interface specification wearing brand language."

**IDEO Design Director:** "The non-fabrication discipline threaded through every wireframe — no fake stats, no empty case-study slot, an honest CTA label instead of implying a calendar tool that doesn't exist — that's genuinely human-centered design, and it's rarer than it should be. But trust isn't only built by *not lying*. It's built by showing your work. Where does a visitor meet the actual people doing this? Pillar 3 is 'Senior Judgment' and there is not one component, on any Wave 1 page, that shows a single senior person. That's the gap I'd fix first."

**Enterprise UX Director:** "The mobile-first discipline and the component reuse are solid engineering-of-design — this will hold up across pages, which matters more than it gets credit for. My concern is the Home hero asking a cold visitor to choose between two co-equal CTAs before telling them anything. That's a real conversion tax, not a stylistic quibble — enterprise buyers in particular don't like being asked to self-segment before they've been given a reason to."

**Gartner Digital Experience Analyst:** "Measured against Workday's or Deloitte's actual public sites, this system is philosophically ahead on one axis — evidentiary honesty — and behind on another — perceived scale and social proof. A Fortune 500 evaluator's first fifteen seconds on a vendor site are a scale/legitimacy check, not a philosophy check. This system currently has nothing to say in those fifteen seconds beyond 'we are careful.' Careful is necessary. It is not sufficient at that stage of the funnel."

---

## Scores

| Area | Score /10 |
|---|---|
| Visual hierarchy | 7 |
| Enterprise credibility | 6 |
| European consulting positioning | 6 |
| Trust | 7 |
| Readability | 8 |
| Accessibility | 9 |
| Executive perception | 5 |
| Would a Fortune 500 CHRO trust this? | 5 |

### Visual hierarchy — 7/10
The systematic foundation is genuinely sound: `design-tokens.md`'s type scale has a defensible ratio logic, mobile-first sizing that doesn't shrink a desktop-authored scale, and `component-library.md`'s left-aligned, non-centered hero rule is a real, specific, correctly-reasoned choice that most B2B sites get wrong. The deduction is concentrated in one place: `home-wireframe.md`'s hero presents two co-equal primary CTAs (`diagnostico` and `briefing`) before the visitor has been told anything. Two equal-weight primary actions at the top of the page is, structurally, an absence of hierarchy at exactly the moment hierarchy matters most. The four-pillar block and the service-card grid are both competent, standard patterns — correctly executed, not distinctively composed.

### Enterprise credibility — 6/10
The restraint principle (`design-system.md`, "no glow, no gradient CTAs, no stock AI clichés") is exactly right for this positioning and is a real improvement over the current site. What's missing is anything that *adds* credibility rather than just removing the things that undermine it. There is no logo/wordmark spec, no imagery or photography direction beyond the single vague line "an abstract geometric mark reflecting the governed system concept" (`home-wireframe.md`'s Desktop section) — which is a placeholder, not a direction. Enterprise credibility is disproportionately carried by identity craft and by visible proof of scale (team, security posture, recognizable clients) — this system currently supplies neither.

### European consulting positioning — 6/10
The rationale in `design-system.md` (light-forward over dark-mode-by-default, editorial whitespace over app-density, restraint over decoration) is well-argued and directionally correct. The execution risk: standardizing on Inter alone (`design-tokens.md`'s Typography section) is defensible on minimalism grounds, but Inter is also the de facto default typeface of thousands of generic SaaS and startup sites — using it without a distinctive treatment (unusual scale relationships, a genuinely uncommon weight/tracking combination, or a considered display alternative reserved for hero moments) risks the system reading as *generic tech company minimalism* rather than *European consulting minimalism*, which are not the same register even though both are "minimal." The document itself considered and rejected a serif pairing "to avoid a second font-load" — a reasonable performance argument, but one made without weighing it against the differentiation cost.

### Trust — 7/10
This is where the system's real strength lives, and it should be named plainly: the standing rule against publishing any unsourced statistic, the explicit decision to omit case-study and client-logo sections entirely rather than fill them with placeholders (`home-wireframe.md`'s "Explicit Omissions" section), and the honest CTA-labeling requirement on the Contact page (no implied calendar-booking tool that doesn't exist, `page-wireframes.md` Part C) are all genuine, rare discipline — most design systems don't think this carefully about what *not* to claim. The score isn't higher because avoiding false trust signals is necessary but not the same as actively building trust, and the system currently has no active trust-building mechanism to fill the space where the case studies will eventually go — see Executive Perception below.

### Readability — 8/10
Strong. The type scale's line-heights (1.6 for body copy, appropriately tighter for display), the decision to hold body-text sizes constant across breakpoints rather than scaling them (`design-tokens.md`), and the explicit rule against placeholder-as-label form inputs (`component-library.md`'s Form Input spec) are all correct, specific decisions. One concrete gap: no reading-measure (optimal characters-per-line) token is specified anywhere for body copy — `design-system.md` mentions a general "constrained, not full-bleed" container rule, but readability at the paragraph level depends on a stated line-length target, and none exists in `design-tokens.md`.

### Accessibility — 9/10
The strongest area of the five documents, and it should be scored accordingly rather than graded on a curve. `design-tokens.md`'s Contrast Verification table shows actual computed WCAG luminance-formula ratios, not asserted compliance — including a self-caught guardrail (`color.mist` fails at 2.18:1 on light surfaces despite passing at 7.89:1 on dark ones, documented specifically so the two aren't confused). `component-library.md` specifies real button semantics closing the current site's 15-instance pseudo-link problem, accurate `aria-expanded` state on the mobile nav, visible focus states, 44×44px touch targets, and a stated `prefers-reduced-motion` fallback. The one point held back: every check performed is a contrast-ratio check; there's no stated consideration of color-vision-deficiency differentiability (e.g., whether `color.signal`, `color.error`, and `color.success` remain distinguishable under deuteranopia) — a related but distinct concern from contrast, and the system's "never color alone" pattern mitigates but doesn't fully substitute for it.

### Executive perception — 5/10
The weakest area, and the one the panel converged on independently. A Fortune 500 CHRO's staff evaluating a vendor spends the first pass checking for signals of real scale and legitimacy — a leadership/team page, recognizable proof points, visible security posture. `site-map.md` correctly defers the "Why Datalent" (team/credibility) page to Wave 2, and Wave 1 is honest about not having case studies yet — but the design system compounds that deferral by having *no* interim mechanism anywhere in Wave 1 (not the Home hero, not the Trust strip, not any service page) that shows a real senior practitioner is behind this work. Pillar 3 is literally "Senior Judgment, Boutique Scale" and no Wave 1 wireframe puts a name, a face, or a credential anywhere on the site.

### Would a Fortune 500 CHRO trust this? — 5/10
Conditionally, and only for a low-commitment first step. This verdict is actually *consistent* with the firm's own `roadmap.md`, which explicitly sequences Tier 3 (enterprise) pursuit after Tier 1/2 proof exists rather than pursuing it in parallel — so a 5/10 here isn't a design failure relative to what this phase was supposed to achieve, it's an accurate reading of a Phase-0/1-stage site being evaluated against a Phase-3-stage bar. The honest evidence discipline would likely earn cautious respect from a sophisticated buyer (it's a relief not to see fabricated stats); the absence of any team/credibility signal would likely stop that same buyer from going further than a first diagnostic conversation. That gap between "would take a first call" and "would trust a full retained relationship" is exactly the gap `roadmap.md` Phase 1's case-study milestone is designed to close.

---

## Recommendations (High Impact Only)

Five, ranked. Each is chosen because it moves more than one score above, not because it's the only thing worth fixing.

1. **Specify a brand identity direction — logo/wordmark treatment and a real imagery/illustration system — before this goes further.** Currently the only visual-identity instruction in the entire system is one placeholder sentence in `home-wireframe.md`. This single gap depresses Enterprise Credibility, European Positioning, and the Pentagram/Creative Director reactions simultaneously; it's the highest-leverage fix available.
2. **Pull a lightweight "led by" credibility device forward into Wave 1**, rather than waiting for the full Wave 2 team page — even a single senior-practitioner name and credential line on the Home hero or the AI Governance/Agentic AI pages (the two highest-stakes pages per `page-specs.md`) would directly address Executive Perception and the IDEO Director's specific finding, without requiring the full Wave 2 build.
3. **Resolve the Home hero's dual-CTA tension.** Make one CTA visually primary and the other secondary/lower-emphasis, rather than two co-equal buttons — a small hierarchy fix with a real, measurable effect on the exact conversion-routing job `page-specs.md` assigns to Home.
4. **Reconsider Inter-only as under-differentiated for this specific positioning claim.** Either commit to a genuinely distinctive treatment of Inter at display sizes (unusual scale/tracking, not just "bigger and bolder") or revisit the rejected serif-pairing option with the differentiation cost weighed explicitly against the font-load cost — as written, the decision only shows one side of that trade-off.
5. **Add a reading-measure token** (a stated optimal line-length, e.g., ~65–75 characters, for `type.body`) to `design-tokens.md`. Small, concrete, and the one clear gap in an otherwise strong Readability score.

## What's Genuinely Working (Don't Lose This in a Revision)

- The non-fabrication discipline carried all the way into the wireframe layer — omitted sections rather than placeholder content — is a real differentiator and should survive any future revision untouched.
- The accessibility work is close to exemplary for a pre-implementation spec: computed, not asserted, contrast ratios; real semantics for the current site's known-broken patterns; stated reduced-motion behavior.
- The single-token-system discipline directly answering `docs/architecture.md`'s three-way color fragmentation is exactly the right fix and should be protected as non-negotiable in implementation, not "simplified" under deadline pressure.
