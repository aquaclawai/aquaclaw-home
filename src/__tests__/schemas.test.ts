// src/__tests__/schemas.test.ts
// TDD RED: Tests for Zod frontmatter schemas (FOUN-03)
import { describe, it, expect } from 'vitest'

describe('Zod frontmatter schemas', () => {
  it('DiaryFrontmatterSchema validates valid diary frontmatter', async () => {
    const { DiaryFrontmatterSchema } = await import('../../lib/content/schemas')
    const result = DiaryFrontmatterSchema.safeParse({
      title: 'T',
      date: '2026-03-28',
      excerpt: 'E',
      dayNumber: 1,
      tags: [],
    })
    expect(result.success).toBe(true)
  })

  it('DiaryFrontmatterSchema fails without dayNumber', async () => {
    const { DiaryFrontmatterSchema } = await import('../../lib/content/schemas')
    const result = DiaryFrontmatterSchema.safeParse({
      title: 'T',
      date: '2026-03-28',
      excerpt: 'E',
      tags: [],
    })
    expect(result.success).toBe(false)
  })

  it('ScienceFrontmatterSchema requires difficulty enum', async () => {
    const { ScienceFrontmatterSchema } = await import('../../lib/content/schemas')
    const valid = ScienceFrontmatterSchema.safeParse({
      title: 'T',
      date: '2026-03-28',
      excerpt: 'E',
      difficulty: 'beginner',
      tags: [],
    })
    expect(valid.success).toBe(true)

    const invalid = ScienceFrontmatterSchema.safeParse({
      title: 'T',
      date: '2026-03-28',
      excerpt: 'E',
      tags: [],
    })
    expect(invalid.success).toBe(false)
  })

  it('SkillFrontmatterSchema requires category and downloadUrl', async () => {
    const { SkillFrontmatterSchema } = await import('../../lib/content/schemas')
    const valid = SkillFrontmatterSchema.safeParse({
      title: 'T',
      date: '2026-03-28',
      excerpt: 'E',
      category: 'automation',
      downloadUrl: 'https://example.com/skill.zip',
      tags: [],
    })
    expect(valid.success).toBe(true)

    const missingCategory = SkillFrontmatterSchema.safeParse({
      title: 'T',
      date: '2026-03-28',
      excerpt: 'E',
      downloadUrl: 'https://example.com/skill.zip',
      tags: [],
    })
    expect(missingCategory.success).toBe(false)
  })

  it('ArticleFrontmatterSchema succeeds with common fields only', async () => {
    const { ArticleFrontmatterSchema } = await import('../../lib/content/schemas')
    const result = ArticleFrontmatterSchema.safeParse({
      title: 'T',
      date: '2026-03-28',
      excerpt: 'E',
      tags: [],
    })
    expect(result.success).toBe(true)
  })

  it('All four schemas are exported', async () => {
    const schemas = await import('../../lib/content/schemas')
    expect(schemas.DiaryFrontmatterSchema).toBeDefined()
    expect(schemas.ArticleFrontmatterSchema).toBeDefined()
    expect(schemas.ScienceFrontmatterSchema).toBeDefined()
    expect(schemas.SkillFrontmatterSchema).toBeDefined()
  })
})
