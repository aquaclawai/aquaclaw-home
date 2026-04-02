// src/__tests__/engagement.test.ts
// Tests for ENGG-01: Giscus comment widget on diary and article pages
import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

describe('GiscusComments component (ENGG-01)', () => {
  it('GiscusComments.tsx exists', () => {
    expect(
      existsSync(resolve(process.cwd(), 'src/components/engagement/GiscusComments.tsx'))
    ).toBe(true)
  })

  it('GiscusComments.tsx contains use client directive', () => {
    const content = readFileSync(
      resolve(process.cwd(), 'src/components/engagement/GiscusComments.tsx'),
      'utf-8'
    )
    expect(content).toContain("'use client'")
  })

  it('GiscusComments.tsx uses loading="lazy" for performance', () => {
    const content = readFileSync(
      resolve(process.cwd(), 'src/components/engagement/GiscusComments.tsx'),
      'utf-8'
    )
    expect(content).toContain('loading="lazy"')
  })

  it('GiscusComments.tsx imports from @giscus/react', () => {
    const content = readFileSync(
      resolve(process.cwd(), 'src/components/engagement/GiscusComments.tsx'),
      'utf-8'
    )
    expect(content).toMatch(/import.*@giscus\/react/)
  })

  it('GiscusComments.tsx gracefully returns null when env vars are missing', () => {
    const content = readFileSync(
      resolve(process.cwd(), 'src/components/engagement/GiscusComments.tsx'),
      'utf-8'
    )
    expect(content).toContain('return null')
  })
})

describe('diary detail page embeds GiscusComments (ENGG-01)', () => {
  it('diary slug page imports GiscusComments', () => {
    const content = readFileSync(
      resolve(process.cwd(), 'src/app/[lang]/diary/[slug]/page.tsx'),
      'utf-8'
    )
    expect(content).toContain('GiscusComments')
  })

  it('diary slug page imports from engagement module', () => {
    const content = readFileSync(
      resolve(process.cwd(), 'src/app/[lang]/diary/[slug]/page.tsx'),
      'utf-8'
    )
    expect(content).toMatch(/import.*GiscusComments.*from.*engagement/)
  })
})

describe('article detail page embeds GiscusComments (ENGG-01)', () => {
  it('articles slug page imports GiscusComments', () => {
    const content = readFileSync(
      resolve(process.cwd(), 'src/app/[lang]/articles/[slug]/page.tsx'),
      'utf-8'
    )
    expect(content).toContain('GiscusComments')
  })

  it('articles slug page imports from engagement module', () => {
    const content = readFileSync(
      resolve(process.cwd(), 'src/app/[lang]/articles/[slug]/page.tsx'),
      'utf-8'
    )
    expect(content).toMatch(/import.*GiscusComments.*from.*engagement/)
  })
})

describe('.env.example has Giscus placeholders (ENGG-01)', () => {
  it('.env.example contains NEXT_PUBLIC_GISCUS_REPO_ID', () => {
    const content = readFileSync(resolve(process.cwd(), '.env.example'), 'utf-8')
    expect(content).toContain('NEXT_PUBLIC_GISCUS_REPO_ID')
  })

  it('.env.example contains NEXT_PUBLIC_GISCUS_CATEGORY_ID', () => {
    const content = readFileSync(resolve(process.cwd(), '.env.example'), 'utf-8')
    expect(content).toContain('NEXT_PUBLIC_GISCUS_CATEGORY_ID')
  })
})
