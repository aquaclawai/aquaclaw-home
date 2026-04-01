// src/__tests__/articles.test.ts
// Tests for articles section: ARTC-01, ARTC-02
// Covers: pagination logic, prev/next logic, seed article validation

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

describe('articles pagination logic', () => {
  const makeEntries = (n: number) =>
    Array.from({ length: n }, (_, i) => ({ slug: `article-${i + 1}` }))

  it('page 1 returns first 12 entries when 20 total', () => {
    const entries = makeEntries(20)
    const page1 = paginateEntries(entries, 1, PAGE_SIZE)
    expect(page1).toHaveLength(12)
    expect(page1[0]?.slug).toBe('article-1')
    expect(page1[11]?.slug).toBe('article-12')
  })

  it('page 2 returns entries 13-20 when 20 total', () => {
    const entries = makeEntries(20)
    const page2 = paginateEntries(entries, 2, PAGE_SIZE)
    expect(page2).toHaveLength(8)
    expect(page2[0]?.slug).toBe('article-13')
    expect(page2[7]?.slug).toBe('article-20')
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
// Prev/next logic tests (newest-first array, no dayNumber)
// ---------------------------------------------------------------------------

describe('articles prev/next navigation logic', () => {
  // Newest-first: article-5, article-4, article-3, article-2, article-1
  const entries = [
    { slug: 'article-5', title: 'Article 5' },
    { slug: 'article-4', title: 'Article 4' },
    { slug: 'article-3', title: 'Article 3' },
    { slug: 'article-2', title: 'Article 2' },
    { slug: 'article-1', title: 'Article 1' },
  ]

  it('first entry (newest, article-5) has no nextEntry and has prevEntry=article-4', () => {
    const { prevEntry, nextEntry } = getPrevNext(entries, 'article-5')
    expect(nextEntry).toBeNull()
    expect(prevEntry?.slug).toBe('article-4')
  })

  it('last entry (oldest, article-1) has no prevEntry and has nextEntry=article-2', () => {
    const { prevEntry, nextEntry } = getPrevNext(entries, 'article-1')
    expect(prevEntry).toBeNull()
    expect(nextEntry?.slug).toBe('article-2')
  })

  it('middle entry (article-3) has prevEntry=article-2 and nextEntry=article-4', () => {
    const { prevEntry, nextEntry } = getPrevNext(entries, 'article-3')
    expect(prevEntry?.slug).toBe('article-2')
    expect(nextEntry?.slug).toBe('article-4')
  })

  it('returns null for both when slug not found', () => {
    const { prevEntry, nextEntry } = getPrevNext(entries, 'nonexistent')
    expect(prevEntry).toBeNull()
    expect(nextEntry).toBeNull()
  })

  it('article entries have no dayNumber property', () => {
    // Articles use title only (no Day N prefix) — verify the interface shape
    const entry = entries[0]!
    expect('dayNumber' in entry).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// Seed article validation via getArticleEntries()
// ---------------------------------------------------------------------------

describe('seed articles via getArticleEntries()', () => {
  const SEED_SLUGS = [
    'building-ai-agent-from-scratch',
    'understanding-large-language-models',
    'web-performance-tips-2026',
    'what-is-prompt-engineering',
    'how-this-site-was-built',
  ]

  it('all 5 seed MDX files exist on disk', () => {
    for (const slug of SEED_SLUGS) {
      const filePath = resolve(process.cwd(), `content/articles/${slug}.mdx`)
      expect(existsSync(filePath), `${slug}.mdx should exist`).toBe(true)
    }
  })

  it('getArticleEntries returns exactly 5 seed entries', async () => {
    const { getArticleEntries } = await import('../../lib/content/articles')
    const entries = getArticleEntries()
    expect(entries).toHaveLength(5)
  })

  it('getArticleEntries returns entries sorted newest-first (date descending)', async () => {
    const { getArticleEntries } = await import('../../lib/content/articles')
    const entries = getArticleEntries()
    for (let i = 0; i < entries.length - 1; i++) {
      const a = new Date(entries[i]!.date).getTime()
      const b = new Date(entries[i + 1]!.date).getTime()
      expect(a).toBeGreaterThanOrEqual(b)
    }
  })

  it('all seed articles have non-empty title, excerpt, and at least one tag', async () => {
    const { getArticleEntries } = await import('../../lib/content/articles')
    const entries = getArticleEntries()
    for (const entry of entries) {
      expect(entry.title.length, `${entry.slug} title`).toBeGreaterThan(0)
      expect(entry.excerpt.length, `${entry.slug} excerpt`).toBeGreaterThan(0)
      expect(entry.tags.length, `${entry.slug} tags`).toBeGreaterThanOrEqual(1)
    }
  })

  it('at least one article contains a code block (triple backtick)', async () => {
    const { getArticleEntries } = await import('../../lib/content/articles')
    const entries = getArticleEntries()
    const hasCodeBlock = entries.some((e) => e.content.includes('```'))
    expect(hasCodeBlock).toBe(true)
  })

  it('getArticleBySlug returns null for non-existent slug', async () => {
    const { getArticleBySlug } = await import('../../lib/content/articles')
    expect(getArticleBySlug('does-not-exist')).toBeNull()
  })

  it('getArticleBySlug returns the correct entry for a known slug', async () => {
    const { getArticleBySlug } = await import('../../lib/content/articles')
    const entry = getArticleBySlug('building-ai-agent-from-scratch')
    expect(entry).not.toBeNull()
    expect(entry?.title).toBeTruthy()
    expect(entry?.slug).toBe('building-ai-agent-from-scratch')
  })

  it('seed articles have no dayNumber property (unlike diary entries)', async () => {
    const { getArticleEntries } = await import('../../lib/content/articles')
    const entries = getArticleEntries()
    for (const entry of entries) {
      expect('dayNumber' in entry).toBe(false)
    }
  })
})
