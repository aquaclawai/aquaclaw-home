# Retrospective

## Milestone: v1.0 — MVP

**Shipped:** 2026-04-02
**Phases:** 11 | **Plans:** 24

### What Was Built
- Next.js 16 App Router foundation with i18n routing, Tailwind v4 design system, pixel-art cat mascot (4 poses)
- Four content sections: Diary (first-person cat persona), Articles (syntax-highlighted code), Science (difficulty badges + Further Reading), Skill Packs (client-side category filtering)
- Interactive homepage: animated stats counter, diary carousel with auto-scroll, value proposition grid, featured content from all sections
- OpenClaw promotional page with download CTAs and tutorial cards
- ISR revalidation webhook for autonomous content publishing
- Giscus comments on diary/article pages, 3 RSS feeds, Lighthouse mobile ≥90

### What Worked
- **2-plan structure per content section**: Plan 1 (content + components) → Plan 2 (routes + pages) proved extremely repeatable across Phases 4-7
- **Discussion skip pattern**: User quickly identified that content sections after Diary were structurally identical and skipped discuss-phase, accelerating velocity significantly
- **Auto-advance chain**: `--auto` flag chaining discuss → plan → execute reduced manual intervention between phases
- **Parallel wave execution**: Wave 1 plans ran in parallel where possible (Phase 11: Giscus + RSS simultaneously)
- **Existing content layer**: Building `getDiaryEntries()` etc. in Phase 1 meant content sections only needed routes + UI

### What Was Inefficient
- **3 unchecked requirements at milestone completion**: FOUN-02, FOUN-03, FOUN-04 were built in Phase 1 but never formally checked off — discovered during milestone completion
- **Import path depth errors**: Multiple plans specified wrong relative import depths (e.g., `../../../../` vs `../../../../../` for `lib/content/`). Agents auto-corrected but this was a recurring issue
- **Root page.tsx never updated**: The default Next.js starter page persisted until Phase 11 when a user discovered it — should have been replaced in Phase 1 or 3
- **motion library not installed**: Listed in CLAUDE.md recommended stack but never installed — led to CSS-only animation approach (which worked fine, but the mismatch caused confusion)

### Patterns Established
- Server components by default, `'use client'` only for interactivity (carousel, filters, stats counter)
- `import type` pattern for client components using server-only types
- Dictionary-driven UI strings via `getDictionary()` — never hardcode text
- `generateMetadata()` + `generateStaticParams()` on every content route
- Deterministic mascot pose selection via hash/modulo (no `Math.random()` in server components)
- PaginationBar reused across sections with `basePath` prop

### Key Lessons
- **Content sections are factory work**: Once the diary pattern was established, articles/science/skills each took ~30 min to discuss+plan+execute
- **Discuss-phase adds most value on the first content section**: After that, users skip it and let Claude mirror the pattern
- **Lighthouse audit should be a per-phase concern, not just final polish**: Accessibility issues accumulated across 10 phases and were fixed in batch at the end
- **Check requirements off as they're built**: Don't wait for milestone completion

### Cost Observations
- Model mix: ~70% sonnet (executors, researchers, checkers, verifiers), ~30% opus (orchestrator)
- Sessions: 1 extended session covering Phases 2-11
- Notable: Content sections (4-7) were the most efficient — repeatable pattern, minimal orchestrator context

---

## Cross-Milestone Trends

| Metric | v1.0 |
|--------|------|
| Phases | 11 |
| Plans | 24 |
| Commits | 143 |
| LOC | 7,295 |
| Duration | 5 days |
| Lighthouse | P:95 A:100 BP:100 SEO:100 |
