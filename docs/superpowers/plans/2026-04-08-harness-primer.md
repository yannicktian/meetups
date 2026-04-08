# Harness Primer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current paradigm-shift slide with a 3-slide harness primer (preceded by a reworked hook), so the talk earns its title within the first 5 minutes.

**Architecture:** All content lives in `src/content/slides.ts`. Two of the three new slides reuse `NarrativeSlide` with a small extension (`tags` + `tagsVariant` props). The third — the chip-cloud → bucket-grid climax — is a new `HarnessCloudSlide` component that uses a new stage-interception mechanism in the deck so it can advance its own internal stages on right/left arrows before the deck moves between slides.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind 4, Framer Motion (for the chip morph with `layoutId`), Lucide React icons.

**Spec:** `docs/superpowers/specs/2026-04-08-harness-primer-design.md` (commit `a78e916`).

**Testing note:** This is a presentation app with **no automated test infrastructure**. The standard TDD loop (write failing test → implement → test passes) does not apply here. Instead, each task uses manual verification via `pnpm build`, `pnpm lint`, and browser walkthrough at `pnpm dev`. The spec's Testing section lists the 11 manual verification steps that gate completion.

---

## Preflight — Resolve the existing staged change

Before touching `slides.ts`, the repo has a pre-existing staged change (`src/content/slides.ts` — 286 insertions, 68 deletions) that is unrelated to this plan. Do not silently bundle it with our commits.

- [ ] **Step 0.1: Check with the user about the staged change**

Run: `git diff --cached src/content/slides.ts | head -80`

Ask the user one of three things:
- "Is this staged change finished — want me to commit it first as a separate commit?"
- "Want me to stash it and reapply after this work is done?"
- "Should we integrate it with our changes and commit everything together at the end?"

Do **not** proceed to Task 1 until this is resolved.

- [ ] **Step 0.2: Verify current working tree is clean apart from the known staged change**

Run: `git status`
Expected: only `modified: src/content/slides.ts` staged, and `docs/superpowers/plans/2026-04-08-harness-primer.md` untracked (this file). No unexpected unstaged modifications.

If the working tree has other unexplained changes, stop and ask.

---

## File Structure

### Files to create

| Path | Responsibility |
|---|---|
| `src/lib/stage-nav-context.tsx` | React context + provider for slides to register `onNextRequest`/`onPrevRequest` interceptors. Lets a slide advance its own internal stages on arrow-key presses before the deck moves to the next slide. |
| `src/components/slides/harness-cloud-slide.tsx` | The chip-cloud → bucket-grid climax slide. One responsibility: the two-stage animation. ~180-220 lines. |

### Files to modify

| Path | What changes |
|---|---|
| `src/components/slides/narrative-slide.tsx` | Add `tags?: string[]` and `tagsVariant?: "muted" \| "accent"` optional props. Render the chip row below bullets when `tags` is present. |
| `src/components/deck/slides-deck.tsx` | Wrap the existing content in `<StageNavProvider>`. Split into outer `SlidesDeck` (provides context) and inner `SlidesDeckInner` (consumes it + calls `useSlideNav`). |
| `src/lib/use-slide-nav.ts` | Inside the `onKeyDown` keyboard handler, call `stageNav?.getHandlers(activeSlideId)?.onNextRequest?.()` before `goTo(currentIndex + 1)`. If it returns `true`, bail out. Same for prev. |
| `src/lib/registry.ts` | Import and register `HarnessCloudSlide`. |
| `src/content/slides.ts` | Rework slide 3 (`hook`), remove old slide 4 (`harness-engineering`), add three new slides (`models-are-powerful`, `wrap-in-harness`, `harness-cloud`). |

### Files NOT touched

- `src/lib/types.ts` — `Slide.props` is `Record<string, unknown>` (loose), so no type union update is needed for the new component.
- Everything under `src/components/slides/` except `narrative-slide.tsx` and the new `harness-cloud-slide.tsx`.
- All knowledge base files (follow-up work, not this plan).

---

## Task 1: Extend `NarrativeSlide` with `tags` and `tagsVariant` props

**Why first:** Slides 4 and 5 in the new primer depend on this extension. Doing it first means slides 4 and 5 can be added in a single pass in Task 5.

**Files:**
- Modify: `src/components/slides/narrative-slide.tsx`

- [ ] **Step 1.1: Read the current state of `narrative-slide.tsx`**

Run: use the Read tool on `src/components/slides/narrative-slide.tsx` to confirm the current Props shape matches what the spec assumed (the spec documented it, but always verify after reading the file).

Expected shape (verified in spec):
```ts
type Size = "default" | "large";
type Bullet = string | { text: string; icon?: string; highlight?: boolean };
type Props = {
  title: string;
  subtitle?: string;
  bullets?: Bullet[];
  children?: React.ReactNode;
  reversed?: boolean;
  code?: string;
  codeLang?: string;
  codeCaption?: string;
  size?: Size;
};
```

- [ ] **Step 1.2: Extend the `Props` type**

Add two optional props to the existing `Props` type:

```ts
type TagsVariant = "muted" | "accent";

type Props = {
  title: string;
  subtitle?: string;
  bullets?: Bullet[];
  children?: React.ReactNode;
  reversed?: boolean;
  code?: string;
  codeLang?: string;
  codeCaption?: string;
  size?: Size;
  tags?: string[];
  tagsVariant?: TagsVariant;
};
```

And add `tags`, `tagsVariant = "muted"` to the destructured function parameters.

- [ ] **Step 1.3: Render the tags row below bullets**

Inside the component JSX, immediately after the `</ul>` closing tag of the bullets block (line ~148), add a conditional tags row:

```tsx
{tags && tags.length > 0 && (
  <motion.div
    className={`flex flex-wrap gap-2 mt-5 ${
      tagsVariant === "accent" ? "gap-3" : ""
    }`}
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={VIEWPORT}
    transition={{ delay: 0.5 }}
  >
    {tags.map((tag, i) => (
      <motion.span
        key={tag}
        className={
          tagsVariant === "accent"
            ? "inline-flex items-center px-3 py-1.5 rounded-full border border-[var(--accent)] bg-[var(--accent-soft)] text-sm md:text-base font-medium text-[var(--accent)]"
            : "inline-flex items-center px-2.5 py-1 rounded-md bg-[var(--bg-surface-alt)] text-xs md:text-sm text-[var(--text-muted)] font-mono"
        }
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={VIEWPORT}
        transition={{ delay: 0.55 + i * 0.04, duration: 0.3 }}
      >
        {tag}
      </motion.span>
    ))}
  </motion.div>
)}
```

Place it inside the text-side `<div>` block so the tags land in the same column as the bullets.

- [ ] **Step 1.4: Run lint and build to verify no regressions**

Run: `pnpm lint && pnpm build`
Expected: both commands exit 0. No TypeScript errors, no ESLint errors.

- [ ] **Step 1.5: Manual smoke test — temporarily decorate an existing slide**

Open `src/content/slides.ts`. Temporarily add `tags: ["test-chip-a", "test-chip-b"]` and `tagsVariant: "muted"` to the `what-is-gojob` slide's `props` (any NarrativeSlide works). Run `pnpm dev`, navigate to that slide, verify the chips appear below the bullets in the correct position and muted styling.

Then change `tagsVariant: "muted"` to `tagsVariant: "accent"`, refresh, verify the accent styling is applied (accent-colored rounded pills with borders).

**Revert the temporary change** — remove both `tags` and `tagsVariant` from `what-is-gojob` before committing.

- [ ] **Step 1.6: Commit**

```bash
git add src/components/slides/narrative-slide.tsx
git commit -m "feat(slides): add tags + tagsVariant props to NarrativeSlide"
```

Note: because `slides.ts` has a pre-existing staged change, use `git add` on the specific file only. Do **not** use `git add .` or `git add -A`.

Run `git status` after the commit to verify the staged `slides.ts` change is still in the index untouched.

---

## Task 2: Create the stage nav context and wire it into the deck

**Why second:** `HarnessCloudSlide` in Task 3 depends on `useStageNav()` existing. Building it here first means Task 3 can be self-contained.

**Files:**
- Create: `src/lib/stage-nav-context.tsx`
- Modify: `src/components/deck/slides-deck.tsx`
- Modify: `src/lib/use-slide-nav.ts`

- [ ] **Step 2.1: Create `src/lib/stage-nav-context.tsx`**

```tsx
"use client";

import { createContext, useCallback, useContext, useRef, type ReactNode } from "react";

export type StageNavHandlers = {
  /** Called when the user requests "next slide". Return true if the slide
   * handled the press internally (e.g. advanced to the next stage) and the
   * deck should stay put. Return false to let the deck advance normally. */
  onNextRequest?: () => boolean;
  /** Symmetric — return true to consume the prev press, false to let the
   * deck move back a slide. */
  onPrevRequest?: () => boolean;
};

type StageNavContextValue = {
  register: (slideId: string, handlers: StageNavHandlers) => void;
  unregister: (slideId: string) => void;
  getHandlers: (slideId: string) => StageNavHandlers | undefined;
};

const StageNavContext = createContext<StageNavContextValue | null>(null);

/** Provider for the stage-nav mechanism. Lets slides register interceptors
 * for the deck's next/prev key presses so they can advance internal stages
 * before the deck moves to the next slide.
 *
 * Intentional: handlers live in a ref (not state) so registering does not
 * re-render the tree. The key handler in use-slide-nav reads the ref at
 * press time, so the most recently registered handler always wins.
 */
export function StageNavProvider({ children }: { children: ReactNode }) {
  const handlersRef = useRef<Map<string, StageNavHandlers>>(new Map());

  const register = useCallback((slideId: string, handlers: StageNavHandlers) => {
    handlersRef.current.set(slideId, handlers);
  }, []);

  const unregister = useCallback((slideId: string) => {
    handlersRef.current.delete(slideId);
  }, []);

  const getHandlers = useCallback((slideId: string) => {
    return handlersRef.current.get(slideId);
  }, []);

  return (
    <StageNavContext.Provider value={{ register, unregister, getHandlers }}>
      {children}
    </StageNavContext.Provider>
  );
}

/** Returns the stage-nav context. Returns null if not inside a provider
 * (slides outside a StageNavProvider still work — they just can't
 * intercept nav). */
export function useStageNav() {
  return useContext(StageNavContext);
}
```

- [ ] **Step 2.2: Wrap `SlidesDeck` with `StageNavProvider`**

In `src/components/deck/slides-deck.tsx`, split the current `SlidesDeck` into an outer provider shell and an inner component that consumes the context. The current file looks like:

```tsx
"use client";

import { useSlideNav } from "@/lib/use-slide-nav";
import { SlideWrapper } from "./slide-wrapper";
import { TopNavBar } from "./top-nav-bar";
import { registry } from "@/lib/registry";
import type { Slide } from "@/lib/types";

type Props = {
  slides: Slide[];
};

export function SlidesDeck({ slides }: Props) {
  const { currentIndex, total, currentSection, goToSection } = useSlideNav(slides);
  // ... JSX
}
```

Rewrite it as:

```tsx
"use client";

import { useSlideNav } from "@/lib/use-slide-nav";
import { SlideWrapper } from "./slide-wrapper";
import { TopNavBar } from "./top-nav-bar";
import { registry } from "@/lib/registry";
import { StageNavProvider } from "@/lib/stage-nav-context";
import type { Slide } from "@/lib/types";

type Props = {
  slides: Slide[];
};

export function SlidesDeck({ slides }: Props) {
  return (
    <StageNavProvider>
      <SlidesDeckInner slides={slides} />
    </StageNavProvider>
  );
}

function SlidesDeckInner({ slides }: Props) {
  const { currentIndex, total, currentSection, goToSection } = useSlideNav(slides);

  return (
    <>
      {/* Top navigation bar */}
      <TopNavBar currentSection={currentSection} onSectionClickAction={goToSection} />

      {/* Horizontal scroll container */}
      <main className="slides-deck-container h-screen w-screen overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex flex-row">
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

      {/* Progress bar at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-[var(--bg-surface-alt)] z-50">
        <div
          className="h-full bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>

      {/* Slide counter */}
      <div className="fixed bottom-3 right-6 text-xs text-[var(--text-muted)] font-mono z-50 bg-white/80 backdrop-blur px-2 py-1 rounded-md border border-[var(--border)]">
        {currentIndex + 1} / {total}
      </div>
    </>
  );
}
```

The move from `SlidesDeck` to `SlidesDeckInner` is what lets `useSlideNav` (called inside `SlidesDeckInner`) consume a context that `SlidesDeck` provides.

- [ ] **Step 2.3: Wire the interceptor check into `use-slide-nav.ts`**

In `src/lib/use-slide-nav.ts`, import `useStageNav` and consume it at the top of the hook. Then modify the `onKeyDown` keyboard handler to check for an interceptor before calling `goTo`.

Add at the top of the file:

```ts
import { useStageNav } from "./stage-nav-context";
```

Inside `useSlideNav`, after the existing `useState` / `useEffect` hooks, add:

```ts
const stageNav = useStageNav();
```

Then modify the `onKeyDown` handler inside the keyboard `useEffect` (around line 69). The current handler looks like:

```ts
function onKeyDown(e: KeyboardEvent) {
  const target = e.target as HTMLElement;
  if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;

  if (
    e.key === "ArrowRight" ||
    e.key === " " ||
    e.key === "PageDown" ||
    e.key === "ArrowDown"
  ) {
    e.preventDefault();
    goTo(currentIndex + 1);
  } else if (
    e.key === "ArrowLeft" ||
    e.key === "PageUp" ||
    e.key === "ArrowUp" ||
    (e.key === " " && e.shiftKey)
  ) {
    e.preventDefault();
    goTo(currentIndex - 1);
  } else if (e.key === "Home") {
    e.preventDefault();
    goTo(0);
  } else if (e.key === "End") {
    e.preventDefault();
    goTo(slides.length - 1);
  }
}
```

Replace the two branches (next and prev) with interceptor-aware versions. Leave Home/End untouched. The final handler:

```ts
function onKeyDown(e: KeyboardEvent) {
  const target = e.target as HTMLElement;
  if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;

  const activeSlideId = slides[currentIndex]?.id;
  const stageHandlers = activeSlideId ? stageNav?.getHandlers(activeSlideId) : undefined;

  const isNextKey =
    e.key === "ArrowRight" ||
    e.key === "PageDown" ||
    e.key === "ArrowDown" ||
    (e.key === " " && !e.shiftKey);

  const isPrevKey =
    e.key === "ArrowLeft" ||
    e.key === "PageUp" ||
    e.key === "ArrowUp" ||
    (e.key === " " && e.shiftKey);

  if (isNextKey) {
    e.preventDefault();
    // Give the active slide a chance to consume the press first.
    if (stageHandlers?.onNextRequest?.()) return;
    goTo(currentIndex + 1);
  } else if (isPrevKey) {
    e.preventDefault();
    if (stageHandlers?.onPrevRequest?.()) return;
    goTo(currentIndex - 1);
  } else if (e.key === "Home") {
    e.preventDefault();
    goTo(0);
  } else if (e.key === "End") {
    e.preventDefault();
    goTo(slides.length - 1);
  }
}
```

Note two things:
1. The original handler had `e.key === " "` in **both** the next and prev branches, with the prev branch additionally checking `e.shiftKey`. Because the next branch was checked first, plain Space went next. I've made this explicit: the next branch checks `!e.shiftKey` for Space, and the prev branch checks `e.shiftKey`. Same behavior, clearer code.
2. The `slides` dependency is already in the effect's dependency array. Add `stageNav` too — the effect's dep array must include `[currentIndex, goTo, slides.length, slides, stageNav]`. Update the array on line 101.

- [ ] **Step 2.4: Run lint and build**

Run: `pnpm lint && pnpm build`
Expected: both exit 0.

- [ ] **Step 2.5: Manual regression test — verify existing navigation still works**

Run `pnpm dev`, open `http://localhost:3000`. Without any new slides yet:
- Press Right arrow — advances through slides as before.
- Press Left arrow — goes back.
- Press Space — advances.
- Press Shift+Space — goes back.
- Press Home — jumps to slide 1.
- Press End — jumps to last slide.
- Click a section pill in the top nav — instant jump, unchanged.

All should behave exactly as before. The stage nav mechanism is a no-op for existing slides because none of them register an interceptor.

- [ ] **Step 2.6: Commit**

```bash
git add src/lib/stage-nav-context.tsx src/components/deck/slides-deck.tsx src/lib/use-slide-nav.ts
git commit -m "feat(deck): add stage-nav interception for multi-stage slides"
```

Run `git status` afterwards to confirm the pre-existing `slides.ts` change is still untouched.

---

## Task 3: Create `HarnessCloudSlide`

**Why third:** Needs Tasks 1 and 2 done (uses `useStageNav` from Task 2; does not use `NarrativeSlide` extensions from Task 1, but Task 1 comes first because it's simpler).

**Files:**
- Create: `src/components/slides/harness-cloud-slide.tsx`

- [ ] **Step 3.1: Create the file skeleton with types and props**

Create `src/components/slides/harness-cloud-slide.tsx`:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useStageNav } from "@/lib/stage-nav-context";

const VIEWPORT = { once: false, amount: 0.3 } as const;

type Bucket = {
  label: string;
  color: string;
  chips: string[];
};

type Props = {
  stage1Heading: string;
  stage2Heading: string;
  stage2Subtitle: string;
  buckets: Bucket[];
};

/** Two-stage chip-cloud → bucket-grid slide.
 *
 * Stage 1: chips drift in from random edge positions, heading reads
 *          `stage1Heading`.
 * Stage 2: chips animate into a structured grid grouped by bucket,
 *          heading crossfades to `stage2Heading` + `stage2Subtitle`.
 *
 * The slide registers `onNextRequest` / `onPrevRequest` interceptors
 * with the deck via `useStageNav`, so right/left arrows advance stages
 * before the deck moves slides. Reverse symmetry supported.
 */
export function HarnessCloudSlide({
  stage1Heading,
  stage2Heading,
  stage2Subtitle,
  buckets,
}: Props) {
  // Placeholder — will be filled in next steps.
  return <div>HarnessCloudSlide</div>;
}
```

This intentionally doesn't do anything yet. We'll fill it in step by step.

- [ ] **Step 3.2: Add the stage state and the stage-nav registration**

Replace the placeholder body with:

```tsx
const [stage, setStage] = useState<1 | 2>(1);
const stageNav = useStageNav();
const reducedMotion = useReducedMotion();

// Register stage interceptors so the deck's right/left arrows advance
// stage 1 → stage 2 → next slide, and the reverse.
useEffect(() => {
  if (!stageNav) return;
  const slideId = "harness-cloud";
  stageNav.register(slideId, {
    onNextRequest: () => {
      if (stage === 1) {
        setStage(2);
        return true; // consumed
      }
      return false; // let the deck advance to the next slide
    },
    onPrevRequest: () => {
      if (stage === 2) {
        setStage(1);
        return true;
      }
      return false;
    },
  });
  return () => stageNav.unregister(slideId);
}, [stage, stageNav]);

return <div>TODO</div>;
```

The `stage` dependency on the `useEffect` matters: the handler closes over `stage`, so we must re-register whenever `stage` changes, otherwise the handler keeps checking the stale stage value.

- [ ] **Step 3.3: Pre-compute chip metadata and Stage 1 positions**

Chips need stable `layoutId`s so Framer Motion can morph them between Stage 1 (scattered) and Stage 2 (grid). Their Stage 1 positions are random but must stay fixed across re-renders — use `useMemo`.

Add above the `return` statement:

```tsx
type ChipMeta = {
  id: string;
  label: string;
  color: string;
  bucketIdx: number;
  bucketLabel: string;
  stage1X: number; // percentage
  stage1Y: number; // percentage
  delay: number;
};

const chips = useMemo<ChipMeta[]>(() => {
  // Deterministic LCG so chip positions are stable across renders.
  let seed = 1337;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const all: ChipMeta[] = [];
  buckets.forEach((bucket, bucketIdx) => {
    bucket.chips.forEach((label, chipIdx) => {
      const bandRoll = rand();
      const xRoll = rand();
      const yRoll = rand();

      // Four edge bands: top / bottom / left / right. Keeps the center
      // ~25%-75% region clear so the heading card stays readable.
      let x: number;
      let y: number;
      if (bandRoll < 0.25) {
        // top band
        x = 4 + xRoll * 88;
        y = 3 + yRoll * 14;
      } else if (bandRoll < 0.5) {
        // bottom band
        x = 4 + xRoll * 88;
        y = 80 + yRoll * 17;
      } else if (bandRoll < 0.75) {
        // left band
        x = 2 + xRoll * 20;
        y = 18 + yRoll * 62;
      } else {
        // right band
        x = 74 + xRoll * 22;
        y = 18 + yRoll * 62;
      }

      all.push({
        id: `chip-${bucketIdx}-${chipIdx}`,
        label,
        color: bucket.color,
        bucketIdx,
        bucketLabel: bucket.label,
        stage1X: x,
        stage1Y: y,
        delay: (bucketIdx * 4 + chipIdx) * 0.04,
      });
    });
  });
  return all;
}, [buckets]);
```

The positions are deterministic (LCG with fixed seed) so they stay stable across re-renders, but look random. Chips are placed in one of four edge bands — top, bottom, left, right — keeping the center clear so the heading card stays readable.

- [ ] **Step 3.4: Render Stage 1 (the cloud)**

Replace `return <div>TODO</div>;` with:

```tsx
return (
  <div className="relative w-full min-h-[70vh] flex flex-col items-center justify-center">
    {/* Heading — crossfades between stages */}
    <div className="relative z-10 text-center max-w-3xl mx-auto px-6 py-8 bg-[var(--bg-primary)]/80 backdrop-blur-sm rounded-2xl">
      <motion.h2
        key={stage === 1 ? "h1" : "h2"}
        className="text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] leading-tight"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {stage === 1 ? stage1Heading : stage2Heading}
      </motion.h2>
      {stage === 2 && (
        <motion.p
          className="mt-4 text-lg md:text-xl lg:text-2xl text-[var(--text-secondary)] font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {stage2Subtitle}
        </motion.p>
      )}
    </div>

    {/* Stage 1: scattered chip cloud (absolutely positioned) */}
    {stage === 1 && (
      <div className="absolute inset-0 pointer-events-none">
        {chips.map((chip) => (
          <motion.span
            key={chip.id}
            layoutId={chip.id}
            className="absolute inline-flex items-center px-2.5 py-1 rounded-full text-xs md:text-sm font-mono border whitespace-nowrap"
            style={{
              left: `${chip.stage1X}%`,
              top: `${chip.stage1Y}%`,
              borderColor: `${chip.color}40`,
              color: chip.color,
              background: `${chip.color}0f`,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              ...(reducedMotion ? {} : { y: [0, -6, 0] }),
            }}
            transition={{
              delay: chip.delay,
              duration: 0.4,
              ...(reducedMotion
                ? {}
                : {
                    y: {
                      duration: 6 + ((chip.delay * 10) % 4),
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: chip.delay + 0.4,
                    },
                  }),
            }}
          >
            {chip.label}
          </motion.span>
        ))}
      </div>
    )}

    {/* Stage 2: grid (will be added in the next step) */}
  </div>
);
```

Note the `layoutId` prop on each chip — Framer Motion uses this to track identity across the stage transition, so the same chip morphs from its Stage 1 position to its Stage 2 grid cell automatically.

- [ ] **Step 3.5: Render Stage 2 (the bucket grid)**

Replace the `{/* Stage 2: grid ... */}` comment with the grid:

```tsx
{/* Stage 2: bucket grid */}
{stage === 2 && (
  <div className="relative z-0 w-full max-w-6xl mx-auto mt-8 px-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
    {buckets.map((bucket, bucketIdx) => (
      <motion.div
        key={bucket.label}
        className="flex flex-col gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 + bucketIdx * 0.05, duration: 0.4 }}
      >
        <div
          className="text-xs md:text-sm font-semibold uppercase tracking-wide pb-1 border-b"
          style={{ color: bucket.color, borderColor: `${bucket.color}40` }}
        >
          {bucket.label}
        </div>
        <div className="flex flex-col gap-1.5">
          {bucket.chips.map((chipLabel, chipIdx) => (
            <motion.span
              key={`${bucket.label}-${chipLabel}`}
              layoutId={`chip-${bucketIdx}-${chipIdx}`}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs md:text-sm font-mono border whitespace-nowrap"
              style={{
                borderColor: `${bucket.color}60`,
                color: bucket.color,
                background: `${bucket.color}14`,
              }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
            >
              {chipLabel}
            </motion.span>
          ))}
        </div>
      </motion.div>
    ))}
  </div>
)}
```

Because each grid chip has the same `layoutId` as its Stage 1 counterpart (`chip-${bucketIdx}-${chipIdx}`), Framer Motion automatically animates each chip from its scattered Stage 1 position to its Stage 2 grid cell.

- [ ] **Step 3.6: Handle scroll-out reset**

When the slide leaves the viewport (e.g. the presenter scrolls forward), `stage` should reset to `1` so the climax re-fires the next time the slide comes back into view. Use an `IntersectionObserver` or reuse the existing `useInView` hook.

Add after the existing `useEffect` for stage-nav registration:

```ts
import { useInView } from "@/lib/use-in-view";
// (add this to the imports at the top of the file)
```

Then inside the component:

```ts
// Reset stage to 1 when the slide leaves the viewport
const { ref: viewRef, isInView } = useInView(0.3);

useEffect(() => {
  if (!isInView) {
    setStage(1);
  }
}, [isInView]);
```

And attach `ref={viewRef}` to the outermost wrapping `<div>`:

```tsx
return (
  <div
    ref={viewRef}
    className="relative w-full min-h-[70vh] flex flex-col items-center justify-center"
  >
    ...
```

- [ ] **Step 3.7: Run lint and build**

Run: `pnpm lint && pnpm build`
Expected: both exit 0. If TypeScript complains about `useReducedMotion` or `useInView` imports, double-check the paths (`framer-motion` and `@/lib/use-in-view`).

- [ ] **Step 3.8: Commit**

```bash
git add src/components/slides/harness-cloud-slide.tsx
git commit -m "feat(slides): add HarnessCloudSlide — chip cloud → bucket grid climax"
```

---

## Task 4: Register `HarnessCloudSlide` in the registry

Trivial but required. Without this, `slides.ts` cannot reference the new component.

**Files:**
- Modify: `src/lib/registry.ts`

- [ ] **Step 4.1: Add the import**

At the top of `src/lib/registry.ts`, alongside the other imports:

```ts
import { HarnessCloudSlide } from "@/components/slides/harness-cloud-slide";
```

- [ ] **Step 4.2: Add to the registry map**

Inside the `registry` object, add `HarnessCloudSlide` alongside the other entries:

```ts
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
};
```

- [ ] **Step 4.3: Run build**

Run: `pnpm build`
Expected: exits 0.

- [ ] **Step 4.4: Commit**

```bash
git add src/lib/registry.ts
git commit -m "feat(registry): register HarnessCloudSlide"
```

---

## Task 5: Update `slides.ts` — rework hook, remove old slide 4, add three new slides

**Before starting:** Confirm the preflight step (Step 0.1) was resolved. The pre-existing staged change must be dealt with (committed separately, stashed, or merged into this plan's changes) before this task modifies `slides.ts`.

**Files:**
- Modify: `src/content/slides.ts`

- [ ] **Step 5.1: Rework slide 3 (`hook`)**

Find the existing `hook` slide in `src/content/slides.ts` (around line 50). Replace its entire object with:

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
},
```

Key changes from the current `hook`:
- `title` is now the explicit question (was `"Show of hands"`).
- The `subtitle: "Who here..."` from `props` is gone — the question lives in `title` now. (The `props.subtitle` on the old slide was also getting silently overwritten to `undefined` by the deck's prop spread — see spec's follow-up #4.)
- Bullet 3 replaces the vague `"how this same pattern..."` with a concrete forward-promise.

- [ ] **Step 5.2: Replace the old `harness-engineering` slide with the three primer slides**

Find the existing `harness-engineering` slide (around line 72). Replace its entire object with three new slide objects in this order:

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
},
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
},
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
},
```

Make sure:
- The old `harness-engineering` object is fully deleted (including its `code`, `codeLang`, `codeCaption` strings).
- The three new objects sit between `hook` and the `alpha-transition` slide (which starts the `// ─── ALPHA ───` section).
- No trailing commas issues, no dangling braces.

- [ ] **Step 5.3: Run lint and build**

Run: `pnpm lint && pnpm build`
Expected: both exit 0. If TypeScript complains about `tags`/`tagsVariant` not being on the `props` type, remember that `Slide.props` is `Record<string, unknown>` so this should type-check regardless.

- [ ] **Step 5.4: Run the dev server and walk through the new intro**

Run: `pnpm dev` and open `http://localhost:3000`.

Step through slides 1-7 with right arrow:
1. **Hero** — "2026: The Year of Harnesses", unchanged.
2. **About me** — Yannick bio, unchanged. (Shadow crop deferred.)
3. **Hook** — The question should be the BIG h2 at the top ("Who here uses Claude Code, Codex..."). Three bullets below, bullet 2 highlighted.
4. **Models are powerful.** — "Models are powerful." as the big h2. One highlighted bullet ("But raw, they can't run inside your product."). Five small grey muted chips below: "no state · no tools · no user memory · no streaming UI · no multi-tenant safety".
5. **So we wrap them in a harness.** — Big h2. One bullet about the orchestration layer. Seven accent-colored pill chips below: state · tools · flow · memory · UI · reliability · lifecycle.
6. **harness-cloud** — Stage 1. Heading reads "And a harness is a lot of things." ~26 chips drifting in a cloud around the centered heading.
7. **Alpha transition** — unchanged.

- [ ] **Step 5.5: Verify the stage 1 → stage 2 transition**

From slide 6 (still on Stage 1), press **Right arrow**.

Expected:
- Chips animate from scattered positions into a 7-column grid (2 or 4 columns on smaller viewports).
- Heading crossfades to "Tweaking all of this is harness engineering."
- Subtitle fades in: "And 2026 is the year we get serious about it."
- Bucket labels appear above each column (State, Tools = features, Flow, Memory, UI, Reliability, Lifecycle).
- The deck stays on slide 6 — does NOT advance to Alpha.

Press **Right arrow** again. Expected: deck now advances to slide 7 (Alpha transition).

Press **Left arrow**. Expected: deck goes back to slide 6, but to **Stage 1** (cloud), not Stage 2 — because leaving the viewport reset `stage` to `1`.

Now press **Right arrow** to get back to Stage 2, then press **Left arrow**. Expected: chips morph back into the cloud (Stage 2 → Stage 1), heading reverts. The deck stays on slide 6.

Press **Left arrow** again. Expected: deck goes back to slide 5 (wrap-in-harness).

- [ ] **Step 5.6: Verify reduced-motion fallback**

In Chrome DevTools: `Rendering` panel → `Emulate CSS media feature prefers-reduced-motion` → `reduce`.

Navigate to slide 6. Verify:
- Chips do not drift continuously in Stage 1 (no `y` float loop).
- Stage 1 → Stage 2 transition is near-instant instead of the spring morph.
- All text transitions are instant or very short.

Then re-enable full motion.

- [ ] **Step 5.7: Verify the build still passes**

Run: `pnpm build`
Expected: exits 0 with no warnings about the new slides.

- [ ] **Step 5.8: Commit**

```bash
git add src/content/slides.ts
git commit -m "feat(slides): add harness primer — 3 new intro slides + reworked hook"
```

---

## Task 6: Full end-to-end verification pass

One clean walk through the entire intro section, plus the spec's 11 manual verification steps. Catches anything that slipped past Task 5's checks.

- [ ] **Step 6.1: Run all verification steps from the spec**

Run `pnpm dev` and open `http://localhost:3000`. Execute each of the 11 numbered items in the spec's "Testing" section:

1. **Slide 3 hook** — title shows the question, 3 bullets render, bullet 2 is highlighted. ✓
2. **Slide 4** — "Models are powerful." XL, highlighted bullet, 5 muted chips below. ✓
3. **Slide 5** — "So we wrap them in a harness." XL, bullet, 7 accent pills. ✓
4. **Slide 6 Stage 1** — chips drift in from edges, visible, heading correct. ✓
5. **Slide 6 Stage 2 transition** — right arrow → chips morph to grid, heading swaps, subtitle fades in, bucket labels appear. ✓
6. **Slide 6 Stage 2 → next slide** — right arrow again → advances to Alpha. ✓
7. **Slide 6 reverse symmetry** — from Stage 2, left arrow → chips morph back, heading reverts; left again → goes to slide 5. ✓
8. **Scroll-out reset** — scroll forward to slide 7 then back to slide 6 → chips re-fire Stage 1. ✓
9. **Reduced motion** — `prefers-reduced-motion: reduce` → animations are instant. ✓
10. **Mobile / responsive** — narrow viewport (≤ 768px) → chip cloud doesn't overflow, grid wraps gracefully. ✓
11. **Build** — `pnpm build` succeeds, no TypeScript errors. ✓

Any failure at any step is a blocker. Fix before moving on.

- [ ] **Step 6.2: Visual sanity-check all other sections**

Quickly scroll through the rest of the deck (Alpha → SaaS → In-App Agent → The Pattern → The Vision) and confirm nothing regressed. Animations re-fire on scroll, navigation works, top nav pills work, section counts in the top nav are correct.

- [ ] **Step 6.3: Commit any fixes**

If Step 6.1 or 6.2 surfaced any fixes, commit them as small, scoped commits:

```bash
git add <specific-files>
git commit -m "fix(slides): <what>"
```

If no fixes were needed, skip this step.

- [ ] **Step 6.4: Final git status check**

Run: `git status`
Expected: clean working tree, with the pre-existing `slides.ts` staged change either still in the index (if the preflight decision was "commit separately later") or already committed.

Note the final commit hashes for the plan summary.

---

## What is intentionally NOT in this plan

These are spec follow-ups that should happen later in separate work:

1. **Trimming The Pattern section** — deferred until the primer is rehearsed. See spec Open Follow-ups #1.
2. **Knowledge base cleanup** — update `knowledge-base/05-harness-engineering-trend.md` and `knowledge-base/09-harness-pattern-anatomy.md` to match the new framing. Separate pass. See spec Open Follow-ups #2.
3. **CSS bugs** noted in the brainstorming conversation:
   - About-me slide image shadow cropped on the right edge.
   - Transient vertical scrollbar flicker between slides 2 and 3.
   Not part of this plan. See spec Open Follow-ups #3.
4. **The latent deck prop-spread bug** — `slides-deck.tsx` line 34's explicit `subtitle={slide.subtitle}` overwrites `props.subtitle` with `undefined` for slides that put subtitle in props. The new primer slides dodge this by putting focal text in top-level `title`, but a proper fix + audit of existing slides is a separate task. See spec Open Follow-ups #4.
