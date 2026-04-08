---
title: Aglae SaaS — the In-App Agent (Mastra + RAG + MCP + streaming UI)
topic: gojob-aglae
audience_level: technical
---

# The In-App Agent — Aglae SaaS

## What it solves

After Alpha (see [`06-alpha-recruiter-assistant.md`](./06-alpha-recruiter-assistant.md)) became a SaaS product, **onboarding each new customer was painfully slow**:

- Understanding the customer's recruiting needs took weeks
- Defining prerequisite questions for each job type required round-trips with their management
- Customers couldn't self-serve — Gojob was the bottleneck

The In-App Agent fixes this. It's an agent **inside the recruiter's app** that helps them define prerequisites for a job posting in minutes.

## What it does

A recruiter creates a job posting in the Aglae SaaS. They click "Suggest Prerequisites." The agent:

1. Reads the job posting fields
2. Uses RAG to find similar job postings in the system
3. Streams a structured list of suggested prerequisites back to the UI
4. Recruiter reviews, edits, accepts

The whole loop takes seconds. What used to be weeks of email back-and-forth is now self-serve.

## Architecture (high level)

```
React Frontend (Vite)
        │  partial JSON
        ▼
Stream API
        │
        ▼
Mastra Agent (llm-agent)
        │
        ├─→ RAG (pgvector — find similar job postings)
        │       │
        │       └─→ Vector Store (job_posting_titles index)
        │
        └─→ MCP Server (api/main-mcp)
                │
                └─→ Domain DB (job postings, prerequisites, etc.)
```

## The agent — `prerequisite-advisor-agent`

Defined as a Mastra agent in the `llm-agent` app. Uses an Inversify IoC container so each module (agents, tools, storage, auth) is independently testable.

```typescript
// apps/llm-agent/src/mastra/agents/prerequisite-advisor-agent.ts
export const PrerequisiteAdvisorAgentModule = new ContainerModule(
  ({ bind }) => {
    bind(Agent).toDynamicValue(async ({ get }) => {
      return new Agent({
        id: 'prerequisite-advisor-agent',
        name: 'Prerequisite Advisor Agent',
        ...buildPromptDrivenAgentConfigs({
          prompt: { name: 'PrerequisiteAdvisorAgent' },
          get,
        }),
        tools: {
          findSimilarJobPostingsPrerequisites: get<Tool>(
            FIND_SIMILAR_JOB_POSTINGS_PREREQUISITES_TOOL,
          ),
        },
      });
    });
  },
);
```

**Key insight:** the system prompt and the model are **resolved at request time** from Langfuse + a model resolver. This means:

- Recruiters can iterate on prompts without redeploying
- Different models per request via HTTP header
- Multi-tenant isolation built-in

## Dynamic prompt + model resolution

```typescript
export function buildPromptDrivenAgentConfigs({ prompt, get }) {
  const { storage, promptTemplateFetcher, modelResolver } = {
    storage: get(MastraCompositeStore),
    promptTemplateFetcher: get(PromptTemplateFetcher),
    modelResolver: get(ModelResolver),
  };
  return {
    instructions: ({ requestContext }) =>
      promptTemplateFetcher.getPromptTemplate({
        prompt: { name: prompt.name },
        requestContext,
      }),
    model: async ({ requestContext }) =>
      modelResolver.resolveModel(requestContext),
    memory: new Memory({ storage }),
  };
}
```

## The RAG tool — `findSimilarJobPostingsPrerequisites`

```typescript
return createTool({
  id: 'find-similar-job-postings-prerequisites',
  description: '...', // fetched from Langfuse
  inputSchema: z.object({
    queryText: z.string().describe('Job posting title or description'),
  }),
  execute: async (inputData, context) => {
    const vectorQueryTool = createVectorQueryTool({
      id: 'find-similar-job-postings-prerequisites',
      vectorStoreName: 'pgVector',
      indexName: 'job_posting_titles',
      model: new ModelRouterEmbeddingModel('openai/text-embedding-3-small'),
      enableFilter: true, // tenant-scoped via request context
      databaseConfig: { pgvector: { minScore: 0.5 } },
    });
    return await vectorQueryTool.execute(
      { queryText: inputData.queryText, topK: 2 },
      context,
    );
  },
});
```

- Embedding model: OpenAI `text-embedding-3-small`
- Vector store: `pgvector` (PostgreSQL extension)
- Index: `job_posting_titles`
- Min similarity: 0.5
- Top K: 2 results
- **Filter:** automatically scoped to user's `siteId` via the resource enforcer middleware

## Multi-tenant isolation — `resourceIdEnforcerMiddleware`

```typescript
export const resourceIdEnforcerMiddleware: MiddlewareHandler = (c, next) => {
  const requestContext = c.get('requestContext');
  const user = requestContext.get('user');

  if (user?.email && user?.siteId) {
    requestContext.set(MASTRA_RESOURCE_ID_KEY, `${user.email}:${user.siteId}`);

    const metadataFilter = { siteId: user.siteId };
    requestContext.set('filter', metadataFilter);
  }

  return requestScope.run({ requestContext, ... }, () => next());
};
```

**Why this matters:** every RAG query is automatically filtered by `siteId`. The agent **cannot leak data across tenants**, even if the prompt or tool execution is exploited. This is enforced at middleware level, before the agent runs.

## Multi-provider model routing

Same agent code, different models per request:

```typescript
resolveModel(requestContext: RequestContext) {
  const selectedModel = requestContext.get('selectedModel');
  if (!selectedModel) {
    return azure(`${prefix}-gpt-4.1`); // default
  }
  if (selectedModel.provider === 'OpenAI') return openAI(selectedModel.model);
  if (selectedModel.provider === 'Anthropic') return anthropicVertex(selectedModel.model);
  if (selectedModel.provider === 'Gemini') return googleVertex(selectedModel.model);
  if (selectedModel.provider === 'Mistral') return mistral(selectedModel.model);
  if (selectedModel.provider === 'LiteLLM') return litellm(selectedModel.model);
  // ...
}
```

The user can pick the model per request via HTTP header. Useful for cost optimization, A/B testing, and customer-specific routing.

## The frontend streaming hook

This is where the React app talks to the agent. Located in `apps/frontoffice/src/hooks/prerequisite-advisor.ts`.

```typescript
const stream = await agent.stream<SuggestedPrerequisitesType>(
  jobPostingDetailsPrompt,
  {
    structuredOutput: { schema: SuggestedPrerequisitesSchema },
    memory: {
      thread: crypto.randomUUID(),
      resource: `${currentUser.email}:${currentUser.siteId}`,
    },
    requestContext: {
      selectedModel: { provider, model },
      filter: { excludeJobPostingIds: [jobPosting.id] },
    },
  },
);

let acc = "";
await stream.processDataStream({
  onChunk: async (chunk) => {
    if (chunk.type !== "text-delta") return;
    acc += chunk.payload.text;
    const partial = parse(acc); // partial-json library
    if (partial.elements) {
      setPrerequisites(partial.elements); // re-render on every chunk
    }
  },
});
```

**Key technique:**

- `agent.stream()` returns text-delta chunks
- The `partial-json` library parses incomplete JSON on every chunk
- React state updates on every chunk → UI re-renders → user sees prerequisites *appear* live, one by one

This is what creates the magical "the AI is thinking and showing me the answer as it goes" experience.

## The MCP server — backend domain logic exposed as tools

The Aglae monorepo has a separate MCP server app at `apps/api/src/main-mcp.ts`. It uses `@rekog/mcp-nest` to expose backend domain queries as MCP tools that the llm-agent can call.

### The 4 MCP tools

| Tool | Input | Purpose |
|------|-------|---------|
| `Get-prerequisites` | none | Returns the catalog of all prerequisites in the system |
| `Get-job-postings-for-embeddings` | none | Returns job postings (with prerequisites) for vector store population |
| `Get-all-available-site-ids` | none | Lists all tenant site IDs (for admin tooling) |
| `Get-job-posting-details-prompt` | `jobPostingId: string` | Builds a formatted prompt string from a job posting |

### Example MCP tool

```typescript
@Injectable()
export class GetJobPostingDetailsPromptTool {
  constructor(private readonly querybus: QueryBus$) {}

  @Tool({
    name: 'Get-job-posting-details-prompt',
    parameters: z.object({
      jobPostingId: z.string().describe('The ID of the job posting to fetch'),
    }),
  })
  async getJobPostingDetailsPrompt({ jobPostingId }) {
    const jobPosting = await this.querybus.execute(
      new GetJobPostingQuery(jobPostingId),
    );
    return formatPrompt(jobPosting);
  }
}
```

**Why MCP for this:** the API stays the **single source of truth** for domain logic. The llm-agent doesn't import the API's internals — it calls the MCP tools over HTTP. Clean separation. The agent can be replaced or scaled independently.

## Authentication — `CompositeAuth`

The llm-agent supports three auth methods:

1. **Google JWT** — internal staff + Mastra Studio
2. **Frontoffice JWT** — recruiter UI users
3. **API Key** — backend integrations

All extract `siteId` and `email` from the request, feeding the resource enforcer middleware.

## Observability — Langfuse

Every agent call is traced to Langfuse with the tenant context:

```typescript
new LangfuseExporter({
  publicKey: configService.get('LANGFUSE_PUBLIC_KEY_LLM_AGENT'),
  secretKey: configService.get('LANGFUSE_SECRET_KEY_LLM_AGENT'),
}),
// ...
requestContextKeys: [
  'langfuse.prompt.name',
  'langfuse.prompt.version',
  'user.email',
  'user.siteId',
  'filter',
],
```

This means every trace is linked back to a tenant + user + prompt version + filter — full auditability.

## What's missing (vs. a full harness)

The In-App Agent today is **not yet a full harness** in the Mastra `Harness` sense. It's a Mastra `Agent` with tools, RAG, MCP, and streaming. What it lacks:

- Multi-mode (only one agent, one role)
- Persistent state schema (no `Harness` instance)
- Phase-aware instructions
- Multi-round iteration with `submit_plan` blocking on user feedback
- Subagents

The talk frames this as: *"We were building the In-App Agent. We were already 80% of the way to a harness without realizing it. The Kitsune hackathon (Ernest) made the rest of the way explicit."*

## Where to go deeper

- For the harness pattern itself: [`09-harness-pattern-anatomy.md`](./09-harness-pattern-anatomy.md)
- For the hackathon project that closed the loop: [`08-kitsune-hackathon.md`](./08-kitsune-hackathon.md)
