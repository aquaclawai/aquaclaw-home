# Pitfalls Research

**Domain:** Content-heavy AI showcase website (automation-ready, i18n-ready, SEO-critical, animated UI)
**Researched:** 2026-03-28
**Confidence:** MEDIUM-HIGH (based on well-established domain patterns; WebSearch unavailable for live verification)

---

## Critical Pitfalls

### Pitfall 1: i18n Added Late — Requires Structural Rewrite

**What goes wrong:**
The team ships English-only content hardcoded into components and pages. When i18n is added later, every string, route, URL, and content path must be touched. Routing changes break inbound SEO links. Translation keys must be retrofitted into already-delivered components. This is a 2-5x multiplication of any future i18n effort vs. building it in from day one.

**Why it happens:**
"We'll add i18n later" is a common deferral that seems safe because the first language ships either way. The hidden cost is that i18n is an *architectural* concern (routing, content resolution, URL structure, metadata), not a UI concern. Teams treat it as "just swap strings" but it reaches into URL namespacing, sitemap generation, canonical tags, and content file organization.

**How to avoid:**
Use `next-intl` or similar from Phase 1. Structure content directories as `content/en/diary/`, `content/zh/diary/` from day one, even if only `en` is populated. Define all UI strings through translation keys — never hardcode English strings in component JSX. Set up `hreflang` metadata infrastructure during foundation phase.

**Warning signs:**
- Components contain raw English strings in JSX (`<h1>Welcome to AquaClaw</h1>`) rather than using a `t()` function
- Routes are flat (`/diary/`) rather than locale-prefixed (`/en/diary/` or locale-aware middleware)
- Sitemap generation doesn't iterate over locales

**Phase to address:** Foundation / Project Setup phase (Phase 1)

---

### Pitfall 2: Automation-Unfriendly Content Structure

**What goes wrong:**
Content is stored in ad hoc formats, scattered locations, or with implicit conventions that OpenClaw cannot reliably follow. The AI agent produces content that fails validation, lands in wrong directories, or breaks the build. Alternatively, the content schema is so rigid that OpenClaw must produce perfectly formatted frontmatter or the site breaks.

**Why it happens:**
Human-operated sites are built for human editors who understand implicit conventions. OpenClaw is a script — it needs deterministic, explicit contracts. Teams design content for human readability and forget the writer is a machine.

**How to avoid:**
Define a strict but minimal content schema early. Use `zod` or similar for frontmatter validation so malformed content fails loudly at build time, not silently at runtime. Keep required fields minimal — OpenClaw should be able to create a valid entry with only `title`, `date`, `slug`, and `body`. Optional fields should have safe defaults. Provide OpenClaw with a content spec document alongside the site spec.

**Warning signs:**
- Frontmatter fields with no defaults that are required for rendering
- Content path conventions documented only in README, not enforced by code
- Build succeeds with missing `description` field but renders broken meta tags at runtime
- No validation step between content write and build/deploy

**Phase to address:** Foundation / Content System phase (Phase 1 or 2)

---

### Pitfall 3: SEO Architecture Baked In Too Late

**What goes wrong:**
Static HTML is generated but canonical tags, Open Graph metadata, structured data (`JSON-LD`), and XML sitemaps are added as an afterthought. The site launches with duplicate content issues (e.g., `/diary/1` and `/en/diary/1` both index without canonical), missing OG images (social share shows blank), or `robots.txt` blocking crawlers during development and forgotten in production.

**Why it happens:**
SEO infrastructure is invisible during development — the site "works" without it. Teams prioritize visible features and defer metadata work. For a content-heavy site targeting general public, organic search is often the primary acquisition channel, making this a critical mistake.

**How to avoid:**
Set up the full SEO metadata pipeline in Phase 1 before any content pages exist: canonical URL generation, per-page `<title>` + `<meta description>` driven by content frontmatter, OG tags with fallback image, `JSON-LD` for articles/blog posts, XML sitemap generation, `robots.txt`. Validate with Google Search Console at first deploy.

**Warning signs:**
- Pages share a single `<title>` tag
- OG image is hardcoded to one global image
- Sitemap is missing or static (not generated from content)
- `noindex` is set globally and was never removed after development

**Phase to address:** Foundation / SEO Infrastructure phase (Phase 1)

---

### Pitfall 4: Animation Performance Killing Core Web Vitals

**What goes wrong:**
Bold & Playful UI with pixel-art mascot, floating elements, hover animations, and stats counters sounds great in design but ships with janky scroll animations, layout-shifting mascot images, and heavy GIF/spritesheet assets that tank Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS). Google downgrades search ranking. Mobile users see stuttering.

**Why it happens:**
Animations are developed on fast developer machines with desktop GPUs. CSS `@keyframes` and JavaScript animation libraries that perform well on M2 MacBooks cause 100ms+ frame drops on mid-range Android devices. GIF-format pixel art is uncompressed — a 200-frame mascot animation can easily be 2-5MB.

**How to avoid:**
Use CSS animations over JavaScript animations wherever possible (GPU-composited `transform` and `opacity` only — never animate `top`, `left`, `width`, `height`). Deliver pixel-art mascot as CSS sprite sheet (single PNG) or WebP animation, not GIF. Lazy-load animations below the fold using `IntersectionObserver`. Stats counter animations should use `will-change: transform` and be triggered only when visible. Set explicit `width` and `height` on all mascot/image elements to prevent layout shift.

**Warning signs:**
- Mascot delivered as `.gif` file
- Layout shift score above 0.1 in Lighthouse
- LCP above 2.5s on mobile throttled
- Animations using `marginTop`, `left`, or `height` properties

**Phase to address:** UI Foundation phase — establish animation performance rules before building individual components

---

### Pitfall 5: Content Build Times Scaling to Unusable Levels

**What goes wrong:**
With 100 diary entries the site builds in 8 seconds. With 1,000 entries (normal after a year of daily posts) it builds in 80 seconds. With 5,000 entries it times out CI. OpenClaw cannot deploy new content quickly. The "autonomous site" proposition breaks down if publishing requires a 10-minute pipeline.

**Why it happens:**
Static site generation with full rebuild is O(n) in content count. MDX parsing, syntax highlighting, and image optimization are expensive per-file operations. Teams don't stress-test content scale during development.

**How to avoid:**
Use Incremental Static Regeneration (ISR) or on-demand revalidation (`revalidatePath`) for content pages rather than full static generation. Only the homepage and landing pages need pure SSG. Diary and article pages should revalidate on publish. Implement content pagination from day one — never render all entries in a single `getStaticPaths` call. Use a build cache strategy so unchanged pages are not rebuilt.

**Warning signs:**
- `getStaticPaths` returning unbounded content arrays without pagination
- Cold build time above 30 seconds with fewer than 100 entries
- No ISR or revalidation strategy in place

**Phase to address:** Content System phase — establish ISR strategy before content volume grows

---

### Pitfall 6: Hardcoded English in Metadata and Structured Data

**What goes wrong:**
i18n is applied to visible UI strings but `<title>`, `<meta description>`, `JSON-LD` schema, `alt` text on mascot images, and `aria-label` attributes remain hardcoded in English. When other languages are added, metadata is still English — hurting non-English SEO and accessibility. Screen reader users get English announcements regardless of locale.

**Why it happens:**
Developers apply i18n to visible text and forget metadata is also content. `JSON-LD` in particular lives in a `<script>` tag and is easy to overlook. Alt text is often written once and forgotten.

**How to avoid:**
Route all metadata through the same `t()` translation function as visible UI. In Next.js, use the `generateMetadata` function with locale-aware translation calls. Maintain a metadata translation namespace (`messages/en/meta.json`) separate from UI strings. Audit with a metadata completeness checklist before launch.

**Warning signs:**
- `<title>` tags written as static strings in layout files
- `alt=""` on mascot images or using English strings without `t()` wrapper
- `JSON-LD` script tags with hardcoded English property values

**Phase to address:** Foundation / SEO + i18n phase (Phase 1)

---

### Pitfall 7: Pixel-Art Mascot Blurry on High-DPI Screens

**What goes wrong:**
The pixel-art cat mascot is designed at 1x resolution (e.g., 64x64px) and displayed at 128x128px via CSS. The browser anti-aliases it, destroying the pixel-art aesthetic — it looks blurry and smeared instead of crisp. This defeats the entire visual identity.

**Why it happens:**
Pixel art requires `image-rendering: pixelated` (or `crisp-edges`) CSS property to disable browser interpolation. This is a non-obvious CSS property most developers don't know about. Retina/HiDPI displays (2x, 3x) compound the issue.

**How to avoid:**
Apply `image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;` to all pixel-art elements. Design mascot assets at the intended display size — if displayed at 128px, design at 128px and use CSS scaling only as multiples of the source resolution (1x, 2x, 4x). Alternatively, design at 2x source and display at exact 1x — never scale by non-integer factors.

**Warning signs:**
- Mascot looks blurry on any device
- CSS does not include `image-rendering: pixelated`
- Asset files named `mascot@1x.png` displayed with `width: 80px` (non-multiple scaling)

**Phase to address:** UI Foundation phase — establish mascot asset pipeline before building components that use it

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcode English strings in JSX | Faster initial development | Full codebase search-and-replace when i18n added; breaks routing | Never — use translation keys from day one |
| Single global `layout.tsx` metadata | One file to maintain | Every page shares same title/description; duplicate content penalty | Never — per-page metadata is non-negotiable for SEO |
| Full SSG for all content pages | Simple mental model | Build times blow up at scale; OpenClaw publish latency becomes unusable | Acceptable for true static pages (homepage, about); not for diary/articles |
| GIF for mascot animation | Easy to produce | File size, anti-aliasing, no CSS control | Only for social preview images where WebP not supported |
| No frontmatter validation | Faster content authoring | Silent rendering failures when OpenClaw produces incomplete entries | Never — validation is cheap and prevents production breakage |
| Flat content directory (`/content/diary/`) | Simpler file structure | Must restructure when adding second language; breaks all content paths | Never — use locale subdirectories from day one |
| Skip `JSON-LD` structured data | Saves ~2 hours per section | Articles and diary entries never appear as rich results in Google | Acceptable to defer to Phase 2 but not post-launch |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| OpenClaw content writes | OpenClaw creates files assuming specific path conventions that differ from actual build expectations | Define a `CONTENT_SPEC.md` contract at project root that OpenClaw reads; validate with a schema check script before build |
| OpenClaw + ISR revalidation | OpenClaw writes a file but the deployed site keeps serving the cached version; appears to work in dev (no cache) but fails in production | Add a `revalidatePath()` call or webhook trigger as the final step of OpenClaw's publish workflow |
| Comment/feedback system (third-party) | Embedding via `<iframe>` or script breaks CSP headers and creates layout shift | Use async-loaded embeds with explicit height reservation; configure CSP to allow the specific service domain |
| Image optimization (Next.js `<Image>`) | Using `<Image>` with pixel-art assets and `sizes` attribute causes WebP conversion + anti-aliasing | For pixel-art assets, use standard `<img>` with `image-rendering: pixelated`; reserve `<Image>` for photos/non-pixel-art |
| XML Sitemap + i18n | Sitemap lists only English URLs; other locales not indexed | Use `next-sitemap` with locale-aware config; include `hreflang` alternate entries |
| Social OG Images | Dynamic OG images (generated per page) work in development but fail in edge runtime due to font loading | Use `@vercel/og` or `satori` with fonts bundled as static assets, not loaded from CDN |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Unbounded `getStaticPaths` | Build time grows linearly with content; CI timeouts | Paginate content; use ISR for individual entries | ~500 entries (build >60s) |
| JavaScript-driven scroll animations | Frame drops on mid-range Android; battery drain | Use CSS `@keyframes` + `IntersectionObserver`; avoid JS animation loops | Any device without discrete GPU |
| Unoptimized mascot spritesheet | Initial page load blocked by large PNG | Lazy-load below-fold mascot; preload only hero-visible asset | File size >200KB |
| Font loading without `display: swap` | FOIT (flash of invisible text) on slow connections | Use `font-display: swap` for all custom fonts; preload primary font | Any connection slower than 10Mbps |
| Stats counter running on page load | Animation completes before user scrolls to it; re-renders don't replay | Trigger counters via `IntersectionObserver`; only run once per page visit | Always — users miss the animation |
| No pagination on diary listing | Diary page loads 500+ entries; slow TTI | Implement pagination (20 entries/page) from day one | ~100 entries (page becomes sluggish) |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| OpenClaw has direct write access to content dirs with no validation gate | Malformed or injected content breaks build or renders XSS if content is eval'd | Use a content validation middleware between OpenClaw write and deploy trigger; sanitize all rendered content |
| User-submitted comments rendered as raw HTML | XSS attacks via comment system | Use a trusted third-party comment system (Giscus, Disqus) or sanitize all HTML with DOMPurify before render |
| Exposing internal OpenClaw API endpoints publicly | Bot abuse; unauthorized content publishing | API routes that trigger content operations must require a secret token; never expose OpenClaw webhook URL publicly |
| `robots.txt` left in development state | Crawlers blocked; site never indexed | Maintain separate `robots.txt` per environment; verify `User-agent: * Allow: /` in production |
| Missing `Content-Security-Policy` headers | XSS via injected scripts, especially dangerous for a site with automated content | Define CSP headers in `next.config.js`; whitelist only necessary external domains |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Mascot appears on every page with same animation, no variety | Mascot becomes visual noise; users stop noticing it | Vary mascot pose/expression by section; diary = curious pose, articles = reading pose, skill packs = excited pose |
| Stats counters animate on every visit, not first impression | Animation loses impact; feels cheap after second visit | Animate once per session using `sessionStorage` flag; replay only on hard refresh |
| Mobile hamburger menu with no visible close affordance | Mobile users get stuck in open menu overlay | Always include explicit X close button + backdrop tap-to-close |
| Diary entry list shows no preview — just titles and dates | Low click-through rate; users don't know what to expect | Always show 2-3 line excerpt in listing cards |
| Bold colors without sufficient contrast | WCAG AA failure; accessibility complaints; hard to read on mobile in sunlight | Run contrast ratios against WCAG AA (4.5:1 for body, 3:1 for large text) during design phase, not after |
| No loading skeleton for content sections | Layout jumps as content loads; perceived slowness | Add skeleton loaders for diary cards, article cards, skill packs list |
| "Powered by OpenClaw" buried in footer | Misses the entire value proposition of the site | Surface AI-autonomy prominently in hero ("This site is run by an AI agent") and on About page |

---

## "Looks Done But Isn't" Checklist

- [ ] **i18n:** `t()` function used throughout — verify by checking for any raw English strings in JSX (grep `<h[1-6]>` for hardcoded text)
- [ ] **SEO:** Every content page has unique `<title>`, `<meta description>`, and OG tags — verify by viewing source on 3 different diary entries
- [ ] **Sitemap:** `sitemap.xml` includes diary, article, and science pages — verify by hitting `/sitemap.xml` in browser
- [ ] **Mascot:** Pixel-art renders crisp on HiDPI display — verify on a Retina screen; should not look blurry
- [ ] **OpenClaw contract:** Creating a minimal content entry (title + body only) does not break the build — verify by creating test entry with minimal frontmatter
- [ ] **ISR:** Publishing a new diary entry appears on site within 60 seconds without full rebuild — verify by OpenClaw end-to-end publish test
- [ ] **Mobile nav:** Hamburger menu opens and closes correctly; tap-outside closes it — verify on actual iPhone/Android device
- [ ] **robots.txt:** Production `robots.txt` does not contain `Disallow: /` — verify at `https://aquaclaw.ai/robots.txt`
- [ ] **Animations:** All scroll-triggered animations use `IntersectionObserver` — verify by loading page at bottom and scrolling up (animations should trigger)
- [ ] **Comment system:** Comment embed does not cause layout shift — verify Lighthouse CLS score below 0.1
- [ ] **Contrast:** All text passes WCAG AA contrast — run against the bold color palette before launch
- [ ] **OpenClaw API:** Content publish endpoint returns 401 without auth token — verify with unauthenticated `curl`

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| i18n added too late (strings hardcoded) | HIGH | Extract all strings to translation files; restructure routes to locale-prefixed; update all internal links and canonical tags; regenerate sitemap |
| Content structure incompatible with OpenClaw | MEDIUM | Define new schema; write migration script to reformat existing content; update OpenClaw prompt/spec |
| SEO metadata missing at launch | MEDIUM | Implement per-page metadata generation; submit sitemap to Search Console; wait 2-4 weeks for re-crawl |
| Build times unacceptably long | MEDIUM | Migrate to ISR; add content pagination; this may require changing page data-fetching strategy throughout |
| Pixel-art mascot blurry | LOW | Add `image-rendering: pixelated` CSS globally for pixel-art elements; no asset regeneration needed |
| Animation performance on mobile | MEDIUM | Audit and replace JS animations with CSS equivalents; profile with Chrome DevTools on throttled mobile preset |
| OpenClaw content validation failures | LOW | Add zod schema + validation script; reject invalid entries before they reach build |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| i18n added too late | Phase 1 — Foundation & i18n Architecture | Run `grep -r '<h1>\|<h2>\|<p>' src/` — no raw English strings in JSX |
| Automation-unfriendly content structure | Phase 1 — Content System Foundation | Create minimal frontmatter entry; build succeeds |
| SEO architecture baked in too late | Phase 1 — SEO Infrastructure | View source on a diary page; verify unique title, description, OG, JSON-LD |
| Animation killing Core Web Vitals | Phase 2 — UI Foundation | Lighthouse mobile score above 90 before adding content |
| Build time scaling | Phase 2 — Content System | ISR configured; verify with 100 test entries |
| Hardcoded English in metadata | Phase 1 — i18n + SEO | Metadata generated through translation keys |
| Mascot blurry on HiDPI | Phase 2 — UI Foundation / Mascot Integration | View mascot on Retina display; `image-rendering: pixelated` present in CSS |
| No OpenClaw auth on publish endpoint | Phase 3 — Automation Integration | `curl` without token returns 401 |
| Missing contrast on bold UI | Phase 2 — UI Foundation | Lighthouse accessibility score above 90 |

---

## Sources

- Domain knowledge: Next.js i18n architecture (next-intl docs patterns), ISR/on-demand revalidation patterns (Next.js docs)
- Domain knowledge: Core Web Vitals guidance — LCP, CLS, INP (web.dev/vitals)
- Domain knowledge: Pixel-art CSS rendering (`image-rendering: pixelated`) — MDN Web Docs
- Domain knowledge: Content-heavy site build time scaling — common pattern in Jamstack community (Gatsby, Next.js build optimization discussions)
- Domain knowledge: OpenClaw/automation integration — derived from project requirements and general autonomous AI agent content pipeline patterns
- Domain knowledge: WCAG AA contrast requirements — W3C accessibility guidelines
- Confidence caveat: WebSearch was unavailable; all findings are from training knowledge. Claims about specific library versions or 2026 ecosystem state should be verified against current docs during Phase 1.

---
*Pitfalls research for: AI agent showcase / content-heavy website (AquaClaw.ai)*
*Researched: 2026-03-28*
