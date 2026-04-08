import type { ComponentType } from "react";
import { HeroSlide } from "@/components/slides/hero-slide";
import { TransitionSlide } from "@/components/slides/transition-slide";
import { StatsSlide } from "@/components/slides/stats-slide";
import { NarrativeSlide } from "@/components/slides/narrative-slide";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registry: Record<string, ComponentType<any>> = {
  HeroSlide,
  TransitionSlide,
  StatsSlide,
  NarrativeSlide,
};
