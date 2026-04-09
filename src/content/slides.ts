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
      reference: {
        label: "mastra-ai/workshops · harness-workshop",
        url: "https://github.com/mastra-ai/workshops/tree/main/decks/harness-workshop",
      },
    },
  },

  // ─── ALPHA ───────────────────────────────────────────────
  {
    id: "alpha-transition",
    title: "Let's step back",
    subtitle: "Gojob's AI product journey",
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
    section: "alpha",
    component: "InteractiveSlide",
    props: {
      interactiveComponent: "SmsConversation",
      interactiveProps: {
        messages: [
          {
            sender: "agent",
            text: "Hello! I'm Alpha from Gojob. I have a warehouse operator position available. Are you interested?",
            delay: 600,
          },
          { sender: "candidate", text: "Yes, I'm interested!", delay: 400 },
          {
            sender: "agent",
            text: "Great! Do you have a valid forklift license (CACES 1/3/5)?",
            delay: 500,
          },
          {
            sender: "candidate",
            text: "Yes, I have CACES 1 and 3",
            delay: 400,
          },
          {
            sender: "agent",
            text: "Perfect. The position requires working in cold storage (-20°C). Is that okay for you?",
            delay: 600,
          },
          {
            sender: "candidate",
            text: "No problem, I've done that before",
            delay: 300,
          },
          {
            sender: "agent",
            text: "Last question: can you start next Monday for a 3-month assignment?",
            delay: 500,
          },
          { sender: "candidate", text: "Yes, I'm available", delay: 250 },
          {
            sender: "agent",
            text: "Excellent! You meet all the prerequisites. A recruiter will contact you shortly. Thank you!",
            delay: 700,
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
          text: 'Can\'t iterate — "make #3 mandatory, add CACES 5" re-runs from scratch and loses prior edits.',
          icon: "AlertTriangle",
          highlight: true,
        },
        {
          text: 'No memory — it forgets the recruiter between calls. "Warehouse always needs French"? It won\'t remember next time.',
          icon: "Brain",
        },
        {
          text: 'No phases, no shared state — stepping beyond "suggest prerequisites" means a brand new flow, built from scratch.',
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
        "Zoom out — we keep shipping AI features on top of a traditional product",
      bullets: [
        {
          text: 'Every "AI feature" lives on top of the existing UI — a button here, a streaming card there.',
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
          text: "What if we build the Claude Code for recruiters?",
          icon: "Sparkles",
          highlight: true,
        },
      ],
    },
  },

  // ─── HARNESS (ERNEST) ───────────────────────────────────
  {
    id: "pattern-transition",
    title: "Ernest",
    subtitle: "So we built a recruiter's Harness — in 48 hours",
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
          text: "Built in 48 hours. One harness handles the job posting, persona selection, prerequisites, and validation.",
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
    id: "ernest-demo",
    title: "",
    section: "pattern",
    component: "CalloutSlide",
    props: {
      title: "Live demo",
      callout: "ernest.gojob.com/missions",
      calloutHref: "https://ernest.gojob.com/missions",
      attribution: "Let's open a mission and watch the harness work",
      icon: "Sparkles",
      kind: "insight",
    },
  },
  {
    id: "ernest-architecture",
    title: "Under the hood",
    section: "pattern",
    component: "ArchitectureSlide",
    props: {
      subtitle: "One Mastra Harness per mission — state, agent, tools, events",
      groups: [
        {
          id: "harness",
          label: "Ernest Harness (Mastra)",
          x: 160,
          y: 110,
          width: 640,
          height: 250,
          color: "#8b5cf6",
        },
      ],
      nodes: [
        {
          id: "frontend",
          label: "React Frontend",
          x: 380,
          y: 20,
          width: 200,
          height: 55,
          color: "#ec4899",
        },
        {
          id: "agent",
          label: "Recruiter Agent",
          x: 400,
          y: 155,
          width: 180,
          height: 65,
          color: "#8b5cf6",
        },
        {
          id: "tools",
          label: "Tools",
          x: 610,
          y: 155,
          width: 170,
          height: 65,
          color: "#10b981",
        },
        {
          id: "state",
          label: "Typed State (Zod)",
          x: 400,
          y: 265,
          width: 180,
          height: 65,
          color: "#6366f1",
        },
        {
          id: "events",
          label: "Event Stream",
          x: 180,
          y: 220,
          width: 200,
          height: 60,
          color: "#f43f5e",
        },
        {
          id: "llm",
          label: "OpenAI GPT-4o",
          x: 10,
          y: 160,
          width: 130,
          height: 65,
          color: "#f59e0b",
        },
        {
          id: "storage",
          label: "Postgres",
          x: 810,
          y: 265,
          width: 140,
          height: 65,
          color: "#06b6d4",
        },
      ],
      edges: [
        {
          from: "frontend",
          to: "agent",
          label: "sendMessage",
          animated: true,
        },
        { from: "agent", to: "tools", label: "invoke" },
        { from: "tools", to: "state", label: "setState" },
        { from: "state", to: "events", label: "emit" },
        {
          from: "events",
          to: "frontend",
          label: "SSE",
          animated: true,
        },
        { from: "agent", to: "llm", label: "model call" },
        { from: "state", to: "storage", label: "persist" },
      ],
      width: 960,
      height: 440,
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
          title: "Tools + Skills",
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
    id: "ernest-factory",
    title: "Ernest, 20 lines on top of Mastra",
    section: "pattern",
    component: "NarrativeSlide",
    props: {
      subtitle:
        "One Harness class — state, modes, memory, events, all wired for us",
      bullets: [
        {
          text: "We wrote: the schema, the initial state, our recruiter agent",
          icon: "Cpu",
        },
        {
          text: "Mastra wires: persistence, memory, events, tool loop",
          icon: "Workflow",
          highlight: true,
        },
        {
          text: "One harness per mission — keyed by recruiter + site",
          icon: "Shield",
        },
      ],
      code: `export function createRecruiterHarness(resourceId: string) {
  return new Harness({
    id: "ernest-recruiter",
    resourceId,
    storage,
    memory, // shared across modes → resumable conversations
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
      codeCaption: "ernest/agents/harness/factory.ts",
      codeWide: true,
    },
  },
  {
    id: "ernest-state",
    title: "Typed state: the single source of truth",
    section: "pattern",
    component: "NarrativeSlide",
    props: {
      subtitle: "One Zod schema — the contract between agent, tools, and UI",
      bullets: [
        {
          text: "Agent reads it to know what phase it's in",
          icon: "Eye",
        },
        {
          text: "Tools mutate it via harness.setState — never the DB",
          icon: "Wrench",
        },
        {
          text: "Mastra validates, persists, then fires an event",
          icon: "Shield",
        },
        {
          text: "Frontend subscribes — no polling, no re-fetches",
          icon: "Radio",
        },
      ],
      code: `const missionStateSchema = z.object({
  missionDraft: z.object({
    phase: z.enum([
      "job_posting",
      "persona_swiping",
      "prerequisite",
      "validation",
      "complete",
    ]),
    jobPosting: jobPostingSchema.partial().optional(),
    matchingCriteria: matchingCriteriaSchema.optional(),
    swipeHistory: z.array(swipeEntrySchema).optional(),
  }),
  currentPersonas: z.array(personaSchema).default([]),
});`,
      codeLang: "typescript",
      codeCaption: "ernest/agents/harness/state-schema.ts",
      codeWide: true,
    },
  },
  {
    id: "ernest-tools",
    title: "Tools: the typed state setters",
    section: "pattern",
    component: "NarrativeSlide",
    props: {
      subtitle:
        "A product feature = skill (the know-how) + tool (the state mutation)",
      bullets: [
        {
          text: "Skill = how to do it — lives in phase instructions (next slide →)",
          icon: "Brain",
        },
        {
          text: "Tool = where it lands — typed, validated, pure state mutation",
          icon: "Wrench",
          highlight: true,
        },
        {
          text: "Agent reasons using the skill, then calls the tool to persist",
          icon: "Workflow",
        },
      ],
      code: `// No LLM call, no reasoning — just a typed state setter.
// The agent already produced the personas using its skill.
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
});`,
      codeLang: "typescript",
      codeCaption: "ernest/agents/tools/generate-personas.ts",
      codeWide: true,
    },
  },
  {
    id: "ernest-phases",
    title: "Skills: the phase-aware know-how",
    section: "pattern",
    component: "NarrativeSlide",
    props: {
      subtitle:
        "Markdown files (SKILL.md) loaded per phase — Claude Code's convention",
      bullets: [
        {
          text: "One SKILL.md per phase — plain markdown, version-controlled",
          icon: "Brain",
          highlight: true,
        },
        {
          text: "Loaded on every turn based on the current phase in harness state",
          icon: "RotateCw",
        },
        {
          text: "One agent, four behaviors — structure in the schema, not in prompt hacks",
          icon: "Layers",
        },
      ],
      code: `// Skills = markdown files, Claude Code's SKILL.md convention:
//
//   skills/
//     ├── job-posting/SKILL.md
//     ├── persona-swiping/SKILL.md   ← loaded in persona_swiping
//     ├── prerequisite/SKILL.md
//     └── validation/SKILL.md

export const recruiterAgent = new Agent({
  id: "recruiter",
  model: "openai/gpt-4o",
  instructions: ({ requestContext }) => {
    const harness = requestContext.get("harness");
    const { phase } = harness.getState().missionDraft;
    return loadSkill(phase); // reads skills/\${phase}/SKILL.md
  },
  tools: {
    generatePersonas,
    recordSwipe,
    inferWeights,
    advancePhase,
    /* ... */
  },
});`,
      codeLang: "typescript",
      codeCaption: "ernest/agents/recruiter.ts",
      codeWide: true,
    },
  },
  {
    id: "ernest-multi-round",
    title: "Multi-round iteration, for free",
    section: "pattern",
    component: "NarrativeSlide",
    props: {
      subtitle: "Threads + memory make the whole conversation resumable",
      bullets: [
        {
          text: "subscribe() — every state change streams to the UI",
          icon: "Radio",
        },
        {
          text: "sendMessage() — each recruiter turn appends to the thread",
          icon: "MessageSquare",
        },
        {
          text: "Mastra persists thread + memory — no loop to reinvent",
          icon: "Brain",
          highlight: true,
        },
        {
          text: "Close the tab, come back tomorrow — the mission resumes",
          icon: "Sparkles",
        },
      ],
      code: `// Backend: pipe every state change to the frontend
harness.subscribe((event) => sseStream.push(event));

// Recruiter kicks off the mission
await harness.sendMessage({
  content: "Warehouse operator, CACES 3 required",
});

// Later — recruiter reviews, sends feedback.
// Thread + memory persist automatically,
// so the agent resumes with full context.
await harness.sendMessage({
  content: "Rework persona 3 — too senior",
});`,
      codeLang: "typescript",
      codeCaption: "ernest: recruiter interaction loop",
      codeWide: true,
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
          { text: "Menus, forms, dropdowns", icon: "Layers" },
          { text: "Users learn the UI", icon: "GraduationCap" },
          { text: "Click. Click. Click.", icon: "RotateCw" },
          { text: "Features hidden in submenus", icon: "HelpCircle" },
        ],
        icon: "Layers",
        color: "#a1a1aa",
      },
      right: {
        label: "Today",
        title: "Describe what you want",
        bullets: [
          { text: "One input — captures intent", icon: "MessageSquare" },
          { text: "Agent picks the right tools", icon: "Brain" },
          { text: "Rich UI rendered inline", icon: "Sparkles" },
          { text: '"Saves clicks" is the entire premise', icon: "Zap" },
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
    id: "just-use-agent-sdk",
    title: "Building harnesses just got easier",
    section: "vision",
    component: "NarrativeSlide",
    props: {
      subtitle:
        "The ecosystem is shipping the plumbing — a strong signal the pattern is real",
      bullets: [
        {
          text: "Claude Agent SDK — open-source agent loop + tool use",
          icon: "Code2",
        },
        {
          text: "Managed Agents (April 1, 8 days ago) — hosted runtime, sessions, memory, sandbox",
          icon: "Cpu",
        },
        {
          text: "SKILL.md + Thesys C1 — plug-in know-how + rich UI for tool calls",
          icon: "Sparkles",
        },
      ],
      quote: {
        text: "The harness — event stream, sandbox orchestration, prompt caching, context compaction, and extended thinking — is handled for you.",
        author: "Anthropic docs",
        source: "docs.claude.com · managed-agents-2026-04-01",
      },
    },
  },
  {
    id: "runtime-vs-domain",
    title: "",
    section: "vision",
    component: "CalloutSlide",
    props: {
      title: "The plumbing is solved",
      callout: "Skills, state, tools, phases — still your craft.",
      attribution: "That's harness engineering",
      icon: "Brain",
      kind: "insight",
    },
  },
  {
    id: "vision-arc",
    title: "Where this is going",
    section: "vision",
    component: "GridSlide",
    props: {
      subtitle: "From intent → suggestion → autonomy",
      columns: 3,
      items: [
        {
          icon: "MessageSquare",
          title: "Today — intent-first",
          description:
            "You describe what you want. The harness figures out how and renders rich UI.",
          color: "#6366f1",
        },
        {
          icon: "Eye",
          title: "Next — the agent never sleeps",
          description:
            "24/7 monitor. Suggests actions. You approve. — OpenClaw (P. Steinberger · 247k★)",
          color: "#8b5cf6",
        },
        {
          icon: "Sparkles",
          title: "After — self-improving",
          description:
            "Agents that train the next generation of agents. — Jared Kaplan (Anthropic)",
          color: "#f43f5e",
        },
      ],
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
          description: "Ernest (Gojob hackathon)",
          color: "#ec4899",
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
