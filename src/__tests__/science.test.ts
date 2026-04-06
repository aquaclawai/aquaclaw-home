// src/__tests__/science.test.ts
// Tests for science section: SCIE-01, SCIE-02
// Covers: pagination logic, prev/next logic, seed science validation, difficulty field

import { describe, it, expect } from 'vitest'
import { existsSync } from 'fs'
import { resolve } from 'path'

const PAGE_SIZE = 12

// ---------------------------------------------------------------------------
// Pure helper functions mirroring page logic (extracted for testability)
// ---------------------------------------------------------------------------

function paginateEntries<T>(entries: T[], pageNum: number, pageSize: number): T[] {
  return entries.slice((pageNum - 1) * pageSize, pageNum * pageSize)
}

function getTotalPages<T>(entries: T[], pageSize: number): number {
  return Math.ceil(entries.length / pageSize)
}

interface Slugged {
  slug: string
}

function getPrevNext<T extends Slugged>(entries: T[], currentSlug: string) {
  // entries are newest-first
  const idx = entries.findIndex((e) => e.slug === currentSlug)
  if (idx === -1) return { prevEntry: null, nextEntry: null }
  const prevEntry = idx < entries.length - 1 ? entries[idx + 1] : null // older
  const nextEntry = idx > 0 ? entries[idx - 1] : null // newer
  return { prevEntry, nextEntry }
}

// ---------------------------------------------------------------------------
// Pagination logic tests
// ---------------------------------------------------------------------------

describe('science pagination logic', () => {
  const makeEntries = (n: number) =>
    Array.from({ length: n }, (_, i) => ({ slug: `explainer-${i + 1}` }))

  it('page 1 returns first 12 entries when 20 total', () => {
    const entries = makeEntries(20)
    const page1 = paginateEntries(entries, 1, PAGE_SIZE)
    expect(page1).toHaveLength(12)
    expect(page1[0]?.slug).toBe('explainer-1')
    expect(page1[11]?.slug).toBe('explainer-12')
  })

  it('page 2 returns entries 13-20 when 20 total', () => {
    const entries = makeEntries(20)
    const page2 = paginateEntries(entries, 2, PAGE_SIZE)
    expect(page2).toHaveLength(8)
    expect(page2[0]?.slug).toBe('explainer-13')
    expect(page2[7]?.slug).toBe('explainer-20')
  })

  it('totalPages is 1 for exactly 12 entries', () => {
    expect(getTotalPages(makeEntries(12), PAGE_SIZE)).toBe(1)
  })

  it('totalPages is 2 for 13 entries', () => {
    expect(getTotalPages(makeEntries(13), PAGE_SIZE)).toBe(2)
  })

  it('totalPages is 1 for 5 seed entries', () => {
    expect(getTotalPages(makeEntries(5), PAGE_SIZE)).toBe(1)
  })

  it('page 1 of 5 entries returns all 5', () => {
    const entries = makeEntries(5)
    const page1 = paginateEntries(entries, 1, PAGE_SIZE)
    expect(page1).toHaveLength(5)
  })
})

// ---------------------------------------------------------------------------
// Prev/next logic tests (newest-first array)
// ---------------------------------------------------------------------------

describe('science prev/next navigation logic', () => {
  // Newest-first: explainer-5, explainer-4, explainer-3, explainer-2, explainer-1
  const entries = [
    { slug: 'explainer-5', title: 'Explainer 5' },
    { slug: 'explainer-4', title: 'Explainer 4' },
    { slug: 'explainer-3', title: 'Explainer 3' },
    { slug: 'explainer-2', title: 'Explainer 2' },
    { slug: 'explainer-1', title: 'Explainer 1' },
  ]

  it('first entry (newest, explainer-5) has no nextEntry and has prevEntry=explainer-4', () => {
    const { prevEntry, nextEntry } = getPrevNext(entries, 'explainer-5')
    expect(nextEntry).toBeNull()
    expect(prevEntry?.slug).toBe('explainer-4')
  })

  it('last entry (oldest, explainer-1) has no prevEntry and has nextEntry=explainer-2', () => {
    const { prevEntry, nextEntry } = getPrevNext(entries, 'explainer-1')
    expect(prevEntry).toBeNull()
    expect(nextEntry?.slug).toBe('explainer-2')
  })

  it('middle entry (explainer-3) has prevEntry=explainer-2 and nextEntry=explainer-4', () => {
    const { prevEntry, nextEntry } = getPrevNext(entries, 'explainer-3')
    expect(prevEntry?.slug).toBe('explainer-2')
    expect(nextEntry?.slug).toBe('explainer-4')
  })

  it('returns null for both when slug not found', () => {
    const { prevEntry, nextEntry } = getPrevNext(entries, 'nonexistent')
    expect(prevEntry).toBeNull()
    expect(nextEntry).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// Seed science validation via getScienceEntries()
// ---------------------------------------------------------------------------

describe('seed science explainers via getScienceEntries()', () => {
  const SEED_SLUGS = [
    'what-is-artificial-intelligence',
    'how-do-chatbots-work',
    'what-are-neural-networks',
    'understanding-machine-learning',
    'what-is-prompt-engineering',
  ]

  it('all 5 seed MDX files exist on disk', () => {
    for (const slug of SEED_SLUGS) {
      const filePath = resolve(process.cwd(), `content/science/${slug}.mdx`)
      expect(existsSync(filePath), `${slug}.mdx should exist`).toBe(true)
    }
  })

  it('getScienceEntries returns exactly 5 seed entries', async () => {
    const { getScienceEntries } = await import('../../lib/content/science')
    const entries = await getScienceEntries()
    expect(entries).toHaveLength(5)
  })

  it('getScienceEntries returns entries sorted newest-first (date descending)', async () => {
    const { getScienceEntries } = await import('../../lib/content/science')
    const entries = await getScienceEntries()
    for (let i = 0; i < entries.length - 1; i++) {
      const a = new Date(entries[i]!.date).getTime()
      const b = new Date(entries[i + 1]!.date).getTime()
      expect(a).toBeGreaterThanOrEqual(b)
    }
  })

  it('all seed entries have non-empty title, excerpt, and at least one tag', async () => {
    const { getScienceEntries } = await import('../../lib/content/science')
    const entries = await getScienceEntries()
    for (const entry of entries) {
      expect(entry.title.length, `${entry.slug} title`).toBeGreaterThan(0)
      expect(entry.excerpt.length, `${entry.slug} excerpt`).toBeGreaterThan(0)
      expect(entry.tags.length, `${entry.slug} tags`).toBeGreaterThanOrEqual(1)
    }
  })

  it('getScienceBySlug returns null for non-existent slug', async () => {
    const { getScienceBySlug } = await import('../../lib/content/science')
    expect(await getScienceBySlug('does-not-exist')).toBeNull()
  })

  it('getScienceBySlug returns the correct entry for a known slug', async () => {
    const { getScienceBySlug } = await import('../../lib/content/science')
    const entry = await getScienceBySlug('what-is-artificial-intelligence')
    expect(entry).not.toBeNull()
    expect(entry?.title).toBeTruthy()
    expect(entry?.slug).toBe('what-is-artificial-intelligence')
  })

  // Science-specific: difficulty field validation
  const VALID_DIFFICULTIES = ['beginner', 'intermediate', 'advanced']

  it('all seed entries have a valid difficulty field', async () => {
    const { getScienceEntries } = await import('../../lib/content/science')
    const entries = await getScienceEntries()
    for (const entry of entries) {
      expect(
        VALID_DIFFICULTIES.includes(entry.difficulty),
        `${entry.slug} difficulty "${entry.difficulty}" must be beginner, intermediate, or advanced`
      ).toBe(true)
    }
  })

  it('at least one entry is beginner difficulty', async () => {
    const { getScienceEntries } = await import('../../lib/content/science')
    const entries = await getScienceEntries()
    const hasBeginnerEntry = entries.some((e) => e.difficulty === 'beginner')
    expect(hasBeginnerEntry).toBe(true)
  })

  it('at least one entry is intermediate difficulty', async () => {
    const { getScienceEntries } = await import('../../lib/content/science')
    const entries = await getScienceEntries()
    const hasIntermediateEntry = entries.some((e) => e.difficulty === 'intermediate')
    expect(hasIntermediateEntry).toBe(true)
  })
})
