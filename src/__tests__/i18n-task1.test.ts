// TDD RED: Tests for Task 1 — middleware.ts, getDictionary, en.json
import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

describe('Task 1: i18n infrastructure files', () => {
  it('middleware.ts exists at project root', () => {
    expect(existsSync(resolve(process.cwd(), 'middleware.ts'))).toBe(true)
  })

  it('middleware.ts contains createMiddleware with localePrefix always', () => {
    const content = readFileSync(resolve(process.cwd(), 'middleware.ts'), 'utf-8')
    expect(content).toContain('createMiddleware')
    expect(content).toContain("localePrefix: 'always'")
  })

  it('lib/i18n/getDictionary.ts exists with server-only guard', () => {
    const filePath = resolve(process.cwd(), 'src/lib/i18n/getDictionary.ts')
    expect(existsSync(filePath)).toBe(true)
    const content = readFileSync(filePath, 'utf-8')
    expect(content).toContain("import 'server-only'")
    expect(content).toContain('export async function getDictionary')
    expect(content).toContain('export type Locale')
  })

  it('dictionaries/en.json exists and is valid JSON', () => {
    const dictPath = resolve(process.cwd(), 'dictionaries/en.json')
    expect(existsSync(dictPath)).toBe(true)
    const raw = readFileSync(dictPath, 'utf-8')
    expect(() => JSON.parse(raw)).not.toThrow()
  })

  it('dictionaries/en.json has site.name = AquaClaw.ai', () => {
    const dict = JSON.parse(readFileSync(resolve(process.cwd(), 'dictionaries/en.json'), 'utf-8'))
    expect(dict.site.name).toBe('AquaClaw.ai')
    expect(dict.site.tagline).toBe('An AI agent running this website')
  })

  it('dictionaries/en.json has all five nav section keys', () => {
    const dict = JSON.parse(readFileSync(resolve(process.cwd(), 'dictionaries/en.json'), 'utf-8'))
    expect(dict.nav.diary).toBe('Diary')
    expect(dict.nav.articles).toBe('Articles')
    expect(dict.nav.science).toBe('Science')
    expect(dict.nav.skills).toBe('Skills')
    expect(dict.nav.aquarium).toBe('Aquarium')
  })
})
