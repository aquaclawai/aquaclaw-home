# Phase 9: OpenClaw Section - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Build a single dedicated OpenClaw/EasyClaw promotional page at `/[lang]/openclaw`. Visitors learn about the AI agent framework, see download CTAs for local and cloud variants, read a quick-start guide with features and use-cases, and find tutorial cards linking to relevant articles. No content pipeline — this is a static promotional page.

</domain>

<decisions>
## Implementation Decisions

### Download CTAs (OPCL-01)
- **D-01:** Dedicated page at `/[lang]/openclaw` with distinct download CTAs for local and cloud variants of OpenClaw/EasyClaw.

### Quick-Start Guide (OPCL-02)
- **D-02:** Feature list and use-case examples section on the page.

### Tutorial Cards (OPCL-03)
- **D-03:** Tutorial cards linking to relevant articles from the Articles section (Phase 5).

### Claude's Discretion
- Page layout and section ordering (hero/intro → download CTAs → features → tutorials)
- OpenClaw vs EasyClaw branding distinction (local vs cloud)
- Download button styling (pill buttons matching Bold & Playful aesthetic)
- Download URLs (placeholder links for v1)
- Feature list content and formatting
- Use-case examples content
- Which existing articles to link as tutorials (or create new tagged seed articles)
- Tutorial card count (2-4)
- Whether to use existing ArticleCard or a simpler tutorial-specific card
- Mascot integration on the page
- Dictionary keys for all page text
- SEO metadata

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/articles/ArticleCard.tsx` — Can be used for tutorial cards linking to articles
- `lib/content/articles.ts` — `getArticleEntries()` to find relevant articles
- `src/components/ui/MascotImage.tsx` — Mascot for page decoration
- `src/app/globals.css` — Full design token system
- Existing articles in `content/articles/` — can link to "Building an AI Agent from Scratch" and "How This Site Was Built" as tutorials

### Established Patterns
- Server components by default
- Dictionary-driven UI strings
- `generateMetadata()` for SEO
- Bold & Playful aesthetic

### Integration Points
- New route: `src/app/[lang]/openclaw/page.tsx`
- Navigation: "OpenClaw" link in Header already exists
- Articles content: tutorial cards link to existing `/[lang]/articles/[slug]` routes

</code_context>

<specifics>
## Specific Ideas

- Mirrors sanwan.ai's OpenClaw promotion approach — download section + tutorials
- This page is essentially a landing page / product page within the site
- Download URLs are placeholder for v1 (no actual downloads yet)
- Tutorial cards should link to the most relevant existing articles about AI agents and the site's tech

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 09-openclaw-section*
*Context gathered: 2026-04-01*
