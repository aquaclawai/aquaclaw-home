// lib/content/skills.ts
import 'server-only'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { SkillFrontmatterSchema, type SkillFrontmatter } from './schemas'

export interface SkillEntry extends SkillFrontmatter {
  slug: string
  content: string
}

export function getSkillEntries(): SkillEntry[] {
  const dir = path.join(process.cwd(), 'content/skills')
  if (!fs.existsSync(dir)) return []
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))
  return files
    .map((filename) => {
      const raw = fs.readFileSync(path.join(dir, filename), 'utf-8')
      const { data, content } = matter(raw)
      const parsed = SkillFrontmatterSchema.safeParse(data)
      if (!parsed.success) {
        throw new Error(
          `Invalid frontmatter in content/skills/${filename}:\n${parsed.error.message}`
        )
      }
      return {
        ...parsed.data,
        slug: parsed.data.slug ?? filename.replace('.mdx', ''),
        content,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getSkillBySlug(slug: string): SkillEntry | null {
  return getSkillEntries().find((e) => e.slug === slug) ?? null
}
