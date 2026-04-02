# Phase 4: Diary Section - Research

**Researched:** 2026-04-01
**Domain:** Next.js App Router content pages — MDX rendering, static pagination, i18n routes, ISR
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Responsive card grid — 1 column mobile, 2 columns tablet, 3 columns desktop. Uses existing rounded-xl card tokens from design system.
- **D-02:** Each card shows: thumbnail (or mascot placeholder), Day # pill badge, title, date, excerpt (2-3 lines), and tag pills.
- **D-03:** When no thumbnail in frontmatter, show mascot in a random pose on a colored background using accent palette colors. Reuses MascotImage component.
- **D-04:** Simple page header above cards — "Agent Diary" in Fredoka + one-line description. No hero section, cards are the star.
- **D-05:** Paginate at 12 entries per page. Static page routes: `/diary`, `/diary/page/2`, `/diary/page/3` via `generateStaticParams`.
- **D-06:** Centered prose layout, max-width ~700px. `@tailwindcss/typography` prose classes with Fredoka headings, Nunito body.
- **D-07:** Entry header: "Day N" pill badge, formatted date, tag pills, then title in large Fredoka. Back link ("← Back to Diary") above everything.
- **D-08:** Bottom prev/next navigation bar — full-width: "← Day 3: Title" on left, "Day 5: Title →" on right. Pill-shaped buttons with warm design tokens.
- **D-09:** First-person cat persona — the mascot IS the AI agent, writing about its day. Playful, approachable, matches Bold & Playful brand.
- **D-10:** Short entries (200-500 words) — quick daily-log style. Easy to scan, suitable for frequent automated generation by OpenClaw.
- **D-11:** Standard markdown + images only — no embedded React components in diary MDX. Headings, lists, code blocks, images, links. Keeps content pipeline simple for OpenClaw.
- **D-12:** Newest first sort order (reverse chronological) — matches existing `getDiaryEntries()` sort behavior.
- **D-13:** 3-5 seed diary entries written by Claude during this phase. Cover the first days of "building AquaClaw" in the cat persona. Realistic content for visual testing and immediate demonstration.

### Claude's Discretion
- Card hover effects and micro-animations
- Exact card spacing, padding, and shadow depth
- Pagination component styling (page numbers, arrows)
- Responsive breakpoints for column transitions
- Mascot pose selection logic for placeholder thumbnails
- Exact prev/next button styling
- Seed entry topics and narrative arc

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DIAR-01 | Diary listing page with card grid — thumbnail, title, date, excerpt | `getDiaryEntries()` already exists; route `src/app/[lang]/diary/page.tsx` needs creation; pagination via `generateStaticParams` |
| DIAR-02 | Individual diary entry detail page with full content, date, prev/next navigation | `getDiaryEntry(slug)` already exists; MDX rendering via `@next/mdx` + `next.config.mjs` already configured; route `src/app/[lang]/diary/[slug]/page.tsx` needs creation |
| DIAR-03 | Diary entries stored as MDX files with structured frontmatter (title, date, excerpt, thumbnail) | `DiaryFrontmatterSchema` (Zod) already validates; `content/diary/` exists; seed entries need cat persona voice |
</phase_requirements>

---

## Summary

Phase 4 builds on a solid foundation. The content layer (`lib/content/diary.ts`, `lib/content/schemas.ts`) is fully implemented with gray-matter parsing, Zod validation, and reverse-chronological sorting. The MDX pipeline (`@next/mdx`, `remark-gfm`, `rehype-pretty-code`) is configured in `next.config.mjs`. The design system tokens, typography plugin, and `MascotImage` component are all in place.

The work in this phase is primarily route creation and UI component composition. Three new route files are needed: the listing page, the pagination sub-route, and the detail page. Alongside those, a `DiaryCard` presentational component and a `PaginationBar` component need to be built. The detail page needs MDX content rendering — the key insight is that with App Router, content MDX files are imported directly as React components at build time rather than fetched at runtime.

The one structural complexity is MDX rendering for content files: `@next/mdx` is set up to treat `.mdx` files in `pageExtensions` as pages, but diary entries live in `content/diary/` and are not pages themselves. The correct pattern is to use dynamic `import()` of the MDX file inside the page component (`const { default: Content } = await import('@content/diary/day-001.mdx')`). Because the slug is dynamic, a `import()` with a template literal won't work — the standard approach is to get the slug from `generateStaticParams`, then use `require()` or a dynamic import with a known path mapping. The alternative (and simpler for this project) is to use the already-implemented `getDiaryEntry()` function to get frontmatter + raw content string, then render the raw MDX string via `@mdx-js/react`'s `compileMDX` — but this requires the `next-mdx-remote` approach. The simplest aligned-with-existing-setup approach is: render MDX content files via direct dynamic import, building the import path from the slug at page generation time using `generateStaticParams`.

**Primary recommendation:** Use dynamic `import(\`../../../../../content/diary/${slug}.mdx\`)` inside `generateStaticParams`-driven detail pages. Since all slugs are known at build time, Next.js can statically analyze and bundle each MDX file. This avoids adding `next-mdx-remote` and stays within the already-configured `@next/mdx` setup.

---

## Standard Stack

### Core (already installed — no new packages needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@next/mdx` | bundled with Next.js 16.2.1 | MDX file compilation | Already in `next.config.mjs`; renders MDX at build time, zero client JS |
| `gray-matter` | ^4.0.3 | Frontmatter parsing | Already in `lib/content/diary.ts`; used for listing pages |
| `remark-gfm` | ^4.0.1 | GFM Markdown features | Already in `next.config.mjs` as string plugin |
| `rehype-pretty-code` | ^0.14.3 | Code block syntax highlighting | Already in `next.config.mjs` as string plugin |
| `@tailwindcss/typography` | ^0.5.19 | Prose styling for MDX | Already in `globals.css` via `@plugin`; use `prose` classes on detail page |
| `zod` | ^4.3.6 | Frontmatter schema validation | Already in `lib/content/schemas.ts` |

### No New Packages Required

All necessary libraries are already installed. This phase is purely route + component work.

---

## Architecture Patterns

### Recommended Project Structure for This Phase

```
src/app/[lang]/diary/
├── page.tsx                     # Listing page — page 1 (diary index)
├── page/
│   └── [page]/
│       └── page.tsx             # Pagination pages: /diary/page/2, /diary/page/3
└── [slug]/
    └── page.tsx                 # Detail page: /diary/day-001

src/components/diary/
├── DiaryCard.tsx                # Card component (server component)
├── DiaryCardGrid.tsx            # Grid wrapper (server component)
├── PaginationBar.tsx            # Page number navigation (server component)
└── DiaryPrevNext.tsx            # Prev/next navigation bar (server component)

content/diary/
├── day-001.mdx                  # Existing (needs cat persona voice update)
├── day-002.mdx                  # Seed entry
├── day-003.mdx                  # Seed entry
├── day-004.mdx                  # Seed entry
└── day-005.mdx                  # Seed entry
```

### Pattern 1: Listing Page with Pagination

**What:** Server component that calls `getDiaryEntries()`, slices to page, renders `DiaryCardGrid`.

**Import path for content functions:** Use relative import `../../../../../lib/content/diary` (same pattern as `src/app/sitemap.ts` which uses `../../lib/content/diary`).

**generateStaticParams for pagination:**
```typescript
// src/app/[lang]/diary/page/[page]/page.tsx
import { getDiaryEntries } from '../../../../../lib/content/diary'

const PAGE_SIZE = 12

export async function generateStaticParams() {
  const entries = getDiaryEntries()
  const totalPages = Math.ceil(entries.length / PAGE_SIZE)
  const locales = ['en']
  return locales.flatMap((lang) =>
    Array.from({ length: totalPages }, (_, i) => ({
      lang,
      page: String(i + 1),
    }))
  )
}
```

The root `/diary` page handles page 1 with the same slice logic (no redirect needed — two files, identical logic, page=1 hardcoded).

### Pattern 2: Detail Page — MDX Rendering

**What:** Dynamic import of MDX file as React component, combined with frontmatter from `getDiaryEntry()`.

**Key constraint:** With Turbopack and `@next/mdx` configured as string plugins, MDX files in `content/` are compiled at build time when imported. Dynamic imports with full computed paths work in `generateStaticParams` context.

```typescript
// src/app/[lang]/diary/[slug]/page.tsx
import { getDiaryEntries, getDiaryEntry } from '../../../../../lib/content/diary'

export async function generateStaticParams() {
  const entries = getDiaryEntries()
  const locales = ['en']
  return locales.flatMap((lang) =>
    entries.map((entry) => ({ lang, slug: entry.slug }))
  )
}

interface DiaryDetailPageProps {
  params: Promise<{ lang: string; slug: string }>
}

export default async function DiaryDetailPage({ params }: DiaryDetailPageProps) {
  const { lang, slug } = await params
  const entry = getDiaryEntry(slug)
  if (!entry) notFound()

  // Dynamic MDX import — Next.js statically analyzes all slugs from generateStaticParams
  const { default: MDXContent } = await import(`../../../../../content/diary/${slug}.mdx`)

  // ... render
}
```

**Important:** The dynamic import path must be a string template literal relative to the file. Next.js App Router with static generation resolves these at build time because all slugs are enumerated by `generateStaticParams`.

### Pattern 3: Prev/Next Navigation

**What:** Compute adjacent entries from the sorted `getDiaryEntries()` array using the current slug's index.

```typescript
// In detail page server component
const entries = getDiaryEntries() // already sorted newest-first (reverse chron)
const currentIndex = entries.findIndex((e) => e.slug === slug)
const prevEntry = currentIndex < entries.length - 1 ? entries[currentIndex + 1] : null
const nextEntry = currentIndex > 0 ? entries[currentIndex - 1] : null
```

Note: "prev" (older = lower day number) is at higher array index because array is newest-first. "next" (newer = higher day number) is at lower index. The nav bar shows "← Day N-1: Title" on left and "Day N+1: Title →" on right — so map: left button = prevEntry (older), right button = nextEntry (newer).

### Pattern 4: generateMetadata for SEO

```typescript
export async function generateMetadata({ params }: DiaryDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const entry = getDiaryEntry(slug)
  if (!entry) return {}
  return {
    title: entry.title,
    description: entry.excerpt,
    openGraph: {
      title: entry.title,
      description: entry.excerpt,
      type: 'article',
      publishedTime: entry.date,
    },
  }
}
```

The root `layout.tsx` already sets `title.template: '%s | AquaClaw.ai'` — page-level `generateMetadata` returning `title: entry.title` will produce `"Day 1: Title | AquaClaw.ai"` automatically.

### Pattern 5: DiaryCard Component

All server component — no `'use client'` needed. Hover effects via Tailwind CSS `hover:` utilities (CSS transitions, no JS).

```typescript
// src/components/diary/DiaryCard.tsx
import Link from 'next/link'
import { MascotImage } from '@/components/ui/MascotImage'
import type { DiaryEntry } from '../../../lib/content/diary'

// Accent palette colors for mascot placeholder backgrounds
const ACCENT_COLORS = ['bg-primary/20', 'bg-secondary/30', 'bg-accent/20', 'bg-contrast/20']

// Deterministic color from dayNumber — no random() on server
function accentForDay(dayNumber: number): string {
  return ACCENT_COLORS[dayNumber % ACCENT_COLORS.length] ?? ACCENT_COLORS[0]
}

// Mascot poses for placeholder cycling
const MASCOT_POSES = ['default', 'waving', 'thinking', 'sleeping'] as const
function poseForDay(dayNumber: number) {
  return MASCOT_POSES[dayNumber % MASCOT_POSES.length] ?? 'default'
}
```

**Important pitfall:** Do not use `Math.random()` for mascot pose or accent color in server components — this causes hydration mismatches and non-deterministic static output. Use `dayNumber % array.length` for deterministic selection.

### Pattern 6: ISR Configuration

Per project decisions and CLAUDE.md:
```typescript
// In listing and detail pages
export const revalidate = 3600 // 1 hour — allows OpenClaw content publishing
```

### Anti-Patterns to Avoid

- **Using `Math.random()` in server components:** Causes hydration mismatch. Use `dayNumber % N` for deterministic variation.
- **Marking DiaryCard as `'use client'`:** Not needed — hover effects work with CSS `hover:` utilities. Only mark client if you need `useState`/`useEffect`.
- **Importing MDX content with absolute imports using `@/`:** The `@/*` alias resolves to `./src/*` but `content/` is at project root, not inside `src/`. Use relative paths from the file: `../../../../../content/diary/${slug}.mdx`.
- **Skipping `notFound()` on missing slug:** Without it, passing an unknown slug causes a runtime error during MDX import. Always check `getDiaryEntry(slug)` first.
- **Calling `getDiaryEntries()` multiple times per page render:** Call once, derive all needed data (current entry, prev, next) from the same call. The function reads from disk every call.
- **Putting diary content route files inside `app/[lang]/diary/diary/`:** The segment is `[lang]/diary/` — no double nesting.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| MDX compilation | Custom parser | `@next/mdx` (already configured) | Build-time compilation, zero client JS, Shiki highlighting already wired |
| Frontmatter parsing | Custom regex | `gray-matter` (already in `lib/content/diary.ts`) | Battle-tested, handles YAML edge cases |
| Prose typography | Custom CSS for headings/lists/blockquotes | `@tailwindcss/typography` `prose` classes (already in `globals.css`) | Handles 20+ element types with correct vertical rhythm |
| Frontmatter validation | Custom type guards | Zod `DiaryFrontmatterSchema` (already in `lib/content/schemas.ts`) | Build-time fail-fast, TypeScript inference |
| Content listing | Database query | `getDiaryEntries()` (already implemented) | Filesystem glob, sorted, Zod-validated, server-only |

**Key insight:** The content layer is 100% implemented. This phase is a UI assembly task, not a data layer task.

---

## Common Pitfalls

### Pitfall 1: MDX Dynamic Import Path Resolution
**What goes wrong:** `await import(\`@/content/diary/${slug}.mdx\`)` fails at runtime because `@/*` resolves to `./src/*` not the project root.
**Why it happens:** The tsconfig `paths` entry `"@/*": ["./src/*"]` scopes the alias to the `src` directory. `content/` lives at project root.
**How to avoid:** Use relative paths from the file location. For `src/app/[lang]/diary/[slug]/page.tsx`: `await import(\`../../../../../content/diary/${slug}.mdx\`)`.
**Warning signs:** Build error "Cannot find module" or runtime "Module not found" for MDX files.

### Pitfall 2: Pagination Route Conflict
**What goes wrong:** Having both `src/app/[lang]/diary/page.tsx` and `src/app/[lang]/diary/page/[page]/page.tsx` — the segment `page` in the URL conflicts with the Next.js `page.tsx` filename convention.
**Why it happens:** Next.js uses `page.tsx` as a special filename, not a URL segment. `/diary/page/2` requires a folder named `page` containing `[page]/page.tsx`.
**How to avoid:** Create `src/app/[lang]/diary/page/[page]/page.tsx` — the folder `page` is a literal URL segment, and `[page]` is the dynamic segment. This is valid Next.js App Router structure.
**Warning signs:** Route not found at `/diary/page/2`, or "Catch-all route conflict" build errors.

### Pitfall 3: getDiaryEntries() Called Redundantly
**What goes wrong:** Both listing page and detail page call `getDiaryEntries()` in multiple places, causing multiple disk reads per render.
**Why it happens:** The function reads and parses all MDX files from disk on every call. No memoization.
**How to avoid:** Call once per page render, store in a constant, derive all needed values (page slice, prev/next, total count) from that single call.
**Warning signs:** Slow build times as content grows; easy to miss during development with only 5 files.

### Pitfall 4: `params` Must Be Awaited
**What goes wrong:** `const { lang, slug } = params` (without await) causes a TypeScript error and runtime warning.
**Why it happens:** Next.js 15/16 App Router made `params` a Promise. The pattern is `const { slug } = await params`.
**How to avoid:** Always `await params` before destructuring. Pattern established in `src/app/[lang]/layout.tsx` already.
**Warning signs:** TypeScript error "Property 'slug' does not exist on type 'Promise<...>'".

### Pitfall 5: Dictionary Keys Missing for Diary UI
**What goes wrong:** Diary-specific UI strings hardcoded in components instead of going through `getDictionary()`.
**Why it happens:** Easy to forget during rapid development.
**How to avoid:** Before building components, add all needed strings to `dictionaries/en.json` under a `diary` key. The existing `dict.diary.title` and `dict.diary.description` are already there; add keys for: `backToDiary`, `day` (label prefix), `prevEntry`, `nextEntry`, `page`, `noEntries`, `readEntry`.
**Warning signs:** Hardcoded English strings in component JSX instead of `dict.diary.*`.

### Pitfall 6: Mascot Placeholder Color with Math.random()
**What goes wrong:** Using `Math.random()` to pick accent colors for placeholder thumbnails causes: (a) hydration mismatch between server render and client, (b) non-deterministic static HTML output.
**Why it happens:** Server components render once; `Math.random()` differs between SSR and client hydration.
**How to avoid:** Use `dayNumber % COLORS.length` for deterministic color/pose selection.
**Warning signs:** React hydration error in browser console: "Text content did not match".

---

## Code Examples

Verified patterns from the existing codebase:

### Existing getDiaryEntries() API
```typescript
// lib/content/diary.ts (already implemented)
export interface DiaryEntry {
  slug: string
  content: string        // raw MDX string (not used for rendering — use dynamic import)
  title: string
  date: string           // ISO date string "2026-03-28"
  excerpt: string
  dayNumber: number
  tags: string[]
  thumbnail?: string     // optional — undefined means use mascot placeholder
}

// Returns entries sorted newest-first (reverse chronological)
export function getDiaryEntries(): DiaryEntry[]
export function getDiaryEntry(slug: string): DiaryEntry | null
```

### Existing Design Token Usage Pattern
```tsx
// From src/app/[lang]/design-system/page.tsx and src/components/nav/Header.tsx
// Token consumption examples already established in codebase:
<span className="bg-primary text-white rounded-pill px-5 py-2 font-display font-semibold text-sm">
  Day 1
</span>
<div className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
  {/* card content */}
</div>
<p className="font-display text-xl font-semibold text-foreground">Title</p>
<p className="font-sans text-sm text-foreground/70">Excerpt text</p>
```

### Existing Prose Typography Pattern
```tsx
// From src/app/[lang]/design-system/page.tsx
<div className="prose prose-lg prose-headings:font-display prose-a:text-primary max-w-prose">
  {/* MDX content renders here */}
</div>
```

### Import Path for Content Library from App Router
```typescript
// Pattern from src/app/sitemap.ts
import { getDiaryEntries } from '../../lib/content/diary'

// From src/app/[lang]/diary/page.tsx (one level deeper):
import { getDiaryEntries } from '../../../../lib/content/diary'

// From src/app/[lang]/diary/[slug]/page.tsx (two levels deeper):
import { getDiaryEntries, getDiaryEntry } from '../../../../../lib/content/diary'
```

### getDictionary Usage Pattern
```typescript
// Pattern from src/app/[lang]/layout.tsx and src/app/[lang]/page.tsx
const { lang } = await params
const dict = await getDictionary(lang as Locale)
// dict.diary.title — "Agent Diary" (already in en.json)
// dict.diary.description — "Daily logs from an autonomous AI agent" (already in en.json)
```

### generateMetadata Pattern
```typescript
// Pattern from src/app/[lang]/design-system/page.tsx
export function generateMetadata() {
  return {
    title: 'Design System',
    description: 'AquaClaw.ai visual design system showcase',
  }
}
// Root layout template '%s | AquaClaw.ai' wraps it automatically
```

### Existing DiaryFrontmatterSchema
```typescript
// lib/content/schemas.ts (already implemented)
export const DiaryFrontmatterSchema = z.object({
  title: z.string(),
  date: z.string(),
  excerpt: z.string(),
  thumbnail: z.string().optional(),
  slug: z.string().optional(),
  tags: z.array(z.string()).default([]),
  dayNumber: z.number().int().positive(),
})
```

### Existing Seed Entry Frontmatter (needs cat persona voice update)
```yaml
# content/diary/day-001.mdx
---
title: "First Day Building AquaClaw"
date: "2026-03-28"
excerpt: "Setting up the foundation — Next.js, i18n, and content layer all running."
dayNumber: 1
tags: ["foundation", "setup"]
---
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `Contentlayer` for MDX | `@next/mdx` + `gray-matter` + `getDiaryEntries()` | 2024 (Contentlayer unmaintained) | Simpler, no external dependency, already implemented |
| `next-i18next` | `getDictionary()` pattern (custom, server-only) | Phase 1 of this project | All UI strings through `dict.*` objects |
| React 18 `params` sync | `const { lang } = await params` | Next.js 15+ | Must await params in App Router |
| `tailwind.config.js` | `globals.css` `@theme {}` CSS-first config | Tailwind v4 | Tokens already in `globals.css`; no config file needed |

**Deprecated/outdated in this project:**
- `content` string in `DiaryEntry` (the raw MDX string from gray-matter): Not used for rendering. MDX rendering uses direct `import()` of the `.mdx` file. The `content` field is available but skip it for page rendering.

---

## Open Questions

1. **MDX dynamic import bundle analysis**
   - What we know: Next.js App Router with `generateStaticParams` can resolve dynamic import template literals when all values are known at build time.
   - What's unclear: Whether Turbopack (dev) vs Webpack (production build) behaves identically for content MDX files in `content/` outside `src/`. This has not been tested in this codebase yet.
   - Recommendation: Build a minimal test in Wave 1 (detail page task): create the detail page, run `next build`, verify all slug pages generate. If dynamic import fails, fall back to rendering the raw `entry.content` string via `@mdx-js/mdx` `evaluate()` — but only do this if needed.

2. **Sitemap pagination coverage**
   - What we know: `src/app/sitemap.ts` includes individual diary entry URLs. It does not currently include `/en/diary/page/N` pagination URLs.
   - What's unclear: Whether pagination pages need to be in the sitemap for SEO.
   - Recommendation: Pagination pages are navigation aids, not unique content. Skip them from the sitemap. Only individual entry URLs and `/en/diary` need sitemap entries. This is consistent with the existing `sitemap.ts` implementation.

3. **Dictionary key additions needed**
   - What we know: `en.json` already has `diary.title` and `diary.description`. Additional keys needed for diary-specific UI.
   - What's unclear: Full set of needed keys until components are designed.
   - Recommendation: Add to `dictionaries/en.json` at start of Wave 1: `diary.backToDiary`, `diary.day`, `diary.page`, `diary.of`, `diary.prev`, `diary.next`, `diary.readEntry`, `diary.noThumbnail`.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 |
| Config file | `vitest.config.ts` |
| Quick run command | `vitest run --reporter=verbose src/__tests__/diary.test.ts` |
| Full suite command | `vitest run --reporter=verbose` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DIAR-01 | Listing page renders card grid with correct entry count | unit | `vitest run --reporter=verbose src/__tests__/diary.test.ts` | ❌ Wave 0 |
| DIAR-01 | Pagination slices correctly at PAGE_SIZE=12 | unit | `vitest run --reporter=verbose src/__tests__/diary.test.ts` | ❌ Wave 0 |
| DIAR-02 | Detail page returns correct entry for slug | unit | `vitest run --reporter=verbose src/__tests__/diary.test.ts` | ❌ Wave 0 |
| DIAR-02 | Prev/next entries computed correctly from sorted list | unit | `vitest run --reporter=verbose src/__tests__/diary.test.ts` | ❌ Wave 0 |
| DIAR-03 | All seed MDX files parse with valid frontmatter | unit | `vitest run --reporter=verbose src/__tests__/diary.test.ts` | ❌ Wave 0 |
| DIAR-03 | Seed entries have cat persona voice (dayNumber, title, excerpt) | unit | `vitest run --reporter=verbose src/__tests__/diary.test.ts` | ❌ Wave 0 |

Route-level integration (page renders, actual MDX import) cannot be tested with Vitest alone — these are verified via `next build` success and visual inspection in `next dev`.

### Sampling Rate
- **Per task commit:** `vitest run --reporter=verbose src/__tests__/diary.test.ts`
- **Per wave merge:** `vitest run --reporter=verbose`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/__tests__/diary.test.ts` — covers DIAR-01, DIAR-02, DIAR-03 (pagination logic, prev/next logic, seed entry validation)

*(Existing `content.test.ts` covers `getDiaryEntries()` and `getDiaryEntry()` already — no changes needed there.)*

---

## Sources

### Primary (HIGH confidence — direct codebase inspection)
- `lib/content/diary.ts` — `getDiaryEntries()` and `getDiaryEntry()` implementation, `DiaryEntry` interface
- `lib/content/schemas.ts` — `DiaryFrontmatterSchema` Zod schema
- `src/app/globals.css` — Full design token system, animation tokens, typography plugin
- `src/app/sitemap.ts` — Established pattern for `../../lib/content/diary` import path from within `src/app/`
- `src/app/[lang]/layout.tsx` — `await params` pattern, `getDictionary()` usage, Header/Footer integration
- `src/app/[lang]/design-system/page.tsx` — `generateMetadata()` pattern, card/prose/token usage patterns
- `src/components/ui/MascotImage.tsx` — MascotPose type, unoptimized pixel-art rendering
- `dictionaries/en.json` — Existing keys including `diary.title`, `diary.description`
- `next.config.mjs` — `@next/mdx` config, remark-gfm + rehype-pretty-code as string plugins
- `tsconfig.json` — `@/*` resolves to `./src/*` (not project root — critical for MDX import paths)
- `package.json` — Confirmed installed: `@next/mdx`, `gray-matter`, `remark-gfm`, `rehype-pretty-code`, `@tailwindcss/typography`, `zod`, `sharp`; no `motion` or `next-mdx-remote` installed
- `vitest.config.ts` — Framework setup, `server-only` mock alias
- `.planning/config.json` — `nyquist_validation: true`, `commit_docs: true`

### Secondary (MEDIUM confidence — training knowledge, verified by codebase patterns)
- Next.js App Router `generateStaticParams` with dynamic imports — pattern for content MDX rendering
- Tailwind CSS v4 `hover:` utility prefix for CSS-only hover effects in server components
- `@tailwindcss/typography` `prose-headings:font-display` modifier syntax

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages confirmed installed, versions from package.json
- Architecture: HIGH — route structure and import patterns derived from existing codebase
- Pitfalls: HIGH — most derived from direct codebase inspection (tsconfig alias, async params, existing patterns)
- MDX dynamic import in Turbopack context: MEDIUM — pattern is correct but not yet exercised in this specific project

**Research date:** 2026-04-01
**Valid until:** 2026-05-01 (stable stack; Next.js 16 minor releases unlikely to break these patterns)
