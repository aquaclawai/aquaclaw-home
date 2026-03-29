// lib/content/diary.ts
import 'server-only'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { DiaryFrontmatterSchema, type DiaryFrontmatter } from './schemas.js'

export interface DiaryEntry extends DiaryFrontmatter {
  slug: string
  content: string
}

export function getDiaryEntries(): DiaryEntry[] {
  const dir = path.join(process.cwd(), 'content/diary')
  if (!fs.existsSync(dir)) return []
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))
  return files
    .map((filename) => {
      const raw = fs.readFileSync(path.join(dir, filename), 'utf-8')
      const { data, content } = matter(raw)
      // D-03: fail build with descriptive error on invalid frontmatter
      const parsed = DiaryFrontmatterSchema.safeParse(data)
      if (!parsed.success) {
        throw new Error(
          `Invalid frontmatter in content/diary/${filename}:\n${parsed.error.message}`
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

export function getDiaryEntry(slug: string): DiaryEntry | null {
  return getDiaryEntries().find((e) => e.slug === slug) ?? null
}
