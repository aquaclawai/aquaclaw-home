// src/__mocks__/blob.ts
// Filesystem-backed mock of lib/content/blob.ts for testing.
// Reads content from content/ directory just like the old loaders did.
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { ContentType, ContentIndexEntry, ContentBlob } from '../../lib/content/blob'

export type { ContentType, ContentIndexEntry, ContentBlob }

export async function getContentIndex<T>(type: ContentType): Promise<ContentIndexEntry<T>[]> {
  const dir = path.join(process.cwd(), 'content', type)
  if (!fs.existsSync(dir)) return []
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))

  return files.map((filename) => {
    const slug = filename.replace('.mdx', '')
    const raw = fs.readFileSync(path.join(dir, filename), 'utf-8')
    const { data } = matter(raw)
    const now = new Date().toISOString()
    return {
      slug,
      metadata: data as T,
      createdAt: data.date ? new Date(data.date as string).toISOString() : now,
      updatedAt: now,
    }
  })
}

export async function getContentBySlug<T>(
  type: ContentType,
  slug: string,
): Promise<ContentBlob<T> | null> {
  const dir = path.join(process.cwd(), 'content', type)
  const filePath = path.join(dir, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const now = new Date().toISOString()

  return {
    type,
    slug,
    metadata: data as T,
    content,
    createdAt: data.date ? new Date(data.date as string).toISOString() : now,
    updatedAt: now,
  }
}

export async function putContent(): Promise<never> {
  throw new Error('putContent not available in test environment')
}

export async function deleteContent(): Promise<never> {
  throw new Error('deleteContent not available in test environment')
}
