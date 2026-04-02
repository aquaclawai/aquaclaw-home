# Phase 11: Engagement & Polish - Research

**Researched:** 2026-04-01
**Domain:** Giscus comments, RSS/Atom feeds, Lighthouse performance
**Confidence:** HIGH (all findings from direct codebase inspection + established project patterns)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Embed `@giscus/react` Giscus widget at the bottom of diary detail pages and article detail pages.
- **D-02:** GitHub repo: `aquaclawai/aquaclaw-home` — GitHub Discussions must be enabled on this repo for Giscus to work.
- **D-03:** Giscus component is `'use client'` — wraps the `@giscus/react` component with site-specific config.
- **D-04:** Three separate RSS/Atom feeds: `/rss/diary.xml`, `/rss/articles.xml`, `/rss/science.xml`.
- **D-05:** Feeds generated from content getter functions at build time or request time.
- **D-06:** Homepage must score ≥90 on Lighthouse mobile audit. Fix any performance/accessibility/SEO issues found.

### Claude's Discretion
- Giscus theme (light/dark matching site theme, or `preferred_color_scheme`)
- Giscus mapping strategy (pathname, title, or specific)
- Giscus category name (e.g., "Comments", "General")
- Giscus category ID (will need to be set after Discussions are enabled)
- RSS feed format (RSS 2.0 vs Atom — RSS 2.0 is more common)
- RSS feed implementation (Next.js Route Handler or static generation)
- Feed metadata (site title, description, author)
- Lighthouse optimization approach (image optimization, bundle analysis, lazy loading)
- Whether to add `<link rel="alternate" type="application/rss+xml">` to head

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ENGG-01 | Giscus comment system embedded on diary and article detail pages | `@giscus/react` package pattern, `'use client'` wrapper component, insertion point after PrevNext in detail pages |
| ENGG-02 | RSS/Atom feeds — one feed per content section (diary, articles, science) | Next.js Route Handler pattern from existing `api/revalidate/route.ts`, content getter functions already return typed entries with all needed feed fields |
</phase_requirements>

---

## Summary

Phase 11 is the final engagement layer before v1 ships. It has three distinct workstreams: (1) Giscus comment widget on diary and article detail pages, (2) three RSS feed Route Handlers, and (3) Lighthouse mobile ≥90 validation. All three workstreams can be implemented independently and composed into two plans (comments + RSS in Plan 1, Lighthouse fixes in Plan 2 if needed, or all in one plan since the scope is tight).

The codebase is well-prepared for this phase. Content getter functions (`getDiaryEntries`, `getArticleEntries`, `getScienceEntries`) already return all frontmatter fields needed for RSS (title, date, excerpt, slug). The Route Handler pattern is already established via `src/app/api/revalidate/route.ts`. The detail page structure is consistent across diary, articles, and science — each ends with a `PrevNext` navigation component, which is the insertion point for the Giscus widget.

**Primary recommendation:** Install `@giscus/react`, create a `GiscusComments` client component with `preferred_color_scheme` theme, embed it below PrevNext on diary and article detail pages. Build three RSS Route Handlers at `src/app/rss/diary.xml/route.ts`, `src/app/rss/articles.xml/route.ts`, `src/app/rss/science.xml/route.ts` that return RSS 2.0 XML responses. Run Lighthouse on the homepage and fix any issues found.

---

## Standard Stack

### Core (already in project)
| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| Next.js App Router | 16.2.1 | Route Handlers for RSS feeds | Already installed |
| `lib/content/diary.ts` | project | Feed data source for diary RSS | Already exists |
| `lib/content/articles.ts` | project | Feed data source for articles RSS | Already exists |
| `lib/content/science.ts` | project | Feed data source for science RSS | Already exists |

### To Install
| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| `@giscus/react` | ^3.x | Giscus React component | Specified in CLAUDE.md recommended stack; not yet in package.json |

**Confirmed absent from package.json:** `@giscus/react` is listed in CLAUDE.md as a recommended library but is NOT present in `package.json` dependencies. Must be installed.

**Confirmed present:** `motion` is also absent from package.json, but it is not needed for this phase.

**Installation:**
```bash
npm install @giscus/react
```

### No Third-Party RSS Library Needed
Next.js Route Handlers can return raw `Response` objects with `Content-Type: application/rss+xml`. RSS 2.0 is plain XML — no library required. Hand-building the XML string is appropriate here because the feed structure is simple and fixed.

---

## Architecture Patterns

### Recommended Project Structure (new files this phase)
```
src/
├── app/
│   └── rss/
│       ├── diary.xml/
│       │   └── route.ts          # GET → RSS 2.0 XML for diary
│       ├── articles.xml/
│       │   └── route.ts          # GET → RSS 2.0 XML for articles
│       └── science.xml/
│           └── route.ts          # GET → RSS 2.0 XML for science
└── components/
    └── engagement/
        └── GiscusComments.tsx    # 'use client' Giscus wrapper
```

### Pattern 1: Next.js Route Handler returning XML

The existing `src/app/api/revalidate/route.ts` demonstrates the Route Handler pattern. For RSS, return a raw `Response` with XML content type:

```typescript
// src/app/rss/diary.xml/route.ts
import { getDiaryEntries } from '../../../../lib/content/diary'

const BASE_URL = 'https://aquaclaw.ai'

export async function GET() {
  const entries = getDiaryEntries()

  const items = entries
    .map(
      (entry) => `
    <item>
      <title><![CDATA[Day ${entry.dayNumber}: ${entry.title}]]></title>
      <link>${BASE_URL}/en/diary/${entry.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/en/diary/${entry.slug}</guid>
      <pubDate>${new Date(entry.date).toUTCString()}</pubDate>
      <description><![CDATA[${entry.excerpt}]]></description>
    </item>`
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AquaClaw.ai — Diary</title>
    <link>${BASE_URL}/en/diary</link>
    <description>Daily logs from an autonomous AI agent operating a website</description>
    <language>en</language>
    <atom:link href="${BASE_URL}/rss/diary.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
```

**Key detail:** Route Handlers that call `getDiaryEntries()` (and the other content getters) can do so directly — these are server-only functions and Route Handlers run server-side. No `'use client'` issues.

**Key detail:** The content getter files use `import 'server-only'` — this is fine in Route Handlers which are always server-side. The `server-only` guard only fires if something tries to import these modules into a client bundle.

### Pattern 2: Giscus `'use client'` Client Component

Giscus needs to know the current page URL to map a page to a GitHub Discussion. In the App Router, `usePathname()` from `next/navigation` gives the current path client-side. Alternatively, pass `pathname` as a prop from the server component (simpler, avoids a hook).

```typescript
// src/components/engagement/GiscusComments.tsx
'use client'

import Giscus from '@giscus/react'

interface GiscusCommentsProps {
  lang: string
}

export function GiscusComments({ lang }: GiscusCommentsProps) {
  return (
    <div className="mt-16 pt-8 border-t border-muted">
      <Giscus
        repo="aquaclawai/aquaclaw-home"
        repoId="REPO_ID_PLACEHOLDER"
        category="Comments"
        categoryId="CATEGORY_ID_PLACEHOLDER"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="preferred_color_scheme"
        lang={lang}
        loading="lazy"
      />
    </div>
  )
}
```

**`repoId` and `categoryId`:** These are GitHub-specific IDs obtained from the Giscus configuration wizard at https://giscus.app after enabling GitHub Discussions on `aquaclawai/aquaclaw-home`. They must be hardcoded in the component — they are static values tied to the repo. This is a manual step before the component will work. They can be stored in environment variables (`NEXT_PUBLIC_GISCUS_REPO_ID`, `NEXT_PUBLIC_GISCUS_CATEGORY_ID`) for cleaner config.

**`mapping="pathname"`:** Maps each page URL path to a unique GitHub Discussion by pathname. This is the most common and robust mapping strategy.

**`theme="preferred_color_scheme"`:** Automatically matches the user's system dark/light preference. This is the correct choice since the site uses `prefers-color-scheme` for dark mode (confirmed in `globals.css`) and has no JS-toggled theme state.

**`loading="lazy"`:** Defers iframe load until near-viewport. Important for Lighthouse performance — Giscus is an iframe and should not block LCP.

### Pattern 3: Inserting Giscus into detail pages

All three detail pages (diary, articles, science) follow the same structure. Giscus is inserted after the PrevNext component and before the closing `</div>`:

```tsx
// In src/app/[lang]/diary/[slug]/page.tsx (server component — no changes to directives)
import { GiscusComments } from '@/components/engagement/GiscusComments'

// ... existing JSX ...
      <DiaryPrevNext ... />

      <GiscusComments lang={lang} />
    </div>
  )
```

Server components can import and render `'use client'` components. The `GiscusComments` component is the client island boundary.

### Pattern 4: RSS `<link>` autodiscovery tags

Add RSS feed autodiscovery `<link>` tags to the root layout metadata or per-section layout metadata. In Next.js App Router, use the `alternates` metadata key:

```typescript
// In src/app/layout.tsx or src/app/[lang]/layout.tsx generateMetadata
export const metadata: Metadata = {
  // ... existing metadata ...
  alternates: {
    types: {
      'application/rss+xml': [
        { url: 'https://aquaclaw.ai/rss/diary.xml', title: 'AquaClaw.ai Diary' },
        { url: 'https://aquaclaw.ai/rss/articles.xml', title: 'AquaClaw.ai Articles' },
        { url: 'https://aquaclaw.ai/rss/science.xml', title: 'AquaClaw.ai Science' },
      ],
    },
  },
}
```

Next.js renders these as `<link rel="alternate" type="application/rss+xml">` elements in `<head>`. This is the standard autodiscovery mechanism that RSS readers use.

**Placement:** Add to `src/app/layout.tsx` (root layout) so all pages advertise all feeds. Alternatively, add per-section via `generateMetadata` in each layout — but root layout is simpler and RSS readers typically just check the homepage anyway.

### Pattern 5: RSS Route Handler — server-only import compatibility

The content getter files guard themselves with `import 'server-only'`. Route Handlers run server-side only, so this guard will not fire. However, the import path from a Route Handler at `src/app/rss/diary.xml/route.ts` to the content library at `lib/content/diary.ts` (project root) needs careful handling.

Looking at how the detail pages import content getters:
- `src/app/[lang]/diary/[slug]/page.tsx` uses: `import { getDiaryEntries, getDiaryEntry } from '../../../../../lib/content/diary'`
- The `@/*` alias maps to `src/*` — it cannot reach `lib/` at the project root

From `src/app/rss/diary.xml/route.ts`, the relative path to `lib/content/diary.ts` is `../../../../lib/content/diary`. Use relative imports, not the `@/` alias.

### Anti-Patterns to Avoid
- **Using `@/` alias for project-root lib imports:** The alias maps to `src/` not project root. Use relative paths for `lib/content/` imports from route files (established pattern in all existing detail pages).
- **Using a `'use client'` directive in RSS Route Handlers:** Route Handlers are always server-side — no directive needed.
- **Loading Giscus eagerly:** Giscus is an iframe that loads external resources. Use `loading="lazy"` to prevent it from impacting LCP/FID scores.
- **Hardcoding `repoId`/`categoryId` without env vars:** Makes it harder to use staging repos. Prefer `NEXT_PUBLIC_GISCUS_REPO_ID` env var pattern.
- **Forgetting `CDATA` in RSS XML:** Title and description fields may contain special XML characters (`&`, `<`, `>`). Wrap in `<![CDATA[...]]>` or escape properly.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| GitHub Discussions comment system | Custom comment backend + DB | `@giscus/react` | Zero backend, zero spam management, GitHub-backed storage, free |
| RSS XML serialization library | npm package like `rss` or `feed` | Hand-built XML string | Feed structure is simple (3 feeds, fixed schema) — a library adds a dependency for trivial XML generation |

**Key insight:** For this phase's RSS use case, the XML structure is small and fixed. Introducing an RSS library (e.g., `rss`, `feed`) would add a package dependency for no meaningful benefit. The Route Handler pattern with a template literal string is readable and maintainable for 3 feeds.

---

## Common Pitfalls

### Pitfall 1: Giscus repoId and categoryId are required and not guessable
**What goes wrong:** The `@giscus/react` component renders a blank or broken iframe if `repoId` and `categoryId` are missing or incorrect.
**Why it happens:** These are GitHub internal IDs (not human-readable) assigned when GitHub Discussions is enabled. They cannot be inferred from the repo name alone.
**How to avoid:** Before embedding the component, visit https://giscus.app, enter `aquaclawai/aquaclaw-home`, enable Discussions on the repo, and copy the generated config block. Store `repoId` and `categoryId` in the component or as `NEXT_PUBLIC_` env vars.
**Warning signs:** Giscus shows "Discussion not found" or iframe fails to load.

### Pitfall 2: GitHub Discussions must be enabled on the repo before Giscus works
**What goes wrong:** Giscus API calls fail silently — no comments load.
**Why it happens:** Giscus creates GitHub Discussions on the fly when a user first visits a page. If Discussions is not enabled on `aquaclawai/aquaclaw-home`, this creation fails.
**How to avoid:** Enable Discussions in the repo settings (Settings → Features → Discussions) before deploying. This is a one-time manual step.
**Warning signs:** Giscus widget shows error state in production.

### Pitfall 3: RSS XML encoding — special characters break parsers
**What goes wrong:** RSS feed fails to parse in feed readers when content contains `&`, `<`, `>`, or non-UTF-8 characters.
**Why it happens:** XML parsers are strict. Entry titles and excerpts can contain any characters.
**How to avoid:** Wrap all user-content fields in `<![CDATA[...]]>`. Always set `<?xml version="1.0" encoding="UTF-8"?>` declaration.
**Warning signs:** Feed readers display parse errors or incomplete items.

### Pitfall 4: RSS Route Handler path depth — relative import miscounting
**What goes wrong:** `import { getDiaryEntries } from '../../../../lib/content/diary'` gets the wrong depth, causing a module-not-found error at build.
**Why it happens:** `src/app/rss/diary.xml/route.ts` is 4 levels deep from `src/`. The `lib/` directory is at project root (one level above `src/`). Path = `../../../../lib/content/diary`.
**How to avoid:** Count carefully: `route.ts` → `diary.xml/` → `rss/` → `app/` → `src/` → project root → `lib/`. That's 5 `../` to reach project root. Verify: `../../../../../lib/content/diary`.

**Correct path calculation:**
```
src/app/rss/diary.xml/route.ts
  ↑ ../          = src/app/rss/diary.xml/
  ↑ ../../       = src/app/rss/
  ↑ ../../../    = src/app/
  ↑ ../../../../ = src/
  ↑ ../../../../../ = project root
  → ../../../../../lib/content/diary
```
**Warning signs:** Build error `Cannot find module '../../../../lib/content/diary'`.

### Pitfall 5: Lighthouse — Giscus iframe hurts performance if not lazy-loaded
**What goes wrong:** Lighthouse flags Giscus as a render-blocking or LCP-delaying resource.
**Why it happens:** Giscus embeds an iframe pointing to `giscus.app` which loads additional resources.
**How to avoid:** Always pass `loading="lazy"` to the Giscus component. This tells the browser to defer iframe load until near-viewport.
**Warning signs:** Lighthouse TBT or LCP score drops after adding Giscus.

### Pitfall 6: `alternates.types` in root layout metadata object (not `generateMetadata`)
**What goes wrong:** Using `export const metadata` (static) with `alternates` at root layout, but the `metadataBase` is needed for relative URLs.
**Why it happens:** `alternates` URLs need to be absolute. The root layout already sets `metadataBase` — just ensure the `alternates` URLs are also absolute to be safe.
**How to avoid:** Use absolute URLs (`https://aquaclaw.ai/rss/diary.xml`) in the `alternates.types` array. The `metadataBase` in root layout is already set to `https://aquaclaw.ai` (via `VERCEL_URL`).

---

## Code Examples

Verified patterns from codebase inspection:

### Existing Route Handler Pattern (from `src/app/api/revalidate/route.ts`)
```typescript
// Pattern for returning Response objects from Route Handlers
export async function POST(request: Request): Promise<NextResponse> {
  return NextResponse.json({ revalidated: true, paths }, { status: 200 })
}

// For RSS, use raw Response (not NextResponse.json) to set custom Content-Type:
export async function GET() {
  return new Response(xmlString, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
```

### Existing 'use client' Island Pattern
```typescript
// From src/components/home/StatsCounter.tsx — established 'use client' pattern
'use client'
import { useEffect, useRef, useState } from 'react'
// ... component code
```

### Existing Detail Page Import Pattern (diary)
```typescript
// From src/app/[lang]/diary/[slug]/page.tsx — relative import for project-root lib
import { getDiaryEntries, getDiaryEntry } from '../../../../../lib/content/diary'
```

### Root Layout Metadata Pattern (from `src/app/layout.tsx`)
```typescript
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
  ),
  title: { template: '%s | AquaClaw.ai', default: 'AquaClaw.ai — An AI-Operated Website' },
  openGraph: { siteName: 'AquaClaw.ai', type: 'website' },
  // Add here:
  alternates: {
    types: {
      'application/rss+xml': [
        { url: 'https://aquaclaw.ai/rss/diary.xml', title: 'AquaClaw.ai Diary' },
        { url: 'https://aquaclaw.ai/rss/articles.xml', title: 'AquaClaw.ai Articles' },
        { url: 'https://aquaclaw.ai/rss/science.xml', title: 'AquaClaw.ai Science' },
      ],
    },
  },
}
```

### Content Getter Shape (DiaryEntry — confirmed from `lib/content/diary.ts` and `lib/content/schemas.ts`)
```typescript
interface DiaryEntry {
  title: string       // RSS <title>
  date: string        // RSS <pubDate>
  excerpt: string     // RSS <description>
  slug: string        // Constructs RSS <link> and <guid>
  dayNumber: number   // Used in RSS <title> prefix "Day N: ..."
  tags: string[]      // Available but not standard RSS field
  thumbnail?: string  // Optional, not needed for RSS
  content: string     // Full body — too large for RSS, use excerpt
}
```

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Disqus comments | Giscus (@giscus/react) | No ads, no privacy concerns, GitHub-backed, free |
| `rss` / `feed` npm packages | Raw XML string in Route Handler | Zero dependencies for simple feed structure |
| External sitemap tools | Built-in `app/sitemap.ts` | Already used in this project |

**Confirmed absent/deprecated:**
- `motion` library: Listed in CLAUDE.md but NOT in package.json. Not needed for Phase 11.
- `next-sitemap`: Listed in CLAUDE.md stack but not in package.json. The project already uses built-in `app/sitemap.ts` instead (confirmed in codebase). Do not install.

---

## Open Questions

1. **Giscus `repoId` and `categoryId` values**
   - What we know: These are required by `@giscus/react`; they come from GitHub after enabling Discussions
   - What's unclear: Whether GitHub Discussions is already enabled on `aquaclawai/aquaclaw-home`; actual ID values
   - Recommendation: Use `NEXT_PUBLIC_GISCUS_REPO_ID` and `NEXT_PUBLIC_GISCUS_CATEGORY_ID` environment variables with placeholder values in `.env.example`. The planner should note this as a manual pre-flight step before Giscus will work in production. The component can render conditionally (skip if env vars are empty) to avoid iframe errors during development.

2. **Lighthouse baseline score**
   - What we know: No Lighthouse audit has been run yet; the homepage uses `StatsCounter` (client island with IntersectionObserver) and `DiaryCarousel` (client island)
   - What's unclear: Current score; whether any image, font, or JS bundle issues exist
   - Recommendation: The plan should include a "run Lighthouse, then fix" task rather than pre-specifying fixes. Common issues to watch for: (a) `next/image` usage on mascot images, (b) font display swap already in place (confirmed in `layout.tsx`), (c) missing `aria-label` on icon-only nav buttons.

3. **Science detail page — should Giscus be embedded there too?**
   - What we know: CONTEXT.md D-01 specifies "diary detail pages and article detail pages" — science is NOT listed
   - What's unclear: Whether this was intentional (science explainers feel less discussion-worthy) or an oversight
   - Recommendation: Follow the locked decision — embed only on diary and article detail pages. Science pages can always be added in v2 with minimal effort.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 |
| Config file | `vitest.config.ts` (exists) |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run --reporter=verbose` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ENGG-01 | `GiscusComments.tsx` is a `'use client'` component | unit | `npx vitest run --reporter=verbose src/__tests__/engagement.test.ts` | ❌ Wave 0 |
| ENGG-01 | Diary detail page renders `<GiscusComments>` import | unit | `npx vitest run --reporter=verbose src/__tests__/engagement.test.ts` | ❌ Wave 0 |
| ENGG-01 | Article detail page renders `<GiscusComments>` import | unit | `npx vitest run --reporter=verbose src/__tests__/engagement.test.ts` | ❌ Wave 0 |
| ENGG-02 | `src/app/rss/diary.xml/route.ts` exists | unit | `npx vitest run --reporter=verbose src/__tests__/engagement.test.ts` | ❌ Wave 0 |
| ENGG-02 | `src/app/rss/articles.xml/route.ts` exists | unit | `npx vitest run --reporter=verbose src/__tests__/engagement.test.ts` | ❌ Wave 0 |
| ENGG-02 | `src/app/rss/science.xml/route.ts` exists | unit | `npx vitest run --reporter=verbose src/__tests__/engagement.test.ts` | ❌ Wave 0 |
| ENGG-02 | Diary RSS GET returns valid XML with correct Content-Type | unit | `npx vitest run --reporter=verbose src/__tests__/engagement.test.ts` | ❌ Wave 0 |
| ENGG-02 | Articles RSS GET returns valid XML with correct Content-Type | unit | `npx vitest run --reporter=verbose src/__tests__/engagement.test.ts` | ❌ Wave 0 |
| ENGG-02 | Science RSS GET returns valid XML with correct Content-Type | unit | `npx vitest run --reporter=verbose src/__tests__/engagement.test.ts` | ❌ Wave 0 |
| Success #3 | Lighthouse mobile ≥90 | manual | Run Lighthouse in Chrome DevTools or `npx lighthouse https://aquaclaw.ai/en --output=json --preset=mobile` | manual only — requires deployed URL |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose src/__tests__/engagement.test.ts`
- **Per wave merge:** `npx vitest run --reporter=verbose`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/__tests__/engagement.test.ts` — covers ENGG-01 (GiscusComments component structure) and ENGG-02 (RSS route file existence + response shape)
- [ ] `@giscus/react` install: `npm install @giscus/react` — missing from package.json

*(Existing `vitest.config.ts` and `src/__mocks__/server-only.ts` already handle the test infrastructure — no new framework setup needed)*

---

## Sources

### Primary (HIGH confidence — direct codebase inspection)
- `/Users/shuai/workspace/citronetic/aquaclaw-home/package.json` — confirmed `@giscus/react` absent, `motion` absent, vitest present
- `/Users/shuai/workspace/citronetic/aquaclaw-home/src/app/api/revalidate/route.ts` — Route Handler pattern for `Response` objects
- `/Users/shuai/workspace/citronetic/aquaclaw-home/src/app/[lang]/diary/[slug]/page.tsx` — diary detail page structure, import paths
- `/Users/shuai/workspace/citronetic/aquaclaw-home/src/app/[lang]/articles/[slug]/page.tsx` — articles detail page structure
- `/Users/shuai/workspace/citronetic/aquaclaw-home/src/app/[lang]/science/[slug]/page.tsx` — science detail page structure
- `/Users/shuai/workspace/citronetic/aquaclaw-home/lib/content/diary.ts` — `getDiaryEntries()` return shape
- `/Users/shuai/workspace/citronetic/aquaclaw-home/lib/content/articles.ts` — `getArticleEntries()` return shape
- `/Users/shuai/workspace/citronetic/aquaclaw-home/lib/content/science.ts` — `getScienceEntries()` return shape
- `/Users/shuai/workspace/citronetic/aquaclaw-home/lib/content/schemas.ts` — frontmatter field types
- `/Users/shuai/workspace/citronetic/aquaclaw-home/src/app/layout.tsx` — root metadata pattern, `metadataBase`
- `/Users/shuai/workspace/citronetic/aquaclaw-home/src/app/sitemap.ts` — `BASE_URL = 'https://aquaclaw.ai'` confirmed
- `/Users/shuai/workspace/citronetic/aquaclaw-home/src/app/globals.css` — dark mode via `prefers-color-scheme` (informs Giscus theme choice)
- `/Users/shuai/workspace/citronetic/aquaclaw-home/vitest.config.ts` — test framework config, `@/` alias
- `/Users/shuai/workspace/citronetic/aquaclaw-home/src/__tests__/content.test.ts` — existing test structure pattern
- `/Users/shuai/workspace/citronetic/aquaclaw-home/.planning/phases/11-engagement-polish/11-CONTEXT.md` — locked decisions
- `/Users/shuai/workspace/citronetic/aquaclaw-home/CLAUDE.md` — recommended stack, `@giscus/react` specified

### Secondary (MEDIUM confidence — training knowledge, consistent with codebase patterns)
- `@giscus/react` API: `repo`, `repoId`, `category`, `categoryId`, `mapping`, `theme`, `loading` props — consistent with CLAUDE.md documentation
- Next.js `alternates.types` metadata API for RSS autodiscovery links — consistent with Next.js App Router metadata API shape
- RSS 2.0 XML structure: `<?xml>`, `<rss>`, `<channel>`, `<item>`, `<pubDate>`, `<guid>`, `CDATA` — standard specification

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — direct package.json inspection confirms what is/isn't installed
- Architecture: HIGH — Route Handler pattern and detail page structure confirmed from codebase
- Pitfalls: HIGH (import paths), MEDIUM (Giscus repoId/categoryId — standard Giscus behavior from training)
- Validation: HIGH — vitest config and test structure confirmed from codebase

**Research date:** 2026-04-01
**Valid until:** 2026-05-01 (stable libraries, low churn risk for this phase's scope)
