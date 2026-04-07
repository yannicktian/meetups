# Meetup Interactive Slides — Design Spec

**Event:** Developer AI.xperience night with Gojob, Volta Medical
**Date:** Thursday April 10, 2026 (~25 min talk + 5 min Q&A)
**Audience:** Mixed — AI-savvy devs and curious less-experienced devs
**Language:** English slides, French delivery
**Deploy:** Vercel

## Vision

A single-page Next.js web app that serves as interactive presentation slides for a 30-minute meetup talk. Bold keynote aesthetic, scroll-driven navigation, embedded interactive components (animated SMS mockups, streaming UI simulations, architecture diagrams, code reveals).

**V1:** Linear slide deck rendered from structured data.
**V2 (future):** A Mastra agent serves the same slide components on demand — the speaker asks questions, the agent renders the answers as rich UI. The talk becomes a conversation with an AI.

V1 is architected so V2 is a natural evolution: content is structured data, components are reusable, the rendering layer is decoupled from the content source.

## Talk Narrative

The arc is a journey story: "From 3M conversations to SaaS to in-app agents — the evolution of AI at Gojob." Each stage has lessons for the audience.

### Section 1: Intro (2 min, 2-3 slides)
- Hero slide: talk title, speaker name, Gojob
- What is Gojob: temp work marketplace, scale context

### Section 2: Alpha — The Recruiter Assistant (8 min, 5-6 slides)
- The problem: recruiters drowning in candidate screening
- Alpha's job: prequalify candidates via SMS, validate job posting prerequisites
- Interactive mockup: animated SMS conversation flow
- Stats: 3M conversations in production
- The hard part: 80% easy to build, 20% to make production-ready
- Observability, control, trust: supervision system overview (architecture diagram)

### Section 3: SaaS — Selling Alpha (5 min, 3-4 slides)
- Success led to a SaaS product (France Travail, Persol, etc.)
- The onboarding pain: long setup process, round-trips with customer hierarchy
- Architecture overview: Make scenario + Alpha pipeline (high-level diagram)

### Section 4: In-App Agent (8 min, 6-7 slides)
- The solution: let recruiters self-serve prerequisite setup
- Mastra agent + RAG for similar job postings
- Interactive mockup: prerequisite suggestion flow with streaming effect
- Tech deep dive: Mastra + AG-UI + MCP architecture (code snippets + diagram)
- Where we are vs where we want to go (feedback loops, fake conversations, self-improvement)
- Ernest hackathon demo reference (richest UI implementation)

### Section 5: Future — AI-Native Products (2 min, 2-3 slides)
- The harness pattern: agents that hold product features
- Vision: agent as the interface, rich UI as the output
- Closing / Q&A prompt

**Total: ~20-22 slides**

## Content Model

Each slide is a typed object:

```ts
type SlideSection = "intro" | "alpha" | "saas" | "agent" | "future"

type Slide = {
  id: string                      // e.g. "alpha-intro"
  title: string
  subtitle?: string
  section: SlideSection
  component: string               // maps to React component via registry
  props: Record<string, unknown>  // data passed to the component
  notes?: string                  // speaker notes (hidden)
}
```

All slides defined in `src/content/slides.ts` as an ordered `Slide[]` array. A `registry.ts` maps component name strings to React components.

### Slide Component Types

| Component | Purpose |
|-----------|---------|
| `HeroSlide` | Big title + subtitle, animated entrance |
| `NarrativeSlide` | Text + visual side by side (illustration, diagram, or interactive element) |
| `CodeSlide` | Syntax-highlighted code with step-by-step line reveals |
| `ArchitectureSlide` | Animated diagram (nodes + edges with staggered entrance) |
| `InteractiveSlide` | Embedded interactive mockup (SMS conversation, prerequisite setup) |
| `StatsSlide` | Big numbers with animated counters |
| `TransitionSlide` | Full-bleed visual break between sections |

## Interactive Components

### SMS Conversation (`sms-conversation.tsx`)
- Phone-frame mockup with message bubbles
- Messages appear sequentially with typing indicator
- Shows Alpha-style exchange: agent asks prerequisite questions, candidate responds
- Data-driven: `{ sender: "agent" | "candidate", text: string, delay: number }[]`
- Auto-plays on slide enter, replayable

### Prerequisite Setup (`prerequisite-setup.tsx`)
- Simulates the In-App Agent experience
- Job posting card on the left, streaming prerequisites appearing on the right
- Prerequisites fade in one by one (simulating partial JSON streaming)
- Each prerequisite: label, type (eliminatory/preferred), description
- Recruiter can toggle/reorder (interactive)

### Architecture Diagram (`architecture-diagram.tsx`)
- Reusable: takes `nodes[]` + `edges[]` definition
- Nodes appear with stagger, then edges draw in
- Supports labels, grouping boxes, highlight states
- Pure SVG + Framer Motion (no diagram library)
- Used for: Alpha pipeline, SaaS architecture, Mastra+AG-UI+MCP stack

### Code Reveal (built into `code-slide.tsx`)
- Shiki syntax highlighting (build-time)
- Step-by-step: lines dim/brighten as speaker advances
- Steps: `{ range: [startLine, endLine], annotation?: string }[]`
- Used for: agent definition, MCP tool example, AG-UI streaming pattern

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 + React 19 |
| Styling | Tailwind 4 |
| Animation | Framer Motion |
| Syntax highlight | Shiki (build-time) |
| UI library | None — custom components |
| Deploy | Vercel |

No shadcn, no Radix. Custom components with bold keynote aesthetic.

## Navigation

- **Scroll:** `scroll-snap-type: y mandatory` on container, each slide is `100vh`
- **Keyboard:** Arrow up/down, Space/Shift+Space, Page up/down
- **Progress:** Bottom bar showing current slide position
- **Deep link:** URL hash updates per slide (`#alpha-intro`)
- **Touch:** Native scroll-snap handles trackpad and touch

## Visual Design

- **Background:** Deep black (#0a0a0b) or near-black
- **Typography:** Large fluid type (`clamp()`-based), bold weights, sans-serif (Inter or similar)
- **Accent:** Vibrant gradient or strong highlight color for emphasis
- **Animations:** Staggered reveals, scale-in, fade-up via Framer Motion
- **Code:** Dark syntax theme matching the overall aesthetic
- **Aesthetic:** Conference keynote energy — bold, expressive, dramatic transitions

## Project Structure

```
meetups/
  src/
    app/
      layout.tsx              # Root layout, fonts, metadata
      page.tsx                # Renders SlidesDeck
    components/
      deck/
        slides-deck.tsx       # Scroll-snap container, keyboard nav, progress bar
        slide-wrapper.tsx     # Full-viewport section, entrance animations
      slides/
        hero-slide.tsx
        narrative-slide.tsx
        code-slide.tsx
        architecture-slide.tsx
        interactive-slide.tsx
        stats-slide.tsx
        transition-slide.tsx
      interactive/
        sms-conversation.tsx
        prerequisite-setup.tsx
        architecture-diagram.tsx
    content/
      slides.ts               # Ordered Slide[] — all talk content
    lib/
      types.ts                # Slide types
      registry.ts             # Component name -> React component map
  public/                     # Static assets
  package.json
  next.config.ts
  tailwind.config.ts
  tsconfig.json
  CLAUDE.md
  README.md
```

## V2 Agent-Driven Presentation (Future)

The same component registry and slide types, but content comes from a Mastra agent instead of a static array. The speaker asks questions during the talk ("What is Gojob?", "What is Alpha?"), and the agent responds with `Slide` objects rendered by the same components.

Architecture for V2:
- Mastra agent with tools that return `Slide` descriptors
- AG-UI protocol for streaming slide content to the frontend
- MCP server exposing domain knowledge (Gojob context, Alpha stats, architecture details)
- The rendering layer (`SlidesDeck` + component registry) stays identical

This is out of scope for V1 but the V1 architecture enables it: content is data, components are registry-mapped, the deck just renders whatever it receives.
