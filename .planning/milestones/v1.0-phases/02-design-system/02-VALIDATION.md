---
phase: 2
slug: design-system
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-29
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (already in project from Phase 1) |
| **Config file** | vitest.config.ts |
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
| 02-01-01 | 01 | 1 | BRAN-01 | build | `npm run build` | ✅ | ⬜ pending |
| 02-01-02 | 01 | 1 | BRAN-05 | build | `npm run build` | ✅ | ⬜ pending |
| 02-02-01 | 02 | 1 | BRAN-02, BRAN-03 | visual | manual | N/A | ⬜ pending |
| 02-03-01 | 03 | 2 | BRAN-06 | build | `npm run build` | ✅ | ⬜ pending |
| 02-04-01 | 04 | 2 | BRAN-04 | visual | manual viewport check | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements. Vitest is already installed from Phase 1.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Pixel art renders crisp on HiDPI | BRAN-02 | Visual rendering quality cannot be automated | Open in browser, zoom to 200%, verify no blur on mascot |
| Favicon appears in browser tab | BRAN-03 | Browser tab rendering requires manual verification | Open site, check browser tab icon |
| Responsive layout at 375/768/1280px | BRAN-04 | Layout overflow requires visual inspection | Open DevTools, test each breakpoint |
| Bold & Playful aesthetic matches spec | BRAN-01 | Subjective design quality | Compare rendered page to color/typography tokens |
| Animations run without jank | BRAN-06 | Performance perception requires visual check | Open page, observe animations, check DevTools Performance tab |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
