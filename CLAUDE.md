# AI.xperience Meetup Slides

## What This Is

Interactive presentation web app for a ~25-min talk + 5-min Q&A (April 9, 2026).
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

## Editing slides — quick reference

**Full reference:** `docs/slide-system-reference.md` — read it before adding a new component type or touching anything in `src/lib/`.
**Design spec:** `docs/superpowers/specs/2026-04-07-meetup-slides-design.md`

Everyday slide edits only need `src/content/slides.ts` + this quick lookup.

### Sections (drive nav-bar color and grouping)

| id        | color     | label        |
| --------- | --------- | ------------ |
| `intro`   | `#6366f1` | Intro        |
| `alpha`   | `#10b981` | Alpha        |
| `saas`    | `#f59e0b` | SaaS         |
| `agent`   | `#ec4899` | In-App Agent |
| `pattern` | `#8b5cf6` | Ernest       |
| `vision`  | `#f43f5e` | The Vision   |

`TransitionSlide.color` should match the section color.

### Component registry (`src/lib/registry.ts`)

`HeroSlide`, `TransitionSlide`, `NarrativeSlide`, `CodeSlide`, `StatsSlide`, `ComparisonSlide`, `CalloutSlide`, `QuoteSlide`, `GridSlide`, `InteractiveSlide`, `ArchitectureSlide`, `AboutMeSlide`, `HarnessCloudSlide`, `HarnessBucketsSlide`.

`NarrativeSlide` is the workhorse — supports `bullets`, `code`/`codeLang`/`codeCaption`, `tags`/`tagsVariant`, `stagedReveal`, `size: "large"`, and per-bullet `icon` + `highlight: true`.

### Bullet shape (NarrativeSlide / AboutMeSlide)

```ts
bullets: [
  "plain string",
  { text: "with icon", icon: "Sparkles" },
  { text: "highlighted box", icon: "Brain", highlight: true },
]
```

### Icons (`src/lib/icon-map.ts`, all from lucide-react)

`Anchor` `Activity` `AlertTriangle` `ArrowRight` `Box` `Brain` `Building2` `CheckCircle2` `Code2` `Cpu` `Database` `DollarSign` `Eye` `GitBranch` `Globe` `GraduationCap` `Headphones` `HelpCircle` `Layers` `Lightbulb` `MapPin` `MessageSquare` `Network` `Plug` `Radio` `RotateCw` `Shield` `Sparkles` `TrendingUp` `UserPlus` `Users` `Workflow` `Wrench` `Zap`

Unknown names silently render nothing — add new icons to `icon-map.ts` first.

### Staged reveal

`NarrativeSlide` with `stagedReveal: true` starts with one bullet and reveals the rest on right-arrow. Resets when scrolled out of view. Only this slide type uses it (plus `CodeSlide.steps` for line-range stepping).

### Interactive components (via `InteractiveSlide`)

`SmsConversation`, `PrerequisiteSetup`, `ArchitectureDiagram` — registered locally in `src/components/interactive-slide.tsx`, not in the main registry. See `docs/slide-system-reference.md` §5 for their props.

### Before marking a slide edit done

- `pnpm lint` — catches typos in component names, unknown props.
- Spot-check in `pnpm dev` that the slide renders and icons appear.
