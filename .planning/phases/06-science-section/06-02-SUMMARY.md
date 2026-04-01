---
phase: 06-science-section
plan: "02"
subsystem: ui
tags: [nextjs, mdx, tailwind, next-intl, science, content, pagination, ssg]

# Dependency graph
requires:
  - phase: 06-01
    provides: ScienceCard, ScienceCardGrid, SciencePrevNext components; lib/content/science.ts with getScienceEntries/getScienceBySlug; 5 seed MDX explainers; dictionary keys
provides:
  - Science listing page at /en/science (card grid, difficulty badges, pagination)
  - Pagination routes at /en/science/page/[page]
  - Science detail pages at /en/science/[slug] (MDX content, difficulty badge, Further Reading, prev/next)
  - Unit tests for pagination logic, prev/next, difficulty field coverage
affects: [07-skills-section, 08-homepage, 09-seo-sitemap]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Science listing/pagination/detail follows identical App Router route pattern as articles section
    - PaginationBar reused from diary components with basePath="science" (no duplication)
    - Dynamic MDX import uses relative path from app route to project-root content/ (same as diary/articles pattern)
    - ISR revalidate=3600 on all science routes
    - difficulty badge DIFFICULTY_STYLES record renders inline on detail page header

key-files:
  created:
    - src/app/[lang]/science/page.tsx
    - src/app/[lang]/science/page/[page]/page.tsx
    - src/app/[lang]/science/[slug]/page.tsx
    - src/__tests__/science.test.ts
  modified: []

key-decisions:
  - "Science route pages mirror articles section pattern exactly — same page structure, import paths, ISR, and empty state handling"
  - "PaginationBar from diary reused for science with basePath=science — avoids third duplicate component"
  - "difficulty badge DIFFICULTY_STYLES inlined on detail page header (same record as ScienceCard) — no extra component needed"

patterns-established:
  - "Science detail page: difficulty badge rendered in header using same DIFFICULTY_STYLES as ScienceCard card view"
  - "Further Reading section: rendered automatically as part of MDX prose content — no special component"
  - "Prev/next direction: newest-first array means prevEntry (older) is at higher index, nextEntry (newer) at lower index"

requirements-completed: [SCIE-01, SCIE-02]

# Metrics
duration: 8min
completed: 2026-04-01
---

# Phase 06 Plan 02: Science Route Pages Summary

**Science listing, pagination, and MDX detail pages at /en/science with difficulty badges, Further Reading, prev/next navigation, and per-page OG metadata**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-04-01T11:22:29Z
- **Completed:** 2026-04-01T11:30:00Z
- **Tasks:** 2 (1 auto + 1 human-verify)
- **Files modified:** 4

## Accomplishments

- Science listing page at /en/science renders 5 explainers in a responsive card grid (1/2/3 columns) with color-coded difficulty badges (green/yellow/red)
- Detail pages at /en/science/[slug] render full MDX content with difficulty badge in header, tag pills, Further Reading section, and prev/next navigation
- Unit tests validate pagination slicing, prev/next logic, seed explainer presence, difficulty field coverage (beginner/intermediate/advanced), and getScienceBySlug correctness
- next build completes with all science routes statically generated; ISR revalidate=3600 for OpenClaw content publishing

## Task Commits

Each task was committed atomically:

1. **Task 1: Science route pages and tests** - `957510f` (feat)
2. **Task 2: Visual verification** - approved by user (no code changes)

**Plan metadata:** (docs commit — created with this summary)

## Files Created/Modified

- `src/app/[lang]/science/page.tsx` - Science listing page (page 1), generateMetadata, ScienceCardGrid + ScienceCard rendering, PaginationBar with basePath="science"
- `src/app/[lang]/science/page/[page]/page.tsx` - Pagination routes for /science/page/N; redirects page=1 to base route; generateStaticParams
- `src/app/[lang]/science/[slug]/page.tsx` - Detail page with MDX rendering, difficulty badge in header, Further Reading in prose wrapper, SciencePrevNext at bottom
- `src/__tests__/science.test.ts` - Unit tests for pagination, prev/next, seed validation, difficulty field coverage

## Decisions Made

- Science route pages mirror articles section pattern exactly — same page structure, import paths, ISR, and empty state handling. Reduces cognitive overhead and makes OpenClaw's content publishing predictable.
- PaginationBar from diary reused for science (basePath="science") — avoids third duplicate component, establishing the basePath parameter as the reuse mechanism.
- difficulty badge rendered inline on detail page header using same DIFFICULTY_STYLES record as ScienceCard — consistent visual language without a separate component.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Science section fully functional and visually verified — ready for Phase 07 (skills section)
- All 5 seed explainers browseable at /en/science with difficulty filtering visually present
- Detail pages confirmed: difficulty badge, Further Reading links, prev/next navigation all working
- No blockers for Phase 07

---
*Phase: 06-science-section*
*Completed: 2026-04-01*
