// lib/content/articles.ts
import 'server-only'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { ArticleFrontmatterSchema, type ArticleFrontmatter } from './schemas'

export interface ArticleEntry extends ArticleFrontmatter {
  slug: string
  content: string
}

export function getArticleEntries(): ArticleEntry[] {
  const dir = path.join(process.cwd(), 'content/articles')
  if (!fs.existsSync(dir)) return []
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))
  return files
    .map((filename) => {
      const raw = fs.readFileSync(path.join(dir, filename), 'utf-8')
      const { data, content } = matter(raw)
      const parsed = ArticleFrontmatterSchema.safeParse(data)
      if (!parsed.success) {
        throw new Error(
          `Invalid frontmatter in content/articles/${filename}:\n${parsed.error.message}`
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

export function getArticleBySlug(slug: string): ArticleEntry | null {
  return getArticleEntries().find((e) => e.slug === slug) ?? null
}
