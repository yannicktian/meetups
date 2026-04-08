import type { Slide } from "@/lib/types";

export const slides: Slide[] = [
  // ─── ACT I: SETUP ────────────────────────────────────────
  {
    id: "hero",
    title: "2026: The Year of Harnesses",
    subtitle: "How agents become products",
    section: "intro",
    component: "HeroSlide",
    props: {
      badge: "Developer AI.xperience — Yannick Tian, Gojob",
    },
  },
  {
    id: "hook",
    title: "Show of hands",
    section: "intro",
    component: "NarrativeSlide",
    props: {
      subtitle: "Who here uses Claude Code, Cursor, or Windsurf every day?",
      bullets: [
        "You're not just using an AI assistant",
        "You're using a harness — an agent loop with tools, skills, memory, and a UI",
        "Today: how this same pattern is going to reshape every product you build",
      ],
    },
  },
  {
    id: "claude-code-quote",
    title: "What is Claude Code, really?",
    section: "intro",
    component: "QuoteSlide",
    props: {
      quote:
        "The Agent SDK gives you the same tools, agent loop, and context management that power Claude Code.",
      author: "Anthropic",
      source: "docs.claude.com/en/api/agent-sdk",
    },
  },
  {
    id: "claude-code-anatomy",
    title: "The anatomy of a coding harness",
    section: "intro",
    component: "NarrativeSlide",
    props: {
      subtitle: "Claude Code is the canonical example",
      bullets: [
        "Agent loop — autonomous reasoning + tool use",
        "Built-in tools — Read, Edit, Bash, Glob, Grep, WebFetch",
        "Skills — composable capabilities (.claude/skills/*.md)",
        "MCP servers — external systems (Figma, Linear, your DB)",
        "Subagents — specialized contexts for focused tasks",
        "Hooks + Memory — deterministic side effects + persistent context",
      ],
    },
  },
  {
    id: "mastra-quote",
    title: "And the pattern just got a name",
    section: "intro",
    component: "QuoteSlide",
    props: {
      quote:
        "The Harness is the core orchestration layer of the Mastra framework — designed to manage multi-mode agent interactions, shared state, and persistent thread management.",
      author: "Mastra docs",
      source: "mastra.ai/reference/harness/harness-class · Feb 2026",
    },
  },

  // ─── ACT II: THE JOURNEY ─────────────────────────────────
  {
    id: "alpha-transition",
    title: "Act I — The Journey",
    subtitle: "How we ended up here",
    section: "alpha",
    component: "TransitionSlide",
    props: { color: "#10b981" },
  },
  {
    id: "what-is-gojob",
    title: "Quick context: Gojob",
    section: "alpha",
    component: "NarrativeSlide",
    props: {
      subtitle: "AI-powered temp work marketplace",
      bullets: [
        "Thousands of job postings, millions of candidates",
        "Recruiters drowning in screening calls before the best candidates apply",
        "We started shipping AI to fix this in 2023",
      ],
    },
  },
  {
    id: "alpha-intro",
    title: "Alpha",
    section: "alpha",
    component: "NarrativeSlide",
    props: {
      subtitle: "Our recruiter assistant — prequalifies candidates via SMS",
      bullets: [
        "Validates job posting prerequisites in a natural conversation",
        "Recruiters only see candidates who pass the must-haves",
        "Started as an internal tool. Worked too well to keep to ourselves.",
      ],
    },
  },
  {
    id: "alpha-demo",
    title: "Alpha in action",
    subtitle: "An automated SMS conversation",
    section: "alpha",
    component: "InteractiveSlide",
    props: {
      interactiveComponent: "SmsConversation",
      interactiveProps: {
        messages: [
          { sender: "agent", text: "Hello! I'm Alpha from Gojob. I have a warehouse operator position available. Are you interested?", delay: 1200 },
          { sender: "candidate", text: "Yes, I'm interested!", delay: 800 },
          { sender: "agent", text: "Great! Do you have a valid forklift license (CACES 1/3/5)?", delay: 1000 },
          { sender: "candidate", text: "Yes, I have CACES 1 and 3", delay: 800 },
          { sender: "agent", text: "Perfect. The position requires working in cold storage (-20°C). Is that okay for you?", delay: 1200 },
          { sender: "candidate", text: "No problem, I've done that before", delay: 600 },
          { sender: "agent", text: "Last question: can you start next Monday for a 3-month assignment?", delay: 1000 },
          { sender: "candidate", text: "Yes, I'm available", delay: 500 },
          { sender: "agent", text: "Excellent! You meet all the prerequisites. A recruiter will contact you shortly. Thank you!", delay: 1500 },
        ],
      },
    },
  },
  {
    id: "alpha-stats",
    title: "Alpha in production",
    section: "alpha",
    component: "StatsSlide",
    props: {
      stats: [
        { value: 3000000, label: "Conversations" },
        { value: 80, suffix: "%", label: "Automation rate" },
        { value: 24, suffix: "/7", label: "Availability" },
      ],
    },
  },
  {
    id: "alpha-lesson",
    title: "The 80/20 lesson",
    section: "alpha",
    component: "NarrativeSlide",
    props: {
      subtitle: "Building the AI was the easy 80%. Operating it was the other 80%.",
      bullets: [
        "Observability, scoring, anomaly detection, human-in-the-loop",
        "Trust takes infrastructure, not just a good prompt",
        "But the real lesson came from selling it",
      ],
    },
  },
  {
    id: "saas-pivot",
    title: "From internal tool to SaaS",
    section: "saas",
    component: "NarrativeSlide",
    props: {
      subtitle: "Customers like France Travail and Persol wanted Alpha for themselves",
      bullets: [
        "Same AI, customized per customer's recruiting needs",
        "Onboarding was painful: weeks of round-trips with management to define prerequisites",
        "Customers couldn't self-serve. We were the bottleneck.",
      ],
    },
  },

  // ─── ACT III: THE IN-APP AGENT ───────────────────────────
  {
    id: "in-app-transition",
    title: "Act II — The In-App Agent",
    subtitle: "Letting recruiters do it themselves",
    section: "agent",
    component: "TransitionSlide",
    props: { color: "#ec4899" },
  },
  {
    id: "in-app-pitch",
    title: "An agent inside the product",
    section: "agent",
    component: "NarrativeSlide",
    props: {
      subtitle: "What if the recruiter could just ask?",
      bullets: [
        "Built on Mastra — agent + tools + RAG + MCP server for domain logic",
        "Suggests prerequisites by retrieving similar job postings via vector search",
        "Streams structured output to the UI — users see suggestions appear live",
        "From weeks of round-trips → minutes of self-serve",
      ],
    },
  },
  {
    id: "in-app-demo",
    title: "Streaming prerequisites into the UI",
    subtitle: "Partial JSON, rendered as it arrives",
    section: "agent",
    component: "InteractiveSlide",
    props: {
      interactiveComponent: "PrerequisiteSetup",
      interactiveProps: {
        jobTitle: "Warehouse Operator",
        jobCompany: "Logistics Corp",
        prerequisites: [
          { label: "CACES License", type: "eliminatory", description: "Valid CACES 1, 3, or 5 forklift certification required" },
          { label: "Cold Storage Experience", type: "preferred", description: "Previous experience in -20°C environments" },
          { label: "Availability", type: "eliminatory", description: "Must be available for immediate start" },
          { label: "Transportation", type: "eliminatory", description: "Own vehicle (site not on public transit)" },
          { label: "Physical Fitness", type: "preferred", description: "Able to lift up to 25kg regularly" },
          { label: "French Language", type: "eliminatory", description: "Conversational French for safety briefings" },
        ],
      },
    },
  },
  {
    id: "in-app-architecture",
    title: "What we shipped",
    section: "agent",
    component: "ArchitectureSlide",
    props: {
      subtitle: "Mastra Agent + RAG + MCP + Streaming UI",
      nodes: [
        { id: "frontend", label: "React Frontend", x: 30, y: 60, width: 150, height: 45, color: "#ec4899" },
        { id: "stream", label: "Stream API", x: 220, y: 60, width: 130, height: 45 },
        { id: "agent", label: "Mastra Agent", x: 390, y: 60, width: 140, height: 45, color: "#8b5cf6" },
        { id: "rag", label: "RAG (pgvector)", x: 220, y: 180, width: 150, height: 45 },
        { id: "mcp", label: "MCP Server", x: 410, y: 180, width: 130, height: 45, color: "#6366f1" },
        { id: "domain", label: "Domain DB", x: 410, y: 300, width: 130, height: 45 },
      ],
      edges: [
        { from: "frontend", to: "stream", label: "partial JSON", animated: true },
        { from: "stream", to: "agent" },
        { from: "agent", to: "rag", label: "similar postings" },
        { from: "agent", to: "mcp", label: "tools" },
        { from: "mcp", to: "domain" },
      ],
      width: 600,
      height: 380,
    },
  },
  {
    id: "streaming-code",
    title: "Streaming structured output",
    section: "agent",
    component: "NarrativeSlide",
    props: {
      subtitle: "The frontend renders prerequisites as the agent generates them",
      bullets: [
        "agent.stream() returns text-delta chunks",
        "partial-json parses incomplete JSON on every chunk",
        "React state updates → UI re-renders → users see suggestions appear live",
      ],
      code: `const stream = await agent.stream(prompt, {
  structuredOutput: { schema: PrerequisitesSchema },
});

let acc = "";
await stream.processDataStream({
  onChunk: async (chunk) => {
    if (chunk.type !== "text-delta") return;
    acc += chunk.payload.text;
    const partial = parse(acc); // partial-json
    if (partial.elements) {
      setPrerequisites(partial.elements);
    }
  },
});`,
      codeLang: "typescript",
      codeCaption: "frontoffice/hooks/prerequisite-advisor.ts",
    },
  },

  // ─── ACT IV: THE REALIZATION ─────────────────────────────
  {
    id: "realization-transition",
    title: "Act III — The Realization",
    subtitle: "We were building harnesses all along",
    section: "future",
    component: "TransitionSlide",
    props: { color: "#8b5cf6" },
  },
  {
    id: "harness-definition",
    title: "What is a harness?",
    section: "future",
    component: "NarrativeSlide",
    props: {
      subtitle: "An agent loop that owns a domain",
      bullets: [
        "Typed state — single source of truth for the workflow",
        "Tools — product features the agent can invoke",
        "Modes/phases — dynamic instructions per workflow stage",
        "Events — streaming UI updates on every state change",
        "Memory + threads — persistent conversation context",
        "Reliability — budget tracking, retry, observability, multi-tenant",
      ],
    },
  },
  {
    id: "mastra-harness-code",
    title: "Mastra ships the Harness class",
    section: "future",
    component: "NarrativeSlide",
    props: {
      subtitle: "What was a pattern is now a primitive",
      bullets: [
        "Multi-mode agents (Plan, Build, Review)",
        "Zod-validated state schema",
        "Built-in event subscribe for UI",
        "Subagents, workspaces, model switching, tool approvals",
      ],
      code: `const harness = new Harness({
  id: "my-harness",
  storage,
  stateSchema: z.object({
    currentMode: z.string().optional(),
  }),
  modes: [
    { id: "plan", default: true, agent: planAgent },
    { id: "build", agent: buildAgent },
  ],
});

harness.subscribe(event => renderUI(event));
await harness.sendMessage({ content: "..." });`,
      codeLang: "typescript",
      codeCaption: "mastra.ai/reference/harness/harness-class",
    },
  },
  {
    id: "kitsune-harness-code",
    title: "Hackathon: a recruiter harness in 48 hours",
    section: "future",
    component: "NarrativeSlide",
    props: {
      subtitle: "Two weeks ago — building Ernest, the recruiter copilot",
      bullets: [
        "One harness per recruiting mission",
        "Phases: define posting → swipe personas → set prerequisites → validate",
        "Each phase has its own prompt and toolset",
        "The agent can read and update mission state at any time",
      ],
      code: `export function createRecruiterHarness(resourceId: string) {
  return new Harness({
    id: "ernest-recruiter",
    resourceId,
    storage,
    stateSchema: missionStateSchema,
    initialState: {
      missionDraft: { status: "draft", phase: "job_posting" },
      currentPersonas: [],
    },
    modes: [{
      id: "define",
      default: true,
      agent: recruiterAgent,
    }],
  });
}`,
      codeLang: "typescript",
      codeCaption: "kitsune/agents/harness/factory.ts",
    },
  },
  {
    id: "typed-state",
    title: "Typed state is the foundation",
    section: "future",
    component: "NarrativeSlide",
    props: {
      subtitle: "Single Zod schema = single source of truth",
      bullets: [
        "The agent reads state to know what phase it's in",
        "Tools mutate state, never the database directly",
        "Frontend listens to state changes and re-renders",
        "Same schema everywhere — the entire system is type-safe",
      ],
      code: `const missionStateSchema = z.object({
  missionDraft: z.object({
    phase: z.enum([
      "job_posting", "persona_swiping",
      "prerequisite", "validation", "complete",
    ]),
    jobPosting: jobPostingSchema.partial().optional(),
    matchingCriteria: matchingCriteriaSchema.optional(),
    swipeHistory: z.array(swipeEntrySchema).optional(),
  }),
  currentPersonas: z.array(personaSchema).default([]),
});`,
      codeLang: "typescript",
      codeCaption: "kitsune/agents/harness/state-schema.ts",
    },
  },
  {
    id: "tools-as-features",
    title: "Tools = product features",
    section: "future",
    component: "NarrativeSlide",
    props: {
      subtitle: "Every action in your product becomes a tool the agent can invoke",
      bullets: [
        "Each tool is typed, validated, and observable",
        "Agent decides when to call them based on user intent",
        "Tools mutate harness state → events fire → UI updates",
      ],
      code: `export const generatePersonas = createTool({
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
});`,
      codeLang: "typescript",
      codeCaption: "kitsune/agents/tools/generate-personas.ts",
    },
  },
  {
    id: "phase-aware-instructions",
    title: "Phase-aware instructions",
    section: "future",
    component: "NarrativeSlide",
    props: {
      subtitle: "The system prompt depends on the current state",
      bullets: [
        "One agent definition, multiple behaviors",
        "Prompt regenerated on every turn from harness state",
        "No fragile state machines hidden in the prompt",
      ],
      code: `export const recruiterAgent = new Agent({
  id: "recruiter",
  model: "openai/gpt-4o",
  instructions: ({ requestContext }) => {
    const harness = requestContext.get("harness");
    const phase = harness.getState().missionDraft.phase;
    return buildInstructions(phase);
  },
  tools: { generatePersonas, advancePhase, /* ... */ },
});`,
      codeLang: "typescript",
      codeCaption: "kitsune/agents/recruiter.ts",
    },
  },
  {
    id: "multi-round",
    title: "Multi-round iteration",
    section: "future",
    component: "NarrativeSlide",
    props: {
      subtitle: "The agent can pause, wait for the user, then continue",
      bullets: [
        "Agent proposes a plan → state machine enters 'waiting'",
        "User reviews, edits, approves → state machine resumes",
        "Conversation persists across rounds via memory + threads",
        "This is how harnesses feel collaborative, not robotic",
      ],
      code: `while (!aborted) {
  await harness.setState({ status: "waiting" });
  const signal = await waitForUserFeedback();
  if (signal.type === "done") break;

  await harness.setState({ status: "executing" });
  await harness.sendMessage({
    content: \`User feedback: \${signal.text}\`,
  });
}`,
      codeLang: "typescript",
      codeCaption: "harness pattern: multi-round loop",
    },
  },
  {
    id: "reliability",
    title: "What makes harnesses production-ready",
    section: "future",
    component: "NarrativeSlide",
    props: {
      subtitle: "The boring parts are where harnesses earn their keep",
      bullets: [
        "Token budgets — stop at 90%, warn at 70%, detect diminishing returns",
        "Error classification — rate-limit / context overflow / provider down → retry with backoff",
        "Multi-tenant isolation — middleware filters every RAG query by tenant ID",
        "Multi-provider routing — same agent code, choose model per request",
        "Observability — every tool call traced to Langfuse with tenant context",
        "This is the 80% you don't see in the demo",
      ],
    },
  },

  // ─── ACT V: THE VISION ───────────────────────────────────
  {
    id: "vision-transition",
    title: "Act IV — The Vision",
    subtitle: "What this changes",
    section: "future",
    component: "TransitionSlide",
    props: { color: "#6366f1" },
  },
  {
    id: "death-of-menus",
    title: "The death of menus",
    section: "future",
    component: "NarrativeSlide",
    props: {
      subtitle: "Old UI: navigate to what you need. New UI: describe it.",
      bullets: [
        "Menus, forms, dropdowns — built so users can find features",
        "Agents capture intent directly — no navigation tax",
        "Rich UI rendered inline as the agent acts",
        "\"Saves clicks\" isn't a metric. It's the entire premise.",
      ],
    },
  },
  {
    id: "intent-first-quote",
    title: "Intent first",
    section: "future",
    component: "QuoteSlide",
    props: {
      quote:
        "The user describes what they want. The harness figures out how to do it. The UI is what the harness chooses to show.",
      author: "The shift",
      accent: "#a464ff",
    },
  },
  {
    id: "your-harness",
    title: "Your harness, today",
    section: "future",
    component: "NarrativeSlide",
    props: {
      subtitle: "Pick a domain. Build the harness. Ship it.",
      bullets: [
        "Coding → Claude Code, Cursor, Windsurf, mastracode",
        "Recruiting → Ernest (Gojob hackathon), our In-App Agent",
        "Trip planning → trip designer harness",
        "Customer support → support harness",
        "Sales → sales harness",
        "What's yours?",
      ],
    },
  },
  {
    id: "year-of-harnesses",
    title: "2026 is the year of harnesses",
    subtitle: "The pattern has a name. Mastra ships it. Anthropic productionizes it. Your turn.",
    section: "future",
    component: "HeroSlide",
    props: {
      badge: "Build yours · @yannicktian · gojob.com",
    },
  },
  {
    id: "thank-you",
    title: "Merci",
    subtitle: "Questions?",
    section: "future",
    component: "HeroSlide",
    props: {
      badge: "github.com/yannicktian/meetups · meetups-talk.vercel.app",
    },
  },
];
