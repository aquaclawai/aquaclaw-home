---
phase: 04-diary-section
plan: 02
subsystem: ui
tags: [next.js, mdx, diary, routing, pagination, i18n, ssg, isr, vitest]

# Dependency graph
requires:
  - phase: 04-01
    provides: "DiaryCard, DiaryCardGrid, PaginationBar, DiaryPrevNext components; getDiaryEntries/getDiaryEntry lib; 5 seed MDX entries; dictionary diary keys"

provides:
  - "Diary listing page at /[lang]/diary with card grid, ISR revalidation"
  - "Pagination route at /[lang]/diary/page/[page] with generateStaticParams"
  - "Diary detail page at /[lang]/diary/[slug] with MDX rendering, prev/next nav, OG metadata"
  - "17 unit tests for pagination logic, prev/next logic, seed entry validation"

affects: [homepage, sitemap, 04-03]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Dynamic MDX import via import() with relative path from app route to project-root content/"
    - "Prev/next computation: newest-first array, prevEntry=higher index (older), nextEntry=lower index (newer)"
    - "Pagination redirect: page/1 redirects to /diary base route to avoid duplicate content"
    - "Fallback MDX rendering: raw entry.content if dynamic import fails"

key-files:
  created:
    - src/app/[lang]/diary/page.tsx
    - src/app/[lang]/diary/page/[page]/page.tsx
    - src/app/[lang]/diary/[slug]/page.tsx
    - src/__tests__/diary.test.ts
  modified: []

key-decisions:
  - "Dynamic MDX import uses relative path (../../../../../content/diary/${slug}.mdx) not @/ alias since content/ is at project root outside src/"
  - "Detail page falls back to raw entry.content rendering if MDX dynamic import fails at build time"
  - "Prev/next: entries are newest-first so prevEntry (older) = entries[currentIndex + 1], nextEntry (newer) = entries[currentIndex - 1]"
  - "Pagination page 1 redirects to /diary base route — avoids duplicate content for SEO"

patterns-established:
  - "App Router diary routes follow [lang] param awaiting pattern consistently"
  - "ISR via revalidate = 3600 on all diary pages — allows OpenClaw content publishing to trigger refresh"
  - "generateStaticParams on [slug] page generates all locale x slug combinations at build time"

requirements-completed: [DIAR-01, DIAR-02]

# Metrics
duration: 3min
completed: 2026-04-01
---

# Phase 4 Plan 02: Diary Route Pages Summary

**Three App Router route files wiring Plan 01 components into working /en/diary listing, /en/diary/page/N pagination, and /en/diary/[slug] detail pages with MDX rendering, prev/next navigation, and per-page OG metadata**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-01T09:29:23Z
- **Completed:** 2026-04-01T09:32:03Z
- **Tasks:** 1 of 2 (Task 2 is visual verification checkpoint — awaiting human)
- **Files modified:** 4

## Accomplishments
- Diary listing page renders all 5 seed entries in a responsive card grid with ISR
- Diary detail page renders MDX content via dynamic import with prev/next navigation and OG metadata per entry
- Pagination route generates static routes for page 2+ with redirect of page 1 to /diary
- 17 unit tests covering pagination slicing, prev/next correctness, seed entry validation, and date sorting

## Task Commits

Each task was committed atomically:

1. **Task 1: Diary route pages and tests** - `70e37df` (feat)

**Plan metadata:** (pending — awaiting checkpoint completion)

## Files Created/Modified
- `src/app/[lang]/diary/page.tsx` — Listing page (page 1), ISR, generateMetadata
- `src/app/[lang]/diary/page/[page]/page.tsx` — Pagination routes with generateStaticParams
- `src/app/[lang]/diary/[slug]/page.tsx` — Detail page with MDX rendering, prev/next, OG metadata
- `src/__tests__/diary.test.ts` — 17 unit tests for pagination, prev/next, seed entries

## Decisions Made
- Used relative import path `../../../../../content/diary/${slug}.mdx` for dynamic MDX imports (content/ is at project root, not inside src/, so @/ alias doesn't work)
- Added MDX import fallback to raw entry.content rendering — prevents build failure if MDX import has issues
- Pagination redirects page=1 to /diary base route to prevent duplicate content indexed by search engines
- Prev/next direction: entries array is newest-first, so "prev" (older entry) is at higher array index, "next" (newer entry) at lower index

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered
None — build passed cleanly on first attempt with all 207 tests passing.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Diary section fully functional after Task 2 visual verification
- All 5 seed entries accessible at /en/diary/day-001 through /en/diary/day-005
- Prev/next navigation works correctly across all entries
- Ready for Phase 05 (articles section) or homepage aggregation

---
*Phase: 04-diary-section*
*Completed: 2026-04-01*

## Self-Check: PASSED

Files exist:
- FOUND: src/app/[lang]/diary/page.tsx
- FOUND: src/app/[lang]/diary/page/[page]/page.tsx
- FOUND: src/app/[lang]/diary/[slug]/page.tsx
- FOUND: src/__tests__/diary.test.ts

Commits exist:
- FOUND: 70e37df (feat(04-02): add diary listing, pagination, and detail route pages)
