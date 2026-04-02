---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-28
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | vitest.config.ts (Wave 0 installs) |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run && npm run build` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run && npm run build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | FOUN-01 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 01-01-02 | 01 | 1 | FOUN-02 | integration | `npx vitest run src/__tests__/i18n.test.ts` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 1 | FOUN-03 | unit | `npx vitest run src/__tests__/content.test.ts` | ❌ W0 | ⬜ pending |
| 01-02-02 | 02 | 1 | FOUN-04 | unit | `npx vitest run src/__tests__/content.test.ts` | ❌ W0 | ⬜ pending |
| 01-03-01 | 03 | 2 | FOUN-05 | build | `npm run build` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest` + `@vitejs/plugin-react` — install test framework
- [ ] `vitest.config.ts` — configure vitest for Next.js project
- [ ] `src/__tests__/i18n.test.ts` — stubs for FOUN-02 (i18n routing)
- [ ] `src/__tests__/content.test.ts` — stubs for FOUN-03, FOUN-04 (content layer)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| `/` redirects to `/en/` | FOUN-02 | Middleware redirect requires running dev server | Run `npm run dev`, visit `localhost:3000`, verify redirect to `/en/` |
| OG tags render in page source | FOUN-05 | Requires inspecting rendered HTML | Run `npm run dev`, view page source at `/en/test`, check for og:title, og:description |
| sitemap.xml accessible | FOUN-05 | Requires running server | Run `npm run dev`, visit `/sitemap.xml`, verify valid XML |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
