---
phase: 09-openclaw-section
plan: 01
subsystem: ui
tags: [nextjs, react, tailwind, i18n, server-components, openclaw]

# Dependency graph
requires:
  - phase: 05-articles-section
    provides: ArticleCard component and getArticleEntries() for tutorial cards
  - phase: 01-foundation
    provides: getDictionary, i18n routing, MascotImage component
provides:
  - OpenClaw promotional page at /[lang]/openclaw with hero, downloads, features/use-cases, tutorials
  - DownloadSection component with Local and Cloud CTA cards
  - FeatureList component with features grid and use-cases section
  - TutorialCards component wrapping ArticleCard for tutorial linking
  - openclaw dictionary keys (hero, download, features, useCases, tutorials)
affects: [10-seo-performance, sitemap]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Server component page with dict prop drilling to sub-components
    - typeof en['openclaw']['download'] for narrow prop typing from JSON dictionary
    - Article slug filtering pattern for curated content display

key-files:
  created:
    - src/app/[lang]/openclaw/page.tsx
    - src/components/openclaw/DownloadSection.tsx
    - src/components/openclaw/FeatureList.tsx
    - src/components/openclaw/TutorialCards.tsx
  modified:
    - dictionaries/en.json

key-decisions:
  - "typeof en['openclaw']['download'] used for DownloadSection prop type — avoids manual interface duplication and stays in sync with JSON"
  - "TutorialCards uses import type for ArticleEntry to match established pattern from other components"
  - "Tutorial articles filtered server-side by slug list — curated selection, not all articles"

patterns-established:
  - "OpenClaw component prop types derived from JSON dictionary using typeof en['section']['subsection'] pattern"

requirements-completed: [OPCL-01, OPCL-02, OPCL-03]

# Metrics
duration: 2min
completed: 2026-04-01
---

# Phase 9 Plan 1: OpenClaw Section Summary

**OpenClaw promotional page at /[lang]/openclaw with download CTAs (Local + Cloud), 4-feature grid, 3 use-case cards, and tutorial cards linking to existing articles**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-01T17:23:13Z
- **Completed:** 2026-04-01T17:25:26Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Expanded `openclaw` dictionary key with all page content (hero, download, features, useCases, tutorials)
- Created three server components: DownloadSection, FeatureList, TutorialCards — all Bold & Playful styled
- Built the `/[lang]/openclaw` page route with ISR, SEO metadata, and all three required sections

## Task Commits

Each task was committed atomically:

1. **Task 1: Add dictionary keys and create OpenClaw page components** - `96e89b4` (feat)
2. **Task 2: Create OpenClaw page route with SEO and tutorial wiring** - `5fbe242` (feat)

**Plan metadata:** (docs commit below)

## Files Created/Modified
- `dictionaries/en.json` - Added openclaw.hero, download, features, useCases, tutorials keys
- `src/components/openclaw/DownloadSection.tsx` - Local and Cloud CTA cards with pill buttons
- `src/components/openclaw/FeatureList.tsx` - 4-item features grid and 3-item use cases section
- `src/components/openclaw/TutorialCards.tsx` - Tutorial cards grid wrapping ArticleCard
- `src/app/[lang]/openclaw/page.tsx` - OpenClaw page route with hero, sections, and metadata

## Decisions Made
- Used `typeof en['openclaw']['download']` for DownloadSection prop typing — derived directly from JSON, stays in sync without manual interface
- Used `import type` for ArticleEntry in TutorialCards — matches established pattern from other components, avoids server-only guard triggering
- Tutorial articles filtered server-side by hardcoded slug list — curated, not all articles

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed incorrect relative import path for ArticleEntry**
- **Found during:** Task 1 (TutorialCards component creation)
- **Issue:** Plan specified `../../../../lib/content/articles` (4 levels up) but `src/components/openclaw/` is only 3 levels from project root
- **Fix:** Changed to `../../../lib/content/articles` — correct relative path from `src/components/openclaw/`
- **Files modified:** src/components/openclaw/TutorialCards.tsx
- **Verification:** `npx tsc --noEmit` passed with zero errors
- **Committed in:** 96e89b4 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Necessary path correction — no scope change.

## Issues Encountered
- None beyond the import path fix above

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- OpenClaw page complete and building successfully
- Download CTAs use placeholder `#` hrefs — actual download URLs needed when OpenClaw is released
- Tutorial cards show only entries matching the 3 hardcoded slugs; if those slugs don't exist in content, cards will be empty (currently 0 tutorial articles in content/)

---
*Phase: 09-openclaw-section*
*Completed: 2026-04-01*
