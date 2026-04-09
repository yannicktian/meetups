# Public Mirror for the Talk — Design Spec

**Date:** 2026-04-09
**Author:** Yannick Tian (with Claude)
**Status:** Approved, ready for implementation plan

## Context

The meetup slides project lives in `yannicktian/meetups` (currently public on GitHub,
deployed via Vercel to `meetups-talk.vercel.app`). It contains both the slides app and a
substantial amount of engineering scaffolding: design specs, implementation plans, a
13-file knowledge base with prepared Q&A, `PROGRESS.md` with internal project names, and
Claude Code configuration.

We want a clean, curated public artifact of the talk that:

1. Can be shared at the meetup as a permanent, forkable, no-account-required URL.
2. Does not expose the engineering backstage (specs, plans, FAQ cheatsheet, internal
   project names, dev process).
3. Does not constrain the private working repo's architecture (e.g., forcing it into
   static-export mode).

The private repo (`yannicktian/meetups`) will be flipped to private. A new public repo
`yannicktian/year-of-harnesses` will host the curated mirror, built and served by GitHub
Pages via GitHub Actions.

## Goals

- One source of truth (the private repo).
- Curated public artifact driven by an explicit allowlist — opt-in, not opt-out.
- Human-in-the-loop sync step with a preview/confirm prompt; no silent automation.
- Zero impact on the Vercel deployment of the private repo.
- Reliability over automation cleverness — the talk is imminent.
- Reversible at every step; no force-push workflows.

## Non-goals

- No automated CI-driven sync from private to public. (Human checkpoint only; we can
  upgrade to CI later post-talk if desired.)
- No full git-history rewriting or `git-filter-repo`. Public repo gets snapshot-style
  commits labeled with the corresponding private SHA.
- No support for server-side features in the public mirror. The mirror is static-only.
  Server features, if any are ever added, stay Vercel-only.
- No build step in the sync script. GH Actions in the public repo owns the build.

## Architecture

Three locations, one source of truth:

```
PRIVATE: yannicktian/meetups (source of truth)
  ├── src/                         ← slide source code
  ├── public/                      ← static assets
  ├── docs/                        ← NOT synced (engineering)
  ├── knowledge-base/              ← NOT synced (engineering)
  ├── PROGRESS.md                  ← NOT synced (engineering)
  ├── CLAUDE.md                    ← NOT synced (engineering)
  ├── public-repo-overlay/         ← scaffolding for public repo (lives here,
  │   ├── README.md                  versioned alongside source)
  │   ├── LICENSE
  │   ├── .gitignore
  │   └── .github/workflows/deploy.yml
  ├── scripts/sync-public-repo.sh  ← manual sync tool
  └── next.config.ts               ← shared, env-var-driven (see below)

PUBLIC: yannicktian/year-of-harnesses (derived artifact)
  ├── src/                 ← rsync'd from private
  ├── public/              ← rsync'd from private
  ├── next.config.ts       ← rsync'd from private (same file, different env)
  ├── package.json         ← rsync'd
  ├── ...                  ← rest of allowlisted config files
  ├── README.md            ← from overlay
  ├── LICENSE              ← from overlay
  ├── .gitignore           ← from overlay
  └── .github/workflows/deploy.yml  ← from overlay

DEPLOYMENTS
  • Vercel (canonical, unchanged):
      private meetups/main → meetups-talk.vercel.app
  • GitHub Pages (new, public artifact):
      public year-of-harnesses/main → yannicktian.github.io/year-of-harnesses/
```

The private repo holds everything: slide source, engineering scaffolding, *and* the
overlay/scaffolding for the public repo. The public repo is strictly a derived artifact
— it is never edited directly. All changes flow through the private repo and the sync
script.

## File allowlist

Anything NOT in this list is never synced to the public repo.

### Copied as-is from private repo

```
src/
public/
package.json
pnpm-lock.yaml
pnpm-workspace.yaml    (if present)
next.config.ts
tsconfig.json
postcss.config.mjs
eslint.config.mjs
```

### Added from `public-repo-overlay/`

```
README.md              (public-facing, rewritten from scratch)
LICENSE                (MIT)
.gitignore             (standard Next.js)
.github/workflows/deploy.yml
```

### Explicitly excluded

```
PROGRESS.md
CLAUDE.md
AGENTS.md
docs/                  (including docs/slide-system-reference.md)
knowledge-base/
.claude/
.superpowers/
.worktrees/
.vercel/
.next/
node_modules/
next-env.d.ts
tsconfig.tsbuildinfo
scripts/               (including the sync script itself)
public-repo-overlay/
```

**Decision:** `docs/slide-system-reference.md` is excluded. It references engineering
conventions and cross-links to CLAUDE.md. The public README can point to
`src/content/slides.ts` as the source of truth for slide data, which is enough for
anyone forking.

**Decision:** `package.json` keeps `"private": true`. That flag only prevents
accidental `npm publish`; it has no relationship to GitHub repo visibility.

## Next.js config — one file, two deployment targets

`next.config.ts` is modified so that GitHub Pages static-export configuration only
activates when the `GH_PAGES` env var is set. Both repos use the same file; the
difference is which environment builds it.

```ts
import type { NextConfig } from "next";

const isGhPages = process.env.GH_PAGES === "true";

const nextConfig: NextConfig = {
  ...(isGhPages && {
    output: "export",
    basePath: "/year-of-harnesses",
    assetPrefix: "/year-of-harnesses/",
    images: { unoptimized: true },
    trailingSlash: true,
  }),
};

export default nextConfig;
```

| Environment            | `GH_PAGES` set? | Effective config             | Behavior                                                   |
| ---------------------- | --------------- | ---------------------------- | ---------------------------------------------------------- |
| `pnpm dev` (local)     | no              | empty                        | Normal dev mode                                            |
| `pnpm build` on Vercel | no              | empty                        | Normal Next.js build, all features available               |
| `pnpm build` in GH CI  | **yes**         | static export + `/year-of-harnesses` subpath | Emits `out/`, served from `/year-of-harnesses/`  |

**Invariants this preserves:**

- Vercel deployments of the private repo are completely unchanged.
- Static export mode is explicit and opt-in — cannot activate by accident.
- The same `next.config.ts` is committed to both repos; no per-repo file rewriting.

**Architectural ceiling for the public mirror:** once in static-export mode, no server
components fetching dynamic data, no route handlers, no middleware. The current app
uses none of these. The private repo remains architecturally unconstrained; only the
public mirror is static-only.

## Sync script — `scripts/sync-public-repo.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

PRIVATE_DIR="$(git rev-parse --show-toplevel)"
PUBLIC_REMOTE="git@github.com:yannicktian/year-of-harnesses.git"
SCRATCH_DIR="$(mktemp -d -t year-of-harnesses-sync)"
trap 'rm -rf "$SCRATCH_DIR"' EXIT

echo "→ Cloning public repo into scratch dir..."
git clone --depth=20 "$PUBLIC_REMOTE" "$SCRATCH_DIR"

echo "→ Wiping scratch working tree (keeping .git)..."
find "$SCRATCH_DIR" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +

ALLOWLIST=(
  src
  public
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  next.config.ts
  tsconfig.json
  postcss.config.mjs
  eslint.config.mjs
)

echo "→ Copying allowlisted source files..."
for path in "${ALLOWLIST[@]}"; do
  if [[ -e "$PRIVATE_DIR/$path" ]]; then
    cp -R "$PRIVATE_DIR/$path" "$SCRATCH_DIR/$path"
  fi
done

echo "→ Overlaying public-repo-overlay/..."
cp -R "$PRIVATE_DIR/public-repo-overlay/." "$SCRATCH_DIR/"

echo "→ Preview of what will be synced:"
(cd "$SCRATCH_DIR" && git status --short)

echo
read -r -p "Proceed with commit & push? [y/N] " confirm
[[ "$confirm" == "y" || "$confirm" == "Y" ]] || { echo "Aborted."; exit 1; }

cd "$SCRATCH_DIR"
git add -A
if git diff --cached --quiet; then
  echo "✓ No changes to sync."
  exit 0
fi

PRIVATE_SHA=$(git -C "$PRIVATE_DIR" rev-parse --short HEAD)
git commit -m "Sync from private @ $PRIVATE_SHA"
git push origin main
echo "✓ Pushed to $PUBLIC_REMOTE"
```

**Design properties:**

- **Explicit allowlist** — opt-in, prevents accidental leaks if new sensitive files land in
  the private repo.
- **Human checkpoint** — shows a diff preview and asks before pushing. Safer than silent
  automation, especially near the talk date.
- **Non-forcing push** — accumulates history in the public repo. Each sync is one commit
  tagged with the private SHA, so public commit X traces back to private commit Y.
- **Scratch dir on `$TMPDIR`, cleaned on exit.** No leftover state.
- **No build step.** The script pushes source only. GH Actions in the public repo owns
  the build. Concerns stay separated and the script is fast.

Wired into `package.json`:

```json
"scripts": {
  "sync:public": "bash scripts/sync-public-repo.sh"
}
```

Run with `pnpm sync:public`.

## Public-repo overlay contents

Lives at `public-repo-overlay/` in the private repo. Versioned alongside source.

### `README.md`

Public-facing, written from scratch. Sections:

- **Title**: `"The Year of Harnesses"` — AI.xperience Marseille, April 9, 2026
- **Speaker**: Yannick Tian, Staff Product AI Engineer @ Gojob
- **Live URL**: `https://yannicktian.github.io/year-of-harnesses/`
- **About the talk**: ~25-min talk on the "harness" engineering pattern — Claude Code as
  canonical example, Mastra naming the primitive, how any product can become a harness.
- **Tech stack**: Next.js 16 + React 19, Framer Motion, Tailwind 4, Shiki
- **Local dev**: `pnpm install && pnpm dev`
- **License**: MIT (see `LICENSE`)
- **Notable source files**: `src/content/slides.ts` (slide data), `src/lib/registry.ts`
  (component registry), `src/components/slides/` (slide types)

**Excluded from README:** any mention of the private repo, the Vercel URL, Gojob
internal project names (Alpha, Aglae, Kitsune, Ernest), engineering process, CLAUDE.md
conventions.

### `LICENSE`

MIT, standard text, `Copyright (c) 2026 Yannick Tian`.

### `.gitignore`

Standard Next.js:

```
node_modules/
.next/
out/
next-env.d.ts
.DS_Store
```

### `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
        env:
          GH_PAGES: "true"
      - run: touch out/.nojekyll
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

`.nojekyll` prevents GH Pages from running Jekyll preprocessing, which would strip
files/directories starting with `_` — including Next.js's `_next/` directory.

The `pnpm/action-setup@v4` version should match the local pnpm major version
(`pnpm --version`). Defaulted to `9` above; adjust in implementation if the local
version differs. Optionally add `"packageManager": "pnpm@9.x.y"` to the private
repo's `package.json` to pin it for both Vercel and GH Actions simultaneously.

## One-time bootstrap sequence

Each step is manual and independently verifiable.

1. **Flip `yannicktian/meetups` to private** (user action). Confirm done before running
   the sync. Verify Vercel deployment still builds after the flip.
2. **Validate static export works locally** from the private repo:
   ```
   GH_PAGES=true pnpm build
   npx serve out -l 3001
   ```
   Open `http://localhost:3001/year-of-harnesses/` and click through every slide type.
   Look for: broken images (raw `<img>` tags bypassing basePath), broken hash
   navigation, Shiki highlighting, Framer Motion animations, fonts.
3. **Fix anything that breaks static export** in the private repo. Re-test.
4. **Create the public repo** (empty — overlay supplies everything):
   ```
   gh repo create yannicktian/year-of-harnesses \
     --public \
     --description "Interactive slides for 'The Year of Harnesses' — AI.xperience Marseille, April 2026"
   ```
5. **Enable GH Pages in the new repo**, source = "GitHub Actions":
   ```
   gh api --method POST \
     repos/yannicktian/year-of-harnesses/pages \
     -f build_type=workflow
   ```
   Fallback if the API call is flaky on brand-new repos: enable via Settings → Pages →
   Build and deployment → Source: GitHub Actions.
6. **Create overlay + script in private repo** and commit:
   - `public-repo-overlay/README.md`
   - `public-repo-overlay/LICENSE`
   - `public-repo-overlay/.gitignore`
   - `public-repo-overlay/.github/workflows/deploy.yml`
   - `scripts/sync-public-repo.sh` (executable)
   - Updated `next.config.ts`
   - `package.json` with `sync:public` script
7. **Run first sync**: `pnpm sync:public`. Confirm the diff preview, press `y`.
8. **Watch the GH Actions run**: `gh run watch -R yannicktian/year-of-harnesses`.
9. **Verify live URL** at `https://yannicktian.github.io/year-of-harnesses/`. Click
   through every slide.

After bootstrap, ongoing publishing is just `pnpm sync:public` whenever the private
repo has changes worth publishing.

## Risks & mitigations

| Risk                                                                  | Mitigation                                                                                                  |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Static export fails due to server-only feature                        | Validate locally in bootstrap step 2 before touching the public repo.                                       |
| Raw `<img>` tags bypass `basePath` and 404 on GH Pages                | Grep `src/` for raw `<img>` tags during implementation; convert to `next/image` or prefix manually.         |
| First GH Actions run fails                                            | Common causes: Pages not enabled, missing `.nojekyll`, lockfile mismatch. All recoverable via re-run.        |
| Accidental leak of a sensitive file via a path that looks whitelisted | The allowlist is path-level, not glob-level. `src/` is copied wholesale, but no other wholesale dir copies. |
| Private repo flip to private breaks the Vercel deploy                 | Vercel supports private GitHub repos on all plans. Re-link if needed. User verifies after flipping.         |
| GH Pages URL and `basePath` disagree                                  | Repo name and `basePath` must match exactly (`year-of-harnesses`). Hardcoded in `next.config.ts`.           |
| Sync script runs on a dirty private working tree                      | Not blocking, but commit or stash first for a clean `$PRIVATE_SHA` label.                                   |
| Force-push accidentally                                               | Script uses plain `git push`, not `--force`. Non-forcing by construction.                                   |

## Validation checklist (implementation exit criteria)

- [ ] `yannicktian/meetups` is private; Vercel deploy still works.
- [ ] `GH_PAGES=true pnpm build` completes in the private repo with no errors.
- [ ] `out/` serves correctly locally under `/year-of-harnesses/`; all slides render.
- [ ] `yannicktian/year-of-harnesses` exists and is public.
- [ ] GH Pages is enabled with source = GitHub Actions.
- [ ] First sync pushes exactly the allowlisted files + overlay, nothing else.
- [ ] GH Actions build passes on the first sync.
- [ ] Live URL renders the deck at `https://yannicktian.github.io/year-of-harnesses/`.
- [ ] All slides, animations, and interactive components work on the live URL.
- [ ] Public repo's README has no references to private engineering material.

## Open questions resolved during brainstorming

- **Repo name** → `year-of-harnesses`.
- **Hosting** → Vercel stays canonical; GH Pages is the new public artifact.
- **Sync mode** → Manual (Approach 1), human-confirmed, non-forcing.
- **Private repo visibility** → User will flip `yannicktian/meetups` to private.
- **`docs/slide-system-reference.md`** → Excluded from public repo.
- **License** → MIT.

## Out of scope

- CI-driven fully automated sync. Can be added post-talk by upgrading the workflow.
- Custom domain for the GH Pages site. Current URL structure is `github.io/<repo>`.
- Git history preservation from `meetups` into `year-of-harnesses`. Public repo has
  snapshot-style history labeled with private SHAs.
- Test coverage for the sync script itself. Script is short, human-checkpointed, and
  reversible — a test suite would be overkill.
