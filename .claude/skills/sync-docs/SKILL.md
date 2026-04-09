---
name: sync-docs
description: Use when project documentation has drifted from code or when completing a meaningful change — updates CLAUDE.md, PROGRESS.md, README.md, docs/slide-system-reference.md, knowledge-base/, and this skill itself to reflect current state
user-invocable: true
---

# /sync-docs

Synchronize all project documentation with the current code and talk state.
Read the actual files before updating — don't guess. Remove stale info. Don't invent features that aren't shipped.

**Single-package Next.js app.** No monorepo, no HTML architecture pages, no packages/* tree. If a section below references a file that no longer exists, fix Section 9 (self-check) first.

## Checklist

Work through each section in order. Skip sections where nothing changed.

### 1. `CLAUDE.md` (root)

Global project context — the only CLAUDE.md in the repo.

Verify against source of truth:
- **Stack line** ← `package.json` dependencies (Next.js version, React version, Tailwind version, framer-motion, shiki)
- **Commands** ← `package.json` `scripts` (currently: `dev`, `build`, `start`, `lint`)
- **Section table** ← `src/lib/types.ts` `SECTIONS` array (id / color / label)
- **Component registry list** ← `src/lib/registry.ts` — every component name must appear
- **Icon list** ← `src/lib/icon-map.ts` `ICONS` record — alphabetized in CLAUDE.md
- **Key directories list** ← actual directories under `src/`

If the slide quick-reference block grows past ~60 lines, move detail to `docs/slide-system-reference.md` and keep a pointer.

### 2. `PROGRESS.md`

Working notes + talk thesis + shipped-features checklist.

Verify:
- **Talk date** (top) — must match `README.md` and the date shown in `src/content/slides.ts` hero slide `event.date`
- **Live URL** — matches actual Vercel deployment
- **"11 slide component types"** counter — recount against `src/lib/registry.ts`; update the number and the bullet list if components were added/removed
- **Interactive mockups list** — matches files in `src/components/interactive/`
- **File map tree** (bottom) — re-check against `src/` if directories changed
- **"What's next" section** — move done items to shipped, delete stale candidates
- **Known gotchas** — remove fixed issues, add new ones

### 3. `README.md`

Public-facing intro. Keep minimal.

Verify:
- Event date matches `PROGRESS.md` and `CLAUDE.md`
- Talk title / thesis line matches current narrative in `src/content/slides.ts` hero slide
- Stack line matches `CLAUDE.md`
- Dev instructions still work (`pnpm install`, `pnpm dev`)

Common drift: README was written early and may describe an older narrative. Reconcile against the current hero slide.

### 4. `docs/slide-system-reference.md`

Full spec for `src/content/slides.ts`. This is THE reference when adding new slides or components.

Verify against source of truth:
- **`Slide` type** ← `src/lib/types.ts`
- **Sections table (§2)** ← `src/lib/types.ts` `SECTIONS`
- **Component registry table (§3)** ← `src/lib/registry.ts`
- **Each component's props (§4)** ← read the corresponding file in `src/components/slides/*.tsx` and update the prop type block
- **Interactive components (§5)** ← `src/components/interactive/*.tsx` + the local registry inside `src/components/interactive/interactive-slide.tsx`
- **Icon list (§6)** ← `src/lib/icon-map.ts`
- **File cheat sheet (§10)** ← every path must still exist

When a new slide component is added: update this doc first, then update the `CLAUDE.md` quick-reference list, then use it.

### 5. `knowledge-base/*.md`

13 files of talk content (README index + 00–11). Structured for a future Q&A agent, each with YAML frontmatter (`title`, `topic`, `audience_level`, optional `sources`).

Verify:
- `knowledge-base/README.md` index table lists every file that actually exists in the directory
- Each file still has valid frontmatter
- Any code examples or claims that were adjusted in the live slides (`src/content/slides.ts`) are reflected here — the knowledge base is the Q&A backstop, so anything the speaker might be asked about from the stage should be answerable from here
- Specifically: stats (3M conversations, 10M SMS, 500k workers, 35→7 calls), section names, the harness pillars, the Ernest story, the Mastra `Harness` class API

Do **not** expand this into new topics without being asked — the KB is intentionally scoped to the talk.

### 6. `docs/superpowers/` (specs & plans)

- **`specs/`** — design specs, mostly frozen. Only touch if a spec was explicitly re-scoped.
- **`plans/`** — close completed plans with a status line at top. Don't delete; they're the audit trail.

### 7. `AGENTS.md`

Fixed policy file: "This is NOT the Next.js you know." Don't change unless the Next.js version changes materially. No routine sync needed.

### 8. Auto-memory

**Path:** `~/.claude/projects/-Users-yannicktian-TECH-meetups/memory/`

Not repo docs, but worth a quick pass:
- `MEMORY.md` index — every referenced file exists
- Any memory with a specific date (e.g. "April 9, 2026") is still correct
- Stale user/feedback memories should be updated, not just appended

### 9. Self-check — this skill

**`.claude/skills/sync-docs/SKILL.md`** — verify the checklist above matches reality:

- Do all filenames referenced in sections 1–8 still exist? (Glob each path.)
- Is the component count in Section 1 still "the registry file"?
- Did a new top-level doc get added that isn't covered by any section?
- Did a section describe a file that was deleted?

**If this skill is stale, fix it FIRST.** A stale `sync-docs` causes every other section to drift silently.

## How to run

1. **Spawn an Explore agent** to scan for drift across the files in sections 1–5: read each, list each stale claim. (This saves main-context tokens versus reading everything inline.)
2. **Work Section 9 first** — self-check before anything else.
3. **Then sections 1–8** in order. Skip any that the Explore agent flagged as clean.
4. **Cross-reference dates and counts** — the common failure mode is version skew between PROGRESS.md, README.md, CLAUDE.md, and the hero slide.
5. **Commit as one change:** `docs: sync [what changed]`. Don't mix doc sync with code edits.

## What NOT to sync

Do not invent or update these files — they do not belong to this project:

- `CHANGELOG.md`, `TODO.md`, `CONTRIBUTING.md` (none exist; don't create)
- `packages/*/CLAUDE.md` (not a monorepo)
- `startup/`, `docs/changelog.html`, `architecture/*.html` (wrong project — these came from a different import)
- `Dockerfile`, `vercel.json`, `vercel.ts` (Vercel deploys from `main` without config)
- `docs/system-overview.md`, `docs/agents.md`, `docs/studio-engine.md`, `docs/memory.md`, `docs/deployment.md`, `docs/decisions.md` (also wrong project)

If the user asks for one of these, they're probably thinking of a different repo — confirm first.
