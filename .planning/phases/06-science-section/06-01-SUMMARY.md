---
phase: 06-science-section
plan: 01
subsystem: ui
tags: [mdx, content, science, tailwind, typescript, next-intl, i18n]

# Dependency graph
requires:
  - phase: 05-articles-section
    provides: ArticleCard, ArticlePrevNext, ArticleCardGrid patterns used as direct reference
  - phase: 04-diary-section
    provides: PaginationBar reused directly (basePath="science")
provides:
  - 5 seed science explainer MDX files with frontmatter including required difficulty field
  - Full science UI strings in en.json including difficulty sub-object for i18n-ready badge labels
  - ScienceCard component with green/yellow/red difficulty badge and mascot placeholder
  - ScienceCardGrid responsive 1/2/3 column grid wrapper
  - SciencePrevNext explainer navigation component
  - Updated content.test.ts expecting 5 seed science entries
affects: [06-science-section plan 02 (route pages will compose these components)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Slug char-code hash determinism for mascot pose/background (same as articles — no dayNumber on science)
    - Difficulty badge as color-coded pill using DIFFICULTY_STYLES record (green/yellow/red)
    - Science components are server components (no 'use client') — CSS-only hover effects
    - Separate ScienceCardGrid from ArticleCardGrid for section decoupling
    - dict.difficulty[entry.difficulty] lookup for i18n-ready badge labels

key-files:
  created:
    - content/science/what-is-artificial-intelligence.mdx
    - content/science/how-do-chatbots-work.mdx
    - content/science/what-are-neural-networks.mdx
    - content/science/understanding-machine-learning.mdx
    - content/science/what-is-prompt-engineering.mdx
    - src/components/science/ScienceCard.tsx
    - src/components/science/ScienceCardGrid.tsx
    - src/components/science/SciencePrevNext.tsx
  modified:
    - dictionaries/en.json
    - src/__tests__/content.test.ts

key-decisions:
  - "ScienceCard difficulty badge uses DIFFICULTY_STYLES Record<string, string> with Tailwind green/yellow/red color-coded classes keyed by difficulty value"
  - "dict.difficulty[entry.difficulty] access uses keyof typeof cast to satisfy TypeScript since difficulty is a string from the Zod enum"
  - "ScienceCardGrid is science-specific copy of ArticleCardGrid for section decoupling — same rationale as articles vs diary"
  - "PaginationBar from diary is not duplicated — reused in Plan 02 route pages with basePath=science"

patterns-established:
  - "Difficulty badge: DIFFICULTY_STYLES record + dict lookup makes badge both visually coded and i18n-ready"
  - "Science card first row: difficulty badge + tag pills in same flex-wrap row — badge precedes tags"

requirements-completed: [SCIE-03]

# Metrics
duration: 5min
completed: 2026-04-01
---

# Phase 6 Plan 1: Science Seed Content and UI Components Summary

**5 MDX science explainers (beginner/intermediate), science dictionary keys with difficulty sub-object, and 3 server-component UI building blocks (ScienceCard, ScienceCardGrid, SciencePrevNext)**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-04-01T12:36:33Z
- **Completed:** 2026-04-01T12:41:13Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments

- Created 5 seed science explainers covering AI basics, chatbots, neural networks, machine learning, and prompt engineering — each 500-1200 words in accessible plain language with a ## Further Reading section
- Extended en.json science key with all required UI strings including a `difficulty` sub-object mapping beginner/intermediate/advanced values to display labels for i18n-ready badges
- Built ScienceCard with color-coded difficulty badge (green=beginner, yellow=intermediate, red=advanced), deterministic mascot placeholder via slug hash, tag pills, title, date, and excerpt
- ScienceCardGrid and SciencePrevNext created as server components mirroring the articles section pattern

## Task Commits

Each task was committed atomically:

1. **Task 1: Seed science content, dictionary keys, and update content.test.ts** - `c5ad98a` (feat)
2. **Task 2: Science UI components** - `e02bd99` (feat)

## Files Created/Modified

- `content/science/what-is-artificial-intelligence.mdx` - Seed explainer, ~800 words, difficulty: beginner
- `content/science/how-do-chatbots-work.mdx` - Seed explainer, ~700 words, difficulty: beginner
- `content/science/what-are-neural-networks.mdx` - Seed explainer, ~900 words, difficulty: intermediate
- `content/science/understanding-machine-learning.mdx` - Seed explainer, ~800 words, difficulty: intermediate
- `content/science/what-is-prompt-engineering.mdx` - Seed explainer, ~600 words, difficulty: beginner
- `dictionaries/en.json` - Added complete science UI strings including difficulty sub-object
- `src/__tests__/content.test.ts` - Updated getScienceEntries test to expect 5 seed entries (was: empty array)
- `src/components/science/ScienceCard.tsx` - Card with difficulty badge, mascot placeholder, tag pills
- `src/components/science/ScienceCardGrid.tsx` - Responsive grid wrapper for science cards
- `src/components/science/SciencePrevNext.tsx` - Prev/next explainer navigation

## Decisions Made

- Difficulty badge uses `DIFFICULTY_STYLES: Record<string, string>` + `dict.difficulty` lookup so colors are code-defined and labels are dictionary-driven (i18n-ready from day one)
- Used `as keyof typeof dict.difficulty` cast in ScienceCard to satisfy TypeScript for dynamic property access
- ScienceCardGrid is a science-specific copy rather than re-exporting ArticleCardGrid — keeps sections independently evolvable
- PaginationBar from diary/ is not duplicated in science/ — Plan 02 route pages will import it directly with basePath="science"

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All presentational building blocks are in place for Plan 02 (science route pages)
- Plan 02 will compose: ScienceCard + ScienceCardGrid for the listing page, SciencePrevNext for the detail page, PaginationBar from diary with basePath="science"
- Zero TypeScript errors across entire project

## Self-Check: PASSED

All files confirmed present on disk. Commits c5ad98a and e02bd99 verified in git log.

---
*Phase: 06-science-section*
*Completed: 2026-04-01*
