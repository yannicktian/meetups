# Public Mirror Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up a curated public mirror of the talk at `yannicktian/year-of-harnesses`, deployed via GitHub Pages, with a manual allowlist-driven sync script in the private `yannicktian/meetups` repo.

**Architecture:** Private repo remains the source of truth and Vercel-canonical. A `public-repo-overlay/` directory in the private repo holds the public-only scaffolding (README, LICENSE, GH Actions workflow). A `scripts/sync-public-repo.sh` script builds a filtered snapshot (allowlisted source + overlay) into a temp dir cloned from the public repo, then human-confirms + pushes. `next.config.ts` is env-var-driven so static export only activates in GH Actions (`GH_PAGES=true`), leaving Vercel builds unchanged.

**Tech Stack:** Next.js 16, React 19, bash, GitHub Actions, GitHub CLI (`gh`), pnpm

**Spec:** `docs/superpowers/specs/2026-04-09-public-mirror-design.md`

**Context notes:**
- No test framework exists in this project. Verification is manual (run commands, visually inspect output, click through deck). Each task has a verification step with exact expected output.
- Plan is executed directly on `main` of the private repo (not in a worktree) because changes are purely additive and the talk is imminent.
- All commits in this plan happen in the PRIVATE repo (`yannicktian/meetups`). The public repo only receives commits via the sync script (Task 8).

---

## File Structure

**Files to CREATE in private repo:**
- `public-repo-overlay/README.md` — public-facing README
- `public-repo-overlay/LICENSE` — MIT license
- `public-repo-overlay/.gitignore` — standard Next.js ignore
- `public-repo-overlay/.github/workflows/deploy.yml` — GH Pages build+deploy workflow
- `scripts/sync-public-repo.sh` — executable sync script

**Files to MODIFY in private repo:**
- `next.config.ts` — add env-var-gated static export block
- `package.json` — add `sync:public` script entry
- `.gitignore` (private repo's) — add `out/` to keep static export artifacts out of private repo git

**External resources to CREATE:**
- GitHub repo `yannicktian/year-of-harnesses` (public, empty)
- GitHub Pages site for that repo (source = GitHub Actions)

**External state changes:**
- `yannicktian/meetups` visibility: public → private (user action)

---

## Task 1: Add env-var-driven static export to `next.config.ts`

**Files:**
- Modify: `next.config.ts`

**Why:** Make the same `next.config.ts` work for both Vercel (server-capable) and GH Pages (static export) by keying the static export block on an env var. Vercel builds see `GH_PAGES` unset and behave exactly as today; GH Actions sets `GH_PAGES=true` and gets full static export + basePath.

- [ ] **Step 1: Read current next.config.ts to confirm starting state**

Run:
```
cat next.config.ts
```

Expected output (should match exactly):
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

If it doesn't match, stop and surface the discrepancy — the plan assumes a clean starting state.

- [ ] **Step 2: Replace `next.config.ts` with the env-var-driven version**

New file contents:
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

- [ ] **Step 3: Verify Vercel build mode is unchanged (GH_PAGES unset)**

Run:
```
pnpm lint && pnpm build
```

Expected: Build succeeds. Output includes `Creating an optimized production build` and `○ (Static)` / `λ (Server)` route markers as usual. NO `out/` directory created.

Verify:
```
ls out 2>&1 | head -1
```
Expected: `ls: out: No such file or directory`

- [ ] **Step 4: Commit**

```
git add next.config.ts
git commit -m "feat(config): env-var gated static export for GH Pages

Adds GH_PAGES=true opt-in to emit a static export under /year-of-harnesses
subpath. Vercel builds are unchanged when GH_PAGES is unset."
```

---

## Task 2: Validate local static export works end-to-end

**Files:** none (validation only)

**Why:** Before investing in the public repo, confirm the app actually builds and runs as a static export. Any issues surface here and get fixed in the private repo.

- [ ] **Step 1: Run static export build**

Run:
```
GH_PAGES=true pnpm build
```

Expected: Build succeeds. Output includes:
- `Creating an optimized production build`
- `Collecting page data`
- `Generating static pages`
- `Finalizing page optimization`
- `Exporting (X/X)` where X ≥ 1
- An `out/` directory exists at the repo root after the command completes.

Verify:
```
ls out/
```
Expected: directory contains at minimum `index.html` and `_next/` subdirectory.

- [ ] **Step 2: Serve `out/` locally under `/year-of-harnesses/` subpath**

The dev-time static server must replicate the GH Pages URL structure. Use a server that lets you mount `out/` under a subpath. The simplest approach: create a temporary wrapper directory.

Run:
```
rm -rf /tmp/gh-pages-test
mkdir -p /tmp/gh-pages-test/year-of-harnesses
cp -R out/. /tmp/gh-pages-test/year-of-harnesses/
touch /tmp/gh-pages-test/year-of-harnesses/.nojekyll
npx serve /tmp/gh-pages-test -l 3001
```

Expected: `serve` starts and prints `Accepting connections at http://localhost:3001`.

- [ ] **Step 3: Manually smoke-test every slide type at `http://localhost:3001/year-of-harnesses/`**

Open `http://localhost:3001/year-of-harnesses/` in a browser. Walk through the entire deck using arrow keys. For each slide, verify:
- Content renders (no blank white slide)
- Images load (no broken image icons; check `public/avatar_YT_small.jpg` on the AboutMe slide specifically)
- Shiki-highlighted code blocks render with colors (not plain text)
- Framer Motion animations run (especially on HarnessCloud, HarnessBuckets, Architecture slides)
- Interactive components work: SmsConversation plays, PrerequisiteSetup streams cards, ArchitectureDiagram renders nodes/edges
- Top nav bar section pills work (click each one)
- Keyboard navigation: Arrow Left/Right, Up/Down, Space, Home/End all work
- Fonts render correctly (no FOUC or missing fonts)

Use this minimal checklist per the 14 slide types from PROGRESS.md:
- [ ] Hero, AboutMe, Narrative, Quote, Transition
- [ ] Stats, Code, Architecture, Interactive
- [ ] Grid, Callout, Comparison
- [ ] HarnessCloud, HarnessBuckets

- [ ] **Step 4: Kill the dev server and clean up**

Run:
```
# Ctrl-C the serve process, then:
rm -rf /tmp/gh-pages-test out
```

- [ ] **Step 5: IF static export broke anything, fix and recommit**

If Step 3 found broken images or broken hash links, the most common culprit is a raw `<img src="/...">` tag that bypasses `next/image` and therefore doesn't pick up `basePath`.

Find any hits:
```
grep -rn "<img " src/
grep -rn 'href="/' src/
```

If hits exist, two options:
1. Convert raw `<img>` to `next/image` (`import Image from "next/image"`) — picks up `basePath` automatically.
2. Manually prefix the path with the base path (not preferred; tightly couples to the GH Pages deployment).

Make the fix, re-run Step 1 and Step 3, then commit:
```
git add src/
git commit -m "fix: use next/image for static export basePath compatibility"
```

If Step 3 passed cleanly on the first try, skip this step.

- [ ] **Step 6: Add `out/` to private repo `.gitignore`**

Static export can be re-run locally. The artifact must never be committed to either repo.

Run:
```
grep -q '^out/$' .gitignore || echo 'out/' >> .gitignore
git diff .gitignore
```

Expected diff: one line added (`out/`).

```
git add .gitignore
git commit -m "chore: gitignore Next.js static export output dir"
```

---

## Task 3: Create `public-repo-overlay/` with README, LICENSE, .gitignore

**Files:**
- Create: `public-repo-overlay/README.md`
- Create: `public-repo-overlay/LICENSE`
- Create: `public-repo-overlay/.gitignore`

**Why:** The overlay directory holds the scaffolding that only exists in the public mirror (not in the private repo's effective app). It's versioned in the private repo so edits happen through normal git flow.

- [ ] **Step 1: Create `public-repo-overlay/README.md`**

File contents:
```markdown
# The Year of Harnesses

Interactive slides for a talk given at **AI.xperience Marseille** on April 9, 2026.

> **2026 is the year of harnesses** — Claude Code is the canonical example, Mastra named the primitive, and every domain that has a product can have a harness.

**Live URL:** https://yannicktian.github.io/year-of-harnesses/

**Speaker:** Yannick Tian — Staff Product AI Engineer

---

## What this is

A ~25-minute talk on the "harness" engineering pattern for AI-native products. The slides are a single-page Next.js app with scroll-snap horizontal navigation, Framer Motion transitions, Shiki-highlighted code, and embedded interactive mockups.

## Tech stack

- Next.js 16 + React 19
- Framer Motion (animations)
- Shiki (build-time syntax highlighting)
- Tailwind CSS 4
- lucide-react (icons)

No UI library — all slide components are custom.

## Architecture

Single-page app. All slides are defined as data in `src/content/slides.ts` as a typed `Slide[]` array. Each slide entry has an `id`, `section`, a `component` name, and `props`. A registry (`src/lib/registry.ts`) maps component names to React components. Adding a new slide means adding one entry to the data array.

**Slide types:** HeroSlide, AboutMeSlide, NarrativeSlide, QuoteSlide, TransitionSlide, StatsSlide, CodeSlide, ArchitectureSlide, InteractiveSlide, GridSlide, CalloutSlide, ComparisonSlide, HarnessCloudSlide, HarnessBucketsSlide.

## Local development

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000 and navigate with Arrow keys, Space, PageUp/PageDown, or Home/End.

## Building

```bash
pnpm build          # normal Next.js build
pnpm lint           # ESLint
```

For the GitHub Pages static export (subpath-aware):

```bash
GH_PAGES=true pnpm build
```

Outputs to `out/`.

## License

MIT — see [LICENSE](./LICENSE).
```

- [ ] **Step 2: Create `public-repo-overlay/LICENSE`**

File contents:
```
MIT License

Copyright (c) 2026 Yannick Tian

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 3: Create `public-repo-overlay/.gitignore`**

File contents:
```
# dependencies
node_modules/

# next.js build output
.next/
out/

# env
.env*.local
.env

# misc
.DS_Store
*.pem
next-env.d.ts

# typescript
*.tsbuildinfo
```

- [ ] **Step 4: Verify directory structure**

Run:
```
ls -la public-repo-overlay/
```

Expected output includes:
```
.gitignore
LICENSE
README.md
```

---

## Task 4: Create the GitHub Actions deploy workflow in overlay

**Files:**
- Create: `public-repo-overlay/.github/workflows/deploy.yml`

**Why:** This workflow lives in the public repo (via the overlay) and runs on every push to `main` there. It installs dependencies, builds Next.js in static export mode (`GH_PAGES=true`), and deploys the `out/` directory to GitHub Pages.

- [ ] **Step 1: Create the workflow directory**

Run:
```
mkdir -p public-repo-overlay/.github/workflows
```

- [ ] **Step 2: Create `public-repo-overlay/.github/workflows/deploy.yml`**

File contents:
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
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build static export
        env:
          GH_PAGES: "true"
        run: pnpm build

      - name: Add .nojekyll
        run: touch out/.nojekyll

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Verify the workflow file is valid YAML**

Run:
```
python3 -c "import yaml; yaml.safe_load(open('public-repo-overlay/.github/workflows/deploy.yml'))" && echo "OK"
```

Expected output: `OK` (no Python error trace).

- [ ] **Step 4: Verify local `pnpm` version matches the workflow pinning**

Run:
```
pnpm --version
```

If the major version is not `9`, update `deploy.yml` Step 2's `version:` field to match. Commit the adjustment along with the overlay files in the next step.

If the major version is `9`, no change needed.

- [ ] **Step 5: Commit all overlay files**

```
git add public-repo-overlay/
git commit -m "feat(overlay): scaffolding for public mirror repo

Adds README, MIT license, gitignore, and GH Pages deploy workflow that
will be overlayed onto the public repo by scripts/sync-public-repo.sh."
```

---

## Task 5: Create the sync script and wire it into `package.json`

**Files:**
- Create: `scripts/sync-public-repo.sh`
- Modify: `package.json`

**Why:** The script performs the filtered snapshot + push. Wiring `pnpm sync:public` gives a discoverable one-command entry point.

- [ ] **Step 1: Create `scripts/` directory**

Run:
```
mkdir -p scripts
```

- [ ] **Step 2: Create `scripts/sync-public-repo.sh`**

File contents:
```bash
#!/usr/bin/env bash
set -euo pipefail

# Sync the private meetups repo's slide source to the public
# yannicktian/year-of-harnesses mirror.
#
# - Explicit allowlist: anything NOT listed below is NEVER synced.
# - Human checkpoint: previews the diff and asks before pushing.
# - Non-forcing push: accumulates history in the public repo.
# - No build step: GH Actions in the public repo owns the build.

PRIVATE_DIR="$(git rev-parse --show-toplevel)"
PUBLIC_REMOTE="git@github.com:yannicktian/year-of-harnesses.git"
SCRATCH_DIR="$(mktemp -d -t year-of-harnesses-sync)"
trap 'rm -rf "$SCRATCH_DIR"' EXIT

echo "→ Cloning public repo into scratch dir..."
git clone --depth=20 "$PUBLIC_REMOTE" "$SCRATCH_DIR" 2>&1 | grep -v "warning: You appear to have cloned an empty repository" || true

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

# On first sync the cloned repo is empty with HEAD pointing at unborn main.
# On subsequent syncs it has real commits on main. Both cases: we're already
# on "main" from clone defaults, so no checkout is needed. The first commit
# on an empty repo will birth refs/heads/main automatically.
cd "$SCRATCH_DIR"

echo "→ Preview of what will be synced:"
git add -A
git status --short
echo

read -r -p "Proceed with commit & push? [y/N] " confirm
[[ "$confirm" == "y" || "$confirm" == "Y" ]] || { echo "Aborted."; exit 1; }

if git diff --cached --quiet; then
  echo "✓ No changes to sync."
  exit 0
fi

PRIVATE_SHA=$(git -C "$PRIVATE_DIR" rev-parse --short HEAD)
git -c user.email="yannick.tian@gmail.com" -c user.name="Yannick Tian" \
  commit -m "Sync from private @ $PRIVATE_SHA"
git push -u origin main
echo "✓ Pushed to $PUBLIC_REMOTE"
```

Notes on a few script choices:
- `set -euo pipefail` — any command failure or undefined variable aborts.
- `trap 'rm -rf "$SCRATCH_DIR"' EXIT` — scratch dir cleaned up on any exit path (success, failure, Ctrl-C).
- No explicit checkout: cloning either an empty or populated public repo leaves us on (possibly unborn) `main` by default. The first commit on an empty repo births `refs/heads/main` automatically.
- `git push -u origin main` — sets upstream on first push; no-op on subsequent pushes.
- Explicit `-c user.email=... -c user.name=...` — the scratch repo may inherit global git identity; pinning per-commit keeps the sync commits consistently attributed.

- [ ] **Step 3: Make the script executable**

Run:
```
chmod +x scripts/sync-public-repo.sh
ls -l scripts/sync-public-repo.sh
```

Expected: output shows `-rwxr-xr-x` (executable bit set).

- [ ] **Step 4: Add `sync:public` script to `package.json`**

Read current `package.json`:
```
cat package.json
```

Modify the `"scripts"` block to add `sync:public`. The resulting `scripts` section must be:
```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "sync:public": "bash scripts/sync-public-repo.sh"
  },
```

Verify:
```
grep -A6 '"scripts"' package.json
```

Expected: the new `"sync:public"` line is present.

- [ ] **Step 5: Verify the script is a no-op when run against a nonexistent public repo (dry mental test)**

Do NOT run the script yet. The public repo doesn't exist until Task 7. Skip execution in this task.

- [ ] **Step 6: Commit**

```
git add scripts/sync-public-repo.sh package.json
git commit -m "feat(scripts): add sync-public-repo.sh for public mirror

Allowlist-driven manual sync with a human confirmation prompt.
Run via 'pnpm sync:public'."
```

---

## Task 6: User action — flip `yannicktian/meetups` to private and verify Vercel still deploys

**Files:** none

**Why:** Flipping to private changes what the Vercel GitHub integration sees. On all Vercel plans, private GitHub repos are supported — but it's worth verifying nothing breaks before we introduce the public mirror.

> ⚠ **USER ACTION REQUIRED.** This step cannot be automated safely. Do NOT run this via CLI in the plan execution; the user must initiate it themselves after confirming they're ready.

- [ ] **Step 1: User flips visibility**

User runs one of:
```
gh repo edit yannicktian/meetups --visibility private --accept-visibility-change-consequences
```
…or uses the GitHub UI: Settings → General → Danger Zone → Change repository visibility → Make private.

- [ ] **Step 2: Verify the flip took effect**

Run:
```
gh repo view yannicktian/meetups --json visibility
```

Expected output: `{"visibility":"PRIVATE"}`

- [ ] **Step 3: Trigger a Vercel rebuild and verify it still works**

Option A (clean): make a trivial commit and push.
```
# Make sure there's nothing to commit first. If there's an in-progress
# change, commit that normally instead.
git commit --allow-empty -m "chore: trigger Vercel rebuild after visibility flip"
git push origin main
```

Option B (if you don't want an empty commit): in Vercel dashboard, go to the `meetups-talk` project → Deployments → the latest deployment → click "Redeploy".

- [ ] **Step 4: Watch the Vercel deployment**

If Vercel CLI is linked to the project:
```
vercel ls
```
Then inspect the most recent deployment's status. Or watch in the Vercel dashboard.

Expected: Deployment transitions through Building → Ready. `https://meetups-talk.vercel.app` still renders the deck.

If the Vercel deploy fails with a permissions error related to the private repo, re-auth the Vercel GitHub app (Vercel dashboard → Settings → Git → Reconnect). This is the only known post-flip failure mode.

- [ ] **Step 5: Confirm before proceeding**

Do not move to Task 7 until `meetups-talk.vercel.app` renders correctly from the now-private repo.

---

## Task 7: Create the public `yannicktian/year-of-harnesses` repo

**Files:** none (GitHub API / `gh` CLI action)

**Why:** Empty remote target for the sync script to push into. Created empty (no README, no LICENSE) because the overlay supplies everything.

- [ ] **Step 1: Create the repo**

Run:
```
gh repo create yannicktian/year-of-harnesses \
  --public \
  --description "Interactive slides for 'The Year of Harnesses' — AI.xperience Marseille, April 2026"
```

Expected output: `✓ Created repository yannicktian/year-of-harnesses on GitHub`
Expected URL: `https://github.com/yannicktian/year-of-harnesses`

- [ ] **Step 2: Verify the repo exists and is empty**

Run:
```
gh repo view yannicktian/year-of-harnesses --json name,visibility,isEmpty,defaultBranchRef
```

Expected:
```json
{
  "defaultBranchRef": null,
  "isEmpty": true,
  "name": "year-of-harnesses",
  "visibility": "PUBLIC"
}
```

`defaultBranchRef` is `null` because no commits exist yet — that's fine, the sync script will create `main` on first push.

---

## Task 8: Enable GitHub Pages with "GitHub Actions" source

**Files:** none (GitHub API action)

**Why:** By default, a new repo has no Pages site. We must enable it and set the build source to "GitHub Actions" (not the legacy branch-based source) so our `deploy.yml` workflow can deploy.

- [ ] **Step 1: Enable Pages via GitHub API**

Run:
```
gh api --method POST \
  repos/yannicktian/year-of-harnesses/pages \
  -f build_type=workflow
```

Expected output: JSON blob containing `"build_type": "workflow"` and `"html_url": "https://yannicktian.github.io/year-of-harnesses/"`.

If this fails with `422 Not Found` or similar (the Pages API can be finicky on brand-new repos before the first commit exists), skip to Step 2's fallback. The public repo first sync (Task 9) will create the first commit and the Pages API will become callable after that — we'll retry this step post-sync.

- [ ] **Step 2: Fallback — enable Pages via UI (if API failed)**

1. Open `https://github.com/yannicktian/year-of-harnesses/settings/pages` in a browser.
2. Under "Build and deployment", set Source to **GitHub Actions**.
3. Save.

Alternatively, if the API failed because the repo is empty, mark this task as blocked and proceed to Task 9 to create the first commit. Come back and run Step 1 again after the sync push lands.

- [ ] **Step 3: Verify Pages is enabled**

Run:
```
gh api repos/yannicktian/year-of-harnesses/pages 2>&1
```

Expected: JSON containing `"build_type": "workflow"` and an `html_url`. If the output is `gh: Not Found (HTTP 404)`, Pages is not yet enabled — return to Step 1 or Step 2.

---

## Task 9: First sync — push curated content to the public repo

**Files:** none (executes `scripts/sync-public-repo.sh`)

**Why:** Initial bootstrap of the public repo's contents. After this runs successfully, the public repo has source + overlay committed and the deploy workflow will kick off automatically.

- [ ] **Step 1: Ensure private repo working tree is clean**

Run:
```
git status --short
```

Expected: empty output (clean tree). The sync script labels commits with the private SHA; a clean tree means the label is accurate.

If there are uncommitted changes, commit or stash them before running the sync.

- [ ] **Step 2: Run the sync script**

Run:
```
pnpm sync:public
```

Expected interactive output:
```
→ Cloning public repo into scratch dir...
Cloning into '/tmp/year-of-harnesses-sync.XXXXXX'...
warning: You appear to have cloned an empty repository.
→ Wiping scratch working tree (keeping .git)...
→ Copying allowlisted source files...
→ Overlaying public-repo-overlay/...
→ Preview of what will be synced:
A  .github/workflows/deploy.yml
A  .gitignore
A  LICENSE
A  README.md
A  eslint.config.mjs
A  next.config.ts
A  package.json
A  pnpm-lock.yaml
A  postcss.config.mjs
A  public/avatar_YT_small.jpg
A  src/app/globals.css
A  src/app/layout.tsx
A  src/app/page.tsx
A  src/components/<...many files...>
A  src/content/slides.ts
A  src/lib/<...many files...>
A  tsconfig.json

Proceed with commit & push? [y/N]
```

- [ ] **Step 3: Visually verify the preview**

**BEFORE typing `y`**, read the diff preview carefully. Confirm:
- All entries are under allowlisted paths.
- NO `docs/`, `knowledge-base/`, `PROGRESS.md`, `CLAUDE.md`, `AGENTS.md`, `.claude/`, `.superpowers/`, `.vercel/`, `.worktrees/`, `scripts/`, or `public-repo-overlay/` entries are present.
- `README.md`, `LICENSE`, `.gitignore`, and `.github/workflows/deploy.yml` ARE present (from the overlay).

If anything looks wrong, press `N` to abort, fix the issue, and re-run.

- [ ] **Step 4: Confirm and push**

Type `y` and press Enter.

Expected final output:
```
[main <sha>] Sync from private @ <private-sha>
 XX files changed, XXX insertions(+)
 create mode 100644 .github/workflows/deploy.yml
 ... (many more)
Enumerating objects: ...
Writing objects: 100% (..../....)
To github.com:yannicktian/year-of-harnesses.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main' from 'origin'.
✓ Pushed to git@github.com:yannicktian/year-of-harnesses.git
```

- [ ] **Step 5: If Task 8 Step 1 failed earlier, retry Pages enable now**

The repo now has a first commit, so the Pages API should be callable.

Run:
```
gh api --method POST \
  repos/yannicktian/year-of-harnesses/pages \
  -f build_type=workflow
```

Expected: success JSON as in Task 8 Step 1.

If it still fails, use the UI fallback (Task 8 Step 2).

---

## Task 10: Watch the GitHub Actions deploy and verify the live URL

**Files:** none (observation + end-to-end smoke test)

**Why:** Confirm the workflow runs, the static export succeeds in CI, the Pages artifact uploads, and the live URL renders.

- [ ] **Step 1: Watch the deploy workflow run**

Run:
```
gh run watch -R yannicktian/year-of-harnesses
```

If there are multiple runs, `gh run watch` will prompt you to select one — pick the most recent `Deploy to GitHub Pages` run.

Expected: workflow transitions through `queued` → `in_progress` → `completed` with result `success`. Both `build` and `deploy` jobs pass.

Typical runtime: 2-4 minutes (install + build + deploy).

- [ ] **Step 2: If the build job fails, triage**

Run:
```
gh run view -R yannicktian/year-of-harnesses --log-failed
```

Common failure modes and fixes:
- `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH` — lockfile was generated with a different pnpm version. Fix: update `deploy.yml` to match your local pnpm major version, re-sync.
- `Error: No such file or directory .../out` — static export didn't emit `out/`. Fix: re-check `GH_PAGES=true pnpm build` works locally (Task 2), fix and re-sync.
- `Get "...": dial tcp: lookup proxy.golang.org" or similar` — transient network; re-run the workflow: `gh run rerun -R yannicktian/year-of-harnesses`.
- `Error: Failed to deploy to Pages: Unable to get Pages site...` — Pages not enabled. Return to Task 8.

- [ ] **Step 3: Verify the live URL**

Open `https://yannicktian.github.io/year-of-harnesses/` in a browser.

Expected: the deck loads, showing the Hero slide.

- [ ] **Step 4: End-to-end smoke test on the live URL**

Walk through the entire deck via arrow keys. Repeat the same verification checklist from Task 2 Step 3 — every slide type, every interactive component, every animation. Specifically confirm:
- All images load (no 404s in browser devtools Network tab)
- Fonts render
- Shiki code highlighting renders with colors
- All animations play
- Top nav works
- Hash navigation (`#slide-id`) works
- Arrow keys navigate
- Interactive slides (SmsConversation, PrerequisiteSetup, ArchitectureDiagram) work

Open browser devtools → Network tab → reload → verify no 404s on any static asset.

- [ ] **Step 5: Final sanity check on the public repo**

Run:
```
gh repo view yannicktian/year-of-harnesses --json visibility,description,isEmpty,pushedAt
gh api repos/yannicktian/year-of-harnesses/pages --jq '.html_url,.status,.build_type'
```

Expected:
- Repo is public, not empty, has a description.
- Pages `status` is `built` and `build_type` is `workflow`.
- `html_url` is `https://yannicktian.github.io/year-of-harnesses/`.

- [ ] **Step 6: Update private repo's `PROGRESS.md` with the public mirror info**

Add a short section to the existing `PROGRESS.md` documenting the mirror so future sessions know about it.

Read current `PROGRESS.md` (file is already in context). Add a new section under `## Where things stand` and before `## Talk thesis`, something like:

```markdown
**Public mirror:** https://yannicktian.github.io/year-of-harnesses (repo: https://github.com/yannicktian/year-of-harnesses, auto-deploys via GH Actions from curated sync)
**Sync command:** `pnpm sync:public` (allowlist-driven, human-confirmed — see `scripts/sync-public-repo.sh`)
```

Commit:
```
git add PROGRESS.md
git commit -m "docs: record public mirror + sync command in PROGRESS"
git push origin main
```

---

## Validation / Exit Criteria

When every checkbox above is ticked, verify the spec's validation checklist (from `docs/superpowers/specs/2026-04-09-public-mirror-design.md` § "Validation checklist"):

- [ ] `yannicktian/meetups` is private; Vercel deploy still works.
- [ ] `GH_PAGES=true pnpm build` completes cleanly in the private repo.
- [ ] `yannicktian/year-of-harnesses` exists and is public.
- [ ] GH Pages is enabled with source = GitHub Actions.
- [ ] First sync pushes exactly the allowlisted files + overlay, nothing else.
- [ ] GH Actions build passes.
- [ ] Live URL renders the deck at `https://yannicktian.github.io/year-of-harnesses/`.
- [ ] All slides, animations, and interactive components work on the live URL.
- [ ] Public repo's README has no references to private engineering material.
- [ ] Private `PROGRESS.md` documents the mirror for future sessions.

---

## Rollback

If any step fails unrecoverably:

- **Private repo changes:** `git revert <commit>` any of the commits from Tasks 1, 3, 4, 5. Private repo returns to its previous state. Vercel deployment is unaffected because the `next.config.ts` change is backward compatible (GH_PAGES unset = old behavior).
- **Public repo:** delete via `gh repo delete yannicktian/year-of-harnesses --yes` (destructive; only do this if the repo is a throwaway). Re-run Task 7 onwards.
- **Visibility flip:** reverse via `gh repo edit yannicktian/meetups --visibility public --accept-visibility-change-consequences`.

Nothing in this plan is destructive to existing slide content or the Vercel deployment.
