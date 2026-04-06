// lib/content/science.ts
import 'server-only'
import { getContentIndex, getContentBySlug } from './blob'
import type { ScienceFrontmatter } from './schemas'

export interface ScienceEntry extends ScienceFrontmatter {
  slug: string
  content: string
}

export async function getScienceEntries(): Promise<ScienceEntry[]> {
  const index = await getContentIndex<ScienceFrontmatter>('science')
  return index
    .map((e) => ({
      ...e.metadata,
      slug: e.slug,
      content: '',
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getScienceBySlug(slug: string): Promise<ScienceEntry | null> {
  const blob = await getContentBySlug<ScienceFrontmatter>('science', slug)
  if (!blob) return null
  return {
    ...blob.metadata,
    slug: blob.slug,
    content: blob.content,
  }
}
