# Progress & Handoff

Working notes for the meetup talk _"2026: The Year of Harnesses"_ — ~25 min content + ~5 min Q&A, Marseille, April 9, 2026.

## Where things stand

- **Talk date:** Thursday, April 9, 2026 — Marseille
- **Event:** Developer AI.xperience night (first of a long series)
- **Hosts:** Qalico × Gojob
- **Co-speaker on the bill:** Volta Medical
- **Speaker:** Yannick Tian, Staff Product AI Engineer @ Gojob
- **Slot:** ~25 min content + ~5 min Q&A

**Live:** https://meetups-talk.vercel.app
**Repo:** https://github.com/yannicktian/meetups
**Auto-deploy:** connected to `main` branch

## Talk thesis

**"2026 is the year of harnesses"** — Claude Code is the canonical example, Mastra named the primitive, every domain that has a product can have a harness.

Narrative arc:

1. **Intro** — Hook (who uses Claude Code?), harness engineering trend (3 paradigms)
2. **Alpha** — Gojob context, SMS demo, 3M conversations, 80/20 lesson
3. **SaaS** — The pivot, onboarding pain
4. **In-App Agent** — Mastra + RAG + MCP + streaming demo
5. **The Pattern** — Claude Code anatomy, Mastra Harness class, Ernest hackathon, 6 pillars, real code, reliability
6. **The Vision** — Death of menus, intent first, your harness today, 2026 is the year

## What's shipped

### Slide app features

- Horizontal scrolling (scroll-snap-type: x mandatory)
- Arrow Left/Right + Up/Down + Space/Shift+Space + PageUp/PageDown + Home/End
- Top nav bar with 6 section pills + Framer Motion shared layout highlight
- Instant nav jumps (smooth for arrow keys)
- Light theme (warm white, indigo/pink accents, section-tinted radial gradients)
- 14 slide component types:
  - HeroSlide (with event/hosts/acknowledgment block)
  - AboutMeSlide (avatar + bio + links)
  - NarrativeSlide (bullets with icons, optional code panel, `size: "large"`, `highlight` on bullets, `stagedReveal` for one-at-a-time reveals)
  - QuoteSlide (big pull mark + attribution)
  - TransitionSlide
  - StatsSlide (animated counters, optional `from → to` comparison)
  - CodeSlide (Shiki github-light, step-through via arrow keys)
  - ArchitectureSlide (animated SVG nodes/edges/groups)
  - InteractiveSlide (wrapper for SmsConversation / PrerequisiteSetup / ArchitectureDiagram)
  - GridSlide (responsive 2/3 col with icon cards)
  - CalloutSlide (insight/warning/success/info variants)
  - ComparisonSlide (left vs right, arrow separator)
  - HarnessCloudSlide (scattered chip cloud, burst animation)
  - HarnessBucketsSlide (gathered chip bucket grid — pay-off to the cloud slide)
- Interactive mockups:
  - SmsConversation (phone frame, typing indicators, auto-play + replay)
  - PrerequisiteSetup (job posting card + streaming prerequisite cards with drag-to-reorder)
  - ArchitectureDiagram (reusable SVG, nodes + edges + groups)
- Icons via lucide-react (see `src/lib/icon-map.ts`)
- Partial JSON streaming demo (conceptual code on streaming-code slide)
- Animations re-fire on scroll (whileInView + viewport `once: false`)
- Mobile-responsive (all components stack / scale down appropriately)

### Knowledge base

13 files at `knowledge-base/` documenting the full research behind the talk. Structured for a future Q&A agent:

- README index
- Talk thesis, event context, speaker bio
- Claude Code architecture, Mastra Harness primitive, Harness engineering trend
- Alpha, In-App Agent, Kitsune hackathon (all with real code references)
- Harness pattern anatomy
- FAQ (25+ questions with prepared answers)
- References (all sources, quotes, URLs)

Each file has YAML frontmatter (`title`, `topic`, `audience_level`, optional `sources`) for agent retrieval.

### Design spec + implementation plan

- `docs/superpowers/specs/2026-04-07-meetup-slides-design.md`
- `docs/superpowers/plans/2026-04-07-meetup-slides.md`

### Vercel deployment

- Project: `yannick-tian-gojobs-projects/meetups-talk`
- Auto-deploys on push to `main`
- Production URL: https://meetups-talk.vercel.app
- Local git email set to `yannick.tian@gmail.com` (repo-scoped)

## Key decisions we've locked in

- **Acoulyte (personal project) is NOT mentioned by name** anywhere in slides or knowledge base. Its patterns can be used as generic "harness pattern" examples but should never be credited.
- **Date corrected to April 9**, not April 10 (earlier mistake)
- **English slides, French delivery** (noted in memory)
- **Bold keynote aesthetic** but light theme (projector-friendly)
- **Mixed layouts** — no more bullet monotony. Grid, callout, comparison, quote, narrative+code all used.
- **Section names** (visible in top nav):
  - Intro / Alpha / SaaS / In-App Agent / The Pattern / The Vision
- **SMS conversation demo kept** as illustration (short Alpha section)
- **Simplified code snippets** in narrative slides, full code only on key technical slides

## Known things to watch

1. **Vercel CLI outdated** (50.38.3 → 50.41.0 available). Not blocking.
2. **Very small phones (<375px)**: top nav might be tight with 6 pills. They're scrollable horizontally within the nav if needed.
3. **Dev server cache**: if `pnpm dev` acts weird after `pnpm build`, clear `.next/`.
4. **`next-env.d.ts`** is gitignored (create-next-app default).
5. **`.superpowers/`** and `.vercel/` are gitignored.

## What's next (candidates — pick what matters)

### Before the talk (Thursday April 9)

- [ ] **Rehearse with timing** — walk through all slides, measure sections, cut if over ~25 min
- [ ] **Check projector resolution** at the venue — verify font sizes look right
- [ ] **Test keyboard remote / clicker** if using one (confirm Arrow keys work, which they should)
- [ ] **Backup plan** — offline copy or cached version in case of WiFi issues
- [ ] **Speaker notes** — not implemented; could add a presenter mode overlay if useful
- [ ] **Translate mentally** — slides are English, delivery is French; practice the transitions

### Content iteration (if time permits)

- [ ] Review specific slides that feel weak — tighten copy
- [ ] Add more real details to Alpha supervision slide (currently just the 80/20 callout)
- [ ] Consider a "behind the scenes" slide with real production metrics from Langfuse
- [ ] More real code snippets from the Aglae llm-agent codebase if the technical audience wants more
- [ ] Maybe shorten the Pattern section — it has 12 slides, could cut 2-3

### Post-talk / V2 ideas

- [ ] **V2: Agent-driven presentation** — original stretch goal. Build a Mastra agent that serves slide descriptors on demand, using the knowledge base as MCP resources. The speaker asks questions, the agent renders the answer as rich UI using the existing slide components. Meta-level: the talk's medium becomes the message.
- [ ] **Q&A agent** — simpler than V2. Just a chat widget on the site that retrieves from `knowledge-base/` to answer audience questions about the talk. Good first use of the knowledge base we already built.
- [ ] **Record the talk** — if the meetup allows recording, publish as a resource
- [ ] **Write it up as a blog post** — the harness pattern argument is strong enough to publish standalone
- [ ] **Open source the slide framework** — the slides-as-data + component registry pattern is reusable

## File map (for orientation)

```
meetups/
├── PROGRESS.md              ← this file
├── README.md
├── CLAUDE.md
├── docs/superpowers/
│   ├── specs/2026-04-07-meetup-slides-design.md
│   └── plans/2026-04-07-meetup-slides.md
├── knowledge-base/          ← 13 files, for future Q&A agent
│   ├── README.md
│   ├── 00-talk-thesis.md
│   ├── 01-event-context.md
│   ├── 02-speaker-bio.md
│   ├── 03-claude-code-architecture.md
│   ├── 04-mastra-harness-primitive.md
│   ├── 05-harness-engineering-trend.md
│   ├── 06-alpha-recruiter-assistant.md
│   ├── 07-aglae-in-app-agent.md
│   ├── 08-kitsune-hackathon.md
│   ├── 09-harness-pattern-anatomy.md
│   ├── 10-faq.md
│   └── 11-references.md
├── public/
│   └── avatar_YT_small.jpg
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx         ← renders <SlidesDeck />
    │   └── globals.css      ← theme vars, section soft bgs, scrollbar-hide
    ├── components/
    │   ├── deck/
    │   │   ├── slides-deck.tsx       ← top nav + horizontal container
    │   │   ├── slide-wrapper.tsx     ← per-slide section, snap-start
    │   │   └── top-nav-bar.tsx       ← 6-section pill nav
    │   ├── slides/
    │   │   ├── hero-slide.tsx
    │   │   ├── about-me-slide.tsx
    │   │   ├── narrative-slide.tsx
    │   │   ├── quote-slide.tsx
    │   │   ├── transition-slide.tsx
    │   │   ├── stats-slide.tsx
    │   │   ├── code-slide.tsx
    │   │   ├── architecture-slide.tsx
    │   │   ├── interactive-slide.tsx
    │   │   ├── grid-slide.tsx
    │   │   ├── callout-slide.tsx
    │   │   └── comparison-slide.tsx
    │   └── interactive/
    │       ├── sms-conversation.tsx
    │       ├── prerequisite-setup.tsx
    │       ├── architecture-diagram.tsx
    │       └── mini-code-block.tsx
    ├── content/
    │   └── slides.ts        ← all slide data, ordered
    └── lib/
        ├── types.ts         ← Slide, SlideSection, SECTIONS, colors
        ├── registry.ts      ← component name → React component
        ├── icon-map.ts      ← lucide-react icon registry
        ├── use-slide-nav.ts ← keyboard + hash + scroll
        └── use-in-view.ts   ← IntersectionObserver hook
```

## How to resume in a new session

1. Open this project directory (`/Users/yannicktian/TECH/meetups`)
2. Memory system will auto-load Yannick's profile, talk context, and feedback from `~/.claude/projects/-Users-yannicktian-TECH-meetups/memory/`
3. Read this file first for current state
4. Optionally read `knowledge-base/00-talk-thesis.md` for the talk argument
5. The slides source of truth is `src/content/slides.ts`
6. To preview: `pnpm dev`
7. To deploy: `git push origin main` (Vercel auto-deploys)

## Memory already saved

- `user_yannick.md` — user profile (AI lead at Gojob, deep Mastra expertise)
- `project_meetup_april2026.md` — project overview
- `project_meetup_vision.md` — talk thesis and vision
- `feedback_no_visual_companion.md` — user prefers text-only brainstorming (mobile remote control)

These load automatically in future sessions via MEMORY.md index.

Page 20
It still feels as if we are adding agentic features to an old fashioned product
We implement AI features on top of a standard product
It is not an AI native product
Agent has almost no autonomy, no reasoning, no skill. Only prompt engineering and context engineering
What if we create the claude code for recruiters?

Vision
1 User intent
2 Harness + OpenClaw => Agent suggests, asks the user
3 Agent is fully autonomous
