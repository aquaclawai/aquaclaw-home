// src/__tests__/rss.test.ts
// Tests for ENGG-02: RSS feeds for all content sections
import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

describe('RSS Route Handlers (ENGG-02)', () => {
  it('src/app/rss/diary.xml/route.ts exists', () => {
    expect(existsSync(resolve(process.cwd(), 'src/app/rss/diary.xml/route.ts'))).toBe(true)
  })

  it('src/app/rss/articles.xml/route.ts exists', () => {
    expect(existsSync(resolve(process.cwd(), 'src/app/rss/articles.xml/route.ts'))).toBe(true)
  })

  it('src/app/rss/science.xml/route.ts exists', () => {
    expect(existsSync(resolve(process.cwd(), 'src/app/rss/science.xml/route.ts'))).toBe(true)
  })

  it('diary RSS route exports a GET function', () => {
    const content = readFileSync(
      resolve(process.cwd(), 'src/app/rss/diary.xml/route.ts'),
      'utf-8'
    )
    expect(content).toContain('export async function GET')
  })

  it('articles RSS route exports a GET function', () => {
    const content = readFileSync(
      resolve(process.cwd(), 'src/app/rss/articles.xml/route.ts'),
      'utf-8'
    )
    expect(content).toContain('export async function GET')
  })

  it('science RSS route exports a GET function', () => {
    const content = readFileSync(
      resolve(process.cwd(), 'src/app/rss/science.xml/route.ts'),
      'utf-8'
    )
    expect(content).toContain('export async function GET')
  })

  it('diary RSS route imports getDiaryEntries', () => {
    const content = readFileSync(
      resolve(process.cwd(), 'src/app/rss/diary.xml/route.ts'),
      'utf-8'
    )
    expect(content).toContain('getDiaryEntries')
  })

  it('articles RSS route imports getArticleEntries', () => {
    const content = readFileSync(
      resolve(process.cwd(), 'src/app/rss/articles.xml/route.ts'),
      'utf-8'
    )
    expect(content).toContain('getArticleEntries')
  })

  it('science RSS route imports getScienceEntries', () => {
    const content = readFileSync(
      resolve(process.cwd(), 'src/app/rss/science.xml/route.ts'),
      'utf-8'
    )
    expect(content).toContain('getScienceEntries')
  })

  it('diary RSS route sets Content-Type to application/rss+xml', () => {
    const content = readFileSync(
      resolve(process.cwd(), 'src/app/rss/diary.xml/route.ts'),
      'utf-8'
    )
    expect(content).toContain('application/rss+xml')
  })

  it('articles RSS route sets Content-Type to application/rss+xml', () => {
    const content = readFileSync(
      resolve(process.cwd(), 'src/app/rss/articles.xml/route.ts'),
      'utf-8'
    )
    expect(content).toContain('application/rss+xml')
  })

  it('science RSS route sets Content-Type to application/rss+xml', () => {
    const content = readFileSync(
      resolve(process.cwd(), 'src/app/rss/science.xml/route.ts'),
      'utf-8'
    )
    expect(content).toContain('application/rss+xml')
  })

  it('root layout contains RSS autodiscovery metadata (application/rss+xml)', () => {
    const content = readFileSync(resolve(process.cwd(), 'src/app/layout.tsx'), 'utf-8')
    expect(content).toContain('application/rss+xml')
  })

  it('root layout contains diary RSS feed URL', () => {
    const content = readFileSync(resolve(process.cwd(), 'src/app/layout.tsx'), 'utf-8')
    expect(content).toContain('rss/diary.xml')
  })

  it('root layout contains articles RSS feed URL', () => {
    const content = readFileSync(resolve(process.cwd(), 'src/app/layout.tsx'), 'utf-8')
    expect(content).toContain('rss/articles.xml')
  })

  it('root layout contains science RSS feed URL', () => {
    const content = readFileSync(resolve(process.cwd(), 'src/app/layout.tsx'), 'utf-8')
    expect(content).toContain('rss/science.xml')
  })
})
