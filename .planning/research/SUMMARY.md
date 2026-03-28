# Project Research Summary

**Project:** AquaClaw.ai — AI Agent Showcase Website
**Domain:** Content-heavy AI agent showcase / autonomous publishing site (i18n, SEO, playful UI)
**Researched:** 2026-03-28
**Confidence:** HIGH (stack + architecture verified via official Next.js 16.x docs); MEDIUM (features + pitfalls from domain expertise)

## Executive Summary

AquaClaw is a content-heavy, autonomously-operated website where an AI agent (OpenClaw) publishes diary entries, articles, science explainers, and skill packs without human editorial involvement. The dominant reference site is sanwan.ai (lobster AI agent showcase), which establishes the expected product pattern: branded mascot character, animated stats counters proving agent activity, multiple content sections, and a prominent tool-promotion section. The recommended build approach is Next.js 16 App Router with file-system MDX content, next-intl for i18n, Tailwind CSS v4 for Bold & Playful styling, and ISR revalidation for OpenClaw's publishing workflow — a stack confirmed via official documentation as of 2026-03-28.

The key architectural insight is that content storage structure is the foundational decision everything else depends on. All content lives as `.mdx` files in `/content/` directories, accessed only through a server-side `lib/content/` abstraction layer. OpenClaw writes files there directly; a webhook triggers ISR revalidation without full rebuilds. The site defaults to React Server Components for all rendering, with `"use client"` boundaries isolated to leaf components requiring animation or interactivity. This keeps client JavaScript minimal and Core Web Vitals healthy even with an animated mascot and counter components.

The two highest-risk areas are both architectural and must be addressed in Phase 1, not deferred. First, i18n routing (`app/[lang]/` segment) must be the foundation from the first commit — retrofitting it after launch requires renaming every route and rewriting all canonical URLs, a structural refactor that kills SEO rankings. Second, SEO metadata infrastructure (per-page `generateMetadata`, Open Graph, sitemap, robots.txt) must be established before any content pages are built, not added as an afterthought. Both pitfalls have LOW recovery cost if addressed early and HIGH recovery cost if addressed late.

## Key Findings

### Recommended Stack

The stack is tight and well-validated. Next.js 16 App Router is the unambiguous choice: it ships with ISR, App Router static generation, built-in Metadata API, MDX support, image optimization, and Turbopack dev server — everything needed for this use case without additional infrastructure. Tailwind CSS v4 (CSS-first config, 3-8x faster builds, container queries built-in) pairs with it as the create-next-app default. MDX via `@next/mdx` with `gray-matter` + `globby` for frontmatter parsing replaces Contentlayer, which was abandoned in 2024. For i18n, `next-intl` is the explicit first recommendation in the official Next.js i18n docs and the only viable App Router option (next-i18next is Pages Router only). See STACK.md for full version table and installation commands.

**Core technologies:**
- **Next.js 16.x (App Router):** Full-stack React framework — ISR, SSG, metadata API, MDX, image optimization all built in; App Router is the only forward-compatible choice
- **React 19.x (via App Router):** UI rendering — Server Components default keeps client JS minimal; translation dictionaries never reach the browser bundle
- **TypeScript 5.x:** Type safety — required for typed content schemas that OpenClaw and the content layer both depend on
- **Tailwind CSS v4.2:** Utility-first styling — CSS-first config via `@theme {}`, 3-8x faster builds, perfect for Bold & Playful rapid iteration with custom design tokens
- **next-intl 3.x:** i18n routing + server-side dictionaries — explicit first recommendation in official Next.js i18n docs; zero client bundle overhead
- **@next/mdx + gray-matter + globby:** Content pipeline — MDX files as content source; frontmatter parsing; filesystem enumeration for index pages
- **motion 11.x:** Animations — floating mascot, stats counters, hover effects; only in `"use client"` leaf components
- **@giscus/react:** Comment system — GitHub Discussions backed; no database, no infrastructure, no cost

### Expected Features

Content-focused features dominate the P1 list. The content structure (diary, articles, science, skill packs) maps directly to sections with listing + detail pages following a repeating pattern. The differentiating features — animated pixel-art mascot, live stats counter, agent-framed content attribution, and skill packs browser — are what set AquaClaw apart from generic tech blogs and must be present at launch to deliver on the AI-autonomy narrative. Anti-features to avoid include anything requiring user auth, a CMS admin panel, real-time chat, or self-hosted video — all disproportionately complex for v1. See FEATURES.md for full prioritization matrix.

**Must have (table stakes):**
- Homepage hero, navigation, footer, 404 page, responsive design — structural trust signals expected on any site
- Diary, Articles, Science, Skill Packs sections with listing + detail pages — core content delivery
- SEO fundamentals (per-page meta, Open Graph, sitemap, robots.txt) — content is worthless if undiscoverable
- Automation-ready content structure (markdown + frontmatter schema, ISR revalidation webhook) — OpenClaw must publish without human intervention

**Should have (differentiators):**
- Pixel-art Garfield cat mascot with animation — brand identity and shareability
- Live stats counter with animated count-up — proves agent activity to first-time visitors
- OpenClaw/EasyClaw dedicated download + tutorial section — tool promotion mirrors sanwan.ai's key CTA
- Bold & Playful full design system — differentiates from dry/corporate AI sites
- Animated homepage carousels (diary + articles) — makes homepage feel alive

**Defer (v2+):**
- Comment/feedback system — add after content volume justifies reader interaction
- Newsletter/email subscription — needs traffic data first
- User accounts, full multilingual content, API for skill packs

### Architecture Approach

The architecture is a layered RSC-first system: content files (`/content/*.mdx`) are accessed exclusively through server-only `lib/content/*.ts` functions, which feed async Server Component pages that use `generateStaticParams` for SSG and `generateMetadata` for per-page SEO. Interactive elements (carousels, counters, mobile menu, comment widget) are isolated `"use client"` leaf components that receive data as props from their Server Component parents — never fetching content themselves. All public routes live under `app/[lang]/` to support locale-scoped static generation from day one. OpenClaw publishes by writing `.mdx` files and calling `POST /api/revalidate` to trigger ISR cache invalidation without a full rebuild. See ARCHITECTURE.md for full project structure, code examples, and data flow diagrams.

**Major components:**
1. `app/[lang]/` routing layer — locale-scoped route tree with `generateStaticParams` for SSG per locale
2. `lib/content/*.ts` — server-only content access layer (diary, articles, science, skill-packs); the only code that reads the filesystem
3. `components/sections/` — domain-specific interactive components (DiaryCarousel, StatsCounter, SkillPackBrowser) as `"use client"` islands
4. `app/api/revalidate` + `app/api/rss.xml` — API routes for OpenClaw webhook, RSS feed, and sitemap generation
5. `dictionaries/[lang].json` + `lib/i18n/getDictionary.ts` — server-side translation pipeline; zero client bundle impact

### Critical Pitfalls

1. **i18n added after launch** — Retrofitting `app/[lang]/` routing is a full structural rewrite that breaks all inbound SEO links. Prevention: `app/[lang]/` from the first commit, even with only English. Cost if deferred: HIGH.
2. **Automation-unfriendly content structure** — OpenClaw cannot reliably publish if content conventions are implicit or fields have no defaults. Prevention: Define a minimal, explicit frontmatter schema with zod validation; provide OpenClaw with a `CONTENT_SPEC.md` contract. Cost if deferred: MEDIUM.
3. **SEO architecture as an afterthought** — Launching without per-page `generateMetadata`, canonical tags, and sitemap means content pages never rank. Prevention: Build the full SEO pipeline in Phase 1 before any content pages. Cost if deferred: MEDIUM (requires 2-4 week re-crawl wait).
4. **Animation performance killing Core Web Vitals** — Bold & Playful UI with mascot, counters, and carousels can push LCP above 2.5s and CLS above 0.1 on mobile. Prevention: CSS-only animations (`transform`/`opacity` only), `image-rendering: pixelated` for mascot, `IntersectionObserver` for scroll triggers, mascot sprite under 200KB. Must be established as rules before building individual animated components.
5. **Pixel-art mascot rendered blurry** — Missing `image-rendering: pixelated` destroys the core visual identity on HiDPI screens. Prevention: Apply globally to all pixel-art elements; never use Next.js `<Image>` with pixel-art assets (use plain `<img>`). Recovery cost: LOW (CSS-only fix), but embarrassing if shipped.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation — i18n, Content System, SEO Infrastructure

**Rationale:** Architecture research identifies a strict build-order dependency: the i18n route structure, content layer, and SEO pipeline must exist before any page is written. PITFALLS.md flags all three as critical pitfalls with HIGH recovery cost if deferred. No content pages should exist until this foundation is verified end-to-end.

**Delivers:** Working skeleton of the site: `app/[lang]/` routing, `lib/content/*.ts` with typed schemas and zod validation, `dictionaries/en.json` with `getDictionary`, full SEO pipeline (`generateMetadata`, `sitemap.ts`, `robots.ts`, OG tags), and a single diary index page proving the content-to-HTML pipeline works. OpenClaw content spec document.

**Addresses:** All table-stakes SEO features, i18n architecture requirement, automation-ready content structure, `next-intl` integration.

**Avoids:** Pitfalls 1 (i18n too late), 2 (automation-unfriendly content), 3 (SEO too late), 6 (hardcoded English in metadata).

---

### Phase 2: Core Content Sections — Listing + Detail Pages

**Rationale:** With the content pipeline validated, the next priority is building all four content sections (diary, articles, science, skill packs) following the same repeating pattern: listing page + detail page + `generateStaticParams` + `generateMetadata`. Architecture research shows these are low-complexity and high-value; they form the product's core utility.

**Delivers:** Fully browsable diary, articles, science, and skill packs sections with static generation across all content files, per-page SEO metadata, and OpenClaw-publishable content in each section. All four content types accessible end-to-end.

**Uses:** `gray-matter` frontmatter parsing, `globby` content enumeration, `@next/mdx` rendering, `rehype-pretty-code` for syntax highlighting in articles/science, `@tailwindcss/typography` for prose styling.

**Implements:** `lib/content/*.ts` data access functions, section `page.tsx` + `[slug]/page.tsx` routes, `generateStaticParams` patterns, ISR revalidation for diary/article pages.

---

### Phase 3: UI System — Bold & Playful Design + Mascot + Navigation

**Rationale:** Once content sections are structurally sound, the design system can be built on top of them. PITFALLS.md recommends establishing animation performance rules (CSS-only, `image-rendering: pixelated`, `IntersectionObserver`) before building individual animated components — this phase sets those rules and builds the mascot integration. Navigation and footer complete the shell.

**Delivers:** Full Tailwind v4 design system (color tokens, typography scale, component primitives), pixel-art mascot with crisp HiDPI rendering and idle animation, fixed navigation bar (server-rendered + client mobile menu island), comprehensive footer, responsive layout across all sections, 404 page with mascot.

**Uses:** Tailwind CSS v4 `@theme {}` CSS-first config, `motion` library for mascot floating animation, `next/image` for non-pixel-art photos, plain `<img>` with `image-rendering: pixelated` for mascot sprites.

**Avoids:** Pitfalls 4 (animation performance), 5 (mascot blurry), UX pitfalls (insufficient contrast on bold colors, no close affordance on mobile menu).

---

### Phase 4: Homepage — Hero, Carousels, Stats Counter

**Rationale:** The homepage aggregates data from all content sections (FEATURES.md dependency graph confirms this explicitly). It cannot be built before sections exist. This phase assembles the site's "front door" using content that already exists in the file system.

**Delivers:** Full homepage: hero section with concept explanation and AI-agent framing, animated diary carousel (latest 3 entries), article highlight cards, live animated stats counter (entry count, article count, skill pack count), value proposition grid, OpenClaw/EasyClaw CTA block.

**Uses:** `StatsCounter` ("use client", `IntersectionObserver` trigger, `sessionStorage` single-play), `DiaryCarousel` ("use client", auto-scroll with manual controls), content loaders from `lib/content/*.ts`, `motion` for counter animation.

**Implements:** Architecture Pattern 3 (Server-Component-First with surgical client boundaries) — homepage is a Server Component that passes content data as props to interactive client islands.

---

### Phase 5: OpenClaw Automation Integration + API Layer

**Rationale:** ARCHITECTURE.md places the automation hook last in its recommended build order: "depends on the revalidation API being stable." At this point all content pages exist and can be verified against OpenClaw's output. This phase closes the autonomous publishing loop.

**Delivers:** `POST /api/revalidate` webhook with secret-token auth, `GET /rss.xml/route.ts` feed for diary and articles, end-to-end OpenClaw publish test (file write → webhook → ISR → page appears within 60 seconds), `CONTENT_SPEC.md` document for OpenClaw reference, security hardening (Content-Security-Policy headers, `robots.txt` environment verification).

**Avoids:** Security pitfalls (unauthenticated webhook endpoint, ISR cache never busting in production, `robots.txt` blocking production crawlers).

---

### Phase 6: Polish + Launch Readiness

**Rationale:** All core functionality exists. This phase addresses v1.x features deferred from earlier phases and verifies the full "Looks Done But Isn't" checklist from PITFALLS.md before launch.

**Delivers:** Comment/feedback system (Giscus embed on diary + article detail pages), structured data/JSON-LD for articles and diary posts, WCAG AA contrast audit and fixes, Lighthouse mobile score above 90, full SEO validation (Search Console submission, sitemap verification), OpenClaw end-to-end publish test on production, favicon (pixel-art mascot variant).

**Uses:** `@giscus/react` ("use client"), JSON-LD script tags in `generateMetadata`, `next-sitemap` for post-build sitemap generation with locale-aware `hreflang` entries.

---

### Phase Ordering Rationale

- **Content system before UI:** The content pipeline (Phase 1-2) must be stable before the UI is built on top of it. Building carousels or counters before the data they display is a common cause of rework.
- **i18n in Phase 1, not Phase N:** PITFALLS.md assigns this a HIGH recovery cost if deferred. It is architectural, not cosmetic.
- **SEO in Phase 1, not Phase N:** Launching content pages without metadata means organic search discovers nothing. Each week without proper indexing is compounded ranking loss.
- **Homepage in Phase 4, not Phase 1:** FEATURES.md dependency graph is explicit: the homepage aggregates from sections. Sections must precede the homepage that showcases them.
- **Automation integration in Phase 5:** The ISR revalidation endpoint is only useful once there are pages to revalidate. Building it before content pages exist creates a dangling API with nothing to test against.
- **Polish in Phase 6:** Comments, structured data, and final accessibility audit are real features but do not block the AI-autonomy core value proposition. Launching without them is acceptable; launching with broken i18n routing or no sitemap is not.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1 (i18n + Content):** next-intl 3.x proxy configuration for Next.js 16 App Router middleware may have breaking changes — verify `proxy.ts` patterns against current next-intl docs at planning time.
- **Phase 5 (Automation Integration):** OpenClaw's actual file-writing mechanism and git-push vs. direct filesystem approach is not fully specified in available research. Needs clarification on deployment infrastructure (Vercel vs. self-hosted) to confirm which ISR revalidation path applies.

Phases with standard patterns (skip research-phase):
- **Phase 2 (Content Sections):** Next.js `generateStaticParams` + MDX patterns are extremely well-documented in official docs. No research needed.
- **Phase 3 (UI System):** Tailwind v4 + motion animation patterns are well-established. CSS `image-rendering: pixelated` for pixel art is a solved problem.
- **Phase 4 (Homepage):** Composition of already-built components. No new technical unknowns.
- **Phase 6 (Polish):** Giscus integration is a 10-line embed. JSON-LD patterns are standard. WCAG auditing is tooling work (Lighthouse).

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Core stack (Next.js 16.2.1, Tailwind v4.2, next-intl) verified via official docs fetched 2026-03-25. Motion/Giscus versions from training knowledge — verify with `npm show` at install. |
| Features | MEDIUM | sanwan.ai analysis from training data, not live site inspection (web tools unavailable during research). Table stakes and anti-features are HIGH confidence. sanwan.ai feature parity needs manual verification before roadmap finalization. |
| Architecture | HIGH | Sourced directly from official Next.js 16.x docs (2026-03-25). All patterns (RSC-first, ISR, locale-scoped SSG, content layer abstraction) are from official documentation. |
| Pitfalls | MEDIUM-HIGH | i18n, SEO, and animation pitfalls are well-established community patterns. OpenClaw-specific pitfalls are inferred from project requirements and autonomous agent publishing patterns. WebSearch unavailable for live verification. |

**Overall confidence:** HIGH for technical approach; MEDIUM for product/feature decisions pending sanwan.ai live verification.

### Gaps to Address

- **sanwan.ai live verification:** Feature research is based on training-data knowledge of sanwan.ai. Before finalizing the roadmap, manually verify the current live site's feature set — the AI landscape moves fast and the site may have changed significantly.
- **OpenClaw deployment mechanism:** Research assumes Vercel hosting with git-push deploy. If the actual deployment target differs (self-hosted, Fly.io, Cloudflare Pages), the ISR revalidation strategy in Phase 5 needs adjustment — some platforms have different `revalidatePath` behavior.
- **Pixel-art mascot assets:** Research assumes the Garfield-style pixel-art cat mascot assets will be created. The asset creation process and final art style are outside the scope of this technical research. Asset pipeline decisions (sprite sheet format, animation frame count, color palette) should be confirmed before Phase 3.
- **next-intl peer dependency compatibility:** next-intl follows Next.js versions closely. At install time, verify `npm install next-intl` resolves cleanly against Next.js 16.x with no peer dependency conflicts.

## Sources

### Primary (HIGH confidence)
- `https://nextjs.org/docs/app/getting-started/installation` — Next.js 16.2.1 confirmed stable; default stack (TypeScript, Tailwind v4, App Router, Turbopack, ESLint)
- `https://nextjs.org/docs/app/guides/internationalization` — next-intl as primary community library; `[lang]` segment pattern; `proxy.ts` middleware approach
- `https://nextjs.org/docs/app/guides/mdx` — `@next/mdx` setup, Turbopack plugin string format, frontmatter patterns
- `https://nextjs.org/docs/app/getting-started/metadata-and-og-images` — `generateMetadata`, streaming metadata, OG image generation
- `https://nextjs.org/docs/app/getting-started/project-structure` — Official project structure; route groups, layouts, server-only patterns
- `https://nextjs.org/docs/app/getting-started/server-and-client-components` — RSC-first defaults, `"use client"` boundary rules
- `https://tailwindcss.com/blog/tailwindcss-v4` — v4 CSS-first config, `@theme {}`, 3-8x performance improvement
- `https://nextjs.org/blog/next-15` and `next-15-1` — React 19 canary, Turbopack stable, async APIs

### Secondary (MEDIUM confidence)
- sanwan.ai (training knowledge, not live verification) — Reference site feature set: mascot, diary, stats counter, skill packs, OpenClaw promotion. Flag for manual verification.
- Domain expertise: Content website conventions (Substack, Ghost, Next.js blog starters) — table stakes features, anti-features rationale
- Domain expertise: Core Web Vitals guidance (web.dev) — animation performance rules, LCP/CLS thresholds
- Domain expertise: WCAG AA contrast requirements (W3C) — 4.5:1 body text, 3:1 large text

### Tertiary (LOW confidence — verify at install time)
- motion v11.x React 19 compatibility — training knowledge; run `npm show motion version` to confirm
- @giscus/react v3.x — training knowledge; verify current version and Next.js 16 compatibility

---
*Research completed: 2026-03-28*
*Ready for roadmap: yes*
