// lib/content/diary.ts
import 'server-only'
import { getContentIndex, getContentBySlug } from './blob'
import type { DiaryFrontmatter } from './schemas'

export interface DiaryEntry extends DiaryFrontmatter {
  slug: string
  content: string
}

export async function getDiaryEntries(): Promise<DiaryEntry[]> {
  const index = await getContentIndex<DiaryFrontmatter>('diary')
  return index
    .map((e) => ({
      ...e.metadata,
      slug: e.slug,
      content: '',
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getDiaryEntry(slug: string): Promise<DiaryEntry | null> {
  const blob = await getContentBySlug<DiaryFrontmatter>('diary', slug)
  if (!blob) return null
  return {
    ...blob.metadata,
    slug: blob.slug,
    content: blob.content,
  }
}
