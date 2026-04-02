# Phase 6: Science Section - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the science/education listing page and individual explainer detail pages. Visitors can browse all science explainers in a card grid and read any explainer with accessible plain-language content, illustrations, and related links. Includes prev/next navigation, SEO metadata per page, and 3-5 seed explainers. Comments, search, and filtering are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Card Layout & Density (carried from Phases 4 & 5)
- **D-01:** Responsive card grid — 1 column mobile, 2 columns tablet, 3 columns desktop. Same pattern as diary/articles.
- **D-02:** Each card shows: thumbnail (or mascot placeholder), difficulty badge, title, date, excerpt (2-3 lines), and tag pills.
- **D-03:** When no thumbnail in frontmatter, show mascot placeholder. Same approach as diary/articles.
- **D-04:** Simple page header — "Science & Education" in Fredoka + one-line description.
- **D-05:** Paginate at 12 entries per page with static page routes. Same pattern as diary/articles.

### Explainer Detail Page (carried from Phases 4 & 5)
- **D-06:** Centered prose layout, max-width ~700px. `@tailwindcss/typography` prose classes. Same as diary/articles.
- **D-07:** Explainer header: difficulty badge, tag pills, formatted date, then title in large Fredoka. Back link ("← Back to Science") above everything.
- **D-08:** Bottom prev/next navigation bar — same pattern as diary/articles.
- **D-09:** Related links section at bottom of explainer content (above prev/next nav). Simple list of links to other resources.

### Content & Tone
- **D-10:** Accessible plain-language writing — explain AI concepts for the general public, not developers. Approachable and educational.
- **D-11:** Newest first sort order. Same as diary/articles.
- **D-12:** Standard markdown + images. No embedded React components. Same as diary/articles.

### Seed Content
- **D-13:** 3-5 seed science explainers written by Claude. Cover foundational AI topics (what is AI, how do chatbots work, etc.) in accessible language.

### Claude's Discretion
- Difficulty badge styling (color-coded pill: green/yellow/red, or icon-based)
- Related links frontmatter schema (array of {title, url} objects, or inline markdown links)
- Whether to add `relatedLinks` field to ScienceFrontmatterSchema or keep links in MDX body
- Card differentiation from diary/articles
- Component reuse strategy (shared vs science-specific)
- Seed explainer topics
- Illustration approach (mascot-based illustrations, or placeholder images)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/content/science.ts` — `getScienceEntries()` and `getScienceBySlug()` already implemented
- `lib/content/schemas.ts` — `ScienceFrontmatterSchema` extends CommonFrontmatterSchema with `difficulty: enum(['beginner', 'intermediate', 'advanced'])`
- `src/components/diary/PaginationBar.tsx` — Reusable pagination with `basePath` prop (already reused by articles)
- `src/components/articles/ArticleCard.tsx` — Reference for content card pattern without dayNumber
- `src/components/ui/MascotImage.tsx` — Mascot for placeholder thumbnails
- `content/science/` — Directory exists (empty, ready for seed content)

### Established Patterns (from Phases 4 & 5)
- Content listing page → card grid → paginated with `generateStaticParams`
- Content detail page → dynamic MDX import → prose wrapper → prev/next nav
- Dictionary-driven UI strings via `getDictionary()`
- `generateMetadata()` per page from frontmatter
- PaginationBar reused across sections with `basePath` prop

### Integration Points
- New routes: `src/app/[lang]/science/page.tsx` (listing) and `src/app/[lang]/science/[slug]/page.tsx` (detail)
- Pagination routes: `src/app/[lang]/science/page/[page]/page.tsx`
- Navigation: "Science" link in Header already exists

</code_context>

<specifics>
## Specific Ideas

- Science section is about making AI concepts accessible to the general public — "explain like I'm curious, not like I'm an engineer"
- Difficulty badge helps visitors self-select content appropriate to their level
- Related links connect explainers to each other and to external resources, building a knowledge web

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-science-section*
*Context gathered: 2026-04-01*
