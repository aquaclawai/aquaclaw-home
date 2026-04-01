---
phase: 05-articles-section
plan: 02
subsystem: ui
tags: [mdx, articles, nextjs, app-router, tailwind, typescript, react-server-components, seo, pagination, prev-next]

requires:
  - phase: 05-articles-section/05-01
    provides: ArticleCard, ArticleCardGrid, ArticlePrevNext components; 5 seed MDX articles; getArticleEntries/getArticleBySlug lib
  - phase: 04-diary-section
    provides: PaginationBar reused with basePath="articles"; diary route pattern used as reference

provides:
  - Articles listing page at /[lang]/articles with responsive card grid and ISR
  - Pagination routes at /[lang]/articles/page/[N] (static) with page-1 redirect for SEO
  - Article detail pages at /[lang]/articles/[slug] with MDX rendering, syntax-highlighted code blocks, and prev/next nav
  - Per-page generateMetadata with unique title and Open Graph (no "Day N:" prefix)
  - 19 unit tests covering pagination, prev/next logic, and seed article validation

affects:
  - 08-homepage (article section aggregation — these routes must exist first)
  - future article content additions (adding new MDX to content/articles/ appears on listing after build)

tech-stack:
  added: []
  patterns:
    - Article routes mirror diary routes but omit dayNumber from all metadata, headers, and prev/next
    - PaginationBar reused from diary components with basePath="articles" — not duplicated
    - Dynamic MDX import via relative path (not @/ alias) since content/ is at project root outside src/
    - ISR via revalidate=3600 on all article route pages

key-files:
  created:
    - src/app/[lang]/articles/page.tsx
    - src/app/[lang]/articles/page/[page]/page.tsx
    - src/app/[lang]/articles/[slug]/page.tsx
    - src/__tests__/articles.test.ts
  modified: []

key-decisions:
  - "Article detail metadata uses entry.title directly (no 'Day N:' prefix) — articles are standalone content, not episodic"
  - "Dynamic MDX import uses relative path ../../../../.. to reach project root content/ — @/ alias maps to src/ so cannot reference content/"
  - "PaginationBar reused from src/components/diary/ with basePath='articles' — no article-specific copy needed"
  - "Pagination page 1 redirects to /articles base route to prevent duplicate content for SEO"

patterns-established:
  - "Article pages are server components only — no 'use client' needed for this feature set"
  - "prev/next: newest-first array means prevEntry (older) is at higher index, nextEntry (newer) at lower index"
  - "prose wrapper class on MDX article content enables rehype-pretty-code syntax-highlighted code blocks automatically"

requirements-completed: [ARTC-01, ARTC-02]

duration: 8min
completed: 2026-04-01
---

# Phase 05 Plan 02: Articles Section — Route Pages Summary

**Three App Router route files wiring article components into a complete /en/articles section: listing with card grid, pagination, and MDX detail pages with syntax-highlighted code blocks and prev/next navigation**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-04-01T10:28:09Z
- **Completed:** 2026-04-01T10:36:00Z
- **Tasks:** 1 (+ 1 human-verify checkpoint)
- **Files modified:** 4

## Accomplishments

- Created 3 App Router route pages wiring Plan 01 components and content library into working routes
- Articles listing at /en/articles shows responsive 1/2/3 column card grid with all 5 seed articles
- Detail pages at /en/articles/[slug] render full MDX with rehype-pretty-code syntax-highlighted code blocks via prose wrapper
- Prev/next navigation with correct direction (older = higher index in newest-first array)
- Unique title and Open Graph metadata per article (no "Day N:" prefix unlike diary)
- All 5 article detail pages statically generated via generateStaticParams; pagination routes also SSG
- 19 unit tests passing covering pagination logic, prev/next logic, and seed article validation

## Task Commits

1. **Task 1: Article route pages and tests** - `dc78d3d` (feat)

## Files Created/Modified

- `src/app/[lang]/articles/page.tsx` — Listing page (page 1): card grid + PaginationBar + generateMetadata
- `src/app/[lang]/articles/page/[page]/page.tsx` — Pagination routes: generateStaticParams + page-1 redirect + card grid
- `src/app/[lang]/articles/[slug]/page.tsx` — Detail page: MDX rendering + prev/next + unique OG metadata
- `src/__tests__/articles.test.ts` — 19 unit tests (pagination, prev/next, seed validation, no-dayNumber assertion)

## Decisions Made

- **Article metadata title**: `entry.title` directly — no "Day N:" prefix. Articles are standalone content, not episodic entries. This is the key visual/SEO difference from diary pages.
- **MDX import path**: Used `../../../../../content/articles/${slug}.mdx` relative path. The `@/` alias maps to `src/` so it cannot reference `content/` at project root.
- **PaginationBar reused**: `import { PaginationBar } from '@/components/diary/PaginationBar'` with `basePath="articles"` — confirmed this is the correct approach (per Plan 01 SUMMARY), no article-specific copy needed.
- **prose wrapper enables syntax highlighting**: The `<article className="prose...">` wrapper around `<MDXContent />` ensures rehype-pretty-code's highlighted HTML is styled correctly without any additional configuration.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None. Dev server was already running on port 3000 — smoke test confirmed HTTP 200 on /en/articles.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Complete articles section is live and functional at /en/articles
- All 5 seed articles accessible at /en/articles/[slug] with syntax-highlighted code blocks
- Phase 06 (skills/portfolio section) can begin — no articles dependencies needed
- Phase 08 (homepage) can now reference article routes and getArticleEntries() for featured articles aggregation

## Self-Check: PASSED

Files verified:
- `src/app/[lang]/articles/page.tsx` — FOUND
- `src/app/[lang]/articles/page/[page]/page.tsx` — FOUND
- `src/app/[lang]/articles/[slug]/page.tsx` — FOUND
- `src/__tests__/articles.test.ts` — FOUND

Commits verified:
- `dc78d3d` — FOUND (feat(05-02): add articles listing, pagination, and detail route pages)

---
*Phase: 05-articles-section*
*Completed: 2026-04-01*
