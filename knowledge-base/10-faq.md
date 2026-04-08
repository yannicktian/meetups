---
title: FAQ — anticipated audience questions
topic: faq
audience_level: all
---

# FAQ

Anticipated questions from the meetup audience, with prepared answers.

---

## Conceptual

### Q: What's the difference between an agent and a harness?

**A:** An *agent* is the LLM + tools loop. A *harness* is everything around the agent that makes it production-ready: typed state, modes/phases, persistent memory, event streaming for the UI, multi-tenant isolation, observability, error handling, multi-provider routing. The agent is the engine; the harness is the car.

### Q: Is "harness" just a fancy word for "framework"?

**A:** No. A framework like Mastra or LangChain is a *toolkit* for building agents. A harness is an *instance* — a specific configuration of state, tools, modes, and reliability built around an agent for a particular domain. Mastra's `Harness` class is the framework abstraction; Ernest, mastracode, and Claude Code are concrete harnesses.

### Q: How is harness engineering different from context engineering?

**A:** Context engineering asks "how do I give the model the right context to succeed?" Harness engineering asks "what capability, what context, what structure is missing?" Context engineering is one tool inside harness engineering. The article that named the trend (latent.space, April 2026) frames it as the natural successor.

### Q: Why now?

**A:** Three signals converged in early 2026:
1. Anthropic ships the Claude Agent SDK as a public library
2. Mastra ships the `Harness` class as a first-class primitive (Feb 2026)
3. latent.space publishes "Harness Engineering" naming the trend (April 2026)

The pattern existed before. The name and the primitive arrived together.

### Q: Doesn't this just shift complexity from the prompt to the harness code?

**A:** Yes, intentionally. The prompt is fragile and hidden. The harness code is typed, tested, observable, and version-controlled. We're moving complexity from the model's "memory" into your codebase, where you can reason about it.

---

## Technical — the In-App Agent

### Q: How does the streaming UI work?

**A:** The agent calls `agent.stream()` with a Zod schema for structured output. The stream yields `text-delta` chunks. On every chunk, we accumulate the text and parse it as partial JSON using the `partial-json` library. The result is an incomplete object that becomes more complete with each chunk. We update React state on every parse, which re-renders the UI. The user sees prerequisites *appear* one by one as the model generates them.

```typescript
let acc = "";
await stream.processDataStream({
  onChunk: async (chunk) => {
    if (chunk.type !== "text-delta") return;
    acc += chunk.payload.text;
    const partial = parse(acc);
    if (partial.elements) setPrerequisites(partial.elements);
  },
});
```

### Q: How do you isolate tenants?

**A:** A middleware (`resourceIdEnforcerMiddleware`) runs before every request. It reads the `siteId` from the user's auth token and sets a `filter` in the request context. Every RAG query and every domain tool call automatically uses that filter. The agent **cannot** query data from another tenant — even if the prompt is exploited — because the filter is enforced at middleware level, before the agent runs.

### Q: How do you do RAG?

**A:** pgvector. Job posting titles are embedded with OpenAI's `text-embedding-3-small` and stored in a `job_posting_titles` index in PostgreSQL. The `findSimilarJobPostingsPrerequisites` tool queries the top 2 results with min score 0.5, filtered by `siteId`. Returns the matching job postings with their existing prerequisites — the agent uses these as examples when suggesting prerequisites for the new posting.

### Q: Why MCP for the backend?

**A:** Separation of concerns. The API is the single source of truth for domain logic. The llm-agent doesn't import API internals — it calls MCP tools over HTTP. The agent and the API can be deployed and scaled independently. We use `@rekog/mcp-nest` to expose NestJS query handlers as MCP tools with `@Tool` decorators.

### Q: Which model do you use?

**A:** It depends on the request. The agent has multi-provider routing — Azure OpenAI, OpenAI, Anthropic, Gemini, Mistral, LiteLLM. The default is Azure GPT-4.1, but the user can pick per request via HTTP header. We use Langfuse for observability, so we can see which model was used for any given trace.

### Q: How do you manage prompts?

**A:** Prompts live in **Langfuse**, not in code. The agent fetches them at request time via `PromptTemplateFetcher`. This means recruiters (well, our internal team) can iterate on prompts without redeploying. Versioning is built-in.

---

## Technical — Ernest / Kitsune

### Q: How long did it take to build Ernest?

**A:** 48 hours during Gojob's hackathon two weeks ago.

### Q: Why is it called Ernest?

**A:** Internal codename. The repo is called `kitsune` (a reference to the Japanese fox spirit, often a trickster — fits the agent vibe).

### Q: How does the persona swiping work?

**A:** Ernest generates 5 candidate personas with 5-6 dimensions each (e.g. "experience", "culture fit", "adaptability"). The recruiter swipes left/right Tinder-style. After all 5 are swiped, the `inferWeightsTool` analyzes the pattern: dimensions where the recruiter consistently liked high scores become "must-have" weights; dimensions where the recruiter consistently disliked high scores become "nice-to-have". The agent then generates another round with refined dimensions or advances to prerequisites.

### Q: How do you keep state in sync between the agent and the UI?

**A:** The agent mutates state via `harness.setState()`. This emits a `state_changed` harness event, which gets mapped to a domain SSE event (`mission:updated`, `phase:changed`, `personas:generated`, etc.). The frontend subscribes via `EventSource` and dispatches to a reducer. The reducer updates React state. UI re-renders. For high-frequency actions (swipes), we do optimistic updates — the UI updates immediately, then waits for SSE confirmation.

### Q: Does it work offline?

**A:** No. It needs a connection to the agent backend (OpenAI under the hood). But conversations persist in PostgreSQL, so you can leave and come back later — the harness picks up where you left off.

---

## Strategic / business

### Q: Why didn't you use LangChain or LangGraph?

**A:** We use Mastra because it's TypeScript-native, has the `Harness` class as a first-class primitive, has built-in observability via Langfuse, and integrates naturally with our existing TypeScript stack (NestJS API, Vite frontend). LangGraph would have worked too, but Mastra felt more natural for our team's preferences.

### Q: How do you measure agent quality?

**A:** Multiple ways. Online: every conversation gets a real-time score. Offline: batch evaluation against ground-truth labels. Anomaly detection on top. Human review queue for ambiguous cases. We trace everything to Langfuse so we can audit any decision. The "80/20 lesson" — building the agent was easy, building this supervision system took the rest of the time.

### Q: How do you onboard new customers now?

**A:** The In-App Agent is the answer. What used to take weeks of round-trips with management now takes minutes of self-serve. Recruiters define their job postings, the agent suggests prerequisites, they review and accept. The bottleneck (us) is removed.

### Q: What's next after harnesses?

**A:** Harder to say. The article that named the trend (latent.space) hints that the next frontier is **agents that write their own observability** — you give them the goal and they instrument themselves to verify they're achieving it. We're not there yet, but it's the direction.

---

## Meta

### Q: What stack is this slide deck built on?

**A:** Next.js 16, React 19, Tailwind 4, Framer Motion, Shiki for syntax highlighting, deployed on Vercel. The slides are a single-page app where each slide is a full-viewport section with scroll-snap navigation. The content is structured TypeScript data — which is exactly what an agent could serve in V2. (Fittingly, the slide deck for a talk about harnesses is structured to be turned into one.)

### Q: Will the slides be open source?

**A:** Yes. https://github.com/yannicktian/meetups
