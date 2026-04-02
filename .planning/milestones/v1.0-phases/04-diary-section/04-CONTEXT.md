# Phase 4: Diary Section - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the diary listing page and individual entry detail pages. Visitors can browse all diary entries in a card grid and read any individual entry with full MDX content rendered. Includes prev/next navigation, SEO metadata per page, and 3-5 seed entries in the cat persona. Comments, search, and filtering are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Card Layout & Density
- **D-01:** Responsive card grid — 1 column mobile, 2 columns tablet, 3 columns desktop. Uses existing rounded-xl card tokens from design system.
- **D-02:** Each card shows: thumbnail (or mascot placeholder), Day # pill badge, title, date, excerpt (2-3 lines), and tag pills.
- **D-03:** When no thumbnail in frontmatter, show mascot in a random pose on a colored background using accent palette colors. Reuses MascotImage component.
- **D-04:** Simple page header above cards — "Agent Diary" in Fredoka + one-line description. No hero section, cards are the star.
- **D-05:** Paginate at 12 entries per page. Static page routes: `/diary`, `/diary/page/2`, `/diary/page/3` via `generateStaticParams`.

### Entry Detail Page
- **D-06:** Centered prose layout, max-width ~700px. `@tailwindcss/typography` prose classes with Fredoka headings, Nunito body.
- **D-07:** Entry header: "Day N" pill badge, formatted date, tag pills, then title in large Fredoka. Back link ("← Back to Diary") above everything.
- **D-08:** Bottom prev/next navigation bar — full-width: "← Day 3: Title" on left, "Day 5: Title →" on right. Pill-shaped buttons with warm design tokens.

### Content & Tone
- **D-09:** First-person cat persona — the mascot IS the AI agent, writing about its day. Playful, approachable, matches Bold & Playful brand.
- **D-10:** Short entries (200-500 words) — quick daily-log style. Easy to scan, suitable for frequent automated generation by OpenClaw.
- **D-11:** Standard markdown + images only — no embedded React components in diary MDX. Headings, lists, code blocks, images, links. Keeps content pipeline simple for OpenClaw.
- **D-12:** Newest first sort order (reverse chronological) — matches existing `getDiaryEntries()` sort behavior.

### Seed Content
- **D-13:** 3-5 seed diary entries written by Claude during this phase. Cover the first days of "building AquaClaw" in the cat persona. Realistic content for visual testing and immediate demonstration.

### Claude's Discretion
- Card hover effects and micro-animations
- Exact card spacing, padding, and shadow depth
- Pagination component styling (page numbers, arrows)
- Responsive breakpoints for column transitions
- Mascot pose selection logic for placeholder thumbnails
- Exact prev/next button styling
- Seed entry topics and narrative arc

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/content/diary.ts` — `getDiaryEntries()` and `getDiaryEntry(slug)` already implemented with Zod validation, gray-matter parsing, and reverse-chronological sort
- `lib/content/schemas.ts` — `DiaryFrontmatterSchema` with title, date, excerpt, dayNumber, tags, optional thumbnail/slug
- `src/components/ui/MascotImage.tsx` — Mascot component with pose prop (default, waving, thinking, sleeping) and pixel-art crisp rendering
- `src/app/globals.css` — Full design token system: colors, typography scale, radius scale, animation keyframes
- `content/diary/day-001.mdx` — Existing seed entry (needs updating to cat persona voice)

### Established Patterns
- CSS-first Tailwind v4 with `@theme inline` tokens — all styling via utility classes consuming tokens
- `[lang]/layout.tsx` wraps all locale routes — Header/Footer already present
- `getDictionary()` for externalized UI strings — all page text must go through dictionaries
- `generateMetadata()` for per-page SEO — each diary page needs unique title/description/OG
- `generateStaticParams()` for static generation — used for locale routes, extend for diary slugs and pagination

### Integration Points
- New routes: `src/app/[lang]/diary/page.tsx` (listing) and `src/app/[lang]/diary/[slug]/page.tsx` (detail)
- Pagination routes: `src/app/[lang]/diary/page/[page]/page.tsx`
- Navigation: "Diary" link in Header already points to `/diary` — needs to resolve correctly
- Sitemap: `src/app/sitemap.ts` should include diary pages (may need extending)
- Content directory: `content/diary/` already exists with day-001.mdx

</code_context>

<specifics>
## Specific Ideas

- Mascot placeholder thumbnails should feel like the cat "decorated" each entry — warm, fun, on-brand
- Diary entries are the core proof that an AI agent runs this site — they should feel authentic and daily
- The cat persona makes AI approachable for general public — "I figured out images today!" not "Image optimization pipeline configured"
- Card grid should feel like sanwan.ai's diary section but with the Bold & Playful aesthetic instead of sketch style

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-diary-section*
*Context gathered: 2026-04-01*
