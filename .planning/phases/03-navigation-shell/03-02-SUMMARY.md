---
phase: 03-navigation-shell
plan: 02
subsystem: ui
tags: [next.js, react, tailwind, mobile-menu, 404, i18n, accessibility]

# Dependency graph
requires:
  - phase: 03-01
    provides: Header.tsx shell (server component) and Footer — mobile trigger slot was a placeholder button
  - phase: 02-02
    provides: MascotImage component with waving/thinking poses
  - phase: 02-01
    provides: animate-bounce-in and animate-float CSS tokens, color tokens
provides:
  - Full-screen mobile hamburger menu overlay (MobileMenu.tsx + MobileMenuTrigger.tsx client islands)
  - Custom 404 page with thinking mascot and navigation recovery links
  - Updated Header.tsx integrating MobileMenuTrigger (Header remains server component)
affects: [04-diary-section, 05-articles-section, 06-science-section, 07-skill-packs-section]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Client island pattern: MobileMenuTrigger is the smallest possible 'use client' boundary; Header stays a server component"
    - "Conditional null return for overlay: MobileMenu returns null when isOpen=false, keeping DOM clean when menu is closed"
    - "Escape key + backdrop + X button all call same onClose handler — single close path"
    - "Body scroll lock via document.body.style.overflow in useEffect with cleanup"
    - "404 page uses hardcoded English strings (rendered outside [lang] layout, cannot use getDictionary)"

key-files:
  created:
    - src/components/nav/MobileMenu.tsx
    - src/components/nav/MobileMenuTrigger.tsx
    - src/app/not-found.tsx
  modified:
    - src/components/nav/Header.tsx

key-decisions:
  - "MobileMenuTrigger is the client island boundary, not MobileMenu — keeps state ownership co-located with the trigger button"
  - "not-found.tsx uses hardcoded English strings because it renders outside [lang]/layout.tsx and cannot call getDictionary with a locale"

patterns-established:
  - "Client island pattern: isolate 'use client' to the smallest interactive leaf, keep parent as server component"
  - "Close handlers: all three close paths (X button, backdrop click, Escape key) funnel to the same onClose callback"

requirements-completed: [NAV-02, NAV-04]

# Metrics
duration: ~10min
completed: 2026-03-30
---

# Phase 3 Plan 2: Navigation Shell — Mobile Menu and 404 Page Summary

**Full-screen mobile hamburger menu overlay with bouncy animation and waving mascot, plus a custom 404 page with thinking mascot, all human-verified**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-03-30T12:09:00Z
- **Completed:** 2026-03-30T12:15:00Z
- **Tasks:** 3 (2 auto + 1 human-verify checkpoint)
- **Files modified:** 4

## Accomplishments
- MobileMenu.tsx client component: full-screen overlay with animate-bounce-in entry, backdrop tap to close, Escape key handler, body scroll lock, waving mascot at bottom
- MobileMenuTrigger.tsx client island: owns open/close state with useState, renders hamburger SVG with aria-label and aria-expanded, composes MobileMenu
- Header.tsx updated: placeholder hamburger replaced with MobileMenuTrigger; Header remains a server component
- not-found.tsx: custom 404 with thinking mascot, punny AI-themed heading, bounce-in animations, three nav recovery buttons (Home, Diary, Articles)
- Human visual verification passed: all four navigation shell components (header, mobile menu, footer, 404) approved

## Task Commits

Each task was committed atomically:

1. **Task 1: Create MobileMenu client component and update Header** - `665fd84` (feat)
2. **Task 2: Create custom 404 page** - `b5bfd3a` (feat)
3. **Task 3: Visual verification** - human-approved checkpoint (no code commit)

## Files Created/Modified
- `src/components/nav/MobileMenu.tsx` - Full-screen mobile menu overlay, 'use client', animate-bounce-in, waving mascot, Escape/backdrop/X close handlers, body scroll lock
- `src/components/nav/MobileMenuTrigger.tsx` - Client island owning open/close state, hamburger button with aria attributes, composes MobileMenu
- `src/components/nav/Header.tsx` - Removed placeholder hamburger button, imported and rendered MobileMenuTrigger; Header stays server component
- `src/app/not-found.tsx` - App Router 404 page, thinking mascot with bounce-in, punny heading, 3 navigation links

## Decisions Made
- MobileMenuTrigger is the client island boundary (not MobileMenu itself) — this co-locates state ownership with the trigger button and minimizes the client bundle
- not-found.tsx uses hardcoded English strings because it renders outside the [lang] layout and cannot use getDictionary with a locale param; English-first approach is acceptable for the 404 use case

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Full navigation shell is complete: fixed header with desktop nav links, mobile hamburger menu, footer, and custom 404 page
- All four shell components human-verified
- Phase 4 (Diary Section) can proceed — it depends on Phase 3 completion and can now render into a complete nav shell

---
*Phase: 03-navigation-shell*
*Completed: 2026-03-30*
