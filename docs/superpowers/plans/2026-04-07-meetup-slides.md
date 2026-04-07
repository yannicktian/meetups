# Meetup Interactive Slides — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page Next.js presentation web app with scroll-snap slides, bold keynote aesthetic, and interactive embedded components for a 30-min meetup talk.

**Architecture:** Single-page app where each slide is a full-viewport `<section>` with CSS scroll-snap. Content defined as a typed `Slide[]` array in `src/content/slides.ts`. A component registry maps slide type strings to React components. Framer Motion handles entrance animations. Shiki provides build-time syntax highlighting.

**Tech Stack:** Next.js 16, React 19, Tailwind 4, Framer Motion, Shiki

---

## File Map

```
src/
  app/
    layout.tsx              — Root layout: font loading (Inter), metadata, global CSS
    page.tsx                — Renders <SlidesDeck /> with slides from content
    globals.css             — Tailwind directives + custom CSS variables + scroll-snap
  components/
    deck/
      slides-deck.tsx       — Scroll-snap container, keyboard nav, progress bar, hash sync
      slide-wrapper.tsx     — 100vh section wrapper, Framer Motion viewport entrance
    slides/
      hero-slide.tsx        — Big centered title + subtitle + section badge
      narrative-slide.tsx   — Two-column: text left, visual right (children slot)
      code-slide.tsx        — Shiki-highlighted code with step-by-step line reveals
      architecture-slide.tsx— Animated SVG diagram from nodes[] + edges[] data
      interactive-slide.tsx — Wrapper that renders a named interactive component
      stats-slide.tsx       — Big animated counter numbers
      transition-slide.tsx  — Full-bleed section break with title
    interactive/
      sms-conversation.tsx  — Phone-frame mockup with sequential message animation
      prerequisite-setup.tsx— Job posting + streaming prerequisite cards
      architecture-diagram.tsx — Reusable animated SVG boxes + arrows
  content/
    slides.ts               — Ordered Slide[] array with all talk content
  lib/
    types.ts                — Slide, SlideSection, SMS message, diagram node/edge types
    registry.ts             — componentName string → React component map
    use-slide-nav.ts        — Keyboard nav + hash sync + current slide tracking hook
    use-in-view.ts          — IntersectionObserver hook for triggering entrance animations
  public/
    (logos, images as needed)
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /Users/yannicktian/TECH/meetups
pnpm create next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --skip-install
```

If prompted about overwriting existing files, accept. This gives us the Next.js 16 scaffold with App Router.

- [ ] **Step 2: Install dependencies**

```bash
pnpm install
pnpm add framer-motion shiki
```

- [ ] **Step 3: Configure globals.css**

Replace `src/app/globals.css` with:

```css
@import "tailwindcss";

:root {
  --bg-primary: #0a0a0b;
  --bg-surface: #141416;
  --bg-surface-hover: #1c1c1f;
  --text-primary: #fafafa;
  --text-secondary: #a0a0a8;
  --text-muted: #5c5c66;
  --accent: #6366f1;
  --accent-bright: #818cf8;
  --accent-glow: rgba(99, 102, 241, 0.15);
  --gradient-start: #6366f1;
  --gradient-end: #ec4899;
}

html {
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  overflow-y: scroll;
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-inter), system-ui, sans-serif;
}

::selection {
  background: var(--accent);
  color: white;
}
```

- [ ] **Step 4: Configure layout.tsx**

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI.xperience — The Evolution of AI at Gojob",
  description:
    "From 3M conversations to SaaS to in-app agents. Developer AI.xperience night, April 2026.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 5: Create placeholder page.tsx**

Replace `src/app/page.tsx` with:

```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-6xl font-bold bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] bg-clip-text text-transparent">
        AI.xperience
      </h1>
    </main>
  );
}
```

- [ ] **Step 6: Verify dev server starts**

```bash
pnpm dev
```

Open http://localhost:3000 — should show "AI.xperience" in gradient text on dark background.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 16 project with Tailwind 4 + dark theme"
```

---

## Task 2: Types & Content Model

**Files:**
- Create: `src/lib/types.ts`

- [ ] **Step 1: Define slide types**

```ts
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
```

- [ ] **Step 2: Verify types compile**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat: add slide content model types"
```

---

## Task 3: Slide Navigation Hook

**Files:**
- Create: `src/lib/use-slide-nav.ts`, `src/lib/use-in-view.ts`

- [ ] **Step 1: Create the useInView hook**

```ts
// src/lib/use-in-view.ts
"use client";

import { useEffect, useRef, useState } from "react";

export function useInView(threshold = 0.5) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}
```

- [ ] **Step 2: Create the useSlideNav hook**

```ts
// src/lib/use-slide-nav.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import type { Slide } from "./types";

export function useSlideNav(slides: Slide[]) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sync hash → index on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const idx = slides.findIndex((s) => s.id === hash);
      if (idx !== -1) {
        setCurrentIndex(idx);
        document.getElementById(hash)?.scrollIntoView();
      }
    }
  }, [slides]);

  // Observe which slide is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = slides.findIndex((s) => s.id === entry.target.id);
            if (idx !== -1) {
              setCurrentIndex(idx);
              window.history.replaceState(null, "", `#${slides[idx].id}`);
            }
          }
        }
      },
      { threshold: 0.5 }
    );

    const elements = slides
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [slides]);

  // Keyboard navigation
  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(slides.length - 1, index));
      document.getElementById(slides[clamped].id)?.scrollIntoView({
        behavior: "smooth",
      });
    },
    [slides]
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowDown" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        goTo(currentIndex + 1);
      } else if (
        e.key === "ArrowUp" ||
        e.key === "PageUp" ||
        (e.key === " " && e.shiftKey)
      ) {
        e.preventDefault();
        goTo(currentIndex - 1);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentIndex, goTo]);

  return { currentIndex, total: slides.length, goTo };
}
```

- [ ] **Step 3: Verify types compile**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/use-slide-nav.ts src/lib/use-in-view.ts
git commit -m "feat: add slide navigation and in-view hooks"
```

---

## Task 4: Deck Infrastructure

**Files:**
- Create: `src/components/deck/slides-deck.tsx`, `src/components/deck/slide-wrapper.tsx`

- [ ] **Step 1: Create SlideWrapper**

```tsx
// src/components/deck/slide-wrapper.tsx
"use client";

import { motion } from "framer-motion";
import { useInView } from "@/lib/use-in-view";
import type { SlideSection } from "@/lib/types";
import { SECTION_COLORS } from "@/lib/types";

type Props = {
  id: string;
  section: SlideSection;
  children: React.ReactNode;
};

export function SlideWrapper({ id, section, children }: Props) {
  const { ref, isInView } = useInView(0.3);

  return (
    <section
      id={id}
      ref={ref}
      className="relative h-screen w-full snap-start snap-always flex items-center justify-center overflow-hidden"
    >
      {/* Section accent bar */}
      <div
        className="absolute top-0 left-0 h-1 w-full"
        style={{ background: SECTION_COLORS[section] }}
      />

      <motion.div
        className="w-full max-w-6xl mx-auto px-8 md:px-16"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Create SlidesDeck**

```tsx
// src/components/deck/slides-deck.tsx
"use client";

import { useSlideNav } from "@/lib/use-slide-nav";
import { SlideWrapper } from "./slide-wrapper";
import { registry } from "@/lib/registry";
import type { Slide } from "@/lib/types";

type Props = {
  slides: Slide[];
};

export function SlidesDeck({ slides }: Props) {
  const { currentIndex, total } = useSlideNav(slides);

  return (
    <>
      <main className="h-screen overflow-y-scroll snap-y snap-mandatory">
        {slides.map((slide) => {
          const Component = registry[slide.component];
          if (!Component) {
            return (
              <SlideWrapper key={slide.id} id={slide.id} section={slide.section}>
                <p className="text-red-500">Unknown component: {slide.component}</p>
              </SlideWrapper>
            );
          }
          return (
            <SlideWrapper key={slide.id} id={slide.id} section={slide.section}>
              <Component {...slide.props} title={slide.title} subtitle={slide.subtitle} />
            </SlideWrapper>
          );
        })}
      </main>

      {/* Progress bar */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-[var(--bg-surface)] z-50">
        <div
          className="h-full bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>

      {/* Slide counter */}
      <div className="fixed bottom-4 right-4 text-xs text-[var(--text-muted)] font-mono z-50">
        {currentIndex + 1} / {total}
      </div>
    </>
  );
}
```

- [ ] **Step 3: Verify types compile**

```bash
pnpm exec tsc --noEmit
```

Note: This will fail because `registry` doesn't exist yet. That's expected — we'll create it in the next task.

- [ ] **Step 4: Commit**

```bash
git add src/components/deck/
git commit -m "feat: add SlidesDeck and SlideWrapper with scroll-snap + progress bar"
```

---

## Task 5: Component Registry & First Slide Types

**Files:**
- Create: `src/lib/registry.ts`, `src/components/slides/hero-slide.tsx`, `src/components/slides/transition-slide.tsx`, `src/components/slides/stats-slide.tsx`, `src/components/slides/narrative-slide.tsx`

- [ ] **Step 1: Create HeroSlide**

```tsx
// src/components/slides/hero-slide.tsx
"use client";

import { motion } from "framer-motion";

type Props = {
  title: string;
  subtitle?: string;
  badge?: string;
};

export function HeroSlide({ title, subtitle, badge }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-6">
      {badge && (
        <motion.span
          className="text-sm font-mono uppercase tracking-widest text-[var(--accent-bright)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {badge}
        </motion.span>
      )}
      <motion.h1
        className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create TransitionSlide**

```tsx
// src/components/slides/transition-slide.tsx
"use client";

import { motion } from "framer-motion";

type Props = {
  title: string;
  subtitle?: string;
  color?: string;
};

export function TransitionSlide({ title, subtitle, color }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-4">
      <motion.div
        className="w-16 h-1 rounded-full mb-4"
        style={{ background: color || "var(--accent)" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.h2
        className="text-4xl md:text-6xl font-bold"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          className="text-lg md:text-xl text-[var(--text-secondary)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create StatsSlide**

```tsx
// src/components/slides/stats-slide.tsx
"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "@/lib/use-in-view";

type StatItem = {
  value: number;
  suffix?: string;
  label: string;
};

type Props = {
  title?: string;
  stats: StatItem[];
};

function AnimatedCounter({ value, suffix }: { value: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) =>
    v >= 1_000_000
      ? `${(v / 1_000_000).toFixed(1)}M`
      : v >= 1_000
        ? `${Math.round(v / 1_000)}K`
        : Math.round(v).toLocaleString()
  );
  const { ref, isInView } = useInView(0.5);

  useEffect(() => {
    if (isInView) {
      animate(count, value, { duration: 1.5, ease: "easeOut" });
    }
  }, [isInView, count, value]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
}

export function StatsSlide({ title, stats }: Props) {
  return (
    <div className="flex flex-col items-center gap-12">
      {title && (
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {title}
        </motion.h2>
      )}
      <div className="flex flex-wrap justify-center gap-16">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.15 }}
          >
            <span className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] bg-clip-text text-transparent">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </span>
            <span className="text-sm md:text-base text-[var(--text-secondary)] uppercase tracking-wider">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create NarrativeSlide**

```tsx
// src/components/slides/narrative-slide.tsx
"use client";

import { motion } from "framer-motion";

type Props = {
  title: string;
  subtitle?: string;
  bullets?: string[];
  children?: React.ReactNode;
  reversed?: boolean;
};

export function NarrativeSlide({ title, subtitle, bullets, children, reversed }: Props) {
  return (
    <div className={`flex flex-col md:flex-row items-center gap-12 ${reversed ? "md:flex-row-reverse" : ""}`}>
      {/* Text side */}
      <div className="flex-1 flex flex-col gap-4">
        <motion.h2
          className="text-3xl md:text-5xl font-bold"
          initial={{ opacity: 0, x: reversed ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            className="text-lg text-[var(--text-secondary)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {subtitle}
          </motion.p>
        )}
        {bullets && (
          <motion.ul className="flex flex-col gap-3 mt-2">
            {bullets.map((bullet, i) => (
              <motion.li
                key={i}
                className="text-lg text-[var(--text-secondary)] flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <span className="text-[var(--accent-bright)] mt-1">&#9656;</span>
                {bullet}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>

      {/* Visual side */}
      {children && (
        <motion.div
          className="flex-1 w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Create the component registry**

```ts
// src/lib/registry.ts
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
```

- [ ] **Step 6: Verify types compile**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/slides/ src/lib/registry.ts
git commit -m "feat: add hero, transition, stats, narrative slide components + registry"
```

---

## Task 6: Wire Up Deck with Test Content

**Files:**
- Create: `src/content/slides.ts`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create initial slide content (subset for testing)**

```ts
// src/content/slides.ts
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
```

- [ ] **Step 2: Wire up page.tsx**

Replace `src/app/page.tsx` with:

```tsx
import { SlidesDeck } from "@/components/deck/slides-deck";
import { slides } from "@/content/slides";

export default function Home() {
  return <SlidesDeck slides={slides} />;
}
```

- [ ] **Step 3: Verify the app renders**

```bash
pnpm dev
```

Open http://localhost:3000 — should see:
- Dark background, gradient progress bar at bottom
- Scroll through 8 slides with snap behavior
- Keyboard arrows navigate between slides
- Each slide has entrance animations
- Stats slide shows animated counters
- Section-colored bars at top of each slide

- [ ] **Step 4: Commit**

```bash
git add src/content/slides.ts src/app/page.tsx
git commit -m "feat: wire up slides deck with initial test content"
```

---

## Task 7: Code Slide Component

**Files:**
- Create: `src/components/slides/code-slide.tsx`
- Modify: `src/lib/registry.ts`

- [ ] **Step 1: Create CodeSlide with Shiki highlighting**

```tsx
// src/components/slides/code-slide.tsx
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import type { CodeStep } from "@/lib/types";

type Props = {
  title?: string;
  code: string;
  lang?: string;
  steps?: CodeStep[];
  activeStep?: number;
};

export function CodeSlide({ title, code, lang = "typescript", steps }: Props) {
  const [html, setHtml] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    codeToHtml(code, {
      lang,
      theme: "vitesse-dark",
    }).then(setHtml);
  }, [code, lang]);

  // Keyboard step navigation within the code slide
  useEffect(() => {
    if (!steps || steps.length === 0) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        e.stopPropagation();
        setActiveStep((prev) => Math.min(steps!.length - 1, prev + 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        e.stopPropagation();
        setActiveStep((prev) => Math.max(0, prev - 1));
      }
    }

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [steps]);

  const currentStep = steps?.[activeStep];
  const lines = code.split("\n");

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        {title && (
          <motion.h2
            className="text-2xl md:text-3xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {title}
          </motion.h2>
        )}
        {currentStep?.annotation && (
          <motion.span
            key={activeStep}
            className="text-sm text-[var(--accent-bright)] font-mono"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {currentStep.annotation}
          </motion.span>
        )}
      </div>

      <motion.div
        className="relative rounded-xl overflow-hidden border border-[var(--bg-surface-hover)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Step indicators */}
        {steps && steps.length > 1 && (
          <div className="absolute top-3 right-3 flex gap-1.5 z-10">
            {steps.map((_, i) => (
              <button
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === activeStep ? "bg-[var(--accent)]" : "bg-[var(--text-muted)]"
                }`}
                onClick={() => setActiveStep(i)}
              />
            ))}
          </div>
        )}

        {/* Code with line dimming */}
        {html ? (
          <div className="text-sm md:text-base [&_pre]:!p-6 [&_pre]:!bg-[var(--bg-surface)]">
            <div
              dangerouslySetInnerHTML={{ __html: html }}
              style={{
                // Apply line dimming via CSS
                ...Object.fromEntries(
                  currentStep
                    ? lines.map((_, i) => {
                        const lineNum = i + 1;
                        const inRange =
                          lineNum >= currentStep.range[0] &&
                          lineNum <= currentStep.range[1];
                        return [
                          `--line-${lineNum}-opacity`,
                          inRange ? "1" : "0.3",
                        ];
                      })
                    : []
                ),
              }}
            />
          </div>
        ) : (
          <pre className="p-6 bg-[var(--bg-surface)] text-[var(--text-muted)] text-sm">
            {code}
          </pre>
        )}
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Register CodeSlide**

Add to `src/lib/registry.ts`:

```ts
import { CodeSlide } from "@/components/slides/code-slide";

// Add to the registry object:
  CodeSlide,
```

- [ ] **Step 3: Verify types compile**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/slides/code-slide.tsx src/lib/registry.ts
git commit -m "feat: add CodeSlide with Shiki highlighting and step-through"
```

---

## Task 8: Architecture Diagram Component

**Files:**
- Create: `src/components/interactive/architecture-diagram.tsx`, `src/components/slides/architecture-slide.tsx`
- Modify: `src/lib/registry.ts`

- [ ] **Step 1: Create ArchitectureDiagram (reusable SVG)**

```tsx
// src/components/interactive/architecture-diagram.tsx
"use client";

import { motion } from "framer-motion";
import type { DiagramNode, DiagramEdge, DiagramGroup } from "@/lib/types";

type Props = {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  groups?: DiagramGroup[];
  width?: number;
  height?: number;
};

function getNodeCenter(node: DiagramNode) {
  return { x: node.x + node.width / 2, y: node.y + node.height / 2 };
}

export function ArchitectureDiagram({
  nodes,
  edges,
  groups = [],
  width = 800,
  height = 500,
}: Props) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto"
      fill="none"
    >
      {/* Groups */}
      {groups.map((group, i) => (
        <motion.g
          key={group.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <rect
            x={group.x}
            y={group.y}
            width={group.width}
            height={group.height}
            rx={12}
            fill={group.color || "var(--bg-surface)"}
            fillOpacity={0.3}
            stroke={group.color || "var(--text-muted)"}
            strokeOpacity={0.3}
            strokeWidth={1}
          />
          <text
            x={group.x + 12}
            y={group.y + 20}
            fill="var(--text-muted)"
            fontSize={11}
            fontFamily="monospace"
          >
            {group.label}
          </text>
        </motion.g>
      ))}

      {/* Edges */}
      {edges.map((edge, i) => {
        const from = nodeMap.get(edge.from);
        const to = nodeMap.get(edge.to);
        if (!from || !to) return null;
        const start = getNodeCenter(from);
        const end = getNodeCenter(to);

        return (
          <motion.g key={`${edge.from}-${edge.to}`}>
            <motion.line
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="var(--text-muted)"
              strokeWidth={1.5}
              strokeDasharray={edge.animated ? "6 4" : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
            />
            {edge.label && (
              <motion.text
                x={(start.x + end.x) / 2}
                y={(start.y + end.y) / 2 - 8}
                fill="var(--text-muted)"
                fontSize={10}
                fontFamily="monospace"
                textAnchor="middle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                {edge.label}
              </motion.text>
            )}
          </motion.g>
        );
      })}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.g
          key={node.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 200 }}
          style={{ transformOrigin: `${node.x + node.width / 2}px ${node.y + node.height / 2}px` }}
        >
          <rect
            x={node.x}
            y={node.y}
            width={node.width}
            height={node.height}
            rx={8}
            fill={node.color || "var(--bg-surface)"}
            stroke={node.color || "var(--accent)"}
            strokeOpacity={0.5}
            strokeWidth={1}
          />
          <text
            x={node.x + node.width / 2}
            y={node.y + node.height / 2 + 4}
            fill="var(--text-primary)"
            fontSize={13}
            fontFamily="system-ui"
            textAnchor="middle"
            fontWeight={500}
          >
            {node.label}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}
```

- [ ] **Step 2: Create ArchitectureSlide**

```tsx
// src/components/slides/architecture-slide.tsx
"use client";

import { motion } from "framer-motion";
import { ArchitectureDiagram } from "@/components/interactive/architecture-diagram";
import type { DiagramNode, DiagramEdge, DiagramGroup } from "@/lib/types";

type Props = {
  title: string;
  subtitle?: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  groups?: DiagramGroup[];
  width?: number;
  height?: number;
};

export function ArchitectureSlide({ title, subtitle, nodes, edges, groups, width, height }: Props) {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            className="text-lg text-[var(--text-secondary)] mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      <motion.div
        className="w-full max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <ArchitectureDiagram
          nodes={nodes}
          edges={edges}
          groups={groups}
          width={width}
          height={height}
        />
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 3: Register ArchitectureSlide**

Add to `src/lib/registry.ts`:

```ts
import { ArchitectureSlide } from "@/components/slides/architecture-slide";

// Add to the registry object:
  ArchitectureSlide,
```

- [ ] **Step 4: Verify types compile**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/interactive/architecture-diagram.tsx src/components/slides/architecture-slide.tsx src/lib/registry.ts
git commit -m "feat: add architecture diagram component with animated SVG nodes + edges"
```

---

## Task 9: SMS Conversation Interactive Component

**Files:**
- Create: `src/components/interactive/sms-conversation.tsx`, `src/components/slides/interactive-slide.tsx`
- Modify: `src/lib/registry.ts`

- [ ] **Step 1: Create SmsConversation**

```tsx
// src/components/interactive/sms-conversation.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import type { SmsMessage } from "@/lib/types";

type Props = {
  messages: SmsMessage[];
  autoPlay?: boolean;
};

export function SmsConversation({ messages, autoPlay = true }: Props) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const playNext = useCallback(() => {
    if (visibleCount >= messages.length) return;

    const nextMessage = messages[visibleCount];
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setVisibleCount((c) => c + 1);
    }, nextMessage.delay);
  }, [visibleCount, messages]);

  useEffect(() => {
    if (autoPlay && visibleCount < messages.length) {
      const timer = setTimeout(playNext, visibleCount === 0 ? 500 : 300);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, visibleCount, messages.length, playNext]);

  const replay = () => {
    setVisibleCount(0);
    setIsTyping(false);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Phone frame */}
      <div className="bg-[#1a1a2e] rounded-[2rem] p-2 shadow-2xl border border-[var(--bg-surface-hover)]">
        {/* Status bar */}
        <div className="flex justify-between items-center px-6 py-2 text-[10px] text-[var(--text-muted)]">
          <span>9:41</span>
          <div className="w-20 h-5 bg-black rounded-full" />
          <span>5G</span>
        </div>

        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--bg-surface-hover)]">
          <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-xs font-bold">
            A
          </div>
          <div>
            <div className="text-sm font-semibold text-[var(--text-primary)]">Alpha</div>
            <div className="text-[10px] text-[var(--text-muted)]">Gojob Recruiter Assistant</div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto px-3 py-4 flex flex-col gap-2">
          <AnimatePresence mode="popLayout">
            {messages.slice(0, visibleCount).map((msg, i) => (
              <motion.div
                key={i}
                className={`flex ${msg.sender === "candidate" ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "candidate"
                      ? "bg-[var(--accent)] text-white rounded-br-md"
                      : "bg-[var(--bg-surface)] text-[var(--text-primary)] rounded-bl-md"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="bg-[var(--bg-surface)] px-4 py-2.5 rounded-2xl rounded-bl-md flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]"
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Input bar */}
        <div className="px-3 pb-3">
          <div className="flex items-center gap-2 bg-[var(--bg-surface)] rounded-full px-4 py-2">
            <span className="text-sm text-[var(--text-muted)] flex-1">Message...</span>
            <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center">
              <span className="text-white text-xs">&#9650;</span>
            </div>
          </div>
        </div>
      </div>

      {/* Replay button */}
      {visibleCount >= messages.length && (
        <motion.button
          className="mt-4 mx-auto block text-sm text-[var(--text-muted)] hover:text-[var(--accent-bright)] transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={replay}
        >
          Replay conversation
        </motion.button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create InteractiveSlide**

```tsx
// src/components/slides/interactive-slide.tsx
"use client";

import { motion } from "framer-motion";
import { SmsConversation } from "@/components/interactive/sms-conversation";
import { PrerequisiteSetup } from "@/components/interactive/prerequisite-setup";
import type { ComponentType } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const interactiveRegistry: Record<string, ComponentType<any>> = {
  SmsConversation,
  // PrerequisiteSetup will be added in Task 10
};

type Props = {
  title?: string;
  subtitle?: string;
  interactiveComponent: string;
  interactiveProps: Record<string, unknown>;
  layout?: "centered" | "side-by-side";
};

export function InteractiveSlide({
  title,
  subtitle,
  interactiveComponent,
  interactiveProps,
  layout = "centered",
}: Props) {
  const Component = interactiveRegistry[interactiveComponent];

  return (
    <div className={`flex flex-col gap-8 w-full ${layout === "centered" ? "items-center" : ""}`}>
      {(title || subtitle) && (
        <div className={layout === "centered" ? "text-center" : ""}>
          {title && (
            <motion.h2
              className="text-3xl md:text-4xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {title}
            </motion.h2>
          )}
          {subtitle && (
            <motion.p
              className="text-lg text-[var(--text-secondary)] mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      )}
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {Component ? (
          <Component {...interactiveProps} />
        ) : (
          <p className="text-red-500 text-center">
            Unknown interactive: {interactiveComponent}
          </p>
        )}
      </motion.div>
    </div>
  );
}
```

Note: The `PrerequisiteSetup` import will cause a compile error until Task 10 creates the file. Create a temporary empty export to unblock:

```tsx
// src/components/interactive/prerequisite-setup.tsx (temporary placeholder)
"use client";

export function PrerequisiteSetup() {
  return <div className="text-[var(--text-muted)] text-center">Prerequisite setup — coming soon</div>;
}
```

- [ ] **Step 3: Register InteractiveSlide**

Add to `src/lib/registry.ts`:

```ts
import { InteractiveSlide } from "@/components/slides/interactive-slide";

// Add to the registry object:
  InteractiveSlide,
```

- [ ] **Step 4: Verify types compile**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/interactive/ src/components/slides/interactive-slide.tsx src/lib/registry.ts
git commit -m "feat: add SMS conversation mockup and interactive slide component"
```

---

## Task 10: Prerequisite Setup Interactive Component

**Files:**
- Modify: `src/components/interactive/prerequisite-setup.tsx`

- [ ] **Step 1: Implement PrerequisiteSetup**

Replace the placeholder with:

```tsx
// src/components/interactive/prerequisite-setup.tsx
"use client";

import { motion, AnimatePresence, Reorder } from "framer-motion";
import { useEffect, useState } from "react";
import type { Prerequisite } from "@/lib/types";

type Props = {
  jobTitle: string;
  jobCompany: string;
  prerequisites: Prerequisite[];
  autoPlay?: boolean;
};

export function PrerequisiteSetup({
  jobTitle,
  jobCompany,
  prerequisites,
  autoPlay = true,
}: Props) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [items, setItems] = useState<Prerequisite[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    if (!autoPlay) {
      setItems(prerequisites);
      setVisibleCount(prerequisites.length);
      return;
    }

    setIsStreaming(true);
    setVisibleCount(0);
    setItems([]);

    const timers: NodeJS.Timeout[] = [];
    prerequisites.forEach((prereq, i) => {
      timers.push(
        setTimeout(() => {
          setItems((prev) => [...prev, prereq]);
          setVisibleCount(i + 1);
          if (i === prerequisites.length - 1) {
            setIsStreaming(false);
          }
        }, 800 + i * 600)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [prerequisites, autoPlay]);

  return (
    <div className="flex gap-8 w-full max-w-4xl mx-auto">
      {/* Job posting card */}
      <div className="flex-shrink-0 w-64">
        <div className="bg-[var(--bg-surface)] rounded-xl p-5 border border-[var(--bg-surface-hover)]">
          <div className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider mb-3">
            Job Posting
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">{jobTitle}</h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{jobCompany}</p>
          <div className="mt-4 flex flex-col gap-2">
            <div className="h-2 bg-[var(--bg-surface-hover)] rounded-full w-full" />
            <div className="h-2 bg-[var(--bg-surface-hover)] rounded-full w-3/4" />
            <div className="h-2 bg-[var(--bg-surface-hover)] rounded-full w-5/6" />
          </div>
        </div>
      </div>

      {/* Prerequisites list */}
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Prerequisites</h3>
          {isStreaming && (
            <motion.div
              className="flex gap-1 items-center"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              <span className="text-xs text-[var(--accent-bright)]">streaming...</span>
            </motion.div>
          )}
        </div>

        <Reorder.Group axis="y" values={items} onReorder={setItems} className="flex flex-col gap-2">
          <AnimatePresence mode="popLayout">
            {items.slice(0, visibleCount).map((prereq) => (
              <Reorder.Item
                key={prereq.label}
                value={prereq}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-[var(--bg-surface)] rounded-lg p-4 border border-[var(--bg-surface-hover)] cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[var(--text-primary)]">
                        {prereq.label}
                      </span>
                      <span
                        className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                          prereq.type === "eliminatory"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {prereq.type}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                      {prereq.description}
                    </p>
                  </div>
                  <div className="flex gap-1 mt-1">
                    <div className="w-4 h-4 rounded border border-[var(--text-muted)] opacity-40" />
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Register in interactive registry**

The `PrerequisiteSetup` is already imported in `interactive-slide.tsx` from Task 9. Add it to the `interactiveRegistry`:

In `src/components/slides/interactive-slide.tsx`, update the registry:

```ts
const interactiveRegistry: Record<string, ComponentType<any>> = {
  SmsConversation,
  PrerequisiteSetup,
};
```

- [ ] **Step 3: Verify types compile**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/interactive/prerequisite-setup.tsx src/components/slides/interactive-slide.tsx
git commit -m "feat: add prerequisite setup interactive component with streaming + reorder"
```

---

## Task 11: Full Slide Content

**Files:**
- Modify: `src/content/slides.ts`

- [ ] **Step 1: Write the complete slide deck content**

Replace `src/content/slides.ts` with the full talk content. This is placeholder-quality for the talk narrative — the user will refine the actual text. The structure and data shape are the deliverable here.

```ts
// src/content/slides.ts
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
```

- [ ] **Step 2: Verify the full deck renders**

```bash
pnpm dev
```

Open http://localhost:3000 — scroll through all ~22 slides. Verify:
- All slide types render correctly
- Scroll-snap works
- Keyboard nav works
- Progress bar advances
- SMS conversation auto-plays
- Prerequisites stream in
- Architecture diagrams animate
- Stats counters animate

- [ ] **Step 3: Commit**

```bash
git add src/content/slides.ts
git commit -m "feat: add complete talk content for all 22 slides"
```

---

## Task 12: Deploy to Vercel

**Files:** None (deployment config)

- [ ] **Step 1: Link to Vercel and deploy**

```bash
vercel --yes
```

This creates the project on Vercel and triggers a preview deployment.

- [ ] **Step 2: Deploy to production**

```bash
vercel --prod
```

- [ ] **Step 3: Verify production URL**

Open the production URL returned by the CLI. Verify all slides render and animate correctly.

- [ ] **Step 4: Commit any Vercel-generated config**

```bash
git add -A && git status
```

If `.vercel/` was created, it's already in `.gitignore`. If `vercel.json` was created, commit it:

```bash
git add vercel.json 2>/dev/null; git commit -m "chore: add Vercel config" 2>/dev/null || true
```

---

## Task 13: Push to GitHub

**Files:** None

- [ ] **Step 1: Push all commits**

```bash
git push origin main
```

- [ ] **Step 2: Verify GitHub shows all files**

```bash
gh repo view yannicktian/meetups --web
```

---

## Summary

| Task | What it builds | Estimated steps |
|------|---------------|-----------------|
| 1 | Project scaffold (Next.js + Tailwind + dark theme) | 7 |
| 2 | Type definitions | 3 |
| 3 | Navigation hooks | 4 |
| 4 | Deck infrastructure (scroll-snap, wrapper, progress) | 4 |
| 5 | Slide components (hero, transition, stats, narrative) + registry | 7 |
| 6 | Wire up deck with test content | 4 |
| 7 | Code slide with Shiki | 4 |
| 8 | Architecture diagram (SVG + Framer Motion) | 5 |
| 9 | SMS conversation mockup + interactive slide | 5 |
| 10 | Prerequisite setup mockup | 4 |
| 11 | Full talk content (22 slides) | 3 |
| 12 | Deploy to Vercel | 4 |
| 13 | Push to GitHub | 2 |
