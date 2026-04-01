# Phase 8: Homepage - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the homepage — the site's front door that converts curiosity into engagement. 5 distinct sections: hero with CTA, animated stats counter, diary entry carousel, value proposition grid, and featured content from articles/science/skill packs. All content sections (Phases 4-7) are complete, so the homepage can pull real data.

</domain>

<decisions>
## Implementation Decisions

### Hero Section (HOME-01)
- **D-01:** Hero with tagline, sub-copy explaining the AI agent concept, and a visible CTA button.

### Animated Stats Counter (HOME-02)
- **D-02:** Stats section with animated count-up triggered on scroll — shows diary entries written, articles published, skill packs released. Counts derived from actual content at build time.

### Diary Carousel (HOME-03)
- **D-03:** Diary entry carousel with auto-scrolling recent entries and manual prev/next controls. Uses `'use client'` for interactivity.

### Value Proposition Grid (HOME-04)
- **D-04:** 4-section grid explaining AI agent capabilities in plain language.

### Featured Content (HOME-05)
- **D-05:** Featured content sections pulling latest entries from articles, science, and skill packs. Links to respective listing pages.

### Claude's Discretion
- Hero tagline and sub-copy text
- CTA button text and destination (e.g., "Explore the Diary" → /diary, or "Meet the Agent" → scroll to value props)
- Mascot placement and pose in hero (waving? default?)
- Hero layout (centered, split with mascot, asymmetric)
- Stats counter animation library or CSS approach (motion library or Intersection Observer + CSS)
- Stat categories and labels
- Carousel implementation (CSS scroll-snap, custom, or library)
- Carousel card count visible at once
- Auto-scroll interval and pause behavior
- Value proposition 4 topics (e.g., Content Creation, Task Automation, Learning, Skill Development)
- Value prop icons/illustrations (mascot poses? emoji? abstract icons?)
- Featured content section layout (horizontal cards, small grid, list)
- How many featured items per section (2-3?)
- Overall homepage section ordering (hero → stats → carousel → value props → featured, or variation)
- Section spacing, backgrounds, visual rhythm
- Scroll animations (bounce-in on sections as they enter viewport)
- Dictionary keys for all homepage text

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/content/diary.ts` — `getDiaryEntries()` for carousel and stats count
- `lib/content/articles.ts` — `getArticleEntries()` for featured articles and stats
- `lib/content/science.ts` — `getScienceEntries()` for featured science and stats
- `lib/content/skills.ts` — `getSkillEntries()` for featured skills and stats
- `src/components/diary/DiaryCard.tsx` — Card component for carousel items
- `src/components/articles/ArticleCard.tsx` — Card for featured articles
- `src/components/science/ScienceCard.tsx` — Card for featured science
- `src/components/skills/SkillCard.tsx` — Card for featured skills
- `src/components/ui/MascotImage.tsx` — Mascot for hero section
- `src/app/globals.css` — Full design token system with bounce-in, float, pop animations
- `motion` library available (installed) for scroll-triggered animations

### Established Patterns
- Server components by default, `'use client'` only for interactivity (carousel, counter)
- Dictionary-driven UI strings
- `generateMetadata()` for SEO
- Bold & Playful aesthetic: warm colors, heavy rounding, Fredoka headings, Nunito body

### Integration Points
- Homepage route: `src/app/[lang]/page.tsx` (likely exists as a placeholder — needs full implementation)
- All content getter functions return real data now (5 diary, 5 articles, 5 science, 5 skills)
- Navigation: homepage is root `/[lang]/` — already linked from logo in header

</code_context>

<specifics>
## Specific Ideas

- Homepage is modeled after sanwan.ai's approach: hero → stats → diary carousel → value props → featured content
- The page should prove that an AI agent actually runs this site — stats and diary carousel are the "proof"
- Bold & Playful aesthetic at its most expressive here — this is the showcase page
- Content reference: sanwan.ai has a similar structure with hand-drawn aesthetic; AquaClaw uses pixel-art cat and warm colors instead

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 08-homepage*
*Context gathered: 2026-04-01*
