---
phase: 01-foundation
plan: 02
subsystem: i18n
tags: [next-intl, i18n, middleware, dictionaries, server-only]

# Dependency graph
requires:
  - phase: 01-01
    provides: "Next.js 16 project skeleton with App Router, next-intl installed"
provides:
  - "next-intl v4 middleware with locale detection and /en/ redirect"
  - "Server-only getDictionary loader with Locale type"
  - "Seeded English dictionary with all v1 UI section keys"
  - "app/[lang]/ route skeleton (layout + page)"
  - "8 passing i18n tests (replacing 5 todo stubs)"
affects: [01-03, 01-04, 02-01, 03-01, 04-01, 05-01, 08-01]

# Tech tracking
tech-stack:
  added: [server-only]
  patterns: [locale-prefixed-routing, server-only-dictionary-loader, async-params-next16, no-hardcoded-strings]

key-files:
  created:
    - middleware.ts
    - src/lib/i18n/getDictionary.ts
    - dictionaries/en.json
    - src/app/[lang]/layout.tsx
    - src/app/[lang]/page.tsx
  modified:
    - src/__tests__/i18n.test.ts
    - package.json

key-decisions:
  - "Moved lib/ into src/lib/ to align with @/* path alias convention (tsconfig maps @/* to ./src/*)"
  - "getDictionary uses dynamic import map pattern with server-only guard to prevent client bundle leakage"
  - "All UI strings flow through getDictionary -- no hardcoded text in JSX components"

patterns-established:
  - "All routes live under src/app/[lang]/ -- every page is locale-prefixed"
  - "Use getDictionary(lang as Locale) in server components to access translations"
  - "Never hardcode UI strings in JSX -- always use dictionary keys"
  - "Next.js 16 async params: always await params before destructuring in layouts/pages"

requirements-completed: [FOUN-02]

# Metrics
duration: 4min
completed: 2026-03-29
---

# Phase 1 Plan 02: i18n Routing Summary

**next-intl v4 middleware with locale-prefixed routing, server-only dictionary loader, and seeded English dictionary with all v1 section keys**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-29T01:58:13Z
- **Completed:** 2026-03-29T02:01:49Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- next-intl v4 middleware at project root with `localePrefix: 'always'` redirecting `/` to `/en/`
- Server-only getDictionary loader with typed Locale export, preventing client bundle leakage
- Seeded `dictionaries/en.json` with all v1 UI section keys: site, nav, footer, common, diary, articles, science, skills, openclaw
- `app/[lang]/` route skeleton with layout and placeholder homepage using dictionary (no hardcoded strings)
- Replaced 5 todo test stubs with 8 real assertions -- all passing

## Task Commits

Each task was committed atomically (TDD: test then feat):

1. **Task 1: Create middleware.ts, i18n dictionary loader, and seed en.json**
   - `795855e` (test) - Failing tests for i18n infrastructure files
   - `822d368` (feat) - middleware.ts, getDictionary loader, en.json implementation
2. **Task 2: Create app/[lang]/ route skeleton and fill i18n test stubs**
   - `116ecd2` (test) - Replace i18n test stubs with real assertions
   - `ba2d343` (feat) - app/[lang]/ layout + page, path fixes

## Files Created/Modified
- `middleware.ts` - next-intl v4 middleware with locale detection and always-prefix routing
- `src/lib/i18n/getDictionary.ts` - Server-only async dictionary loader with Locale type export
- `dictionaries/en.json` - Complete English dictionary with all v1 UI section keys
- `src/app/[lang]/layout.tsx` - Locale-scoped layout wrapper (no html/body duplication)
- `src/app/[lang]/page.tsx` - Placeholder homepage using getDictionary (zero hardcoded strings)
- `src/__tests__/i18n.test.ts` - 8 real assertions replacing 5 todo stubs
- `src/__tests__/i18n-task1.test.ts` - Additional 6 infrastructure file tests (TDD artifact)
- `package.json` - Added server-only dependency

## Decisions Made
- Moved `lib/` into `src/lib/` to align with the `@/*` path alias (tsconfig maps `@/*` to `./src/*`). The plan placed it at root level, but the import `@/lib/i18n/getDictionary` would not resolve unless it's inside `src/`.
- Used `server-only` package guard on getDictionary to ensure dictionary loading never leaks into client bundles.
- All UI text flows through getDictionary -- the page component references `dict.site.name` instead of the literal `"AquaClaw.ai"`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Moved lib/ from project root to src/lib/**
- **Found during:** Task 2 (build verification)
- **Issue:** Plan specified `lib/i18n/getDictionary.ts` at project root, but tsconfig `@/*` maps to `./src/*`. The import `@/lib/i18n/getDictionary` in page.tsx failed with "Module not found".
- **Fix:** Moved `lib/` directory into `src/lib/` and updated the relative import path in getDictionary.ts from `../../dictionaries/en.json` to `../../../dictionaries/en.json`.
- **Files modified:** src/lib/i18n/getDictionary.ts, src/__tests__/i18n.test.ts, src/__tests__/i18n-task1.test.ts
- **Verification:** All 14 i18n tests pass; import resolves correctly.
- **Committed in:** ba2d343 (Task 2 commit)

**2. [Rule 3 - Blocking] Installed server-only package**
- **Found during:** Task 1 (pre-implementation check)
- **Issue:** getDictionary.ts requires `import 'server-only'` but the package was not installed.
- **Fix:** Ran `npm install server-only --save`.
- **Files modified:** package.json, package-lock.json
- **Committed in:** 822d368 (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (2 blocking)
**Impact on plan:** Both fixes necessary for correct module resolution and server-only enforcement. No scope creep.

## Issues Encountered
- Build failure from parallel agent's `lib/content/` files (missing `./schemas` module) -- out of scope for this plan; will be resolved by plan 01-03 executor.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All routes now live under `src/app/[lang]/` -- subsequent plans build content pages here
- getDictionary pattern established for all future components to use
- `dictionaries/en.json` seeded with keys for diary, articles, science, skills, openclaw sections
- 14 i18n tests passing (8 in i18n.test.ts, 6 in i18n-task1.test.ts)

## Self-Check: PASSED

All 7 key files verified present. All 4 task commits (795855e, 822d368, 116ecd2, ba2d343) confirmed in git history.

---
*Phase: 01-foundation*
*Completed: 2026-03-29*
