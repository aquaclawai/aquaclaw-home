# Phase 6: Science Section - Research

**Researched:** 2026-04-01
**Domain:** Next.js App Router content section — MDX listing + detail pages with difficulty badge and related links
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Responsive card grid — 1 column mobile, 2 columns tablet, 3 columns desktop. Same pattern as diary/articles.
- **D-02:** Each card shows: thumbnail (or mascot placeholder), difficulty badge, title, date, excerpt (2-3 lines), and tag pills.
- **D-03:** When no thumbnail in frontmatter, show mascot placeholder. Same approach as diary/articles.
- **D-04:** Simple page header — "Science & Education" in Fredoka + one-line description.
- **D-05:** Paginate at 12 entries per page with static page routes. Same pattern as diary/articles.
- **D-06:** Centered prose layout, max-width ~700px. `@tailwindcss/typography` prose classes. Same as diary/articles.
- **D-07:** Explainer header: difficulty badge, tag pills, formatted date, then title in large Fredoka. Back link ("← Back to Science") above everything.
- **D-08:** Bottom prev/next navigation bar — same pattern as diary/articles.
- **D-09:** Related links section at bottom of explainer content (above prev/next nav). Simple list of links to other resources.
- **D-10:** Accessible plain-language writing — explain AI concepts for the general public, not developers.
- **D-11:** Newest first sort order. Same as diary/articles.
- **D-12:** Standard markdown + images. No embedded React components. Same as diary/articles.
- **D-13:** 3-5 seed science explainers written by Claude. Cover foundational AI topics (what is AI, how do chatbots work, etc.) in accessible language.

### Claude's Discretion
- Difficulty badge styling (color-coded pill: green/yellow/red, or icon-based)
- Related links frontmatter schema (array of {title, url} objects, or inline markdown links)
- Whether to add `relatedLinks` field to ScienceFrontmatterSchema or keep links in MDX body
- Card differentiation from diary/articles
- Component reuse strategy (shared vs science-specific)
- Seed explainer topics
- Illustration approach (mascot-based illustrations, or placeholder images)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SCIE-01 | Science/Education listing page with explainer cards — illustration, title, summary | ScienceCard + ScienceCardGrid components, `src/app/[lang]/science/page.tsx` listing route, `getScienceEntries()` already implemented in lib/content/science.ts |
| SCIE-02 | Individual science explainer detail page with accessible language and related links | `src/app/[lang]/science/[slug]/page.tsx`, `getScienceBySlug()` already implemented, related links in MDX body (recommended) or frontmatter, SciencePrevNext component |
| SCIE-03 | Science content stored as MDX files with structured frontmatter | `ScienceFrontmatterSchema` already defined and validated with Zod — adds `difficulty: enum(['beginner','intermediate','advanced'])` on top of CommonFrontmatterSchema |
</phase_requirements>

---

## Summary

Phase 6 follows the exact same 2-plan structure used in Phases 4 (diary) and 5 (articles). The content layer is already fully implemented: `lib/content/science.ts` provides `getScienceEntries()` and `getScienceBySlug()`, and `lib/content/schemas.ts` has `ScienceFrontmatterSchema` extending `CommonFrontmatterSchema` with `difficulty: z.enum(['beginner','intermediate','advanced'])`. The `content/science/` directory exists and is empty, waiting for seed content.

The key difference from articles is the `difficulty` field, which replaces the diary's `dayNumber` as the section-specific distinguishing badge. Cards show a color-coded difficulty pill (green/yellow/red for beginner/intermediate/advanced) instead of "Day N". Detail pages add a related links section between the MDX prose and the prev/next bar. Related links are best kept in the MDX body as a standard markdown list — this avoids schema complexity, works with OpenClaw's file-based publishing, and is already rendered by the prose wrapper.

All established infrastructure (PaginationBar, MascotImage, getDictionary, generateMetadata pattern, ISR revalidate, dynamic MDX import with relative path, slug hash for deterministic mascot pose) is reused unchanged.

**Primary recommendation:** Build science components and seed content in Plan 01 (mirrors 04-01 and 05-01), then wire routes and tests in Plan 02 (mirrors 04-02 and 05-02). Use slug hash for deterministic mascot pose (same as articles). Keep related links in MDX body, not frontmatter.

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
| gray-matter | ^4.0 | Frontmatter parsing (inside lib/content/science.ts) | Active |
| zod | ^3.x | Frontmatter schema validation | Active (ScienceFrontmatterSchema exists) |
| @tailwindcss/typography | ^0.5 | `prose` classes for MDX detail pages | Active |
| next-intl | ^3.x | getDictionary, Locale type | Active |

### Key Existing Assets
| Asset | Path | Status | Notes |
|-------|------|--------|-------|
| Content layer | `lib/content/science.ts` | Exists | `getScienceEntries()` + `getScienceBySlug()` implemented |
| Zod schema | `lib/content/schemas.ts` | Exists | `ScienceFrontmatterSchema` with `difficulty` field |
| Content directory | `content/science/` | Exists, empty | Ready for seed MDX files |
| PaginationBar | `src/components/diary/PaginationBar.tsx` | Reuse directly | Pass `basePath="science"` |
| MascotImage | `src/components/ui/MascotImage.tsx` | Reuse directly | Poses: default/waving/thinking/sleeping |
| Dictionary scaffold | `dictionaries/en.json` → `science` key | Partial | Has `title` and `description` only — needs full UI strings |
| Header nav | Navigation | Exists | "Science" link already in nav |

---

## Architecture Patterns

### Recommended Project Structure
```
Plan 01 — Content + Components:
  content/science/
  ├── what-is-artificial-intelligence.mdx   # seed explainer
  ├── how-do-chatbots-work.mdx
  ├── what-are-neural-networks.mdx
  ├── understanding-machine-learning.mdx
  └── what-is-prompt-engineering.mdx        # 5th optional
  dictionaries/en.json                       # add science UI strings
  src/components/science/
  ├── ScienceCard.tsx                        # card with difficulty badge
  ├── ScienceCardGrid.tsx                    # grid wrapper (mirrors ArticleCardGrid)
  └── SciencePrevNext.tsx                    # prev/next nav (mirrors ArticlePrevNext)

Plan 02 — Routes + Tests:
  src/app/[lang]/science/
  ├── page.tsx                               # listing page (page 1)
  ├── page/[page]/page.tsx                   # pagination routes
  └── [slug]/page.tsx                        # detail page
  src/__tests__/science.test.ts              # Nyquist tests
```

### Pattern 1: ScienceEntry Type Shape
The content layer is already implemented. The type produced by `getScienceEntries()` is:

```typescript
// From lib/content/science.ts + lib/content/schemas.ts
export interface ScienceEntry extends ScienceFrontmatter {
  slug: string
  content: string
}
// ScienceFrontmatter includes: title, date, excerpt, thumbnail?, slug?, tags[], difficulty
// difficulty: 'beginner' | 'intermediate' | 'advanced'
```

### Pattern 2: Difficulty Badge (Claude's Discretion — Recommendation)
Use color-coded pills mapping difficulty to semantic colors from the existing design token palette:

```typescript
// Source: codebase design system (globals.css design tokens)
const DIFFICULTY_STYLES = {
  beginner:     'bg-green-100 text-green-800',   // approachable green
  intermediate: 'bg-yellow-100 text-yellow-800', // caution yellow
  advanced:     'bg-red-100 text-red-800',        // challenging red
} as const

// Usage in ScienceCard:
<span className={`${DIFFICULTY_STYLES[entry.difficulty]} text-xs px-2 py-0.5 rounded-pill font-semibold`}>
  {entry.difficulty.charAt(0).toUpperCase() + entry.difficulty.slice(1)}
</span>
```

Note: The existing design tokens use `bg-primary`, `bg-secondary`, `bg-accent`, `bg-contrast`. For difficulty, semantic green/yellow/red communicate meaning more clearly than the brand palette. Both are available in Tailwind v4.

### Pattern 3: Related Links (Claude's Discretion — Recommendation)
Keep related links in the MDX body, not frontmatter. This approach:
- Requires zero schema changes (ScienceFrontmatterSchema is already deployed)
- Works with OpenClaw file-based writing (write a markdown list at end of file)
- Renders inside the `prose` wrapper automatically with correct link styling
- Avoids complex frontmatter serialization for arrays of objects

Convention: end each science MDX file with a `## Further Reading` or `## Related Links` section containing a standard markdown link list. The detail page needs no special component — the prose wrapper handles it.

If in future a machine-readable related links list is needed (e.g., for a "related content" sidebar), frontmatter can be added then without breaking existing files.

### Pattern 4: Deterministic Mascot Pose (no dayNumber)
Science entries have no `dayNumber`, so use the slug hash approach established in Phase 5 (articles):

```typescript
// Source: src/components/articles/ArticleCard.tsx (Phase 5)
const hash = entry.slug.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
const pose = MASCOT_POSES[hash % MASCOT_POSES.length] ?? 'default'
const thumbnailBg = THUMBNAIL_BG_CLASSES[hash % THUMBNAIL_BG_CLASSES.length] ?? 'bg-primary/20'
```

### Pattern 5: Route Page Structure (mirrors articles exactly)

**Listing page** (`src/app/[lang]/science/page.tsx`):
```typescript
// Source: src/app/[lang]/articles/page.tsx (established pattern)
import { getScienceEntries } from '../../../../lib/content/science'
// relative path — lib/ is at project root, NOT inside src/
// @/* alias maps to src/ only

export const revalidate = 3600
const PAGE_SIZE = 12
```

**Detail page** (`src/app/[lang]/science/[slug]/page.tsx`):
```typescript
// Source: src/app/[lang]/articles/[slug]/page.tsx (established pattern)
import { getScienceEntries, getScienceBySlug } from '../../../../../lib/content/science'

// Dynamic MDX import — MUST use relative path (not @/ alias)
const { default: MDXContent } = await import(`../../../../../content/science/${slug}.mdx`)
```

**Prev/next computation** (newest-first array, same as all content sections):
```typescript
// Source: src/app/[lang]/articles/[slug]/page.tsx (established pattern)
const entries = getScienceEntries()
const currentIndex = entries.findIndex((e) => e.slug === slug)
const prevEntry = currentIndex < entries.length - 1 ? entries[currentIndex + 1] : null // older
const nextEntry = currentIndex > 0 ? entries[currentIndex - 1] : null // newer
```

### Pattern 6: Dictionary Keys to Add
The `dictionaries/en.json` `science` key currently has only `title` and `description`. Add the full set mirroring the articles pattern:

```json
"science": {
  "title": "AI Science",
  "description": "Plain-language explanations of AI concepts",
  "backToScience": "Back to Science",
  "page": "Page",
  "of": "of",
  "prev": "Previous Explainer",
  "next": "Next Explainer",
  "readExplainer": "Read explainer",
  "noExplainers": "No explainers yet. Check back soon!",
  "difficulty": {
    "beginner": "Beginner",
    "intermediate": "Intermediate",
    "advanced": "Advanced"
  }
}
```

The `difficulty` sub-object allows the badge label to come from the dictionary (i18n-ready) rather than being hardcoded.

### Pattern 7: SciencePrevNext Component Shape
Science entries pass `{ slug, title, difficulty }` to SciencePrevNext (difficulty enables showing the badge in the nav if desired, but minimum viable is just slug and title — mirror ArticlePrevNext exactly):

```typescript
// Recommended: mirror ArticlePrevNext exactly for simplicity
interface ScienceRef {
  slug: string
  title: string
}
interface SciencePrevNextProps {
  prevEntry: ScienceRef | null
  nextEntry: ScienceRef | null
  lang: string
  dict: { prev: string; next: string }
}
```

### Anti-Patterns to Avoid
- **Using @/ alias to import from lib/ or content/**: `@/*` maps to `src/*`. All imports from `lib/content/` and `content/` MUST use relative paths from the route file.
- **Math.random() for mascot pose**: causes SSR/client hydration mismatch. Use slug hash (deterministic).
- **'use client' on card/grid/prevnext components**: all can be server components. CSS handles hover effects via Tailwind utilities.
- **Duplicating PaginationBar**: PaginationBar from `src/components/diary/PaginationBar.tsx` is already designed to be reused across sections via `basePath` prop. Import it directly.
- **Duplicating ScienceCardGrid logic**: it is a trivial one-div wrapper. Create a science-specific copy (like ArticleCardGrid) for section independence rather than importing DiaryCardGrid or ArticleCardGrid.
- **Related links in frontmatter**: adds schema complexity for no immediate benefit. Keep in MDX body as a markdown list.
- **Omitting try/catch on dynamic MDX import**: all three content sections use a try/catch fallback to raw content rendering. Science must follow the same pattern.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Frontmatter parsing | Custom regex parser | `gray-matter` (already in lib/content/science.ts) | Handles edge cases, YAML types, multi-doc |
| Schema validation | Manual type checks | Zod (`ScienceFrontmatterSchema`) | Already implemented, throws at build time on bad frontmatter |
| Prose typography | Custom CSS for headings/lists/links | `@tailwindcss/typography` prose classes | Already configured, used by diary + articles |
| Pagination component | New pagination component | `PaginationBar` from `src/components/diary/PaginationBar.tsx` | Already handles all sections via `basePath` prop |
| Mascot placeholder | Random pose selection | Slug hash determinism (established in Phase 5) | Prevents SSR hydration mismatch |
| ISR / cache invalidation | Manual cache busting | `export const revalidate = 3600` | Already used by all content section routes |

**Key insight:** Phase 6 builds on a fully established pattern. The content layer is pre-built. The only net-new work is: difficulty badge styling, related links convention in MDX, and 3 new component files + 3 route files that closely mirror Phase 5.

---

## Common Pitfalls

### Pitfall 1: Import Path for lib/content/science.ts
**What goes wrong:** Using `@/lib/content/science` or `@/../../lib/content/science` in route files.
**Why it happens:** Developers assume `@/` covers the whole project. It maps only to `src/`.
**How to avoid:** Use relative paths. From `src/app/[lang]/science/page.tsx`, the correct import is `../../../../lib/content/science`. From `src/app/[lang]/science/[slug]/page.tsx`, it is `../../../../../lib/content/science`.
**Warning signs:** TypeScript module resolution error — "Cannot find module" on the content import.

### Pitfall 2: Dynamic MDX Import Relative Path Depth
**What goes wrong:** Dynamic import `../content/science/${slug}.mdx` resolves incorrectly.
**Why it happens:** The depth of `../` depends on the nesting level of the route file.
**How to avoid:** From `src/app/[lang]/science/[slug]/page.tsx`, the relative path to project root requires 5 levels up: `../../../../../content/science/${slug}.mdx`. Count: `[slug]` → `science` → `[lang]` → `app` → `src` → project root.
**Warning signs:** MDX import always falls through to the catch block; detail pages render raw content instead of MDX.

### Pitfall 3: Hydration Mismatch from Non-Deterministic Mascot Pose
**What goes wrong:** Using `Math.random()` in ScienceCard for mascot pose selection causes React hydration errors — server and client render different poses.
**Why it happens:** `Math.random()` is not deterministic across SSR and hydration.
**How to avoid:** Use slug hash (established in Phase 5 ArticleCard): `entry.slug.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % N`.
**Warning signs:** React console warning "hydration failed" on development server.

### Pitfall 4: Difficulty Field Missing from Seed Frontmatter
**What goes wrong:** `ScienceFrontmatterSchema.safeParse()` throws because `difficulty` is required. `getScienceEntries()` throws at build time.
**Why it happens:** `difficulty: z.enum(['beginner','intermediate','advanced'])` has no `.optional()` or `.default()` — it is required.
**How to avoid:** Every seed MDX file MUST include `difficulty: beginner` (or intermediate/advanced) in frontmatter. No default value fallback exists.
**Warning signs:** Build error or runtime error "Invalid frontmatter in content/science/[file].mdx".

### Pitfall 5: content.test.ts Already Expects getScienceEntries to Return Empty Array
**What goes wrong:** Once seed files are added, the existing test `'getScienceEntries returns empty array when science dir has no mdx files'` will fail.
**Why it happens:** `content.test.ts` line 86 asserts `getScienceEntries()` returns `[]` — valid before seed content exists, invalid after.
**How to avoid:** Update `content.test.ts` after adding seed files. Change the assertion to `expect(entries.length).toBeGreaterThanOrEqual(3)` or similar. This is the same pattern as Phase 5 Plan 01 Task 1 (articles test was updated when articles seed was added).
**Warning signs:** `npx vitest run src/__tests__/content.test.ts` fails after Plan 01 seed creation.

### Pitfall 6: Missing Dictionary Keys in science Section
**What goes wrong:** `dict.science.backToScience` is undefined, causing runtime errors in route pages.
**Why it happens:** The existing `dictionaries/en.json` `science` key only has `title` and `description`. TypeScript may not catch this if the dictionary type is loosely typed.
**How to avoid:** Add the full science string set in Plan 01 Task 1 before route pages use them. Follow the exact same set as articles (backToScience, page, of, prev, next, readExplainer, noExplainers, difficulty).
**Warning signs:** "Cannot read properties of undefined" at runtime on `dict.science.backToScience`.

---

## Code Examples

Verified patterns from the codebase (direct reads of implemented files):

### ScienceCard difficulty badge
```typescript
// Recommended implementation (discretion area)
const DIFFICULTY_STYLES: Record<string, string> = {
  beginner:     'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced:     'bg-red-100 text-red-800',
}

// In JSX:
<span className={`${DIFFICULTY_STYLES[entry.difficulty] ?? 'bg-muted text-foreground/60'} text-xs px-2 py-0.5 rounded-pill font-semibold`}>
  {dict.science.difficulty[entry.difficulty]}
</span>
```

### Listing page import paths
```typescript
// From src/app/[lang]/science/page.tsx
import { getScienceEntries } from '../../../../lib/content/science'
// Source: established pattern from src/app/[lang]/articles/page.tsx
```

### Detail page import paths
```typescript
// From src/app/[lang]/science/[slug]/page.tsx
import { getScienceEntries, getScienceBySlug } from '../../../../../lib/content/science'
const { default: MDXContent } = await import(`../../../../../content/science/${slug}.mdx`)
// Source: established pattern from src/app/[lang]/articles/[slug]/page.tsx
```

### Seed MDX frontmatter shape
```yaml
---
title: "What Is Artificial Intelligence?"
date: "2026-03-30"
excerpt: "A plain-language guide to what AI actually is, why it exists, and how it affects your daily life — no technical background needed."
difficulty: beginner
tags: ["ai", "explainer", "basics"]
---
```

### Test file structure (mirrors articles.test.ts)
```typescript
// src/__tests__/science.test.ts
import { describe, it, expect } from 'vitest'
import { existsSync } from 'fs'
import { resolve } from 'path'

// Pure helper functions (same as articles.test.ts — pagination + prev/next)
// getScienceEntries validation tests
// Verify difficulty field is present on all entries
// Verify getScienceBySlug returns null for non-existent slug
```

---

## State of the Art

All patterns were established in Phases 4 and 5. No changes are needed.

| Pattern | Established In | Science Usage |
|---------|---------------|---------------|
| Slug hash for mascot pose | Phase 5 (ArticleCard) | Same — no dayNumber on science entries |
| PaginationBar with basePath | Phase 4 (diary), reused Phase 5 | `basePath="science"` |
| Relative import for lib/ and content/ | Phase 4 + 5 | Same depth rules apply |
| ISR revalidate = 3600 | Phase 4 | Same |
| Dynamic MDX import try/catch | Phase 4 + 5 | Same |
| Server component by default | Phase 4 + 5 | All science components are server components |
| params is Promise — must await | Phase 4 + 5 | `const { lang, slug } = await params` |

---

## Open Questions

1. **Dictionary type for `difficulty` sub-object**
   - What we know: `getDictionary()` returns a typed object. Adding a nested `difficulty` object to the `science` key requires the TypeScript type to be updated.
   - What's unclear: whether the dictionary type is auto-inferred from `en.json` or manually maintained in a separate type file.
   - Recommendation: Check `src/lib/i18n/getDictionary.ts` during Plan 01 execution. If the type is auto-inferred from `en.json` (common pattern), no manual update is needed. If manually typed, add `difficulty: { beginner: string; intermediate: string; advanced: string }` to the science entry.

2. **Related links — keep in MDX body or frontmatter**
   - What we know: CONTEXT.md marks this as Claude's discretion. The recommendation here is MDX body (see Pattern 3).
   - What's unclear: OpenClaw may eventually need machine-readable related links to build a "related content" widget.
   - Recommendation: MDX body for v1. A `## Further Reading` section at the end of each explainer satisfies SCIE-02's "related links" requirement and is zero-cost to implement.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (vitest.config.ts at project root) |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run --reporter=verbose src/__tests__/science.test.ts` |
| Full suite command | `npx vitest run --reporter=verbose` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SCIE-01 | Science listing page renders explainer cards | smoke (build) | `npx next build 2>&1 \| tail -20` | Route file: Wave 2 |
| SCIE-01 | getScienceEntries returns seed entries sorted newest-first | unit | `npx vitest run src/__tests__/science.test.ts` | Wave 1 (Plan 01) |
| SCIE-02 | getScienceBySlug returns correct entry + null for missing | unit | `npx vitest run src/__tests__/science.test.ts` | Wave 1 (Plan 01) |
| SCIE-02 | Prev/next logic (newest-first array) is correct | unit | `npx vitest run src/__tests__/science.test.ts` | Wave 1 (Plan 01) |
| SCIE-03 | All seed MDX files parse with valid Zod frontmatter | unit | `npx vitest run src/__tests__/science.test.ts` | Wave 1 (Plan 01) |
| SCIE-03 | All seed entries have `difficulty` field set | unit | `npx vitest run src/__tests__/science.test.ts` | Wave 1 (Plan 01) |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose src/__tests__/science.test.ts`
- **Per wave merge:** `npx vitest run --reporter=verbose`
- **Phase gate:** Full suite green + `npx next build` success before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/__tests__/science.test.ts` — covers SCIE-01 through SCIE-03 (created in Plan 01 Task 1 alongside seed content, same pattern as diary.test.ts and articles.test.ts)

Note: Update `content.test.ts` line 86 assertion after seed files are added (currently asserts `getScienceEntries()` returns `[]`).

---

## Sources

### Primary (HIGH confidence)
- `lib/content/science.ts` — direct read; confirmed `getScienceEntries()` and `getScienceBySlug()` signatures
- `lib/content/schemas.ts` — direct read; confirmed `ScienceFrontmatterSchema` with `difficulty` enum
- `src/app/[lang]/articles/page.tsx` — direct read; canonical listing page pattern
- `src/app/[lang]/articles/[slug]/page.tsx` — direct read; canonical detail page pattern including dynamic MDX import, try/catch, prev/next logic
- `src/app/[lang]/articles/page/[page]/page.tsx` — direct read; canonical pagination route pattern
- `src/components/articles/ArticleCard.tsx` — direct read; slug hash pattern, mascot placeholder, card JSX
- `src/components/articles/ArticlePrevNext.tsx` — direct read; exact prop shape and JSX to mirror
- `src/components/articles/ArticleCardGrid.tsx` — direct read; trivial grid wrapper pattern
- `dictionaries/en.json` — direct read; confirmed existing `science` key has only `title` and `description`
- `src/__tests__/articles.test.ts` — direct read; canonical test file structure to mirror
- `src/__tests__/content.test.ts` — direct read; identified Pitfall 5 (existing assertion will break after seed files added)
- `vitest.config.ts` — direct read; confirmed test runner, aliases, environment

### Secondary (MEDIUM confidence)
- `.planning/phases/05-articles-section/05-01-PLAN.md` and `05-02-PLAN.md` — read; confirms 2-plan structure and task breakdown this phase should follow
- `.planning/phases/04-diary-section/04-01-PLAN.md` and `04-02-PLAN.md` — read; original pattern source
- `.planning/STATE.md` — read; confirmed Phase 5 complete, Phase 6 is next

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all infrastructure exists in codebase, directly verified
- Architecture patterns: HIGH — directly read from implemented Phase 4 and 5 code
- Pitfalls: HIGH — identified from actual codebase state (content.test.ts assertion, schema shape, import paths)

**Research date:** 2026-04-01
**Valid until:** Stable — these are codebase-internal patterns, not external dependencies. Valid until codebase structure changes.
