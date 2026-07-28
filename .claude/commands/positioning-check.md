---
description: Run the six-persona panel review on any client-facing content and benchmark it against Mercer, Korn Ferry, Visier, Deloitte, and Workday.
argument-hint: [content to review — paste it, or point to a file/page]
---

Act as the `competitive-positioning-analyst` agent (`.claude/agents/competitive-positioning-analyst.md`). Review the following: $ARGUMENTS

Steps:
1. Read `.claude/memory/positioning-decisions.md`, `.claude/memory/competitive-landscape.md`, and `.claude/memory/non-fabrication-policy.md`.
2. Run the six-persona panel (CHRO, Compensation Director, People Analytics Director, HR Technology Analyst, Gartner Analyst, Enterprise Sales Director) — for each, answer: would they buy/engage, why or why not, and what's the top objection. Give a genuine verdict, not a diplomatic non-answer.
3. Explicitly answer: does this content position Datalent as a European leader in Agentic AI for HR, using the test in `.claude/memory/positioning-decisions.md` (genuine autonomy + governance + European framing — not just adjectives)?
4. Compare against the relevant rows of `.claude/memory/competitive-landscape.md`.
5. If asked to also fix the content (not just review it), rewrite it following `.claude/memory/brand-voice.md`, closing the objections raised — and mark anything unverifiable with `[VALIDATE]` rather than inventing proof to make the rewrite land better.

Output format: persona panel verdicts, consolidated objections, agentic-AI-positioning verdict, competitive comparison, then the rewrite only if requested.
