// src/__tests__/skills.test.ts
// Tests for skills section: SKIL-01, SKIL-02, SKIL-03
// Covers: category filter logic, seed skill validation, downloadUrl and category fields

import { describe, it, expect } from 'vitest'
import { existsSync } from 'fs'
import { resolve } from 'path'

// ---------------------------------------------------------------------------
// Pure helper for category filtering — mirrors SkillFilterGrid logic
// ---------------------------------------------------------------------------

interface SkillLike {
  slug: string
  category: string
}

function filterByCategory<T extends SkillLike>(
  entries: T[],
  activeCategory: string | null
): T[] {
  if (activeCategory === null) return entries
  return entries.filter((e) => e.category === activeCategory)
}

// ---------------------------------------------------------------------------
// Category filter logic tests (SKIL-01)
// ---------------------------------------------------------------------------

describe('skill filter logic', () => {
  const entries: SkillLike[] = [
    { slug: 'content-writing-pack', category: 'Content Writing' },
    { slug: 'code-generation-pack', category: 'Code Generation' },
    { slug: 'data-analysis-pack', category: 'Data Analysis' },
    { slug: 'image-description-pack', category: 'Image Description' },
    { slug: 'task-automation-pack', category: 'Task Automation' },
  ]

  it('filtering with null returns all entries', () => {
    const result = filterByCategory(entries, null)
    expect(result).toHaveLength(5)
    expect(result).toEqual(entries)
  })

  it('filtering by specific category returns only matching entries', () => {
    const result = filterByCategory(entries, 'Content Writing')
    expect(result).toHaveLength(1)
    expect(result[0]?.slug).toBe('content-writing-pack')
    expect(result[0]?.category).toBe('Content Writing')
  })

  it('filtering by non-existent category returns empty array', () => {
    const result = filterByCategory(entries, 'Nonexistent Category')
    expect(result).toHaveLength(0)
  })

  it('filtering preserves original order of matching entries', () => {
    const multiEntries: SkillLike[] = [
      { slug: 'pack-a', category: 'Code Generation' },
      { slug: 'pack-b', category: 'Content Writing' },
      { slug: 'pack-c', category: 'Code Generation' },
    ]
    const result = filterByCategory(multiEntries, 'Code Generation')
    expect(result).toHaveLength(2)
    expect(result[0]?.slug).toBe('pack-a')
    expect(result[1]?.slug).toBe('pack-c')
  })
})

// ---------------------------------------------------------------------------
// Seed skill packs validation via getSkillEntries()
// ---------------------------------------------------------------------------

describe('seed skill packs via getSkillEntries()', () => {
  const SEED_SLUGS = [
    'content-writing-pack',
    'code-generation-pack',
    'data-analysis-pack',
    'image-description-pack',
    'task-automation-pack',
  ]

  it('all 5 seed MDX files exist on disk', () => {
    for (const slug of SEED_SLUGS) {
      const filePath = resolve(process.cwd(), `content/skills/${slug}.mdx`)
      expect(existsSync(filePath), `${slug}.mdx should exist`).toBe(true)
    }
  })

  it('getSkillEntries returns exactly 5 seed entries', async () => {
    const { getSkillEntries } = await import('../../lib/content/skills')
    const entries = getSkillEntries()
    expect(entries).toHaveLength(5)
  })

  it('getSkillEntries returns entries sorted newest-first (date descending)', async () => {
    const { getSkillEntries } = await import('../../lib/content/skills')
    const entries = getSkillEntries()
    for (let i = 0; i < entries.length - 1; i++) {
      const a = new Date(entries[i]!.date).getTime()
      const b = new Date(entries[i + 1]!.date).getTime()
      expect(a).toBeGreaterThanOrEqual(b)
    }
  })

  it('all seed entries have non-empty title, excerpt, and at least one tag', async () => {
    const { getSkillEntries } = await import('../../lib/content/skills')
    const entries = getSkillEntries()
    for (const entry of entries) {
      expect(entry.title.length, `${entry.slug} title`).toBeGreaterThan(0)
      expect(entry.excerpt.length, `${entry.slug} excerpt`).toBeGreaterThan(0)
      expect(entry.tags.length, `${entry.slug} tags`).toBeGreaterThanOrEqual(1)
    }
  })

  it('getSkillBySlug returns null for non-existent slug', async () => {
    const { getSkillBySlug } = await import('../../lib/content/skills')
    expect(getSkillBySlug('does-not-exist')).toBeNull()
  })

  it('getSkillBySlug returns correct entry for known slug', async () => {
    const { getSkillBySlug } = await import('../../lib/content/skills')
    const entry = getSkillBySlug('content-writing-pack')
    expect(entry).not.toBeNull()
    expect(entry?.title).toBeTruthy()
    expect(entry?.slug).toBe('content-writing-pack')
  })

  it('all seed entries have non-empty category field (SKIL-03)', async () => {
    const { getSkillEntries } = await import('../../lib/content/skills')
    const entries = getSkillEntries()
    for (const entry of entries) {
      expect(
        entry.category.length,
        `${entry.slug} category must not be empty`
      ).toBeGreaterThan(0)
    }
  })

  it('all seed entries have valid downloadUrl field (SKIL-02) — starts with https://', async () => {
    const { getSkillEntries } = await import('../../lib/content/skills')
    const entries = getSkillEntries()
    for (const entry of entries) {
      expect(
        entry.downloadUrl.startsWith('https://'),
        `${entry.slug} downloadUrl "${entry.downloadUrl}" must start with https://`
      ).toBe(true)
    }
  })

  it('all seed entries cover different categories (D-14) — unique category count equals 5', async () => {
    const { getSkillEntries } = await import('../../lib/content/skills')
    const entries = getSkillEntries()
    const uniqueCategories = new Set(entries.map((e) => e.category))
    expect(uniqueCategories.size).toBe(5)
  })

  it('at least one entry content contains a markdown bullet list', async () => {
    const { getSkillEntries } = await import('../../lib/content/skills')
    const entries = getSkillEntries()
    const hasListEntry = entries.some((e) => e.content.includes('- '))
    expect(hasListEntry, 'At least one skill pack should have a markdown bullet list in content').toBe(true)
  })
})
