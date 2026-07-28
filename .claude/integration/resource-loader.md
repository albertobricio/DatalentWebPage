# Resource Loader

`context-loader.md` decides *what* to load and in *what order*. This file defines *how* each distinct resource type in `.claude/` is actually read once selected — the seven file shapes in this system aren't all read the same way, and treating them identically is a quiet source of errors (e.g., trying to apply YAML parsing rules to a markdown template, or treating a knowledge file's ten fixed sections as freeform prose).

## Resource Type: Registry (`registry.yaml`)

Read as structured YAML, not prose. The consumer needs specific fields (`loads`, `invokes`, `consumed_by`, `depends_on`, `primary_tags`), not a narrative summary. When resolving a specific agent's load set, jump directly to that agent's entry under the `agents:` key rather than reading the whole file top to bottom every time — but the `resolved_conflicts` and `orphans_resolved` sections should always be checked in full at least once per session, since they override or supplement other files' own text.

## Resource Type: Agent Definition (`.claude/agents/*.md`)

Structured as YAML frontmatter (`name`, `description`, `tools`, `model`) followed by a system-prompt body. Read the frontmatter first to confirm identity and tool scope, then the body for role, methodology, and non-negotiables. Per `bootstrap.md` Step 6, an agent's own "Before you start" section is a *partial* list — always supplement it with `registry.yaml`'s `loads` entry for that agent rather than treating the file's own text as complete.

## Resource Type: Command (`.claude/commands/*.md`)

Structured as YAML frontmatter (`description`, `argument-hint`) followed by an instruction body written as a prompt template (using `$ARGUMENTS`). Read as an instruction to execute, not as reference material — a command file tells the invoking Claude instance what to do, it doesn't describe a static fact. Cross-check its named agent(s) against `registry.yaml`'s `commands[].invokes` entry for the mandatory/conditional agents the command's own prose may abbreviate or omit.

## Resource Type: Memory (`.claude/memory/*.md`)

Structured as YAML frontmatter (`name`, `description`, `metadata.type`) followed by a rule/fact, a **Why:** line, and a **How to apply:** line (per the memory system's own documented convention). Read the frontmatter's `metadata.type` first to know which of the four memory types (`user`/`feedback`/`project`/`reference`) is being read, since that shapes how much weight to give it — a `feedback` entry (a corrected behavior) carries different force than a `reference` entry (a pointer to an external system).

## Resource Type: Template (`.claude/templates/*.md`)

Structured as an HTML-comment header (usage note: which agent/command uses it) followed by a fillable scaffold with bracketed placeholders. Never read as finished content — every bracketed field must be either filled with real, sourced material or explicitly marked `[VALIDATE: ...]` per `.claude/memory/non-fabrication-policy.md`. A template with unfilled brackets left as literal bracket text in a final deliverable is a defect, not an acceptable partial output.

## Resource Type: Knowledge (`.claude/knowledge/*.md`)

Structured as ten fixed sections (Core Concepts, Terminology, Best Practices, Frameworks, Decision Trees, Anti-Patterns, KPIs, Common Mistakes, References to Standards, Future Trends — per `.claude/knowledge/README.md`'s own contract). Because the structure is fixed and identical across all ten domain files, a consumer can jump directly to the relevant section (e.g., only Frameworks and Decision Trees for a specific judgment call) rather than reading a domain file end-to-end for every use — this is the mechanism `context-loader.md`'s "Partial Loading for Narrow Requests" section refers to.

## Resource Type: Intelligence (`.claude/intelligence/*.md`)

Mixed structure — some are primarily prose-with-tables (`evaluation-engine.md`, `capability-matrix.md`), some are primarily named decision trees (`decision-engine.md`), one is primarily a diagram (`knowledge-graph.md`'s Mermaid graph). Read these as *system rules*, not domain reference — unlike knowledge files, an intelligence file's content directly governs how the reading agent should behave in the current request, not just what it should know.

## Resource Type: Execution (`.claude/execution/*.md`)

Each file owns one lifecycle phase (or is explicitly cross-cutting) and is structured around a numbered procedure specific to that phase, ending in a "Non-Negotiables" section. Read execution files in the phase sequence `.claude/execution/workflow-orchestrator.md` defines, not independently — a phase-owning file's procedure typically assumes the prior phase's checkpoint has already passed, per `registry.yaml`'s `execution[].depends_on` chain.

## Common Loading Errors to Avoid

- **Reading a knowledge file's Terminology section as if it were the file's main content** — the ten sections are peers, not a hierarchy; skipping straight to Terminology and stopping there misses Frameworks and Decision Trees, which usually matter more for an actual judgment call.
- **Reading a template's bracketed placeholder text as real content** — a template is never itself a finished deliverable.
- **Reading `registry.yaml`'s array order as a priority or load order** — it isn't; see `context-loader.md`'s Assembly Order and `context-priority.md`'s tiers for the actual priority logic.
- **Treating a command file's prose-named agent list as complete** — always reconcile against `registry.yaml`'s `commands[].invokes.mandatory`/`conditional` fields, which may include agents the command's own prose states more loosely (e.g., "conditional on X" rather than naming the agent directly).

## Non-Negotiables

- Every resource type is parsed according to its actual structure, not a generic "read the markdown" pass — a knowledge file's ten-section contract and a template's fill-in-the-blank contract require different handling, and conflating them produces either incomplete grounding or unfinished-looking output.
- Frontmatter (where present — memory, agents, commands) is always read before the body; it determines how the body should be interpreted, not just decorative metadata.
