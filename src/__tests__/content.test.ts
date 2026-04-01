// src/__tests__/content.test.ts
// Tests for FOUN-03: content storage structure
// Tests for FOUN-04: typed content access layer
import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

describe('content storage structure (FOUN-03)', () => {
  it('content/diary/ directory exists', () => {
    expect(existsSync(resolve(process.cwd(), 'content/diary'))).toBe(true)
  })

  it('content/articles/ directory exists', () => {
    expect(existsSync(resolve(process.cwd(), 'content/articles'))).toBe(true)
  })

  it('content/science/ directory exists', () => {
    expect(existsSync(resolve(process.cwd(), 'content/science'))).toBe(true)
  })

  it('content/skills/ directory exists', () => {
    expect(existsSync(resolve(process.cwd(), 'content/skills'))).toBe(true)
  })

  it('day-001.mdx exists in content/diary/ with valid frontmatter fields', () => {
    const filePath = resolve(process.cwd(), 'content/diary/day-001.mdx')
    expect(existsSync(filePath)).toBe(true)
    const content = readFileSync(filePath, 'utf-8')
    expect(content).toContain('title:')
    expect(content).toContain('date:')
    expect(content).toContain('dayNumber:')
    expect(content).toContain('excerpt:')
  })
})

describe('content access layer (FOUN-04)', () => {
  it('getDiaryEntries returns a non-empty array', async () => {
    const { getDiaryEntries } = await import('../../lib/content/diary')
    const entries = getDiaryEntries()
    expect(Array.isArray(entries)).toBe(true)
    expect(entries.length).toBeGreaterThanOrEqual(1)
  })

  it('getDiaryEntries returns day-001 entry with correct title', async () => {
    const { getDiaryEntries } = await import('../../lib/content/diary')
    const entries = getDiaryEntries()
    const day001 = entries.find((e) => e.slug === 'day-001')
    expect(day001).toBeDefined()
    expect(day001?.title).toBe('First Day Building AquaClaw')
  })

  it('getDiaryEntries day-001 has dayNumber 1', async () => {
    const { getDiaryEntries } = await import('../../lib/content/diary')
    const entries = getDiaryEntries()
    const day001 = entries.find((e) => e.slug === 'day-001')
    expect(day001?.dayNumber).toBe(1)
  })

  it('getDiaryEntries day-001 has tags containing foundation', async () => {
    const { getDiaryEntries } = await import('../../lib/content/diary')
    const entries = getDiaryEntries()
    const day001 = entries.find((e) => e.slug === 'day-001')
    expect(day001?.tags).toContain('foundation')
  })

  it('getDiaryEntry("day-001") returns the correct entry', async () => {
    const { getDiaryEntry } = await import('../../lib/content/diary')
    const entry = getDiaryEntry('day-001')
    expect(entry).not.toBeNull()
    expect(entry?.slug).toBe('day-001')
  })

  it('getDiaryEntry("nonexistent") returns null', async () => {
    const { getDiaryEntry } = await import('../../lib/content/diary')
    expect(getDiaryEntry('nonexistent')).toBeNull()
  })

  it('getArticleEntries returns 5 seed articles', async () => {
    const { getArticleEntries } = await import('../../lib/content/articles')
    const entries = getArticleEntries()
    expect(Array.isArray(entries)).toBe(true)
    expect(entries.length).toBe(5)
  })

  it('getScienceEntries returns 5 seed entries', async () => {
    const { getScienceEntries } = await import('../../lib/content/science')
    const entries = getScienceEntries()
    expect(entries.length).toBe(5)
  })

  it('getSkillEntries returns 5 seed entries', async () => {
    const { getSkillEntries } = await import('../../lib/content/skills')
    const entries = getSkillEntries()
    expect(entries.length).toBe(5)
  })

  it('lib/content/diary.ts contains server-only guard', () => {
    const content = readFileSync(resolve(process.cwd(), 'lib/content/diary.ts'), 'utf-8')
    expect(content).toContain("import 'server-only'")
  })

  it('lib/content/articles.ts contains server-only guard', () => {
    const content = readFileSync(resolve(process.cwd(), 'lib/content/articles.ts'), 'utf-8')
    expect(content).toContain("import 'server-only'")
  })

  it('lib/content/science.ts contains server-only guard', () => {
    const content = readFileSync(resolve(process.cwd(), 'lib/content/science.ts'), 'utf-8')
    expect(content).toContain("import 'server-only'")
  })

  it('lib/content/skills.ts contains server-only guard', () => {
    const content = readFileSync(resolve(process.cwd(), 'lib/content/skills.ts'), 'utf-8')
    expect(content).toContain("import 'server-only'")
  })
})
