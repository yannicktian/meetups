---
title: Claude Code as the canonical harness
topic: claude-code
audience_level: technical
sources:
  - https://docs.claude.com/en/api/agent-sdk/overview
  - https://code.claude.com/docs/en/overview
  - https://code.claude.com/docs/en/best-practices
---

# Claude Code as the canonical harness

## Anthropic's framing

> **"Build AI agents that autonomously read files, run commands, search the web, edit code, and more. The Agent SDK gives you the same tools, agent loop, and context management that power Claude Code, programmable in Python and TypeScript."**
> — Claude Agent SDK overview, docs.claude.com/en/api/agent-sdk

> **"Claude Code is an agentic coding environment. Unlike a chatbot that answers questions and waits, Claude Code can read your files, run commands, make changes, and autonomously work through problems while you watch, redirect, or step away entirely."**
> — Claude Code best practices, code.claude.com/docs/en/best-practices

> **"Claude Code is an agentic coding tool that reads your codebase, edits files, runs commands, and integrates with your development tools. Available in your terminal, IDE, desktop app, and browser."**
> — Claude Code overview

## Why this is a harness

Claude Code is not a chatbot. It's an agentic loop that **owns the coding domain**. The pieces compose into a complete domain harness:

| Pillar | Component | Purpose |
|--------|-----------|---------|
| **Agent loop** | Built-in autonomous reasoning | Decides which tools to call, in what order |
| **Built-in tools** | Read, Write, Edit, Bash, Glob, Grep, WebSearch, WebFetch, AskUserQuestion | Direct file system + shell + web access |
| **Skills** | `.claude/skills/*/SKILL.md` | Composable domain capabilities — reusable workflows the model loads on demand |
| **MCP servers** | `mcpServers` config | External systems: Figma, Linear, Playwright, custom databases |
| **Subagents** | `agents` config | Specialized contexts with their own tool restrictions |
| **Hooks** | `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`, etc. | Deterministic side effects — logging, validation, blocking |
| **Memory** | `CLAUDE.md`, `~/.claude/CLAUDE.md` | Persistent context per project / per user |
| **Sessions** | `--continue`, `--resume` | Resumable conversations across runs |
| **Permissions** | `allowedTools`, sandboxing, auto mode | Safe autonomous execution |

## The Agent SDK

The Claude Agent SDK exposes Claude Code's internals as a library. You can build your own coding-domain agents (or non-coding agents) using the same primitives:

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Find and fix the bug in auth.py",
  options: { allowedTools: ["Read", "Edit", "Bash"] }
})) {
  console.log(message);
}
```

## Why "harness" is the right word

- It **harnesses** an LLM's capabilities into a productive loop
- It owns **state** (the conversation, the files, the working directory)
- It owns **tools** (the things the agent can do)
- It owns **memory** (CLAUDE.md, auto memory, session resume)
- It exposes a **UI** (CLI, IDE, desktop, web — same engine, different surfaces)

Strip these away and you have just a chatbot. Together, they form the harness.

## Comparing Claude Code (the product) to the Agent SDK (the library)

| Use case | Best choice |
|----------|-------------|
| Interactive development | CLI |
| CI/CD pipelines | SDK |
| Custom applications | SDK |
| One-off tasks | CLI |
| Production automation | SDK |

> "Many teams use both: CLI for daily development, SDK for production. Workflows translate directly between them."
> — Anthropic docs

## The takeaway for the talk

**Claude Code is the canonical harness for coding.** When you give the same primitives a different domain (recruiting, sales, music editing, trip planning), you get a harness for that domain. That's the pattern.
