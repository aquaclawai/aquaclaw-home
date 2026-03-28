# Phase 1: Foundation - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish the architectural skeleton that every page will be built on: Next.js 16 App Router with i18n routing (next-intl), typed MDX content layer, and SEO pipeline. No visible pages are built in this phase — only the infrastructure that all subsequent phases depend on.

</domain>

<decisions>
## Implementation Decisions

### Content Schema Design
- **D-01:** All content types share common frontmatter fields: `title`, `date`, `excerpt`, `thumbnail`, `slug`, `tags`
- **D-02:** Type-specific additional fields: Skill Packs get `category` and `downloadUrl`; Science gets `difficulty` level; Diary gets `dayNumber`
- **D-03:** Zod schemas validate frontmatter at build time — malformed entries fail the build with descriptive errors

### Deployment Target
- **D-04:** Deploy to Vercel — native Next.js support, built-in ISR, edge functions, zero-config deployment
- **D-05:** ISR revalidation via `revalidatePath()` API route — OpenClaw will call this webhook after writing new content

### Content Organization
- **D-06:** Flat directory structure per content type: `/content/diary/`, `/content/articles/`, `/content/science/`, `/content/skills/`
- **D-07:** One MDX file per entry, no nested subdirectories — filename is the slug (e.g., `day-001.mdx`, `getting-started-with-ai.mdx`)
- **D-08:** Content access layer in `lib/content/` with typed functions per content type (e.g., `getDiaryEntries()`, `getArticleBySlug()`)

### SEO Metadata Approach
- **D-09:** Use Next.js Metadata API (`generateMetadata()`) in each route for per-page titles, descriptions, and canonical URLs
- **D-10:** Open Graph tags generated per page from content frontmatter
- **D-11:** `app/sitemap.ts` generates sitemap.xml dynamically from content entries; `app/robots.ts` generates robots.txt

### i18n Architecture
- **D-12:** `app/[lang]/` route wrapper with next-intl — all routes are locale-prefixed
- **D-13:** Root `/` redirects to `/en/` — English is the only language for v1
- **D-14:** All UI strings externalized into JSON dictionary files from day one — never hardcode text in components

### Claude's Discretion
- TypeScript configuration details (strict mode settings, path aliases)
- Tailwind CSS v4 initial configuration
- ESLint/Prettier setup
- Package manager choice (npm vs pnpm)
- Exact next-intl middleware configuration

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — Project vision, core value, constraints
- `.planning/REQUIREMENTS.md` — Full v1 requirements with FOUN-01 through FOUN-05

### Research
- `.planning/research/STACK.md` — Recommended stack with versions and rationale
- `.planning/research/ARCHITECTURE.md` — System architecture, component boundaries, build order
- `.planning/research/PITFALLS.md` — Domain pitfalls including i18n and SEO warnings

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project, no existing code

### Established Patterns
- None — this phase establishes the foundational patterns

### Integration Points
- Content layer (`lib/content/`) will be consumed by every content section phase (4-7)
- i18n routing (`app/[lang]/`) will wrap every route in subsequent phases
- SEO pipeline (`generateMetadata`) will be used by every page in subsequent phases

</code_context>

<specifics>
## Specific Ideas

- Content structure must be compatible with OpenClaw automated writing — structured MDX with validated frontmatter
- i18n architecture from day one even though only English ships — prevents costly retrofit
- Pixel-art mascot assets need `image-rendering: pixelated` CSS — establish this rule in foundation even if mascot renders in Phase 2

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-03-28*
