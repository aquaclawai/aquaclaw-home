# Phase 3: Navigation Shell - Context

**Gathered:** 2026-03-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the complete site-wide navigation shell — fixed header with logo and nav links, full-screen mobile menu overlay, footer with sitemap/social/newsletter, and a custom 404 page with mascot. Every page gets this shell so visitors can always find their way.

</domain>

<decisions>
## Implementation Decisions

### Header Layout & Branding
- **D-01:** Logo area is mascot + text — pixel-art cat (default pose, ~24px) beside "AquaClaw.ai" in Fredoka display font. Links to homepage.
- **D-02:** Nav links: Diary, Articles, Science, Skills, OpenClaw — in Nunito body font.
- **D-03:** Always solid background (cream in light mode, dark in dark mode) — no transparent hero overlay.
- **D-04:** Fixed/sticky header visible on all pages via `[lang]/layout.tsx`.

### Mobile Menu Behavior
- **D-05:** Full-screen overlay on mobile — covers entire viewport with warm background color.
- **D-06:** Bouncy/springy entry animation (CSS-only, matches D-13/D-16 from Phase 2).
- **D-07:** Close via X button or tapping outside. Hamburger icon triggers open.
- **D-08:** Waving mascot at bottom of overlay as decorative element.
- **D-09:** Breakpoint: hamburger on mobile, inline links on desktop. Claude decides exact breakpoint.

### Footer Content & Structure
- **D-10:** Footer includes: sitemap links (all 5 sections), social icons, sleeping mascot cameo, newsletter signup placeholder.
- **D-11:** Social icons: GitHub, Twitter/X, Discord — with external link indicators.
- **D-12:** Newsletter signup is a placeholder/non-functional input for v1 — visual only, no backend.
- **D-13:** Copyright text: "© {year} AquaClaw.ai" with current year.

### 404 Page
- **D-14:** Playful & punny tone — thinking mascot pose with humorous AI-themed message (e.g., "Hmm, even an AI can't find this page...").
- **D-15:** Multiple navigation options — Home button plus 2-3 section links (Diary, Articles) to help visitors discover content.
- **D-16:** Bounce-in animation on mascot and message using existing design tokens.

### Claude's Discretion
- Active nav link indicator style (underline, pill, or hybrid)
- Header separation style (shadow vs border)
- Footer column layout and spacing
- Exact mobile breakpoint for hamburger/inline transition
- 404 page exact copy and section links
- Newsletter placeholder design (input + button styling)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design System
- `src/app/globals.css` — All design tokens: colors, typography, radius, animations
- `src/app/layout.tsx` — Root layout with font loading (Fredoka, Nunito, Geist Mono)
- `src/components/ui/MascotImage.tsx` — Reusable mascot component with pose prop

### Project Foundation
- `.planning/REQUIREMENTS.md` — NAV-01 through NAV-04 define navigation requirements
- `.planning/ROADMAP.md` §Phase 3 — success criteria and dependency chain
- `src/app/[lang]/layout.tsx` — Locale layout wrapper where nav shell components go

### i18n
- `src/lib/i18n/getDictionary.ts` — Dictionary loading for externalized UI strings

### Prior Context
- `.planning/phases/01-foundation/01-CONTEXT.md` — D-12 through D-14: i18n architecture decisions
- `.planning/phases/02-design-system/02-CONTEXT.md` — D-01 through D-16: all visual design decisions

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `MascotImage` component (`src/components/ui/MascotImage.tsx`) — supports pose prop (default, waving, thinking, sleeping), unoptimized for pixel-art crispness
- Design tokens in `globals.css` — primary orange, secondary golden, accent coral, contrast teal, bounce-in/float/pop animations, radius scale
- Fredoka (display), Nunito (body), Geist Mono (code) fonts loaded as CSS variables

### Established Patterns
- CSS-first Tailwind v4 with `@theme inline` tokens — no tailwind.config.js
- `prefers-color-scheme` dark mode (automatic, no toggle)
- `prefers-reduced-motion` disables all animations
- `[lang]/layout.tsx` wraps all locale routes — nav shell components go here
- All UI strings must be externalized into JSON dictionaries (D-14 from Phase 1)

### Integration Points
- `src/app/[lang]/layout.tsx` — Header and Footer components wrap `{children}` here
- `src/app/not-found.tsx` — Next.js file convention for 404 page (does not exist yet)
- `src/lib/i18n/getDictionary.ts` — provides translated strings for nav labels

</code_context>

<specifics>
## Specific Ideas

- Mascot appears in 3 navigation contexts: logo area (default pose ~24px), mobile menu (waving pose at bottom), 404 page (thinking pose, centered)
- Footer mascot uses sleeping pose as a "end of page" personality touch
- 404 copy should be AI-themed and punny — the cat mascot "looked everywhere" but couldn't find the page
- Newsletter signup is visual placeholder only — no form submission backend needed for v1

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-navigation-shell*
*Context gathered: 2026-03-30*
