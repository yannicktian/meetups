import type { Slide } from "@/lib/types";

/** The 7 buckets of harness engineering — the original talk structure,
 * enriched with concerns pulled from Mastra's Agent Harness workshop
 * (/workshops/decks/harness-workshop). Used by both the scattered "cloud"
 * slide and the gathered "buckets" slide. */
const HARNESS_BUCKETS = [
  {
    label: "State",
    color: "#6366f1",
    chips: [
      "typed schema",
      "multi-tenant filter",
      "single source of truth",
      "resume threads",
      "session grants",
    ],
  },
  {
    label: "Tools = features",
    color: "#8b5cf6",
    chips: [
      "input validation",
      "permission checks",
      "tool approval",
      "MCP connections",
      "subagent spawn",
    ],
  },
  {
    label: "Flow",
    color: "#ec4899",
    chips: [
      "modes",
      "phase-aware prompts",
      "pause / resume",
      "abort / steer",
      "plan approval",
    ],
  },
  {
    label: "Memory",
    color: "#10b981",
    chips: [
      "thread persistence",
      "observational memory",
      "memory compaction",
      "prompt caching",
      "observation threshold",
    ],
  },
  {
    label: "UI",
    color: "#06b6d4",
    chips: [
      "event subscribe",
      "stream parsing",
      "thinking indicators",
      "optimistic UI",
      "multi-modal input",
    ],
  },
  {
    label: "Reliability",
    color: "#f59e0b",
    chips: [
      "token budgets",
      "error classification",
      "provider fallback",
      "model routing",
      "error recovery",
    ],
  },
  {
    label: "Lifecycle",
    color: "#f43f5e",
    chips: [
      "rate limits",
      "cost tracking",
      "hook system",
      "token counting",
      "auth / OAuth",
    ],
  },
];

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
    title:
      "Who here uses Claude Code, Codex, or another coding agent every day?",
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
          text: "Honestly — I was blown away. A new kind of product, one that captures your intent and reshapes the UX around it.",
          icon: "Lightbulb",
        },
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
      heading: "And a harness is a lot of things.",
      buckets: HARNESS_BUCKETS,
    },
  },
  {
    id: "harness-buckets",
    title: "",
    section: "intro",
    component: "HarnessBucketsSlide",
    props: {
      heading: "Tweaking all of this is harness engineering.",
      subheading: "And 2026 is the year we get serious about it.",
      buckets: HARNESS_BUCKETS,
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
        "Customers like France Travail and Persol wanted Alpha — but every job posting needs its own screening config",
      bullets: [
        {
          text: "A prerequisite = a question Alpha asks + what counts as a valid answer (license, availability, language, transport…)",
          icon: "HelpCircle",
        },
        {
          text: "Every customer × every job posting needs its own set, tuned to the role",
          icon: "Layers",
        },
        {
          text: "Defining them by hand — weeks of round-trips with management to nail the wording, order, and validation rules",
          icon: "AlertTriangle",
          highlight: true,
        },
        {
          text: "Customers couldn't self-serve. We became the bottleneck for every new posting.",
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
          x: 50,
          y: 60,
          width: 170,
          height: 50,
          color: "#ec4899",
        },
        {
          id: "stream",
          label: "Stream API",
          x: 280,
          y: 60,
          width: 170,
          height: 50,
          color: "#ec4899",
        },
        {
          id: "agent",
          label: "Mastra Agent",
          x: 510,
          y: 60,
          width: 180,
          height: 50,
          color: "#8b5cf6",
        },
        {
          id: "rag",
          label: "RAG (pgvector)",
          x: 280,
          y: 210,
          width: 170,
          height: 50,
          color: "#6366f1",
        },
        {
          id: "mcp",
          label: "MCP Server",
          x: 510,
          y: 210,
          width: 180,
          height: 50,
          color: "#6366f1",
        },
        {
          id: "backend",
          label: "Applicative Backend",
          x: 470,
          y: 330,
          width: 260,
          height: 50,
          color: "#f59e0b",
        },
        {
          id: "domain",
          label: "Domain",
          x: 530,
          y: 450,
          width: 140,
          height: 50,
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
        { from: "mcp", to: "backend", label: "queries / commands" },
        { from: "backend", to: "domain" },
      ],
      width: 750,
      height: 530,
    },
  },
  {
    id: "in-app-limits",
    title: "But it's not a harness",
    section: "agent",
    component: "NarrativeSlide",
    props: {
      subtitle:
        "Our In-App Agent is one streaming LLM call — powerful, but capped fast",
      bullets: [
        {
          text: "Single shot — no agent loop, no reasoning across steps, no multi-tool orchestration.",
          icon: "RotateCw",
        },
        {
          text: "Can't iterate — \"make #3 mandatory, add CACES 5\" re-runs from scratch and loses prior edits.",
          icon: "AlertTriangle",
          highlight: true,
        },
        {
          text: "No memory — it forgets the recruiter between calls. \"Warehouse always needs French\"? It won't remember next time.",
          icon: "Brain",
        },
        {
          text: "No phases, no shared state — stepping beyond \"suggest prerequisites\" means a brand new flow, built from scratch.",
          icon: "GitBranch",
        },
      ],
      tags: ["agent loop", "memory", "shared state", "phases", "tools"],
      tagsVariant: "accent",
    },
  },
  {
    id: "not-ai-native",
    title: "Bolted on, not built in",
    section: "agent",
    component: "NarrativeSlide",
    props: {
      subtitle:
        "Zoom out — we keep shipping AI features on top of an old-fashioned product",
      bullets: [
        {
          text: "Every \"AI feature\" lives on top of the existing UI — a button here, a streaming card there.",
          icon: "Layers",
        },
        {
          text: "The recruiter still drives with menus. The agent just helps, one feature at a time.",
          icon: "Eye",
        },
        {
          text: "No autonomy, no reasoning, no skills — just prompt engineering and context engineering.",
          icon: "AlertTriangle",
        },
        {
          text: "What if we built the Claude Code for recruiters?",
          icon: "Sparkles",
          highlight: true,
        },
      ],
    },
  },

  // ─── HARNESS (ERNEST) ───────────────────────────────────
  {
    id: "pattern-transition",
    title: "Harness",
    subtitle: "So we built one — in 48 hours",
    section: "pattern",
    component: "TransitionSlide",
    props: { color: "#8b5cf6" },
  },
  {
    id: "ernest-intro",
    title: "Meet Ernest",
    section: "pattern",
    component: "NarrativeSlide",
    props: {
      subtitle: "Gojob hackathon, two weeks ago — our team won",
      bullets: [
        {
          text: "A recruiter copilot that owns an entire mission end-to-end — not just one feature.",
          icon: "Cpu",
        },
        {
          text: "Built in 48 hours. One codebase handles the job posting, persona selection, prerequisites, and validation.",
          icon: "Zap",
          highlight: true,
        },
        {
          text: "Agent loop, typed state, phases, memory — everything the In-App Agent couldn't do.",
          icon: "Layers",
        },
        {
          text: "It's running today. Let's open it.",
          icon: "Sparkles",
        },
      ],
    },
  },
  {
    id: "ernest-pillars",
    title: "What makes Ernest a harness",
    section: "pattern",
    component: "GridSlide",
    props: {
      subtitle: "Six things the prerequisite advisor didn't have",
      columns: 3,
      items: [
        {
          icon: "RotateCw",
          title: "Agent loop",
          description: "Multi-turn reasoning + tool calls — not a single shot",
          color: "#8b5cf6",
        },
        {
          icon: "Box",
          title: "Typed state",
          description:
            "One Zod schema for the whole mission — single source of truth",
          color: "#8b5cf6",
        },
        {
          icon: "GitBranch",
          title: "Phases",
          description:
            "Posting → personas → prerequisites → validation, one codebase",
          color: "#8b5cf6",
        },
        {
          icon: "Wrench",
          title: "Tools",
          description:
            "Every product action — generate personas, advance phase, save posting",
          color: "#8b5cf6",
        },
        {
          icon: "Brain",
          title: "Memory + threads",
          description:
            "Resume a mission, recall what the recruiter said three turns ago",
          color: "#8b5cf6",
        },
        {
          icon: "Radio",
          title: "Events",
          description:
            "The UI subscribes — every state change streams to React live",
          color: "#8b5cf6",
        },
      ],
    },
  },
  {
    id: "ernest-demo",
    title: "",
    section: "pattern",
    component: "CalloutSlide",
    props: {
      title: "Live demo",
      callout: "ernest.gojob.com/missions",
      attribution: "Let's open a mission and watch the harness work",
      icon: "Sparkles",
      kind: "insight",
    },
  },
  {
    id: "mastra-quote",
    title: "The stack: Mastra",
    section: "pattern",
    component: "QuoteSlide",
    props: {
      quote:
        "The Harness is the core orchestration layer of the Mastra framework — multi-mode agent interactions, shared state, and persistent thread management.",
      author: "Mastra docs",
      source: "mastra.ai/reference/harness",
      accent: "#8b5cf6",
    },
  },
  {
    id: "mastra-harness-code",
    title: "Mastra ships the Harness class",
    section: "pattern",
    component: "NarrativeSlide",
    props: {
      subtitle: "State schema, modes, storage, events — out of the box",
      bullets: [
        { text: "Typed state schema (Zod)", icon: "Box" },
        { text: "Multi-mode agents with dynamic routing", icon: "Layers" },
        { text: "Subscribe-based event stream to the UI", icon: "Radio" },
        {
          text: "Persistent threads, memory, tool approvals",
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
    id: "ernest-factory",
    title: "One factory call and Ernest is wired up",
    section: "pattern",
    component: "NarrativeSlide",
    props: {
      subtitle: "Mission state, phases, and the recruiter agent — in 20 lines",
      bullets: [
        { text: "One harness instance per recruiting mission", icon: "Cpu" },
        {
          text: "Phases: define posting → swipe personas → set prerequisites → validate",
          icon: "GitBranch",
        },
        {
          text: "The recruiter agent reads and updates mission state at any time",
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
    id: "ernest-state",
    title: "Typed state is the foundation",
    section: "pattern",
    component: "NarrativeSlide",
    props: {
      subtitle:
        "Single Zod schema = single source of truth for the mission",
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
          text: "Frontend listens to state changes and re-renders — no polling",
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
    id: "ernest-tools",
    title: "Tools = product features",
    section: "pattern",
    component: "NarrativeSlide",
    props: {
      subtitle:
        "Every action the recruiter can take is a tool the agent can invoke",
      bullets: [
        {
          text: "Each tool is typed, validated, and observable",
          icon: "Shield",
        },
        {
          text: "The agent decides when to call them based on intent",
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
    id: "ernest-phases",
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
    id: "ernest-multi-round",
    title: "Multi-round iteration",
    section: "pattern",
    component: "NarrativeSlide",
    props: {
      subtitle: "The agent can pause, wait for the recruiter, then continue",
      bullets: [
        {
          text: "Agent proposes a plan → state enters 'waiting'",
          icon: "Activity",
        },
        {
          text: "Recruiter reviews, edits, approves → state resumes",
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
