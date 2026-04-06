// lib/content/articles.ts
import 'server-only'
import { getContentIndex, getContentBySlug } from './blob'
import type { ArticleFrontmatter } from './schemas'

export interface ArticleEntry extends ArticleFrontmatter {
  slug: string
  content: string
}

export async function getArticleEntries(): Promise<ArticleEntry[]> {
  const index = await getContentIndex<ArticleFrontmatter>('articles')
  return index
    .map((e) => ({
      ...e.metadata,
      slug: e.slug,
      content: '',
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getArticleBySlug(slug: string): Promise<ArticleEntry | null> {
  const blob = await getContentBySlug<ArticleFrontmatter>('articles', slug)
  if (!blob) return null
  return {
    ...blob.metadata,
    slug: blob.slug,
    content: blob.content,
  }
}
