// src/lib/types.ts

export type SlideSection = "intro" | "alpha" | "saas" | "agent" | "pattern" | "vision";

export type Slide = {
  id: string;
  title: string;
  subtitle?: string;
  section: SlideSection;
  component: string;
  props: Record<string, unknown>;
  notes?: string;
};

export type SmsMessage = {
  sender: "agent" | "candidate";
  text: string;
  delay: number;
};

export type DiagramNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  group?: string;
  color?: string;
  icon?: string;
};

export type DiagramEdge = {
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
};

export type DiagramGroup = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
};

export type Prerequisite = {
  label: string;
  type: "eliminatory" | "preferred";
  description: string;
};

export type CodeStep = {
  range: [number, number];
  annotation?: string;
};

export type SectionInfo = {
  id: SlideSection;
  label: string;
  short: string;
  color: string;
};

// Ordered sections — used for the top nav bar
export const SECTIONS: readonly SectionInfo[] = [
  { id: "intro", label: "Intro", short: "Intro", color: "#6366f1" },
  { id: "alpha", label: "Alpha", short: "Alpha", color: "#10b981" },
  { id: "saas", label: "SaaS", short: "SaaS", color: "#f59e0b" },
  { id: "agent", label: "In-App Agent", short: "Agent", color: "#ec4899" },
  { id: "pattern", label: "The Pattern", short: "Pattern", color: "#8b5cf6" },
  { id: "vision", label: "The Vision", short: "Vision", color: "#f43f5e" },
] as const;

export const SECTION_COLORS: Record<SlideSection, string> = {
  intro: "#6366f1",
  alpha: "#10b981",
  saas: "#f59e0b",
  agent: "#ec4899",
  pattern: "#8b5cf6",
  vision: "#f43f5e",
};

export const SECTION_LABELS: Record<SlideSection, string> = {
  intro: "Intro",
  alpha: "Alpha",
  saas: "SaaS",
  agent: "In-App Agent",
  pattern: "The Pattern",
  vision: "The Vision",
};
