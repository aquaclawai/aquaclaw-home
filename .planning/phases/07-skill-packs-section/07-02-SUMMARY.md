---
phase: 07-skill-packs-section
plan: 02
subsystem: ui
tags: [next.js, react, mdx, tailwind, next-intl, vitest, server-components, client-components]

# Dependency graph
requires:
  - phase: 07-skill-packs-section (plan 01)
    provides: SkillFilterGrid client component, SkillCard, SkillCardGrid, lib/content/skills.ts, 5 seed MDX files, dictionary keys

provides:
  - Skills listing page at /[lang]/skills with server shell + client-side category filtering
  - Skill detail pages at /[lang]/skills/[slug] with MDX rendering and download CTA button
  - generateStaticParams for all locale x slug combinations
  - Unit tests (14 cases) covering filter logic, seed validation, downloadUrl, and category fields

affects:
  - 08-homepage (will link to /skills from homepage aggregation)
  - 09-seo-sitemap (skills routes included in sitemap generation)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Server shell pattern: server component fetches data + derives categories, passes complete serializable dataset to client component
    - Dynamic MDX import with try/catch fallback for detail pages
    - generateStaticParams across locales x content slugs
    - ISR revalidate=3600 on content route pages

key-files:
  created:
    - src/app/[lang]/skills/page.tsx
    - src/app/[lang]/skills/[slug]/page.tsx
    - src/__tests__/skills.test.ts
  modified: []

key-decisions:
  - "Skills listing page is a server shell with no 'use client' — data fetching and category derivation happen server-side, all passed as serializable props to SkillFilterGrid"
  - "Categories derived dynamically server-side via Array.from(new Set(...)).sort() — not hardcoded, scales as new MDX files are added"
  - "No pagination for v1 — 5 seed entries don't need it; client-side category filtering handles display without pagination complexity"
  - "No prev/next navigation on detail pages — not in success criteria, omitted for simplicity"
  - "MDX import uses relative path (../../../../../content/skills/${slug}.mdx) — @/ alias maps to src/ so cannot reference content/ directory at project root"

patterns-established:
  - "Server shell pattern: [lang]/content-section/page.tsx is always a server component that derives categories/tags server-side and passes full dataset to client island"
  - "Detail page MDX import: try/catch dynamic import with relative path counting directory levels from route segment to project root"
  - "generateStaticParams: locales.flatMap(lang => entries.map(entry => ({ lang, slug: entry.slug }))) pattern"

requirements-completed: [SKIL-01, SKIL-02]

# Metrics
duration: 12min
completed: 2026-04-01
---

# Phase 07 Plan 02: Skills Route Pages Summary

**Skills listing page with server-shell/client-island pattern and category filter, plus detail pages with MDX rendering and download CTA button across all skill pack slugs**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-04-01T15:00:00Z (estimated)
- **Completed:** 2026-04-01T15:01:57Z
- **Tasks:** 2 (1 auto + 1 human-verify)
- **Files modified:** 3

## Accomplishments

- Skills listing page at /en/skills renders server-side with page header, derives unique categories dynamically, and passes complete dataset to SkillFilterGrid client component for zero-reload category filtering
- Skill detail pages at /en/skills/[slug] render full MDX content with styled prose feature lists, prominent download CTA button (pill-shaped, primary color, target=_blank), back navigation, category badge, tag pills, and per-page OG metadata
- 14 unit tests covering: filter logic (null/specific/non-existent categories), all 5 seed files on disk, sort order, field validation, downloadUrl format, category coverage, and MDX bullet list presence

## Task Commits

1. **Task 1: Skills route pages and tests** - `8645230` (feat)
2. **Task 2: Visual verification of complete skills section** - User approved (no files modified)

## Files Created/Modified

- `src/app/[lang]/skills/page.tsx` - Server shell: fetches entries, derives categories server-side, renders page header + SkillFilterGrid client component
- `src/app/[lang]/skills/[slug]/page.tsx` - Detail page: MDX rendering with try/catch dynamic import, download CTA button, back link, generateStaticParams, generateMetadata with OG
- `src/__tests__/skills.test.ts` - 14 unit tests covering filter logic, seed pack validation, downloadUrl and category field requirements

## Decisions Made

- Skills listing page uses server shell pattern — no `'use client'` on the page, all data fetching server-side, serializable props passed to SkillFilterGrid
- Categories derived dynamically server-side so adding new MDX files auto-populates filter without code changes
- No pagination for v1 (5 entries) — client-side filtering sufficient; pagination can be added when content exceeds ~20 entries
- MDX dynamic import uses relative path from route segment to project root (5 levels: `../../../../../content/skills/${slug}.mdx`) — cannot use @/ alias since it maps to src/, not project root
- No prev/next navigation on detail pages — not in success criteria, kept simple

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None — all 14 tests passed on first run and `next build` completed successfully with all skill routes statically generated.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Skills section fully complete: listing at /en/skills, detail at /en/skills/[slug], all routes statically generated
- Homepage (Phase 08) can aggregate skills data using getSkillEntries() from lib/content/skills
- SEO/sitemap phase can enumerate skill routes from getSkillEntries()
- No blockers for subsequent phases

---
*Phase: 07-skill-packs-section*
*Completed: 2026-04-01*
