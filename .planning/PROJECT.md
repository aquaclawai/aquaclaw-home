# AquaClaw.ai

## What This Is

AquaClaw.ai is an English-language website showcasing an autonomous AI agent that independently operates the site — creating content, managing tasks, and demonstrating AI capabilities to the general public. Modeled after sanwan.ai's structure and content approach, but with a western-style Bold & Playful UI and a pixel-art Garfield-style cat mascot. The site will eventually be operated by OpenClaw automatically.

## Core Value

Demonstrate to the general public how an autonomous AI agent can independently run a website — making AI approachable, entertaining, and tangible through daily logs, articles, and interactive skill showcases.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Homepage with hero section, stats, featured diary entries, and value proposition grid
- [ ] Diary/Log section — daily entries documenting the AI agent's autonomous activities
- [ ] Articles section — technical guides and content pieces
- [ ] Science/Education section — explainers about AI capabilities
- [ ] Skill Packs section — marketplace/browser for AI agent skill bundles
- [ ] OpenClaw/EasyClaw promotion — dedicated download section + tutorials (mirrors sanwan.ai approach)
- [ ] Pixel-art light brown Garfield-style cat mascot integrated throughout the site
- [ ] Bold & Playful UI — bright colors, rounded shapes, fun animations
- [ ] Fixed top navigation bar with logo, main links, and mobile hamburger menu
- [ ] Comprehensive footer with sitemap
- [ ] Comment/feedback system
- [ ] Responsive design (mobile + desktop)
- [ ] i18n architecture — English first, supports adding languages later
- [ ] SEO optimized for content discoverability

### Out of Scope

- User authentication / login system — not needed for v1, content is public
- Payment processing — skill packs are free downloads for v1
- Real-time chat — high complexity, not core to showcase value
- Video hosting — defer to external platforms (YouTube embeds if needed)
- CMS admin panel — OpenClaw will manage content automatically

## Context

- **Reference site:** sanwan.ai — Chinese AI agent showcase site with hand-drawn sketch aesthetic, lobster mascot, diary entries, articles, science explainers, skill marketplace, and OpenClaw framework promotion
- **Differentiation:** English-only, western Bold & Playful design (think Notion/Figma vibes), pixel-art cat mascot instead of sketch-style lobster
- **Automation:** Site will be operated by OpenClaw — content creation, publishing, and management will be autonomous. The build should support this (e.g., content stored in structured formats, clear content APIs/paths)
- **Content structure mirrors sanwan.ai:** Diary carousel on homepage, article cards, science explainer cards, skill pack browser with filtering, stats counters with animations
- **Mascot:** Light brown Garfield-style cat in pixel art — used as floating element, favicon, branding throughout

## Constraints

- **Language**: English-first with i18n-ready architecture — must support future language additions without major refactoring
- **Automation-ready**: Content structure must be compatible with OpenClaw automated operation — structured markdown/JSON content, clear content directories
- **Performance**: Fast loading for general public audience — static generation preferred where possible
- **SEO**: Content-heavy site targeting general public — needs strong SEO fundamentals (meta tags, structured data, sitemap)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| English-only launch with i18n architecture | Target western audience first, expand later | — Pending |
| Bold & Playful UI style | Differentiate from sanwan.ai's sketch aesthetic, appeal to western general public | — Pending |
| Pixel-art Garfield cat mascot | Unique branding, fits playful style, distinguishes from sanwan's lobster | — Pending |
| Mirror sanwan.ai's OpenClaw promotion level | Proven approach — download section + tutorials | — Pending |
| Tech stack TBD via research | Let research determine best framework for content-heavy, i18n-ready, SEO-optimized site | — Pending |

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
*Last updated: 2026-03-30 after Phase 02 (Design System) completion — Tailwind v4 tokens, font loading, mascot assets, and design-system demo page established*
