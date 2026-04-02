---
phase: 11
slug: engagement-polish
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-01
---

# Phase 11 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run --reporter=verbose`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 11-01-01 | 01 | 1 | ENGG-01 | integration | `npx vitest run && npm run build` | ❌ W0 | ⬜ pending |
| 11-01-02 | 01 | 1 | ENGG-01 | manual | visual verification | N/A | ⬜ pending |
| 11-02-01 | 02 | 1 | ENGG-02 | unit | `npm run build` | ✅ | ⬜ pending |
| 11-02-02 | 02 | 1 | ENGG-02 | integration | `npx vitest run && npm run build` | ❌ W0 | ⬜ pending |
| 11-03-01 | 03 | 2 | D-06 | integration | `npm run build` | ✅ | ⬜ pending |
| 11-03-02 | 03 | 2 | D-06 | manual | Lighthouse mobile audit in Chrome DevTools | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Test stubs for engagement in `src/__tests__/engagement.test.ts`
- [ ] Test stubs for RSS in `src/__tests__/rss.test.ts`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Giscus widget loads comments | ENGG-01 | Requires GitHub Discussions enabled | Visit diary/article detail, verify widget renders |
| RSS feed valid in reader | ENGG-02 | Feed reader validation | Subscribe to /rss/diary.xml in an RSS reader |
| Lighthouse mobile ≥90 | D-06 / Success criteria #3 | Browser audit tool | Run Lighthouse on homepage, verify all 4 categories >= 90 |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
