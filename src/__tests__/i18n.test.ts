// src/__tests__/i18n.test.ts
// Tests for FOUN-02: i18n routing architecture with next-intl
import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

describe('i18n architecture (FOUN-02)', () => {
  it('middleware.ts exists at project root', () => {
    const middlewarePath = resolve(process.cwd(), 'middleware.ts')
    expect(existsSync(middlewarePath)).toBe(true)
  })

  it('middleware.ts contains next-intl createMiddleware export', () => {
    const content = readFileSync(resolve(process.cwd(), 'middleware.ts'), 'utf-8')
    expect(content).toContain('createMiddleware')
    expect(content).toContain("localePrefix: 'always'")
  })

  it('dictionaries/en.json exists and is valid JSON', () => {
    const dictPath = resolve(process.cwd(), 'dictionaries/en.json')
    expect(existsSync(dictPath)).toBe(true)
    const raw = readFileSync(dictPath, 'utf-8')
    expect(() => JSON.parse(raw)).not.toThrow()
  })

  it('dictionaries/en.json contains site.name = AquaClaw.ai', () => {
    const dict = JSON.parse(readFileSync(resolve(process.cwd(), 'dictionaries/en.json'), 'utf-8'))
    expect(dict.site.name).toBe('AquaClaw.ai')
  })

  it('dictionaries/en.json contains all five nav section keys', () => {
    const dict = JSON.parse(readFileSync(resolve(process.cwd(), 'dictionaries/en.json'), 'utf-8'))
    expect(dict.nav.diary).toBe('Diary')
    expect(dict.nav.articles).toBe('Articles')
    expect(dict.nav.science).toBe('Science')
    expect(dict.nav.skills).toBe('Skills')
    expect(dict.nav.openclaw).toBe('OpenClaw')
  })

  it('app/[lang]/layout.tsx exists', () => {
    const layoutPath = resolve(process.cwd(), 'src/app/[lang]/layout.tsx')
    expect(existsSync(layoutPath)).toBe(true)
  })

  it('app/[lang]/page.tsx exists and does not hardcode strings', () => {
    const pagePath = resolve(process.cwd(), 'src/app/[lang]/page.tsx')
    expect(existsSync(pagePath)).toBe(true)
    const content = readFileSync(pagePath, 'utf-8')
    expect(content).toContain('getDictionary')
    expect(content).not.toContain('AquaClaw.ai') // no hardcoded string
  })

  it('lib/i18n/getDictionary.ts contains server-only guard', () => {
    const content = readFileSync(resolve(process.cwd(), 'lib/i18n/getDictionary.ts'), 'utf-8')
    expect(content).toContain("import 'server-only'")
  })
})
