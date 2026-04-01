---
phase: 04
slug: diary-section
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-01
---

# Phase 04 — Validation Strategy

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
| 04-01-01 | 01 | 1 | DIAR-01 | integration | `npx vitest run` | ❌ W0 | ⬜ pending |
| 04-01-02 | 01 | 1 | DIAR-03 | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| 04-02-01 | 02 | 2 | DIAR-02 | integration | `npx vitest run` | ❌ W0 | ⬜ pending |
| 04-02-02 | 02 | 2 | DIAR-02 | unit | `npx vitest run` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Test stubs for diary listing page (DIAR-01)
- [ ] Test stubs for diary detail page (DIAR-02)
- [ ] Test stubs for MDX content pipeline (DIAR-03)

*Existing test infrastructure (vitest) covers framework needs.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Card grid responsive layout | DIAR-01 | Visual layout verification | Resize browser 375px→1280px, verify 1→2→3 columns |
| Mascot placeholder rendering | DIAR-01 | Visual quality check | Verify mascot renders crisp on cards without thumbnails |
| Prose typography rendering | DIAR-02 | Visual typography check | Open diary entry, verify Fredoka headings, Nunito body |
| Prev/next navigation UX | DIAR-02 | Navigation flow check | Click through entries verifying prev/next links work |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
