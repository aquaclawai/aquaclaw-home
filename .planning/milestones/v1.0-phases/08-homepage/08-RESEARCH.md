# Phase 08: Homepage - Research

**Researched:** 2026-04-01
**Domain:** Next.js App Router homepage — interactive sections, scroll animations, carousel, content aggregation
**Confidence:** HIGH (codebase-grounded — all patterns verified from existing source files)

## Summary

Phase 08 builds the homepage — the site's front door — as a single route at `src/app/[lang]/page.tsx`. This route currently holds a two-line placeholder. The full implementation requires 5 distinct sections: hero with mascot and CTA, animated stats counter, diary entry carousel, value proposition grid, and featured content from articles/science/skills. All upstream content sections (Phases 4–7) are complete, so real content is available from four getter functions.

The key architectural split is server vs. client. The homepage server component fetches all content data at build time and passes serializable props down to two client islands: the `DiaryCarousel` (auto-scroll + manual controls = state required) and a `StatsCounter` (Intersection Observer + count-up animation = DOM-dependent). The hero, value prop grid, and featured content sections are pure server components using existing CSS animations from `globals.css`. The `motion` library is **not installed** — the CLAUDE.md lists it as planned but `package.json` confirms it is absent. All animations must use the existing CSS animation tokens (`animate-bounce-in`, `animate-float`, `animate-pop`) plus Tailwind transitions.

**Primary recommendation:** Build the homepage as a server component orchestrator that passes sliced content arrays as props to two thin client islands (`DiaryCarousel` and `StatsCounter`). Keep the hero, value props, and featured sections as server-rendered HTML with CSS-only animations.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Hero with tagline, sub-copy explaining the AI agent concept, and a visible CTA button.
- **D-02:** Stats section with animated count-up triggered on scroll — shows diary entries written, articles published, skill packs released. Counts derived from actual content at build time.
- **D-03:** Diary entry carousel with auto-scrolling recent entries and manual prev/next controls. Uses `'use client'` for interactivity.
- **D-04:** 4-section grid explaining AI agent capabilities in plain language.
- **D-05:** Featured content sections pulling latest entries from articles, science, and skill packs. Links to respective listing pages.

### Claude's Discretion
- Hero tagline and sub-copy text
- CTA button text and destination
- Mascot placement and pose in hero
- Hero layout (centered, split with mascot, asymmetric)
- Stats counter animation approach (Intersection Observer + CSS, since `motion` is not installed)
- Stat categories and labels
- Carousel implementation (CSS scroll-snap recommended)
- Carousel card count visible at once
- Auto-scroll interval and pause behavior
- Value proposition 4 topics
- Value prop icons/illustrations
- Featured content section layout
- How many featured items per section (2–3)
- Overall homepage section ordering
- Section spacing, backgrounds, visual rhythm
- Scroll animations (CSS-only, using existing globals.css tokens)
- Dictionary keys for all homepage text

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| HOME-01 | Hero section with tagline, sub-copy, and CTA | `MascotImage` component + `animate-float` CSS token available; CTA links to `/${lang}/diary` or scroll anchor; `generateMetadata()` pattern established |
| HOME-02 | Animated stats counter — diary/articles/skill packs count-up on scroll | Counts from `getDiaryEntries().length`, `getArticleEntries().length`, `getSkillEntries().length` at build time; Intersection Observer API handles scroll trigger; CSS counter increment or `requestAnimationFrame` loop in client component; `motion` library NOT installed |
| HOME-03 | Diary entry carousel — auto-scrolling recent entries with manual prev/next controls | `getDiaryEntries()` returns newest-first array; `DiaryCard` component exists and is reusable; CSS scroll-snap is the zero-dependency approach; requires `'use client'` for `useState`/`useEffect` |
| HOME-04 | Value proposition grid — 4 sections explaining AI agent capabilities | Pure server component; Tailwind grid layout; no external library needed |
| HOME-05 | Featured content sections pulling latest from articles, science, skill packs | `getArticleEntries()`, `getScienceEntries()`, `getSkillEntries()` all available; existing card components (`ArticleCard`, `ScienceCard`, `SkillCard`) accept `entry` + `lang` props; slice first 3 from each |
</phase_requirements>

---

## Standard Stack

### Core (already installed — no new installs needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js App Router | 16.2.1 | Page routing + SSG | `src/app/[lang]/page.tsx` is the homepage route |
| React | 19.2.4 | UI components | App Router default; Server Components for data, Client Components for interactivity |
| TypeScript | 5.x | Type safety | All existing components are typed |
| Tailwind CSS | 4.x | Styling | All existing components use Tailwind utilities + design tokens from `globals.css` |
| Vitest | 4.1.2 | Testing | Established test framework; `vitest.config.ts` present; `npm test` runs suite |

### Critical Discovery: motion NOT installed

`package.json` has no `motion` or `framer-motion` dependency. CLAUDE.md lists it as planned but it was never installed. The codebase uses **pure CSS animations** exclusively:

- `animate-bounce-in` — element entrance (opacity 0→1, scale 0.8→1)
- `animate-float` — mascot hover float (translateY oscillation, 3s loop)
- `animate-pop` — button press feedback (scale pulse)
- Tailwind `transition-*` utilities for hover state changes

**Consequence for HOME-02 (stats counter):** Must use Intersection Observer API + `requestAnimationFrame` in a `'use client'` component. Cannot use `motion`'s `useMotionValue` or `useSpring`.

**Consequence for section scroll animations:** Must use `animate-bounce-in` CSS class (one-shot, triggered on mount) or Intersection Observer to add a class on scroll. Cannot use `motion`'s `whileInView`.

### Reusable Components (already exist)

| Component | File | Props | Used In |
|-----------|------|-------|---------|
| `DiaryCard` | `src/components/diary/DiaryCard.tsx` | `entry: DiaryEntry, lang: string` | Carousel slides |
| `ArticleCard` | `src/components/articles/ArticleCard.tsx` | `entry: ArticleEntry, lang: string` | Featured articles |
| `ScienceCard` | `src/components/science/ScienceCard.tsx` | `entry: ScienceEntry, lang: string, dict.difficulty` | Featured science |
| `SkillCard` | `src/components/skills/SkillCard.tsx` | `entry: SkillEntry, lang: string` | Featured skills |
| `MascotImage` | `src/components/ui/MascotImage.tsx` | `pose, size, className, alt` | Hero section |

### Content Getter Functions (server-only)

| Function | File | Returns | Note |
|----------|------|---------|------|
| `getDiaryEntries()` | `lib/content/diary.ts` | `DiaryEntry[]` newest-first | Has `dayNumber` |
| `getArticleEntries()` | `lib/content/articles.ts` | `ArticleEntry[]` newest-first | Slug hash for pose |
| `getScienceEntries()` | `lib/content/science.ts` | `ScienceEntry[]` newest-first | Has `difficulty` |
| `getSkillEntries()` | `lib/content/skills.ts` | `SkillEntry[]` newest-first | Has `category`, `downloadUrl` |

All four use `import 'server-only'` — they cannot be called from `'use client'` components. Data must be fetched in the Server Component and passed as serializable props.

---

## Architecture Patterns

### Recommended Component Structure

```
src/
├── app/[lang]/page.tsx              # Server Component orchestrator (REPLACE placeholder)
└── components/
    └── home/
        ├── HeroSection.tsx          # Server Component
        ├── StatsCounter.tsx         # 'use client' — Intersection Observer + rAF count-up
        ├── DiaryCarousel.tsx        # 'use client' — useState for current index, useEffect for auto-scroll
        ├── ValuePropGrid.tsx        # Server Component
        └── FeaturedContent.tsx      # Server Component
```

### Pattern 1: Server Orchestrator + Client Islands

The `src/app/[lang]/page.tsx` server component fetches all data and passes serializable slices to client islands.

```typescript
// src/app/[lang]/page.tsx — simplified structure
export const revalidate = 3600

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  // All content fetching happens server-side
  const diaryEntries = getDiaryEntries().slice(0, 6)  // carousel needs ~6
  const diaryCount = getDiaryEntries().length
  const articleEntries = getArticleEntries().slice(0, 3)
  const articleCount = getArticleEntries().length
  const scienceEntries = getScienceEntries().slice(0, 3)
  const skillEntries = getSkillEntries().slice(0, 3)
  const skillCount = getSkillEntries().length

  return (
    <main>
      <HeroSection lang={lang} dict={dict} />
      <StatsCounter              {/* 'use client' */}
        diaryCount={diaryCount}
        articleCount={articleCount}
        skillCount={skillCount}
        dict={dict.home.stats}
      />
      <DiaryCarousel             {/* 'use client' */}
        entries={diaryEntries}
        lang={lang}
        dict={dict.home.carousel}
      />
      <ValuePropGrid dict={dict.home.valueProp} />
      <FeaturedContent
        articles={articleEntries}
        science={scienceEntries}
        skills={skillEntries}
        lang={lang}
        dict={dict}
      />
    </main>
  )
}
```

**Performance note:** `getDiaryEntries()` is called twice (once for slice, once for length). De-duplicate by calling once and measuring `.length` before slicing:

```typescript
const allDiary = getDiaryEntries()
const diaryCount = allDiary.length
const diaryEntries = allDiary.slice(0, 6)
```

### Pattern 2: StatsCounter — Intersection Observer + requestAnimationFrame

No `motion` available. Use the browser-native `IntersectionObserver` API to detect when the stats section enters the viewport, then animate with `requestAnimationFrame`.

```typescript
// src/components/home/StatsCounter.tsx
'use client'

import { useEffect, useRef, useState } from 'react'

function useCountUp(target: number, duration = 1500, triggered: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!triggered) return
    const start = performance.now()
    function step(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [triggered, target, duration])
  return count
}

export function StatsCounter({ diaryCount, articleCount, skillCount, dict }) {
  const ref = useRef<HTMLDivElement>(null)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) setTriggered(true) },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const diary = useCountUp(diaryCount, 1500, triggered)
  const articles = useCountUp(articleCount, 1500, triggered)
  const skills = useCountUp(skillCount, 1500, triggered)

  return (
    <section ref={ref}>
      {/* render diary, articles, skills counts */}
    </section>
  )
}
```

**prefers-reduced-motion:** `globals.css` already applies `animation-duration: 0.01ms` globally. The `requestAnimationFrame` loop does NOT respect this. Must add a manual check:

```typescript
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (prefersReduced) { setCount(target); return }
```

### Pattern 3: DiaryCarousel — CSS Scroll-Snap + useState

No library needed. CSS scroll-snap provides smooth swipe behavior. JavaScript manages the auto-scroll timer and prev/next controls.

```typescript
// src/components/home/DiaryCarousel.tsx
'use client'

import { useEffect, useRef, useState } from 'react'

export function DiaryCarousel({ entries, lang, dict }) {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const advance = () => setCurrent((c) => (c + 1) % entries.length)
  const retreat = () => setCurrent((c) => (c - 1 + entries.length) % entries.length)

  useEffect(() => {
    timerRef.current = setInterval(advance, 4000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  // Pause on hover
  const pause = () => { if (timerRef.current) clearInterval(timerRef.current) }
  const resume = () => { timerRef.current = setInterval(advance, 4000) }

  return (
    <section onMouseEnter={pause} onMouseLeave={resume}>
      {/* Carousel viewport */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {entries.map((entry) => (
            <div key={entry.slug} className="min-w-full">
              <DiaryCard entry={entry} lang={lang} />
            </div>
          ))}
        </div>
      </div>
      {/* Prev/Next controls */}
      <button onClick={retreat}>{dict.prev}</button>
      <button onClick={advance}>{dict.next}</button>
      {/* Dot indicators */}
    </section>
  )
}
```

**Note on multiple cards visible:** The above shows one card at a time (100% width). To show 2–3 cards on desktop, change `min-w-full` to `min-w-[calc(100%/N)]` and adjust the transform calculation. Simplest approach for v1: show 1 card on mobile, 2 on tablet (`min-w-[50%]` at md breakpoint), 3 on desktop (`min-w-[33.33%]` at lg).

### Pattern 4: ScienceCard dict prop requirement

`ScienceCard` requires a `dict` prop with `difficulty` object (`{ beginner, intermediate, advanced }`). When passing science entries to `FeaturedContent`, the parent must thread the science dict through:

```typescript
// In FeaturedContent.tsx — must pass dict.science to ScienceCard
<ScienceCard entry={entry} lang={lang} dict={{ difficulty: dict.science.difficulty }} />
```

This is the only card component with a dict dependency (DiaryCard and ArticleCard do not need dict).

### Pattern 5: Dictionary Extension

The `dictionaries/en.json` has no `home` key. It must be added before the homepage renders. This is **always Wave 0 work** — the page will fail to compile if it references `dict.home.*` without the key.

Required new dict structure:
```json
{
  "home": {
    "hero": {
      "tagline": "An AI Agent Runs This Website",
      "subCopy": "Every post written, every article published — by an autonomous AI. Watch it happen in real time.",
      "ctaLabel": "Explore the Diary",
      "mascotAlt": "AquaClaw mascot — waving hello"
    },
    "stats": {
      "diaryLabel": "Diary Entries",
      "articlesLabel": "Articles Published",
      "skillsLabel": "Skill Packs Released",
      "heading": "What the Agent Has Done"
    },
    "carousel": {
      "heading": "Latest Diary Entries",
      "prev": "Previous",
      "next": "Next",
      "viewAll": "View All Entries"
    },
    "valueProp": {
      "heading": "What Can an AI Agent Do?",
      "items": [
        { "title": "Content Creation", "body": "Writes daily diary logs, articles, and science explainers from scratch." },
        { "title": "Task Automation", "body": "Runs scheduled jobs, updates files, and manages site tasks without human intervention." },
        { "title": "Skill Building", "body": "Packages AI capabilities into reusable skill packs for download." },
        { "title": "Learning in Public", "body": "Documents every action so you can see exactly how an AI thinks and works." }
      ]
    },
    "featured": {
      "articlesHeading": "Latest Articles",
      "scienceHeading": "Latest Science",
      "skillsHeading": "Latest Skill Packs",
      "viewAllArticles": "View All Articles",
      "viewAllScience": "View All Science",
      "viewAllSkills": "View All Skill Packs"
    }
  }
}
```

### Anti-Patterns to Avoid

- **Calling content getters in client components:** All four getter functions use `import 'server-only'`. Calling them inside `'use client'` components will throw at build time. Always fetch server-side and pass as props.
- **Using `motion` library:** It is not installed. Any `import { motion } from 'motion/react'` will cause a module-not-found error.
- **Calling `getDiaryEntries()` multiple times without memoization:** Each call re-reads the filesystem. Call once, store result, derive both length and slice from it.
- **Float animation on the mascot inside the carousel:** `animate-float` is a `3s infinite` loop. Using it on carousel slides causes visual jitter during slide transitions. Reserve float for the hero mascot only.
- **Hardcoding English text in JSX:** All visible strings must use dict keys. The homepage has no dict keys yet — they must be added in Wave 0.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Card UI for carousel slides | New card component | `DiaryCard` (already exists) | Accepts `entry: DiaryEntry, lang: string` — exact match |
| Card UI for featured sections | New card components | `ArticleCard`, `ScienceCard`, `SkillCard` (already exist) | All accept same prop shape |
| Mascot rendering | `<img>` with inline style | `MascotImage` (already exists) | Handles `unoptimized`, `image-rendering: pixelated`, priority loading |
| CSS animation tokens | Custom keyframes | `animate-bounce-in`, `animate-float`, `animate-pop` from `globals.css` | Already registered in `@theme` block; work with Tailwind utility class syntax |
| Scroll trigger detection | scroll event listener | `IntersectionObserver` API | More performant, fires only on threshold cross |
| Carousel slide management | Complex state machine | Simple `useState(index)` + modulo arithmetic | 5–6 slides max; no virtualization needed |

**Key insight:** The homepage is primarily an aggregation and composition problem, not a build problem. ~80% of the implementation is wiring existing components together with the right data.

---

## Common Pitfalls

### Pitfall 1: ScienceCard dict threading
**What goes wrong:** `FeaturedContent` renders `ScienceCard` without passing the required `dict` prop, causing a TypeScript error or missing difficulty label text.
**Why it happens:** `ScienceCard` is the only card with a required `dict` prop (DiaryCard and ArticleCard don't need one). Easy to miss when building FeaturedContent generically.
**How to avoid:** In `FeaturedContent.tsx`, pass `dict={{ difficulty: dict.science.difficulty }}` to each `ScienceCard`.
**Warning signs:** TypeScript error "Property 'dict' is missing in type".

### Pitfall 2: content getter called in client component
**What goes wrong:** Build fails with "You're importing a component that needs 'server-only'..."
**Why it happens:** Developer moves data fetching into the carousel or stats component for co-location, not realizing the `server-only` guard.
**How to avoid:** Fetch all data in `src/app/[lang]/page.tsx` server component. Pass sliced arrays as props.
**Warning signs:** Build error mentioning `server-only` package.

### Pitfall 3: prefers-reduced-motion not respected in count-up
**What goes wrong:** Users with reduced-motion preference see the counter looping through numbers, which is exactly the type of animation they opted out of.
**Why it happens:** `requestAnimationFrame` loops don't automatically check `prefers-reduced-motion` the way CSS animations do (globals.css handles CSS, not JS).
**How to avoid:** At the start of the count-up `useEffect`, check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and skip to final value if true.
**Warning signs:** Accessibility audit flags motion in non-CSS contexts.

### Pitfall 4: ISR not set on homepage
**What goes wrong:** Homepage uses stale content counts indefinitely after OpenClaw publishes new content.
**Why it happens:** Developer forgets `export const revalidate = 3600` — which is on all listing pages but absent from the current homepage placeholder.
**How to avoid:** Add `export const revalidate = 3600` to `src/app/[lang]/page.tsx`.
**Warning signs:** Stats counter still shows old count after new content is published.

### Pitfall 5: Carousel timer not cleaned up
**What goes wrong:** Memory leak / stale closure after component unmounts (navigation away).
**Why it happens:** `setInterval` in `useEffect` without cleanup function.
**How to avoid:** Always return cleanup from `useEffect`: `return () => clearInterval(timerRef.current)`.

### Pitfall 6: dict.home not in en.json before page references it
**What goes wrong:** TypeScript/runtime error accessing `dict.home.hero.tagline` when the key doesn't exist.
**Why it happens:** `getDictionary()` returns the typed en.json shape; if `home` is absent, TypeScript will error.
**How to avoid:** Add `home` keys to `dictionaries/en.json` in Wave 0 before any component references them.

### Pitfall 7: Importing type from server-only module in 'use client' carousel
**What goes wrong:** Build-time error when `DiaryCarousel.tsx` tries to import the `DiaryEntry` type from `lib/content/diary` (which has `server-only`).
**Why it happens:** Even a type-only import from a module with `server-only` can trigger the guard in some bundler configurations.
**How to avoid:** Use `import type { DiaryEntry }` (type-only import). Pattern established in `SkillFilterGrid.tsx` which uses `import type { SkillEntry }` for exactly this reason.
**Warning signs:** Build error mentioning `server-only` in a `'use client'` file.

---

## Code Examples

### Verified pattern: type-only import from server-only module in client component

```typescript
// Source: src/components/skills/SkillFilterGrid.tsx (established in Phase 07)
'use client'
import type { SkillEntry } from '../../../lib/content/skills'
// ^ "import type" — erased at compile time, does not trigger server-only guard
```

Apply same pattern in `DiaryCarousel.tsx`:
```typescript
'use client'
import type { DiaryEntry } from '../../../lib/content/diary'
```

### Verified pattern: MascotImage with float animation

```typescript
// Source: src/app/[lang]/design-system/page.tsx (established in Phase 02)
<MascotImage pose="waving" size={256} className="animate-float" />
```

For hero section, use `pose="waving"` with `className="animate-float"` wrapped in `animate-bounce-in`:
```tsx
<div className="animate-bounce-in">
  <MascotImage pose="waving" size={192} className="animate-float" alt="AquaClaw mascot" />
</div>
```

### Verified pattern: Server Component with content data + ISR

```typescript
// Source: src/app/[lang]/diary/page.tsx (established in Phase 04)
export const revalidate = 3600

export default async function DiaryPage({ params }: DiaryPageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  const entries = getDiaryEntries()
  // ...
}
```

### Verified pattern: generateMetadata for SEO

```typescript
// Source: src/app/[lang]/diary/page.tsx
export async function generateMetadata({ params }: DiaryPageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.diary.title,
    description: dict.diary.description,
  }
}
```

Homepage uses the same pattern with `dict.home.hero.tagline` and `dict.site.description`.

### Verified pattern: CSS-only section entrance animation

```typescript
// Source: src/app/[lang]/design-system/page.tsx
<div className="animate-bounce-in">
  {/* Section content */}
</div>
```

For staggered entrance, wrap each section div in `animate-bounce-in`. Note: this fires on mount, not on scroll. For scroll-triggered entrance, use Intersection Observer to add the class dynamically.

### Verified pattern: existing card components

```typescript
// Source: src/app/[lang]/articles/page.tsx
<ArticleCard key={entry.slug} entry={entry} lang={lang} />

// Source: src/app/[lang]/science/page.tsx
<ScienceCard key={entry.slug} entry={entry} lang={lang} dict={{ difficulty: dict.science.difficulty }} />

// Source: src/app/[lang]/skills/page.tsx
<SkillCard key={entry.slug} entry={entry} lang={lang} />
```

---

## State of the Art

| Old Approach | Current Approach | Notes |
|--------------|------------------|-------|
| `framer-motion` for animations | CSS animation tokens in `globals.css` | `motion` not installed; all animations are CSS-only |
| Custom carousel library | CSS scroll-snap + useState | Zero-dependency; adequate for 5–6 slides |
| Separate content fetch per section | Single server component fetches all, passes props | App Router Server Component pattern — no waterfalls |
| Global `window.scrollY` listener | `IntersectionObserver` | More performant; already used in modern browsers universally |

**Deprecated/outdated:**
- `react-intersection-observer` npm package: not needed; native `IntersectionObserver` API is sufficient for this use case and avoids an extra dependency.
- Framer Motion / Motion library: listed in CLAUDE.md as planned but not installed. Do not install it for this phase — CSS animations cover all requirements.

---

## Open Questions

1. **Stats counter: which content types to count**
   - What we know: D-02 specifies diary entries, articles published, skill packs released. Science explainers are not mentioned.
   - What's unclear: Whether to include science count as a 4th stat or stick to 3.
   - Recommendation: Use the 3 locked in D-02 (diary, articles, skills). Add science only if the visual grid works better with 4 columns.

2. **Carousel: how many cards visible at once on desktop**
   - What we know: 5 diary seed entries exist; carousel should show "recent entries"
   - What's unclear: 1, 2, or 3 cards visible at once on desktop
   - Recommendation: 1 card mobile, 2 cards tablet (md), 3 cards desktop (lg) — matches existing 3-column card grid pattern used in listing pages

3. **Homepage URL: root redirect**
   - What we know: `src/app/page.tsx` is the root fallback (still shows Next.js template)
   - What's unclear: Whether to update `src/app/page.tsx` to redirect to `/en` or leave it as-is
   - Recommendation: This is out of scope for Phase 08 (it belongs to Phase 01 i18n work). Leave `src/app/page.tsx` as-is and only implement `src/app/[lang]/page.tsx`.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 |
| Config file | `vitest.config.ts` (project root) |
| Quick run command | `npm test -- --reporter=verbose` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HOME-01 | Hero section renders with tagline, mascot, CTA | unit | `npm test -- --reporter=verbose src/__tests__/homepage.test.ts` | Wave 0 |
| HOME-02 | Stats counts derive from actual content length | unit | `npm test -- --reporter=verbose src/__tests__/homepage.test.ts` | Wave 0 |
| HOME-03 | Carousel prev/next index logic wraps correctly | unit | `npm test -- --reporter=verbose src/__tests__/homepage.test.ts` | Wave 0 |
| HOME-04 | Value prop grid renders 4 items | unit | `npm test -- --reporter=verbose src/__tests__/homepage.test.ts` | Wave 0 |
| HOME-05 | Featured sections pull correct number from each getter | unit | `npm test -- --reporter=verbose src/__tests__/homepage.test.ts` | Wave 0 |

### Sampling Rate

- **Per task commit:** `npm test`
- **Per wave merge:** `npm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `src/__tests__/homepage.test.ts` — covers HOME-01 through HOME-05 (pure logic tests for carousel index arithmetic, stats count derivation, featured content slice length)
- [ ] `dictionaries/en.json` — must add `home` key with all homepage string keys before any component references `dict.home.*`

*(No new framework or config needed — Vitest + existing setup covers all homepage tests)*

---

## Sources

### Primary (HIGH confidence — verified from codebase)

- `src/app/[lang]/page.tsx` — current homepage placeholder; confirms route exists, uses `getDictionary` + `params`
- `src/components/diary/DiaryCard.tsx` — exact prop signature for carousel slides
- `src/components/articles/ArticleCard.tsx`, `ScienceCard.tsx`, `SkillCard.tsx` — exact prop signatures for featured sections
- `src/components/ui/MascotImage.tsx` — confirmed `pose`, `size`, `className`, `alt` props + `animate-float` usage
- `src/app/globals.css` — confirmed available animation tokens: `animate-bounce-in`, `animate-float`, `animate-pop`; `prefers-reduced-motion` handler present
- `lib/content/diary.ts`, `articles.ts`, `science.ts`, `skills.ts` — confirmed `server-only` guard on all four; confirmed return types
- `src/components/skills/SkillFilterGrid.tsx` — established `'use client'` island pattern with `import type` for server-only types
- `dictionaries/en.json` — confirmed no `home` key exists; must be added
- `package.json` — confirmed `motion` and `framer-motion` are NOT installed; confirmed Vitest 4.1.2 is the test framework
- `vitest.config.ts` — confirmed `server-only` mock alias, `@/` alias, node environment

### Secondary (MEDIUM confidence — cross-verified from multiple source files)

- Carousel index wrap logic: `(c + 1) % entries.length` pattern consistent with existing `getPrevNext` helpers in diary/articles/science routes
- `revalidate = 3600` pattern: verified in diary, articles, science, skills listing pages — homepage should match

### Tertiary (LOW confidence — not needed; research completed without web sources per task constraints)

- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries verified from `package.json` and existing source files
- Architecture: HIGH — patterns extracted directly from Phases 4–7 existing implementations
- Component props: HIGH — verified from actual component source files
- Pitfalls: HIGH — two pitfalls (server-only in client, ScienceCard dict) verified against real code; others based on established patterns
- Animation approach: HIGH — `motion` not-installed status confirmed from `package.json`

**Research date:** 2026-04-01
**Valid until:** 2026-05-01 (stable codebase; no external library changes needed)
