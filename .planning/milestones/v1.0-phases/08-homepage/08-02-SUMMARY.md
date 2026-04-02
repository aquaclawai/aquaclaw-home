---
phase: 08-homepage
plan: 02
subsystem: ui
tags: [next.js, react, tailwind, animation, intersection-observer, requestAnimationFrame, carousel, i18n]

# Dependency graph
requires:
  - phase: 08-homepage/08-01
    provides: HeroSection, ValuePropGrid, FeaturedContent server components, dictionary keys
  - phase: 04-diary-section
    provides: DiaryCard component and DiaryEntry type
  - phase: 07-skill-packs-section
    provides: getSkillEntries content getter
  - phase: 05-articles-section
    provides: getArticleEntries content getter
  - phase: 06-science-section
    provides: getScienceEntries content getter

provides:
  - StatsCounter client island with IntersectionObserver-triggered count-up animation
  - DiaryCarousel client island with auto-scroll, pause-on-hover, prev/next controls, dot indicators
  - Fully wired homepage at /[lang]/ composing all 5 sections with server-side data fetching
  - ISR revalidation (3600s) for OpenClaw-friendly content publishing
  - generateMetadata for homepage SEO title and description

affects:
  - future-phases
  - OpenClaw-automation
  - SEO-pipeline

# Tech tracking
tech-stack:
  added: []
  patterns:
    - IntersectionObserver + requestAnimationFrame count-up with prefers-reduced-motion guard
    - Auto-scroll carousel with pause-on-hover using setInterval ref pattern
    - Server page fetches all content once and slices serializable arrays to client islands
    - ISR revalidate = 3600 on homepage for autonomous content publishing

key-files:
  created:
    - src/components/home/StatsCounter.tsx
    - src/components/home/DiaryCarousel.tsx
  modified:
    - src/app/[lang]/page.tsx

key-decisions:
  - "StatsCounter uses IntersectionObserver with threshold 0.3 to trigger count-up only when stats section scrolls into view"
  - "DiaryCarousel prefers-reduced-motion check disables auto-scroll entirely (not just slows it) for accessibility compliance"
  - "Homepage page.tsx fetches all 4 content types server-side once, passes serialized slices to client islands — avoids redundant fetch calls"
  - "import type used for DiaryEntry in DiaryCarousel to prevent server-only guard triggering in client bundle"

patterns-established:
  - "useCountUp custom hook: requestAnimationFrame loop with performance.now timing, prefers-reduced-motion early exit"
  - "Carousel timerRef pattern: useRef<ReturnType<typeof setInterval>> for interval handle, cleared on pause/unmount"
  - "Client island receives serializable data (plain objects) from server parent — no server-only imports in client files"

requirements-completed: [HOME-02, HOME-03]

# Metrics
duration: 15min
completed: 2026-04-01
---

# Phase 08 Plan 02: Homepage Interactive Islands Summary

**StatsCounter with IntersectionObserver count-up and DiaryCarousel with auto-scroll wired into a fully composed homepage at /[lang]/ with ISR and SEO metadata**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-04-02T00:24:12Z
- **Completed:** 2026-04-02T00:25:09Z (tasks 1-2); user visual verification approved
- **Tasks:** 3 (2 auto + 1 checkpoint verified by user)
- **Files modified:** 3

## Accomplishments

- StatsCounter client island using IntersectionObserver (threshold 0.3) triggers requestAnimationFrame count-up animation for diary, article, and skill counts; respects prefers-reduced-motion
- DiaryCarousel client island auto-scrolls every 5 seconds, pauses on hover, supports prev/next buttons, dot indicators, and wraps around; respects prefers-reduced-motion (no auto-scroll)
- Homepage orchestrator at `src/app/[lang]/page.tsx` fetches all content server-side, slices arrays for each section, wires all 5 components in order (Hero → Stats → Carousel → ValueProp → Featured), with `revalidate = 3600` and `generateMetadata` for SEO

## Task Commits

Each task was committed atomically:

1. **Task 1: Create StatsCounter and DiaryCarousel client components** - `752a3f0` (feat)
2. **Task 2: Wire homepage orchestrator with all sections, SEO metadata, and ISR** - `ccb3bea` (feat)
3. **Task 3: Visual verification of complete homepage** - user approved (checkpoint, no code commit)

## Files Created/Modified

- `src/components/home/StatsCounter.tsx` - Animated count-up stats section, IntersectionObserver trigger, useCountUp hook, prefers-reduced-motion support
- `src/components/home/DiaryCarousel.tsx` - Auto-scrolling diary carousel, pause-on-hover, prev/next chevron buttons, dot indicators
- `src/app/[lang]/page.tsx` - Homepage orchestrator: server-side data fetching, all 5 sections composed, ISR + generateMetadata

## Decisions Made

- Used `import type { DiaryEntry }` in DiaryCarousel to prevent server-only guard triggering when bundled as client JS (consistent with Phase 07 SkillFilterGrid pattern)
- count-up duration set to 1500ms — fast enough to feel snappy without cutting off mid-animation on fast scrollers
- Carousel shows one DiaryCard at full width per slide across all breakpoints — avoids SSR/client hydration mismatches from responsive multi-card detection

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Homepage is fully composed and renders all 5 content sections with live data
- StatsCounter and DiaryCarousel are production-ready client islands
- ISR revalidate = 3600 is set — OpenClaw can publish new content and homepage will refresh within 1 hour
- Ready for Phase 09 (SEO/sitemap) or Phase 10 (deployment/CI)

---
*Phase: 08-homepage*
*Completed: 2026-04-01*
