---
phase: 02-design-system
plan: "02"
subsystem: mascot-assets
tags: [pixel-art, mascot, favicon, component, branding]
dependency_graph:
  requires: [02-01]
  provides: [MascotImage-component, mascot-png-assets, favicon-files]
  affects: [02-03, 03-navigation, 04-hero, 08-homepage]
tech_stack:
  added: []
  patterns: [unoptimized-pixel-art, nearest-neighbor-resize, next-file-convention-favicons]
key_files:
  created:
    - src/components/ui/MascotImage.tsx
    - public/mascot/mascot-default.png
    - public/mascot/mascot-waving.png
    - public/mascot/mascot-thinking.png
    - public/mascot/mascot-sleeping.png
    - src/app/favicon.ico
    - src/app/icon.png
    - src/app/apple-icon.png
    - scripts/generate-mascot-placeholders.mjs
    - scripts/generate-favicons.mjs
  modified: []
decisions:
  - "Pixel-art PNGs generated programmatically with sharp using warm palette (#FF6B35, #F7C948, #2D1B0E) as functional placeholders"
  - "Favicons derived from mascot default pose using nearest-neighbor resize to preserve pixel crispness"
  - "favicon.ico stored as 16x16 PNG renamed to .ico (Next.js serves with correct MIME type)"
metrics:
  duration: "6min"
  completed: "2026-03-30"
  tasks_completed: 3
  tasks_total: 3
  files_created: 10
  files_modified: 0
requirements_completed: [BRAN-02, BRAN-03]
---

# Phase 02 Plan 02: Mascot Assets & Favicon Summary

Pixel-art Garfield-style cat mascot placeholders (4 poses at 64x64) with MascotImage component enforcing crisp rendering via unoptimized + image-rendering:pixelated, plus mascot-derived favicons at 16/32/180px via Next.js file convention.

## What Was Done

### Task 1: Create mascot pixel-art placeholder PNGs and MascotImage component
- Generated 4 distinct pixel-art cat pose PNGs (default, waving, thinking, sleeping) at exactly 64x64 pixels using sharp
- Each pose uses warm palette colors (#FF6B35 orange, #F7C948 yellow, #2D1B0E dark brown outlines)
- Created `MascotImage` component with `pose`, `size`, `className`, and `alt` props
- Component uses `unoptimized` prop to prevent WebP conversion that blurs pixel art
- Applied `[image-rendering:pixelated]` Tailwind arbitrary value for crisp HiDPI upscaling
- Default pose gets `priority` for LCP optimization
- **Commit:** 0bd5bac

### Task 2: Create mascot-derived favicon files for Next.js file convention
- Removed default Next.js favicon from src/app/
- Generated favicon.ico (16x16), icon.png (32x32), apple-icon.png (180x180) from mascot default pose
- All resizes use `kernel: 'nearest'` (nearest-neighbor) to maintain pixel-art crispness
- Verified public/favicon.ico does not exist (prevents precedence conflict)
- Build passes with new favicon files detected by Next.js file convention
- **Commit:** 1b9aced

### Task 3: Visual verification checkpoint
- User verified mascot assets render correctly in browser
- Favicon appears as pixel-art cat in browser tab (not default Next.js triangle)
- All 4 poses display as distinct pixel-art images at /mascot/*.png
- **Status:** Approved

## Deviations from Plan

None - plan executed exactly as written.

## Decisions Made

1. **Programmatic placeholder generation**: Used sharp to generate pixel-art cat silhouettes programmatically rather than requiring external art assets. These are functional placeholders that can be replaced with AI-generated or hand-drawn pixel art later.
2. **PNG-as-ICO approach**: Stored a 16x16 PNG file renamed to favicon.ico since Next.js serves it with correct MIME type, avoiding the need for ICO format conversion libraries.
3. **Nearest-neighbor resize for all favicon sizes**: Used `sharp.resize({ kernel: 'nearest' })` consistently to prevent blurring when scaling pixel art to different favicon sizes.

## Key Artifacts

| File | Purpose |
|------|---------|
| `src/components/ui/MascotImage.tsx` | Reusable mascot component with pose selection and crisp pixel-art rendering |
| `public/mascot/mascot-*.png` | 4 pixel-art mascot poses at 64x64 base resolution |
| `src/app/favicon.ico` | 16x16 mascot-derived browser tab icon |
| `src/app/icon.png` | 32x32 mascot-derived icon |
| `src/app/apple-icon.png` | 180x180 mascot-derived Apple touch icon |
| `scripts/generate-mascot-placeholders.mjs` | Reproducible mascot generation script |
| `scripts/generate-favicons.mjs` | Reproducible favicon generation script |

## Known Stubs

None. All mascot assets are functional PNGs with visible pixel-art content. The placeholders are intentionally simple but fully rendered -- they can be replaced with higher-quality art in the future without any code changes.

## Self-Check: PASSED

All 10 created files verified on disk. Both task commits (0bd5bac, 1b9aced) verified in git history.
