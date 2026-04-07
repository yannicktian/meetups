# AI.xperience Meetup Slides

## What This Is

Interactive presentation web app for a 30-min meetup talk (April 10, 2026).
Deployed on Vercel. English slides, French delivery.

## Stack

- Next.js 16 + React 19 + Tailwind 4
- Framer Motion for animations
- Shiki for syntax highlighting (build-time)
- No UI library — custom components only

## Architecture

Single-page app. Each "slide" is a full-viewport section with scroll-snap navigation.

**Content model:** All slides defined in `src/content/slides.ts` as a typed `Slide[]` array. Each slide has an `id`, `section`, `component` name, and `props`. A registry (`src/lib/registry.ts`) maps component names to React components.

**V2 readiness:** Content is data, components are registry-mapped. A future Mastra agent can serve the same `Slide` objects on demand.

## Key Directories

- `src/components/deck/` — Deck infrastructure (scroll-snap, nav, progress)
- `src/components/slides/` — Slide type components (hero, narrative, code, etc.)
- `src/components/interactive/` — Embedded mockups (SMS conversation, prerequisite setup, architecture diagrams)
- `src/content/` — Slide data
- `src/lib/` — Types, registry, utilities

## Design

Bold keynote aesthetic — dark background (#0a0a0b), large fluid type, vibrant accents, dramatic Framer Motion transitions. Conference energy.

## Commands

```bash
pnpm install
pnpm dev        # dev server
pnpm build      # production build
pnpm lint       # ESLint
```

## Design Spec

Full spec at `docs/superpowers/specs/2026-04-07-meetup-slides-design.md`
