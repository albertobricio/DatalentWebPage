# Framework Audit — Datalent Solutions AI Operating System

**Scope:** `.claude/` in full — 65 markdown files across seven folders (`agents/`, `commands/`, `memory/`, `templates/`, `knowledge/`, `intelligence/`, `execution/`) plus the root `CLAUDE.md` constitution. Built across four construction phases in this session: Operating System → Knowledge Layer → Intelligence Layer → Execution Layer.

**Method:** every finding below was verified by reading the actual files or grepping for actual cross-references — not asserted from memory of having written them. This mirrors the Evidence-First discipline (`.claude/intelligence/reasoning-patterns.md` Pattern 3) the system itself imposes on client deliverables; a self-audit that didn't apply the same rigor would be a credibility problem in its own right. No file was modified to produce this report.

**Headline verdict:** the system is well-designed *on paper* and internally coherent in its stated intent, but it has one structural problem large enough to color every other finding: **three of its four layers are currently invisible to the two layers that actually execute.** `agents/` and `commands/` are the only folders Claude Code's runtime treats as real, invocable objects (confirmed live in this session — the platform surfaced the eight agents and ten commands as available Agent/Skill types). `knowledge/`, `intelligence/`, and `execution/` — 76% of the system's word count — are reference documents with no mechanical guarantee anything ever reads them, because nothing in `agents/` or `commands/` points back to them. Everything else in this audit is worth fixing, but this is the one finding that determines whether the other three layers are load-bearing or decorative.

---

## 1. Architecture Consistency

### 1.1 The constitution doesn't know three of its four layers exist — Critical
`.claude/CLAUDE.md`'s folder map lists exactly four entries: `agents/`, `commands/`, `memory/`, `templates/`. Verified by direct search: zero mentions of `knowledge/`, `intelligence/`, or `execution/` anywhere in the constitution.

```
$ grep -n "knowledge/\|intelligence/\|execution/" .claude/CLAUDE.md
(no matches)
```

This isn't cosmetic. `.claude/CLAUDE.md` frames itself as "the constitution — non-negotiable operating rules for the whole system," read first, before anything else. As written, a reader (human or agent) following the constitution's own folder map would never learn the other three layers exist. The constitution predates them and was never updated when they were added, because each build phase was scoped to "only build this layer" — a reasonable per-turn constraint that, followed four times in a row, left the summary document silently out of date.

### 1.2 The one-way reference problem — Critical
This is the headline finding, stated precisely: `knowledge/README.md` asserts "every agent in `.claude/agents/` must consult the matching file(s) here," and `.claude/intelligence/coordination-protocol.md` and `.claude/execution/workflow-orchestrator.md` both describe agents as operating under capability-matrix scoring, mandatory quality gates, and a seven-phase project lifecycle. None of that is true from the agents' own side. Verified:

```
$ grep -rl "\.claude/knowledge" .claude/agents/       → no matches
$ grep -rl "\.claude/intelligence" .claude/agents/    → no matches
$ grep -rl "\.claude/knowledge\|\.claude/intelligence\|\.claude/execution" .claude/commands/  → no matches
```

Every `.claude/agents/*.md` file's own "Before you start" instructions name only `.claude/memory/*.md` files to read. Every `.claude/commands/*.md` file's steps name only `.claude/memory/` and `.claude/templates/` paths. If a user (or Claude Code) invokes `agentic-ai-architect` today exactly as its frontmatter describes, it will read two memory files and produce an agent spec — it will not open `.claude/knowledge/agentic-ai.md` for the frameworks that domain file defines, will not get scored via `.claude/intelligence/evaluation-engine.md`, and will not run inside `.claude/execution/workflow-orchestrator.md`'s checkpoint sequence — because nothing in its own definition tells it to. The Intelligence and Execution layers describe a system that would exist *if* the agent and command files pointed into them. Today, they don't.

**Why this happened:** each construction turn was explicitly scoped ("only build the knowledge layer," "only build the intelligence layer," "only build the execution layer," "do not modify" the prior layers). That discipline was followed correctly and is why nothing was broken in the process — but it also means the wiring step (going back into `agents/` and `commands/` to add the pointers) was never in scope for any single turn, so it never happened.

### 1.3 Frontmatter/metadata convention breaks down after `memory/` — Medium
`.claude/memory/*.md` files use structured YAML frontmatter (`name`, `description`, `metadata.type`) — 6 of 7 files. `.claude/knowledge/`, `.claude/intelligence/`, and `.claude/execution/` — 31 files, 76% of total word count — use none.

```
memory/:       6 of 7 files have YAML frontmatter
knowledge/:    0 of 11 files
intelligence/: 0 of 10 files
execution/:    0 of 10 files
```

This matters beyond tidiness: `memory/`'s frontmatter is what makes each file's purpose and type machine-parseable at a glance (the same pattern the session's own memory-file convention uses elsewhere). Three-quarters of the system opted out of that, which makes any future tooling built to index or route by metadata blind to most of the framework.

### 1.4 Terminology drift: "gate," "test," "checkpoint" used inconsistently across layers — Low
`.claude/intelligence/quality-gates.md` defines six numbered **Gates**. `.claude/execution/testing-engine.md` defines five numbered **Test Types** plus a composite-scoring step, and separately claims equivalence to the six gates (see §7.2 — this claim doesn't actually hold). `.claude/execution/workflow-orchestrator.md` then layers a third vocabulary, nine numbered **Checkpoints**, on top of both. The concepts are related but not identical, and nothing in the system defines how "Gate," "Test," and "Checkpoint" map onto each other precisely — a reader has to infer it, and (per §7.2) the inference doesn't fully close.

---

## 2. Duplicate Responsibilities

Not the same as contradiction (§7) — this section is about the same rule being *restated* (not linked, but rewritten) in many places, which is a drift risk even where every restatement currently agrees.

- **Non-fabrication discipline** is canonically defined once (`.claude/memory/non-fabrication-policy.md`) but restated in prose in at least six other files: `reasoning-patterns.md` Pattern 3, `quality-gates.md` Gate 1, `evaluation-engine.md`'s Evidence dimension, `testing-engine.md`'s Non-Fabrication Testing, `documentation-engine.md`'s Validation Marker Ledger, `release-engine.md`'s readiness checklist. Every instance currently agrees with the source, but six independent restatements is six places a future edit to the core policy has to be manually propagated to, with no mechanical link enforcing consistency.
- **Positioning / persona-panel review** is similarly restated across `competitive-positioning-analyst.md`, `positioning-check.md`, `quality-gates.md` Gate 4, `evaluation-engine.md`'s Executive Relevance dimension, `workflow-library.md`'s Positioning Check workflow, and `testing-engine.md`'s Persona-Panel Adversarial Testing — six touchpoints for one capability.
- **EU AI Act / governance classification** is distributed across `knowledge/eu-ai-act.md`, `knowledge/ai-governance.md`, `memory/compliance-glossary.md`, `agents/ai-governance-auditor.md`, `commands/ai-risk-classify.md`, `templates/ai-governance-brief-template.md`, `quality-gates.md` Gate 3, and `testing-engine.md`'s Governance/Compliance Testing — eight touchpoints. This one is partially mitigated by `.claude/intelligence/learning-loop.md`'s staleness-review table, which correctly flags regulatory content as high-decay-risk and names a review trigger — but the review trigger is itself unreferenced by any of the eight files it's supposed to govern.

None of these are wrong today. All of them are single points of truth in name only — the actual text lives in many places, and nothing enforces that an edit to the canonical file propagates to its restatements.

---

## 3. Knowledge Gaps

- **HR Strategy and Enterprise Sales have no owning agent** — self-documented honestly in `knowledge-graph.md`'s and `capability-matrix.md`'s "Coverage Gaps" sections (this is a case where the system correctly avoided fabricating coverage it doesn't have — a genuine strength, not just a gap). But it remains a real gap: two of the ten knowledge domains the user explicitly requested have no agent applying them and no command invoking them.
- **No "Consulting Methodologies / Project Delivery" knowledge domain maps cleanly onto the Execution Layer.** The ten knowledge domains (per the user's own list in the prior turn) don't include project management or delivery methodology as a first-class domain — `.claude/knowledge/consulting-methodologies.md` covers engagement lifecycle and change management at the level of a single client engagement, but the Execution Layer's Kanban/Sprint mechanics, WIP limits, and checkpoint model have no corresponding knowledge-layer grounding of their own; they were designed directly in `.claude/execution/` without a `.claude/knowledge/` domain file underneath them the way every other layer's mechanics trace back to a named framework.
- **No knowledge file addresses data privacy/GDPR as its own domain** — GDPR appears only as a supporting citation inside `eu-ai-act.md` and `ai-governance.md`, never as a domain in its own right, even though `memory/compliance-glossary.md` treats GDPR Article 22 as load-bearing for the firm's entire agentic-AI positioning claim.

---

## 4. Agent Overlap

This is one of the system's stronger areas — most boundaries are explicit and self-resolving:

- `people-analytics-analyst` (backward/current-state) vs. `workforce-intelligence-strategist` (forward-looking) — both agents' own definitions contain an explicit cross-routing sentence pointing to the other. Low risk.
- `compensation-benefits-specialist` (pure pay structure/benchmarking) vs. `total-rewards-strategist` (integration across reward pillars) — same pattern, explicit mutual routing notes. Low risk.
- `client-content-writer` (drafting) vs. `competitive-positioning-analyst` (review, and — per `positioning-check.md` — sometimes also rewriting) — this boundary is softer. `competitive-positioning-analyst`'s own definition says it "hands off to `client-content-writer`" for a rewrite, but `positioning-check.md` describes the reviewing agent producing "the rewrite" itself when asked. It's not a contradiction (both can be read as compatible — the analyst identifies what to fix, the writer executes it), but the two files don't describe the handoff the same way, and a stricter reading of `.claude/intelligence/coordination-protocol.md` Step 5 ("`client-content-writer` MUST NOT originate domain analysis" but positioning fixes aren't domain analysis) leaves this ambiguous enough to be worth a single clarifying sentence in one of the three files someday.

---

## 5. Unused Files

- **`.claude/templates/competitive-battlecard-template.md` is never referenced by any command or agent.** Verified: zero matches searching `.claude/commands/` and `.claude/agents/` for the filename. Seven of the eight templates are wired to exactly one command each; this one has no invoking workflow at all, despite `.claude/intelligence/workflow-library.md` and `.claude/knowledge/enterprise-sales.md` both treating battlecards as a real deliverable type.
- **The entire `.claude/execution/` folder (10 files) has zero inbound references from `.claude/commands/` or `.claude/agents/`.** This is the same root cause as §1.2, restated at the file level: nothing a user would actually type invokes the Execution Layer. It's fully specified and internally self-consistent (its own files cross-reference each other correctly), but as a *system*, it's currently reachable only by a human or an orchestrating Claude instance manually deciding to read and follow it — there's no entry point.

---

## 6. Missing Workflows

- **`people-analytics-analyst` and `total-rewards-strategist` have zero dedicated commands.** Verified directly:

  ```
  people-analytics-analyst:        0 commands name it as primary actor
  total-rewards-strategist:        0 commands name it as primary actor
  compensation-benefits-specialist: 2
  client-content-writer:            4
  (all other agents:                1 each)
  ```

  Two of eight agents — covering People Analytics diagnostics and integrated Total Rewards design, both explicitly named in the user's required practice list — have no `/slash-command` entry point at all. They're only reachable if a request happens to route to them through the Intelligence Layer's dynamic selection, which (per §1.2) nothing currently triggers automatically either.
- **No command initiates a Project.** `.claude/execution/workflow-orchestrator.md`'s own summary flow starts with "is this a Project or a single Workflow? If single Workflow, exit to `coordination-protocol.md` directly" — implying Projects are the *other* branch. But every one of the ten existing commands maps to a single Workflow; none of them (and no eleventh command) triggers Discovery/`project-manager.md`. The Execution Layer has no door in.
- **No command produces a competitive battlecard** — ties directly to the orphaned template in §5.

---

## 7. Contradictory Rules

### 7.1 Who scores "AI Quality" — Confirmed contradiction, Medium-High severity
`.claude/intelligence/evaluation-engine.md`, "Who Scores" section, states plainly: *"`ai-governance-auditor` is the default scorer for Governance **and AI Quality**."*

`.claude/execution/testing-engine.md`, Domain-Accuracy Testing (the test type that explicitly owns the "HR Quality or AI Quality score ≤ 2" pass/fail criterion), states: *"Who runs it: **the specialist agent owning the matching capability tag** per `.claude/intelligence/capability-matrix.md`."* For an agentic-design task, that specialist is `agentic-ai-architect` — the same agent that produced the work being scored.

These two files assign AI Quality scoring to two different agents, and the second assignment amounts to self-scoring on exactly the dimension `evaluation-engine.md` says shouldn't be self-scored alone ("Self-scoring alone on Evidence or Governance is not sufficient" — AI Quality isn't named in that sentence's exception list, implying it also shouldn't be self-scored, which directly conflicts with `testing-engine.md`'s assignment).

### 7.2 The "six-gate structure" equivalence claim doesn't hold — Confirmed contradiction, Medium severity
`.claude/execution/testing-engine.md` states: *"This is the same six-gate structure as `.claude/intelligence/quality-gates.md`."* It is not. `quality-gates.md` defines six gates, the sixth being a **Human-Readiness Check**. `testing-engine.md` defines five numbered test types — Non-Fabrication, Persona-Panel, Governance/Compliance, Domain-Accuracy, **Regression** — plus a composite-scoring step. Regression Testing has no counterpart anywhere in `quality-gates.md`; Gate 6 (Human-Readiness) has no counterpart anywhere in `testing-engine.md`'s named battery. The two pipelines overlap substantially but are not the same structure, and the file's own equivalence claim is the kind of unverified assertion the system's non-fabrication discipline would flag if it appeared in a client deliverable.

### 7.3 Internal ordering mismatch inside `testing-engine.md` itself — Low-Medium severity
The file's own numbered section headers order the five test types as: 1 Non-Fabrication, 2 Persona-Panel, 3 Governance, 4 Domain-Accuracy, 5 Regression. Its "Full Battery Sequencing" diagram, four paragraphs later in the same file, states the actual execution order as: 1 Non-Fabrication, 2 Domain-Accuracy, 3 Governance, 4 Regression, 5 Persona-Panel. The two orderings agree only on position 1. A reader following the section numbers and a reader following the sequencing diagram would run the battery in different orders.

---

## 8. Scalability

**Quantified system size:** 65 files, ~3,200 lines, ~46,000 words.

```
knowledge/:    15,397 words  (33%)
intelligence/: 10,798 words  (24%)
execution/:     8,902 words  (19%)  → these three layers: 76% of the system
agents/:        3,547 words   (8%)
memory/:        2,614 words   (6%)
commands/:      1,885 words   (4%)
templates/:     1,865 words   (4%)  → these four: 22%, and the only ones runtime-wired
```

Two distinct scalability concerns follow from this shape:

1. **Enforcement scaling.** Every "automatic checkpoint," "hard gate," and "mandatory inclusion rule" in `.claude/intelligence/` and `.claude/execution/` is a procedural instruction for whichever Claude instance is reasoning at the time — there is no code, no CI, no mechanical enforcement layer. That's an inherent property of a markdown-instruction system, not a defect, but it means reliability scales with how much of this ~46,000-word corpus a given session actually reads and applies, not with how completely the corpus is written. As the system grows, the gap between "the rule exists" and "the rule is reliably followed" widens unless the runtime-wired layers (`agents/`, `commands/`) are kept current with pointers into the rest — which, per §1.2, they currently aren't.
2. **Edit-surface scaling.** Adding one new agent today requires touching, by this audit's count, at least six files to stay consistent: `capability-matrix.md` (profile + tags), `knowledge-graph.md` (node + edges), `workflow-library.md` (if it owns a new workflow), `review-engine.md` (its reviewer-pairing table), `implementation-engine.md` (its WIP-limit table), and potentially `decision-engine.md` or `coordination-protocol.md` if it introduces a new mandatory-inclusion rule. That's a roughly linear-to-superlinear maintenance cost per addition, which is manageable at 8 agents and gets materially harder to keep synchronized at, say, 20.

---

## 9. Maintainability

**Strengths, genuinely:**
- Nearly every file ends with an explicit "Non-Negotiables" and often a "Maintenance" section that names what to update and when — this is well above the bar for markdown-instruction systems and is a real asset.
- `.claude/intelligence/learning-loop.md` and its staleness-review table are a legitimately good mechanism *in design* for keeping the system from going stale silently — the problem (§2, §8) is that nothing currently triggers it automatically from the layers that actually run.
- The system is honest about its own gaps where it identified them during construction (Coverage Gaps in `knowledge-graph.md`/`capability-matrix.md`) — that honesty is consistent with, and a good sign for, the same standard it holds client deliverables to.

**Weaknesses, concretely:**
- No versioning or changelog convention exists anywhere in `knowledge/`, `intelligence/`, or `execution/` (only `memory/`'s frontmatter gestures at structured metadata, and even that has no date/version field) — so "when was this rule last true" is unanswerable from the files themselves, which directly undercuts `learning-loop.md`'s own traceability requirement for the very files it's supposed to keep current.
- The one-way reference problem (§1.2) is, from a maintainability standpoint, the most expensive kind of gap: it's invisible during normal reading (every individual file reads as complete and correct in isolation) and only surfaces under the kind of cross-file verification this audit performed. That's exactly the failure mode a future contributor is least likely to catch by inspection.

---

## Summary Table

| Dimension | Verdict |
|---|---|
| Architecture consistency | **Weak** — constitution stale, one-way reference gap between runtime-wired and reference layers |
| Duplicate responsibilities | **Moderate risk** — no wrong duplication found, but 6-8 independent restatements of the same rules with no enforced link |
| Knowledge gaps | **Minor, self-documented** — HR Strategy / Enterprise Sales gaps are honest, not hidden |
| Agent overlap | **Well-managed** — explicit mutual routing notes in the two real overlap cases |
| Unused files | **Confirmed** — 1 orphaned template, 1 entire orphaned layer (execution/) |
| Missing workflows | **Confirmed** — 2 of 8 agents have no command; no Project entry point exists |
| Contradictory rules | **Confirmed, 3 instances** — AI Quality scorer conflict, false equivalence claim, internal ordering mismatch |
| Scalability | **Bounded today, tightening** — 76% of the system has no mechanical enforcement; edit-surface per new agent is already ~6 files |
| Maintainability | **Mixed** — strong per-file discipline, no cross-file versioning, the costliest gap (§1.2) is invisible to single-file review |

**Net assessment:** the four layers are each internally well-constructed and the *design* is sound — but as a working system, it currently functions as two layers (`agents/`, `commands/`) doing real work, with two more (`knowledge/`, `intelligence/`) and one more (`execution/`) sitting alongside them as a well-written specification for a system that hasn't been connected to its own entry points yet. That gap, and the three concrete contradictions in §7, are the highest-value things to address before adding a fifth layer or more agents on top of the current 65 files.
