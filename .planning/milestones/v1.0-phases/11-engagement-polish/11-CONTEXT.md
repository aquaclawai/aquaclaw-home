# Phase 11: Engagement & Polish - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Final phase: add Giscus comment widgets to diary and article detail pages, create RSS/Atom feeds for diary/articles/science sections, and ensure the homepage passes Lighthouse mobile ≥90. These are the last engagement hooks before v1 ships.

</domain>

<decisions>
## Implementation Decisions

### Giscus Comments (ENGG-01)
- **D-01:** Embed `@giscus/react` Giscus widget at the bottom of diary detail pages and article detail pages.
- **D-02:** GitHub repo: `aquaclawai/aquaclaw-home` — GitHub Discussions must be enabled on this repo for Giscus to work.
- **D-03:** Giscus component is `'use client'` — wraps the `@giscus/react` component with site-specific config.

### RSS Feeds (ENGG-02)
- **D-04:** Three separate RSS/Atom feeds: `/rss/diary.xml`, `/rss/articles.xml`, `/rss/science.xml`.
- **D-05:** Feeds generated from content getter functions at build time or request time.

### Lighthouse (Success Criteria #3)
- **D-06:** Homepage must score ≥90 on Lighthouse mobile audit. Fix any performance/accessibility/SEO issues found.

### Claude's Discretion
- Giscus theme (light/dark matching site theme, or `preferred_color_scheme`)
- Giscus mapping strategy (pathname, title, or specific)
- Giscus category name (e.g., "Comments", "General")
- Giscus category ID (will need to be set after Discussions are enabled)
- RSS feed format (RSS 2.0 vs Atom — RSS 2.0 is more common)
- RSS feed implementation (Next.js Route Handler or static generation)
- Feed metadata (site title, description, author)
- Lighthouse optimization approach (image optimization, bundle analysis, lazy loading)
- Whether to add `<link rel="alternate" type="application/rss+xml">` to head

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `@giscus/react` listed in CLAUDE.md recommended stack (needs install)
- `lib/content/{diary,articles,science}.ts` — getter functions for feed content
- `lib/content/schemas.ts` — frontmatter types for feed item metadata
- Diary detail page: `src/app/[lang]/diary/[slug]/page.tsx`
- Article detail page: `src/app/[lang]/articles/[slug]/page.tsx`

### Established Patterns
- `'use client'` for interactive components (carousel, filters)
- `generateMetadata()` for SEO on all pages
- Route Handlers for API endpoints (`src/app/api/revalidate/route.ts`)

### Integration Points
- Giscus widget added to existing diary and article detail page components
- RSS feeds as new Route Handlers: `src/app/rss/diary.xml/route.ts`, etc.
- `<link rel="alternate">` tags in root layout or per-page metadata
- Lighthouse audit may require fixes to existing components (lazy loading images, reducing bundle size)

</code_context>

<specifics>
## Specific Ideas

- Giscus comments are GitHub Discussions-backed — zero backend, zero spam management
- RSS feeds make the content subscribable — important for an AI showcase site
- Lighthouse ≥90 is a launch-readiness gate — the site must be fast and accessible

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 11-engagement-polish*
*Context gathered: 2026-04-01*
