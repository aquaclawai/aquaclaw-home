---
phase: 01-foundation
plan: 04
subsystem: seo-pipeline
tags: [seo, sitemap, robots, metadata, next.js]
dependency_graph:
  requires: [01-02, 01-03]
  provides: [sitemap.xml, robots.txt, generateMetadata-pattern]
  affects: [all-future-content-pages]
tech_stack:
  added: []
  patterns: [MetadataRoute.Sitemap, MetadataRoute.Robots, generateMetadata]
key_files:
  created:
    - src/app/sitemap.ts
    - src/app/robots.ts
    - src/app/[lang]/test/page.tsx
  modified:
    - lib/content/diary.ts
    - lib/content/articles.ts
    - lib/content/science.ts
    - lib/content/skills.ts
decisions:
  - Use relative imports for lib/content modules from src/app (not covered by @/* alias)
  - Remove .js extension from content module schema imports for bundler compatibility
metrics:
  duration: 4min
  completed: 2026-03-29
---

# Phase 1 Plan 4: SEO Pipeline Summary

SEO pipeline using Next.js built-in file conventions: sitemap.ts generates dynamic XML sitemap from all content types, robots.ts produces robots.txt with sitemap reference, and a test page at /en/test proves generateMetadata with OG tags and canonical URL.

## What Was Built

### Task 1: sitemap.ts and robots.ts (815dd5f)

Created `src/app/sitemap.ts` using the `MetadataRoute.Sitemap` return type. The sitemap includes:
- Static section routes: /en, /en/diary, /en/articles, /en/science, /en/skills
- Dynamic content routes from all four content modules (diary, articles, science, skills)
- Appropriate changeFrequency and priority values per route type

Created `src/app/robots.ts` using the `MetadataRoute.Robots` return type with allow-all rules and a Sitemap directive pointing to `https://aquaclaw.ai/sitemap.xml`.

### Task 2: Test page with generateMetadata (71618cf)

Created `src/app/[lang]/test/page.tsx` as a proof-of-concept page demonstrating the full SEO metadata pipeline:
- `generateMetadata()` produces title, description, openGraph (title, description, url, type), and alternates.canonical
- Uses Next.js 16 async params pattern (`await params`)
- Full build compiles cleanly with all routes visible in build output
- All 76 tests pass

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed .js extension in content module schema imports**
- **Found during:** Task 1
- **Issue:** All four content modules (`diary.ts`, `articles.ts`, `science.ts`, `skills.ts`) imported from `'./schemas.js'` which the Next.js bundler could not resolve during build
- **Fix:** Changed all imports to `'./schemas'` (without .js extension) to match bundler moduleResolution: "bundler" setting
- **Files modified:** `lib/content/diary.ts`, `lib/content/articles.ts`, `lib/content/science.ts`, `lib/content/skills.ts`
- **Commit:** 815dd5f

**2. [Rule 3 - Blocking] Used relative imports instead of @/ alias for lib/content**
- **Found during:** Task 1
- **Issue:** Plan specified `@/lib/content/diary` imports but the `@/*` path alias maps to `./src/*` while content modules live in root `lib/content/`. The alias would resolve to a nonexistent path.
- **Fix:** Used relative import paths (`../../lib/content/diary`) in sitemap.ts
- **Commit:** 815dd5f

## Verification Results

- `npm run build` exits 0 -- all routes compile including `/sitemap.xml`, `/robots.txt`, `/[lang]/test`
- `npx vitest run` exits 0 -- 76/76 tests pass
- No TypeScript errors in build output
- No metadataBase warnings in build output
- Build output confirms static generation of sitemap.xml and robots.txt routes

## Known Stubs

None -- all files are fully functional, no placeholder data or TODO markers.

## Self-Check: PASSED
