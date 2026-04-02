---
phase: 03-navigation-shell
plan: 01
subsystem: navigation
tags: [header, footer, layout, i18n, navigation-shell]
dependency_graph:
  requires: [02-design-system]
  provides: [Header, Footer, navigation-shell-layout]
  affects: [all-locale-pages]
tech_stack:
  added: []
  patterns: [server-component-nav, dictionary-prop-drilling, fixed-header-offset]
key_files:
  created:
    - src/components/nav/Header.tsx
    - src/components/nav/Footer.tsx
  modified:
    - dictionaries/en.json
    - src/app/[lang]/layout.tsx
decisions:
  - Fixed header with border-b separator (not shadow) per D-03/D-04
  - md breakpoint (768px) for mobile/desktop nav transition per D-09
  - Active link highlighting deferred to Plan 02 client wrapper
metrics:
  duration: 2min
  completed: "2026-03-30T12:03:51Z"
---

# Phase 3 Plan 1: Desktop Header & Footer Shell Summary

Fixed top navigation header with mascot logo and 5 section links, plus 4-column footer with sitemap, social icons, sleeping mascot, and newsletter placeholder -- all wired into [lang]/layout.tsx as server components using dictionary props.

## Task Results

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Update i18n dictionary and create Header component | b60d58b | dictionaries/en.json, src/components/nav/Header.tsx |
| 2 | Create Footer component and wire shell into layout | 52b97d1 | src/components/nav/Footer.tsx, src/app/[lang]/layout.tsx |

## What Was Built

### Header (src/components/nav/Header.tsx)
- Server component receiving lang + dict props from layout
- Fixed top bar with z-50, background color, bottom border
- Left: MascotImage (default pose, 28px) + "AquaClaw.ai" in Fredoka display font
- Center/Right: 5 desktop nav links (hidden md:flex) with hover states
- Right: Hamburger button placeholder (md:hidden) with 3-line SVG icon
- All text from i18n dictionary, no hardcoded strings

### Footer (src/components/nav/Footer.tsx)
- Server component with 4-column responsive grid (1 -> 2 -> 4 columns)
- Brand column: sleeping mascot (48px), site name, "Operated by OpenClaw AI"
- Sections column: 5 sitemap links matching header nav
- Connect column: GitHub, Twitter/X, Discord with inline SVG icons + external link indicators
- Newsletter column: disabled email input + button + "Coming soon" note
- Copyright bar: dynamic year via new Date().getFullYear()

### Layout Shell (src/app/[lang]/layout.tsx)
- Calls getDictionary once, passes dict to both Header and Footer
- min-h-screen flex flex-col for sticky footer behavior
- pt-16 on main to offset fixed header height
- flex-1 on main pushes footer to bottom on short pages

### Dictionary Updates (dictionaries/en.json)
- Added header.logoAlt, header.menuOpen, header.menuClose
- Added footer.sections, footer.connect, footer.newsletter*, footer.github/twitter/discord
- Added notFound.title, notFound.heading, notFound.message, notFound.homeButton, notFound.diaryLink, notFound.articlesLink

## Decisions Made

1. **Border separator over shadow** for header -- cleaner appearance matching the design system's muted border token
2. **md breakpoint (768px)** for hamburger/inline transition -- standard Tailwind md breakpoint, good balance for nav link count
3. **Active link highlighting deferred** -- server component cannot access usePathname; will be handled by client wrapper in Plan 02

## Deviations from Plan

None -- plan executed exactly as written.

## Known Stubs

1. **Hamburger button** (src/components/nav/Header.tsx, line ~49): button rendered but onClick not wired -- Plan 02 adds MobileMenu
2. **Newsletter form** (src/components/nav/Footer.tsx): input and button are disabled with cursor-not-allowed -- intentional per D-12, no backend in v1
3. **Social links** (src/components/nav/Footer.tsx): URLs are placeholder (github.com/aquaclaw, x.com/aquaclaw, discord.gg/aquaclaw) -- real URLs TBD

## Verification

- TypeScript compilation: PASSED (no errors)
- npm run build: PASSED (all routes generated successfully)

## Self-Check: PASSED

All files exist. All commits verified.
