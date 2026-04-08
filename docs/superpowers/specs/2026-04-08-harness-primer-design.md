# Harness Primer — Design Spec

**Date:** 2026-04-08
**Talk:** *2026: The Year of Harnesses* — Marseille, April 9 2026
**Scope:** Replace the current intro paradigm slide with a 3-slide narrative primer that defines a harness from first principles, applied to product agents (not coding agents). Rework the hook slide for clarity.

## Why

The current intro asserts the talk's title (*The Year of Harnesses*) but does not give the audience a working definition until 20 slides later, in The Pattern section. This forces the Alpha and SaaS case studies to land before the audience knows what a harness is — they spend the first 8 minutes waiting for the term to be defined.

The current slide 4 (*Harness Engineering — three years, three paradigms*) does paradigm-shift framing instead of definition, which compounds the problem. The audience leaves the intro with a vibe, not a concept.

The fix: a short, fast, narrative primer that earns the title within the first 5 minutes. The primer is modeled on the Mastra harness workshop's intro (*Models are powerful → can't... → harness → lot of things → primitive for each*), adapted for **product agents** rather than coding agents. The audience leaves the primer with three things:

1. A working definition of *harness*.
2. A name for the discipline: *harness engineering*.
3. The promise that every product is about to be built around one.

After the primer, the rest of the talk (Alpha → SaaS → In-App Agent → The Pattern → The Vision) becomes a tour of the discipline in action, not a discovery arc.

## Scope

**In scope:**
- Rework slide 3 (the hook).
- Replace slide 4 (paradigm shift) with **3 new slides** forming the primer.
- Add a new slide component, `HarnessCloudSlide`, for the climax.
- Add a small **stage interception** mechanism to the deck so any slide can advance internal stages on next/prev key presses.
- Extend `NarrativeSlide` with an optional `tags?: string[]` prop for inline pill rows.

**Explicitly out of scope (deferred):**
- Trimming The Pattern section to compensate for +2 slides. Decision deferred until after the primer ships and is rehearsed.
- Updating `knowledge-base/05-harness-engineering-trend.md` and `knowledge-base/09-harness-pattern-anatomy.md` to match the new framing. Follow-up pass after slide work.
- CSS bugs the user mentioned in passing (cropped shadow on about-me, transient scrollbar flicker between slides 2 and 3). Tracked separately, not part of this spec.

## Structure — what changes in the deck

The intro section becomes a 6-slide opening act:

| # | Slide id | Status | Section |
|---|---|---|---|
| 1 | `hero` | unchanged | intro |
| 2 | `about-me` | unchanged | intro |
| 3 | `hook` | **reworked** | intro |
| 4 | `models-are-powerful` | **NEW** | intro |
| 5 | `wrap-in-harness` | **NEW** | intro |
| 6 | `harness-cloud` | **NEW** (new component) | intro |
| 7+ | Alpha onwards | unchanged | alpha → vision |

The current slide 4 (`harness-engineering` — three years, three paradigms, with the `latent.space` quote) is **removed**. Its content is subsumed by the new primer.

Net delta: **+2 slides** in the intro section.

## Slide content

### Slide 3 — `hook` (reworked)

**Component:** `NarrativeSlide` (existing, no code changes).

The question goes in the **top-level `title`** because the deck (`slides-deck.tsx` line 34) always pulls `title` and `subtitle` from the top level of the `Slide` object, and `title` is the largest text on the slide. The question SHOULD dominate visually — putting it in `title` is exactly the right spot.

```ts
{
  id: "hook",
  title: "Who here uses Claude Code, Codex, or another coding agent every day?",
  section: "intro",
  component: "NarrativeSlide",
  props: {
    size: "large",
    bullets: [
      {
        text: "You're not just using an AI assistant.",
        icon: "Sparkles",
      },
      {
        text: "You're using a harness — agent loop, state, tools, memory, skills, UI.",
        icon: "Workflow",
        highlight: true,
      },
      {
        text: "And in the next 25 minutes, you'll see why every product is about to be built around one.",
        icon: "Zap",
      },
    ],
  },
}
```

**Why this works:** The question becomes the visual hero (rendered at `text-4xl md:text-6xl lg:text-7xl` in `large` mode, will wrap to 2-3 lines for impact). The three bullets render below as the punchline cascade. The third bullet replaces the vague *"this same pattern"* with a concrete forward-promise that ties back to the talk title.

### Slide 4 — `models-are-powerful` (NEW)

**Component:** `NarrativeSlide` (existing, with new optional `tags?: string[]` and `tagsVariant?` props).

```ts
{
  id: "models-are-powerful",
  title: "Models are powerful.",
  section: "intro",
  component: "NarrativeSlide",
  props: {
    size: "large",
    bullets: [
      {
        text: "But raw, they can't run inside your product.",
        highlight: true,
      },
    ],
    tags: [
      "no state",
      "no tools",
      "no user memory",
      "no streaming UI",
      "no multi-tenant safety",
    ],
    tagsVariant: "muted",
  },
}
```

**Visual treatment:** "Models are powerful." renders as the XL h2 (top-level title). Single highlighted bullet beneath delivers the contrast. The `tags` row renders as small muted text chips below the bullet — visually subordinate, hinting at the cloud that arrives on slide 6. The "no X" framing earns slide 5's reveal.

### Slide 5 — `wrap-in-harness` (NEW)

**Component:** `NarrativeSlide` (existing, with `tags?` prop).

```ts
{
  id: "wrap-in-harness",
  title: "So we wrap them in a harness.",
  section: "intro",
  component: "NarrativeSlide",
  props: {
    size: "large",
    bullets: [
      {
        text: "The layer that gives the model what it can't do alone — orchestrated, observable, in-product.",
        icon: "Workflow",
      },
    ],
    tags: [
      "state",
      "tools",
      "flow",
      "memory",
      "UI",
      "reliability",
      "lifecycle",
    ],
    tagsVariant: "accent",
  },
}
```

**Visual treatment:** "So we wrap them in a harness." renders as the XL h2 (top-level title), matching slide 4's pattern. The 7 capability pills foreshadow the 7 buckets that appear on slide 6 — same labels, same order, same colors. Visual call-and-response: the 5 "no X" chips on slide 4 become the 7 pills on slide 5 ("here's what's missing → here's what fills the gap"). Pills here are accent-colored (not muted) to signal resolution. On slide 6 the same labels return as bucket headers above the chip grid, completing the foreshadowing.

### Slide 6 — `harness-cloud` (NEW — the climax)

**Component:** `HarnessCloudSlide` (new — see Components section).

```ts
{
  id: "harness-cloud",
  title: "",
  section: "intro",
  component: "HarnessCloudSlide",
  props: {
    stage1Heading: "And a harness is a lot of things.",
    stage2Heading: "Tweaking all of this is harness engineering.",
    stage2Subtitle: "And 2026 is the year we get serious about it.",
    buckets: [
      {
        label: "State",
        color: "#6366f1",
        chips: ["typed schema", "multi-tenant filter", "partial JSON", "single source of truth"],
      },
      {
        label: "Tools = features",
        color: "#8b5cf6",
        chips: ["input validation", "permission checks", "idempotency", "audit log"],
      },
      {
        label: "Flow",
        color: "#ec4899",
        chips: ["modes", "phase-aware prompts", "multi-round", "pause/resume"],
      },
      {
        label: "Memory",
        color: "#10b981",
        chips: ["thread persistence", "user facts", "embeddings cache", "observational memory"],
      },
      {
        label: "UI",
        color: "#06b6d4",
        chips: ["event subscribe", "optimistic UI", "thinking indicators"],
      },
      {
        label: "Reliability",
        color: "#f59e0b",
        chips: ["token budgets", "retries", "error classification", "provider fallback"],
      },
      {
        label: "Lifecycle",
        color: "#f43f5e",
        chips: ["rate limits", "prompt caching", "evals in production"],
      },
    ],
  },
}
```

**Total chips:** 26 across 7 buckets.

**Note on bucket colors:** The seven bucket colors intentionally echo the section colors of the rest of the talk (Alpha green, SaaS amber, Pattern purple, Vision rose, etc.) plus two additional accent colors. This creates a quiet visual continuity — each bucket "belongs" to a part of the talk that will expand on it. The audience won't consciously notice during slide 6, but the recurrence on later slides reinforces the structure.

**Behavior:**

*Stage 1 (on enter):*
- Heading reads `stage1Heading`.
- All 26 chips drift in from random edge positions over ~1.5s.
- Once visible, chips have a gentle Y-axis float animation (~8s loop) to feel alive and overwhelming.
- Chips are color-coded by bucket but visually mixed across the viewport — *the audience cannot see the structure yet*.

*Stage 2 (on right-arrow press):*
- Heading crossfades to `stage2Heading`.
- `stage2Subtitle` fades in beneath.
- Each chip animates from its random position to its bucket-grouped grid position via Framer Motion `layoutId` morph.
- Bucket labels fade in above each column.
- The 7-column grid (or responsive wrap on smaller viewports) makes the structure legible.

This is the talk's first emotional climax. The audience feels the overwhelm, then the discipline name lands — *"oh, this has a name now."*

## Components

### Existing — `NarrativeSlide` extension

Two new optional props. **No change to title rendering** — slides 3, 4, 5 put their focal statement in the top-level `Slide.title`, which the deck passes through (`slides-deck.tsx` line 34), so the existing h2 rendering is exactly what we want.

**1. Add `tags?: string[]`** — when present, renders a horizontal row of small text chips below the bullets.

**2. Add `tagsVariant?: "muted" | "accent"`** — controls chip styling (default `"muted"`).

Variants:
- `muted` — small, grey, low contrast. Used on slide 4 (problems framing).
- `accent` — accent-colored pills with borders. Used on slide 5 (capabilities framing).

**Verified assumptions** (already supported, no change needed):
- `size: "default" | "large"` — slides 3, 4, 5 use `"large"`.
- `title: string` — comes from `Slide.title` at the top level via the deck's prop pass-through.
- `bullets?: Bullet[]` where `Bullet` is `string | { text, icon?, highlight? }` — already supported.

**Estimated change:** ~20 lines in `src/components/slides/narrative-slide.tsx` (the `tags` row rendering, plus a few lines added to the `Props` type). No change to `src/lib/types.ts` since `Slide.props` is `Record<string, unknown>` (loose).

### New — `HarnessCloudSlide`

**File:** `src/components/slides/harness-cloud-slide.tsx`

**Purpose:** Render the two-stage chip cloud → grid climax. One responsibility, one file. ~150–200 lines.

**Props (TypeScript):**
```ts
type HarnessCloudSlideProps = {
  stage1Heading: string;
  stage2Heading: string;
  stage2Subtitle: string;
  buckets: Array<{
    label: string;
    color: string;
    chips: string[];
  }>;
};
```

**Internal state:**
- `stage: 1 | 2` — local React state. Resets to `1` on `whileInView` re-fire (consistent with the deck's existing `viewport once: false` pattern).

**Animation:**
- Each chip is a Framer Motion `motion.div` with a stable `layoutId` (e.g. `chip-${bucketIdx}-${chipIdx}`).
- Stage 1 positions: pre-computed random `(x, y)` percentages avoiding the center 30%–70% band so the heading text stays readable. Float animation runs only in Stage 1.
- Stage 2 positions: CSS Grid layout, 7 columns on desktop, responsive wrap on mobile. `layoutId` makes Framer Motion morph each chip from its Stage 1 position to its Stage 2 grid cell automatically.

**Stage advancement:** the slide registers an `onNextRequest` and `onPrevRequest` interceptor with the deck via the new `useStageNav()` context (see below). On next-arrow:
- If `stage === 1`, set `stage = 2` and return `true` (consumed).
- If `stage === 2`, return `false` (let the deck advance to the next slide).
- On prev-arrow, mirror behavior in reverse.

**Registry:** add `HarnessCloudSlide` to `src/lib/registry.ts`.

**Type union:** add `"HarnessCloudSlide"` to the `Slide["component"]` union in `src/lib/types.ts`.

### New — Stage Nav mechanism in the deck

**Goal:** Let any slide intercept next/prev key presses to advance internal stages before the deck advances slides. Generalizes beyond `HarnessCloudSlide` — any future slide can opt in.

**Files touched:**
- `src/components/deck/slides-deck.tsx` — provide a React context with `register/unregister` functions.
- `src/lib/use-slide-nav.ts` — call the active slide's interceptor before triggering scroll-to-next/prev.

**Context shape:**
```ts
type StageNavContext = {
  register: (slideId: string, handlers: {
    onNextRequest?: () => boolean;  // return true if consumed
    onPrevRequest?: () => boolean;  // return true if consumed
  }) => void;
  unregister: (slideId: string) => void;
};

const StageNavContext = createContext<StageNavContext | null>(null);
const useStageNav = () => useContext(StageNavContext);
```

**Provider implementation in `slides-deck.tsx`:**
- Maintains a `Map<string, Handlers>` in a ref (avoid re-renders on register).
- Exposes `register(id, handlers)` and `unregister(id)` via context value.

**Interception in `use-slide-nav.ts`:**
- Before `goToNext()` triggers a scroll, check `interceptors.get(activeSlideId)?.onNextRequest?.()`. If it returns `true`, abort the scroll.
- Same for `goToPrev()`.
- Backward compatible: slides without an interceptor get default behavior.

**Slide-side usage:**
```ts
const stageNav = useStageNav();
useEffect(() => {
  if (!stageNav) return;
  stageNav.register("harness-cloud", {
    onNextRequest: () => {
      if (stage === 1) {
        setStage(2);
        return true;
      }
      return false;
    },
    onPrevRequest: () => {
      if (stage === 2) {
        setStage(1);
        return true;
      }
      return false;
    },
  });
  return () => stageNav.unregister("harness-cloud");
}, [stage, stageNav]);
```

**Estimated change:** ~30 lines across `slides-deck.tsx` and `use-slide-nav.ts`.

## Data flow

```
slides.ts (data)
   │
   ▼
SlidesDeck (provides StageNavContext, owns active slide index)
   │
   ▼
SlideWrapper (registry-mapped)
   │
   ▼
NarrativeSlide / HarnessCloudSlide
   │           │
   │           └── useStageNav().register(...)
   │                   ▲
   │                   │ on next/prev key, deck calls interceptor first
   │
   └── reads props, renders content
```

## Error handling and edge cases

- **Reduced motion:** the chip drift / float / morph animations should respect `prefers-reduced-motion`. In that case, Stage 1 chips appear in static random positions, and Stage 2 morph becomes an instant snap. Existing slides already follow this pattern via Framer Motion's built-in `useReducedMotion`.
- **Rapid key mashing:** if the user presses next twice in quick succession on Stage 1, the second press should advance to the next slide (after Stage 2 completes its morph). The interceptor returns `true` only when it actually advances state, so the second call (when `stage === 2`) returns `false` and the deck advances normally.
- **Scroll-out reset:** when the slide leaves the viewport, `stage` resets to `1` so the climax re-fires next time. This matches the deck's existing `viewport once: false` pattern.
- **Mobile / no keyboard:** the slide should also accept a tap on the chip area to advance Stage 1 → Stage 2. Consider adding a small `next →` affordance in the corner during Stage 1 for touch users. Optional, decide during implementation.

## Testing

This is a presentation app — no automated tests. Verification is manual:

1. **Slide 3 hook** — open `/`, navigate to slide 3, verify subtitle reads the question, all 3 bullets render, bullet 2 is highlighted.
2. **Slide 4** — verify "Models are powerful" renders XL, the highlighted bullet appears, the 5 muted "no X" chips render below.
3. **Slide 5** — verify "So we wrap them in a harness" renders XL, the bullet appears, the 6 accent-colored capability pills render below.
4. **Slide 6 — Stage 1** — verify chips drift in from edges, chips are visible, heading reads "And a harness is a lot of things."
5. **Slide 6 — Stage 2 transition** — press right arrow. Verify chips animate to grid positions, heading swaps, subtitle fades in, bucket labels appear above columns.
6. **Slide 6 — Stage 2 → next slide** — press right arrow again. Verify deck advances to slide 7 (Alpha transition).
7. **Slide 6 — reverse symmetry** — from Stage 2, press left arrow. Verify chips morph back to cloud, heading reverts. Press left again, verify deck goes back to slide 5.
8. **Scroll-out reset** — scroll to slide 7 then back to slide 6. Verify chips re-fire from Stage 1.
9. **Reduced motion** — enable `prefers-reduced-motion` in browser devtools, repeat steps 4-7. Verify animations are instant.
10. **Mobile / responsive** — test on a narrow viewport. Verify chip cloud doesn't overflow, grid wraps gracefully.
11. **Build + deploy** — `pnpm build` succeeds, no TypeScript errors, deploy to Vercel preview.

## Open follow-ups (after this spec ships)

1. **Slide budget** — after rehearsing the new opening, decide whether to trim 2 slides from The Pattern section to compensate for the +2 net delta. Candidates: merge `typed-state` + `tools-as-features`, drop `multi-round`. Decision deferred until the primer is on screen.
2. **Knowledge base cleanup** — update `knowledge-base/05-harness-engineering-trend.md` and `knowledge-base/09-harness-pattern-anatomy.md` to reflect the new 5-beat framing and the new "wraps the model" definition (no operating-system metaphor — that was discussed and dropped during this brainstorm). Self-consistency for the future Q&A agent.
3. **CSS bugs** noted in passing during this conversation:
   - About-me slide image shadow is cropped on the right edge.
   - Transient vertical scrollbar flicker on the slide 3 viewport during slide 2 → slide 3 transition.
   Track and fix in a separate small pass.

4. **Latent deck prop-spread bug** — `slides-deck.tsx` line 34 reads:
   ```tsx
   <Component {...slide.props} title={slide.title} subtitle={slide.subtitle} />
   ```
   Because explicit JSX props take precedence over spread, any slide that puts `subtitle` in its `props` object (rather than at the top level of the `Slide`) will have its `subtitle` overwritten with `undefined` from the unset top-level `slide.subtitle`. Several existing slides do this (`harness-engineering`, `what-is-gojob`, `alpha-intro`, etc.) and may not be rendering their subtitles at all on the live site. Worth a quick audit.

   This spec works around the issue by putting all focal text at the top level of the `Slide`, so the new primer slides are unaffected. But the existing slides should be checked.
