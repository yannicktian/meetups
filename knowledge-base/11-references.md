---
title: References, sources, and direct quotes
topic: references
audience_level: all
---

# References

## Primary sources

### Anthropic / Claude Code / Managed Agents

| Source | URL | Used for |
|--------|-----|----------|
| Claude Agent SDK overview | https://docs.claude.com/en/api/agent-sdk/overview | Definition of "agent loop", relationship between Claude Code and the SDK |
| Claude Code overview | https://code.claude.com/docs/en/overview | Official description of Claude Code as an agentic coding tool |
| Claude Code best practices | https://code.claude.com/docs/en/best-practices | "Agentic environment" framing, plan mode, tool use patterns |
| Skills documentation | https://code.claude.com/docs/en/skills | Skills as composable capabilities |
| MCP integration docs | https://code.claude.com/docs/en/mcp | MCP server pattern |
| **Managed Agents overview** | **https://docs.claude.com/en/managed-agents/overview** | **Hosted agent runtime, beta launched April 1, 2026** |

#### Direct quotes

> **"Build AI agents that autonomously read files, run commands, search the web, edit code, and more. The Agent SDK gives you the same tools, agent loop, and context management that power Claude Code, programmable in Python and TypeScript."**
> — Claude Agent SDK overview

> **"Claude Code is an agentic coding environment. Unlike a chatbot that answers questions and waits, Claude Code can read your files, run commands, make changes, and autonomously work through problems while you watch, redirect, or step away entirely."**
> — Claude Code best practices

> **"Claude Code is an agentic coding tool that reads your codebase, edits files, runs commands, and integrates with your development tools."**
> — Claude Code overview

> **"The harness — event stream, sandbox orchestration, prompt caching, context compaction, and extended thinking — is handled for you."**
> — Anthropic Managed Agents docs (`managed-agents-2026-04-01`) — 🎯 key citation for the `just-use-agent-sdk` slide; Anthropic's own docs now use the word *harness*

> **"It's like you create an entity much smarter than you, and then it creates an even smarter entity. You have no idea where it will end."**
> — Jared Kaplan (Anthropic co-founder & chief scientist), interview with *The Guardian* — used on the `vision-arc` slide, stage 3 "self-improving"

---

### Mastra

| Source | URL | Used for |
|--------|-----|----------|
| Harness class reference | https://mastra.ai/reference/harness/harness-class | Full API of the `Harness` class |
| Harness architecture (DeepWiki) | https://deepwiki.com/mastra-ai/mastra/16.1-harness-architecture-and-agent-modes | Why the harness exists, design rationale |
| Mastra agents docs | https://mastra.ai/docs/agents/overview | Agent definition, streaming, tool calling |
| Mastra workshops | https://mastra.ai/workshops | Workshop series listing, "Build your own coding agent" reference |
| Mastra blog | https://mastra.ai/blog | Recent updates to the framework |

#### Direct quotes

> **"The Harness is the core orchestration layer of the Mastra framework, designed to manage multi-mode agent interactions, shared state, and persistent thread management."**
> — Mastra Harness reference

> **"The Harness serves as the bridge between high-level user interfaces (like the `mastracode` TUI) and the underlying Agent, Memory, and Storage systems."**
> — Mastra DeepWiki

#### Notable Mastra workshops

- **"Build your own coding agent"** — Feb 19, 2026 (60 min, hands-on)
- "Build Multi-Agent Networks with Mastra" — Mar 26, 2026
- "Beyond vibes: Measuring your agent with evals" — Mar 5, 2026
- "Build agents with human-like memory" — Feb 12, 2026
- "Guardrails and beyond: Control the agent loop with processors" — Feb 12, 2026
- "Mastra 1.0 workshop" — Jan 21, 2026

---

### latent.space — Harness Engineering

| Source | URL | Used for |
|--------|-----|----------|
| Harness Engineering article | https://www.latent.space/p/harness-eng | Naming the trend, the killer quote, the 3-paradigm progression |

**Published:** April 7, 2026 (two days before the talk)

#### Key quotes

> **"When the agent failed, instead of prompting it better or to 'try harder,' the team would look at: what capability, what context, what structure is missing?"**
> — Harness Engineering, latent.space

> **"The only fundamentally scarce thing is the synchronous human attention of my team."**
> — latent.space

> **"Give it a bunch of options for how to proceed with enough context for it to make intelligent choices."**
> — latent.space

> **"Increasingly needs to be written for the model as much as for the engineer."**
> — latent.space (on software written for agents)

---

### Thesys — C1 generative UI API

| Source | URL | Used for |
|--------|-----|----------|
| Thesys homepage | https://thesys.dev | Definition of C1, rendering layer for tool calls |

#### Direct quotes

> **"C1 by Thesys is an API middleware that augments LLMs to respond with interactive UI in realtime instead of text."**
> — thesys.dev

> **"Make AI apps respond with interactive UI in realtime"**
> — thesys.dev (hero tagline)

> **"C1 is an OpenAI-compatible endpoint that plugs into any language, framework, or MCP"** — supports Claude and OpenAI out of the box.
> — thesys.dev

Used on the `just-use-agent-sdk` slide as one of the pre-shipped pieces (alongside SKILL.md) audience members might reach for before building a custom harness.

---

### OpenClaw — always-on personal agent

| Source | URL | Used for |
|--------|-----|----------|
| OpenClaw Claude Code plugin | https://github.com/Enderfga/openclaw-claude-code | Continuous-monitoring pattern, "agent never sleeps" |
| VentureBeat coverage | https://venturebeat.com/technology/claude-openclaw-and-the-new-reality-ai-agents-are-here-and-so-is-the-chaos | Product positioning, market context |
| Anthropic pricing shift (PYMNTS, April 4, 2026) | https://www.pymnts.com/artificial-intelligence-2/2026/third-party-agents-lose-access-as-anthropic-tightens-claude-usage-rules/ | Anthropic pushing OpenClaw users to pay-as-you-go |

**Key facts:**
- Built by **Peter Steinberger** (formerly PSPDFKit)
- Open-source, local-first, 24/7 always-on personal assistant
- Reached via Telegram, WhatsApp, Discord
- **247,000+ GitHub stars** by March 2026 — one of the fastest-growing OSS projects of 2026
- `/loop` primitive runs prompts on recurring intervals ("check my email every 5 minutes")

Used on the `vision-arc` slide, stage 2 "The agent never sleeps" — citation: *OpenClaw (P. Steinberger · 247k★)*

---

## Further detail

For the full write-ups of the vision-section references (Anthropic Managed Agents, Thesys C1, OpenClaw, Kaplan quote, and the Symphony clarification), see **[`12-vision-arc-references.md`](./12-vision-arc-references.md)**.

---

## Code references (private)

These are internal to Gojob and not publicly accessible, but they're the source of every code snippet in the talk.

| Project | Path | Purpose |
|---------|------|---------|
| Aglae llm-agent | `monorepo/apps/llm-agent` | Mastra agent, RAG tool, multi-provider routing, multi-tenant middleware |
| Aglae frontoffice | `monorepo/apps/frontoffice` | Vite + React frontend, streaming hook, prerequisites UI |
| Aglae API (MCP server) | `monorepo/apps/api/src/main-mcp.ts` | NestJS-based MCP server with @Tool decorators |
| Kitsune (Ernest) | `hackathon2026/hack26-kitsune/apps/agents` | Mastra `Harness` instance, recruiter agent, 8 tools, phase-aware instructions |
| Kitsune web | `hackathon2026/hack26-kitsune/apps/web` | Next.js 16 frontend, useAgent reducer, persona swiping UI |

---

## The talk's key citations (in delivery order)

1. **Anthropic Agent SDK quote** — slide: "What is Claude Code, really?" (Act III)
2. **Mastra Harness quote** — slide: `mastra-quote` "The stack: Mastra" (Ernest section)
3. **latent.space quote** — slide: "Harness Engineering" (Intro)
4. **Anthropic Managed Agents "harness" quote** — slide: `just-use-agent-sdk` "But… Anthropic ships this now?" (Vision section)
5. **Jared Kaplan quote on self-improving AI** — slide: `vision-arc` "Where this is going" stage 3 (Vision section)

---

## External references the audience may want

If audience members want to follow up:

- **Start here:** Mastra docs → https://mastra.ai/docs
- **Read this:** latent.space "Harness Engineering" → https://www.latent.space/p/harness-eng
- **Try this:** Claude Code → https://code.claude.com (or `curl -fsSL https://claude.ai/install.sh | bash`)
- **Watch this:** Mastra workshops → https://mastra.ai/workshops
- **Build with:** Claude Agent SDK → https://docs.claude.com/en/api/agent-sdk/overview

---

## Acknowledgments

- **Qalico × Gojob** — co-organizers of the Developer AI.xperience night meetup series
- **Volta Medical** — co-speaker at the event
- **The Mastra team** — for shipping the `Harness` class as a primitive
- **Anthropic** — for Claude Code, the canonical example, and the Agent SDK
- **swyx + the latent.space team** — for naming the trend
