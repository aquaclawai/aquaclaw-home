// lib/content/schemas.ts
import { z } from 'zod'

// D-01: Common frontmatter fields shared by all content types
const CommonFrontmatterSchema = z.object({
  title: z.string(),
  date: z.string(),
  excerpt: z.string(),
  thumbnail: z.string().optional(),
  slug: z.string().optional(), // falls back to filename if absent
  tags: z.array(z.string()).default([]),
})

// D-02: Type-specific extensions
export const DiaryFrontmatterSchema = CommonFrontmatterSchema.extend({
  dayNumber: z.number().int().positive(), // D-02: diary-specific
})

export const ArticleFrontmatterSchema = CommonFrontmatterSchema // no extension

export const ScienceFrontmatterSchema = CommonFrontmatterSchema.extend({
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']), // D-02: science-specific
})

export const SkillFrontmatterSchema = CommonFrontmatterSchema.extend({
  category: z.string(), // D-02: skill-specific
  downloadUrl: z.string().url(),
})

export type DiaryFrontmatter = z.infer<typeof DiaryFrontmatterSchema>
export type ArticleFrontmatter = z.infer<typeof ArticleFrontmatterSchema>
export type ScienceFrontmatter = z.infer<typeof ScienceFrontmatterSchema>
export type SkillFrontmatter = z.infer<typeof SkillFrontmatterSchema>
