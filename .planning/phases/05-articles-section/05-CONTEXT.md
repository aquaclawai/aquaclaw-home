# Phase 5: Articles Section - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the articles listing page and individual article detail pages. Visitors can browse all technical articles in a card grid and read any article with full MDX content rendered, including syntax-highlighted code blocks. Includes prev/next navigation, SEO metadata per page, and 3-5 seed articles. Comments, search, and filtering are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Card Layout & Density (carried from Phase 4)
- **D-01:** Responsive card grid — 1 column mobile, 2 columns tablet, 3 columns desktop. Same pattern as diary.
- **D-02:** Each card shows: thumbnail (or mascot placeholder), title, date, excerpt (2-3 lines), and tag pills. No "Day N" badge (articles don't have dayNumber).
- **D-03:** When no thumbnail in frontmatter, show mascot in a pose on a colored background. Same MascotImage placeholder approach as diary.
- **D-04:** Simple page header — "Articles" in Fredoka + one-line description. Same pattern as diary.
- **D-05:** Paginate at 12 entries per page with static page routes. Same pattern as diary.

### Article Detail Page (carried from Phase 4)
- **D-06:** Centered prose layout, max-width ~700px. `@tailwindcss/typography` prose classes. Same as diary.
- **D-07:** Article header: tag pills, formatted date, then title in large Fredoka. Back link ("← Back to Articles") above everything. No day badge.
- **D-08:** Bottom prev/next navigation bar — same pattern as diary.

### Code Syntax Highlighting
- **D-09:** Use rehype-pretty-code (already installed) for syntax-highlighted code blocks in article MDX content. This is the key differentiator from diary entries.

### Content & Tone
- **D-10:** Newest first sort order (reverse chronological) — matches existing `getArticleEntries()` sort.
- **D-11:** Standard markdown + images + code blocks. No embedded React components in article MDX.

### Seed Content
- **D-12:** 3-5 seed articles written by Claude during this phase. Technical guides about AI, web development, or related topics — written in an approachable style suitable for the general public.

### Claude's Discretion
- Article voice/persona (cat persona, neutral technical, or hybrid)
- Article length (longer than diary entries — technical guides may be 500-1500 words)
- Code block theme (dark vs light, line numbers, copy button)
- Card differentiation from diary (read time estimate, category label, or minimal difference)
- Whether to create shared/generic content card components vs article-specific ones
- Seed article topics
- Card hover effects and micro-animations
- Pagination component reuse from diary

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/content/articles.ts` — `getArticleEntries()` and `getArticleBySlug()` already implemented with Zod validation, gray-matter parsing, reverse-chronological sort
- `lib/content/schemas.ts` — `ArticleFrontmatterSchema` extends CommonFrontmatterSchema with no extra fields (title, date, excerpt, tags, optional thumbnail/slug)
- `src/components/diary/DiaryCard.tsx` — Reference implementation for content cards with mascot placeholders. Can be adapted or generalized.
- `src/components/diary/DiaryCardGrid.tsx` — Responsive grid wrapper. Can be adapted or generalized.
- `src/components/diary/PaginationBar.tsx` — Pagination component. Potentially reusable directly.
- `src/components/diary/DiaryPrevNext.tsx` — Prev/next navigation. Can be adapted or generalized.
- `src/components/ui/MascotImage.tsx` — Mascot component for placeholder thumbnails
- `src/app/globals.css` — Full design token system
- `content/articles/` — Directory exists (empty, ready for seed content)

### Established Patterns (from Phase 4)
- Content listing page: `getDiaryEntries()` → `DiaryCardGrid` + `DiaryCard` → paginated with `generateStaticParams`
- Content detail page: dynamic MDX import → prose wrapper → prev/next nav
- Dictionary-driven UI strings via `getDictionary()`
- `generateMetadata()` per page from frontmatter
- Static pagination routes: `/articles`, `/articles/page/2`, etc.

### Integration Points
- New routes: `src/app/[lang]/articles/page.tsx` (listing) and `src/app/[lang]/articles/[slug]/page.tsx` (detail)
- Pagination routes: `src/app/[lang]/articles/page/[page]/page.tsx`
- Navigation: "Articles" link in Header already exists
- rehype-pretty-code: Already configured in next.config for MDX processing

</code_context>

<specifics>
## Specific Ideas

- Articles section mirrors diary section structurally — same card grid, same detail layout, same pagination
- Key differentiator is code syntax highlighting via rehype-pretty-code
- Planner should consider whether diary components can be generalized into shared content components to avoid duplication, or if article-specific components are cleaner

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-articles-section*
*Context gathered: 2026-04-01*
