# Phase 1: Foundation - Research

**Researched:** 2026-03-28
**Domain:** Next.js 16 App Router — i18n routing, typed MDX content layer, SEO pipeline
**Confidence:** HIGH (core stack verified via official docs and npm registry)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** All content types share common frontmatter fields: `title`, `date`, `excerpt`, `thumbnail`, `slug`, `tags`
- **D-02:** Type-specific additional fields: Skill Packs get `category` and `downloadUrl`; Science gets `difficulty` level; Diary gets `dayNumber`
- **D-03:** Zod schemas validate frontmatter at build time — malformed entries fail the build with descriptive errors
- **D-04:** Deploy to Vercel — native Next.js support, built-in ISR, edge functions, zero-config deployment
- **D-05:** ISR revalidation via `revalidatePath()` API route — OpenClaw will call this webhook after writing new content
- **D-06:** Flat directory structure per content type: `/content/diary/`, `/content/articles/`, `/content/science/`, `/content/skills/`
- **D-07:** One MDX file per entry, no nested subdirectories — filename is the slug (e.g., `day-001.mdx`, `getting-started-with-ai.mdx`)
- **D-08:** Content access layer in `lib/content/` with typed functions per content type (e.g., `getDiaryEntries()`, `getArticleBySlug()`)
- **D-09:** Use Next.js Metadata API (`generateMetadata()`) in each route for per-page titles, descriptions, and canonical URLs
- **D-10:** Open Graph tags generated per page from content frontmatter
- **D-11:** `app/sitemap.ts` generates sitemap.xml dynamically from content entries; `app/robots.ts` generates robots.txt
- **D-12:** `app/[lang]/` route wrapper with next-intl — all routes are locale-prefixed
- **D-13:** Root `/` redirects to `/en/` — English is the only language for v1
- **D-14:** All UI strings externalized into JSON dictionary files from day one — never hardcode text in components

### Claude's Discretion

- TypeScript configuration details (strict mode settings, path aliases)
- Tailwind CSS v4 initial configuration
- ESLint/Prettier setup
- Package manager choice (npm vs pnpm)
- Exact next-intl middleware configuration

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUN-01 | Project bootstrapped with Next.js 16 App Router, TypeScript, Tailwind CSS v4 | `create-next-app@latest` with `--typescript --eslint --app --tailwind --turbopack` flags; Next.js 16.2.1 confirmed current |
| FOUN-02 | i18n routing architecture established (`app/[lang]/`) with next-intl — English only, strings externalized | next-intl 4.8.3 confirmed; middleware pattern + `[lang]` route segment + `dictionaries/en.json` |
| FOUN-03 | Content storage structure defined — MDX files with frontmatter in `/content/` directories | Flat `/content/diary/`, `/content/articles/`, `/content/science/`, `/content/skills/` directories with `.mdx` files |
| FOUN-04 | Content access layer (`lib/content/`) with typed functions for reading/listing content | `gray-matter` 4.0.3 + `globby` 16.2.0 for filesystem access; Zod 4.3.6 for frontmatter validation; `server-only` guard |
| FOUN-05 | SEO pipeline established — per-page metadata, Open Graph tags, robots.txt, sitemap.xml | Next.js built-in `generateMetadata()`, `app/sitemap.ts`, `app/robots.ts` — no third-party library needed |
</phase_requirements>

---

## Summary

Phase 1 establishes the complete architectural skeleton for AquaClaw.ai: a Next.js 16 App Router project with locale-prefixed routing via next-intl, a server-only typed content access layer reading MDX files from `/content/`, and a full SEO pipeline using Next.js built-in APIs. No visible pages are produced — only the infrastructure all subsequent phases depend on.

All key technology decisions are already locked in CONTEXT.md. The stack is well-researched (STACK.md, ARCHITECTURE.md, PITFALLS.md in `.planning/research/`) and all package versions have been verified against the npm registry as of 2026-03-28. The primary execution risks are (1) next-intl middleware configuration for Next.js 16 App Router — the v4 release made a breaking change in how the middleware file is named and exported, and (2) the Turbopack constraint that MDX plugins must be passed as strings (not function references) in `next.config.mjs`.

The phase has zero external runtime dependencies beyond Node.js (v25.6.1 available). `npm run build` TypeScript strict mode compliance is a success criterion, so the tsconfig and Zod schema design must be correct from the first commit.

**Primary recommendation:** Bootstrap with `create-next-app`, install next-intl + content dependencies immediately, then implement the three subsystems in strict dependency order: (1) i18n routing, (2) content access layer, (3) SEO pipeline. Verify each layer independently before wiring them together.

---

## Standard Stack

### Core (Phase 1 scope only)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.1 | App Router framework | Confirmed current stable via npm registry 2026-03-28; built-in Metadata API, sitemap, MDX, ISR — no extra plugins for SEO |
| React | 19.x (bundled) | UI rendering | Auto-bundled with Next.js App Router; Server Components default means dictionaries never bloat client bundle |
| TypeScript | 5.x | Type safety | Default in `create-next-app`; strict mode required by success criterion FOUN-01 |
| Tailwind CSS | 4.2.2 | Utility styling | Confirmed current via npm registry; v4 CSS-first config (no `tailwind.config.js`); default in `create-next-app` |
| next-intl | 4.8.3 | i18n routing + translations | Confirmed current via npm registry; primary App Router i18n library in official Next.js docs; middleware-based locale routing |
| gray-matter | 4.0.3 | Frontmatter parsing | Confirmed current; parses YAML frontmatter from MDX files server-side; zero client JS |
| globby | 16.2.0 | Filesystem glob | Confirmed current; enumerates `/content/**/*.mdx` to build content index; ESM-only |
| Zod | 4.3.6 | Schema validation | Confirmed current; validates frontmatter at build time per D-03; descriptive errors when malformed |

### Supporting (installed in Phase 1, used more in later phases)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @next/mdx | 16.2.1 | MDX processing | Required for rendering `.mdx` files in content pages (used by Phases 4–7) |
| remark-gfm | 4.0.1 | GitHub Flavored Markdown | Tables, task lists in MDX content; configure in `next.config.mjs` |
| rehype-pretty-code | 0.14.3 | Syntax highlighting | Code blocks in articles/science content; build-time, zero client JS |
| sharp | 0.34.5 | Image optimization | Auto-used by Next.js `<Image>` in production; install as production dep |

### Not needed in Phase 1

| Library | Phase | Reason deferred |
|---------|-------|-----------------|
| motion | Phase 2 | No animations in foundation phase |
| @tailwindcss/typography | Phase 4+ | Needed only when MDX content pages render prose |
| @giscus/react | Phase 11 | Comment system is an engagement feature |

### Installation

```bash
# Bootstrap — includes TypeScript, Tailwind v4, App Router, Turbopack, ESLint by default
npx create-next-app@latest aquaclaw --typescript --eslint --app --tailwind --turbopack

cd aquaclaw

# i18n
npm install next-intl

# Content layer
npm install gray-matter globby zod
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
npm install remark-gfm rehype-pretty-code

# Production image optimization (not devDependency)
npm install sharp

# Dev types
npm install -D @types/node
```

**Version verification (confirmed 2026-03-28 via npm registry):**

| Package | Registry version | Published |
|---------|-----------------|-----------|
| next | 16.2.1 | confirmed |
| next-intl | 4.8.3 | confirmed |
| gray-matter | 4.0.3 | confirmed |
| globby | 16.2.0 | confirmed |
| zod | 4.3.6 | confirmed |
| tailwindcss | 4.2.2 | confirmed |
| remark-gfm | 4.0.1 | confirmed |
| rehype-pretty-code | 0.14.3 | confirmed |
| sharp | 0.34.5 | confirmed |
| @next/mdx | 16.2.1 | confirmed |

---

## Architecture Patterns

### Recommended Project Structure (Phase 1 scope)

```
aquaclaw/
├── app/
│   ├── [lang]/
│   │   ├── layout.tsx           # Root layout — i18n context, minimal shell
│   │   └── page.tsx             # Placeholder homepage (proof that routing works)
│   ├── sitemap.ts               # Dynamic sitemap from content filesystem
│   └── robots.ts                # robots.txt generation
│
├── content/                     # Source of truth — NEVER under app/
│   ├── diary/
│   │   └── day-001.mdx          # Test entry for FOUN-03/04 verification
│   ├── articles/
│   ├── science/
│   └── skills/
│
├── dictionaries/                # i18n strings — server-only
│   └── en.json                  # All UI strings; add zh.json later
│
├── lib/
│   ├── content/
│   │   ├── diary.ts             # getDiaryEntries(), getDiaryEntry(slug)
│   │   ├── articles.ts
│   │   ├── science.ts
│   │   └── skills.ts
│   ├── i18n/
│   │   └── getDictionary.ts     # getDictionary(locale) — server-only
│   └── seo/
│       └── metadata.ts          # Shared metadata helpers
│
├── middleware.ts                 # next-intl locale detection + redirect
├── mdx-components.tsx            # Required by @next/mdx — global MDX overrides
└── next.config.mjs              # MDX plugins, i18n config
```

### Pattern 1: next-intl Middleware (i18n routing)

**What:** `middleware.ts` at project root handles locale detection. Root `/` redirects to `/en/`. All public routes live under `app/[lang]/`.

**Critical detail for next-intl 3.x/4.x:** The middleware file is named `middleware.ts` (not `proxy.ts`). The `createMiddleware` function from `next-intl/middleware` handles locale matching and redirect. The `[lang]` param name must match what `createMiddleware` injects.

**Example:**
```typescript
// middleware.ts — project root
import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['en'],           // Add 'zh', 'ja' here later — no routing refactor needed
  defaultLocale: 'en',
  localePrefix: 'always'     // Always show /en/ prefix — canonical URL consistency
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
```

**Why `localePrefix: 'always'`:** Prevents duplicate content between `/` and `/en/`. Every page has exactly one canonical URL.

### Pattern 2: i18n Dictionary Loading (server-only)

**What:** Translation strings live in `dictionaries/en.json`. The `getDictionary()` function is marked `server-only` — dictionaries never ship in the client bundle.

**Example:**
```typescript
// lib/i18n/getDictionary.ts
import 'server-only'

const dictionaries = {
  en: () => import('../../dictionaries/en.json').then((m) => m.default),
}

export type Locale = keyof typeof dictionaries

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]()
}
```

```json
// dictionaries/en.json — minimal v1 seed
{
  "site": {
    "name": "AquaClaw.ai",
    "tagline": "An AI agent running this website"
  },
  "nav": {
    "diary": "Diary",
    "articles": "Articles"
  }
}
```

**In page components:**
```typescript
// app/[lang]/page.tsx
import { getDictionary } from '@/lib/i18n/getDictionary'

export default async function HomePage({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang as 'en')
  return <h1>{dict.site.tagline}</h1>
}
```

### Pattern 3: Typed Content Access Layer with Zod Validation

**What:** All content reads go through `lib/content/*.ts`. Each file exports typed functions. Zod validates frontmatter at build time — malformed files throw descriptive errors, failing the build.

**Critical:** Mark all content files `server-only` to prevent accidental client-side imports. Use `path.join(process.cwd(), 'content/diary')` — not relative paths — because Next.js build changes `cwd`.

**Example (diary.ts — the pattern for all four content types):**
```typescript
// lib/content/diary.ts
import 'server-only'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { z } from 'zod'

// Zod schema — D-01 common fields + D-02 diary-specific field
const DiaryFrontmatterSchema = z.object({
  title: z.string(),
  date: z.string(),
  excerpt: z.string(),
  thumbnail: z.string().optional(),
  slug: z.string().optional(),   // falls back to filename if absent
  tags: z.array(z.string()).default([]),
  dayNumber: z.number().int().positive(), // D-02: diary-specific
})

export type DiaryFrontmatter = z.infer<typeof DiaryFrontmatterSchema>

export interface DiaryEntry extends DiaryFrontmatter {
  slug: string
  content: string
}

export function getDiaryEntries(): DiaryEntry[] {
  const dir = path.join(process.cwd(), 'content/diary')

  if (!fs.existsSync(dir)) return []

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))

  return files
    .map((filename) => {
      const raw = fs.readFileSync(path.join(dir, filename), 'utf-8')
      const { data, content } = matter(raw)

      // D-03: Fail build with descriptive error on invalid frontmatter
      const parsed = DiaryFrontmatterSchema.safeParse(data)
      if (!parsed.success) {
        throw new Error(
          `Invalid frontmatter in content/diary/${filename}:\n${parsed.error.message}`
        )
      }

      return {
        ...parsed.data,
        slug: parsed.data.slug ?? filename.replace('.mdx', ''),
        content,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getDiaryEntry(slug: string): DiaryEntry | null {
  const entries = getDiaryEntries()
  return entries.find((e) => e.slug === slug) ?? null
}
```

### Pattern 4: SEO Metadata Pipeline

**What:** Every page exports `generateMetadata()`. Shared metadata helpers in `lib/seo/metadata.ts` avoid duplication. `app/sitemap.ts` and `app/robots.ts` are Next.js file conventions that generate XML/text at the standard routes.

**Example (generateMetadata in a page):**
```typescript
// app/[lang]/layout.tsx — root layout base metadata
import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://aquaclaw.ai'),
  title: {
    template: '%s | AquaClaw.ai',
    default: 'AquaClaw.ai — An AI-Operated Website',
  },
  openGraph: {
    siteName: 'AquaClaw.ai',
    type: 'website',
  },
}
```

```typescript
// app/sitemap.ts — dynamic from content filesystem
import { MetadataRoute } from 'next'
import { getDiaryEntries } from '@/lib/content/diary'

export default function sitemap(): MetadataRoute.Sitemap {
  const diaryEntries = getDiaryEntries()

  const diaryRoutes = diaryEntries.map((entry) => ({
    url: `https://aquaclaw.ai/en/diary/${entry.slug}`,
    lastModified: new Date(entry.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: 'https://aquaclaw.ai/en',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...diaryRoutes,
  ]
}
```

```typescript
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://aquaclaw.ai/sitemap.xml',
  }
}
```

### Pattern 5: next.config.mjs with MDX and Turbopack

**Critical Turbopack constraint:** When using Turbopack (default in Next.js 16), MDX remark/rehype plugins must be specified as **strings** (module names), not imported function references. This was verified in the Next.js 15.1 changelog and applies to 16.x.

```javascript
// next.config.mjs
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [], // Add CDN patterns as needed
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-gfm'],           // STRING, not imported fn — Turbopack requirement
    rehypePlugins: ['rehype-pretty-code'],   // STRING, not imported fn
  },
})

export default withMDX(nextConfig)
```

**Note:** If Turbopack string-plugin format causes issues at runtime, fall back to passing plugin arrays in non-Turbopack dev mode (`next dev --no-turbopack`) until resolved. This is a known edge case.

### Pattern 6: TypeScript Configuration (Claude's Discretion)

**Recommendation:** Enable strict mode with path aliases for clean imports across the codebase.

```json
// tsconfig.json (additions to create-next-app defaults)
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "paths": {
      "@/*": ["./src/*"]   // if using src/ layout, else "./*"
    }
  }
}
```

`noUncheckedIndexedAccess` is particularly valuable for content array indexing — prevents `entries[0].title` type errors when the array might be empty.

### Anti-Patterns to Avoid

- **Hardcoding English strings in JSX:** `<h1>Welcome to AquaClaw</h1>` — always use `dict.nav.home` or equivalent. This phase establishes the pattern; every subsequent phase follows it.
- **Using `proxy.ts` as the middleware file name:** next-intl expects `middleware.ts`. Using `proxy.ts` requires explicit Next.js middleware config and is error-prone.
- **Putting the i18n middleware matcher too broadly:** Matching `/(.*)`  catches API routes, static files, and `_next/` internals. Use the pattern in Pattern 1 above to exclude them.
- **Calling `fs.readFileSync` directly in page components:** Violates the `lib/content/` boundary; couples routing to I/O.
- **Using `output: 'export'` in next.config:** Full static export disables ISR; breaks D-05 (OpenClaw revalidation webhook). Do not set `output` at all — ISR is the default behavior.
- **Not marking `lib/content/` as `server-only`:** Without the guard, Next.js may attempt to bundle content functions client-side, causing Node.js `fs` errors in the browser.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Locale detection + redirect | Custom regex middleware | `next-intl/middleware` with `createMiddleware` | Accept-Language parsing, cookie persistence, edge cases with bots and crawlers are subtle |
| Frontmatter validation | Custom type guards with `as` casts | Zod schema with `safeParse` | Silent type failures at runtime; build-time errors with no line number; Zod gives exact field + message |
| Sitemap generation | Hand-built XML string template | `app/sitemap.ts` Next.js convention | URL encoding, date formatting, priority normalization, `hreflang` — all handled by Next.js |
| robots.txt | Static file in `/public/` | `app/robots.ts` Next.js convention | Static file cannot be environment-conditional; `app/robots.ts` can check `NODE_ENV` |
| Translation loading | Manual `import` per locale | `getDictionary()` dynamic import map | Dead code elimination, lazy loading per locale, type safety on keys |

**Key insight:** Next.js 16 has built-in solutions for every SEO primitive (metadata, sitemap, robots). Using the file conventions (`app/sitemap.ts`, `app/robots.ts`, `generateMetadata`) means zero third-party dependencies for the SEO pipeline — `next-sitemap` is not needed if Next.js file conventions are used.

---

## Common Pitfalls

### Pitfall 1: next-intl v4 Breaking Change — Middleware API

**What goes wrong:** Documentation examples for next-intl 3.x used `createMiddleware` from `next-intl/middleware`. The v4 release (4.x — the current version) changed the import path and the middleware config API. Using v3 examples verbatim against a v4 install silently fails locale detection.

**Why it happens:** next-intl 4.8.3 is installed (current) but online tutorials and StackOverflow answers predominantly show v3 patterns.

**How to avoid:** Read the [next-intl v4 migration guide](https://next-intl.dev/docs/routing/middleware) directly. Key changes: `createMiddleware` is now `createNavigation` for typed navigation; the middleware setup is via `routing.ts` that centralizes locale config shared by both middleware and navigation helpers.

**Warning signs:** Visiting `/` returns 404 instead of redirecting to `/en/`; locale param is `undefined` in page components.

### Pitfall 2: Turbopack Rejects Imported MDX Plugin Functions

**What goes wrong:** `next.config.mjs` imports `remarkGfm` as a function and passes it to `remarkPlugins`. Works fine with Webpack in production (`npm run build`) but crashes Turbopack dev server (`npm run dev`).

**Why it happens:** Turbopack handles MDX plugin serialization differently and requires plugin names as strings, not function references. This is a known limitation verified in Next.js 15.1 changelog.

**How to avoid:** Use string form: `remarkPlugins: ['remark-gfm']`. If a plugin needs configuration options, pass `['plugin-name', { options }]` tuple format.

**Warning signs:** `npm run dev` crashes with a serialization error in `next.config.mjs`; `npm run build` works but dev does not.

### Pitfall 3: `globby` v14+ Is ESM-Only

**What goes wrong:** `import globby from 'globby'` in a CommonJS file causes `ERR_REQUIRE_ESM`. Even with TypeScript, if the tsconfig target or module settings assume CommonJS, the import fails.

**Why it happens:** globby v14+ dropped CommonJS. The project uses `next.config.mjs` (ESM) but `lib/content/*.ts` TypeScript files may be transpiled to CJS by default.

**How to avoid:** Use `fs.readdirSync` directly instead of globby in `lib/content/` functions (simpler, no dependency, no ESM conflict). Alternatively, use `globby` with `await import('globby')` dynamic import in async contexts. For Phase 1, `fs.readdirSync` is sufficient — globby adds value only when complex glob patterns are needed.

**Warning signs:** `Error [ERR_REQUIRE_ESM]: require() of ES Module` at build time or in dev.

### Pitfall 4: `metadataBase` Missing — OG Image URLs Are Relative

**What goes wrong:** `generateMetadata()` returns `openGraph.images` with a relative path like `/og-image.jpg`. Without `metadataBase` set in the root layout, Next.js cannot resolve this to an absolute URL. Social share cards show broken images.

**Why it happens:** OG image URLs must be absolute for crawlers. Next.js warns about this but does not fail the build.

**How to avoid:** Set `metadataBase: new URL('https://aquaclaw.ai')` in the root layout's `metadata` export. In development, use `new URL(process.env.VERCEL_URL ? 'https://${process.env.VERCEL_URL}' : 'http://localhost:3000')`.

**Warning signs:** Next.js build logs `metadataBase` warning; OG image preview shows broken image on social share debuggers.

### Pitfall 5: TypeScript Strict Mode Rejects `gray-matter` Return Type

**What goes wrong:** `matter(raw).data` returns `{ [key: string]: any }`. With strict TypeScript, spreading this into a typed interface fails. `content.title` is typed as `any`, defeating the purpose of the typed content layer.

**Why it happens:** `gray-matter` has no knowledge of the frontmatter schema, so it types `data` as a plain object.

**How to avoid:** Always parse `matter(raw).data` through a Zod schema before using the values. The `DiaryFrontmatterSchema.safeParse(data)` call in Pattern 3 above is the correct approach. Never cast with `as DiaryEntry` — validate first, then type flows correctly.

**Warning signs:** TypeScript errors like `Type 'any' is not assignable to type 'string'` in content functions; or no errors but `any` types throughout the content layer.

### Pitfall 6: `app/sitemap.ts` Not Found — Route Is `sitemap.xml` Not `sitemap`

**What goes wrong:** `sitemap.xml` returns 404. The developer created `app/sitemap.xml.ts` instead of `app/sitemap.ts`.

**Why it happens:** Confusion between the filename (no `.xml`) and the route it generates (`/sitemap.xml`). Next.js file conventions use the name without extension.

**How to avoid:** Create `app/sitemap.ts` (not `app/sitemap.xml.ts`). Next.js generates `/sitemap.xml` from this file automatically. Same for `app/robots.ts` → `/robots.txt`.

---

## Code Examples

### Complete Zod Frontmatter Schema (all content types)

```typescript
// lib/content/schemas.ts
import { z } from 'zod'

// D-01: Common fields across all content types
const CommonFrontmatterSchema = z.object({
  title: z.string(),
  date: z.string(),
  excerpt: z.string(),
  thumbnail: z.string().optional(),
  slug: z.string().optional(),
  tags: z.array(z.string()).default([]),
})

// D-02: Type-specific extensions
export const DiaryFrontmatterSchema = CommonFrontmatterSchema.extend({
  dayNumber: z.number().int().positive(),
})

export const ArticleFrontmatterSchema = CommonFrontmatterSchema

export const ScienceFrontmatterSchema = CommonFrontmatterSchema.extend({
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
})

export const SkillFrontmatterSchema = CommonFrontmatterSchema.extend({
  category: z.string(),
  downloadUrl: z.string().url(),
})
```

### Test MDX file (verifies FOUN-03 and FOUN-04)

```mdx
---
title: "First Day Building AquaClaw"
date: "2026-03-28"
excerpt: "Setting up the foundation — Next.js, i18n, and content layer all running."
dayNumber: 1
tags: ["foundation", "setup"]
---

# First Day Building AquaClaw

Today we bootstrapped the project and got the core infrastructure working.
```

### generateMetadata with locale and content (FOUN-05 verification)

```typescript
// app/[lang]/test/page.tsx — dummy page to verify SEO pipeline
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { lang: string }
}): Promise<Metadata> {
  return {
    title: 'Test Page',
    description: 'Verifying the SEO pipeline is working correctly.',
    openGraph: {
      title: 'Test Page | AquaClaw.ai',
      description: 'Verifying the SEO pipeline is working correctly.',
      url: `https://aquaclaw.ai/${params.lang}/test`,
    },
    alternates: {
      canonical: `https://aquaclaw.ai/${params.lang}/test`,
    },
  }
}

export default function TestPage() {
  return <main><h1>Foundation Test</h1></main>
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `pages/` directory | `app/` directory (App Router) | Next.js 13 (stable 14) | Server Components by default; `generateMetadata` replaces `Head`; `layout.tsx` replaces `_app.tsx` |
| `next export` | `output: 'export'` in config (or no `output` for ISR) | Next.js 14 | `next export` CLI flag removed; ISR is default behavior without `output` key |
| `_middleware.ts` | `middleware.ts` at root | Next.js 13 | Filename changed; matcher config moved to exported `config` object |
| Contentlayer | `gray-matter` + `globby` + Zod | 2024 | Contentlayer is unmaintained; file-system approach is now the standard |
| `next-i18next` | `next-intl` | App Router era (2023+) | `next-i18next` is Pages Router only; `next-intl` is the App Router standard |
| `tailwind.config.js` | CSS-first `@theme {}` in `globals.css` | Tailwind v4 (2024) | No JS config file; tokens defined in CSS |
| `rehype-highlight` / Prism | `rehype-pretty-code` (Shiki) | ~2023 | Build-time highlighting, zero client JS, more themes |

**Deprecated/outdated to avoid:**
- `next-sitemap` package: Not needed if using Next.js built-in `app/sitemap.ts` convention (saves a dependency)
- `@formatjs/intl-localematcher` + `negotiator` for locale detection: Replaced by `next-intl/middleware` which handles this internally
- `next-themes` for dark mode: Per REQUIREMENTS.md out-of-scope — use `prefers-color-scheme` CSS media query only

---

## Project Constraints (from CLAUDE.md)

Directives extracted from `CLAUDE.md` that the planner must honor:

| Directive | Implication for Phase 1 |
|-----------|------------------------|
| English-first with i18n-ready architecture | `app/[lang]/` from first commit; `dictionaries/en.json` seeded |
| Automation-ready: structured markdown/JSON, clear content directories | `/content/diary/`, `/content/articles/`, etc. created; Zod validation enforced |
| Performance: static generation preferred | Server Components default; `'use client'` not used in Phase 1 |
| SEO fundamentals required | `generateMetadata`, `sitemap.ts`, `robots.ts` all operational before phase ends |
| GSD Workflow Enforcement | All code changes must go through `/gsd:execute-phase` — no direct repo edits |
| Pixel-art assets need `image-rendering: pixelated` | Establish CSS rule now even though mascot renders in Phase 2 (per CONTEXT.md specifics) |
| No `pages/` directory | App Router only; never mix `pages/` and `app/` |

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | All build/dev operations | Yes | v25.6.1 | — |
| npm | Package installation | Yes | 11.9.0 | — |
| npx | `create-next-app` bootstrap | Yes | 11.9.0 | — |
| Git | Source control | Assumed yes (project context) | — | — |
| Internet access | npm registry, `create-next-app` download | Assumed yes | — | — |

**Missing dependencies with no fallback:** None.

**Missing dependencies with fallback:** None.

All Phase 1 work is purely local (code + config). No external services (Vercel, GitHub, database) are required during development.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — greenfield project |
| Config file | None — see Wave 0 |
| Quick run command | `npm run build` (TypeScript strict mode check) |
| Full suite command | `npm run build && npx tsc --noEmit` |

**Note:** Phase 1 success criteria are verified by manual inspection and build success rather than automated unit tests. The content layer functions (`getDiaryEntries`, etc.) are pure server-side Node.js — they can be exercised by the build process itself when `app/sitemap.ts` calls them.

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUN-01 | `npm run dev` serves site; `npm run build` succeeds with strict TypeScript | build smoke | `npm run build` | Wave 0: `package.json` created by `create-next-app` |
| FOUN-02 | Visiting `/` redirects to `/en/`; locale param available in pages | manual smoke | `curl -I http://localhost:3000/` (expect 307 → /en/) | Wave 0: `middleware.ts` |
| FOUN-03 | Test MDX file readable from `/content/diary/` | build smoke | `npm run build` (sitemap.ts calls getDiaryEntries) | Wave 0: `content/diary/day-001.mdx` |
| FOUN-04 | `lib/content/diary.ts` parses test file with no TypeScript errors | type check | `npx tsc --noEmit` | Wave 0: `lib/content/diary.ts` |
| FOUN-05 | `/en/test` has `<title>`, OG tags, canonical; `/sitemap.xml` valid; `/robots.txt` valid | manual smoke | `curl http://localhost:3000/sitemap.xml` + view-source | Wave 0: `app/sitemap.ts`, `app/robots.ts`, `app/[lang]/test/page.tsx` |

### Sampling Rate

- **Per task commit:** `npm run build` — catches TypeScript errors and broken imports immediately
- **Per wave merge:** `npm run build && npx tsc --noEmit` — full type check
- **Phase gate:** All 5 success criteria verified manually before `/gsd:verify-work`

### Wave 0 Gaps

All test infrastructure files need creation during implementation:

- [ ] `middleware.ts` — locale routing (FOUN-02)
- [ ] `content/diary/day-001.mdx` — test MDX file with valid frontmatter (FOUN-03)
- [ ] `lib/content/diary.ts` — typed content access function (FOUN-04)
- [ ] `app/sitemap.ts` — dynamic sitemap (FOUN-05)
- [ ] `app/robots.ts` — robots.txt generation (FOUN-05)
- [ ] `app/[lang]/test/page.tsx` — dummy page for SEO verification (FOUN-05)
- [ ] `dictionaries/en.json` — seed translation file (FOUN-02/D-14)

---

## Open Questions

1. **next-intl v4 routing config vs v3 patterns**
   - What we know: next-intl 4.8.3 is current; v4 introduced `routing.ts` as a centralized config file shared by middleware and navigation helpers
   - What's unclear: Whether the single-file `createMiddleware` pattern (v3 style) still works in v4, or whether the `createNavigation` + `routing.ts` pattern is now required
   - Recommendation: Read the [next-intl v4 docs directly](https://next-intl.dev/docs/getting-started/app-router) before writing `middleware.ts`. The v4 pattern is slightly more boilerplate but separates concerns cleanly.

2. **Turbopack string-plugin format stability**
   - What we know: As of Next.js 15.1, MDX plugins in Turbopack must be passed as strings
   - What's unclear: Whether Next.js 16.2.1 has resolved this limitation for function-form plugins
   - Recommendation: Start with string format; if it causes issues with plugin options (e.g., `rehype-pretty-code` theme config), test the tuple format `['rehype-pretty-code', { theme: 'github-dark' }]`.

3. **`globby` vs `fs.readdirSync` for content enumeration**
   - What we know: globby 16.2.0 is ESM-only; may conflict with TypeScript CJS transpilation
   - What's unclear: Whether the project's TypeScript/bundler config will handle globby's ESM cleanly
   - Recommendation: Use `fs.readdirSync` in `lib/content/*.ts` for Phase 1 — it's simpler, zero dependencies, and sufficient for flat directory structures (D-06/D-07). Introduce globby only if nested glob patterns are needed (they aren't for this content structure).

---

## Sources

### Primary (HIGH confidence)

- npm registry live query 2026-03-28 — all package versions verified
- `.planning/research/STACK.md` — stack research with official doc sources, verified 2026-03-28
- `.planning/research/ARCHITECTURE.md` — architecture patterns from official Next.js 16.x docs (updated 2026-03-25)
- `.planning/research/PITFALLS.md` — domain pitfalls, MEDIUM-HIGH confidence

### Secondary (MEDIUM confidence)

- Next.js 15.1 changelog: MDX plugin string format for Turbopack — [https://nextjs.org/blog/next-15-1](https://nextjs.org/blog/next-15-1) (applies to 16.x)
- Tailwind v4 CSS-first config — [https://tailwindcss.com/blog/tailwindcss-v4](https://tailwindcss.com/blog/tailwindcss-v4)
- Next.js built-in Metadata API — [https://nextjs.org/docs/app/getting-started/metadata-and-og-images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)

### Tertiary (LOW confidence — verify at implementation time)

- next-intl v4 routing patterns — training knowledge on v4 API; verify at [https://next-intl.dev/docs/getting-started/app-router](https://next-intl.dev/docs/getting-started/app-router) before writing middleware

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions verified via npm registry 2026-03-28
- Architecture: HIGH — sourced from official Next.js 16.2.1 docs (updated 2026-03-25)
- i18n patterns: MEDIUM — next-intl v4 API changes need direct doc verification
- Pitfalls: MEDIUM-HIGH — established domain patterns; Turbopack MDX pitfall verified in changelog

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (30 days — stack is stable; next-intl minor versions may ship)
