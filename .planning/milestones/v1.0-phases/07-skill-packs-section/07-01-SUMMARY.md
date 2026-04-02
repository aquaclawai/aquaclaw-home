---
phase: 07-skill-packs-section
plan: 01
subsystem: ui
tags: [mdx, tailwind, react, next-intl, skills, client-component, filter]

# Dependency graph
requires:
  - phase: 06-science-section
    provides: ScienceCard/ScienceCardGrid pattern for card component architecture
  - phase: 01-foundation
    provides: lib/content/skills.ts, SkillFrontmatterSchema, content/skills/ directory
provides:
  - 5 seed skill pack MDX files in content/skills/ with valid frontmatter and feature bullet lists
  - Skills dictionary keys (backToSkills, page, of, downloadCta, noSkills, allCategories, category)
  - SkillCard component with deterministic mascot placeholder and neutral category badge
  - SkillCardGrid responsive grid wrapper
  - SkillFilterGrid 'use client' component with category filter pill state
affects:
  - 07-02 (skill route pages — will compose SkillFilterGrid, SkillCard, PaginationBar)
  - 08-homepage (aggregates skills section data)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - SkillFilterGrid as first 'use client' island in content sections — receives all data as serializable props from server parent, never calls server-only content functions
    - import type (erased at compile time) used in client-bundled components to safely reference server-only types
    - Neutral single-style category badge for free-form string categories vs semantic color enum badges (ScienceCard DIFFICULTY_STYLES pattern)

key-files:
  created:
    - content/skills/content-writing-pack.mdx
    - content/skills/code-generation-pack.mdx
    - content/skills/data-analysis-pack.mdx
    - content/skills/image-description-pack.mdx
    - content/skills/task-automation-pack.mdx
    - src/components/skills/SkillCard.tsx
    - src/components/skills/SkillCardGrid.tsx
    - src/components/skills/SkillFilterGrid.tsx
  modified:
    - dictionaries/en.json
    - src/__tests__/content.test.ts

key-decisions:
  - "SkillFilterGrid is the first 'use client' component in content sections — receives serializable SkillEntry[] props from server parent, does not call getSkillEntries() directly to avoid server-only guard violation"
  - "import type used in SkillCard and SkillFilterGrid for SkillEntry to safely type-check while avoiding runtime server-only import in client-bundled code"
  - "Category badge uses a single neutral style (bg-secondary/30) instead of semantic enum colors — category is free-form string unlike science difficulty enum"

patterns-established:
  - "Client filter island pattern: 'use client' component receives complete dataset as serializable props, filters client-side with useState, renders server-safe sub-components"
  - "import type for server-only types in client component trees — erased at compile time, no server-only guard triggered"

requirements-completed: [SKIL-03]

# Metrics
duration: 3min
completed: 2026-04-01
---

# Phase 7 Plan 01: Skill Packs Content and Components Summary

**5 seed skill pack MDX files (Content Writing, Code Generation, Data Analysis, Image Description, Task Automation) plus SkillCard/SkillCardGrid/SkillFilterGrid components — including the first client-side category filter island in the content sections**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-01T14:54:36Z
- **Completed:** 2026-04-01T14:57:36Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- Created 5 MDX skill pack files with valid Zod-compatible frontmatter (category, downloadUrl, tags, date, title, excerpt) and markdown feature bullet lists
- Added 7 new dictionary keys to the skills section in en.json including allCategories and downloadCta
- Built SkillCard with deterministic mascot placeholder (slug hash → pose/bg), neutral category badge, tag pills, title, date, excerpt
- Built SkillCardGrid as a responsive 1/2/3 column grid wrapper (mirrors ScienceCardGrid)
- Built SkillFilterGrid as a 'use client' component with useState category filter, active/inactive pill button styles, filtered card grid, and empty state

## Task Commits

Each task was committed atomically:

1. **Task 1: Seed skill pack content, dictionary keys, and update content test** - `c99761c` (feat)
2. **Task 2: Skill pack UI components (SkillCard, SkillCardGrid, SkillFilterGrid)** - `3893da9` (feat)

**Plan metadata:** (docs commit below)

## Files Created/Modified
- `content/skills/content-writing-pack.mdx` - Seed skill pack: AI writing templates for blog, social, marketing copy
- `content/skills/code-generation-pack.mdx` - Seed skill pack: scaffolding, test generation, refactor prompts
- `content/skills/data-analysis-pack.mdx` - Seed skill pack: data cleaning, visualization, insight extraction
- `content/skills/image-description-pack.mdx` - Seed skill pack: alt text, WCAG-compliant image descriptions
- `content/skills/task-automation-pack.mdx` - Seed skill pack: workflow automation, email triage, scheduling templates
- `src/components/skills/SkillCard.tsx` - Card component with mascot placeholder, category badge, tag pills, title, date, excerpt
- `src/components/skills/SkillCardGrid.tsx` - Responsive 1/2/3 column grid wrapper
- `src/components/skills/SkillFilterGrid.tsx` - 'use client' filter island with category pill state and filtered grid
- `dictionaries/en.json` - Added 7 skills UI keys: backToSkills, page, of, downloadCta, noSkills, allCategories, category
- `src/__tests__/content.test.ts` - Updated getSkillEntries assertion from empty array to 5 entries

## Decisions Made
- SkillFilterGrid is the first `'use client'` island in content sections — receives complete `SkillEntry[]` as serializable props from its server parent, filters client-side with `useState`. This avoids calling `getSkillEntries()` in client context (which would trigger the `server-only` guard).
- `import type` used for `SkillEntry` in both `SkillCard.tsx` and `SkillFilterGrid.tsx` — type references are erased at compile time so the server-only guard is not triggered when these components are bundled as client JS.
- Category badge uses a single neutral style (`bg-secondary/30 text-foreground/80`) rather than semantic enum colors. Category is a free-form string unlike science difficulty, so one consistent style is cleaner.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None — TypeScript compiled clean on first attempt. All content tests passed. The worktree test failures visible in vitest output are pre-existing stale copies in `.claude/worktrees/` — out of scope per deviation rules scope boundary.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Plan 02 can proceed immediately: wire `SkillFilterGrid` into the skills listing page (`app/[lang]/skills/page.tsx`), create skill detail page (`app/[lang]/skills/[slug]/page.tsx`), and reuse `PaginationBar` (basePath="skills")
- All content, components, and dictionary keys are in place — route pages only need to import and compose them
- No blockers

## Self-Check: PASSED

- FOUND: content/skills/content-writing-pack.mdx
- FOUND: content/skills/code-generation-pack.mdx
- FOUND: content/skills/data-analysis-pack.mdx
- FOUND: content/skills/image-description-pack.mdx
- FOUND: content/skills/task-automation-pack.mdx
- FOUND: src/components/skills/SkillCard.tsx
- FOUND: src/components/skills/SkillCardGrid.tsx
- FOUND: src/components/skills/SkillFilterGrid.tsx
- FOUND: .planning/phases/07-skill-packs-section/07-01-SUMMARY.md
- COMMIT c99761c: feat(07-01): seed 5 skill pack MDX files, add skills dictionary keys, update content test
- COMMIT 3893da9: feat(07-01): add SkillCard, SkillCardGrid, and SkillFilterGrid components

---
*Phase: 07-skill-packs-section*
*Completed: 2026-04-01*
