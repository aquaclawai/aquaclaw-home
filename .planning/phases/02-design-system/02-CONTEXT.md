# Phase 2: Design System - Context

**Gathered:** 2026-03-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish the complete visual design system for AquaClaw.ai's Bold & Playful aesthetic: Tailwind v4 color tokens, typography scale with font pairing, pixel-art mascot rendering rules (with AI-generated assets), animation performance rules, and responsive breakpoints. All subsequent phases build on these tokens and components.

</domain>

<decisions>
## Implementation Decisions

### Color Palette
- **D-01:** Warm & vibrant color temperature — orange, coral, golden yellow as primary tones. Energetic and approachable, matching the Garfield-style cat mascot.
- **D-02:** Warm off-white background (cream/ivory) — softer than pure white, complements warm palette.
- **D-03:** Heavy rounding — pill-shaped buttons, 16px+ border-radius on cards. Maximally playful, Notion/Figma vibes.

### Claude's Discretion (Color)
- **D-04:** Number of accent colors (1-4) — Claude picks what creates the most cohesive system. A teal/blue contrast accent is a natural complement to warm primaries.

### Typography & Fonts
- **D-05:** Playful display font for headings (e.g., Fredoka, Nunito, Baloo) — reinforces Bold & Playful identity. Research should identify the best option.
- **D-06:** Rounded sans-serif for body text (e.g., Nunito, Inter) — warmer than Geist Sans, pairs with playful headings.

### Claude's Discretion (Typography)
- **D-07:** Monospace font for code blocks — Claude picks what pairs best with heading/body fonts. Geist Mono is an option but not locked.

### Mascot Assets & Rendering
- **D-08:** Generate mascot pixel art with AI tools during this phase — no pre-existing assets.
- **D-09:** 64x64 pixel grid base — allows finer detail while still reading as pixel art. Scales to 128, 256 for larger uses.
- **D-10:** 3-4 poses for v1 — default standing, waving/greeting, thinking, and sleeping. Covers nav, hero, 404, and loading states.
- **D-11:** Mascot must render crisp on HiDPI/Retina using `image-rendering: pixelated` — no blurring from browser upscaling.
- **D-12:** Favicon derived from the mascot — pixel-art cat head at standard favicon sizes (16x16, 32x32, apple-touch-icon).

### Animation Personality
- **D-13:** Bouncy & springy motion — elastic easing, overshoot on hover, playful bounce on entry. Matches Bold & Playful identity.
- **D-14:** Subtle idle animation on mascot — gentle floating/bobbing when visible. CSS-only with transform/opacity per BRAN-06 constraint.
- **D-15:** Key moments only for motion — page transitions, card hovers, scroll-into-view on hero/stats. Not every element. Respects `prefers-reduced-motion`.
- **D-16:** CSS-only animations — `transform` and `opacity` only, no JS animation loops (BRAN-06 requirement).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Foundation
- `.planning/REQUIREMENTS.md` — BRAN-01 through BRAN-06 define all design system requirements
- `.planning/ROADMAP.md` §Phase 2 — success criteria and dependency chain
- `src/app/globals.css` — existing Tailwind v4 `@theme inline` tokens (must be extended, not replaced)
- `src/app/layout.tsx` — root layout with current font configuration (must be updated for new fonts)

### Technology
- `CLAUDE.md` §Technology Stack — Tailwind CSS v4.2 with CSS-first config, motion library for animations, @tailwindcss/typography for prose

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app/globals.css` — Tailwind v4 `@theme inline` block with basic background/foreground tokens. Extend with full color palette, typography scale, and animation tokens.
- `src/app/layout.tsx` — Root layout currently loads Geist Sans/Mono via next/font. Will need updating for new font pairing.

### Established Patterns
- CSS-first Tailwind v4 config (no `tailwind.config.js`) — all tokens defined in `@theme inline` blocks
- `src/` directory structure with `@/*` path alias
- `prefers-color-scheme` dark mode (automatic, no toggle)

### Integration Points
- `globals.css` is the single source of truth for design tokens — all subsequent phases import from here
- `layout.tsx` root layout wraps all pages — font loading happens here
- Mascot assets will live in `public/` for static serving via `next/image` with `unoptimized={true}` for pixel art

</code_context>

<specifics>
## Specific Ideas

- Garfield-style cat in pixel art — light brown, chunky, expressive. Think retro game sprite meets lazy cat personality.
- Bold & Playful means Notion/Figma energy — bright but not garish, rounded but structured, playful but professional enough for a general public audience.
- Warm off-white + warm primaries should feel like a sunny, inviting website — not a children's site, but approachable.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-design-system*
*Context gathered: 2026-03-29*
