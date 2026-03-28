# Stack Research

**Domain:** AI agent showcase / content-heavy website (i18n, SEO, playful UI)
**Researched:** 2026-03-28
**Confidence:** HIGH (core framework verified via official Next.js docs 16.2.1; Tailwind v4.2 verified via official Tailwind docs)

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 16.x (latest) | Full-stack React framework | Official docs confirm 16.2.1 is current stable. App Router + static generation is the standard for content-heavy SEO-optimized sites in 2025-2026. Built-in metadata API, sitemap support, image optimization, MDX, and ISR all come out of the box — no third-party plugins needed for core SEO concerns. Turbopack is now the default dev bundler (no config needed). |
| React | 19.x (canary via App Router) | UI rendering | App Router bundles React 19 canary automatically; includes all stable React 19 changes. Server Components are the default, meaning translation dictionaries and content files never bloat the client bundle. |
| TypeScript | 5.x (min 5.1) | Type safety | create-next-app includes it by default. Required for the project given its automation-heavy nature — OpenClaw will need to interface with well-typed content schemas. |
| Tailwind CSS | 4.2 | Utility-first styling | Official Tailwind docs confirm v4.2 as current. v4 is a ground-up rewrite: 3-8x faster builds, CSS-first config via `@theme {}`, native cascade layers, no `tailwind.config.js` needed, container queries built-in, 3D transforms. Perfect for AquaClaw's Bold & Playful UI — rapid iteration, custom design tokens in CSS, excellent animation utility support. Next.js's recommended defaults include Tailwind. |
| MDX (`@next/mdx`) | bundled with Next.js 16 | Diary/article content as Markdown with React components | Official support in Next.js App Router. Content stored as `.mdx` files is automation-friendly — OpenClaw can write structured markdown files directly to `/content/`. Server Components render MDX at build time (zero client JS overhead). Supports remark/rehype plugins for frontmatter, syntax highlighting, GFM. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| next-intl | ^3.x (verify at install) | i18n routing + translation | Official Next.js docs list it as the primary App Router i18n recommendation. Provides middleware-based locale routing (`/en/`, `/zh/`), server-side dictionary loading (no client bundle overhead), type-safe translation keys. English-first launch with future language expansion maps perfectly to its `[locale]` segment pattern. |
| gray-matter | ^4.0 | Frontmatter parsing for MDX/MD | Parses YAML frontmatter (`title`, `date`, `tags`, `slug`) from diary/article files. Required for building content index pages (diary carousel, article grid) from the filesystem. Runs server-side only — zero client JS. |
| remark-gfm | ^4.0 | GitHub-Flavored Markdown in MDX | Enables tables, strikethrough, task lists, and autolinks in content files. Used in next.config.mjs as a remark plugin. Standard for any MDX setup with rich content. |
| rehype-pretty-code | ^0.14 | Syntax highlighting for code blocks | Best-in-class syntax highlighting for MDX via Shiki. Critical for Science/Education explainers and technical articles. Zero client JS — renders highlighted HTML at build time. |
| motion | ^11.x | Animations and micro-interactions | `motion` (formerly `framer-motion`) is the standard React animation library. Use for: pixel-art mascot floating animations, counter animations on stats, hover effects on skill pack cards, page transition effects that convey "Bold & Playful" aesthetic. Mark components with `'use client'` directive only where animations are needed. |
| @tailwindcss/typography | ^0.5 | Prose styling for MDX content | Official Tailwind plugin. Adds `prose` classes for beautiful typography in diary entries, articles, science explainers. Works seamlessly with the Tailwind v4 setup. Avoids writing custom prose styles for all heading/list/blockquote variants. |
| sharp | ^0.33 | Production image optimization | Next.js 15+ auto-uses it when present. Pixel-art assets need careful sizing — sharp handles WebP conversion and responsive sizes via next/image without quality loss. Include in production dependencies (not devDependencies). |
| globby | ^14 | Filesystem content discovery | Enumerate MDX content files to build diary/article index pages during SSG. Server-side only. Alternative to manual `fs.readdir` — handles glob patterns cleanly for `content/diary/**/*.mdx`. |
| next-sitemap | ^4.x | XML sitemap + robots.txt generation | Post-build sitemap generation for all static routes. OpenClaw publishes new content → sitemap auto-regenerates on next build. Supports dynamic routes, priority, changefreq. |
| @giscus/react | ^3.x | Comment/feedback system | GitHub Discussions-powered comment widget. No backend required, no database, no spam management. Comments are stored as GitHub Discussions on the repo — reviewable and manageable. Perfect for a public AI showcase site. Zero cost. Mark as `'use client'`. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Turbopack | Dev bundler (replaces Webpack in dev) | Default in Next.js 16 (`next dev` uses it automatically). 76% faster server startup, 96% faster HMR. No config needed — just run `next dev`. |
| Biome | Linter + formatter | create-next-app offers it as ESLint alternative. Biome is significantly faster. Use if speed matters; use ESLint if you need plugin ecosystem (e.g., jsx-a11y). For AquaClaw, ESLint with the Next.js plugin is sufficient since accessibility rules are relevant for public-facing content. |
| ESLint 9 | Linting | Next.js 16 ships with ESLint 9 support. Use flat config format (`eslint.config.mjs`). The `eslint-config-next` plugin includes Next.js-specific rules. |

## Installation

```bash
# Bootstrap (recommended — includes TypeScript, Tailwind, App Router, Turbopack, ESLint by default)
npx create-next-app@latest aquaclaw --typescript --eslint --app --tailwind --turbopack

# i18n
npm install next-intl

# Content / MDX
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
npm install gray-matter globby
npm install remark-gfm rehype-pretty-code

# Tailwind typography plugin
npm install @tailwindcss/typography

# Animation
npm install motion

# Comments
npm install @giscus/react

# Sitemap (run post-build)
npm install next-sitemap

# Production image processing (not devDependency)
npm install sharp

# Dev dependencies
npm install -D @types/node
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Next.js App Router | Astro | Choose Astro if the site is 100% static with no interactivity requirements and no server-side logic ever. AquaClaw needs ISR (new content published by OpenClaw triggers revalidation), dynamic OG images, and potential future API routes — these push toward Next.js. |
| Next.js App Router | Next.js Pages Router | Never for a greenfield project in 2026. Pages Router is in maintenance mode. |
| next-intl | next-i18next | next-i18next is for Pages Router only. next-intl is the App Router standard, explicitly listed in official Next.js i18n docs. |
| next-intl | next-international | Both work for App Router, but next-intl has significantly larger community, better DX, and is the first library linked in the official Next.js docs. |
| MDX + filesystem | Contentlayer | Contentlayer is unmaintained as of 2024. MDX via `@next/mdx` + manual glob parsing is the current recommended approach. |
| MDX + filesystem | Headless CMS (Sanity, Contentful) | Use a headless CMS only if non-technical editors need a GUI. AquaClaw is operated by OpenClaw (writes files programmatically) — CMS adds complexity with zero benefit for this use case. |
| Tailwind CSS v4 | Tailwind CSS v3 | No reason to use v3 on a greenfield project. v4 is faster, has CSS-first config, and is create-next-app's default. |
| motion (framer-motion) | GSAP | GSAP is better for complex scroll-based timeline animations. For AquaClaw's use case (floating mascot, hover effects, counter animations, simple transitions), motion is lighter and integrates more naturally with React state. |
| @giscus/react | Disqus | Disqus is ad-supported, has privacy concerns, and requires account creation. Giscus is free, open-source, GitHub-backed, and appropriate for a developer-audience site like AquaClaw. |
| rehype-pretty-code | Prism | rehype-pretty-code (Shiki-based) renders at build time with zero client JS, supports more themes, and handles MDX better. Prism requires a client-side runtime. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `next-i18next` | Built for Pages Router only; causes SSR/RSC conflicts in App Router | `next-intl` |
| `Contentlayer` | Unmaintained since 2024; causes build failures on newer Next.js versions | `@next/mdx` + `gray-matter` + `globby` |
| `next export` (legacy) | Removed in Next.js 14. The static export approach is `output: 'export'` in next.config — but don't use full static export for AquaClaw since you need ISR for OpenClaw content publishing | Next.js App Router with ISR (`revalidate`) |
| `styled-components` / `emotion` | Runtime CSS-in-JS has a measurable performance penalty; poor fit with React Server Components (RSC) which can't run JS on the client during SSR | Tailwind CSS utility classes |
| `react-i18next` | Designed for SPAs; loads all translations on the client; incompatible with Server Components by default | `next-intl` (server-side dictionary pattern) |
| WordPress / Ghost (CMS) | Heavy infrastructure for a site meant to demonstrate autonomous AI operation; introduces a dependency on a GUI system that conflicts with OpenClaw's file-based publishing model | MDX files in `/content/` directories |
| `pages/` directory | Legacy routing; maintenance mode in Next.js; mixing with `app/` creates conflicts and confusion | App Router (`app/` directory) |

## Stack Patterns by Variant

**Content routing with i18n (diary, articles, science):**
- Use `app/[locale]/diary/[slug]/page.tsx` pattern
- `generateStaticParams` generates all locale × slug combinations at build time
- `revalidate = 3600` on content pages (ISR) allows OpenClaw to trigger rebuilds when new content is published

**Playful UI animations (mascot, counters, hover effects):**
- Default to Server Components for layout
- Isolate `'use client'` to specific animated leaf components
- Use `motion` (`<motion.div>`) only in client components
- Pixel-art assets: use `next/image` with `unoptimized={true}` for pixel-art PNGs to prevent WebP conversion that blurs pixel art

**Content index pages (diary carousel, article grid, skill pack browser):**
- Read MDX files at build time using `globby` + `gray-matter`
- Extract frontmatter (title, date, excerpt, tags, cover)
- Pass as props to client carousel/grid components
- Result: zero API calls, pure static HTML with hydrated interactive components

**Comment system (diary entries, articles):**
- Embed `<Giscus />` from `@giscus/react` as `'use client'` component in post layouts
- Map each page URL to a GitHub Discussion automatically
- No backend or database required

**SEO (content discoverability):**
- Use `generateMetadata()` in each content route for dynamic title/description/OG
- Use `app/sitemap.ts` (built-in Next.js) to generate XML sitemap from content filesystem
- Use `app/robots.ts` for robots.txt generation

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| next@16.x | react@19.x (canary) | App Router requires React canary. Do not pin to React 18 if using App Router. |
| next@16.x | tailwindcss@4.x | Confirmed: create-next-app defaults include Tailwind v4 with `@tailwindcss/postcss` setup |
| next-intl@3.x | next@15.x–16.x | Verify peer deps at install time; next-intl follows Next.js versions closely |
| motion@11.x | react@19.x | motion (formerly framer-motion v11+) supports React 19 |
| @next/mdx | turbopack | With Turbopack, MDX plugins must be passed as strings (plugin names, not function references). Verified in Next.js 15.1 changelog. |
| remark-gfm@4.x | ESM only | Requires `next.config.mjs` (not `.js`) for the remark plugin config. |
| rehype-pretty-code | ESM only | Same as above — use `next.config.mjs`. |

## Sources

- `https://nextjs.org/docs/app/getting-started/installation` — Confirmed Next.js 16.2.1 as current stable; Tailwind CSS, TypeScript, App Router, Turbopack as defaults (HIGH confidence)
- `https://nextjs.org/docs/app/guides/internationalization` — Official i18n patterns; `next-intl` listed as primary community library recommendation (HIGH confidence)
- `https://nextjs.org/docs/app/guides/mdx` — MDX setup via `@next/mdx`, frontmatter patterns, Tailwind typography integration, Turbopack plugin string format (HIGH confidence)
- `https://nextjs.org/docs/app/getting-started/metadata-and-og-images` — Built-in Metadata API, `generateMetadata`, streaming metadata, OG image generation via `ImageResponse` (HIGH confidence)
- `https://nextjs.org/docs/app/guides/static-exports` — Static export capabilities and limitations; confirmed ISR is recommended over full static for dynamic content (HIGH confidence)
- `https://nextjs.org/blog/next-15` — Next.js 15 release notes: React 19, Turbopack stable, async APIs, caching changes (HIGH confidence)
- `https://nextjs.org/blog/next-15-1` — Next.js 15.1: React 19 stable, MDX plugin string format for Turbopack (HIGH confidence)
- `https://tailwindcss.com/blog/tailwindcss-v4` — Tailwind CSS v4 release: ground-up rewrite, CSS-first config, 3-8x performance improvement, v4.2 current (HIGH confidence)
- `https://tailwindcss.com/docs/installation/framework-guides/nextjs` — Official Tailwind + Next.js setup: `@tailwindcss/postcss`, `postcss.config.mjs`, `@import "tailwindcss"` (HIGH confidence)
- `motion` and `@giscus/react` details — Based on training knowledge (versions subject to change; verify at install). Motion v11 renamed from framer-motion. (MEDIUM confidence — verify versions with `npm show motion version` at install time)

---
*Stack research for: AI agent showcase website (AquaClaw.ai)*
*Researched: 2026-03-28*
