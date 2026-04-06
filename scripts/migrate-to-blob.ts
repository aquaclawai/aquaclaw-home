// scripts/migrate-to-blob.ts
// One-time migration: reads existing MDX files from content/ and uploads to Vercel Blob.
// Run with: npx tsx scripts/migrate-to-blob.ts
//
// Requires BLOB_READ_WRITE_TOKEN in .env.local (run `vercel env pull` first).

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { put, get } from '@vercel/blob'
import { config } from 'dotenv'

// Load .env.local
config({ path: path.join(process.cwd(), '.env.local') })

interface ContentEntry {
  type: string
  slug: string
  metadata: Record<string, unknown>
  content: string
  createdAt: string
  updatedAt: string
}

const CONTENT_TYPES = ['diary', 'articles', 'science', 'skills'] as const
const BLOB_PREFIX = 'content'

function blobPath(type: string, slug: string): string {
  return `${BLOB_PREFIX}/${type}/${slug}.json`
}

function indexPath(type: string): string {
  return `${BLOB_PREFIX}/${type}/_index.json`
}

async function migrateType(type: string): Promise<ContentEntry[]> {
  const dir = path.join(process.cwd(), 'content', type)
  if (!fs.existsSync(dir)) {
    console.log(`  Skipping ${type}/ — directory not found`)
    return []
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))
  console.log(`  Found ${files.length} files in content/${type}/`)

  const entries: ContentEntry[] = []

  for (const filename of files) {
    const slug = filename.replace('.mdx', '')
    const raw = fs.readFileSync(path.join(dir, filename), 'utf-8')
    const { data, content } = matter(raw)

    const now = new Date().toISOString()
    const entry: ContentEntry = {
      type,
      slug,
      metadata: data,
      content,
      createdAt: data.date ? new Date(data.date as string).toISOString() : now,
      updatedAt: now,
    }

    // Upload individual blob
    await put(blobPath(type, slug), JSON.stringify(entry), {
      access: 'public',
      contentType: 'application/json',
      allowOverwrite: true,
    })
    console.log(`    ✓ ${type}/${slug}`)

    entries.push(entry)
  }

  // Build and upload index (metadata only, no content body)
  const index = entries.map((e) => ({
    slug: e.slug,
    metadata: e.metadata,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  }))

  await put(indexPath(type), JSON.stringify(index), {
    access: 'public',
    contentType: 'application/json',
    allowOverwrite: true,
  })
  console.log(`    ✓ ${type}/_index.json (${index.length} entries)`)

  return entries
}

async function verify(type: string): Promise<boolean> {
  const result = await get(indexPath(type), { access: 'public' })
  if (!result) {
    console.log(`  ✗ ${type}/_index.json — NOT FOUND`)
    return false
  }
  const data = await new Response(result.stream).json()
  console.log(`  ✓ ${type}/_index.json — ${(data as unknown[]).length} entries`)
  return true
}

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('Error: BLOB_READ_WRITE_TOKEN not set. Run `vercel env pull` first.')
    process.exit(1)
  }

  console.log('Migrating content to Vercel Blob...\n')

  let totalEntries = 0
  for (const type of CONTENT_TYPES) {
    console.log(`[${type}]`)
    const entries = await migrateType(type)
    totalEntries += entries.length
  }

  console.log(`\nMigrated ${totalEntries} entries total.\n`)

  console.log('Verifying...')
  for (const type of CONTENT_TYPES) {
    await verify(type)
  }

  console.log('\nDone! Content is now in Vercel Blob.')
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
