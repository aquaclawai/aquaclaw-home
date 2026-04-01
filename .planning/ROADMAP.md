# Roadmap: AquaClaw.ai

## Overview

AquaClaw.ai is built in 11 phases that mirror the natural dependency order of a content-heavy, autonomously-operated website. The foundation (i18n routing, content system, SEO pipeline) is established first — before any page is built — because retrofitting these is architecturally expensive. The design system and navigation shell follow, giving every content section a complete visual home to render into. Content sections (Diary, Articles, Science, Skill Packs) each ship as complete vertical slices. The Homepage assembles those sections into the site's front door. The OpenClaw promotion section and the automation/API layer close the loop on the AI-agent narrative. Engagement features (comments, RSS) and launch polish complete v1.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - i18n routing, content layer, and SEO pipeline established before any content page is written
- [ ] **Phase 2: Design System** - Bold & Playful Tailwind v4 design tokens, mascot, typography, animation rules, and responsive breakpoints
- [x] **Phase 3: Navigation Shell** - Fixed nav bar, mobile hamburger menu, footer, and 404 page completing the site shell (completed 2026-03-30)
- [x] **Phase 4: Diary Section** - Fully browsable diary listing and detail pages with MDX content pipeline (completed 2026-04-01)
- [x] **Phase 5: Articles Section** - Articles listing and detail pages with syntax-highlighted MDX pipeline (completed 2026-04-01)
- [ ] **Phase 6: Science Section** - Science/Education listing and detail pages with accessible explainer layout
- [ ] **Phase 7: Skill Packs Section** - Skill packs browser with category filtering and individual detail pages
- [x] **Phase 8: Homepage** - Hero, animated stats counter, diary carousel, value proposition grid, and featured content sections (completed 2026-04-01)
- [ ] **Phase 9: OpenClaw Section** - Dedicated OpenClaw/EasyClaw download page, quick-start guide, and tutorial cards
- [ ] **Phase 10: Automation & API Layer** - ISR revalidation webhook, Zod schema validation, and structured content directories
- [ ] **Phase 11: Engagement & Polish** - Giscus comment system, RSS/Atom feeds, and launch-readiness checks

## Phase Details

### Phase 1: Foundation
**Goal**: The architectural skeleton that every page will be built on is verified end-to-end — i18n routing, typed content layer, and SEO pipeline all working before any content page exists
**Depends on**: Nothing (first phase)
**Requirements**: FOUN-01, FOUN-02, FOUN-03, FOUN-04, FOUN-05
**Success Criteria** (what must be TRUE):
  1. `npm run dev` serves the site under `/en/` with next-intl routing resolving correctly — visiting `/` redirects to `/en/`
  2. A test MDX file in `/content/diary/` can be read and typed via `lib/content/diary.ts` with no TypeScript errors
  3. A dummy page at `/en/test` has correct `<title>`, Open Graph tags, and canonical URL rendered in page source
  4. `sitemap.xml` and `robots.txt` are accessible at their expected URLs and contain valid content
  5. The project builds without errors (`npm run build`) with TypeScript strict mode enabled
**Plans**: 4 plans

Plans:
- [x] 01-01-PLAN.md — Bootstrap Next.js 16 project with all dependencies, strict TypeScript, Turbopack MDX config, and vitest test scaffold
- [x] 01-02-PLAN.md — i18n routing layer: next-intl middleware, app/[lang]/ routes, getDictionary server-only loader, seeded en.json dictionary
- [x] 01-03-PLAN.md — Typed content access layer: Zod schemas for all four content types, lib/content/ accessor functions, content directories with day-001.mdx
- [x] 01-04-PLAN.md — SEO pipeline: app/sitemap.ts, app/robots.ts, /en/test proof-of-concept page with generateMetadata and OG tags

### Phase 2: Design System
**Goal**: Every visual building block for the Bold & Playful aesthetic exists and is enforced — color tokens, mascot rendering rules, typography scale, animation performance rules — so all subsequent phases can build on a consistent foundation
**Depends on**: Phase 1
**Requirements**: BRAN-01, BRAN-02, BRAN-03, BRAN-04, BRAN-05, BRAN-06
**Success Criteria** (what must be TRUE):
  1. The pixel-art Garfield cat mascot renders crisp (not blurry) on a HiDPI/Retina screen using `image-rendering: pixelated`
  2. The mascot favicon appears correctly in the browser tab
  3. A sample page viewed on mobile (375px), tablet (768px), and desktop (1280px) shows correct responsive layout with no horizontal overflow
  4. A demo component using the Tailwind v4 color tokens and typography scale matches the Bold & Playful design spec (bright palette, rounded shapes, readable prose)
  5. CSS-only animations (`transform`/`opacity` only) run on the demo page with no layout shift or janky repaints
**Plans**: 3 plans
**UI hint**: yes

Plans:
- [x] 02-01-PLAN.md — Design tokens, typography, and animation keyframes in globals.css + font loading in layout.tsx
- [x] 02-02-PLAN.md — Pixel-art mascot assets (4 poses), MascotImage component, and mascot-derived favicon
- [ ] 02-03-PLAN.md — Design system showcase page at /en/design-system with visual verification checkpoint

### Phase 3: Navigation Shell
**Goal**: Every page on the site has a complete, working navigation shell — visitors can always find their way and the site feels structurally complete
**Depends on**: Phase 2
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04
**Success Criteria** (what must be TRUE):
  1. The fixed top navigation bar is visible on every page and contains the logo and links to Diary, Articles, Science, Skills, and OpenClaw
  2. On mobile, a hamburger icon opens an animated menu overlay; tapping outside or a close button dismisses it
  3. The footer appears on every page with sitemap links, social icons, and copyright text
  4. Navigating to a non-existent URL shows the custom 404 page with the mascot and a link back to the homepage
**Plans**: TBD
**UI hint**: yes

### Phase 4: Diary Section
**Goal**: Visitors can browse all diary entries and read any individual entry — the core AI-agent activity log is publicly accessible and navigable
**Depends on**: Phase 3
**Requirements**: DIAR-01, DIAR-02, DIAR-03
**Success Criteria** (what must be TRUE):
  1. The `/en/diary` listing page displays a card grid of diary entries showing thumbnail, title, date, and excerpt
  2. Clicking a diary card navigates to the full entry at `/en/diary/[slug]` with complete MDX content rendered
  3. The detail page shows prev/next navigation links to adjacent entries
  4. Adding a new `.mdx` file to `/content/diary/` with valid frontmatter makes it appear on the listing page after a build
  5. Each diary page has unique `<title>` and Open Graph metadata from the MDX frontmatter
**Plans**: 2 plans
**UI hint**: yes

Plans:
- [x] 04-01-PLAN.md — Seed diary content (5 entries in cat persona), dictionary keys, and diary UI components (DiaryCard, DiaryCardGrid, PaginationBar, DiaryPrevNext)
- [x] 04-02-PLAN.md — Diary listing page, pagination route, detail page with MDX rendering, tests, and visual verification

### Phase 5: Articles Section
**Goal**: Visitors can browse and read all technical articles — the site's long-form content is discoverable and correctly formatted with code syntax highlighting
**Depends on**: Phase 4
**Requirements**: ARTC-01, ARTC-02, ARTC-03
**Success Criteria** (what must be TRUE):
  1. The `/en/articles` listing page displays a card grid of articles showing thumbnail, title, date, and excerpt
  2. Clicking an article card navigates to the full article at `/en/articles/[slug]` with MDX content rendered and code blocks syntax-highlighted
  3. The detail page shows prev/next navigation links to adjacent articles
  4. Adding a new `.mdx` file to `/content/articles/` with valid frontmatter makes it appear on the listing page after a build
**Plans**: 2 plans
**UI hint**: yes

Plans:
- [ ] 05-01-PLAN.md — Seed article content (5 technical articles), dictionary keys, and article UI components (ArticleCard, ArticleCardGrid, ArticlePrevNext)
- [ ] 05-02-PLAN.md — Articles listing page, pagination route, detail page with MDX rendering + syntax highlighting, tests, and visual verification

### Phase 6: Science Section
**Goal**: Visitors can browse and read all science/education explainers — AI concepts are presented accessibly with illustrations and related links
**Depends on**: Phase 5
**Requirements**: SCIE-01, SCIE-02, SCIE-03
**Success Criteria** (what must be TRUE):
  1. The `/en/science` listing page displays explainer cards showing illustration, title, and summary
  2. Clicking a science card navigates to the full explainer at `/en/science/[slug]` with accessible plain-language content and related links
  3. Adding a new `.mdx` file to `/content/science/` with valid frontmatter makes it appear on the listing page after a build
**Plans**: 2 plans
**UI hint**: yes

Plans:
- [ ] 06-01-PLAN.md — Seed science content (5 explainers), dictionary keys, science UI components (ScienceCard, ScienceCardGrid, SciencePrevNext), update content.test.ts
- [ ] 06-02-PLAN.md — Science listing page, pagination route, detail page with MDX rendering + difficulty badge + Further Reading, tests, and visual verification

### Phase 7: Skill Packs Section
**Goal**: Visitors can browse the full skill packs catalog, filter by category, and download any skill pack — the autonomous agent's capabilities are tangible and accessible
**Depends on**: Phase 6
**Requirements**: SKIL-01, SKIL-02, SKIL-03
**Success Criteria** (what must be TRUE):
  1. The `/en/skills` listing page displays a browsable grid of skill packs with filter controls for category/tag
  2. Applying a filter shows only matching skill packs without a full page reload
  3. Clicking a skill pack navigates to `/en/skills/[slug]` showing description, feature list, and a download CTA button
  4. Adding a new skill pack MDX/JSON file to `/content/skills/` makes it appear in the grid after a build
**Plans**: 2 plans
**UI hint**: yes

Plans:
- [ ] 07-01-PLAN.md — Seed skill pack content (5 packs across 5 categories), dictionary keys, skill UI components (SkillCard, SkillCardGrid, SkillFilterGrid client component), update content.test.ts
- [ ] 07-02-PLAN.md — Skills listing page with client-side category filtering, detail page with download CTA + MDX rendering, tests, and visual verification

### Phase 8: Homepage
**Goal**: First-time visitors understand what AquaClaw is, see proof of AI agent activity, and can explore any content section — the site's front door converts curiosity into engagement
**Depends on**: Phase 7
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, HOME-05
**Success Criteria** (what must be TRUE):
  1. The homepage hero section displays a tagline, sub-copy explaining the AI agent concept, and a visible CTA
  2. Scrolling to the stats section triggers an animated count-up showing the number of diary entries, articles, and skill packs
  3. The diary carousel auto-scrolls through recent entries and responds to manual prev/next controls
  4. A value proposition grid with 4 sections is visible, explaining AI agent capabilities in plain language
  5. Featured content sections show the latest articles, science explainers, and skill packs with links to their respective listing pages
**Plans**: 2 plans
**UI hint**: yes

Plans:
- [ ] 08-01-PLAN.md — Dictionary keys, homepage test scaffold, and server components (HeroSection, ValuePropGrid, FeaturedContent)
- [ ] 08-02-PLAN.md — Client islands (StatsCounter, DiaryCarousel), page orchestrator wiring all 5 sections with SEO and ISR, visual verification

### Phase 9: OpenClaw Section
**Goal**: Visitors interested in the AI agent technology can learn about OpenClaw/EasyClaw, download it, and follow tutorials — the tool-promotion narrative mirrors sanwan.ai's approach
**Depends on**: Phase 8
**Requirements**: OPCL-01, OPCL-02, OPCL-03
**Success Criteria** (what must be TRUE):
  1. The `/en/openclaw` page displays distinct CTAs for local and cloud download variants of OpenClaw/EasyClaw
  2. A quick-start guide section on the page lists key features and use-case examples
  3. Tutorial cards on the page link through to relevant articles in the Articles section
**Plans**: TBD
**UI hint**: yes

### Phase 10: Automation & API Layer
**Goal**: OpenClaw can autonomously publish new content to the live site by writing MDX files and triggering revalidation — the autonomous publishing loop is closed and verifiable
**Depends on**: Phase 9
**Requirements**: AUTO-01, AUTO-02, AUTO-03
**Success Criteria** (what must be TRUE):
  1. Content directories (`/content/diary/`, `/content/articles/`, `/content/science/`, `/content/skills/`) exist with documented structure and an example file in each
  2. Submitting an MDX file with missing or malformed frontmatter fields causes the build to fail with a descriptive Zod validation error
  3. Calling `POST /api/revalidate` with the correct secret token triggers ISR revalidation and the new content appears on the live site within 60 seconds without a full rebuild
**Plans**: TBD

### Phase 11: Engagement & Polish
**Goal**: Readers can comment on diary and article pages, content is available as RSS feeds, and the site passes launch-readiness checks — v1 ships with all engagement hooks in place
**Depends on**: Phase 10
**Requirements**: ENGG-01, ENGG-02
**Success Criteria** (what must be TRUE):
  1. A Giscus comment widget loads at the bottom of diary detail pages and article detail pages, allowing users to leave GitHub-backed comments
  2. `/rss/diary.xml`, `/rss/articles.xml`, and `/rss/science.xml` return valid RSS/Atom feeds that an RSS reader can subscribe to
  3. Lighthouse mobile score on the homepage is 90 or above
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9 -> 10 -> 11

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/4 | Not started | - |
| 2. Design System | 0/3 | Not started | - |
| 3. Navigation Shell | 2/2 | Complete   | 2026-03-30 |
| 4. Diary Section | 2/2 | Complete   | 2026-04-01 |
| 5. Articles Section | 2/2 | Complete   | 2026-04-01 |
| 6. Science Section | 0/2 | Not started | - |
| 7. Skill Packs Section | 1/2 | In Progress|  |
| 8. Homepage | 2/2 | Complete   | 2026-04-01 |
| 9. OpenClaw Section | 0/TBD | Not started | - |
| 10. Automation & API Layer | 0/TBD | Not started | - |
| 11. Engagement & Polish | 0/TBD | Not started | - |
