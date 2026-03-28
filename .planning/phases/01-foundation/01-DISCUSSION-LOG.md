# Phase 1: Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-28
**Phase:** 1-foundation
**Areas discussed:** Content schema design, Deployment target, Content organization, SEO metadata approach
**Mode:** Auto (--auto flag)

---

## Content Schema Design

| Option | Description | Selected |
|--------|-------------|----------|
| Standard fields per type | Common fields (title, date, excerpt, thumbnail, slug, tags) + type-specific extras | ✓ |
| Minimal fields | Only title and date, derive everything else | |
| Rich metadata | Extensive fields including author, reading time, series, etc. | |

**User's choice:** Standard fields per type (auto-selected recommended default)
**Notes:** Type-specific additions: category/downloadUrl for skills, difficulty for science, dayNumber for diary

---

## Deployment Target

| Option | Description | Selected |
|--------|-------------|----------|
| Vercel | Native Next.js, built-in ISR, zero-config | ✓ |
| Self-hosted | Docker/Node.js, full control, custom cache handlers needed | |
| Cloudflare Pages | Edge-first, different ISR approach | |

**User's choice:** Vercel (auto-selected recommended default)
**Notes:** ISR works out of the box, revalidatePath API available for OpenClaw webhook

---

## Content Organization

| Option | Description | Selected |
|--------|-------------|----------|
| Flat per type | /content/{type}/ with one MDX file per entry | ✓ |
| Nested by date | /content/{type}/2026/03/ subdirectories | |
| Single directory | All content in /content/ with type in frontmatter | |

**User's choice:** Flat per type (auto-selected recommended default)
**Notes:** Filename serves as slug; simplest structure for OpenClaw automated writing

---

## SEO Metadata Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Next.js Metadata API | generateMetadata() per route, native integration | ✓ |
| next-seo library | Third-party wrapper with component-based approach | |
| Manual head tags | Direct manipulation via next/head | |

**User's choice:** Next.js Metadata API (auto-selected recommended default)
**Notes:** Native to Next.js 16, no extra dependency needed

---

## Claude's Discretion

- TypeScript configuration details
- Tailwind CSS v4 initial setup
- ESLint/Prettier configuration
- Package manager choice
- next-intl middleware configuration

## Deferred Ideas

None
