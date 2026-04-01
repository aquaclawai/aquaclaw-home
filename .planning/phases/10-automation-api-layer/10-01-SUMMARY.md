---
phase: 10-automation-api-layer
plan: 01
subsystem: api
tags: [next.js, route-handler, isr, revalidation, zod, vitest, webhook]

# Dependency graph
requires:
  - phase: 04-diary-section
    provides: ISR revalidate=3600 pattern on content pages
  - phase: 01-foundation
    provides: src/ directory structure, zod, vitest test runner
provides:
  - POST /api/revalidate webhook endpoint with Bearer token auth
  - CONTENT_GUIDE.md documentation for OpenClaw publishing pipeline
  - .env.example documenting REVALIDATION_SECRET
affects: [openclaw-operation, future-content-publishing]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Route Handler auth pattern: Authorization Bearer header compared against process.env secret"
    - "Zod inline schema validation for API request bodies"
    - "next/cache revalidatePath called per-path from request body array"
    - "TDD: test mock for next/cache and next/server before implementation"

key-files:
  created:
    - src/app/api/revalidate/route.ts
    - src/__tests__/revalidate.test.ts
    - CONTENT_GUIDE.md
    - .env.example
  modified: []

key-decisions:
  - "revalidatePath called per-path in a loop — request body controls which paths are revalidated rather than revalidating all content pages on every call"
  - ".env.example force-added to git (-f flag) since .gitignore excludes .env* — example file contains no secrets"
  - "NextResponse mock in vitest uses object literal pattern (not class mock) since NextResponse.json is a static method"

patterns-established:
  - "API Route Handler pattern: Bearer token auth → Zod body validation → side effects → JSON response"
  - "Route handler tests use dynamic import with vi.resetModules in beforeEach for clean module state per test"

requirements-completed: [AUTO-01, AUTO-02, AUTO-03]

# Metrics
duration: 3min
completed: 2026-04-01
---

# Phase 10 Plan 01: Automation API Layer Summary

**ISR revalidation webhook (POST /api/revalidate) with Bearer token auth and Zod body validation, plus CONTENT_GUIDE.md documenting the OpenClaw end-to-end publishing pipeline**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-01T17:51:51Z
- **Completed:** 2026-04-01T17:54:45Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Built `POST /api/revalidate` Route Handler: 401 on missing/bad auth, 400 on invalid body, 200 + revalidatePath calls on success
- 9 vitest tests covering all behavior cases pass (auth failures, validation failures, single path, multiple paths)
- CONTENT_GUIDE.md (182 lines) documents all 4 content types, frontmatter schemas, file naming, example MDX, validation, publishing flow, and revalidation API with curl example

## Task Commits

Each task was committed atomically:

1. **Task 1 (RED): Failing tests** - `53002d6` (test)
2. **Task 1 (GREEN): Route handler + .env.example** - `ce5749b` (feat)
3. **Task 2: CONTENT_GUIDE.md** - `533fce1` (docs)

## Files Created/Modified

- `src/app/api/revalidate/route.ts` — ISR revalidation webhook Route Handler
- `src/__tests__/revalidate.test.ts` — 9 vitest tests covering auth, validation, and success paths
- `CONTENT_GUIDE.md` — OpenClaw content pipeline reference (182 lines)
- `.env.example` — REVALIDATION_SECRET placeholder

## Decisions Made

- `revalidatePath` called per-path in a loop: request body drives which paths are revalidated rather than blanket-revalidating all content on every call
- `.env.example` force-added to git because `.gitignore` excludes `.env*` — safe since the file contains no secrets
- `NextResponse` mocked as object literal in vitest (not class mock) because `NextResponse.json` is a static factory method

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- `.env.example` was excluded by `.gitignore` (pattern `.env*`). Force-added with `git add -f` since the example file contains placeholder text only, not real secrets.
- 12 pre-existing test failures in `.claude/worktrees/` agent directories — unrelated to this plan's changes, not fixed per scope boundary rules.

## User Setup Required

Set `REVALIDATION_SECRET` to a secure random string in the deployment environment (Vercel env vars or `.env.local`). See `.env.example` for the variable name.

```bash
# Generate a secure value
openssl rand -base64 32
```

## Next Phase Readiness

- Automation publishing loop is closed: OpenClaw can write MDX → call POST /api/revalidate → content goes live
- CONTENT_GUIDE.md is the operational reference for OpenClaw
- No blockers for future content publishing operations

---
*Phase: 10-automation-api-layer*
*Completed: 2026-04-01*
