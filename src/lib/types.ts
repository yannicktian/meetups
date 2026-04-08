// src/lib/types.ts

export type SlideSection = "intro" | "alpha" | "saas" | "agent" | "future";

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

export const SECTION_COLORS: Record<SlideSection, string> = {
  intro: "#6366f1",
  alpha: "#10b981",
  saas: "#f59e0b",
  agent: "#ec4899",
  future: "#8b5cf6",
};
