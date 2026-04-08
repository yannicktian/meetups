import type { ComponentType } from "react";
import { HeroSlide } from "@/components/slides/hero-slide";
import { TransitionSlide } from "@/components/slides/transition-slide";
import { StatsSlide } from "@/components/slides/stats-slide";
import { NarrativeSlide } from "@/components/slides/narrative-slide";
import { CodeSlide } from "@/components/slides/code-slide";
import { ArchitectureSlide } from "@/components/slides/architecture-slide";
import { InteractiveSlide } from "@/components/slides/interactive-slide";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registry: Record<string, ComponentType<any>> = {
  HeroSlide,
  TransitionSlide,
  StatsSlide,
  NarrativeSlide,
  CodeSlide,
  ArchitectureSlide,
  InteractiveSlide,
};
