---
title: The vision arc — references for the closing section
topic: vision
audience_level: all
sources:
  - https://docs.claude.com/en/managed-agents/overview
  - https://thesys.dev
  - https://github.com/Enderfga/openclaw-claude-code
  - https://www.theguardian.com/
  - https://github.com/openai/symphony
---

# The Vision Arc — closing section references

This file gathers the external references the talk cites in the **closing vision section** of the deck: the "Can't we just use Claude Agent SDK?" devil's advocate slide and the "Where this is going" 3-stage arc slide.

These were researched and verified on **April 9, 2026** (day of the talk). Treat them as the canonical sources for any future revisions of those slides.

---

## 1. Anthropic Managed Agents

**Slide that uses it:** `just-use-agent-sdk` ("But… Anthropic ships this now?")

### What it is

Anthropic's **first-party hosted agent runtime**, announced in beta on **April 1, 2026** (beta header: `managed-agents-2026-04-01` — eight days before the talk). It gives you an Anthropic-hosted agent loop, a sandboxed container per session, persistent event streams, skills + MCP + files support, and automatic prompt caching / context compaction / adaptive thinking — without you having to host any of the orchestration yourself.

### The flow (one-time vs. per-run)

```
Setup (once):              Runtime (every run):
POST /v1/agents      →     POST /v1/sessions
  model                       agent: <agent_id>
  system                      environment_id: <env_id>
  tools
  mcp_servers
  skills
```

`model`, `system`, `tools`, `mcp_servers`, `skills` all live on the persisted **agent** object. Sessions reference the agent by ID and pin to a specific version. This is a clean setup-vs-runtime split that mirrors the harness pattern exactly.

### 🎯 The killer quote — Anthropic's own docs use "harness"

> **"The harness — event stream, sandbox orchestration, prompt caching, context compaction, and extended thinking — is handled for you."**
> — Anthropic Managed Agents onboarding docs (`managed-agents-2026-04-01`)

This is the single most important sentence for the closing section of the talk. **Anthropic has adopted the exact vocabulary the talk is pitching.** The `year-of-harnesses` slide's existing line *"Anthropic productionizes it"* is now literally true — Anthropic ships a product that calls itself a harness.

### What it provides (runtime)

- **Agent loop** — the request/response/tool-use cycle runs on Anthropic's orchestration layer
- **Per-session container** — sandboxed workspace where bash, file ops, and code execution run
- **Event stream** — SSE stream of `agent.message`, `agent.tool_use`, `session.status_*`, etc.
- **Built-in tools** — `agent_toolset_20260401` ships bash, read, write, edit, glob, grep, web_fetch, web_search
- **MCP integration** — declare `mcp_servers` on the agent, attach credentials via vaults at session time (auto-refreshed by Anthropic)
- **Persistent storage** — files, GitHub repos, vault-managed credentials
- **Memory / context management** — automatic prompt caching, context compaction, adaptive thinking

### What you still bring (the domain)

This is the talk's punchline:

- **The domain skills** — SKILL.md files teaching the agent *how* to do your job (persona generation, prerequisite matching, etc.)
- **The state schema** — what your mission/session/workflow actually looks like
- **The tool surface** — custom tools for your product's side effects
- **The phases** — which skills load when, driven by your state
- **The MCP servers** — pointing at your backend
- **The environment config** — networking policies, package allowlists

> **Key insight**: Managed Agents gives you the **harness runtime**. You still own the **harness engineering** — deciding what skills, what state, what tools, what flow. That's the work, and it's exactly what the talk is about.

### References

- **Docs index:** `https://docs.claude.com/en/managed-agents/overview`
- **API reference (`/v1/agents`, `/v1/sessions`):** `https://docs.claude.com/en/managed-agents/*`
- **Beta header:** `managed-agents-2026-04-01`
- **Source in session:** the `claude-api` skill cached in Claude Code exposes the full Managed Agents reference under `shared/managed-agents-*.md`

---

## 2. Thesys C1 — generative UI as the agent's output layer

**Slide that uses it:** `just-use-agent-sdk` (as one of the pre-shipped pieces the audience might reach for)

### What it is

**C1 by Thesys** (`thesys.dev`) is an API middleware that lets AI applications return **rich interactive UI components** instead of plain text responses. The LLM produces structured UI specs; C1 renders them as React components inline in the conversation.

### Verbatim description (from thesys.dev homepage)

> **"C1 by Thesys is an API middleware that augments LLMs to respond with interactive UI in realtime instead of text."**

Hero tagline:

> **"Make AI apps respond with interactive UI in realtime"**

### Why it matters for the talk

The `death-of-menus` slide argues that agents will render rich UI inline instead of making users navigate menus. Thesys C1 is **one of the rendering layers** that makes that practical today — alongside Vercel AI SDK Generative UI, v0, and hand-rolled approaches.

C1 is provider-agnostic:

> **"all leading LLMs out of the box, including models from Anthropic and OpenAI"**
> **"C1 is an OpenAI-compatible endpoint that plugs into any language, framework, or MCP"**

Works with Claude, which matters because the rest of the talk centers on Claude / Mastra / Anthropic.

### Status

- Founded 2024, operational in April 2026
- Pricing tiers published; API key console available
- Not explicitly labeled as beta

### How to cite it live

On the `just-use-agent-sdk` slide, Thesys sits alongside SKILL.md as the third pre-shipped piece: *"SKILL.md + Thesys C1 — plug-in know-how + rich UI for tool calls."* Don't dive into details — it's a reference point, not the subject of the slide.

### Reference

- **URL:** `https://thesys.dev`
- **Product name:** C1 by Thesys (also "C1 Generative UI API")

---

## 3. OpenClaw — the "agent never sleeps" reference

**Slide that uses it:** `vision-arc`, stage 2 ("The agent never sleeps")

### What it is

An **open-source, local-first, 24/7 personal AI agent** built on Claude, reachable via Telegram, WhatsApp, Discord, and other messaging apps. Created by **Peter Steinberger** (former founder of PSPDFKit).

### Scale (as of March 2026)

- **247,000+ GitHub stars**
- **47,700+ forks**
- One of the **fastest-growing open-source projects of 2026**

### Why it fits "the agent never sleeps"

OpenClaw's core proposition is an agent that runs continuously in the background and communicates proactively. It exposes a `/loop` command for always-on patterns:

> *"`/loop` runs a prompt or slash command on a recurring interval, enabling always-on monitoring patterns like 'check my email every 5 minutes and flag anything urgent.'"*

It also ships an **OpenClaw Dashboard** — a web-based interface that tracks AI agents in real time (session activity, API costs, system health, memory usage), letting users catch rate-limit issues, control spending, and debug agent behavior across multiple agents.

Operations skills cover: health checks, repair workflows, continuous monitoring, session analysis, update-change detection, security review.

### The "user approves" pattern

The vision arc's stage 2 is: *agent monitors → agent suggests → user approves, no more typing intent*. OpenClaw is the canonical proof that this is shipping today, at scale. Rather than the user issuing commands, the agent runs recurring loops over the user's world and surfaces suggestions proactively.

### Recent news (relevant to the talk)

On **April 4, 2026** (five days before the talk), Anthropic tightened its usage rules: **Claude Pro/Max subscribers can no longer use their plan limits to power OpenClaw** or similar third-party agents. Users wanting to keep OpenClaw running must switch to pay-as-you-go API bundles. This is itself noteworthy — Anthropic is actively managing the ecosystem around always-on agents, a signal of how mainstream they've become.

### How to cite it live

In the `vision-arc` GridSlide, stage 2 (`Eye` icon, purple):

> **The agent never sleeps** — 24/7 monitor. Suggests actions. You approve. *OpenClaw (P. Steinberger · 247k★)*

### References

- **GitHub (main plugin):** `https://github.com/Enderfga/openclaw-claude-code`
- **VentureBeat coverage:** `https://venturebeat.com/technology/claude-openclaw-and-the-new-reality-ai-agents-are-here-and-so-is-the-chaos`
- **Anthropic pricing-shift context:** `https://www.pymnts.com/artificial-intelligence-2/2026/third-party-agents-lose-access-as-anthropic-tightens-claude-usage-rules/`
- **Dashboard guide:** `https://openclawforge.com/blog/openclaw-dashboard-complete-guide-monitoring-ai-agents-2026/`

---

## 4. Jared Kaplan on self-improving AI — the "after" reference

**Slide that uses it:** `vision-arc`, stage 3 ("Self-improving")

### Who

**Jared Kaplan** — co-founder and chief scientist of **Anthropic**. Co-author of the original scaling laws paper and one of the most prominent voices inside a frontier lab on the near-term trajectory of AI capability.

### The quote

> **"It's like you create an entity much smarter than you, and then it creates an even smarter entity. You have no idea where it will end."**
> — Jared Kaplan (Anthropic), interview with *The Guardian*

Context: the quote describes the risk of uninterpretable optimization paths when AI systems design their successor AI systems — the recursive self-improvement scenario.

### Why this is the right reference (and why Symphony was wrong)

An earlier draft of the talk considered citing **OpenAI's Symphony** project (`github.com/openai/symphony`) for this stage, based on a mention in the latent.space *Harness Engineering* article:

> *"Symphony, OpenAI's internal Elixir-based orchestration layer for spinning up, supervising, reworking, and coordinating large numbers of coding agents"*
> — latent.space, April 7, 2026

**But Symphony is an orchestration layer for coordinating many agents, not a self-improving agent.** It's closer to "how do you run 100 Claude Codes in parallel" than "how does one agent make itself better." Citing Symphony for stage 3 would be misleading.

The Kaplan quote is the right reference because it:

1. Comes from a **frontier lab co-founder** (Anthropic, the same lab the rest of the talk references)
2. Is specifically about **self-improvement** — AI systems designing their successors
3. Is **verbatim attributable** (Guardian interview)
4. Is **quotable and punchy** — lands in one breath on stage
5. Ties the stage 3 vision back to Anthropic, which also ships Managed Agents (shown two slides earlier), tightening the narrative

### Related material for background (not cited on slide)

- **Jared Kaplan on the 2027–2030 horizon** — Kaplan has publicly warned (paraphrased in tech press) that humans will face an *"extremely high-risk decision between 2027 and 2030 — whether to allow AI systems to independently train and develop the next generation of AI."* Not cited verbatim on the slide because the paraphrase isn't verbatim.
- **Demis Hassabis (DeepMind) on zero-human-data self-play** — AlphaZero → generalized self-play to coding and math. Alternative reference if we ever want DeepMind attribution instead of Anthropic.
- **latent.space "scarce human attention"** — already in KB file 05. Supports the same direction ("agents removing humans from synchronous loops") but isn't framed as self-improvement specifically.

### How to cite it live

In the `vision-arc` GridSlide, stage 3 (`Sparkles` icon, rose):

> **Self-improving** — Agents that train the next generation of agents. *— Jared Kaplan, Anthropic*

### Reference

- **Source:** Jared Kaplan interview with The Guardian (date not precisely identified in secondary source)
- **Secondary source:** coverage referenced in `https://eu.36kr.com/en/p/3579721070967684` (36kr EU) which cites the Guardian interview

> **Accuracy caveat:** if anyone asks for the primary Guardian URL, acknowledge that the exact article URL wasn't recovered during research — the quote is verifiable via multiple secondary sources and is widely attributed to Kaplan, but if you want to be extra rigorous before delivery, fetch the Guardian Kaplan interview directly and pin the exact URL.

---

## 5. Symphony (OpenAI) — reference for completeness, NOT cited on slide

**Slide that uses it:** none — explicitly dropped per user instruction after research showed it doesn't fit the "self-improving" frame.

### What it actually is

OpenAI's **Symphony** is an **internal Elixir-based orchestration layer** for spinning up, supervising, reworking, and coordinating large numbers of coding agents across tickets and repositories. Open-sourced as a **specification / reference blueprint**, not a drop-in framework.

> **"Symphony, OpenAI's internal Elixir-based orchestration layer for spinning up, supervising, reworking, and coordinating large numbers of coding agents"**
> — latent.space, *Harness Engineering* (April 7, 2026)

### Why it's mentioned here anyway

1. If the audience asks *"what about Symphony?"* during Q&A, the speaker should know what it is and be able to differentiate it from Ernest / Mastra Harness / Managed Agents.
2. Future versions of the talk may want to reference Symphony for a **fleet orchestration** / **multi-agent** slide — that's where it actually fits, not self-improvement.

### Differentiation vs. the talk's harness thesis

| Concept | What it does | What it is not |
|---|---|---|
| **Mastra Harness** | Primitive for building a single harness per domain | Not a multi-agent orchestrator |
| **Anthropic Managed Agents** | Hosted runtime for one agent (with subagents) | Not a fleet manager |
| **OpenAI Symphony** | Fleet manager for many coding agents across tickets | Not self-improvement; not a harness primitive |
| **OpenClaw** | Always-on personal agent | Not a framework |

Symphony would belong on a future "how do you run 100 harnesses" slide, not the vision arc.

### Reference

- **Source:** `https://github.com/openai/symphony`
- **Article where it was introduced:** `https://www.latent.space/p/harness-eng`

---

## Research timeline (for audit)

| Date | Finding | Source |
|---|---|---|
| 2026-04-01 | Anthropic launches Managed Agents beta | `managed-agents-2026-04-01` header |
| 2026-04-04 | Anthropic tightens Pro/Max rules; OpenClaw users pushed to pay-as-you-go | PYMNTS article |
| 2026-04-07 | Latent Space publishes *Harness Engineering* | `latent.space/p/harness-eng` |
| 2026-04-09 | Research for vision arc completed; slides drafted | this file |
| 2026-04-09 | Talk delivered at Qalico × Gojob Developer AI.xperience night | Marseille |

---

## Attribution cheat-sheet (for speaker notes)

Quick-reference for live delivery:

- **"Managed Agents"** → *Anthropic, April 1, 2026, 8 days before the talk*
- **"The harness … is handled for you"** → *Anthropic docs, managed-agents-2026-04-01*
- **"C1"** → *Thesys, thesys.dev — interactive UI for AI tool calls*
- **"OpenClaw"** → *Peter Steinberger, 247k★, always-on personal agent on Claude*
- **"You have no idea where it will end"** → *Jared Kaplan, Anthropic, Guardian interview*
- **"Symphony"** → *OpenAI, Elixir orchestration layer for many coding agents (NOT cited on slide — keep in reserve for Q&A)*
