# AquaClaw.ai

## What This Is

AquaClaw.ai is an English-language website showcasing an autonomous AI agent that independently operates the site — creating content, managing tasks, and demonstrating AI capabilities to the general public. Built with Next.js 16, Tailwind CSS v4, and a Bold & Playful design system featuring a pixel-art Garfield-style cat mascot. The site is operated by OpenClaw, which publishes content autonomously via MDX files and ISR revalidation.

## Core Value

Demonstrate to the general public how an autonomous AI agent can independently run a website — making AI approachable, entertaining, and tangible through daily logs, articles, and interactive skill showcases.

## Requirements

### Validated

- ✓ Homepage with hero section, animated stats, diary carousel, value proposition grid, and featured content — v1.0
- ✓ Diary/Log section — daily entries in first-person cat persona with card grid and pagination — v1.0
- ✓ Articles section — technical guides with syntax-highlighted code blocks — v1.0
- ✓ Science/Education section — explainers with difficulty badges and Further Reading — v1.0
- ✓ Skill Packs section — browsable catalog with client-side category filtering and download CTAs — v1.0
- ✓ OpenClaw/EasyClaw promotion — dedicated download section + tutorials — v1.0
- ✓ Pixel-art light brown Garfield-style cat mascot integrated throughout the site — v1.0
- ✓ Bold & Playful UI — warm colors, rounded shapes, bouncy animations, Fredoka/Nunito/Geist Mono fonts — v1.0
- ✓ Fixed top navigation bar with logo, main links, and mobile hamburger menu — v1.0
- ✓ Comprehensive footer with sitemap — v1.0
- ✓ Giscus comment system on diary and article pages — v1.0
- ✓ Responsive design (mobile + desktop) — v1.0
- ✓ i18n architecture — English first with `[lang]` routing, supports adding languages — v1.0
- ✓ SEO optimized — generateMetadata per page, sitemap, robots.txt, RSS feeds — v1.0
- ✓ ISR revalidation webhook for OpenClaw autonomous publishing — v1.0
- ✓ Zod schema validation for content frontmatter — v1.0
- ✓ Lighthouse mobile ≥90 (P:95 A:100 BP:100 SEO:100) — v1.0

### Active

(None — v1.0 shipped, next milestone TBD)

### Out of Scope

- User authentication / login system — all content is public; auth adds GDPR obligations
- Payment processing — skill packs are free downloads for v1
- Real-time chat — high complexity, not core to showcase value
- Video hosting — defer to external platforms (YouTube embeds if needed)
- CMS admin panel — OpenClaw manages content autonomously
- Dark mode toggle — uses `prefers-color-scheme` for automatic system-level only
- Full-text site search — defer until content volume justifies it

## Context

- **v1.0 shipped:** 2026-04-02 — 11 phases, 24 plans, 7,295 LOC (TypeScript/TSX/MDX/CSS)
- **Tech stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, MDX with gray-matter + Zod validation
- **Content:** 5 diary entries, 5 articles, 5 science explainers, 5 skill packs — all in cat persona or approachable style
- **Engagement:** Giscus comments (GitHub Discussions-backed), 3 RSS feeds (diary/articles/science)
- **Automation:** ISR webhook at `/api/revalidate` with Bearer token auth — OpenClaw can publish by writing MDX and calling the webhook
- **Reference site:** sanwan.ai — Chinese AI agent showcase. AquaClaw differentiates with English-only, Bold & Playful design, pixel-art cat mascot
- **Mascot:** Light brown Garfield-style cat in pixel art — 4 poses (default, waving, thinking, sleeping), used as hero element, nav logo, placeholder thumbnails, 404 page, footer decoration

## Constraints

- **Language**: English-first with i18n-ready architecture — must support future language additions without major refactoring
- **Automation-ready**: Content structure compatible with OpenClaw automated operation — structured MDX with Zod validation, clear content directories
- **Performance**: Lighthouse mobile ≥90 — static generation with ISR for content updates
- **SEO**: Content-heavy site targeting general public — per-page metadata, sitemap, RSS feeds

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| English-only launch with i18n architecture | Target western audience first, expand later | ✓ Good — `[lang]` routing works, only `en` dictionary needed |
| Bold & Playful UI style | Differentiate from sanwan.ai's sketch aesthetic | ✓ Good — warm colors + Fredoka + heavy rounding is distinctive |
| Pixel-art Garfield cat mascot | Unique branding, fits playful style | ✓ Good — 4 poses used across entire site |
| Next.js 16 App Router + Tailwind v4 | Modern stack, ISR support, CSS-first config | ✓ Good — App Router patterns worked well |
| MDX + filesystem content (no CMS) | OpenClaw writes files directly | ✓ Good — simple, automation-compatible |
| Giscus for comments | Zero backend, GitHub Discussions-backed | ✓ Good — no spam management needed |
| CSS-only animations (no motion library) | Lighter, respects prefers-reduced-motion | ✓ Good — bounce-in/float/pop cover all needs |
| Server components by default | Client JS only where needed (carousel, filters, stats) | ✓ Good — minimal client bundle |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-02 after v1.0 milestone completion — all 11 phases shipped*
