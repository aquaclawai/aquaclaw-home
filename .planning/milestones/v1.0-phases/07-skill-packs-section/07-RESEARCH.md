# Phase 7: Skill Packs Section - Research

**Researched:** 2026-04-01
**Domain:** Next.js App Router content section — MDX listing + detail pages with client-side category filtering and download CTA
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Responsive card grid — 1 column mobile, 2 columns tablet, 3 columns desktop. Same visual pattern as other content sections.
- **D-02:** Each card shows: thumbnail (or mascot placeholder), category badge, title, date, excerpt, and tag pills.
- **D-03:** Mascot placeholder when no thumbnail. Same approach.
- **D-04:** Simple page header — "Skill Packs" in Fredoka + one-line description.
- **D-05:** Client-side filtering on the listing page — no full page reload when applying filters. This requires a `'use client'` component.
- **D-06:** Filter by category (from frontmatter `category` field). Categories derived dynamically from all skill pack entries — no hardcoded list.
- **D-07:** Filter controls above the card grid.
- **D-08:** Centered prose layout for description content, same as other sections.
- **D-09:** Download CTA button — prominent, pill-shaped, links to `downloadUrl` from frontmatter. Positioned prominently (top of detail or after description).
- **D-10:** Feature list displayed from MDX content — structured as a bulleted list or checklist within the prose.
- **D-11:** Back link ("← Back to Skills") above everything. Same pattern as other sections.
- **D-12:** Newest first sort order. Same as other sections.
- **D-13:** Standard markdown for content. Feature lists as markdown bullet lists within MDX body.
- **D-14:** 3-5 seed skill packs. Cover different categories (e.g., Content Writing, Code Generation, Data Analysis, Image Description, Task Automation). downloadUrl can be placeholder links for v1.

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

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SKIL-01 | Skill Packs listing page with browsable grid — filter by category/tag | `SkillFilterGrid` client component holds filter state; server page shell passes all entries as props; categories derived dynamically from `entry.category` values; filter controls + grid in one `'use client'` component |
| SKIL-02 | Individual skill pack detail page with description, feature list, download CTA | `src/app/[lang]/skills/[slug]/page.tsx`; `getSkillBySlug()` already implemented; Download CTA button links to `entry.downloadUrl`; MDX body contains feature list as markdown bullets; `@tailwindcss/typography` prose renders it |
| SKIL-03 | Skill pack data stored as MDX/JSON with structured metadata (name, category, tags, description) | `SkillFrontmatterSchema` already defined with `category: z.string()` and `downloadUrl: z.string().url()` on top of `CommonFrontmatterSchema`; MDX body holds feature list |
</phase_requirements>

---

## Summary

Phase 7 follows the same 2-plan structure used in Phases 4-6, with one meaningful new element: the first client-side interactive component in a content section. The content layer is fully pre-built — `lib/content/skills.ts` has `getSkillEntries()` and `getSkillBySlug()`, `lib/content/schemas.ts` has `SkillFrontmatterSchema` with `category` and `downloadUrl` fields, and `content/skills/` directory exists empty.

The key difference from prior sections is the category filter on the listing page. Because filtering requires React state (`useState`), the filter controls and card grid must live in a `'use client'` component (`SkillFilterGrid`). The listing page itself (`src/app/[lang]/skills/page.tsx`) remains a server component and passes all entries plus the derived category list as props to `SkillFilterGrid`. This server-shell + client-island pattern is the established Next.js App Router approach for interactive content grids.

The detail page adds a download CTA button (links to `entry.downloadUrl` from frontmatter) and renders feature lists from the MDX body using the existing `prose` wrapper. No new packages are needed — all infrastructure is already installed.

**Primary recommendation:** Plan 01 creates seed content, dictionary keys, and all components (SkillCard, SkillCardGrid server component, SkillFilterGrid client component). Plan 02 wires routes and tests. Use the same 2-plan structure as articles and science.

---

## Standard Stack

All infrastructure is already installed and configured. No new packages are needed.

### Core (already in use — no installation required)
| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| Next.js App Router | 16.x | Route pages, generateStaticParams, generateMetadata, ISR | Active |
| TypeScript | 5.x | Type safety | Active |
| Tailwind CSS v4 | 4.2 | Utility classes, design tokens | Active |
| @next/mdx | bundled | MDX content rendering | Active |
| gray-matter | ^4.0 | Frontmatter parsing (inside lib/content/skills.ts) | Active |
| zod | ^3.x | Frontmatter schema validation | Active (SkillFrontmatterSchema exists) |
| @tailwindcss/typography | ^0.5 | `prose` classes for MDX detail pages | Active |
| next-intl | ^3.x | getDictionary, Locale type | Active |
| React | 19.x | useState for filter state in SkillFilterGrid | Active |

### Key Existing Assets
| Asset | Path | Status | Notes |
|-------|------|--------|-------|
| Content layer | `lib/content/skills.ts` | Exists | `getSkillEntries()` + `getSkillBySlug()` implemented; sorted newest-first |
| Zod schema | `lib/content/schemas.ts` | Exists | `SkillFrontmatterSchema` with `category: z.string()` and `downloadUrl: z.string().url()` |
| Content directory | `content/skills/` | Exists, empty | Ready for seed MDX files |
| PaginationBar | `src/components/diary/PaginationBar.tsx` | Reuse directly | Pass `basePath="skills"` |
| MascotImage | `src/components/ui/MascotImage.tsx` | Reuse directly | Poses: default/waving/thinking/sleeping |
| Dictionary scaffold | `dictionaries/en.json` → `skills` key | Partial | Has `title` and `description` only — needs full UI strings |
| Header nav | Navigation | Exists | "Skills" link already in nav |
| getDictionary | `src/lib/i18n/getDictionary.ts` | Exists | Auto-infers type from `en.json` via TypeScript import |

---

## Architecture Patterns

### Recommended Project Structure
```
Plan 01 — Content + Components:
  content/skills/
  ├── content-writing-pack.mdx         # seed: Content Writing category
  ├── code-generation-pack.mdx         # seed: Code Generation category
  ├── data-analysis-pack.mdx           # seed: Data Analysis category
  ├── image-description-pack.mdx       # seed: Image Description category
  └── task-automation-pack.mdx         # seed: Task Automation category
  dictionaries/en.json                  # add skills UI strings
  src/components/skills/
  ├── SkillCard.tsx                     # server component — card with category badge
  ├── SkillCardGrid.tsx                 # server component — grid wrapper (trivial)
  └── SkillFilterGrid.tsx              # 'use client' — holds filter state, renders controls + grid

Plan 02 — Routes + Tests:
  src/app/[lang]/skills/
  ├── page.tsx                          # server shell — passes all entries to SkillFilterGrid
  ├── page/[page]/page.tsx              # pagination routes (optional — if filtering makes pagination complex, show all filtered; keep pagination for unfiltered view)
  └── [slug]/page.tsx                  # detail page with MDX, download CTA
  src/__tests__/skills.test.ts          # Nyquist tests
```

### Pattern 1: SkillEntry Type Shape
The content layer is already implemented. The type produced by `getSkillEntries()` is:

```typescript
// From lib/content/skills.ts + lib/content/schemas.ts
export interface SkillEntry extends SkillFrontmatter {
  slug: string
  content: string
}
// SkillFrontmatter includes: title, date, excerpt, thumbnail?, slug?, tags[], category, downloadUrl
// category: string (free-form, e.g. "Content Writing", "Code Generation")
// downloadUrl: string (validated as URL by Zod)
```

### Pattern 2: Server Shell + Client Island for Filtering (NEW in Phase 7)

The listing page server component fetches all entries and derived categories server-side, then passes them as serializable props to the `'use client'` `SkillFilterGrid` component:

```typescript
// src/app/[lang]/skills/page.tsx — SERVER COMPONENT (no 'use client')
import { getSkillEntries } from '../../../../lib/content/skills'
import { SkillFilterGrid } from '@/components/skills/SkillFilterGrid'

export default async function SkillsPage({ params }: SkillsPageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  const entries = getSkillEntries()  // server-side: full list, sorted newest-first

  // Derive unique categories server-side (no React state needed here)
  const categories = Array.from(new Set(entries.map((e) => e.category))).sort()

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-12">
      <header className="mb-10">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          {dict.skills.title}
        </h1>
        <p className="font-sans text-foreground/70">{dict.skills.description}</p>
      </header>
      {/* Client island receives all data as serializable props */}
      <SkillFilterGrid
        entries={entries}
        categories={categories}
        lang={lang}
        dict={dict.skills}
      />
    </div>
  )
}
```

```typescript
// src/components/skills/SkillFilterGrid.tsx — CLIENT COMPONENT
'use client'
import { useState } from 'react'
import type { SkillEntry } from '../../../lib/content/skills'
import { SkillCard } from './SkillCard'
import { SkillCardGrid } from './SkillCardGrid'

interface SkillFilterGridProps {
  entries: SkillEntry[]
  categories: string[]
  lang: string
  dict: {
    allCategories: string
    noSkills: string
    // ... other strings
  }
}

export function SkillFilterGrid({ entries, categories, lang, dict }: SkillFilterGridProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = activeCategory
    ? entries.filter((e) => e.category === activeCategory)
    : entries

  return (
    <div>
      {/* Filter controls — pill buttons above grid */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-1.5 rounded-pill text-sm font-sans transition-colors ${
            activeCategory === null
              ? 'bg-primary text-white'
              : 'bg-muted text-foreground/70 hover:bg-muted/80'
          }`}
        >
          {dict.allCategories}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-pill text-sm font-sans transition-colors ${
              activeCategory === cat
                ? 'bg-primary text-white'
                : 'bg-muted text-foreground/70 hover:bg-muted/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Card grid */}
      {filtered.length > 0 ? (
        <SkillCardGrid>
          {filtered.map((entry) => (
            <SkillCard key={entry.slug} entry={entry} lang={lang} />
          ))}
        </SkillCardGrid>
      ) : (
        <p className="font-sans text-foreground/60 text-center py-16">
          {dict.noSkills}
        </p>
      )}
    </div>
  )
}
```

**Critical:** `SkillFilterGrid` receives `entries` and `categories` as props from the server component. This means the server fetches all data at request time. `SkillCard` (rendered inside `SkillFilterGrid`) must NOT be a `'use client'` component — it is a regular functional component imported into the client component. It will be bundled as client JS since it is a child of a client component.

### Pattern 3: SkillCard with Category Badge

Similar to ScienceCard with difficulty badge, but `category` is a free-form string (not an enum). Use consistent badge styling:

```typescript
// src/components/skills/SkillCard.tsx — NO 'use client' directive
// (rendered inside SkillFilterGrid which IS 'use client' — this becomes client JS too)
import Link from 'next/link'
import Image from 'next/image'
import type { SkillEntry } from '../../../lib/content/skills'
import { MascotImage } from '@/components/ui/MascotImage'

const MASCOT_POSES = ['default', 'waving', 'thinking', 'sleeping'] as const
const THUMBNAIL_BG_CLASSES = [
  'bg-primary/20',
  'bg-secondary/30',
  'bg-accent/20',
  'bg-contrast/20',
] as const

interface SkillCardProps {
  entry: SkillEntry
  lang: string
}

export function SkillCard({ entry, lang }: SkillCardProps) {
  const hash = entry.slug.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const pose = MASCOT_POSES[hash % MASCOT_POSES.length] ?? 'default'
  const thumbnailBg = THUMBNAIL_BG_CLASSES[hash % THUMBNAIL_BG_CLASSES.length] ?? 'bg-primary/20'
  // ... rest of card JSX with category badge replacing difficulty badge
}
```

### Pattern 4: Download CTA on Detail Page

The download CTA button links to `entry.downloadUrl` (external URL, opens in new tab):

```typescript
// In src/app/[lang]/skills/[slug]/page.tsx
<a
  href={entry.downloadUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 bg-primary text-white font-sans font-semibold px-6 py-3 rounded-pill hover:bg-primary/90 transition-colors shadow-sm"
>
  {dict.skills.downloadCta}
</a>
```

Placement: immediately below the article header (after title), before the MDX prose body. This gives it prominence per D-09.

### Pattern 5: Route Page Structure (mirrors science exactly)

**Import paths from skill route files:**
```typescript
// From src/app/[lang]/skills/page.tsx
import { getSkillEntries } from '../../../../lib/content/skills'

// From src/app/[lang]/skills/[slug]/page.tsx
import { getSkillEntries, getSkillBySlug } from '../../../../../lib/content/skills'
const { default: MDXContent } = await import(`../../../../../content/skills/${slug}.mdx`)
```

**`lib/` and `content/` are at project root, NOT inside `src/`. The `@/*` alias maps to `src/*` only. Always use relative paths.**

### Pattern 6: Pagination Decision for Filtered Listing

The success criteria says "Applying a filter shows only matching skill packs without a full page reload." This implies filtering is always client-side on a single page. For v1 with 3-5 seed entries, pagination is irrelevant. The recommended approach:

- **No pagination for filtered view**: when a category filter is active, show all matching results (no pagination). With ~5 seed entries, this is trivially small.
- **Keep pagination infrastructure**: maintain `src/app/[lang]/skills/page/[page]/page.tsx` for future when skill packs grow beyond 12. The `SkillFilterGrid` on paginated pages would show the current page's subset, but filtering within a page only filters visible items.
- **Simplest v1 approach**: list page passes ALL entries to `SkillFilterGrid` (no slicing). No pagination routes needed until content exceeds 12 entries. The planner may choose to include or omit the paginated route — research recommends omitting for v1 and noting it as a future addition.

### Pattern 7: Dictionary Keys to Add

The `dictionaries/en.json` `skills` key currently has only `title` and `description`. Add the full set:

```json
"skills": {
  "title": "Skill Packs",
  "description": "Downloadable AI capability bundles",
  "backToSkills": "Back to Skill Packs",
  "page": "Page",
  "of": "of",
  "downloadCta": "Download Skill Pack",
  "noSkills": "No skill packs yet. Check back soon!",
  "allCategories": "All",
  "category": "Category"
}
```

Note: No `prev`/`next` keys needed because the success criteria do not include prev/next navigation (Claude's discretion — recommended to omit for simplicity).

### Pattern 8: Seed MDX Frontmatter Shape

```yaml
---
title: "Content Writing Pack"
date: "2026-04-01"
excerpt: "A complete set of prompts and templates for AI-powered blog posts, social media content, and marketing copy."
category: "Content Writing"
tags: ["writing", "content", "marketing"]
downloadUrl: "https://github.com/aquaclaw-ai/skill-packs/releases/tag/content-writing-v1"
---
```

The `downloadUrl` is validated as a URL by Zod — placeholder GitHub release URLs are valid and satisfy the constraint for v1.

### Anti-Patterns to Avoid

- **Using `'use client'` on the page shell**: the listing page (`page.tsx`) must be a server component so `getDictionary()` and `getSkillEntries()` run server-side. Only `SkillFilterGrid` needs `'use client'`.
- **Calling `getSkillEntries()` inside `SkillFilterGrid`**: `lib/content/skills.ts` has `import 'server-only'` — calling it in a client component causes a build error. Always fetch data in the server component and pass as props.
- **Using `useState` in `SkillCard`**: `SkillCard` is imported by `SkillFilterGrid` (a client component) so it will be bundled as client JS, but it does not need its own `'use client'` directive or state. Keep it as a plain functional component.
- **Hardcoding category list**: categories must be derived from `entries.map(e => e.category)` — no hardcoded array. New skill packs with new categories must appear automatically.
- **Math.random() for mascot pose**: same pitfall as all other sections — use slug hash for determinism.
- **Using `@/` alias for `lib/` or `content/` imports**: `@/*` maps to `src/*`. Relative paths required.
- **Omitting try/catch on dynamic MDX import**: all content sections use a try/catch fallback. Skills must do the same.
- **Forgetting `rel="noopener noreferrer"` on download link**: `downloadUrl` is an external URL opened in a new tab — security best practice requires these rel attributes.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Frontmatter parsing | Custom regex parser | `gray-matter` (already in lib/content/skills.ts) | Already implemented |
| Schema validation | Manual type checks | Zod (`SkillFrontmatterSchema`) | Already implemented; throws at build time |
| Prose typography | Custom CSS | `@tailwindcss/typography` prose classes | Already configured, used by all sections |
| Pagination component | New pagination component | `PaginationBar` from `src/components/diary/PaginationBar.tsx` | Already handles sections via `basePath` prop |
| Mascot placeholder | Random selection | Slug hash determinism (established Phase 5) | Prevents SSR hydration mismatch |
| ISR / cache invalidation | Manual cache busting | `export const revalidate = 3600` | Standard across all content sections |
| Category uniqueness | Custom deduplication | `Array.from(new Set(...))` | Standard JS — no library needed |

**Key insight:** The only genuinely new work in Phase 7 is `SkillFilterGrid` (the first `'use client'` interactive component in content sections) and the download CTA button on detail pages. Everything else is a close copy of the science section pattern.

---

## Common Pitfalls

### Pitfall 1: `server-only` Guard Prevents Client Component Import
**What goes wrong:** `SkillFilterGrid` (a `'use client'` component) attempts to call `getSkillEntries()` directly, causing a build error: "You're importing a component that imports server-only."
**Why it happens:** `lib/content/skills.ts` has `import 'server-only'` at the top — it cannot be imported in any client component, even indirectly.
**How to avoid:** Always call `getSkillEntries()` in the server component (`page.tsx`) and pass results as props to `SkillFilterGrid`. Never import from `lib/content/` inside a `'use client'` component.
**Warning signs:** Build error mentioning `server-only` or "cannot be used in a Client Component."

### Pitfall 2: Import Path for lib/content/skills.ts
**What goes wrong:** Using `@/lib/content/skills` in route files.
**Why it happens:** `@/*` alias maps only to `src/*`. `lib/` is at project root.
**How to avoid:** Use relative paths. From `src/app/[lang]/skills/page.tsx`: `../../../../lib/content/skills`. From `src/app/[lang]/skills/[slug]/page.tsx`: `../../../../../lib/content/skills`.
**Warning signs:** TypeScript "Cannot find module" error.

### Pitfall 3: Dynamic MDX Import Path Depth
**What goes wrong:** `import(\`../content/skills/${slug}.mdx\`)` resolves incorrectly.
**Why it happens:** Must count 5 levels up from `src/app/[lang]/skills/[slug]/page.tsx` to reach project root: `[slug]` → `skills` → `[lang]` → `app` → `src` → project root.
**How to avoid:** Use `../../../../../content/skills/${slug}.mdx` — same depth as science section.
**Warning signs:** MDX import always falls through to catch block; detail pages show raw content.

### Pitfall 4: content.test.ts Assertion Will Break After Adding Seed Files
**What goes wrong:** After adding seed MDX files, `src/__tests__/content.test.ts` line 92 will fail: `expect(getSkillEntries()).toEqual([])` — this assertion was written when `content/skills/` was empty.
**Why it happens:** The test was written to confirm the empty directory case. Once seed files exist, it is no longer valid.
**How to avoid:** Update `content.test.ts` as part of Plan 01 Task 1 when adding seed files. Change the assertion to `expect(entries.length).toBe(N)` where N is the number of seed files added. This is the same pattern as Phase 5 (articles) and Phase 6 (science).
**Warning signs:** `npx vitest run src/__tests__/content.test.ts` fails after seed creation.

### Pitfall 5: Missing Dictionary Keys in `skills` Section
**What goes wrong:** `dict.skills.downloadCta` or `dict.skills.allCategories` is undefined, causing runtime errors.
**Why it happens:** The existing `dictionaries/en.json` `skills` key only has `title` and `description`.
**How to avoid:** Expand the `skills` dictionary key in Plan 01 Task 1 before components use those strings.
**Warning signs:** TypeScript may not catch undefined access if the dictionary type is inferred loosely; runtime "Cannot read properties of undefined" error.

### Pitfall 6: `SkillEntry` Passes to Client Component — Must Be Serializable
**What goes wrong:** `SkillEntry` objects passed as props to `SkillFilterGrid` must be serializable (plain JSON). Class instances, Dates, or functions cannot be passed.
**Why it happens:** Next.js serializes server component props to JSON before passing to client components.
**How to avoid:** `SkillEntry` fields are all primitives (strings, string arrays) — `date` is stored as a string in frontmatter, not a Date object. This is safe as long as no transformation converts strings to Date objects in the content layer. Verify `lib/content/skills.ts` — it does not convert `date` to a Date object (confirmed: `...parsed.data` spreads the Zod output directly, and the schema uses `z.string()` for date).
**Warning signs:** Next.js build warning about non-serializable props.

### Pitfall 7: Category Badge vs. Difficulty Badge Difference
**What goes wrong:** Category badge tries to use a fixed `CATEGORY_STYLES` record (like `DIFFICULTY_STYLES` for science), but category is a free-form string — no finite enum to key off of.
**Why it happens:** The science section used `Record<string, string>` keyed by a finite enum. `category` is any string.
**How to avoid:** Use a single badge style for all categories (e.g., `bg-secondary/30 text-foreground/80`) rather than trying to color-code by category. Or use a hash-based color selection (same hash as mascot pose) to give each category a consistent but dynamically assigned color. Recommended: single style for v1 simplicity.
**Warning signs:** Badge renders unstyled (no background) for unexpected category values.

---

## Code Examples

Verified patterns from the codebase:

### SkillEntry type (from lib/content/skills.ts — direct read)
```typescript
export interface SkillEntry extends SkillFrontmatter {
  slug: string
  content: string
}
// SkillFrontmatter (from schemas.ts): title, date, excerpt, thumbnail?, slug?, tags[], category, downloadUrl
```

### SkillFrontmatterSchema (from lib/content/schemas.ts — direct read)
```typescript
export const SkillFrontmatterSchema = CommonFrontmatterSchema.extend({
  category: z.string(),
  downloadUrl: z.string().url(),
})
```

### Server shell listing page
```typescript
// src/app/[lang]/skills/page.tsx
import { getSkillEntries } from '../../../../lib/content/skills'
import { getDictionary, type Locale } from '@/lib/i18n/getDictionary'
import { SkillFilterGrid } from '@/components/skills/SkillFilterGrid'

export const revalidate = 3600

export default async function SkillsPage({ params }: SkillsPageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  const entries = getSkillEntries()
  const categories = Array.from(new Set(entries.map((e) => e.category))).sort()

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-12">
      <header className="mb-10">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          {dict.skills.title}
        </h1>
        <p className="font-sans text-foreground/70">{dict.skills.description}</p>
      </header>
      <SkillFilterGrid entries={entries} categories={categories} lang={lang} dict={dict.skills} />
    </div>
  )
}
```

### Detail page import paths
```typescript
// src/app/[lang]/skills/[slug]/page.tsx
import { getSkillEntries, getSkillBySlug } from '../../../../../lib/content/skills'
const { default: MDXContent } = await import(`../../../../../content/skills/${slug}.mdx`)
// Source: same depth as science detail page (5 levels up to project root)
```

### getDictionary type inference (from src/lib/i18n/getDictionary.ts — direct read)
```typescript
// Type is auto-inferred from en.json via TypeScript import
// No separate type file to update — adding keys to en.json is sufficient
export async function getDictionary(locale: Locale) {
  return dictionaries[locale]()
}
```

### Seed MDX frontmatter
```yaml
---
title: "Content Writing Pack"
date: "2026-04-01"
excerpt: "A complete set of prompts and templates for AI-powered blog posts, social media content, and marketing copy."
category: "Content Writing"
tags: ["writing", "content", "marketing"]
downloadUrl: "https://github.com/aquaclaw-ai/skill-packs/releases/tag/content-writing-v1"
---
```

### PaginationBar reuse (from existing codebase — no changes needed)
```typescript
// Pass basePath="skills" — same pattern as articles and science
import { PaginationBar } from '@/components/diary/PaginationBar'
// Props: currentPage, totalPages, lang, basePath="skills"
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| No interactive content sections | First `'use client'` in content: SkillFilterGrid | Phase 7 | Server shell + client island pattern; getSkillEntries() must stay server-side |
| All sections use prev/next nav | Skills omits prev/next (not in success criteria) | Phase 7 | Slightly simpler detail page; can always add later |
| Server components exclusively | SkillCard rendered inside 'use client' SkillFilterGrid | Phase 7 | SkillCard will be bundled as client JS; keep it lightweight (no server-only imports) |

**Patterns unchanged from Phases 4-6:**
- Slug hash for deterministic mascot pose
- `PaginationBar` with `basePath` prop
- Relative import for `lib/` and `content/`
- `export const revalidate = 3600`
- Dynamic MDX import try/catch fallback
- `params is Promise<...>` — must await
- `@tailwindcss/typography` prose wrapper on detail page

---

## Open Questions

1. **Pagination with client-side filtering**
   - What we know: the success criteria says filtering happens without a full page reload (client-side). Traditional pagination requires server routes.
   - What's unclear: whether to support pagination at all in v1 (5 seed entries don't need it) and what happens when filtering reduces results to < 1 page.
   - Recommendation: Omit pagination routes for v1. Pass all entries to `SkillFilterGrid`. Document as a future addition when entry count exceeds ~20. The planner should make this call.

2. **Category badge color**
   - What we know: CONTEXT.md marks badge styling as Claude's discretion. Science used a finite enum with semantic colors (green/yellow/red). Skills use a free-form string category.
   - What's unclear: whether to use a single neutral badge color or dynamically assign colors.
   - Recommendation: Single style (`bg-secondary/30 text-foreground/80`) for v1 simplicity. Avoids the complexity of mapping arbitrary strings to colors. Can be enhanced later.

3. **SkillCard bundle size**
   - What we know: `SkillCard` will be bundled as client JS because it is a child of `SkillFilterGrid` (`'use client'`). Prior cards (DiaryCard, ArticleCard, ScienceCard) were all server-only components.
   - What's unclear: whether next/image's `<Image>` component can be used in client-bundled code (yes, it can — it is framework-provided and works client-side).
   - Recommendation: No concern. `next/image` works in client components. Keep SkillCard lightweight — no heavy imports.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (vitest.config.ts at project root) |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run --reporter=verbose src/__tests__/skills.test.ts` |
| Full suite command | `npx vitest run --reporter=verbose` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SKIL-01 | getSkillEntries returns seed entries sorted newest-first | unit | `npx vitest run src/__tests__/skills.test.ts` | Wave 1 (Plan 01) |
| SKIL-01 | Category filter logic returns correct subset | unit | `npx vitest run src/__tests__/skills.test.ts` | Wave 1 (Plan 01) |
| SKIL-01 | Skills listing page renders via build | smoke | `npx next build 2>&1 \| tail -20` | Wave 2 (Plan 02) |
| SKIL-02 | getSkillBySlug returns correct entry + null for missing | unit | `npx vitest run src/__tests__/skills.test.ts` | Wave 1 (Plan 01) |
| SKIL-02 | All seed entries have non-empty downloadUrl | unit | `npx vitest run src/__tests__/skills.test.ts` | Wave 1 (Plan 01) |
| SKIL-03 | All seed MDX files exist and parse with valid Zod frontmatter | unit | `npx vitest run src/__tests__/skills.test.ts` | Wave 1 (Plan 01) |
| SKIL-03 | All seed entries have non-empty category field | unit | `npx vitest run src/__tests__/skills.test.ts` | Wave 1 (Plan 01) |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose src/__tests__/skills.test.ts`
- **Per wave merge:** `npx vitest run --reporter=verbose`
- **Phase gate:** Full suite green + `npx next build` success before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/__tests__/skills.test.ts` — covers SKIL-01 through SKIL-03 (created in Plan 01 Task 1 alongside seed content, same structure as `science.test.ts`)

Update `content.test.ts` line 92 assertion after seed files are added (currently asserts `getSkillEntries()` returns `[]` — will break once seed MDX files exist).

---

## Sources

### Primary (HIGH confidence)
- `lib/content/skills.ts` — direct read; confirmed `getSkillEntries()` and `getSkillBySlug()` signatures; confirmed `server-only` import
- `lib/content/schemas.ts` — direct read; confirmed `SkillFrontmatterSchema` with `category: z.string()` and `downloadUrl: z.string().url()`
- `src/app/[lang]/science/page.tsx` — direct read; canonical listing page pattern to mirror
- `src/app/[lang]/science/[slug]/page.tsx` — direct read; canonical detail page pattern including dynamic MDX import, try/catch, prev/next logic
- `src/app/[lang]/science/page/[page]/page.tsx` — direct read; canonical pagination route pattern
- `src/components/articles/ArticleCard.tsx` — direct read; slug hash pattern, mascot placeholder, card JSX
- `src/components/science/ScienceCard.tsx` — direct read; category/difficulty badge pattern, DIFFICULTY_STYLES record
- `src/components/science/SciencePrevNext.tsx` — direct read; exact prop shape and JSX (reference for optional SkillPrevNext)
- `src/components/diary/PaginationBar.tsx` — direct read; `basePath` prop API confirmed
- `src/components/ui/MascotImage.tsx` — direct read; confirmed pose types and API
- `dictionaries/en.json` — direct read; confirmed `skills` key has only `title` and `description`
- `src/__tests__/science.test.ts` — direct read; canonical test file structure to mirror
- `src/__tests__/content.test.ts` — direct read; identified line 92 assertion that will break after seed files added
- `src/lib/i18n/getDictionary.ts` — direct read; confirmed type auto-inferred from en.json — no separate type file

### Secondary (MEDIUM confidence)
- `.planning/phases/05-articles-section/05-01-PLAN.md` and `05-02-PLAN.md` — direct read; confirmed 2-plan task structure
- `.planning/phases/06-science-section/06-RESEARCH.md` — direct read; confirmed patterns and pitfalls applicable to Phase 7

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all infrastructure exists and was directly verified in codebase
- Architecture patterns: HIGH — directly read from implemented Phase 4, 5, and 6 code; server shell + client island is a well-established Next.js App Router pattern
- Pitfalls: HIGH — identified from actual codebase state (server-only guard in skills.ts, content.test.ts assertion at line 92, schema shape, import paths)

**Research date:** 2026-04-01
**Valid until:** Stable — these are codebase-internal patterns, not external dependencies. Valid until codebase structure changes.
