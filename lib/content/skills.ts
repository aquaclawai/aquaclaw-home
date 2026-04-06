// lib/content/skills.ts
import 'server-only'
import { getContentIndex, getContentBySlug } from './blob'
import type { SkillFrontmatter } from './schemas'

export interface SkillEntry extends SkillFrontmatter {
  slug: string
  content: string
}

export async function getSkillEntries(): Promise<SkillEntry[]> {
  const index = await getContentIndex<SkillFrontmatter>('skills')
  return index
    .map((e) => ({
      ...e.metadata,
      slug: e.slug,
      content: '',
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getSkillBySlug(slug: string): Promise<SkillEntry | null> {
  const blob = await getContentBySlug<SkillFrontmatter>('skills', slug)
  if (!blob) return null
  return {
    ...blob.metadata,
    slug: blob.slug,
    content: blob.content,
  }
}
