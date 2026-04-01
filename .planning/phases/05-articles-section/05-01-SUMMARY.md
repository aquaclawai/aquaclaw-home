---
phase: 05-articles-section
plan: 01
subsystem: ui
tags: [mdx, content, articles, nextjs, tailwind, typescript, react-server-components]

requires:
  - phase: 04-diary-section
    provides: DiaryCard/DiaryCardGrid/DiaryPrevNext patterns used as article component references
  - phase: 01-foundation
    provides: lib/content/schemas.ts (ArticleFrontmatterSchema), gray-matter, MDX pipeline

provides:
  - 5 seed MDX articles in content/articles/ with valid Zod-validated frontmatter
  - ArticleCard server component with slug-hash deterministic mascot placeholder
  - ArticleCardGrid responsive 1/2/3 column grid wrapper
  - ArticlePrevNext prev/next article navigation (no dayNumber)
  - Complete articles UI strings in dictionaries/en.json

affects:
  - 05-articles-section/05-02 (route pages that compose these components)
  - 08-homepage (article section aggregation on homepage)

tech-stack:
  added: []
  patterns:
    - Slug char-code hash for deterministic mascot pose (no dayNumber on articles)
    - Article components mirror diary pattern but decoupled — tag pills replace Day N badge
    - ArticlePrevNext props omit dayNumber entirely, dict has no `day` key

key-files:
  created:
    - content/articles/building-ai-agent-from-scratch.mdx
    - content/articles/understanding-large-language-models.mdx
    - content/articles/web-performance-tips-2026.mdx
    - content/articles/what-is-prompt-engineering.mdx
    - content/articles/how-this-site-was-built.mdx
    - src/components/articles/ArticleCard.tsx
    - src/components/articles/ArticleCardGrid.tsx
    - src/components/articles/ArticlePrevNext.tsx
  modified:
    - dictionaries/en.json (added 7 articles UI string keys)
    - src/__tests__/content.test.ts (updated assertion to 5 articles)

key-decisions:
  - "Slug char-code hash (sum of char codes) used for deterministic mascot pose/bg on articles — no dayNumber available unlike diary"
  - "ArticleCard moves tag pills above title (no Day N badge), preserving same card visual weight"
  - "ArticlePrevNext drops dayNumber from EntryRef and day from dict — cleaner interface since articles have no episode numbering"
  - "ArticleCardGrid created as article-specific copy (not re-exporting DiaryCardGrid) to keep sections decoupled for future divergence"

patterns-established:
  - "Slug hash pattern: reduce charCodeAt sum, modulo array length for deterministic index selection"
  - "Article server components: all hover via CSS Tailwind utilities, no 'use client'"
  - "PaginationBar reused from diary/ directly — no article-specific copy needed (basePath='articles')"

requirements-completed: [ARTC-03]

duration: 12min
completed: 2026-04-01
---

# Phase 05 Plan 01: Articles Section — Seed Content and UI Components Summary

**5 MDX seed articles (500-1500 words, code blocks in 4 of 5) and 3 server component article cards/grid/prevnext building on the Phase 4 diary pattern with slug-hash determinism replacing dayNumber**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-04-01T10:10:40Z
- **Completed:** 2026-04-01T10:22:00Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments

- Created 5 seed MDX articles with valid frontmatter, approachable technical voice, and varied tags covering ai/agents/web/nextjs/llm/prompts
- 4 of 5 articles contain fenced code blocks (Python, TypeScript, CSS, text) exercising rehype-pretty-code syntax highlighting
- Added 7 articles UI string keys to en.json (backToArticles, page, of, prev, next, readArticle, noArticles)
- ArticleCard uses slug character-code hash for deterministic mascot pose and background — prevents hydration mismatches
- All 3 components are server components with no 'use client' directive; hover effects via Tailwind CSS transitions

## Task Commits

1. **Task 1: Seed article content and dictionary keys** - `70dd869` (feat)
2. **Task 2: Article UI components** - `59438de` (feat)

## Files Created/Modified

- `content/articles/building-ai-agent-from-scratch.mdx` — Python agent loop tutorial with 3 code blocks (~800 words)
- `content/articles/understanding-large-language-models.mdx` — Conceptual LLM explainer, no code blocks (~700 words)
- `content/articles/web-performance-tips-2026.mdx` — Next.js performance tips with 5 TypeScript/CSS code blocks (~900 words)
- `content/articles/what-is-prompt-engineering.mdx` — Prompt engineering guide with text/code block examples (~600 words)
- `content/articles/how-this-site-was-built.mdx` — AquaClaw stack behind-the-scenes with 4 code blocks (~1000 words)
- `src/components/articles/ArticleCard.tsx` — Card component: slug-hash pose, tag pills, title, date, excerpt
- `src/components/articles/ArticleCardGrid.tsx` — Responsive grid wrapper (1/2/3 cols)
- `src/components/articles/ArticlePrevNext.tsx` — Prev/next navigation without dayNumber prefix
- `dictionaries/en.json` — Added 7 articles UI keys
- `src/__tests__/content.test.ts` — Updated assertion from empty-array to 5-entry count

## Decisions Made

- **Slug hash determinism**: Used sum of char codes mod N (same principle as dayNumber mod N in diary) to select mascot pose and background color. Ensures consistent rendering across server and client without random state.
- **Tag pills above title**: Articles have no "Day N" badge, so tag pills move to the top of the content area to fill the visual role of the diary's day badge.
- **ArticleCardGrid as separate component**: Even though it's identical to DiaryCardGrid today, keeping them separate allows future divergence (e.g., articles grid showing featured article differently) without touching diary code.
- **ArticlePrevNext dict omits `day` key**: The diary's dict requires `{ prev, next, day }`. Articles remove `day` entirely — cleaner type constraint reflecting the domain difference.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- All content and components ready for Plan 02 route wiring
- `getArticleEntries()` returns 5 sorted entries; `getArticleBySlug()` works correctly
- PaginationBar from `src/components/diary/PaginationBar.tsx` is directly reusable with `basePath="articles"`
- Plan 02 needs: `app/[lang]/articles/page.tsx` (listing with pagination), `app/[lang]/articles/[slug]/page.tsx` (detail with prev/next)

## Self-Check: PASSED

Files verified:
- `content/articles/building-ai-agent-from-scratch.mdx` — FOUND
- `content/articles/understanding-large-language-models.mdx` — FOUND
- `content/articles/web-performance-tips-2026.mdx` — FOUND
- `content/articles/what-is-prompt-engineering.mdx` — FOUND
- `content/articles/how-this-site-was-built.mdx` — FOUND
- `src/components/articles/ArticleCard.tsx` — FOUND
- `src/components/articles/ArticleCardGrid.tsx` — FOUND
- `src/components/articles/ArticlePrevNext.tsx` — FOUND

Commits verified:
- `70dd869` — FOUND (feat(05-01): add 5 seed articles and complete articles dictionary keys)
- `59438de` — FOUND (feat(05-01): add article UI components)

---
*Phase: 05-articles-section*
*Completed: 2026-04-01*
