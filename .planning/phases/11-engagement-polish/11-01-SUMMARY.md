---
phase: 11-engagement-polish
plan: 01
subsystem: ui
tags: [giscus, comments, github-discussions, engagement, lazy-loading]

# Dependency graph
requires:
  - phase: 04-diary-section
    provides: diary detail page (src/app/[lang]/diary/[slug]/page.tsx) with DiaryPrevNext insertion point
  - phase: 05-articles-section
    provides: article detail page (src/app/[lang]/articles/[slug]/page.tsx) with ArticlePrevNext insertion point
provides:
  - GiscusComments client component with lazy loading and graceful env var guard
  - GitHub Discussions-backed comment widget on diary and article detail pages
  - NEXT_PUBLIC_GISCUS_REPO_ID and NEXT_PUBLIC_GISCUS_CATEGORY_ID env var placeholders in .env.example
affects: [11-engagement-polish]

# Tech tracking
tech-stack:
  added: ["@giscus/react ^3.x"]
  patterns:
    - "Env var guard pattern: component returns null when public env vars are unset — prevents broken iframes in dev/CI"
    - "Giscus lazy loading: loading=lazy defers iframe until near-viewport for Lighthouse performance"
    - "mapping=pathname: each page URL auto-maps to a unique GitHub Discussion"

key-files:
  created:
    - src/components/engagement/GiscusComments.tsx
    - src/__tests__/engagement.test.ts
  modified:
    - src/app/[lang]/diary/[slug]/page.tsx
    - src/app/[lang]/articles/[slug]/page.tsx
    - .env.example
    - package.json

key-decisions:
  - "GiscusComments returns null when env vars unset — prevents broken iframes in development and CI environments"
  - "loading=lazy on Giscus iframe — defers load until near-viewport for Lighthouse performance"
  - "Giscus NOT embedded on science detail pages — per plan decision D-01, only diary and article pages"
  - "preferred_color_scheme theme — matches site CSS prefers-color-scheme, no manual dark/light toggle needed"

patterns-established:
  - "Env var guard: public env vars checked at render time, return null if missing — use for all optional third-party widgets"

requirements-completed: [ENGG-01]

# Metrics
duration: 4min
completed: 2026-04-02
---

# Phase 11 Plan 01: Engagement Polish Summary

**@giscus/react comment widget embedded on diary and article detail pages with lazy loading and graceful env var guard**

## Performance

- **Duration:** ~45 min (including user GitHub Discussions setup)
- **Started:** 2026-04-02T02:16:35Z
- **Completed:** 2026-04-02T02:58:04Z
- **Tasks:** 2 of 2
- **Files modified:** 7 + 3 RSS route fixes

## Accomplishments
- Installed `@giscus/react` and created `GiscusComments` client component with `loading="lazy"` and graceful null return when env vars are unset
- Embedded `GiscusComments` in diary and article detail pages after the prev/next navigation section
- Added `NEXT_PUBLIC_GISCUS_REPO_ID` and `NEXT_PUBLIC_GISCUS_CATEGORY_ID` env var placeholders to `.env.example`
- Created `src/__tests__/engagement.test.ts` with 11 passing tests verifying component structure, lazy loading, and page integration

## Task Commits

Each task was committed atomically:

1. **Task 1: Install @giscus/react, create GiscusComments component, embed in detail pages, add tests** - `3107890` (feat)
2. **Task 2: Verify Giscus comment widget on diary and article pages** - user approved visual verification

**Additional commits (post-checkpoint):**
- `3d32839` (fix) — Updated Giscus `inputPosition` to `"bottom"` per user's real GitHub Discussions config
- `da54f37` (fix) — Redirect root `page.tsx` to `/en` instead of showing Next.js default page

**Plan metadata:** (see final commit in this session)

## Files Created/Modified
- `src/components/engagement/GiscusComments.tsx` - 'use client' Giscus wrapper with env var guard and lazy loading
- `src/__tests__/engagement.test.ts` - 11 tests for ENGG-01 engagement widget integration
- `src/app/[lang]/diary/[slug]/page.tsx` - Added GiscusComments import and render after DiaryPrevNext
- `src/app/[lang]/articles/[slug]/page.tsx` - Added GiscusComments import and render after ArticlePrevNext
- `.env.example` - Added NEXT_PUBLIC_GISCUS_REPO_ID and NEXT_PUBLIC_GISCUS_CATEGORY_ID placeholders
- `package.json` / `package-lock.json` - Added @giscus/react dependency

## Decisions Made
- `GiscusComments` returns `null` when env vars are unset — clean pattern for optional third-party widgets that require external service config
- `loading="lazy"` on Giscus iframe — defers iFrame load until near-viewport, protecting Lighthouse scores
- `mapping="pathname"` — each page URL auto-maps to a unique GitHub Discussion, zero manual configuration per post
- `preferred_color_scheme` theme — respects OS/browser dark mode preference without site-side logic

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed broken relative import paths in all three RSS route handlers**
- **Found during:** Task 1 (build verification)
- **Issue:** `src/app/rss/diary.xml/route.ts`, `src/app/rss/articles.xml/route.ts`, and `src/app/rss/science.xml/route.ts` all used `../../../../../lib/content/*` (5 levels up) when only 4 levels are needed to reach project root from that directory depth
- **Fix:** Changed all three to `../../../../lib/content/*` (correct 4-level path)
- **Files modified:** src/app/rss/diary.xml/route.ts, src/app/rss/articles.xml/route.ts, src/app/rss/science.xml/route.ts
- **Verification:** `npm run build` passed with 0 errors after fix
- **Committed in:** 3107890 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - pre-existing bug in 3 RSS route files)
**Impact on plan:** RSS feeds were previously broken (404 on build). Fix restores intended functionality. No scope creep — same pattern as other relative path fixes throughout the codebase.

## Issues Encountered
- RSS route handlers in `src/app/rss/` had been committed in a previous phase (10-automation-api-layer) with incorrect import depths — discovered during build verification and fixed inline.

## User Setup Required

**External service requires manual configuration before the Giscus widget renders.**

To activate comments:
1. Enable GitHub Discussions on `aquaclawai/aquaclaw-home`: GitHub repo Settings → Features → check "Discussions"
2. Create a "Comments" category in Discussions (Announcement type recommended to prevent off-topic threads)
3. Visit https://giscus.app, enter repo `aquaclawai/aquaclaw-home`, select "Comments" category
4. Copy the generated `data-repo-id` and `data-category-id` values
5. Add to `.env.local`:
   ```
   NEXT_PUBLIC_GISCUS_REPO_ID=<paste repo-id>
   NEXT_PUBLIC_GISCUS_CATEGORY_ID=<paste category-id>
   ```

Without these env vars, the widget returns null (no broken iframe, no error). The site ships and builds correctly without them.

## Next Phase Readiness
- Giscus comment widget is fully configured and verified rendering on diary and article pages
- GitHub Discussions is live on `aquaclawai/aquaclaw-home` with real repoId and categoryId configured in env vars
- Science pages confirmed Giscus-free (per D-01 decision)
- Root page now redirects to `/en` instead of showing Next.js default — site is user-facing ready

---
*Phase: 11-engagement-polish*
*Completed: 2026-04-02*
