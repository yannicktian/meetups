---
title: Mastra's Harness class — the primitive that named the pattern
topic: mastra
audience_level: technical
sources:
  - https://mastra.ai/reference/harness/harness-class
  - https://deepwiki.com/mastra-ai/mastra/16.1-harness-architecture-and-agent-modes
  - https://mastra.ai/workshops
---

# Mastra Harness — the orchestration primitive

## The headline

In **February 2026**, Mastra shipped a `Harness` class as the **core orchestration layer of the framework**. This is the first major TypeScript agent framework to formalize the harness pattern as a first-class primitive.

> **"The Harness is the core orchestration layer of the Mastra framework, designed to manage multi-mode agent interactions, shared state, and persistent thread management."**
> — Mastra docs

> **"The Harness serves as the bridge between high-level user interfaces (like the `mastracode` TUI) and the underlying Agent, Memory, and Storage systems."**
> — Mastra DeepWiki

## What `Harness` provides

A single `new Harness({...})` instance manages:

- **Multi-mode agents** — Plan / Build / Review modes that wrap different agents
- **Typed state** — Zod schema validates the harness's working state
- **Threads** — persistent conversation threads scoped to a `resourceId`
- **Memory** — shared across modes via Mastra Memory
- **Storage** — `MastraCompositeStore` (LibSQL, PostgreSQL)
- **Workspace** — file-system / project context for the agents
- **Subagents** — focused specialist agents the main agent can dispatch to
- **Tool approvals** — user-in-the-loop control for risky operations
- **Permissions** — per-tool, per-category granular access
- **Model switching** — change models per request, per mode, or per session
- **Observational Memory** — auto-summarization for context compression
- **Events** — `subscribe()` callback for UI integration

## Constructor signature

```typescript
class Harness<TState extends z.ZodObject<any>> {
  constructor(config: HarnessConfig<TState>)

  // Lifecycle
  init(): Promise<void>
  selectOrCreateThread(): Promise<Thread>
  destroy(): Promise<void>

  // State (Zod-validated)
  getState(): Readonly<z.infer<TState>>
  setState(updates: Partial<z.infer<TState>>): Promise<void>

  // Modes
  switchMode({ modeId }): Promise<void>
  getCurrentMode(): HarnessMode

  // Threads
  createThread({ title? }): Promise<Thread>
  switchThread({ threadId }): Promise<void>
  listThreads(): Promise<Thread[]>

  // Messages
  sendMessage({ content, files?, requestContext? }): Promise<void>
  listMessages(): Promise<Message[]>

  // Flow control
  abort(): void
  steer({ content }): void
  followUp({ content }): void

  // Tool approvals + plans
  respondToToolApproval({ decision }): void
  respondToPlanApproval({ planId, response }): void

  // Permissions
  setPermissionForTool({ toolName, policy }): void

  // Subagents
  setSubagentModelId({ modelId, agentType? }): Promise<void>

  // Events
  subscribe(listener: (event: HarnessEvent) => void): () => void
}
```

## Minimal example

```typescript
import { Harness } from '@mastra/core'
import { LibSQLStore } from '@mastra/libsql'
import { z } from 'zod'

const harness = new Harness({
  id: 'my-coding-agent',
  storage: new LibSQLStore({ url: 'file:./data.db' }),
  stateSchema: z.object({
    currentModelId: z.string().optional(),
  }),
  modes: [
    { id: 'plan', name: 'Plan', default: true, agent: planAgent },
    { id: 'build', name: 'Build', agent: buildAgent },
  ],
})

harness.subscribe(event => {
  if (event.type === 'message_update') {
    renderMessage(event.message)
  }
})

await harness.init()
await harness.selectOrCreateThread()
await harness.sendMessage({ content: 'Hello!' })
```

## `mastracode` — Mastra's coding agent

Mastra ships a coding agent TUI called **`mastracode`** built on the Harness class. It's their proof-of-concept that the primitive is production-ready. It demonstrates:

- Multiple modes (Plan, Build, Review)
- Subagents (explore, execute) as child processes
- Tool approval flows
- Workspace integration

The talk references this as: *"What's good enough for Mastra to ship their own coding agent on is good enough for you to build a recruiter / sales / support agent on."*

## Mastra workshop

**"Build your own coding agent"** — workshop run by Mastra on **Feb 19, 2026** (60 min, hands-on). This is where many TypeScript developers first encountered the harness pattern as an explicit concept.

URL: https://mastra.ai/workshops

## Status

The `Harness` class is in **alpha** as of early 2026. Subject to breaking changes in minor versions until graduated. But the pattern is stable; the API may shift.

## Why this matters for the talk

Mastra is the **first major framework to give the pattern a name**. Before this, builders were rolling their own. Now there's a primitive. The pattern is no longer an underground technique — it's part of the toolbox.
