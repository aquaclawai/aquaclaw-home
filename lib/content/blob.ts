// lib/content/blob.ts
// Vercel Blob storage client for content CRUD operations.
// Each content type has an _index.json (metadata only, used for listings)
// and individual {slug}.json blobs (metadata + body, used for detail pages).
//
// Falls back to filesystem reading when BLOB_READ_WRITE_TOKEN is not set,
// enabling builds and local dev before Blob store is provisioned.
import 'server-only'
import {
  DiaryFrontmatterSchema,
  ArticleFrontmatterSchema,
  ScienceFrontmatterSchema,
  SkillFrontmatterSchema,
} from './schemas'
import type { z } from 'zod'

export type ContentType = 'diary' | 'articles' | 'science' | 'skills'

export interface ContentBlob<T = Record<string, unknown>> {
  type: ContentType
  slug: string
  metadata: T
  content: string
  createdAt: string
  updatedAt: string
}

export interface ContentIndexEntry<T = Record<string, unknown>> {
  slug: string
  metadata: T
  createdAt: string
  updatedAt: string
}

const BLOB_PREFIX = 'content'

function blobPath(type: ContentType, slug: string): string {
  return `${BLOB_PREFIX}/${type}/${slug}.json`
}

function indexPath(type: ContentType): string {
  return `${BLOB_PREFIX}/${type}/_index.json`
}

const schemaMap: Record<ContentType, z.ZodSchema> = {
  diary: DiaryFrontmatterSchema,
  articles: ArticleFrontmatterSchema,
  science: ScienceFrontmatterSchema,
  skills: SkillFrontmatterSchema,
}

function hasBlobToken(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN
}

// --- Filesystem fallback (used when Blob token is not available) ---

async function fsGetIndex<T>(type: ContentType): Promise<ContentIndexEntry<T>[]> {
  const fs = await import('fs')
  const path = await import('path')
  const matter = (await import('gray-matter')).default

  const dir = path.join(process.cwd(), 'content', type)
  if (!fs.existsSync(dir)) return []
  const files = fs.readdirSync(dir).filter((f: string) => f.endsWith('.mdx'))

  return files.map((filename: string) => {
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

async function fsGetBySlug<T>(type: ContentType, slug: string): Promise<ContentBlob<T> | null> {
  const fs = await import('fs')
  const path = await import('path')
  const matter = (await import('gray-matter')).default

  const filePath = path.join(process.cwd(), 'content', type, `${slug}.mdx`)
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

// --- Read operations ---

export async function getContentIndex<T>(type: ContentType): Promise<ContentIndexEntry<T>[]> {
  if (!hasBlobToken()) return fsGetIndex<T>(type)

  const { get } = await import('@vercel/blob')
  const result = await get(indexPath(type), { access: 'public' })
  if (!result) return []
  const entries = (await new Response(result.stream).json()) as ContentIndexEntry<T>[]
  return entries
}

export async function getContentBySlug<T>(
  type: ContentType,
  slug: string,
): Promise<ContentBlob<T> | null> {
  if (!hasBlobToken()) return fsGetBySlug<T>(type, slug)

  const { get } = await import('@vercel/blob')
  const result = await get(blobPath(type, slug), { access: 'public' })
  if (!result) return null
  return (await new Response(result.stream).json()) as ContentBlob<T>
}

// --- Write operations (require Blob token) ---

export async function putContent<T extends Record<string, unknown>>(
  type: ContentType,
  slug: string,
  metadata: T,
  content: string,
): Promise<ContentBlob<T>> {
  const { put, get } = await import('@vercel/blob')

  const schema = schemaMap[type]
  const parsed = schema.safeParse(metadata)
  if (!parsed.success) {
    throw new Error(`Invalid metadata for ${type}/${slug}: ${parsed.error.message}`)
  }

  const now = new Date().toISOString()

  // Check if existing to preserve createdAt
  const existingResult = await get(blobPath(type, slug), { access: 'public' })
  let existingCreatedAt: string | null = null
  if (existingResult) {
    const existing = (await new Response(existingResult.stream).json()) as ContentBlob<T>
    existingCreatedAt = existing.createdAt
  }

  const blob: ContentBlob<T> = {
    type,
    slug,
    metadata: parsed.data as T,
    content,
    createdAt: existingCreatedAt ?? now,
    updatedAt: now,
  }

  // Store individual blob
  await put(blobPath(type, slug), JSON.stringify(blob), {
    access: 'public',
    contentType: 'application/json',
    allowOverwrite: true,
  })

  // Update index
  const index = await getContentIndex<T>(type)
  const existingIdx = index.findIndex((e) => e.slug === slug)
  const indexEntry: ContentIndexEntry<T> = {
    slug,
    metadata: parsed.data as T,
    createdAt: blob.createdAt,
    updatedAt: blob.updatedAt,
  }

  if (existingIdx >= 0) {
    index[existingIdx] = indexEntry
  } else {
    index.push(indexEntry)
  }

  await put(indexPath(type), JSON.stringify(index), {
    access: 'public',
    contentType: 'application/json',
    allowOverwrite: true,
  })

  return blob
}

export async function deleteContent(type: ContentType, slug: string): Promise<void> {
  const { put, del } = await import('@vercel/blob')

  await del(blobPath(type, slug))

  const index = await getContentIndex(type)
  const updated = index.filter((e) => e.slug !== slug)
  await put(indexPath(type), JSON.stringify(updated), {
    access: 'public',
    contentType: 'application/json',
    allowOverwrite: true,
  })
}
