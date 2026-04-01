# Phase 10: Automation & API Layer - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Close the autonomous publishing loop: ensure content directories are documented, Zod validation rejects malformed entries, and an ISR revalidation webhook allows OpenClaw to trigger content updates without full rebuilds. Most infrastructure already exists from Phases 1 and 4-7 — this phase verifies, documents, and adds the revalidation endpoint.

</domain>

<decisions>
## Implementation Decisions

### Content Directories (AUTO-01)
- **D-01:** Content directories already exist with seed files (`/content/diary/`, `/content/articles/`, `/content/science/`, `/content/skills/`). This phase documents the structure and ensures each has an example file.

### Zod Validation (AUTO-02)
- **D-02:** Zod schemas already exist in `lib/content/schemas.ts` (DiaryFrontmatterSchema, ArticleFrontmatterSchema, ScienceFrontmatterSchema, SkillFrontmatterSchema). Build already fails on malformed frontmatter. This phase verifies and documents this behavior.

### ISR Revalidation (AUTO-03)
- **D-03:** Create `POST /api/revalidate` endpoint that accepts a secret token and triggers ISR revalidation. OpenClaw calls this after writing new content files.

### Claude's Discretion
- API endpoint implementation (Next.js Route Handler pattern)
- Secret token approach (environment variable `REVALIDATION_SECRET`)
- Which paths to revalidate (all content paths, or specific paths from request body)
- Response format (JSON with status/message)
- Error handling (invalid token, missing paths)
- Whether to add a CONTENT_GUIDE.md or similar documentation file
- Test coverage for the API endpoint

</decisions>

<code_context>
## Existing Code Insights

### Already Built (Phases 1, 4-7)
- `content/diary/` — 5 MDX files with valid frontmatter
- `content/articles/` — 5 MDX files with valid frontmatter
- `content/science/` — 5 MDX files with valid frontmatter
- `content/skills/` — 5 MDX files with valid frontmatter
- `lib/content/schemas.ts` — All 4 Zod schemas with validation
- `lib/content/{diary,articles,science,skills}.ts` — Getter functions with `safeParse` that throw on invalid frontmatter
- `revalidate = 3600` already set on content pages (ISR enabled)

### Integration Points
- New route: `src/app/api/revalidate/route.ts` (Next.js Route Handler)
- Environment variable: `REVALIDATION_SECRET` for webhook auth
- `revalidatePath()` from `next/cache` for programmatic ISR

</code_context>

<specifics>
## Specific Ideas

- This phase is primarily verification and documentation of existing work, plus one new API endpoint
- The revalidation webhook is the critical new code — it closes the loop for OpenClaw autonomous operation
- Most AUTO requirements are already satisfied by Phases 1 and 4-7 but need explicit verification

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 10-automation-api-layer*
*Context gathered: 2026-04-01*
