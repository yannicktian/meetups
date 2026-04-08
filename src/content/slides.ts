import type { Slide } from "@/lib/types";

export const slides: Slide[] = [
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
      bullets: [
        "Temp work marketplace — connecting companies with candidates at scale",
        "Thousands of job postings, millions of candidates",
        "AI-first approach to recruiter productivity",
      ],
    },
  },
  {
    id: "alpha-transition",
    title: "Alpha",
    subtitle: "The Recruiter Assistant",
    section: "alpha",
    component: "TransitionSlide",
    props: {
      color: "#10b981",
    },
  },
  {
    id: "alpha-problem",
    title: "The Problem",
    section: "alpha",
    component: "NarrativeSlide",
    props: {
      subtitle: "Recruiters drowning in candidate screening",
      bullets: [
        "Hundreds of applicants per job posting",
        "Manual phone calls to prequalify each one",
        "Hours spent on candidates who don't meet basic prerequisites",
      ],
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
    id: "saas-transition",
    title: "SaaS",
    subtitle: "Selling Alpha",
    section: "saas",
    component: "TransitionSlide",
    props: {
      color: "#f59e0b",
    },
  },
  {
    id: "agent-transition",
    title: "In-App Agent",
    subtitle: "Self-serve onboarding",
    section: "agent",
    component: "TransitionSlide",
    props: {
      color: "#ec4899",
    },
  },
  {
    id: "future-transition",
    title: "The Future",
    subtitle: "AI-native products",
    section: "future",
    component: "TransitionSlide",
    props: {
      color: "#8b5cf6",
    },
  },
];
