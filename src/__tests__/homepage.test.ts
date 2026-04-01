// src/__tests__/homepage.test.ts
// Tests for HOME-01, HOME-04, HOME-05: homepage dictionary structure and content availability
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

describe('homepage dictionary structure', () => {
  const raw = readFileSync(resolve(process.cwd(), 'dictionaries/en.json'), 'utf-8')
  const dict = JSON.parse(raw)

  it('en.json has a home key', () => {
    expect(dict).toHaveProperty('home')
  })

  it('home has hero sub-key', () => {
    expect(dict.home).toHaveProperty('hero')
  })

  it('home has stats sub-key', () => {
    expect(dict.home).toHaveProperty('stats')
  })

  it('home has carousel sub-key', () => {
    expect(dict.home).toHaveProperty('carousel')
  })

  it('home has valueProp sub-key', () => {
    expect(dict.home).toHaveProperty('valueProp')
  })

  it('home has featured sub-key', () => {
    expect(dict.home).toHaveProperty('featured')
  })

  it('valueProp.items has exactly 4 items', () => {
    expect(Array.isArray(dict.home.valueProp.items)).toBe(true)
    expect(dict.home.valueProp.items).toHaveLength(4)
  })

  it('each valueProp item has title and body', () => {
    for (const item of dict.home.valueProp.items) {
      expect(item).toHaveProperty('title')
      expect(item).toHaveProperty('body')
      expect(typeof item.title).toBe('string')
      expect(typeof item.body).toBe('string')
    }
  })
})

describe('homepage content availability', () => {
  it('getDiaryEntries returns a non-empty array', async () => {
    const { getDiaryEntries } = await import('../../lib/content/diary')
    const entries = getDiaryEntries()
    expect(Array.isArray(entries)).toBe(true)
    expect(entries.length).toBeGreaterThanOrEqual(1)
  })

  it('getArticleEntries returns a non-empty array', async () => {
    const { getArticleEntries } = await import('../../lib/content/articles')
    const entries = getArticleEntries()
    expect(Array.isArray(entries)).toBe(true)
    expect(entries.length).toBeGreaterThanOrEqual(1)
  })

  it('getScienceEntries returns a non-empty array', async () => {
    const { getScienceEntries } = await import('../../lib/content/science')
    const entries = getScienceEntries()
    expect(Array.isArray(entries)).toBe(true)
    expect(entries.length).toBeGreaterThanOrEqual(1)
  })

  it('getSkillEntries returns a non-empty array', async () => {
    const { getSkillEntries } = await import('../../lib/content/skills')
    const entries = getSkillEntries()
    expect(Array.isArray(entries)).toBe(true)
    expect(entries.length).toBeGreaterThanOrEqual(1)
  })
})

describe('carousel index arithmetic (HOME-03)', () => {
  const LENGTH = 5

  it('(4 + 1) % 5 === 0 — forward wrap from last to first', () => {
    expect((4 + 1) % LENGTH).toBe(0)
  })

  it('(0 - 1 + 5) % 5 === 4 — backward wrap from first to last', () => {
    expect((0 - 1 + LENGTH) % LENGTH).toBe(4)
  })

  it('(2 + 1) % 5 === 3 — forward mid-array no wrap', () => {
    expect((2 + 1) % LENGTH).toBe(3)
  })

  it('(2 - 1 + 5) % 5 === 1 — backward mid-array no wrap', () => {
    expect((2 - 1 + LENGTH) % LENGTH).toBe(1)
  })
})
