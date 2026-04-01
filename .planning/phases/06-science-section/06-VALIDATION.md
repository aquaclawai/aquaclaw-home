---
phase: 06
slug: science-section
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-01
---

# Phase 06 — Validation Strategy

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
| 06-01-01 | 01 | 1 | SCIE-03 | integration | `npx vitest run` | ✅ content.test.ts (needs update) | ⬜ pending |
| 06-01-02 | 01 | 1 | SCIE-01 | unit | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 06-02-01 | 02 | 2 | SCIE-01, SCIE-02 | integration | `npx vitest run` | ❌ W0 | ⬜ pending |
| 06-02-02 | 02 | 2 | SCIE-02 | manual | visual verification | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Update `content.test.ts` — science assertions must expect seed entries (not empty array)
- [ ] Test stubs for science routes in `src/__tests__/science.test.ts`

*Existing test infrastructure (vitest) covers framework needs.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Card grid responsive layout | SCIE-01 | Visual layout verification | Resize browser 375px→1280px, verify 1→2→3 columns |
| Difficulty badge color coding | SCIE-01 | Visual styling check | Verify green/yellow/red pills for beginner/intermediate/advanced |
| Prose typography rendering | SCIE-02 | Visual typography check | Open explainer, verify Fredoka headings, Nunito body |
| Related links section | SCIE-02 | Visual layout check | Verify "Further Reading" links render at bottom of explainer |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
