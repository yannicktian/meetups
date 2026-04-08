---
title: Kitsune hackathon — Ernest, the recruiter harness
topic: gojob-kitsune
audience_level: technical
---

# Ernest — recruiter harness built in 48 hours

## What it is

**Kitsune** is the codename for Gojob's 2026 hackathon project (~2 weeks before the meetup). Yannick built **Ernest**, a recruiter copilot, in 48 hours. Ernest is a **full Mastra `Harness` instance** — the moment Yannick realized "we've been building harnesses all along."

Repository: `apps/agents/` (backend, Mastra) + `apps/web/` (frontend, Next.js 16)

## What Ernest does

Ernest is an end-to-end recruiter copilot. It walks a recruiter through 4 phases:

1. **Job posting** — Recruiter pastes a URL or types in a posting. Ernest fetches it, extracts structured fields, suggests improvements
2. **Persona swiping** — Ernest generates 5 candidate personas (e.g. "the experienced pragmatist", "the academic high-achiever"). Recruiter swipes left/right (Tinder-style). Ernest infers matching criteria from the swipe pattern
3. **Prerequisite definition** — Ernest proposes 3-6 prerequisite questions for the conversational AI screening
4. **Validation** — Recruiter reviews everything, finalizes the mission, and Ernest writes a session summary

Each phase has its own prompt and toolset. The agent reads and updates mission state at any time.

## The harness factory

```typescript
// apps/agents/src/mastra/harness/factory.ts
import { Harness } from '@mastra/core'

export function createRecruiterHarness(resourceId: string) {
  return new Harness({
    id: "kitsune-recruiter",
    resourceId,
    storage,
    stateSchema: harnessStateSchema,
    initialState: {
      missionDraft: {
        id: resourceId,
        status: "draft",
        phase: "job_posting",
      },
      currentPersonas: [],
      currentRound: 0,
    } as any,
    memory: new Memory({
      storage,
      options: {
        semanticRecall: false,
        lastMessages: 50,
        observationalMemory: true,
      },
    }),
    omConfig: {
      defaultObserverModelId: "openai/gpt-5.4-mini",
      defaultObservationThreshold: 20_000,
      defaultReflectionThreshold: 50_000,
    },
    modes: [
      {
        id: "define",
        name: "Define",
        default: true,
        defaultModelId: "openai/gpt-5.4-mini",
        color: "#7ee787",
        agent: recruiterAgent,
      },
    ],
  });
}
```

**Key insight:** one harness instance per recruiting mission. State persists in PostgreSQL across sessions. The recruiter can leave and come back days later — the harness picks up where it left off.

## The state schema

```typescript
// apps/agents/src/mastra/harness/state-schema.ts
export const harnessStateSchema = z.object({
  missionDraft: missionDraftSchema.default(defaultMissionDraft),
  currentPersonas: z.array(personaSchema).default([]),
  currentRound: z.number().default(0),
  // Harness internal fields — needed so Zod doesn't strip them
  permissionRules: z.record(z.string(), z.unknown()).optional(),
  yolo: z.boolean().optional(),
});

export const missionDraftSchema = z.object({
  id: z.string().optional(),
  status: missionStatusSchema.default("draft"),
  phase: missionPhaseSchema.default("job_posting"),
  jobPosting: jobPostingSchema.partial().optional(),
  matchingCriteria: matchingCriteriaSchema.optional(),
  prequalification: prequalificationSchema.partial().optional(),
  swipeHistory: z.array(swipeEntrySchema).optional(),
  knockouts: z.array(z.string()).optional(),
  postingAnalysis: postingAnalysisSchema.optional(),
}).passthrough();
```

`.passthrough()` lets the agent add runtime fields (like `analysisStreaming` for partial JSON) without violating the schema.

## The phases

```typescript
export const missionPhaseSchema = z.enum([
  "job_posting",
  "persona_swiping",
  "prerequisite",
  "validation",
  "complete",
]);
```

## The 8 tools

| Tool | Purpose |
|------|---------|
| `fetch-posting` | Fetch a public job posting URL, extract structured fields via LLM, update mission state |
| `analyze-posting` | Stream a job posting analysis (improvements, suggestions) as partial JSON to the UI |
| `generate-personas` | Create 5 candidate personas for the current round |
| `record-swipe` | Append a like/dislike swipe to swipe history |
| `infer-weights` | Compute matching criteria from swipe pattern (liked vs disliked dimensions) |
| `update-mission` | Generic deep-merge update of any mission field |
| `advance-phase` | Transition to the next workflow phase |
| `generate-summary` | Produce the structured session summary on completion |

Example tool definition:

```typescript
export const generatePersonasTool = createTool({
  id: "generate-personas",
  description: "Store a newly generated set of candidate personas in harness state...",
  inputSchema: z.object({
    round: z.number(),
    personas: z.array(personaSchema),
  }),
  execute: async (input, context) => {
    const ctx = requireHarness(context);
    if (!hasHarness(ctx)) return ctx;

    await ctx.harness.setState({
      currentPersonas: input.personas,
      currentRound: input.round,
    });

    return { round: input.round, personaCount: input.personas.length };
  },
});
```

**Pattern:** every tool reads `harness` from context, mutates state via `setState`, returns a small acknowledgment. The harness emits a `state_changed` event, which gets mapped to a domain SSE event, which the frontend reducer consumes.

## Phase-aware dynamic instructions

This is the most powerful pattern in the codebase. The agent's system prompt is **regenerated on every turn** based on the current phase:

```typescript
export const recruiterAgent = new Agent({
  id: "recruiter",
  name: "Kitsune Recruiter Agent",
  model: "openai/gpt-5.4-mini",
  instructions: ({ requestContext }) => {
    const harness = requestContext?.get("harness");
    const state = harness?.getState();
    const phase = (state?.missionDraft?.phase as string) || "job_posting";
    return buildInstructions(phase, state.missionDraft);
  },
  tools: {
    updateMissionTool,
    generatePersonasTool,
    recordSwipeTool,
    inferWeightsTool,
    advancePhaseTool,
    fetchPostingTool,
    generateSummaryTool,
    analyzePostingTool,
  },
});
```

The `buildInstructions(phase, draft)` function injects a phase-specific block of instructions into the system prompt. Sample for `persona_swiping`:

```
## Current Phase: Persona Swiping

IMPORTANT: If no personas have been generated yet, IMMEDIATELY call generatePersonasTool to create the first batch.

**Step 1:** Define exactly 5-6 dimensions specific to this role.
**Step 2:** Generate exactly 5 personas with consistent dimension keys.
**Step 3:** Wait for swipes (recorded automatically by frontend).
**Step 4:** Use inferWeightsTool to analyze liked vs. disliked patterns.
**Step 5:** Generate another round with refined dimensions, or advance to prequalification.
```

**The benefit:** one agent definition, four behaviors. No fragile state machines hidden in the prompt.

## Streaming UI architecture

Backend emits **domain events** + **raw harness events** over SSE:

```typescript
export const agentEventSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("session:started"), sessionId: z.string() }),
  z.object({ type: z.literal("agent:thinking"), status: z.enum(["started", "done"]) }),
  z.object({ type: z.literal("agent:message"), content: z.string(), role: z.string() }),
  z.object({ type: z.literal("mission:updated"), missionId: z.string(), mission: missionSchema }),
  z.object({ type: z.literal("phase:changed"), missionId: z.string(), previousPhase: missionPhaseSchema, currentPhase: missionPhaseSchema, status: missionStatusSchema }),
  z.object({ type: z.literal("personas:generated"), missionId: z.string(), round: z.number(), personas: z.array(personaSchema) }),
  z.object({ type: z.literal("swipe:recorded"), missionId: z.string(), entry: swipeEntrySchema }),
  z.object({ type: z.literal("tool:started"), toolCallId: z.string(), toolName: z.string(), args: z.record(z.string(), z.unknown()) }),
  // ...
]);
```

Frontend `useAgent` hook subscribes via `EventSource` and dispatches to a reducer. Domain events update React state. Raw events drive token-by-token text streaming.

## Optimistic UI + SSE confirmation

For high-frequency actions (swipes), the frontend updates immediately, then waits for SSE confirmation:

```typescript
const handleSwipe = (decision: "like" | "dislike") => {
  // 1. Optimistic: tell the backend
  recordSwipe(persona.id, decision);

  // 2. Animate exit immediately
  setExitX(decision === "like" ? 500 : -500);

  // 3. Track as pending until SSE confirms
  setTimeout(() => {
    setPendingSwipeIds(prev => new Set(prev).add(persona.id));
    // ...
  }, 400);
};
```

## "Yolo mode" — auto-approval for demos

```typescript
await harness.setState({ yolo: true });
```

Skips the tool approval flow entirely. Useful for demos / hackathons. In production, this would be feature-flagged per role.

## Stack

- **Backend:** Mastra 1.x + Hono + PostgreSQL + Prisma
- **Frontend:** Next.js 16 + React 19 + Tailwind 4 + shadcn/ui + recharts
- **LLM:** OpenAI gpt-5.4-mini
- **Audio:** OpenAI Whisper for voice dictation
- **Auth:** Auth.js + Google OAuth
- **Streaming:** Server-Sent Events

## Why it matters for the talk

Ernest is the **proof of concept** that the harness pattern is real, ships in 48 hours, and produces a polished demo. It's the slide where Yannick says: *"Here's the literal `new Harness(...)` call. This is the same pattern Mastra is shipping. We were already there."*

It also closes the loop on the talk's argument:

- Claude Code is a coding harness
- Mastra ships the primitive
- Ernest is a recruiter harness built on the same primitive
- → Every domain can have a harness
