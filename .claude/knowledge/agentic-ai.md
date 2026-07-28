# Knowledge Domain: Agentic AI

## 1. Core Concepts

- **Agent vs. assistant vs. automation.** An *assistant* responds to a single request and stops. *Automation* (scripts, RPA) executes a fixed sequence a human designed step-by-step. An *agent* plans a sequence of steps toward a goal, takes real actions, and adapts the plan based on intermediate results — with autonomy bounded by explicit limits.
- **Autonomy is a spectrum, not a binary.** A system is not simply "agentic" or "not." It sits somewhere on a spectrum from fully human-driven to fully autonomous, and the correct point on that spectrum is a design decision, not a technology ceiling.
- **Perception–action loop.** An agent observes state (perception), reasons about what to do (planning), acts (execution), and observes the result (feedback) — repeating until the goal is met or it escalates.
- **Tool use / function calling.** Agentic systems act by invoking external tools (APIs, databases, other software) rather than only generating text. The tool surface an agent is granted defines its real-world blast radius.
- **Grounding.** Connecting an agent's reasoning to verifiable external data (retrieval, structured lookups) rather than relying solely on the model's internal knowledge, which reduces (but does not eliminate) hallucination.
- **Multi-agent systems (MAS).** Complex workflows are often decomposed into multiple specialized agents coordinated by an orchestrator, rather than one monolithic agent trying to do everything.
- **Human-in-the-loop (HITL) vs. human-on-the-loop (HOTL) vs. human-out-of-the-loop.** HITL = a human must approve before an action executes. HOTL = the agent acts, and a human monitors and can intervene/override after the fact. Out-of-the-loop = no human checkpoint at all — rarely appropriate for HR decisions affecting people.

## 2. Terminology

- **Agent** — a system that plans and executes multi-step actions toward a goal within bounded autonomy.
- **Autonomy boundary** — the explicit, pre-defined limit on what an agent may decide and execute without human sign-off.
- **Orchestrator / supervisor agent** — a coordinating agent that decomposes a goal and delegates to specialized sub-agents.
- **Escalation trigger** — a defined condition that routes a case from the agent to a human.
- **Context window** — the amount of information (instructions, history, retrieved data) a model can reason over at once; a practical constraint on agent memory within a single reasoning step.
- **Episodic / long-term memory** — mechanisms by which an agent retains information across sessions or steps, beyond a single context window.
- **ReAct (Reason + Act)** — a prompting/execution pattern where an agent alternates explicit reasoning steps with tool-invoking actions.
- **Plan-and-Execute** — a pattern where an agent first produces a full plan, then executes it step by step, as opposed to reasoning one step at a time.
- **Reflection / self-critique** — an agent (or a second agent) reviewing its own output before finalizing it, to catch errors before they propagate.
- **Guardrail** — a hard-coded constraint (not model-dependent) that prevents an agent from taking certain actions regardless of what it reasons its way into.
- **Hallucination** — a model generating plausible-sounding but false output; in an agentic system this is more dangerous than in a chatbot because the output can trigger a real action.
- **Model Context Protocol (MCP)** — an open standard for connecting AI systems to external tools and data sources in a consistent way, reducing bespoke integration work per agent.

## 3. Best Practices

- Scope every agent's autonomy as narrowly as the use case allows — broad, vague autonomy ("figure out hiring") is a design failure, not a feature.
- Define escalation triggers before deployment, in concrete, testable terms ("score within 5 points of threshold," not "ambiguous cases").
- Log every action an agent takes, with the reasoning that led to it — this audit trail is both a governance requirement and a debugging tool.
- Separate planning from execution where the stakes are high: let the agent propose a plan, require human approval, then execute — rather than plan-and-execute in one uninterruptible step.
- Ground agent reasoning in retrieval from verified data sources rather than trusting model-internal knowledge for anything factual or client-specific.
- Grant tool access on a least-privilege basis — an agent that only needs to read candidate scores should not also have write access to the HRIS.
- Test agents against adversarial and edge-case inputs before deployment, not just the happy path.
- Build a kill-switch: a fast, reliable way to halt an agent's autonomous operation if something goes wrong.
- Pin and version agent prompts/models — an agent's behavior changing silently because an underlying model updated is an unmanaged risk.

## 4. Frameworks

- **Autonomy-level scale (adapted from SAE automotive levels)** — Level 0: no autonomy, human does everything. Level 1: agent suggests, human decides and executes. Level 2: agent drafts/prepares, human approves and executes. Level 3: agent executes routine cases autonomously, escalates exceptions. Level 4: agent executes broadly, human spot-checks/audits after the fact. Level 5: full autonomy, no routine human checkpoint. Most defensible HR agent deployments today sit at Level 2–3.
- **ReAct pattern** — interleaved reasoning and acting, useful for tasks requiring iterative information-gathering before a decision.
- **Plan-and-Execute pattern** — upfront planning followed by execution, useful where the full task structure can be known in advance and human review of the plan is valuable.
- **Orchestrator–Worker (supervisor) pattern** — a coordinating agent delegates sub-tasks to specialized worker agents, useful for decomposable, multi-domain workflows.
- **RACI applied to agent-human responsibility** — explicitly mapping who is Responsible, Accountable, Consulted, and Informed for each step of an agentic workflow, including which party is Accountable when the agent acts (it should always be a named human or role, never "the AI").
- **Constitutional / guardrail layering** — hard rules that constrain agent behavior independent of the model's own reasoning, layered outside the model itself.

## 5. Decision Trees

**Should this be an agent, or a simpler tool?**
- Does the task require multiple steps with conditional branching based on intermediate results? If no → a script or simple automation is more appropriate and more auditable.
- Does it require adapting the plan based on what's discovered mid-task? If no → a fixed workflow suffices.
- If yes to both → an agentic approach may be justified; proceed to the autonomy-level decision.

**What autonomy level is appropriate?**
- Is the action reversible? If no (e.g., rejecting a candidate, finalizing an offer) → require human approval before execution (Level 1–2).
- Does the action affect a real person's employment, compensation, or opportunity outcome? If yes → default to Level 2–3 with mandatory escalation triggers, regardless of model confidence.
- Is the action low-stakes and easily reviewed after the fact (e.g., drafting a report)? → Level 3–4 with post-hoc human audit may be appropriate.

## 6. Anti-Patterns

- **Agent-washing** — rebranding a fixed script or a chatbot as an "agent" for marketing purposes without genuine planning/autonomy. Directly undermines credibility with any technically literate buyer.
- **Unscoped autonomy** — deploying an agent with no defined boundary ("let it figure out the best approach") rather than an explicit, tested limit.
- **No escalation path** — an "agentic" system with no way to hand off to a human is a liability, not a feature, for any person-affecting HR use case.
- **Single point of failure orchestrator** — a multi-agent system where the orchestrator has no fallback if it fails or misroutes.
- **Opaque decision logs** — deploying an agent whose actions can't be reconstructed after the fact; this fails both debugging and governance needs simultaneously.
- **Over-trusting ungrounded output** — allowing an agent to act on its own generated "facts" without retrieval grounding or verification, especially for anything client- or candidate-specific.
- **Conflating chatbot with agent** — a conversational interface that answers questions is not agentic unless it also plans and executes multi-step actions.

## 7. KPIs

- Task completion rate (within defined autonomy boundary)
- Escalation rate and false-escalation rate (escalating too much erodes value; too little erodes safety)
- Human override rate (how often a human corrects the agent's action or proposed action)
- Time-to-resolution per task
- Error / hallucination rate on grounded factual claims
- Cost per task (compute + human review time)
- Autonomy-level creep — whether an agent's effective autonomy has expanded over time without a corresponding re-approval

## 8. Common Mistakes

- Treating governance as unnecessary because "it's just automation" — this is exactly the agent-washing anti-pattern turned into an operational blind spot.
- Skipping adversarial/edge-case testing before deployment, discovering failure modes in production instead.
- Granting an agent broader tool access than its task requires, "to be safe" against future needs.
- No rollback or kill-switch plan — assuming an agent, once deployed, will only need to be monitored, not stopped.
- Assuming a more capable underlying model justifies removing a human checkpoint — capability and appropriate autonomy are different questions; the latter depends on stakes and reversibility, not model quality alone.

## 9. References to Standards

- **NIST AI Risk Management Framework (AI RMF 1.0)** — Govern, Map, Measure, Manage functions, broadly applicable to agentic system risk.
- **ISO/IEC 42001:2023** — AI management system standard; the closest thing to a certifiable operational standard for organizations deploying AI systems, including agentic ones.
- **ISO/IEC 23894:2023** — AI risk management guidance.
- **EU AI Act (Regulation (EU) 2024/1689)** — agentic systems used in employment contexts typically fall under the High-risk tier (see `eu-ai-act.md`).
- **Model Context Protocol (MCP)** — open standard (originated by Anthropic) for connecting AI systems to external tools/data sources.
- **IEEE 7000 series** — ethically-aligned design standards relevant to autonomous/intelligent systems.

## 10. Future Trends

- Standardization of agent interoperability and tool-integration protocols (MCP and successors) reducing bespoke integration cost.
- Emergence of "agent identity" and accountability frameworks — treating each deployed agent as an auditable entity with a traceable owner, similar to how software services are tracked today.
- Increasing regulatory scrutiny specifically targeting autonomous decision-making in employment contexts, ahead of generic AI regulation.
- Multi-agent collaboration protocols maturing beyond single-vendor orchestration, enabling agents from different providers to interoperate on a shared workflow.
- Growing demand for on-device or privately-hosted agent models where data sovereignty is a hard requirement (directly relevant to EU-based HR-AI deployments).
- Convergence of retrieval-augmented generation (RAG) with agentic planning, reducing hallucination risk in high-stakes, fact-dependent workflows.
