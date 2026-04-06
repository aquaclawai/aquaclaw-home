// src/__tests__/diary.test.ts
// Tests for diary section: DIAR-01, DIAR-02
// Covers: pagination logic, prev/next logic, seed entry validation

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

describe('pagination logic', () => {
  const makeEntries = (n: number) =>
    Array.from({ length: n }, (_, i) => ({ slug: `entry-${i + 1}` }))

  it('page 1 returns first 12 entries when 20 total', () => {
    const entries = makeEntries(20)
    const page1 = paginateEntries(entries, 1, PAGE_SIZE)
    expect(page1).toHaveLength(12)
    expect(page1[0]?.slug).toBe('entry-1')
    expect(page1[11]?.slug).toBe('entry-12')
  })

  it('page 2 returns entries 13-20 when 20 total', () => {
    const entries = makeEntries(20)
    const page2 = paginateEntries(entries, 2, PAGE_SIZE)
    expect(page2).toHaveLength(8)
    expect(page2[0]?.slug).toBe('entry-13')
    expect(page2[7]?.slug).toBe('entry-20')
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

describe('prev/next navigation logic', () => {
  // Newest-first: entry-5, entry-4, entry-3, entry-2, entry-1
  const entries = [
    { slug: 'entry-5', dayNumber: 5 },
    { slug: 'entry-4', dayNumber: 4 },
    { slug: 'entry-3', dayNumber: 3 },
    { slug: 'entry-2', dayNumber: 2 },
    { slug: 'entry-1', dayNumber: 1 },
  ]

  it('first entry (newest, entry-5) has no nextEntry and has prevEntry=entry-4', () => {
    const { prevEntry, nextEntry } = getPrevNext(entries, 'entry-5')
    expect(nextEntry).toBeNull()
    expect(prevEntry?.slug).toBe('entry-4')
  })

  it('last entry (oldest, entry-1) has no prevEntry and has nextEntry=entry-2', () => {
    const { prevEntry, nextEntry } = getPrevNext(entries, 'entry-1')
    expect(prevEntry).toBeNull()
    expect(nextEntry?.slug).toBe('entry-2')
  })

  it('middle entry (entry-3) has prevEntry=entry-2 and nextEntry=entry-4', () => {
    const { prevEntry, nextEntry } = getPrevNext(entries, 'entry-3')
    expect(prevEntry?.slug).toBe('entry-2')
    expect(nextEntry?.slug).toBe('entry-4')
  })

  it('returns null for both when slug not found', () => {
    const { prevEntry, nextEntry } = getPrevNext(entries, 'nonexistent')
    expect(prevEntry).toBeNull()
    expect(nextEntry).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// Seed entry validation via getDiaryEntries()
// ---------------------------------------------------------------------------

describe('seed diary entries via getDiaryEntries()', () => {
  it('all 5 seed MDX files exist on disk', () => {
    for (let i = 1; i <= 5; i++) {
      const slug = `day-00${i}`
      const filePath = resolve(process.cwd(), `content/diary/${slug}.mdx`)
      expect(existsSync(filePath), `${slug}.mdx should exist`).toBe(true)
    }
  })

  it('getDiaryEntries returns exactly 5 seed entries', async () => {
    const { getDiaryEntries } = await import('../../lib/content/diary')
    const entries = await getDiaryEntries()
    expect(entries).toHaveLength(5)
  })

  it('getDiaryEntries returns entries sorted newest-first (date descending)', async () => {
    const { getDiaryEntries } = await import('../../lib/content/diary')
    const entries = await getDiaryEntries()
    for (let i = 0; i < entries.length - 1; i++) {
      const a = new Date(entries[i]!.date).getTime()
      const b = new Date(entries[i + 1]!.date).getTime()
      expect(a).toBeGreaterThanOrEqual(b)
    }
  })

  it('seed entries have dayNumber 1 through 5', async () => {
    const { getDiaryEntries } = await import('../../lib/content/diary')
    const entries = await getDiaryEntries()
    const dayNumbers = entries.map((e) => e.dayNumber).sort((a, b) => a - b)
    expect(dayNumbers).toEqual([1, 2, 3, 4, 5])
  })

  it('all seed entries have non-empty title, excerpt, and at least one tag', async () => {
    const { getDiaryEntries } = await import('../../lib/content/diary')
    const entries = await getDiaryEntries()
    for (const entry of entries) {
      expect(entry.title.length).toBeGreaterThan(0)
      expect(entry.excerpt.length).toBeGreaterThan(0)
      expect(entry.tags.length).toBeGreaterThanOrEqual(1)
    }
  })

  it('day-001 entry has cat persona indicators in excerpt or content', async () => {
    const { getDiaryEntry } = await import('../../lib/content/diary')
    const entry = await getDiaryEntry('day-001')
    expect(entry).not.toBeNull()
    // Cat persona: first person voice and cat-like language
    const text = `${entry!.excerpt} ${entry!.content}`.toLowerCase()
    // Look for first-person cat indicators
    const hasCatPersona =
      text.includes('cat') ||
      text.includes('paw') ||
      text.includes('nap') ||
      text.includes(' i ') ||
      text.includes("i'm") ||
      text.includes("i've")
    expect(hasCatPersona).toBe(true)
  })

  it('getDiaryEntry returns null for non-existent slug', async () => {
    const { getDiaryEntry } = await import('../../lib/content/diary')
    expect(await getDiaryEntry('does-not-exist')).toBeNull()
  })
})
