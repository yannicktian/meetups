import type { Slide } from "@/lib/types";

export const slides: Slide[] = [
  // ─── INTRO ───────────────────────────────────────────────
  {
    id: "hero",
    title: "2026: The Year of Harnesses",
    subtitle: "How agents become products",
    section: "intro",
    component: "HeroSlide",
    props: {
      badge: "Developer AI.xperience",
      event: {
        date: "April 9, 2026",
        location: "Marseille",
      },
      hosts: "Qalico × Gojob",
      acknowledgment:
        "First of a long series — thank you to both teams for hosting",
    },
  },
  {
    id: "about-me",
    title: "",
    section: "intro",
    component: "AboutMeSlide",
    props: {
      name: "Yannick Tian",
      role: "Staff Product AI Engineer",
      company: "Gojob",
      avatar: "/avatar_YT_small.jpg",
      bullets: [
        {
          text: "Driving agent building and observability for two years",
          icon: "Cpu",
        },
        {
          text: "Shipped Alpha — 3M conversations in production",
          icon: "MessageSquare",
        },
        {
          text: "Now building the In-App Agent for our SaaS customers",
          icon: "Sparkles",
        },
      ],
      links: [{ label: "yannick.tian@gojob.com" }],
    },
  },
  {
    id: "hook",
    title: "Who here uses Claude Code, Codex, or another coding agent every day?",
    section: "intro",
    component: "NarrativeSlide",
    props: {
      size: "large",
    },
  },
  {
    id: "hook-realization",
    title: "",
    section: "intro",
    component: "NarrativeSlide",
    props: {
      size: "large",
      stagedReveal: true,
      bullets: [
        {
          text: "You're not just using an AI assistant.",
          icon: "Sparkles",
        },
        {
          text: "You're using a harness — agent loop, state, tools, memory, skills, UI.",
          icon: "Workflow",
          highlight: true,
        },
        {
          text: "And in the next 25 minutes, you'll see why every product is about to be built around one.",
          icon: "Zap",
        },
      ],
    },
  },
  {
    id: "models-are-powerful",
    title: "Models are powerful.",
    section: "intro",
    component: "NarrativeSlide",
    props: {
      size: "large",
      bullets: [
        {
          text: "But raw, they can't run inside your product.",
          highlight: true,
        },
      ],
      tags: [
        "no state",
        "no tools",
        "no user memory",
        "no streaming UI",
        "no multi-tenant safety",
      ],
      tagsVariant: "muted",
    },
  },
  {
    id: "wrap-in-harness",
    title: "So we wrap them in a harness.",
    section: "intro",
    component: "NarrativeSlide",
    props: {
      size: "large",
      bullets: [
        {
          text: "The layer that gives the model what it can't do alone — orchestrated, observable, in-product.",
          icon: "Workflow",
        },
      ],
      tags: [
        "state",
        "tools",
        "flow",
        "memory",
        "UI",
        "reliability",
        "lifecycle",
      ],
      tagsVariant: "accent",
    },
  },
  {
    id: "harness-cloud",
    title: "",
    section: "intro",
    component: "HarnessCloudSlide",
    props: {
      stage1Heading: "And a harness is a lot of things.",
      stage2Heading: "Tweaking all of this is harness engineering.",
      stage2Subtitle: "And 2026 is the year we get serious about it.",
      buckets: [
        {
          label: "State",
          color: "#6366f1",
          chips: ["typed schema", "multi-tenant filter", "partial JSON", "single source of truth"],
        },
        {
          label: "Tools = features",
          color: "#8b5cf6",
          chips: ["input validation", "permission checks", "idempotency", "audit log"],
        },
        {
          label: "Flow",
          color: "#ec4899",
          chips: ["modes", "phase-aware prompts", "multi-round", "pause/resume"],
        },
        {
          label: "Memory",
          color: "#10b981",
          chips: ["thread persistence", "user facts", "embeddings cache", "observational memory"],
        },
        {
          label: "UI",
          color: "#06b6d4",
          chips: ["event subscribe", "optimistic UI", "thinking indicators"],
        },
        {
          label: "Reliability",
          color: "#f59e0b",
          chips: ["token budgets", "retries", "error classification", "provider fallback"],
        },
        {
          label: "Lifecycle",
          color: "#f43f5e",
          chips: ["rate limits", "prompt caching", "evals in production"],
        },
      ],
    },
  },

  // ─── ALPHA ───────────────────────────────────────────────
  {
    id: "alpha-transition",
    title: "Alpha",
    subtitle: "The recruiter AI assistant",
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
      subtitle: "HR tech — staffing temp workers instantly, with care",
      bullets: [
        {
          text: "Thousands of job postings, millions of candidates",
          icon: "Users",
        },
        {
          text: "35 screening calls per contract — recruiters drowning before the best candidates apply",
          icon: "AlertTriangle",
          highlight: true,
        },
        {
          text: "We started shipping AI to automate this in 2023",
          icon: "Sparkles",
        },
      ],
    },
  },
  {
    id: "alpha-intro",
    title: "Meet Alpha",
    section: "alpha",
    component: "NarrativeSlide",
    props: {
      subtitle: "Prequalifying candidates automatically via SMS",
      bullets: [
        {
          text: "Validates job posting prerequisites in a natural conversation",
          icon: "MessageSquare",
        },
        {
          text: "Recruiters see the results of every qualification",
          icon: "CheckCircle2",
        },
        {
          text: "Recruiters supervise their AI assistants",
          icon: "Eye",
        },
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
          {
            sender: "agent",
            text: "Hello! I'm Alpha from Gojob. I have a warehouse operator position available. Are you interested?",
            delay: 1200,
          },
          { sender: "candidate", text: "Yes, I'm interested!", delay: 800 },
          {
            sender: "agent",
            text: "Great! Do you have a valid forklift license (CACES 1/3/5)?",
            delay: 1000,
          },
          {
            sender: "candidate",
            text: "Yes, I have CACES 1 and 3",
            delay: 800,
          },
          {
            sender: "agent",
            text: "Perfect. The position requires working in cold storage (-20°C). Is that okay for you?",
            delay: 1200,
          },
          {
            sender: "candidate",
            text: "No problem, I've done that before",
            delay: 600,
          },
          {
            sender: "agent",
            text: "Last question: can you start next Monday for a 3-month assignment?",
            delay: 1000,
          },
          { sender: "candidate", text: "Yes, I'm available", delay: 500 },
          {
            sender: "agent",
            text: "Excellent! You meet all the prerequisites. A recruiter will contact you shortly. Thank you!",
            delay: 1500,
          },
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
        { value: 3_000_000, label: "Conversations" },
        { value: 10_000_000, label: "SMS sent" },
        { value: 500_000, label: "Prevalidated workers" },
        { value: 7, from: 35, label: "Screening calls per hire" },
      ],
    },
  },

  // ─── SAAS ────────────────────────────────────────────────
  {
    id: "saas-transition",
    title: "SaaS",
    subtitle: "Selling Alpha",
    section: "saas",
    component: "TransitionSlide",
    props: { color: "#f59e0b" },
  },
  {
    id: "saas-pivot",
    title: "From internal tool to SaaS",
    section: "saas",
    component: "NarrativeSlide",
    props: {
      subtitle:
        "Customers like France Travail and Persol wanted Alpha for themselves",
      bullets: [
        {
          text: "Same AI, customized per customer's recruiting needs",
          icon: "Building2",
        },
        {
          text: "Onboarding was painful — weeks of round-trips with management",
          icon: "AlertTriangle",
        },
        {
          text: "Customers couldn't self-serve. We were the bottleneck.",
          icon: "Zap",
        },
      ],
    },
  },

  // ─── IN-APP AGENT ────────────────────────────────────────
  {
    id: "in-app-transition",
    title: "In-App Agent",
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
        {
          text: "Built on Mastra — agent + tools + RAG + MCP server",
          icon: "Cpu",
        },
        {
          text: "Suggests prerequisites by retrieving similar job postings via vector search",
          icon: "Database",
        },
        {
          text: "Streams structured output to the UI — suggestions appear live",
          icon: "Activity",
        },
        {
          text: "From weeks of round-trips → minutes of self-serve",
          icon: "Zap",
        },
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
          {
            label: "CACES License",
            type: "eliminatory",
            description:
              "Valid CACES 1, 3, or 5 forklift certification required",
          },
          {
            label: "Cold Storage Experience",
            type: "preferred",
            description: "Previous experience in -20°C environments",
          },
          {
            label: "Availability",
            type: "eliminatory",
            description: "Must be available for immediate start",
          },
          {
            label: "Transportation",
            type: "eliminatory",
            description: "Own vehicle (site not on public transit)",
          },
          {
            label: "Physical Fitness",
            type: "preferred",
            description: "Able to lift up to 25kg regularly",
          },
          {
            label: "French Language",
            type: "eliminatory",
            description: "Conversational French for safety briefings",
          },
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
        {
          id: "frontend",
          label: "React Frontend",
          x: 30,
          y: 60,
          width: 150,
          height: 45,
          color: "#ec4899",
        },
        {
          id: "stream",
          label: "Stream API",
          x: 220,
          y: 60,
          width: 130,
          height: 45,
          color: "#ec4899",
        },
        {
          id: "agent",
          label: "Mastra Agent",
          x: 390,
          y: 60,
          width: 140,
          height: 45,
          color: "#8b5cf6",
        },
        {
          id: "rag",
          label: "RAG (pgvector)",
          x: 220,
          y: 180,
          width: 150,
          height: 45,
          color: "#6366f1",
        },
        {
          id: "mcp",
          label: "MCP Server",
          x: 410,
          y: 180,
          width: 130,
          height: 45,
          color: "#6366f1",
        },
        {
          id: "domain",
          label: "Domain DB",
          x: 410,
          y: 300,
          width: 130,
          height: 45,
          color: "#71717a",
        },
      ],
      edges: [
        {
          from: "frontend",
          to: "stream",
          label: "partial JSON",
          animated: true,
        },
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
      subtitle: "Partial JSON parsed on every chunk",
      bullets: [
        { text: "agent.stream() returns text-delta chunks", icon: "Activity" },
        { text: "partial-json parses incomplete JSON live", icon: "Zap" },
        {
          text: "React state updates → UI re-renders → users see suggestions appear",
          icon: "Sparkles",
        },
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

  // ─── THE PATTERN (REALIZATION) ───────────────────────────
  {
    id: "pattern-transition",
    title: "The Pattern",
    subtitle: "We were building harnesses all along",
    section: "pattern",
    component: "TransitionSlide",
    props: { color: "#8b5cf6" },
  },
  {
    id: "claude-code-quote",
    title: "What is Claude Code, really?",
    section: "pattern",
    component: "QuoteSlide",
    props: {
      quote:
        "The Agent SDK gives you the same tools, agent loop, and context management that power Claude Code.",
      author: "Anthropic",
      source: "docs.claude.com/en/api/agent-sdk",
      accent: "#8b5cf6",
    },
  },
  {
    id: "claude-code-anatomy",
    title: "The anatomy of a coding harness",
    section: "pattern",
    component: "GridSlide",
    props: {
      subtitle: "Claude Code is the canonical example",
      columns: 3,
      items: [
        {
          icon: "RotateCw",
          title: "Agent loop",
          description: "Autonomous reasoning + tool use",
          color: "#8b5cf6",
        },
        {
          icon: "Wrench",
          title: "Built-in tools",
          description: "Read, Edit, Bash, Glob, Grep, WebFetch",
          color: "#8b5cf6",
        },
        {
          icon: "GraduationCap",
          title: "Skills",
          description: "Composable capabilities (.claude/skills/*.md)",
          color: "#8b5cf6",
        },
        {
          icon: "Plug",
          title: "MCP servers",
          description: "External systems — Figma, Linear, your DB",
          color: "#8b5cf6",
        },
        {
          icon: "Users",
          title: "Subagents",
          description: "Specialized contexts for focused tasks",
          color: "#8b5cf6",
        },
        {
          icon: "Brain",
          title: "Hooks + Memory",
          description: "Side effects + persistent context (CLAUDE.md)",
          color: "#8b5cf6",
        },
      ],
    },
  },
  {
    id: "mastra-quote",
    title: "And the pattern just got a name",
    section: "pattern",
    component: "QuoteSlide",
    props: {
      quote:
        "The Harness is the core orchestration layer of the Mastra framework — multi-mode agent interactions, shared state, and persistent thread management.",
      author: "Mastra docs",
      source: "mastra.ai/reference/harness · Feb 2026",
      accent: "#8b5cf6",
    },
  },
  {
    id: "harness-definition",
    title: "What is a harness?",
    section: "pattern",
    component: "GridSlide",
    props: {
      subtitle: "An agent loop that owns a domain — six pillars",
      columns: 3,
      items: [
        {
          icon: "Box",
          title: "Typed state",
          description: "Single Zod schema = single source of truth",
          color: "#8b5cf6",
        },
        {
          icon: "Wrench",
          title: "Tools",
          description: "Product features the agent can invoke",
          color: "#8b5cf6",
        },
        {
          icon: "GitBranch",
          title: "Modes & phases",
          description: "Dynamic instructions per workflow stage",
          color: "#8b5cf6",
        },
        {
          icon: "Radio",
          title: "Events",
          description: "Streaming UI updates on every state change",
          color: "#8b5cf6",
        },
        {
          icon: "Brain",
          title: "Memory + threads",
          description: "Persistent conversation context",
          color: "#8b5cf6",
        },
        {
          icon: "Shield",
          title: "Reliability",
          description: "Budgets, retries, observability, multi-tenant",
          color: "#8b5cf6",
        },
      ],
    },
  },
  {
    id: "mastra-harness-code",
    title: "Mastra ships the Harness class",
    section: "pattern",
    component: "NarrativeSlide",
    props: {
      subtitle: "What was a pattern is now a primitive",
      bullets: [
        { text: "Multi-mode agents (Plan, Build, Review)", icon: "Layers" },
        { text: "Zod-validated state schema", icon: "Box" },
        { text: "Built-in event subscribe for the UI", icon: "Radio" },
        {
          text: "Subagents, workspaces, model switching, tool approvals",
          icon: "Workflow",
        },
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
    title: "Building Ernest in 48 hours",
    section: "pattern",
    component: "NarrativeSlide",
    props: {
      subtitle: "Two weeks ago — a recruiter copilot from scratch",
      bullets: [
        { text: "One harness per recruiting mission", icon: "Cpu" },
        {
          text: "Phases: define posting → swipe personas → set prerequisites → validate",
          icon: "GitBranch",
        },
        { text: "Each phase has its own prompt and toolset", icon: "Layers" },
        {
          text: "The agent reads and updates mission state at any time",
          icon: "Database",
        },
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
    section: "pattern",
    component: "NarrativeSlide",
    props: {
      subtitle: "Single Zod schema = single source of truth",
      bullets: [
        {
          text: "The agent reads state to know what phase it's in",
          icon: "Eye",
        },
        {
          text: "Tools mutate state, never the database directly",
          icon: "Wrench",
        },
        {
          text: "Frontend listens to state changes and re-renders",
          icon: "Radio",
        },
        {
          text: "Same schema everywhere — the entire system is type-safe",
          icon: "Shield",
        },
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
    section: "pattern",
    component: "NarrativeSlide",
    props: {
      subtitle:
        "Every action in your product becomes a tool the agent can invoke",
      bullets: [
        {
          text: "Each tool is typed, validated, and observable",
          icon: "Shield",
        },
        {
          text: "Agent decides when to call them based on user intent",
          icon: "Brain",
        },
        {
          text: "Tools mutate harness state → events fire → UI updates",
          icon: "Activity",
        },
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
    section: "pattern",
    component: "NarrativeSlide",
    props: {
      subtitle: "The system prompt depends on the current state",
      bullets: [
        { text: "One agent definition, multiple behaviors", icon: "Layers" },
        {
          text: "Prompt regenerated on every turn from harness state",
          icon: "RotateCw",
        },
        {
          text: "No fragile state machines hidden inside the prompt",
          icon: "Shield",
        },
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
    section: "pattern",
    component: "NarrativeSlide",
    props: {
      subtitle: "The agent can pause, wait for the user, then continue",
      bullets: [
        {
          text: "Agent proposes a plan → state machine enters 'waiting'",
          icon: "Activity",
        },
        {
          text: "User reviews, edits, approves → state machine resumes",
          icon: "Users",
        },
        {
          text: "Conversation persists across rounds via memory + threads",
          icon: "Brain",
        },
        {
          text: "This is how harnesses feel collaborative, not robotic",
          icon: "Sparkles",
        },
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
    id: "operating-complexity",
    section: "pattern",
    title: "",
    component: "CalloutSlide",
    props: {
      title: "The real complexity",
      callout:
        "Building agents isn't the hard part anymore. Operating them in production is.",
      attribution: "This is where harnesses earn their keep",
      icon: "Lightbulb",
      kind: "insight",
    },
  },
  {
    id: "reliability",
    title: "What makes harnesses production-ready",
    section: "pattern",
    component: "GridSlide",
    props: {
      subtitle: "The boring parts are where harnesses earn their keep",
      columns: 3,
      items: [
        {
          icon: "DollarSign",
          title: "Token budgets",
          description: "Stop at 90%, warn at 70%, detect diminishing returns",
          color: "#8b5cf6",
        },
        {
          icon: "AlertTriangle",
          title: "Error classification",
          description:
            "Rate-limit / overflow / provider down → retry with backoff",
          color: "#8b5cf6",
        },
        {
          icon: "Building2",
          title: "Multi-tenant",
          description: "Middleware filters every RAG query by tenant ID",
          color: "#8b5cf6",
        },
        {
          icon: "Network",
          title: "Multi-provider",
          description: "Same agent code, choose model per request",
          color: "#8b5cf6",
        },
        {
          icon: "Eye",
          title: "Observability",
          description: "Every tool call traced with tenant context",
          color: "#8b5cf6",
        },
        {
          icon: "Sparkles",
          title: "The 80% you don't see",
          description: "Where harnesses earn their keep in production",
          color: "#8b5cf6",
        },
      ],
    },
  },

  // ─── THE VISION ──────────────────────────────────────────
  {
    id: "vision-transition",
    title: "The Vision",
    subtitle: "What this changes",
    section: "vision",
    component: "TransitionSlide",
    props: { color: "#f43f5e" },
  },
  {
    id: "death-of-menus",
    title: "The death of menus",
    section: "vision",
    component: "ComparisonSlide",
    props: {
      subtitle: "How we used to ship software vs. how we ship it now",
      left: {
        label: "Yesterday",
        title: "Navigate to find features",
        bullets: [
          "Menus, forms, dropdowns",
          "Users learn the UI",
          "Click. Click. Click.",
          "Features hidden in submenus",
        ],
        icon: "Layers",
        color: "#a1a1aa",
      },
      right: {
        label: "Today",
        title: "Describe what you want",
        bullets: [
          "One input. Captures intent.",
          "Agent picks the right tools",
          "Rich UI rendered inline",
          '"Saves clicks" is the entire premise',
        ],
        icon: "Sparkles",
        color: "#f43f5e",
      },
    },
  },
  {
    id: "intent-first-callout",
    title: "",
    section: "vision",
    component: "CalloutSlide",
    props: {
      title: "Intent first",
      callout:
        "The user describes what they want. The harness figures out how. The UI is what the harness chooses to show.",
      icon: "Sparkles",
      kind: "insight",
    },
  },
  {
    id: "your-harness",
    title: "Your harness, today",
    section: "vision",
    component: "GridSlide",
    props: {
      subtitle: "Pick a domain. Build the harness. Ship it.",
      columns: 3,
      items: [
        {
          icon: "Code2",
          title: "Coding",
          description: "Claude Code, Cursor, Windsurf, mastracode",
          color: "#6366f1",
        },
        {
          icon: "UserPlus",
          title: "Recruiting",
          description: "Ernest (Gojob hackathon), our In-App Agent",
          color: "#ec4899",
        },
        {
          icon: "MapPin",
          title: "Trip planning",
          description: "Trip designer harness",
          color: "#10b981",
        },
        {
          icon: "Headphones",
          title: "Customer support",
          description: "Support harness with full ticket context",
          color: "#f59e0b",
        },
        {
          icon: "TrendingUp",
          title: "Sales",
          description: "Sales harness — from lead to close",
          color: "#8b5cf6",
        },
        {
          icon: "HelpCircle",
          title: "What's yours?",
          description: "Every domain that has a product can have a harness",
          color: "#f43f5e",
        },
      ],
    },
  },
  {
    id: "year-of-harnesses",
    title: "2026 is the year of harnesses",
    subtitle:
      "The pattern has a name. Mastra ships it. Anthropic productionizes it. Your turn.",
    section: "vision",
    component: "HeroSlide",
    props: {
      badge: "Build yours · @yannicktian · gojob.com",
    },
  },
  {
    id: "thank-you",
    title: "Merci",
    subtitle: "Questions?",
    section: "vision",
    component: "HeroSlide",
    props: {
      badge: "github.com/yannicktian/meetups · meetups-talk.vercel.app",
    },
  },
];
