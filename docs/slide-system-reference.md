# Slide System Reference

Density-first reference for editing `src/content/slides.ts` without re-exploring the codebase.
Paired quick-look lives in `CLAUDE.md`; this file is the full spec.

---

## 1. Slide content model

**Source:** `src/lib/types.ts`

```ts
type Slide = {
  id: string;              // unique; used in URL hash
  title: string;           // required (can be "")
  subtitle?: string;
  section: SlideSection;   // drives color + nav bar grouping
  component: string;       // must match a key in the registry
  props: Record<string, unknown>;
  notes?: string;          // speaker notes
};

type SlideSection = "intro" | "alpha" | "saas" | "agent" | "pattern" | "vision";
```

Supporting types also exported from `types.ts`: `SmsMessage`, `DiagramNode`, `DiagramEdge`, `DiagramGroup`, `Prerequisite`, `CodeStep`, `SectionInfo`.

---

## 2. Sections

| id        | color     | label         | use                                |
| --------- | --------- | ------------- | ---------------------------------- |
| `intro`   | `#6366f1` | Intro         | hook, harness concept              |
| `alpha`   | `#10b981` | Alpha         | Gojob recruiter AI case study      |
| `saas`    | `#f59e0b` | SaaS          | pivot to customer self-serve       |
| `agent`   | `#ec4899` | In-App Agent  | Mastra streaming demo              |
| `pattern` | `#8b5cf6` | Harness       | Ernest hackathon harness           |
| `vision`  | `#f43f5e` | The Vision    | closing, future possibilities      |

`TransitionSlide`s should use the same hex as their section for consistency.

---

## 3. Component registry

**Source:** `src/lib/registry.ts`

| component           | file                          | purpose                                        |
| ------------------- | ----------------------------- | ---------------------------------------------- |
| `HeroSlide`         | `hero-slide.tsx`              | Title card — badge, event, hosts               |
| `TransitionSlide`   | `transition-slide.tsx`        | Section divider with colored bar               |
| `NarrativeSlide`    | `narrative-slide.tsx`         | **Primary workhorse** — bullets/code/tags      |
| `CodeSlide`         | `code-slide.tsx`              | Standalone code with arrow-key step nav        |
| `StatsSlide`        | `stats-slide.tsx`             | Animated counters, optional `from → to`        |
| `ComparisonSlide`   | `comparison-slide.tsx`        | Left/right side-by-side (right is highlighted) |
| `CalloutSlide`      | `callout-slide.tsx`           | Big pull-box — insight/warning/success/info    |
| `QuoteSlide`        | `quote-slide.tsx`             | Pull quote with attribution                    |
| `GridSlide`         | `grid-slide.tsx`              | 2- or 3-column icon card grid                  |
| `InteractiveSlide`  | `interactive-slide.tsx`       | Wrapper for an interactive component           |
| `ArchitectureSlide` | `architecture-slide.tsx`      | SVG diagram (nodes + edges + groups)           |
| `AboutMeSlide`      | `about-me-slide.tsx`          | Bio card — avatar + bullets + links            |
| `HarnessCloudSlide` | `harness-cloud-slide.tsx`     | Scattered chip cloud (burst animation)         |
| `HarnessBucketsSlide` | `harness-buckets-slide.tsx` | Gathered chip bucket grid                      |

Interactive components have their **own local registry** inside `interactive-slide.tsx` — they are not in `registry.ts`.

---

## 4. Component props

### HeroSlide

```ts
{
  title: string;
  subtitle?: string;
  badge?: string;              // small uppercase badge above title
  event?: { name?: string; date?: string; location?: string };
  hosts?: string;
  acknowledgment?: string;     // small italicized line
}
```

### NarrativeSlide

```ts
{
  title: string;
  subtitle?: string;
  bullets?: (string | { text: string; icon?: string; highlight?: boolean })[];
  children?: React.ReactNode;  // side-by-side visual (rare from slides.ts)
  reversed?: boolean;          // flip layout
  code?: string;
  codeLang?: string;           // e.g. "typescript"
  codeCaption?: string;        // attribution line under code block
  size?: "default" | "large";  // scales title + icon boxes
  tags?: string[];
  tagsVariant?: "muted" | "accent";
  stagedReveal?: boolean;      // arrow-key reveals bullets one at a time
  slideId?: string;            // injected by deck — do not set manually
}
```

- `highlight: true` wraps the bullet in a callout card
- `stagedReveal: true` starts with 1 bullet visible, right-arrow reveals next
- `tagsVariant: "accent"` → colored pills; `"muted"` → gray mono pills

### GridSlide

```ts
{
  title: string;
  subtitle?: string;
  columns?: 2 | 3;             // default 3
  items: {
    icon?: string;
    title: string;
    description?: string;
    color?: string;            // hex for icon background
  }[];
}
```

### StatsSlide

```ts
{
  title?: string;
  stats: {
    value: number;             // animates up to this
    from?: number;             // if set → "from → to" with strikethrough on from
    suffix?: string;
    label: string;
  }[];
}
```

### ComparisonSlide

```ts
{
  title: string;
  subtitle?: string;
  left:  { label: string; title: string; bullets: string[]; icon?: string; color?: string };
  right: { label: string; title: string; bullets: string[]; icon?: string; color?: string };
}
```

Right side is visually highlighted (dimmed left, accent right). `color` on right drives the accent.

### CalloutSlide

```ts
{
  title?: string;
  subtitle?: string;
  callout: string;             // big text in the box
  attribution?: string;
  icon?: string;               // default "Lightbulb"
  kind?: "insight" | "warning" | "success" | "info";
}
```

### QuoteSlide

```ts
{
  quote: string;
  author: string;
  source?: string;
  accent?: string;             // hex — quote mark + author color
}
```

### TransitionSlide

```ts
{
  title: string;
  subtitle?: string;
  color?: string;              // hex for top bar, should match section color
}
```

### InteractiveSlide

```ts
{
  title?: string;
  subtitle?: string;
  interactiveComponent: "SmsConversation" | "PrerequisiteSetup" | "ArchitectureDiagram";
  interactiveProps: Record<string, unknown>;
  layout?: "centered" | "side-by-side";
}
```

### ArchitectureSlide

```ts
{
  title: string;
  subtitle?: string;
  nodes: DiagramNode[];        // see types.ts
  edges: DiagramEdge[];
  groups?: DiagramGroup[];
  width?: number;              // SVG canvas, default 800
  height?: number;             // default 500
}
```

`DiagramEdge.animated: true` → dashed marching-ants line.

### AboutMeSlide

```ts
{
  name: string;
  role: string;
  company?: string;
  avatar: string;              // path under /public
  bullets?: (string | { text: string; icon?: string })[];
  links?: { label: string; href?: string }[];
}
```

### CodeSlide

```ts
{
  title?: string;
  code: string;
  lang?: string;               // default "typescript"
  steps?: { range: [number, number]; annotation?: string }[];
}
```

Arrow keys step through `steps` (each highlights a line range with an optional label).

### HarnessCloudSlide / HarnessBucketsSlide

```ts
{
  heading: string;
  subheading?: string;         // buckets only
  buckets: { label: string; color: string; chips: string[] }[];
}
```

Cloud = chips scattered/bursting. Buckets = chips gathered into columns. Used as a pair for the "mess → order" beat.

---

## 5. Interactive components

**Location:** `src/components/interactive/`

### SmsConversation

```ts
{
  messages: { sender: "agent" | "candidate"; text: string; delay: number }[];
  autoPlay?: boolean;          // default true
}
```

Phone-frame UI. Typing indicator + delays. Replays when re-entering the slide.

### PrerequisiteSetup

```ts
{
  jobTitle: string;
  jobCompany: string;
  prerequisites: { label: string; type: "eliminatory" | "preferred"; description: string }[];
}
```

Two-column: job card + prerequisite list. "Suggest" button streams items in. Drag-to-reorder.

### ArchitectureDiagram

Same props as `ArchitectureSlide` — SVG diagram with nodes/edges/groups. Normally used via `ArchitectureSlide`, not `InteractiveSlide`.

---

## 6. Icons

**Source:** `src/lib/icon-map.ts` — all from `lucide-react`.

Pass the **name as a string** to any `icon` prop. Unknown names fall back to `null`.

```
Anchor, Activity, AlertTriangle, ArrowRight, Box, Brain, Building2,
CheckCircle2, Code2, Cpu, Database, DollarSign, Eye, GitBranch, Globe,
GraduationCap, Headphones, HelpCircle, Layers, Lightbulb, MapPin,
MessageSquare, Network, Plug, Radio, RotateCw, Shield, Sparkles,
TrendingUp, UserPlus, Users, Workflow, Wrench, Zap
```

To add a new icon: import it in `src/lib/icon-map.ts`, add to the `ICONS` record.

---

## 7. Staged reveal pattern

**Source:** `src/lib/stage-nav-context.tsx`, wired in `NarrativeSlide`.

1. Slide registers handlers via `stageNav.register(slideId, { onNextRequest, onPrevRequest })`.
2. `visibleCount` starts at 1; only first `visibleCount` bullets render.
3. Right arrow → if `visibleCount < bulletCount`, increment + consume keypress; else return `false` so deck advances.
4. Resets to 1 when slide scrolls out of view (re-fires on re-entry).

Only `NarrativeSlide` currently uses `stagedReveal`. `CodeSlide` uses the same stage-nav mechanism for its `steps` array.

---

## 8. Deck infrastructure

`src/components/deck/`

- **`slides-deck.tsx`** — top-level: wraps in `StageNavProvider`, renders `TopNavBar`, horizontal scroll container, progress bar, slide counter.
- **`slide-wrapper.tsx`** — per-slide wrapper: section tint, accent bar, fade-in animation, viewport clipping.
- **`top-nav-bar.tsx`** — fixed header with section pills; desktop shows full label, mobile shows `short`. Click jumps to first slide of that section.

`src/lib/use-slide-nav.ts` — navigation hook: URL hash sync, IntersectionObserver, keyboard (arrows / pageup-pagedown / space). Delegates to stage-nav handlers before advancing.

---

## 9. Common patterns (copy-paste shapes)

### Narrative with bullets + icons

```ts
{
  id: "example",
  title: "My Title",
  section: "intro",
  component: "NarrativeSlide",
  props: {
    bullets: [
      { text: "First point",     icon: "Sparkles" },
      { text: "Second point",    icon: "Zap" },
      { text: "Key insight",     icon: "Brain", highlight: true },
    ],
  },
}
```

### Narrative with code block

```ts
{
  id: "code-example",
  title: "The Code",
  section: "pattern",
  component: "NarrativeSlide",
  props: {
    subtitle: "Here's how it works",
    bullets: [{ text: "Explanation", icon: "Wrench" }],
    code: `const harness = new Harness({ /* ... */ });`,
    codeLang: "typescript",
    codeCaption: "src/harness/factory.ts",
  },
}
```

### Staged reveal

```ts
{
  id: "reveal",
  title: "",
  section: "intro",
  component: "NarrativeSlide",
  props: {
    size: "large",
    stagedReveal: true,
    bullets: [
      { text: "Shown on load",      icon: "Lightbulb" },
      { text: "Revealed on arrow",  icon: "Sparkles" },
      { text: "And another",        icon: "Zap", highlight: true },
    ],
  },
}
```

### Tags

```ts
props: {
  bullets: [{ text: "Main content" }],
  tags: ["state", "tools", "memory"],
  tagsVariant: "accent",   // or "muted"
}
```

### Hero (opener/closer)

```ts
{
  id: "hero",
  title: "2026: The Year of Harnesses",
  subtitle: "How agents become products",
  section: "intro",
  component: "HeroSlide",
  props: {
    badge: "Developer AI.xperience",
    event: { date: "April 9, 2026", location: "Marseille" },
    hosts: "Qalico × Gojob",
  },
}
```

### Section transition

```ts
{
  id: "alpha-transition",
  title: "Alpha",
  subtitle: "The recruiter AI assistant",
  section: "alpha",
  component: "TransitionSlide",
  props: { color: "#10b981" },   // match section color
}
```

---

## 10. File cheat sheet

| task                          | location                                 |
| ----------------------------- | ---------------------------------------- |
| **edit slide content**        | `src/content/slides.ts`                  |
| slide types / section colors  | `src/lib/types.ts`                       |
| component registry            | `src/lib/registry.ts`                    |
| available icons               | `src/lib/icon-map.ts`                    |
| stage-reveal context          | `src/lib/stage-nav-context.tsx`          |
| deck nav hook                 | `src/lib/use-slide-nav.ts`               |
| add new slide component       | `src/components/slides/` → register in `registry.ts` |
| add interactive component     | `src/components/interactive/` → register in `interactive-slide.tsx` |
| deck scaffolding              | `src/components/deck/`                   |
| page mount                    | `src/app/page.tsx`                       |

---

## 11. Workflow tips

- **Edit `slides.ts` directly.** Don't refactor slide shapes unless the type needs it — the registry pattern means a new component requires two files (new slide file + registry entry).
- **Verify icon names.** Unknown icons silently render as `null`. If an icon doesn't show, check `icon-map.ts`.
- **Section colors are load-bearing.** `TransitionSlide.color` should match the section's color from the table in §2.
- **`title: ""` is valid** for slides that use only staged bullets or custom layouts (see `hook-realization`, `harness-cloud`).
- **Run `pnpm lint` after edits** to catch typos in component names before they reach the browser.
