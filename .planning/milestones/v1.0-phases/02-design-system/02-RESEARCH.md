# Phase 2: Design System - Research

**Researched:** 2026-03-29
**Domain:** CSS design tokens, typography, pixel-art rendering, CSS animations (Tailwind v4)
**Confidence:** HIGH

## Summary

Phase 2 establishes the complete visual design system for AquaClaw.ai's Bold & Playful aesthetic. The work centers on extending the existing Tailwind v4 `@theme inline` block in `globals.css` with a warm color palette, typography scale (Fredoka headings + Nunito body), pixel-art mascot rendering rules, and CSS-only animation tokens. All downstream phases consume these tokens.

The existing codebase already has Tailwind v4 with `@theme inline` configured and a root layout. The main work is: (1) define the full color/typography/animation token system in CSS, (2) load the new fonts via `next/font/google`, (3) establish pixel-art rendering with `image-rendering: pixelated` and `next/image` with `unoptimized`, (4) create favicon files from the mascot, (5) add responsive breakpoint verification, and (6) wire up `@tailwindcss/typography` for prose content.

**Primary recommendation:** Define all design tokens purely in CSS using Tailwind v4's `@theme` directive. No `tailwind.config.js` needed. Use `@plugin "@tailwindcss/typography"` in CSS. Generate mascot pixel art at 64x64 base resolution with AI tools, export as PNG, place in `public/mascot/`.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Warm & vibrant color temperature -- orange, coral, golden yellow as primary tones. Energetic and approachable, matching the Garfield-style cat mascot.
- **D-02:** Warm off-white background (cream/ivory) -- softer than pure white, complements warm palette.
- **D-03:** Heavy rounding -- pill-shaped buttons, 16px+ border-radius on cards. Maximally playful, Notion/Figma vibes.
- **D-05:** Playful display font for headings (e.g., Fredoka, Nunito, Baloo) -- reinforces Bold & Playful identity.
- **D-06:** Rounded sans-serif for body text (e.g., Nunito, Inter) -- warmer than Geist Sans, pairs with playful headings.
- **D-08:** Generate mascot pixel art with AI tools during this phase -- no pre-existing assets.
- **D-09:** 64x64 pixel grid base -- allows finer detail while still reading as pixel art. Scales to 128, 256 for larger uses.
- **D-10:** 3-4 poses for v1 -- default standing, waving/greeting, thinking, and sleeping. Covers nav, hero, 404, and loading states.
- **D-11:** Mascot must render crisp on HiDPI/Retina using `image-rendering: pixelated` -- no blurring from browser upscaling.
- **D-12:** Favicon derived from the mascot -- pixel-art cat head at standard favicon sizes (16x16, 32x32, apple-touch-icon).
- **D-13:** Bouncy & springy motion -- elastic easing, overshoot on hover, playful bounce on entry.
- **D-14:** Subtle idle animation on mascot -- gentle floating/bobbing when visible. CSS-only with transform/opacity per BRAN-06 constraint.
- **D-15:** Key moments only for motion -- page transitions, card hovers, scroll-into-view on hero/stats. Not every element. Respects `prefers-reduced-motion`.
- **D-16:** CSS-only animations -- `transform` and `opacity` only, no JS animation loops (BRAN-06 requirement).

### Claude's Discretion
- **D-04:** Number of accent colors (1-4) -- Claude picks what creates the most cohesive system. A teal/blue contrast accent is a natural complement to warm primaries.
- **D-07:** Monospace font for code blocks -- Claude picks what pairs best with heading/body fonts. Geist Mono is an option but not locked.

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BRAN-01 | Bold & Playful design system -- bright color palette, rounded shapes, playful micro-animations | Color tokens via `@theme`, border-radius scale, animation keyframes all defined in CSS |
| BRAN-02 | Pixel-art light brown Garfield cat mascot integrated on homepage, nav, and key pages | 64x64 base PNG with `image-rendering: pixelated`, `next/image` with `unoptimized={true}` |
| BRAN-03 | Pixel-art mascot favicon in browser tab | Next.js file-convention favicons: `favicon.ico` + `icon.png` + `apple-icon.png` in `app/` |
| BRAN-04 | Responsive design -- mobile, tablet, and desktop breakpoints | Tailwind v4 default breakpoints (sm:640, md:768, lg:1024, xl:1280) plus container queries |
| BRAN-05 | Readable typography -- font pairing, comfortable line-height, max-width prose container | Fredoka (headings) + Nunito (body) via `next/font/google`, `@tailwindcss/typography` for prose |
| BRAN-06 | CSS-only animations using transform/opacity -- no JS animation loops | `@theme` keyframes with `transform`/`opacity` only, `prefers-reduced-motion` media query |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Stack locked:** Next.js 16.x, React 19, Tailwind CSS v4.2, TypeScript 5.x
- **CSS-first config:** All tokens in `@theme inline` blocks, no `tailwind.config.js` unless absolutely necessary
- **Motion library:** `motion` (framer-motion v11+) listed in stack but BRAN-06 requires CSS-only animations -- use CSS keyframes for this phase, reserve `motion` for interactive components in later phases
- **Pixel art:** Use `next/image` with `unoptimized={true}` for pixel-art PNGs
- **Dark mode:** `prefers-color-scheme` only, no toggle (Out of Scope per REQUIREMENTS.md)
- **GSD workflow:** Do not make direct repo edits outside a GSD workflow

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| tailwindcss | 4.2.2 (verified) | Design token system | CSS-first `@theme` directive defines all color/font/animation tokens |
| next | 16.2.1 (verified) | Font loading, image optimization, favicon conventions | `next/font/google` for self-hosted fonts, `next/image` for pixel art |
| react | 19.2.4 (verified) | UI rendering | Already installed |

### To Install
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @tailwindcss/typography | 0.5.19 (verified) | Prose styling for MDX content | `@plugin` directive in CSS -- provides `prose` class for readable content |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @tailwindcss/typography | tw-prose | tw-prose is CSS-only alternative, but @tailwindcss/typography is official and better maintained |
| Fredoka + Nunito | Baloo + Inter | Baloo is heavier, Inter lacks warmth -- Fredoka + Nunito is the better pairing for Bold & Playful |

**Installation:**
```bash
npm install @tailwindcss/typography
```

## Architecture Patterns

### Recommended Asset Structure
```
src/
  app/
    globals.css           # All @theme tokens, @plugin, @keyframes
    layout.tsx            # Font loading via next/font/google
    favicon.ico           # 16x16 favicon (auto-detected by Next.js)
    icon.png              # 32x32 icon (auto-detected)
    apple-icon.png        # 180x180 apple touch icon (auto-detected)
  components/
    ui/
      MascotImage.tsx     # Reusable pixel-art mascot component
      DemoCard.tsx        # Demo card for design system verification
public/
  mascot/
    mascot-default.png    # 64x64 standing pose
    mascot-waving.png     # 64x64 waving pose
    mascot-thinking.png   # 64x64 thinking pose
    mascot-sleeping.png   # 64x64 sleeping pose
```

### Pattern 1: Tailwind v4 @theme Token System

**What:** Define all design tokens in CSS using `@theme` and `@theme inline` directives.
**When to use:** Always -- this is the single source of truth for all visual properties.

```css
/* globals.css */
@import "tailwindcss";
@plugin "@tailwindcss/typography";

/* === BASE VARIABLES (light/dark) === */
:root {
  --background: #FFF8F0;        /* warm cream */
  --foreground: #2D1B0E;        /* warm dark brown */
  --card-bg: #FFFFFF;
  --muted: #F5EDE4;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #1A1210;
    --foreground: #F5EDE4;
    --card-bg: #2D2420;
    --muted: #3D3430;
  }
}

/* === DESIGN TOKENS === */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card-bg);
  --color-muted: var(--muted);

  /* Primary warm palette */
  --color-primary: #FF6B35;       /* vibrant orange */
  --color-primary-light: #FF8F61;
  --color-primary-dark: #E55A25;
  --color-secondary: #F7C948;     /* golden yellow */
  --color-secondary-light: #FADE7A;
  --color-secondary-dark: #D4A72C;
  --color-accent: #FF8C94;        /* coral pink */
  --color-accent-light: #FFB3B8;
  --color-accent-dark: #E06670;
  --color-contrast: #2EC4B6;      /* teal contrast accent */
  --color-contrast-light: #5DD9CE;
  --color-contrast-dark: #1FA99D;

  /* Fonts */
  --font-display: var(--font-fredoka);
  --font-sans: var(--font-nunito);
  --font-mono: var(--font-geist-mono);

  /* Typography scale */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 3rem;

  /* Border radius -- heavy rounding per D-03 */
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-pill: 9999px;
}

/* === ANIMATION TOKENS === */
@theme {
  /* Bounce entry */
  --animate-bounce-in: bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;

  /* Gentle float for mascot idle */
  --animate-float: float 3s ease-in-out infinite;

  /* Hover pop */
  --animate-pop: pop 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both;

  @keyframes bounce-in {
    0% { opacity: 0; transform: scale(0.8) translateY(10px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }

  @keyframes pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
}

/* === REDUCED MOTION === */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Pattern 2: Font Loading with next/font/google

**What:** Load Fredoka and Nunito via `next/font/google` for self-hosted, zero-layout-shift font loading.
**When to use:** In root `layout.tsx`.

```tsx
// src/app/layout.tsx
import { Fredoka, Nunito } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
  display: 'swap',
  weight: ['400', '500', '600', '700'],  // variable font supports 300-700
})

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

### Pattern 3: Pixel-Art Mascot Component

**What:** Reusable component that renders pixel art crisp at any scale.
**When to use:** Everywhere the mascot appears.

```tsx
// src/components/ui/MascotImage.tsx
import Image from 'next/image'

type MascotPose = 'default' | 'waving' | 'thinking' | 'sleeping'

interface MascotImageProps {
  pose?: MascotPose
  size?: number  // display size in px (will be scaled up from 64x64)
  className?: string
  alt?: string
}

export function MascotImage({
  pose = 'default',
  size = 128,
  className = '',
  alt = 'AquaClaw mascot',
}: MascotImageProps) {
  return (
    <Image
      src={`/mascot/mascot-${pose}.png`}
      alt={alt}
      width={size}
      height={size}
      unoptimized  // CRITICAL: prevents WebP conversion that blurs pixel art
      className={`[image-rendering:pixelated] ${className}`}
      priority={pose === 'default'}
    />
  )
}
```

### Pattern 4: Next.js Favicon File Convention

**What:** Place favicon files in `src/app/` for automatic detection.
**When to use:** During mascot asset creation.

Next.js automatically generates `<link>` tags when these files exist:
- `src/app/favicon.ico` -- 16x16 (or multi-size .ico)
- `src/app/icon.png` -- 32x32 for modern browsers
- `src/app/apple-icon.png` -- 180x180 for iOS

No manual `<link>` tags needed in `layout.tsx`. Next.js detects by filename convention.

### Anti-Patterns to Avoid
- **Using `tailwind.config.js` for tokens:** Tailwind v4 uses CSS-first config. Do not create a JS config file unless you need deep plugin customization (typography plugin does not require it for basic use).
- **Using `next/image` default optimization on pixel art:** Default optimization converts to WebP, which blurs pixel art. Always use `unoptimized={true}`.
- **Animating `width`, `height`, `margin`, `padding`, `top`, `left`:** These trigger layout/paint. Only animate `transform` and `opacity` (BRAN-06).
- **JS animation loops for design system animations:** Use CSS `@keyframes` only. `motion` library is reserved for interactive components in later phases.
- **Importing fonts from Google CDN:** Use `next/font/google` for self-hosted fonts. Never add `<link>` tags to Google Fonts CDN.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Prose typography | Custom heading/list/blockquote styles | `@tailwindcss/typography` with `prose` class | Handles 30+ element styles, dark mode, responsive sizing |
| Font loading | Manual `@font-face` declarations | `next/font/google` | Automatic self-hosting, CLS prevention, subsetting |
| Favicon generation | Manual `<link>` tags in head | Next.js file convention (`favicon.ico`, `icon.png`, `apple-icon.png`) | Auto-detected, type-safe, no manual HTML |
| Color dark mode | Manual dark class toggling | `prefers-color-scheme` media query + CSS vars | System-level, zero JS, per project requirements |
| Responsive breakpoints | Custom media queries | Tailwind v4 default breakpoints (sm/md/lg/xl/2xl) | Already standardized, utility-first |

## Common Pitfalls

### Pitfall 1: Pixel Art Blurring on Retina/HiDPI
**What goes wrong:** Browser scales 64x64 PNG with bilinear interpolation, producing blurry edges.
**Why it happens:** Default image scaling uses smooth interpolation. `next/image` also converts to WebP by default.
**How to avoid:** Two-part fix: (1) `unoptimized={true}` on `next/image` to prevent WebP conversion, (2) `image-rendering: pixelated` CSS property on the `<img>` element. Both are required.
**Warning signs:** Mascot appears slightly fuzzy or has anti-aliased edges when viewed at 2x+ display density.

### Pitfall 2: @theme inline vs @theme (Variable Resolution)
**What goes wrong:** CSS variables defined in `@theme` (without `inline`) generate a reference to the theme variable, not the resolved value. This breaks when the underlying CSS variable changes (e.g., dark mode).
**Why it happens:** `@theme` generates `var(--tw-color-*)` references. `@theme inline` resolves the value at build time and uses the actual `var(--background)` value.
**How to avoid:** Use `@theme inline` for any token that references `:root` CSS variables (colors that change in dark mode). Use `@theme` (without `inline`) for static values like keyframes and animations.
**Warning signs:** Dark mode colors not updating, or utilities showing wrong color in dev tools.

### Pitfall 3: Font Variable Not Available in @theme
**What goes wrong:** `--font-display: var(--font-fredoka)` in `@theme` fails because the CSS variable `--font-fredoka` is set at runtime by `next/font`, not at CSS parse time.
**Why it happens:** `next/font` injects CSS variables via the `className` prop on `<html>`, which happens after CSS is parsed.
**How to avoid:** Use `@theme inline` for font references. The `inline` mode ensures the utility class uses `var(--font-fredoka)` directly, which resolves at runtime when the class is applied.
**Warning signs:** Headings showing fallback font (Arial/sans-serif) instead of Fredoka.

### Pitfall 4: Animation Causing Layout Shift
**What goes wrong:** Animating non-compositable properties (margin, padding, width, height) causes layout recalculation and visible jank.
**Why it happens:** Only `transform` and `opacity` are GPU-composited. Everything else triggers layout/paint.
**How to avoid:** Strictly limit all animations to `transform` and `opacity`. Use `translateY` for movement, `scale` for size changes, `opacity` for fading. BRAN-06 enforces this.
**Warning signs:** Janky animation, elements jumping, paint flashing in Chrome DevTools.

### Pitfall 5: Missing prefers-reduced-motion
**What goes wrong:** Users with motion sensitivity experience discomfort from bouncy animations.
**Why it happens:** Forgetting to add the media query or not testing with it enabled.
**How to avoid:** Add global `prefers-reduced-motion: reduce` rule that sets `animation-duration: 0.01ms` and `transition-duration: 0.01ms`. Test by enabling "Reduce motion" in OS accessibility settings.
**Warning signs:** No behavior change when reduced motion is enabled in browser/OS.

### Pitfall 6: Favicon ICO Not Replacing Default
**What goes wrong:** Browser tab still shows the default Next.js favicon.
**Why it happens:** The existing `public/favicon.ico` takes precedence, or the new `src/app/favicon.ico` is not properly formatted.
**How to avoid:** Remove `public/favicon.ico` (the default one). Place the new `favicon.ico` in `src/app/`. Next.js file convention detects it automatically. The `.ico` format must be valid (use a tool to convert PNG to ICO).
**Warning signs:** Old vercel/next.js triangle icon still showing in browser tab.

## Code Examples

### Bounce Easing with cubic-bezier Overshoot
```css
/* Spring-like overshoot for hover effects */
.hover-spring {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.hover-spring:hover {
  transform: scale(1.05);
}

/* Alternative: CSS linear() for more complex spring (88%+ browser support) */
.hover-spring-advanced {
  transition: transform 0.4s linear(
    0, 0.006, 0.025 2.8%, 0.101 6.1%, 0.539 18.9%,
    0.721 25.3%, 0.849 31.5%, 0.937 38.1%, 0.968 41.8%,
    0.991 45.7%, 1.006 50.1%, 1.015 55%, 1.017 63.9%,
    1.001 85.8%, 1
  );
}
```

### Typography Plugin Setup (CSS-only)
```css
/* In globals.css -- no tailwind.config.js needed */
@import "tailwindcss";
@plugin "@tailwindcss/typography";

/* Customize prose with element modifiers in HTML */
/* <article class="prose prose-lg prose-headings:font-display prose-a:text-primary"> */
```

### Responsive Demo Page Pattern
```tsx
// Verify responsive layout at 375px, 768px, 1280px
export default function DesignSystemDemo() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero - stack on mobile, side-by-side on desktop */}
      <section className="px-4 py-12 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary">
              Bold & Playful
            </h1>
            <p className="mt-4 text-lg text-foreground/80 max-w-prose">
              Design system demo text.
            </p>
          </div>
          <MascotImage pose="waving" size={256} className="animate-float" />
        </div>
      </section>

      {/* Card grid - 1 col mobile, 2 tablet, 3 desktop */}
      <section className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Cards with rounded-xl (heavy rounding per D-03) */}
          <div className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-display text-xl font-semibold">Card Title</h3>
            <p className="mt-2 text-foreground/70">Card content.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` plugins array | `@plugin` directive in CSS | Tailwind v4 (Jan 2025) | No JS config file needed for plugins |
| `tailwind.config.js` theme extend | `@theme` / `@theme inline` in CSS | Tailwind v4 (Jan 2025) | All tokens are CSS-native, no build step for theme |
| Google Fonts CDN `<link>` | `next/font/google` self-hosted | Next.js 13+ (2023) | Zero CLS, no external requests, automatic subsetting |
| Manual favicon `<link>` tags | File convention (`app/favicon.ico`) | Next.js 13+ (2023) | Auto-detected, typed metadata |
| `cubic-bezier()` only for easing | `linear()` CSS function | Chrome 113+, Firefox 112+ (2023) | Complex spring/bounce curves in pure CSS; 88% browser support |

**Deprecated/outdated:**
- `tailwind.config.js` for design tokens: Use `@theme` in CSS instead
- Google Fonts CDN links in `<head>`: Use `next/font/google`
- `Geist Sans` / `Geist Mono` as primary fonts: Replaced per D-05/D-06 (keep Geist Mono as option for code blocks per D-07)
- Framer Motion import path `framer-motion`: Package renamed to `motion` in v11+

## Open Questions

1. **AI-Generated Mascot Assets**
   - What we know: D-08 specifies generating mascot pixel art with AI tools during this phase. 64x64 base grid, 3-4 poses.
   - What's unclear: Which AI tool to use for pixel art generation (DALL-E, Midjourney, dedicated pixel art AI). Whether the human user will generate these or expect the AI agent to.
   - Recommendation: The planner should include a task that generates or places placeholder mascot PNGs. If AI image generation is not available in the execution environment, use hand-drawn placeholders at correct dimensions (64x64) and document for human follow-up.

2. **Geist Mono Retention vs. Alternative**
   - What we know: D-07 gives Claude discretion on monospace font. Geist Mono is already in the project via `geist` package.
   - What's unclear: Whether `geist/font/mono` import still works after removing Geist Sans.
   - Recommendation: Keep Geist Mono -- it pairs well with rounded fonts (its geometric shapes complement Fredoka/Nunito), it is already installed, and it is a high-quality monospace font. No need to change.

3. **@tailwindcss/typography Prose Customization Depth**
   - What we know: Basic setup is CSS-only via `@plugin`. Deep customization (changing base styles) requires `@config` + JS file.
   - What's unclear: Whether the project needs deep prose customization or if element modifiers (`prose-headings:font-display`) suffice.
   - Recommendation: Start with CSS-only `@plugin` + element modifier classes. Only add `@config` if prose defaults prove insufficient. Element modifiers should handle heading font, link color, and spacing.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 |
| Config file | `vitest.config.ts` |
| Quick run command | `npm test` |
| Full suite command | `npm test` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| BRAN-01 | Color tokens and rounded shapes defined in @theme | unit | `npx vitest run src/__tests__/design-tokens.test.ts -x` | Wave 0 |
| BRAN-02 | MascotImage component renders with pixelated + unoptimized | unit | `npx vitest run src/__tests__/mascot-image.test.ts -x` | Wave 0 |
| BRAN-03 | Favicon files exist at correct paths and sizes | unit | `npx vitest run src/__tests__/favicon.test.ts -x` | Wave 0 |
| BRAN-04 | Responsive layout (no horizontal overflow at 375/768/1280) | manual-only | Visual check in browser DevTools responsive mode | N/A |
| BRAN-05 | Font variables loaded, prose container has max-width | unit | `npx vitest run src/__tests__/typography.test.ts -x` | Wave 0 |
| BRAN-06 | Animation keyframes use only transform/opacity | unit | `npx vitest run src/__tests__/animations.test.ts -x` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npm test`
- **Per wave merge:** `npm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/__tests__/design-tokens.test.ts` -- parse globals.css to verify token presence (covers BRAN-01)
- [ ] `src/__tests__/mascot-image.test.ts` -- test MascotImage component props (covers BRAN-02)
- [ ] `src/__tests__/favicon.test.ts` -- verify favicon files exist at expected paths (covers BRAN-03)
- [ ] `src/__tests__/typography.test.ts` -- verify font CSS variables and prose plugin (covers BRAN-05)
- [ ] `src/__tests__/animations.test.ts` -- parse keyframes from CSS, verify only transform/opacity (covers BRAN-06)
- [ ] Vitest environment may need `jsdom` for component tests: `npm install -D jsdom`

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS v4 Theme Variables](https://tailwindcss.com/docs/theme) -- `@theme` and `@theme inline` syntax, namespaces, keyframes
- [Tailwind CSS v4 Release Blog](https://tailwindcss.com/blog/tailwindcss-v4) -- CSS-first config, `@plugin` directive, performance improvements
- [Next.js Font Optimization](https://nextjs.org/docs/app/getting-started/fonts) -- `next/font/google` usage, CSS variable pattern, self-hosting
- [Next.js Favicon File Conventions](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons) -- `favicon.ico`, `icon.png`, `apple-icon.png` auto-detection
- [MDN image-rendering](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/image-rendering) -- `pixelated` value for pixel art
- [MDN Crisp Pixel Art](https://developer.mozilla.org/en-US/docs/Games/Techniques/Crisp_pixel_art_look) -- full technique for rendering pixel art in browsers
- [Fredoka on Google Fonts](https://fonts.google.com/specimen/Fredoka) -- variable font with weight axis 300-700, display use

### Secondary (MEDIUM confidence)
- [Josh Comeau - Springs and Bounces in CSS](https://www.joshwcomeau.com/animation/linear-timing-function/) -- `linear()` timing function for spring/bounce, browser support ~88%
- [Chrome Developers - linear() easing](https://developer.chrome.com/docs/css-ui/css-linear-easing-function) -- complex easing curves in pure CSS
- [Easings.net](https://easings.net/) -- cubic-bezier presets for bounce/elastic effects
- [GitHub Discussion #15904](https://github.com/tailwindlabs/tailwindcss/discussions/15904) -- typography plugin v4 setup patterns

### Tertiary (LOW confidence)
- AI-generated pixel art workflow -- no authoritative source for best tool; recommend human decision or experimentation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- Tailwind v4, next/font, @tailwindcss/typography all verified against official docs and npm registry
- Architecture: HIGH -- @theme inline pattern, font loading, favicon conventions all documented in official sources
- Pitfalls: HIGH -- pixel art rendering, font variable resolution, animation performance are well-documented problem areas
- Mascot asset generation: LOW -- AI pixel art tools are outside the CSS/Next.js domain; depends on user's tooling

**Research date:** 2026-03-29
**Valid until:** 2026-04-28 (stable -- Tailwind v4 and Next.js 16 are mature)
