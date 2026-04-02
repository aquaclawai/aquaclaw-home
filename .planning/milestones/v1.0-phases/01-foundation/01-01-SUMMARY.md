---
phase: 01-foundation
plan: 01
subsystem: infra
tags: [next.js, typescript, tailwind, mdx, vitest, turbopack]

# Dependency graph
requires: []
provides:
  - "Next.js 16 project skeleton with App Router and Turbopack"
  - "All Phase 1 npm dependencies installed"
  - "Strict TypeScript config with noUncheckedIndexedAccess"
  - "Turbopack-compatible MDX setup with string plugin format"
  - "vitest test scaffold with todo stubs for FOUN-02, FOUN-03, FOUN-04"
affects: [01-02, 01-03, 01-04, 01-05]

# Tech tracking
tech-stack:
  added: [next.js 16.2.1, react 19.2.4, tailwind css v4, next-intl, gray-matter, globby, zod, sharp, @next/mdx, remark-gfm, rehype-pretty-code, vitest, @vitejs/plugin-react]
  patterns: [turbopack-string-plugins, src-directory-structure, path-alias-@]

key-files:
  created:
    - next.config.mjs
    - mdx-components.tsx
    - vitest.config.ts
    - src/__tests__/i18n.test.ts
    - src/__tests__/content.test.ts
    - src/app/layout.tsx
  modified:
    - package.json
    - tsconfig.json

key-decisions:
  - "MDX plugins as strings not imports for Turbopack compatibility"
  - "src/ directory structure with @/* path alias to ./src/*"
  - "metadataBase in root layout for SEO readiness"

patterns-established:
  - "MDX plugins must be string names in remarkPlugins/rehypePlugins arrays"
  - "TypeScript strict mode with noUncheckedIndexedAccess for all code"
  - "Test scaffolds created as .todo stubs before implementation plans"

requirements-completed: [FOUN-01]

# Metrics
duration: 12min
completed: 2026-03-29
---

# Phase 1 Plan 01: Project Bootstrap Summary

**Next.js 16.2.1 project with Turbopack MDX, strict TypeScript, Tailwind v4, all Phase 1 deps, and vitest test scaffolds for Wave 2**

## Performance

- **Duration:** 12 min
- **Started:** 2026-03-29T01:43:57Z
- **Completed:** 2026-03-29T01:55:46Z
- **Tasks:** 2
- **Files modified:** 18

## Accomplishments
- Next.js 16.2.1 bootstrapped with App Router, Turbopack, TypeScript, Tailwind CSS v4, ESLint 9
- All Phase 1 dependencies installed: next-intl, gray-matter, globby, zod, sharp, @next/mdx, remark-gfm, rehype-pretty-code
- MDX configured with Turbopack-compatible string plugin format (not imported functions)
- TypeScript strict mode with noUncheckedIndexedAccess enabled
- vitest configured with React plugin and path aliases; 15 todo test stubs for Wave 2 plans
- Root layout with metadataBase for SEO readiness

## Task Commits

Each task was committed atomically:

1. **Task 1: Bootstrap Next.js 16 project and install all Phase 1 dependencies** - `511c836` (feat)
2. **Task 2: Create vitest configuration and test scaffolds for Wave 2 plans** - `74577a1` (feat)

## Files Created/Modified
- `package.json` - Project manifest with all Phase 1 dependencies and test scripts
- `next.config.mjs` - MDX + Turbopack config with string plugin format
- `tsconfig.json` - Strict TypeScript with noUncheckedIndexedAccess and @/* path alias
- `mdx-components.tsx` - Required by @next/mdx for custom MDX component mapping
- `vitest.config.ts` - Test framework config with React plugin and path aliases
- `src/app/layout.tsx` - Minimal root layout with metadataBase for SEO
- `src/app/globals.css` - Tailwind CSS v4 base styles
- `src/__tests__/i18n.test.ts` - 5 todo stubs for FOUN-02 (i18n routing)
- `src/__tests__/content.test.ts` - 10 todo stubs for FOUN-03/FOUN-04 (content layer)
- `postcss.config.mjs` - PostCSS config for Tailwind v4
- `eslint.config.mjs` - ESLint 9 flat config with next plugin

## Decisions Made
- MDX plugins passed as strings (not imported functions) for Turbopack compatibility per Next.js 15.1+ requirement
- Used src/ directory structure (moved app/ from root to src/app/) with @/* path alias mapping to ./src/*
- Root layout includes metadataBase using VERCEL_URL env var for SEO/OG image generation readiness
- Package renamed from "aquaclaw-bootstrap" to "aquaclaw"

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] create-next-app refused to run in non-empty directory**
- **Found during:** Task 1 (Bootstrap)
- **Issue:** create-next-app exits with error when target directory contains existing files (.planning/, CLAUDE.md)
- **Fix:** Bootstrapped in /tmp/aquaclaw-bootstrap, then rsync'd files over preserving existing files
- **Files modified:** All bootstrap files
- **Verification:** CLAUDE.md and .planning/ confirmed still present after copy
- **Committed in:** 511c836 (Task 1 commit)

**2. [Rule 3 - Blocking] Bootstrap created app/ at root instead of src/app/**
- **Found during:** Task 1 (Bootstrap)
- **Issue:** create-next-app@16.2.1 defaults to app/ at root level, but plan specifies src/app/ structure
- **Fix:** Moved app/ to src/app/ and updated tsconfig.json paths from `./*` to `./src/*`
- **Files modified:** tsconfig.json, directory structure
- **Verification:** npm run build passes with src/ structure
- **Committed in:** 511c836 (Task 1 commit)

**3. [Rule 3 - Blocking] next.config.ts needed to be .mjs for ESM remark plugins**
- **Found during:** Task 1 (Bootstrap)
- **Issue:** Bootstrap created next.config.ts but remark-gfm and rehype-pretty-code are ESM-only; plan specifies .mjs
- **Fix:** Removed next.config.ts and created next.config.mjs with MDX config
- **Files modified:** next.config.mjs (created), next.config.ts (removed)
- **Verification:** npm run build passes
- **Committed in:** 511c836 (Task 1 commit)

---

**Total deviations:** 3 auto-fixed (3 blocking)
**Impact on plan:** All auto-fixes necessary to handle create-next-app behavior differences. No scope creep.

## Issues Encountered
- Turbopack workspace root warning about multiple lockfiles (parent directory has a package-lock.json). Non-blocking; can be resolved later with turbopack.root config if needed.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Project builds cleanly with `npm run build` (exit 0)
- vitest runs with `npm test` (15 todo stubs, exit 0)
- All Wave 2 plans (01-02, 01-03, 01-04, 01-05) can proceed — dependencies installed, test scaffolds ready
- next-intl installed for FOUN-02, gray-matter/globby/zod installed for FOUN-03/FOUN-04

## Self-Check: PASSED

All 11 key files verified present. Both task commits (511c836, 74577a1) confirmed in git history.

---
*Phase: 01-foundation*
*Completed: 2026-03-29*
