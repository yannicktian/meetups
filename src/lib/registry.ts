import type { ComponentType } from "react";
import { HeroSlide } from "@/components/slides/hero-slide";
import { TransitionSlide } from "@/components/slides/transition-slide";
import { StatsSlide } from "@/components/slides/stats-slide";
import { NarrativeSlide } from "@/components/slides/narrative-slide";
import { CodeSlide } from "@/components/slides/code-slide";
import { ArchitectureSlide } from "@/components/slides/architecture-slide";
import { InteractiveSlide } from "@/components/slides/interactive-slide";
import { QuoteSlide } from "@/components/slides/quote-slide";
import { GridSlide } from "@/components/slides/grid-slide";
import { CalloutSlide } from "@/components/slides/callout-slide";
import { ComparisonSlide } from "@/components/slides/comparison-slide";
import { AboutMeSlide } from "@/components/slides/about-me-slide";
import { HarnessCloudSlide } from "@/components/slides/harness-cloud-slide";
import { HarnessBucketsSlide } from "@/components/slides/harness-buckets-slide";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registry: Record<string, ComponentType<any>> = {
  HeroSlide,
  TransitionSlide,
  StatsSlide,
  NarrativeSlide,
  CodeSlide,
  ArchitectureSlide,
  InteractiveSlide,
  QuoteSlide,
  GridSlide,
  CalloutSlide,
  ComparisonSlide,
  AboutMeSlide,
  HarnessCloudSlide,
  HarnessBucketsSlide,
};
