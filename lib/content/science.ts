// lib/content/science.ts
import 'server-only'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { ScienceFrontmatterSchema, type ScienceFrontmatter } from './schemas.js'

export interface ScienceEntry extends ScienceFrontmatter {
  slug: string
  content: string
}

export function getScienceEntries(): ScienceEntry[] {
  const dir = path.join(process.cwd(), 'content/science')
  if (!fs.existsSync(dir)) return []
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))
  return files
    .map((filename) => {
      const raw = fs.readFileSync(path.join(dir, filename), 'utf-8')
      const { data, content } = matter(raw)
      const parsed = ScienceFrontmatterSchema.safeParse(data)
      if (!parsed.success) {
        throw new Error(
          `Invalid frontmatter in content/science/${filename}:\n${parsed.error.message}`
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

export function getScienceBySlug(slug: string): ScienceEntry | null {
  return getScienceEntries().find((e) => e.slug === slug) ?? null
}
