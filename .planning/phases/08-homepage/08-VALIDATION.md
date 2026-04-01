---
phase: 08
slug: homepage
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-01
---

# Phase 08 — Validation Strategy

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
| 08-01-01 | 01 | 1 | HOME-01 | unit | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 08-01-02 | 01 | 1 | HOME-02, HOME-03 | unit | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 08-02-01 | 02 | 2 | HOME-04, HOME-05 | unit | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 08-02-02 | 02 | 2 | ALL | integration | `npx vitest run && npx next build` | ❌ W0 | ⬜ pending |
| 08-02-03 | 02 | 2 | ALL | manual | visual verification | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Test stubs for homepage in `src/__tests__/homepage.test.ts`

*Existing test infrastructure (vitest) covers framework needs.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Hero section layout + CTA | HOME-01 | Visual layout verification | Verify tagline, sub-copy, CTA button, mascot |
| Stats count-up animation on scroll | HOME-02 | Scroll-triggered animation | Scroll to stats section, verify numbers animate up |
| Diary carousel auto-scroll + controls | HOME-03 | Interactive component | Wait for auto-scroll, click prev/next controls |
| Value proposition grid | HOME-04 | Visual content verification | Verify 4 sections with clear descriptions |
| Featured content sections | HOME-05 | Visual content verification | Verify latest articles/science/skills appear with links |
| prefers-reduced-motion | ALL | Accessibility | Enable reduced motion, verify animations stop |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
