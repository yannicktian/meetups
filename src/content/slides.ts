import type { Slide } from "@/lib/types";

export const slides: Slide[] = [
  // ─── INTRO ───────────────────────────────────────────────
  {
    id: "hero",
    title: "The Evolution of AI at Gojob",
    subtitle: "From 3M conversations to SaaS to in-app agents",
    section: "intro",
    component: "HeroSlide",
    props: {
      badge: "Developer AI.xperience — April 2026",
    },
  },
  {
    id: "what-is-gojob",
    title: "What is Gojob?",
    section: "intro",
    component: "NarrativeSlide",
    props: {
      subtitle: "AI-powered temp work marketplace",
      bullets: [
        "Connecting companies with candidates at scale",
        "Thousands of job postings, millions of candidates",
        "AI-first approach to recruiter productivity",
      ],
    },
  },

  // ─── ALPHA ───────────────────────────────────────────────
  {
    id: "alpha-transition",
    title: "Alpha",
    subtitle: "The Recruiter Assistant",
    section: "alpha",
    component: "TransitionSlide",
    props: { color: "#10b981" },
  },
  {
    id: "alpha-problem",
    title: "The Screening Problem",
    section: "alpha",
    component: "NarrativeSlide",
    props: {
      subtitle: "Recruiters drowning in candidate screening",
      bullets: [
        "Hundreds of applicants per job posting",
        "Manual phone calls to prequalify each one",
        "Hours spent on candidates who don't meet basic prerequisites",
        "The best candidates slip through while recruiters are busy screening",
      ],
    },
  },
  {
    id: "alpha-demo",
    title: "Alpha in Action",
    subtitle: "Prequalifying candidates via SMS",
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
          { sender: "agent", text: "Excellent! You meet all the prerequisites. A recruiter will contact you shortly to finalize. Thank you!", delay: 1500 },
        ],
      },
    },
  },
  {
    id: "alpha-stats",
    title: "Alpha in Production",
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
    id: "alpha-hard-part",
    title: "The Hard Part",
    section: "alpha",
    component: "NarrativeSlide",
    props: {
      subtitle: "Building the AI was 80% of the effort. Making it production-ready was the other 80%.",
      bullets: [
        "Observability — know what it's doing at all times",
        "Control — catch it when it drifts",
        "Trust — confidence when it doesn't drift",
        "Human in the loop — supervision system for anomaly detection",
        "Offline evaluation, online scoring, continuous monitoring",
      ],
    },
  },
  {
    id: "alpha-architecture",
    title: "Alpha Supervision System",
    section: "alpha",
    component: "ArchitectureSlide",
    props: {
      nodes: [
        { id: "alpha", label: "Alpha Agent", x: 320, y: 30, width: 140, height: 45, color: "#10b981" },
        { id: "sms", label: "SMS Gateway", x: 100, y: 30, width: 130, height: 45 },
        { id: "scoring", label: "Online Scoring", x: 100, y: 180, width: 130, height: 45 },
        { id: "eval", label: "Offline Eval", x: 280, y: 180, width: 130, height: 45 },
        { id: "anomaly", label: "Anomaly Detection", x: 460, y: 180, width: 150, height: 45 },
        { id: "dashboard", label: "Recruiter Dashboard", x: 540, y: 30, width: 160, height: 45 },
        { id: "human", label: "Human Review", x: 300, y: 320, width: 140, height: 45, color: "#f59e0b" },
      ],
      edges: [
        { from: "sms", to: "alpha", label: "messages" },
        { from: "alpha", to: "dashboard", label: "results" },
        { from: "alpha", to: "scoring" },
        { from: "alpha", to: "eval" },
        { from: "alpha", to: "anomaly" },
        { from: "anomaly", to: "human", label: "escalate", animated: true },
        { from: "scoring", to: "human" },
        { from: "eval", to: "human" },
      ],
      groups: [
        { id: "supervision", label: "Supervision Layer", x: 80, y: 150, width: 560, height: 240, color: "#f59e0b" },
      ],
      width: 750,
      height: 400,
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
    id: "saas-product",
    title: "From Internal Tool to SaaS",
    section: "saas",
    component: "NarrativeSlide",
    props: {
      subtitle: "Alpha worked so well, we started selling it",
      bullets: [
        "France Travail, Persol, and other major clients",
        "White-label recruiter assistant for their own candidates",
        "Same AI, customized per client's recruiting needs",
      ],
    },
  },
  {
    id: "saas-pain",
    title: "The Onboarding Problem",
    section: "saas",
    component: "NarrativeSlide",
    props: {
      subtitle: "Setting up Alpha for each customer was painfully slow",
      bullets: [
        "Understanding their specific recruiting needs",
        "Defining prerequisite questions for each job type",
        "Round-trips with management for validation",
        "Weeks of back-and-forth before the first conversation",
      ],
    },
  },
  {
    id: "saas-architecture",
    title: "SaaS Architecture",
    section: "saas",
    component: "ArchitectureSlide",
    props: {
      nodes: [
        { id: "frontoffice", label: "Frontoffice", x: 50, y: 60, width: 130, height: 45, color: "#f59e0b" },
        { id: "make", label: "Make Scenario", x: 250, y: 60, width: 140, height: 45 },
        { id: "llm-agent", label: "LLM Agent", x: 450, y: 60, width: 130, height: 45, color: "#ec4899" },
        { id: "mcp", label: "MCP Server", x: 450, y: 180, width: 130, height: 45 },
        { id: "alpha", label: "Alpha", x: 250, y: 180, width: 130, height: 45, color: "#10b981" },
        { id: "candidates", label: "Candidates", x: 250, y: 300, width: 130, height: 45 },
      ],
      edges: [
        { from: "frontoffice", to: "make" },
        { from: "make", to: "llm-agent" },
        { from: "llm-agent", to: "mcp", label: "tools" },
        { from: "make", to: "alpha" },
        { from: "alpha", to: "candidates", label: "SMS", animated: true },
      ],
      width: 650,
      height: 380,
    },
  },

  // ─── IN-APP AGENT ────────────────────────────────────────
  {
    id: "agent-transition",
    title: "In-App Agent",
    subtitle: "Self-serve onboarding",
    section: "agent",
    component: "TransitionSlide",
    props: { color: "#ec4899" },
  },
  {
    id: "agent-solution",
    title: "Let Recruiters Do It Themselves",
    section: "agent",
    component: "NarrativeSlide",
    props: {
      subtitle: "An in-app agent that reduces round-trips",
      bullets: [
        "Recruiter defines prerequisites for their job posting",
        "Agent suggests relevant prerequisites via RAG",
        "Streaming partial JSON for real-time UI updates",
        "No more weeks of back-and-forth — setup in minutes",
      ],
    },
  },
  {
    id: "agent-demo",
    title: "Prerequisite Setup Agent",
    subtitle: "Streaming suggestions from similar job postings",
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
          { label: "Transportation", type: "eliminatory", description: "Own vehicle or reliable transport (site not on public transit)" },
          { label: "Physical Fitness", type: "preferred", description: "Able to lift up to 25kg regularly" },
          { label: "French Language", type: "eliminatory", description: "Conversational French for safety briefings" },
        ],
      },
    },
  },
  {
    id: "agent-tech-stack",
    title: "Tech Stack",
    section: "agent",
    component: "ArchitectureSlide",
    props: {
      subtitle: "Mastra + AG-UI + MCP",
      nodes: [
        { id: "frontend", label: "React Frontend", x: 50, y: 60, width: 150, height: 45, color: "#ec4899" },
        { id: "agui", label: "AG-UI Protocol", x: 250, y: 60, width: 150, height: 45 },
        { id: "mastra", label: "Mastra Agent", x: 450, y: 60, width: 150, height: 45, color: "#8b5cf6" },
        { id: "rag", label: "RAG Tool", x: 300, y: 180, width: 130, height: 45 },
        { id: "mcp", label: "MCP Server", x: 500, y: 180, width: 130, height: 45, color: "#6366f1" },
        { id: "db", label: "Domain DB", x: 500, y: 300, width: 130, height: 45 },
        { id: "vectors", label: "Vector Store", x: 300, y: 300, width: 130, height: 45 },
      ],
      edges: [
        { from: "frontend", to: "agui", label: "stream", animated: true },
        { from: "agui", to: "mastra" },
        { from: "mastra", to: "rag" },
        { from: "mastra", to: "mcp", label: "tools" },
        { from: "mcp", to: "db" },
        { from: "rag", to: "vectors" },
      ],
      groups: [
        { id: "agent-layer", label: "Agent Layer", x: 230, y: 30, width: 400, height: 100, color: "#8b5cf6" },
      ],
      width: 700,
      height: 380,
    },
  },
  {
    id: "agent-vision",
    title: "Where We Want to Go",
    section: "agent",
    component: "NarrativeSlide",
    props: {
      subtitle: "Beyond prerequisite suggestions",
      bullets: [
        "Agent iterates with recruiter — update, validate, refine prerequisites",
        "Coherence checking against the job posting",
        "Generate fake conversations to test prerequisites",
        "Self-improvement via prerequisite statistics",
        "If 100% of candidates pass a prerequisite, it's not filtering — remove it",
      ],
    },
  },

  // ─── FUTURE ──────────────────────────────────────────────
  {
    id: "future-transition",
    title: "The Future",
    subtitle: "AI-native products",
    section: "future",
    component: "TransitionSlide",
    props: { color: "#8b5cf6" },
  },
  {
    id: "future-harness",
    title: "The Harness Pattern",
    section: "future",
    component: "NarrativeSlide",
    props: {
      subtitle: "Agents that hold the features of the product",
      bullets: [
        "Agent as the interface — rich UI as the output",
        "Not just chat — the agent renders components, forms, visualizations",
        "Product features become agent tools",
        "The harness orchestrates: state, tools, UI, human feedback loop",
      ],
    },
  },
  {
    id: "future-closing",
    title: "Thank You",
    subtitle: "Questions?",
    section: "future",
    component: "HeroSlide",
    props: {
      badge: "@yannicktian",
    },
  },
];
