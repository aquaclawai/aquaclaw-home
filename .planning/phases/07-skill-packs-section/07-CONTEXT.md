# Phase 7: Skill Packs Section - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the skill packs listing page with category/tag filtering and individual skill pack detail pages with download CTAs. Visitors can browse, filter, and download AI agent skill bundles. This demonstrates the autonomous agent's tangible capabilities. Comments, ratings, and payment processing are out of scope.

</domain>

<decisions>
## Implementation Decisions

### Card Layout (carried from Phases 4-6)
- **D-01:** Responsive card grid — 1 column mobile, 2 columns tablet, 3 columns desktop. Same visual pattern as other content sections.
- **D-02:** Each card shows: thumbnail (or mascot placeholder), category badge, title, date, excerpt, and tag pills.
- **D-03:** Mascot placeholder when no thumbnail. Same approach.
- **D-04:** Simple page header — "Skill Packs" in Fredoka + one-line description.

### Category Filtering (NEW — first client-side interactivity)
- **D-05:** Client-side filtering on the listing page — no full page reload when applying filters. This requires a `'use client'` component.
- **D-06:** Filter by category (from frontmatter `category` field). Categories derived dynamically from all skill pack entries — no hardcoded list.
- **D-07:** Filter controls above the card grid.

### Skill Pack Detail Page
- **D-08:** Centered prose layout for description content, same as other sections.
- **D-09:** Download CTA button — prominent, pill-shaped, links to `downloadUrl` from frontmatter. Positioned prominently (top of detail or after description).
- **D-10:** Feature list displayed from MDX content — structured as a bulleted list or checklist within the prose.
- **D-11:** Back link ("← Back to Skills") above everything. Same pattern as other sections.

### Content & Tone
- **D-12:** Newest first sort order. Same as other sections.
- **D-13:** Standard markdown for content. Feature lists as markdown bullet lists within MDX body.

### Seed Content
- **D-14:** 3-5 seed skill packs written by Claude. Cover different categories (e.g., Content Writing, Code Generation, Data Analysis, Image Description, Task Automation). downloadUrl can be placeholder links for v1.

### Claude's Discretion
- Filter control UI (pill buttons, dropdown, or toggle chips)
- Whether "All" is a filter option or the default state
- Tag filtering in addition to category (or category only)
- Download CTA styling and placement on detail page
- Category badge styling (color-coded? icon?)
- Pagination behavior with filtering (paginate filtered results? or show all filtered?)
- Whether to include prev/next navigation (not in success criteria)
- Feature list formatting in MDX (bullets, checkmarks, structured sections)
- Seed skill pack categories and content
- Component reuse from previous sections vs skill-specific components

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/content/skills.ts` — `getSkillEntries()` and `getSkillBySlug()` already implemented
- `lib/content/schemas.ts` — `SkillFrontmatterSchema` extends CommonFrontmatterSchema with `category: string` and `downloadUrl: string (URL)`
- `src/components/diary/PaginationBar.tsx` — Reusable with `basePath` prop
- `src/components/ui/MascotImage.tsx` — Mascot for placeholder thumbnails
- `content/skills/` — Directory exists (empty, ready for seed content)

### Established Patterns (from Phases 4-6)
- Content listing page → card grid → paginated with `generateStaticParams`
- Content detail page → dynamic MDX import → prose wrapper
- Dictionary-driven UI strings via `getDictionary()`
- `generateMetadata()` per page from frontmatter
- Server components by default, `'use client'` only where needed

### Integration Points
- New routes: `src/app/[lang]/skills/page.tsx` (listing) and `src/app/[lang]/skills/[slug]/page.tsx` (detail)
- Navigation: "Skills" link in Header already exists
- **Client component needed:** Category filter requires `'use client'` — first interactive filter in content sections. May need to split listing page into server shell + client filter component.

</code_context>

<specifics>
## Specific Ideas

- Skill packs make the AI agent's capabilities tangible — "here's what it can actually do"
- Download CTA should feel inviting and prominent (Bold & Playful aesthetic — large pill button in primary/accent color)
- Category filtering is the first real client-side interactivity in content pages — keep it simple and performant
- For v1, downloadUrl can point to placeholder links (GitHub releases, external URLs) since skill packs are free

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 07-skill-packs-section*
*Context gathered: 2026-04-01*
