---
phase: 11-engagement-polish
plan: "03"
subsystem: ui
tags: [lighthouse, accessibility, wcag, performance, color-contrast, seo]

# Dependency graph
requires:
  - phase: 11-engagement-polish
    plan: 01
    provides: Giscus comment widget (lazy loading improves LCP)
  - phase: 11-engagement-polish
    plan: 02
    provides: RSS feeds and autodiscovery metadata in root layout
  - phase: 08-homepage
    provides: HeroSection, StatsCounter, DiaryCarousel, FeaturedContent, ValuePropGrid components
provides:
  - Lighthouse mobile scores >= 90 on homepage: Performance:95 Accessibility:100 BestPractices:100 SEO:100
  - WCAG AA-compliant color contrast across all homepage components
  - Accessible touch targets for carousel dot indicators
  - Corrected aria-label patterns on card links (removed conflicting/mismatched labels)
  - Accessible primary color variant (primary-dark darkened to #C04A1C for WCAG compliance)
affects: [future-content-sections, design-system]

# Tech tracking
tech-stack:
  added: ["lighthouse ^12.x (devDependency — audit tooling only)"]
  patterns:
    - "Lighthouse CLI audit pattern: npm install -D lighthouse, run against production build on localhost, parse JSON report for targeted fixes"
    - "WCAG contrast fix pattern: use opacity variants /70 or /80 instead of /40 or /50 for small text; darken color tokens rather than muting alpha"
    - "Touch target fix: wrap visual-only dots in 24x24px button containers with inner <span> for the visual element"
    - "Aria-label removal pattern: remove aria-label from links whose text content is already descriptive; avoid 'Read ...: Title' prefixes that mismatch visible text"

key-files:
  created: []
  modified:
    - src/app/globals.css
    - src/components/home/HeroSection.tsx
    - src/components/home/DiaryCarousel.tsx
    - src/components/home/FeaturedContent.tsx
    - src/components/nav/Header.tsx
    - src/components/nav/Footer.tsx
    - src/components/diary/DiaryCard.tsx
    - src/components/articles/ArticleCard.tsx
    - src/components/science/ScienceCard.tsx
    - src/components/skills/SkillCard.tsx
    - src/components/ui/MascotImage.tsx
    - .gitignore

key-decisions:
  - "primary-dark darkened from #E55A25 to #C04A1C — passes WCAG AA 4.5:1 for white text on dark-primary and for dark-primary text on cream background"
  - "CTA button changed from bg-primary to bg-primary-dark — white text on #FF6B35 was only 2.83:1 (failing), on #C04A1C it reaches 4.96:1"
  - "Removed aria-label from card link components (DiaryCard, ArticleCard, ScienceCard, SkillCard) — visible text is descriptive; 'Read entry: ...' prefix caused label-content-name-mismatch (WCAG 2.5.3)"
  - "Removed aria-label from Header nav logo link — visible text 'AquaClaw.ai' is sufficient; aria-label was triggering label-content-name-mismatch"
  - "Tag pill text opacity increased from /60 to /70 — text-foreground/60 on bg-muted was 4.18:1 (failing WCAG AA 4.5:1), /70 achieves 5.71:1"
  - "Date text opacity increased from /50 to /70 — small 12px text needs 4.5:1; /50 on card was only 3.25:1, /70 achieves 6.16:1"
  - "Footer contrast fixed: /40 and /50 text opacities -> /70 for WCAG compliance"
  - "MascotImage priority=true extended to waving pose (used in HeroSection) — reduces LCP time for above-fold hero"

patterns-established:
  - "WCAG contrast audit loop: run Lighthouse mobile, parse color-contrast audit items, calculate corrected opacity/color, apply minimal targeted fix"
  - "Carousel dot touch targets: outer button 24x24px (w-6 h-6) + inner span for visual dot — separates click target from visual size"

requirements-completed: [ENGG-01, ENGG-02]

# Metrics
duration: 18min
completed: 2026-04-02
---

# Phase 11 Plan 03: Lighthouse Audit and Accessibility Fixes Summary

**Lighthouse mobile audit applied to homepage achieving P:95 A:100 BP:100 SEO:100 — fixed color contrast (primary-dark #C04A1C), touch targets, aria-label mismatches, and opacity-based text contrast across all homepage components**

## Performance

- **Duration:** ~18 min
- **Started:** 2026-04-02T03:04:54Z
- **Completed:** 2026-04-02T03:23:00Z
- **Tasks:** 1 of 2 (Task 2 is human verification — see checkpoint below)
- **Files modified:** 14

## Accomplishments
- Ran Lighthouse mobile audit against production build and achieved initial scores P:94 A:93 BP:100 SEO:100 — all >= 90 on first run
- Applied targeted accessibility fixes that raised Accessibility from 93 to 100 and Performance from 94 to 95
- Fixed color contrast across all card components by darkening opacity variants and primary color token
- Fixed carousel dot indicator touch targets (was 8-12px, raised to 24x24px buttons with inner visual span)
- Removed conflicting aria-labels from all card link components and nav logo to fix WCAG 2.5.3 label-content-name-mismatch

## Task Commits

Each task was committed atomically:

1. **Task 1: Run Lighthouse mobile audit and apply targeted fixes** - `3c8d9bb` (feat)
2. **Task 2: Human verify Lighthouse mobile scores >= 90** - checkpoint:human-verify (pending)

**Plan metadata:** TBD (docs: complete plan)

## Lighthouse Score Progression

| Run | Performance | Accessibility | Best Practices | SEO |
|-----|-------------|---------------|----------------|-----|
| Initial (pre-fix) | 94 | 93 | 100 | 100 |
| After color/contrast/touch fixes | 95 | 96 | 100 | 100 |
| After tag pill + footer fixes | 95 | 100 | 100 | 100 |

## Key Performance Metrics (Final)

- First Contentful Paint: 0.9s
- Speed Index: 0.9s
- Largest Contentful Paint: 3.0s
- Total Blocking Time: 10ms
- Cumulative Layout Shift: 0
- Time to Interactive: 3.1s

## Files Created/Modified
- `src/app/globals.css` - Darkened `--color-primary-dark` from `#E55A25` to `#C04A1C` for WCAG AA compliance
- `src/components/home/HeroSection.tsx` - CTA button uses `bg-primary-dark` instead of `bg-primary`; hover changed to `hover:opacity-90`
- `src/components/home/DiaryCarousel.tsx` - Dot indicators wrapped in `w-6 h-6` touch target buttons; active dot uses `bg-primary-dark`; "View All" link uses `text-primary-dark`
- `src/components/home/FeaturedContent.tsx` - "View All" links use `text-primary-dark` instead of `text-primary`
- `src/components/nav/Header.tsx` - Logo text uses `text-primary-dark`; removed conflicting `aria-label` from logo link
- `src/components/nav/Footer.tsx` - Footer text opacity raised from /40, /50, /60 to /70 throughout
- `src/components/diary/DiaryCard.tsx` - Removed `aria-label`; "Day N" pill uses `bg-primary-dark`; date `/50` -> `/70`; tags `/60` -> `/70`
- `src/components/articles/ArticleCard.tsx` - Removed `aria-label`; date `/50` -> `/70`; tags `/60` -> `/70`
- `src/components/science/ScienceCard.tsx` - Removed `aria-label`; date `/50` -> `/70`; tags `/60` -> `/70`
- `src/components/skills/SkillCard.tsx` - Removed `aria-label`; date `/50` -> `/70`; tags `/60` -> `/70`
- `src/components/ui/MascotImage.tsx` - `priority={true}` for both `default` and `waving` poses (waving is hero LCP)
- `.gitignore` - Added `lighthouse-report*.json` to ignore audit output files
- `package.json` / `package-lock.json` - Added `lighthouse` as devDependency

## Decisions Made
- `primary-dark` token darkened to `#C04A1C` — satisfies WCAG AA (4.5:1) for all use cases: white text on dark-primary (4.96:1) and dark-primary text on cream (4.70:1)
- Removed `aria-label` from card links — WCAG 2.5.3 requires accessible name includes visible text; prefix like "Read article: Title" fails when visible text starts with tags or "Day N"; visible card content is sufficient description
- Tag pills and date text use `/70` opacity — `/60` (4.18:1) and `/50` (3.25:1) both fail WCAG AA 4.5:1 for 12px text; `/70` achieves 5.71:1 and 6.16:1 respectively

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Fixed WCAG color contrast violations across all card components**
- **Found during:** Task 1 (Lighthouse audit)
- **Issue:** tag pill `text-foreground/60` on `bg-muted` was 4.18:1 (fail); date `text-foreground/50` on card white was 3.25:1 (fail); footer `/40` and `/50` text was 2.41-3.18:1 (fail)
- **Fix:** Raised all small-text opacity to `/70` or higher; fixed primary-dark token; changed CTA button to use accessible dark-primary
- **Files modified:** src/components/diary/DiaryCard.tsx, src/components/articles/ArticleCard.tsx, src/components/science/ScienceCard.tsx, src/components/skills/SkillCard.tsx, src/components/nav/Footer.tsx, src/app/globals.css, src/components/home/HeroSection.tsx
- **Verification:** Third Lighthouse run showed Accessibility: 100
- **Committed in:** 3c8d9bb

**2. [Rule 2 - Missing Critical] Fixed touch target size for carousel dot indicators**
- **Found during:** Task 1 (Lighthouse audit)
- **Issue:** Dot indicators were 8px (inactive) and 12px (active) — Lighthouse requires 24px minimum; dots were too small and too close together
- **Fix:** Wrapped each dot in a `w-6 h-6` (24x24px) button container with inner `<span>` for the visual dot
- **Files modified:** src/components/home/DiaryCarousel.tsx
- **Verification:** Third Lighthouse run showed Accessibility: 100
- **Committed in:** 3c8d9bb

**3. [Rule 2 - Missing Critical] Fixed label-content-name-mismatch on card links**
- **Found during:** Task 1 (Lighthouse audit)
- **Issue:** Card links had `aria-label="Read article: Title"` or `"View skill pack: Title"` but visible text started with tags/badges; Lighthouse flagged WCAG 2.5.3 violation
- **Fix:** Removed `aria-label` from all 4 card components and header logo — visible text is descriptive enough
- **Files modified:** src/components/diary/DiaryCard.tsx, src/components/articles/ArticleCard.tsx, src/components/science/ScienceCard.tsx, src/components/skills/SkillCard.tsx, src/components/nav/Header.tsx
- **Verification:** Third Lighthouse run showed Accessibility: 100
- **Committed in:** 3c8d9bb

---

**Total deviations:** 3 auto-fixed (all Rule 2 — missing critical accessibility compliance)
**Impact on plan:** All fixes required for WCAG AA compliance. No scope creep — only fixing what Lighthouse audited flagged.

## Issues Encountered
- Port 3000 was already occupied by a running Next.js dev server; used port 3001 for the production audit server
- Primary brand color `#FF6B35` cannot pass WCAG 4.5:1 as white text background — required switching CTA button to `bg-primary-dark` rather than adjusting the brand primary color itself

## User Setup Required
None — no external service configuration required.

## Checkpoint: Human Verification Required

The automated Lighthouse audit confirmed all four categories >= 90 mobile. For final confirmation, start the production server and run Chrome DevTools Lighthouse:

```bash
npm run build && npx next start
```

Then: Chrome → http://localhost:3000/en → DevTools → Lighthouse → Mode: Navigation, Device: Mobile → Analyze page load

Expected scores: Performance >= 90, Accessibility >= 90, Best Practices >= 90, SEO >= 90

## Next Phase Readiness
- Phase 11 (engagement-polish) is complete — Giscus comments, RSS feeds, and Lighthouse >= 90 all achieved
- Homepage is launch-ready per D-06 success criterion
- Color contrast improvements cascade to all content section pages (cards shared across diary, articles, science, skills sections)

---
*Phase: 11-engagement-polish*
*Completed: 2026-04-02*
