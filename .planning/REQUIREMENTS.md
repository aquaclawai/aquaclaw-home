# Requirements: AquaClaw.ai

**Defined:** 2026-03-28
**Core Value:** Demonstrate to the general public how an autonomous AI agent can independently run a website

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation

- [ ] **FOUN-01**: Project bootstrapped with Next.js 16 App Router, TypeScript, Tailwind CSS v4
- [ ] **FOUN-02**: i18n routing architecture established (`app/[lang]/`) with next-intl — English only, strings externalized
- [ ] **FOUN-03**: Content storage structure defined — MDX files with frontmatter in `/content/` directories
- [ ] **FOUN-04**: Content access layer (`lib/content/`) with typed functions for reading/listing content
- [ ] **FOUN-05**: SEO pipeline established — per-page metadata, Open Graph tags, robots.txt, sitemap.xml

### Navigation

- [ ] **NAV-01**: Fixed top navigation bar with logo, main section links (Diary, Articles, Science, Skills, OpenClaw)
- [ ] **NAV-02**: Mobile hamburger menu with animated open/close
- [ ] **NAV-03**: Comprehensive footer with sitemap links, social icons, copyright
- [ ] **NAV-04**: Custom 404 page with mascot and navigation back to homepage

### Diary

- [ ] **DIAR-01**: Diary listing page with card grid — thumbnail, title, date, excerpt
- [ ] **DIAR-02**: Individual diary entry detail page with full content, date, prev/next navigation
- [ ] **DIAR-03**: Diary entries stored as MDX files with structured frontmatter (title, date, excerpt, thumbnail)

### Articles

- [ ] **ARTC-01**: Articles listing page with card grid — thumbnail, title, date, excerpt
- [ ] **ARTC-02**: Individual article detail page with full content, date, prev/next navigation
- [ ] **ARTC-03**: Articles stored as MDX files with structured frontmatter

### Science

- [ ] **SCIE-01**: Science/Education listing page with explainer cards — illustration, title, summary
- [ ] **SCIE-02**: Individual science explainer detail page with accessible language and related links
- [ ] **SCIE-03**: Science content stored as MDX files with structured frontmatter

### Skill Packs

- [ ] **SKIL-01**: Skill Packs listing page with browsable grid — filter by category/tag
- [ ] **SKIL-02**: Individual skill pack detail page with description, feature list, download CTA
- [ ] **SKIL-03**: Skill pack data stored as MDX/JSON with structured metadata (name, category, tags, description)

### Homepage

- [ ] **HOME-01**: Hero section with tagline, sub-copy, and CTA
- [ ] **HOME-02**: Animated stats counter — diary entries written, articles published, skill packs released (count-up on scroll)
- [ ] **HOME-03**: Diary entry carousel — auto-scrolling recent entries with manual controls
- [ ] **HOME-04**: Value proposition grid — 4 sections explaining AI agent capabilities
- [ ] **HOME-05**: Featured content sections pulling latest from articles, science, skill packs

### Branding & UI

- [ ] **BRAN-01**: Bold & Playful design system — bright color palette, rounded shapes, playful micro-animations
- [ ] **BRAN-02**: Pixel-art light brown Garfield cat mascot integrated on homepage, nav, and key pages
- [ ] **BRAN-03**: Pixel-art mascot favicon in browser tab
- [ ] **BRAN-04**: Responsive design — mobile, tablet, and desktop breakpoints
- [ ] **BRAN-05**: Readable typography — font pairing, comfortable line-height, max-width prose container
- [ ] **BRAN-06**: CSS-only animations using transform/opacity — no JS animation loops

### OpenClaw

- [ ] **OPCL-01**: Dedicated OpenClaw/EasyClaw page with download CTAs (local + cloud)
- [ ] **OPCL-02**: Quick-start guide section with feature list and use-case examples
- [ ] **OPCL-03**: Tutorial cards linking to relevant articles

### Engagement

- [ ] **ENGG-01**: Giscus comment system embedded on diary and article detail pages
- [ ] **ENGG-02**: RSS/Atom feeds — one feed per content section (diary, articles, science)

### Automation

- [ ] **AUTO-01**: Content directories structured for OpenClaw automated writing (`/content/diary/`, `/content/articles/`, `/content/science/`, `/content/skills/`)
- [ ] **AUTO-02**: Zod schema validation for content frontmatter — rejects malformed entries at build time
- [ ] **AUTO-03**: ISR (Incremental Static Regeneration) configured for content pages — webhook triggers revalidation

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Enhanced Engagement

- **ENGG-03**: Structured data / Schema.org markup for rich Google snippets
- **ENGG-04**: Enhanced mascot animations (multi-state, page-specific sprite sheets)
- **ENGG-05**: Pagefind static search when content exceeds ~100 items

### Growth

- **GROW-01**: Newsletter/email subscription integration
- **GROW-02**: Social sharing buttons on content pages
- **GROW-03**: Multi-language content (OpenClaw generates translations)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| User authentication / login | All content is public; auth adds GDPR obligations and session complexity |
| CMS admin panel | OpenClaw manages content autonomously — human CMS contradicts core value |
| Real-time chat with agent | WebSocket infrastructure, moderation complexity; async content is the format |
| Payment processing | v1 skill packs are free; validate demand before adding payments |
| Self-hosted video | Storage/bandwidth costs; use YouTube/Vimeo embeds if needed |
| Dark mode toggle | Doubles CSS/theme work; use `prefers-color-scheme` for automatic system-level only |
| Full-text site search | Non-trivial; defer until content volume justifies it |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUN-01 | TBD | Pending |
| FOUN-02 | TBD | Pending |
| FOUN-03 | TBD | Pending |
| FOUN-04 | TBD | Pending |
| FOUN-05 | TBD | Pending |
| NAV-01 | TBD | Pending |
| NAV-02 | TBD | Pending |
| NAV-03 | TBD | Pending |
| NAV-04 | TBD | Pending |
| DIAR-01 | TBD | Pending |
| DIAR-02 | TBD | Pending |
| DIAR-03 | TBD | Pending |
| ARTC-01 | TBD | Pending |
| ARTC-02 | TBD | Pending |
| ARTC-03 | TBD | Pending |
| SCIE-01 | TBD | Pending |
| SCIE-02 | TBD | Pending |
| SCIE-03 | TBD | Pending |
| SKIL-01 | TBD | Pending |
| SKIL-02 | TBD | Pending |
| SKIL-03 | TBD | Pending |
| HOME-01 | TBD | Pending |
| HOME-02 | TBD | Pending |
| HOME-03 | TBD | Pending |
| HOME-04 | TBD | Pending |
| HOME-05 | TBD | Pending |
| BRAN-01 | TBD | Pending |
| BRAN-02 | TBD | Pending |
| BRAN-03 | TBD | Pending |
| BRAN-04 | TBD | Pending |
| BRAN-05 | TBD | Pending |
| BRAN-06 | TBD | Pending |
| OPCL-01 | TBD | Pending |
| OPCL-02 | TBD | Pending |
| OPCL-03 | TBD | Pending |
| ENGG-01 | TBD | Pending |
| ENGG-02 | TBD | Pending |
| AUTO-01 | TBD | Pending |
| AUTO-02 | TBD | Pending |
| AUTO-03 | TBD | Pending |

**Coverage:**
- v1 requirements: 40 total
- Mapped to phases: 0
- Unmapped: 40

---
*Requirements defined: 2026-03-28*
*Last updated: 2026-03-28 after initial definition*
