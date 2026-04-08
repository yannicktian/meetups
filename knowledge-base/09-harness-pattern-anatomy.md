---
title: The harness pattern — anatomy and production concerns
topic: harness-pattern
audience_level: technical
---

# Anatomy of a harness

## Definition

A **harness** is an agent loop that owns a domain. It's the structure around an LLM that:

- Holds typed state for the workflow
- Exposes tools that the agent can invoke (which are really product features)
- Switches between modes/phases with dynamic instructions
- Streams events to the UI on every state change
- Persists conversation memory across sessions
- Handles the production reliability layer (budgets, retries, observability, multi-tenant)

## The six pillars

### 1. Typed state

A single Zod schema is the source of truth for the workflow. Every tool call mutates state through a controlled interface — never the database directly.

```typescript
const stateSchema = z.object({
  missionDraft: z.object({
    phase: z.enum(["job_posting", "persona_swiping", "prerequisite", "validation", "complete"]),
    jobPosting: jobPostingSchema.partial().optional(),
    matchingCriteria: matchingCriteriaSchema.optional(),
    swipeHistory: z.array(swipeEntrySchema).optional(),
  }),
  currentPersonas: z.array(personaSchema).default([]),
});
```

**Why it matters:** the agent reads state to know what to do next. The frontend listens to state to know what to render. The same schema everywhere = type safety end-to-end.

### 2. Tools

Each tool is a typed function the agent can invoke. Tools are your product features wrapped for the agent:

```typescript
export const generatePersonas = createTool({
  id: "generate-personas",
  description: "Store newly generated candidate personas.",
  inputSchema: z.object({
    round: z.number(),
    personas: z.array(personaSchema),
  }),
  execute: async (input, context) => {
    const { harness } = requireHarness(context);
    await harness.setState({
      currentPersonas: input.personas,
      currentRound: input.round,
    });
    return { count: input.personas.length };
  },
});
```

**Pattern:** read context → mutate state → return small acknowledgment. The state change emits an event automatically.

### 3. Modes (or phases)

The agent's behavior changes based on state. The system prompt is regenerated on every turn:

```typescript
const recruiterAgent = new Agent({
  id: "recruiter",
  model: "openai/gpt-4o",
  instructions: ({ requestContext }) => {
    const harness = requestContext.get("harness");
    const phase = harness.getState().missionDraft.phase;
    return buildInstructions(phase);
  },
  tools: { generatePersonas, advancePhase, /* ... */ },
});
```

**Why it matters:** one agent definition, multiple behaviors. The phase determines what the agent should focus on, what tools to prefer, and what the user is currently doing.

### 4. Events

Every state change emits an event. The UI subscribes:

```typescript
harness.subscribe(event => {
  if (event.type === "state_changed") {
    renderPhase(event.state.missionDraft.phase);
  }
});
```

For Mastra harnesses, `subscribe()` is built in. For custom harnesses, you typically use Server-Sent Events (SSE) and a discriminated union of typed event objects:

```typescript
const agentEventSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("agent:thinking"), status: z.enum(["started", "done"]) }),
  z.object({ type: z.literal("mission:updated"), mission: missionSchema }),
  z.object({ type: z.literal("phase:changed"), currentPhase: phaseSchema }),
  // ...
]);
```

The frontend dispatches events to a reducer that updates React state. UI re-renders. User sees the effect.

### 5. Memory + threads

Persistent conversation context across sessions. The user can leave, come back hours later, and the harness picks up where it left off.

For Mastra: built into the `Memory` class with optional Observational Memory (Gemini-powered auto-summarization for context compression).

```typescript
new Memory({
  storage,
  options: {
    semanticRecall: false,
    lastMessages: 50,
    observationalMemory: true,
  },
})
```

### 6. Reliability

The boring 80% — see below.

## The reliability layer

What separates a demo from a production harness:

### Token budgets

Track token usage per session. Stop when over budget. Detect diminishing returns:

```typescript
interface BudgetTracker {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  roundCount: number;
  lastRoundDelta: number;
  maxBudget: number;
}

export function checkBudget(tracker: BudgetTracker): "ok" | "warn" | "stop" {
  const ratio = tracker.totalTokens / tracker.maxBudget;
  if (ratio >= 0.9) return "stop";
  if (tracker.roundCount >= 3 && tracker.lastRoundDelta < 2_000) return "stop"; // diminishing returns
  if (ratio >= 0.7) return "warn";
  return "ok";
}
```

### Error classification + retry

Know when to retry, know when to give up:

```typescript
export type StudioError =
  | { type: 'rate_limited'; retryAfterMs: number }
  | { type: 'context_overflow'; tokenCount: number }
  | { type: 'tool_failure'; tool: string; retryable: boolean }
  | { type: 'provider_down'; provider: string }
  | { type: 'aborted' }
  | { type: 'unknown'; error: Error };

export function classifyError(error: unknown): StudioError {
  if (error.name === 'AbortError') return { type: 'aborted' };
  const status = error.status;
  if (status === 429 || status === 529) {
    return { type: 'rate_limited', retryAfterMs: parseRetryAfter(error) };
  }
  if (/context.?length|too.?long/i.test(error.message)) {
    return { type: 'context_overflow', tokenCount: 0 };
  }
  if (/ECONNREFUSED|503|502/i.test(error.message)) {
    return { type: 'provider_down', provider: 'unknown' };
  }
  return { type: 'unknown', error };
}
```

Then `withRetry()` uses exponential backoff for retryable errors.

### Multi-tenant isolation

Middleware filters every operation by tenant ID before the agent runs:

```typescript
export const resourceIdEnforcerMiddleware: MiddlewareHandler = (c, next) => {
  const requestContext = c.get('requestContext');
  const user = requestContext.get('user');

  if (user?.email && user?.siteId) {
    requestContext.set(MASTRA_RESOURCE_ID_KEY, `${user.email}:${user.siteId}`);
    requestContext.set('filter', { siteId: user.siteId });
  }

  return requestScope.run({ requestContext, ... }, () => next());
};
```

The agent **cannot leak data across tenants**, even if the prompt is exploited, because the filter is set in middleware before any tool runs.

### Multi-provider routing

Same agent code, different model per request:

```typescript
resolveModel(requestContext) {
  const selectedModel = requestContext.get('selectedModel');
  if (selectedModel.provider === 'OpenAI') return openAI(selectedModel.model);
  if (selectedModel.provider === 'Anthropic') return anthropicVertex(selectedModel.model);
  if (selectedModel.provider === 'Gemini') return googleVertex(selectedModel.model);
  // ...
}
```

Cost optimization, A/B testing, customer-specific routing — all without code changes.

### Observability

Every tool call traced with full tenant context. For Mastra, this is built-in via the `Observability` plugin:

```typescript
new Observability({
  configs: {
    default: {
      serviceName: 'mastra',
      exporters: [
        new DefaultExporter(),
        new LangfuseExporter({ /* ... */ }),
      ],
      requestContextKeys: [
        'user.email',
        'user.siteId',
        'filter',
        'langfuse.prompt.name',
        'langfuse.prompt.version',
      ],
    },
  },
}),
```

Every trace links back to: tenant + user + prompt version + filter. Full auditability.

## Multi-round iteration

Harnesses are conversational. The agent can pause, wait for user feedback, then continue:

```typescript
while (!aborted) {
  await harness.setState({ status: "waiting" });
  const signal = await waitForUserFeedback();
  if (signal.type === "done") break;

  await harness.setState({ status: "executing" });
  await harness.sendMessage({
    content: `User feedback: ${signal.text}`,
  });
}
```

State machine: `executing` → `waiting` → `executing` → `complete`. The frontend renders different UI per state. The user reviews, edits, approves, and the loop continues.

This is how harnesses **feel collaborative, not robotic**. The agent doesn't bulldoze through; it pauses and asks.

## Subagents (advanced)

For complex domains, the main agent can dispatch to specialized subagents. Each subagent has:

- Its own instructions
- Its own restricted toolset
- Its own model selection
- Its own step limit

```typescript
{
  id: 'composer',
  description: 'Creative planner. Takes analysis + intent and produces a structured edit plan.',
  instructions: composerInstructions,
  allowedWorkspaceTools: READ_ONLY_WORKSPACE_TOOLS,  // tool isolation
  defaultModelId: modelId,
  maxSteps: 3,
}
```

The producer agent **chooses which specialist to dispatch to** based on the task. Mirrors org chart delegation.

## Per-runId concurrency

Each run has its own:

- Harness instance
- Workspace directory (for file I/O)
- Budget tracker, profiler, logger
- Async-local storage context

Multiple users can run pipelines simultaneously without interference.

```typescript
export const activeRuns = new Map<string, ActiveRun>();
export const runningPipelines = new Set<string>();
export const MAX_CONCURRENT_PIPELINES = 5;
```

SSE broadcasting is also per-runId:

```typescript
export function broadcastToRun(runId: string, envelope: SSEEnvelope) {
  const clients = runClients.get(runId);
  if (clients) for (const cb of clients) cb(envelope);
}
```

The frontend subscribes to `/api/events?runId=X` and only receives events for its session.

## What to remember

A harness is **state + tools + modes + events + memory + reliability**. Take any of those away and you have something less. Take all of them, plus a UI, and you have a domain harness.

Building one isn't experimental anymore. The patterns are documented, the primitives ship in frameworks (Mastra), and the production references exist (Claude Code, mastracode, Ernest, the In-App Agent).
