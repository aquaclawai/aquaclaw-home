# Architecture Research

**Domain:** Content-heavy AI agent showcase website (Next.js App Router)
**Researched:** 2026-03-28
**Confidence:** HIGH — sourced directly from official Next.js 16.x documentation (updated 2026-03-25)

---

## Standard Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                         Browser / Client                             │
│  ┌──────────┐  ┌─────────────┐  ┌───────────┐  ┌────────────────┐   │
│  │  Nav +   │  │  Page Shell │  │ Interactive│  │  Comment /     │   │
│  │ Footer   │  │  (RSC HTML) │  │ Components │  │  Feedback UI   │   │
│  └──────────┘  └─────────────┘  └───────────┘  └────────────────┘   │
└──────────────────────────────┬───────────────────────────────────────┘
                               │ HTTP / RSC Payload
┌──────────────────────────────▼───────────────────────────────────────┐
│                      Next.js App Router (Server)                     │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │                   Routing + Layout Layer                     │    │
│  │  app/[lang]/layout.tsx  →  RootLayout (nav, footer, fonts)  │    │
│  │  app/[lang]/(sections)  →  Section layouts (diary, articles) │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────┐ ┌────────────┐ ┌──────────┐ ┌──────────────────┐    │
│  │  Page RSCs │ │ generateMe │ │  Content │ │  API Route       │    │
│  │  (SSG/ISR) │ │ tadata()   │ │  Loaders │ │  Handlers        │    │
│  └────────────┘ └────────────┘ └──────────┘ └──────────────────┘    │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │                    i18n Proxy Layer                          │    │
│  │  proxy.ts  →  locale detection → redirect to /[lang]/...    │    │
│  └──────────────────────────────────────────────────────────────┘    │
└──────────────────────────────┬───────────────────────────────────────┘
                               │ fs reads / API calls
┌──────────────────────────────▼───────────────────────────────────────┐
│                         Content Layer                                │
│                                                                      │
│  ┌──────────────────────┐   ┌─────────────────────────────────────┐  │
│  │  /content/           │   │  External Services                  │  │
│  │  diary/YYYY-MM-DD.md │   │  - Comment system (Giscus/Disqus)   │  │
│  │  articles/slug.mdx   │   │  - Analytics (Plausible/Vercel)     │  │
│  │  science/slug.mdx    │   │  - OpenClaw webhook (POST /api/...)  │  │
│  │  skill-packs/meta.json│  └─────────────────────────────────────┘  │
│  └──────────────────────┘                                            │
└──────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Root Layout (`app/[lang]/layout.tsx`) | Global shell: nav, footer, fonts, analytics, i18n context | Server Component wrapping all routes |
| Section Layouts | Per-section chrome (sidebar, breadcrumbs, section header) | Server Components, route groups `(diary)`, `(articles)` |
| Page RSCs | Fetch content, render static HTML | `async` Server Components with `generateStaticParams` |
| `generateMetadata()` | Per-page SEO: title, description, OG image, canonical, hreflang | Exported from each `page.tsx` |
| i18n Proxy | Locale detection, redirect `/products` → `/en/products` | `proxy.ts` at root using `@formatjs/intl-localematcher` + `negotiator` |
| Content Loaders (`lib/content/`) | Read MDX/JSON from `content/`, parse frontmatter, return typed objects | Server-only Node.js `fs` + `gray-matter` |
| API Route Handlers (`app/api/`) | OpenClaw webhook ingestion, RSS feed, sitemap, comment proxy | `route.ts` files using Web Request/Response APIs |
| Interactive Client Components | Animations, carousels, mobile nav, comment widget, filters | `"use client"` components, minimal surface area |
| Mascot / UI Primitives | Pixel-art cat, branded buttons, cards — pure presentational | Server-renderable by default; `"use client"` only if animated |

---

## Recommended Project Structure

```
aquaclaw/
├── app/
│   └── [lang]/                  # i18n root — all public routes live here
│       ├── layout.tsx            # Root layout: nav, footer, font, analytics
│       ├── page.tsx              # Homepage
│       ├── (diary)/
│       │   ├── layout.tsx        # Diary section layout
│       │   ├── page.tsx          # Diary index / listing
│       │   └── [slug]/
│       │       └── page.tsx      # Individual diary entry
│       ├── (articles)/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   └── [slug]/page.tsx
│       ├── (science)/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   └── [slug]/page.tsx
│       ├── (skill-packs)/
│       │   ├── layout.tsx
│       │   ├── page.tsx          # Browseable skill pack catalog
│       │   └── [slug]/page.tsx
│       └── openclaw/
│           └── page.tsx          # OpenClaw download + tutorials
│
├── app/api/
│   ├── content/route.ts          # OpenClaw webhook: POST new content
│   ├── rss.xml/route.ts          # RSS feed for diary + articles
│   └── revalidate/route.ts       # On-demand ISR revalidation
│
├── app/
│   ├── sitemap.ts                # Generated sitemap (all locales)
│   └── robots.ts                 # robots.txt
│
├── content/                      # Source of truth for all content
│   ├── diary/
│   │   └── YYYY-MM-DD.mdx        # One file per day, frontmatter: title, date, tags
│   ├── articles/
│   │   └── slug.mdx              # frontmatter: title, date, description, tags
│   ├── science/
│   │   └── slug.mdx
│   └── skill-packs/
│       └── pack-name/
│           ├── meta.json         # title, description, tags, download URL
│           └── README.mdx        # Optional detail page
│
├── dictionaries/                 # i18n translation strings
│   ├── en.json
│   └── [lang].json               # Added when new locale launches
│
├── components/
│   ├── ui/                       # Shared design system primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── MascotCat.tsx
│   ├── sections/                 # Section-specific compound components
│   │   ├── DiaryCarousel.tsx     # "use client" — animated carousel
│   │   ├── ArticleGrid.tsx       # Server Component — static card grid
│   │   ├── SkillPackBrowser.tsx  # "use client" — filter/search state
│   │   └── StatsCounter.tsx      # "use client" — animated number count-up
│   ├── layout/
│   │   ├── Navbar.tsx            # Server Component (static links) + MobileMenu (client)
│   │   └── Footer.tsx
│   └── providers/
│       └── ThemeProvider.tsx     # "use client" context wrapper
│
├── lib/
│   ├── content/                  # Server-only content access layer
│   │   ├── diary.ts              # getAllDiaryEntries(), getDiaryEntry(slug)
│   │   ├── articles.ts
│   │   ├── science.ts
│   │   └── skill-packs.ts
│   ├── i18n/
│   │   └── getDictionary.ts      # getDictionary(locale) — server-only
│   └── seo/
│       └── metadata.ts           # Shared metadata helpers / OG image templates
│
├── public/
│   ├── mascot/                   # Pixel-art cat assets (PNG sprites)
│   └── downloads/                # Skill pack ZIPs (or CDN-linked)
│
├── proxy.ts                      # i18n locale detection + redirect
├── mdx-components.tsx            # Global MDX component overrides (required)
└── next.config.mjs               # MDX, i18n, image domains config
```

### Structure Rationale

- **`app/[lang]/`:** Every public route is scoped under a locale param. This enables static generation per locale via `generateStaticParams` and clean `hreflang` canonical links. When only English is needed, `generateStaticParams` returns `[{ lang: 'en' }]`.
- **Route groups `(diary)`, `(articles)`:** Organise section layouts without polluting the URL with grouping names. Allows independent layout chrome per section.
- **`content/` outside `app/`:** Content files are never routable. Stored flat/structured markdown so OpenClaw can write files directly without knowing Next.js internals. OpenClaw drops a `.mdx` file → ISR revalidation webhook → page regenerates.
- **`lib/content/`:** Centralized, server-only data access functions. Pages never read `fs` directly. This boundary makes it trivial to swap content source later (e.g., move from file system to a headless CMS).
- **`components/sections/`:** Domain-specific compounds kept separate from generic UI primitives. Sections are where most `"use client"` boundaries appear due to animations and interactivity.
- **`dictionaries/`:** JSON translation files loaded server-side only. No client bundle impact. New locale = add one JSON file and extend `generateStaticParams`.

---

## Architectural Patterns

### Pattern 1: File-System Content with ISR

**What:** All content lives as `.mdx` files in `/content/`. Server-side `lib/content/*.ts` functions read the filesystem, parse frontmatter with `gray-matter`, and return typed content objects. Pages use `generateStaticParams` to statically generate all content pages at build time. An API route (`/api/revalidate`) receives a webhook from OpenClaw and calls `revalidatePath()` to regenerate only the changed page.

**When to use:** Any content-heavy site where content is managed programmatically (automation, scripts, AI agents) rather than through a visual CMS.

**Trade-offs:**
- Pro: Zero CMS cost, content is plain files in git, OpenClaw can write files directly
- Pro: All content pages are fully static — extremely fast, no database
- Con: Build time increases with content volume (mitigated by ISR — only changed pages rebuild)
- Con: No visual preview for editors (not needed here — OpenClaw is the editor)

**Example:**
```typescript
// lib/content/diary.ts
import 'server-only'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface DiaryEntry {
  slug: string
  title: string
  date: string
  tags: string[]
  content: string
}

export function getAllDiaryEntries(): DiaryEntry[] {
  const dir = path.join(process.cwd(), 'content/diary')
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'))
  return files
    .map(filename => {
      const raw = fs.readFileSync(path.join(dir, filename), 'utf-8')
      const { data, content } = matter(raw)
      return { slug: filename.replace('.mdx', ''), ...data, content } as DiaryEntry
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
```

---

### Pattern 2: Locale-Scoped Static Generation

**What:** All routes live under `app/[lang]/`. The root layout's `generateStaticParams` declares supported locales. Each page adds its own `generateStaticParams` to enumerate slugs per locale. The `proxy.ts` middleware detects browser locale from `Accept-Language` and redirects `/` to `/en` (or future `/zh`).

**When to use:** Any site that is English-only now but must support multiple languages without a rewrite.

**Trade-offs:**
- Pro: Adding a language later requires only: new dictionary JSON + new locale in `generateStaticParams` — no routing refactor
- Pro: Translated metadata (OG, description, hreflang) is generated automatically per locale
- Con: Slightly deeper folder nesting (`app/[lang]/diary/[slug]/page.tsx` vs `app/diary/[slug]/page.tsx`)

**Example:**
```typescript
// app/[lang]/layout.tsx
export async function generateStaticParams() {
  // English only for v1. Add 'zh', 'ja', etc. here later.
  return [{ lang: 'en' }]
}
```

---

### Pattern 3: Server-Component-First with Surgical Client Boundaries

**What:** Every component defaults to a Server Component. Client Components (`"use client"`) are created only at specific leaf nodes that require browser APIs, state, or interactivity. Shared context (theme, locale) is provided by a Client Component wrapper at the root but its children remain Server Components.

**When to use:** Content-heavy sites where most rendering is static text/images and interactivity is isolated (carousels, counters, mobile menus, comment widgets).

**Trade-offs:**
- Pro: Minimal JavaScript shipped to client — fast FCP and LCP
- Pro: SEO-friendly: all content in initial HTML, no hydration gap
- Con: Requires discipline — third-party components that use hooks must be wrapped

**Example:**
```typescript
// components/layout/Navbar.tsx — Server Component
import { MobileMenuButton } from './MobileMenuButton' // "use client"

export default function Navbar() {
  // Static links render as HTML — no JS needed
  return (
    <nav>
      <a href="/en/diary">Diary</a>
      <a href="/en/articles">Articles</a>
      <MobileMenuButton /> {/* Client island for hamburger toggle */}
    </nav>
  )
}
```

---

### Pattern 4: OpenClaw Automation Webhook

**What:** OpenClaw writes new `.mdx` content files to `/content/` (via filesystem or GitHub push). It then calls `POST /api/content` with an API key and the changed path. The route handler calls `revalidatePath()` or `revalidateTag()` to trigger ISR regeneration of the affected page without a full rebuild.

**When to use:** Any automation workflow where an external agent needs to publish content to the site.

**Trade-offs:**
- Pro: Automation-ready without any CMS; OpenClaw knows only two things: where to drop a file, and a webhook URL
- Con: Requires either: (a) filesystem access to the server, or (b) a git-push deploy pipeline. For production, git-push + Vercel deploy is the simpler path.
- Note: For Vercel-hosted sites, on-demand ISR revalidation via `revalidatePath` is the correct approach. OpenClaw can trigger the webhook after committing content to the repo.

**Example:**
```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { path, secret } = await request.json()
  if (secret !== process.env.REVALIDATION_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }
  revalidatePath(path)
  return Response.json({ revalidated: true, path })
}
```

---

## Data Flow

### Homepage Load (Static, First Visit)

```
Browser GET /
    ↓
proxy.ts → detects no locale → redirects to /en
    ↓
Browser GET /en
    ↓
Next.js serves pre-built static HTML (generated at build time)
    ↓
HTML includes: hero, latest 3 diary entries, article cards, stats
    ↓
Client hydrates interactive islands (StatsCounter animation, DiaryCarousel)
```

### Content Page Load (Article / Diary Entry)

```
Browser GET /en/diary/2026-03-28
    ↓
Next.js serves statically generated HTML
HTML = RSC-rendered MDX → parsed frontmatter + prose content
    ↓
<head> includes: title, description, OG tags, canonical, hreflang
    ↓
Comment widget (Giscus) loads client-side via "use client" component
```

### OpenClaw Content Publishing Flow

```
OpenClaw writes content/diary/2026-03-29.mdx
    ↓
OpenClaw commits to git → Vercel deploy triggered (full rebuild)
  OR
OpenClaw calls POST /api/revalidate { path: "/en/diary/2026-03-29", secret }
    ↓
revalidatePath("/en/diary/2026-03-29") invalidates ISR cache
    ↓
Next visitor to /en/diary/2026-03-29 triggers page regeneration
New static HTML served from cache on subsequent visits
```

### i18n Dictionary Flow

```
app/[lang]/page.tsx (Server Component)
    ↓
const dict = await getDictionary(lang)  // server-only, no client bundle cost
    ↓
Pass dict strings as props to child Server Components
    ↓
"use client" components receive translated strings as props (serializable)
```

### Key Data Flows Summary

1. **Content to page:** `content/*.mdx` → `lib/content/*.ts` (fs read + parse) → Server Component (render) → static HTML
2. **SEO metadata:** `generateMetadata()` in each `page.tsx` reads content data → produces `<head>` tags in initial HTML
3. **i18n strings:** `dictionaries/[lang].json` → `getDictionary(lang)` (server-only) → props to components → rendered HTML
4. **Automation publish:** OpenClaw file write → webhook → `revalidatePath` → ISR cache bust → page regenerates on next request
5. **Client interactivity:** Server Component passes data as props → Client Component receives props → hydrates in browser

---

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0–1k monthly visitors | File-based content, full static build on every commit, Vercel free tier |
| 1k–100k monthly visitors | Add ISR revalidation to avoid full rebuilds; Vercel ISR handles cache automatically |
| 100k+ monthly visitors | Consider moving content to a headless CMS (Contentlayer, Sanity) for faster build times; CDN edge caching already covered by Vercel |

### Scaling Priorities

1. **First bottleneck — build time:** As content grows (1000+ diary entries), `generateStaticParams` iterating all content at build time slows CI. Fix: introduce Incremental Static Regeneration (`revalidate = 3600`) for archive pages, keep only recent entries fully pre-generated.
2. **Second bottleneck — comment system:** If using a self-hosted comment solution, database hits per page view become the bottleneck. Mitigation: use a hosted solution (Giscus via GitHub Discussions) that offloads infrastructure entirely.

---

## Anti-Patterns

### Anti-Pattern 1: Fetching Content in Client Components

**What people do:** Fetch diary entries from an API in a `useEffect` inside a Client Component.

**Why it's wrong:** SEO crawlers see empty content until JavaScript runs. Page renders blank then flickers. Unnecessary client-side network request for content that could be static HTML.

**Do this instead:** Fetch content in a Server Component (or `page.tsx`). Pass the pre-fetched data as props to any interactive Client Component children.

---

### Anti-Pattern 2: Skipping the `app/[lang]/` i18n Wrapper

**What people do:** Build the entire site under `app/` without a locale segment, planning to "add i18n later."

**Why it's wrong:** Adding locale routing after the fact requires renaming every route file and updating all internal links. It is a structural refactor, not a config change.

**Do this instead:** Wrap everything in `app/[lang]/` from the first commit, even if `generateStaticParams` returns only `[{ lang: 'en' }]`. Adding a language later becomes a one-line change.

---

### Anti-Pattern 3: Mixing Content Source and Rendering Logic

**What people do:** Call `fs.readFileSync()` directly inside `page.tsx` to load content.

**Why it's wrong:** Couples routing to content access. If the content source ever changes (e.g., move to a CMS), every page file must be updated.

**Do this instead:** All content access goes through `lib/content/*.ts` functions. Pages import only from these functions. Swapping the content source means updating only the `lib/content/` layer.

---

### Anti-Pattern 4: Making Every Component a Client Component

**What people do:** Add `"use client"` to layout, section containers, and card components because "we'll need interactivity eventually."

**Why it's wrong:** Bloats the JavaScript bundle. Content that could render as static HTML now requires hydration. Hurts Core Web Vitals (LCP, TBT).

**Do this instead:** Default to Server Components. Add `"use client"` only to the smallest leaf component that actually needs `useState`, `useEffect`, or event handlers. Pass data down as props from the Server Component parent.

---

### Anti-Pattern 5: Storing i18n Strings in Client State

**What people do:** Load translation dictionaries client-side (e.g., `i18next` on the client), ship all locale files in the JS bundle.

**Why it's wrong:** Adds unnecessary JavaScript payload. Translations are static strings — they don't need to be reactive.

**Do this instead:** Use `getDictionary(lang)` in Server Components (marked `server-only`). Strings are resolved at render time on the server. Only the HTML output reaches the browser.

---

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Comment system (Giscus) | Client Component wrapper, loads via `<script>` tag | Giscus uses GitHub Discussions — no database needed; zero hosting cost |
| Analytics (Plausible / Vercel Analytics) | Root layout Client Component (lightweight) | Avoid GA for privacy reasons; Plausible has a Next.js package |
| OpenClaw agent | `POST /api/revalidate` webhook + file system / git | Secret-protected; OpenClaw publishes content and triggers ISR |
| RSS feed | `GET /rss.xml/route.ts` — generates XML from content layer | Standard Web Response API; no extra library needed |
| Sitemap | `app/sitemap.ts` — auto-generated from `lib/content/*.ts` | Next.js built-in; generates one entry per locale × per slug |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `app/` (routing) ↔ `lib/content/` (data) | Direct import (server-only functions) | Pages call content functions; never the reverse |
| `lib/content/` ↔ `content/` (files) | Node.js `fs` + `gray-matter` | Content layer is the only consumer of the filesystem; marked `server-only` |
| Server Components ↔ Client Components | Props (serializable data only) | No shared mutable state across the boundary; pass strings/numbers/plain objects |
| `app/api/` ↔ `lib/content/` | Direct import (same process) | Route handlers can call content functions to build RSS, sitemap, or handle webhooks |
| `proxy.ts` ↔ `app/[lang]/` | URL rewrite / redirect | Proxy runs before any page render; it only manipulates the URL |

---

## Build Order Implications

The architecture has clear dependency layers. Build in this order:

1. **Content layer foundation** (`content/` directory structure + `lib/content/*.ts` + `gray-matter`) — everything else depends on having content to read
2. **i18n infrastructure** (`proxy.ts` + `app/[lang]/` route structure + `dictionaries/`) — must be in place before any page is written, or structural refactor required
3. **Root layout + navigation** (`app/[lang]/layout.tsx` + `components/layout/Navbar.tsx` + `Footer.tsx`) — shell that wraps all pages
4. **Core pages with static generation** (Homepage, Diary index, Article index) — validates the content-to-page pipeline works end-to-end
5. **Individual content pages** (Diary slug, Article slug, Science slug) with `generateStaticParams` and `generateMetadata`
6. **Interactive client islands** (DiaryCarousel, StatsCounter, SkillPackBrowser, MobileMenu) — built after their server-rendered parents
7. **API routes** (`/api/revalidate`, `/rss.xml`, sitemap, robots) — plumbing that can be added incrementally
8. **OpenClaw automation hook** — last, depends on the revalidation API being stable

---

## Sources

- Next.js App Router Project Structure (official, v16.2.1, 2026-03-25): https://nextjs.org/docs/app/getting-started/project-structure
- Next.js Internationalization (official, v16.2.1, 2026-03-25): https://nextjs.org/docs/app/guides/internationalization
- Next.js Server and Client Components (official, v16.2.1, 2026-03-25): https://nextjs.org/docs/app/getting-started/server-and-client-components
- Next.js generateMetadata (official, v16.2.1, 2026-03-25): https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- Next.js MDX Guide (official, v16.2.1, 2026-03-25): https://nextjs.org/docs/app/guides/mdx
- Next.js Route Handlers (official, v16.2.1, 2026-03-25): https://nextjs.org/docs/app/api-reference/file-conventions/route

---

*Architecture research for: AquaClaw.ai — content-heavy AI agent showcase website*
*Researched: 2026-03-28*
