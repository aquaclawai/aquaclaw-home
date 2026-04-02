---
phase: 08-homepage
plan: 01
subsystem: ui
tags: [react, tailwind, nextjs, i18n, server-components, homepage]

# Dependency graph
requires:
  - phase: 07-skill-packs-section
    provides: SkillCard component and SkillEntry type for FeaturedContent
  - phase: 06-science-section
    provides: ScienceCard component and ScienceEntry type for FeaturedContent
  - phase: 05-articles-section
    provides: ArticleCard component and ArticleEntry type for FeaturedContent
  - phase: 04-diary-section
    provides: diary content getters for carousel data
  - phase: 02-design-system
    provides: MascotImage component, animation tokens (animate-float, animate-bounce-in)
provides:
  - dictionaries/en.json home key with all homepage text (hero, stats, carousel, valueProp, featured)
  - HeroSection server component with mascot waving + float animation, tagline, sub-copy, CTA
  - ValuePropGrid server component with 4-item capability grid from dict
  - FeaturedContent server component threading ArticleCard, ScienceCard, SkillCard with dict.science.difficulty
  - homepage test scaffold with 16 tests covering dict structure, content getters, and carousel index arithmetic
affects: [08-02-homepage-orchestrator, plan-02]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Server component props receive full dict object (typeof import) for type safety"
    - "FeaturedContent receives pre-sliced arrays from parent — no content fetching inside component"
    - "ITEM_ICONS constant array maps index to emoji — simple positional lookup, no i18n needed for icons"

key-files:
  created:
    - dictionaries/en.json (home key added)
    - src/__tests__/homepage.test.ts
    - src/components/home/HeroSection.tsx
    - src/components/home/ValuePropGrid.tsx
    - src/components/home/FeaturedContent.tsx
  modified:
    - dictionaries/en.json

key-decisions:
  - "HeroSection imports typeof en from dictionaries/en.json directly for precise TypeScript inference — no manual interface duplication"
  - "FeaturedContent receives full dict (typeof en) to thread dict.science.difficulty to ScienceCard — parent slices to 3 entries before passing"
  - "ValuePropGrid accepts a narrow dict prop shape (not full dict) to keep component self-contained and reusable"

patterns-established:
  - "Home component props: lang + dict slice pattern — server components receive pre-fetched data, not fetch themselves"
  - "ITEM_ICONS as const array maps positional index to emoji — no string key needed since order is fixed by plan"

requirements-completed: [HOME-01, HOME-04, HOME-05]

# Metrics
duration: 7min
completed: 2026-04-01
---

# Phase 8 Plan 01: Homepage Foundation Summary

**Homepage dictionary (home key), test scaffold (16 tests, all passing), and three server components (HeroSection, ValuePropGrid, FeaturedContent) composing all content-section card components**

## Performance

- **Duration:** 7 min
- **Started:** 2026-04-01T16:19:24Z
- **Completed:** 2026-04-01T16:26:30Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Added complete `home` dictionary key to `dictionaries/en.json` (hero, stats, carousel, valueProp, featured sub-keys) — all text needed by Plan 02 page orchestrator
- Created homepage test scaffold with 16 passing tests: dict structure validation, content getter availability checks, and carousel index wrap arithmetic
- Built three server-rendered section components ready for composition in `page.tsx`: HeroSection (mascot waving + animate-float, tagline, sub-copy, CTA pill), ValuePropGrid (4-item grid with emoji icons), FeaturedContent (3-section grid using ArticleCard, ScienceCard with dict.science.difficulty threading, SkillCard)

## Task Commits

1. **Task 1: Add homepage dictionary keys and test scaffold** - `adcd16f` (feat)
2. **Task 2: Create HeroSection, ValuePropGrid, and FeaturedContent server components** - `2a1fd6c` (feat)

## Files Created/Modified

- `dictionaries/en.json` - Added `home` key with hero, stats, carousel, valueProp, featured sub-keys
- `src/__tests__/homepage.test.ts` - 16-test suite for dict structure, content getters, carousel arithmetic
- `src/components/home/HeroSection.tsx` - Centered hero with waving mascot, tagline, sub-copy, diary CTA link
- `src/components/home/ValuePropGrid.tsx` - 2x2 grid of capability cards from dict.home.valueProp.items
- `src/components/home/FeaturedContent.tsx` - 3-section featured layout using all existing card components

## Decisions Made

- `HeroSection` uses `typeof import('dictionaries/en.json')['home']` for the dict prop type — avoids duplicating the interface and stays in sync with the JSON automatically.
- `FeaturedContent` receives the full `typeof en` dict so it can thread `dict.science.difficulty` to `ScienceCard`. Parent page (Plan 02) will slice arrays to 3 entries before passing.
- `ValuePropGrid` accepts a narrow `{ heading, items }` prop shape (not the full dict) — keeps the component reusable and its interface self-documenting.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All three section components export correctly with no TypeScript errors
- All 16 homepage tests pass
- Plan 02 can now import HeroSection, ValuePropGrid, FeaturedContent and wire them into `app/[lang]/page.tsx`
- Plan 02 will add DiaryCarousel (client island), StatsBar (client island), and the page orchestrator

---
*Phase: 08-homepage*
*Completed: 2026-04-01*
