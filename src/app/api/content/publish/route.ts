// src/app/api/content/publish/route.ts
// Content publish endpoint for OpenClaw agent.
// Accepts structured JSON, validates metadata, stores to Vercel Blob, revalidates paths.
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  DiaryFrontmatterSchema,
  ArticleFrontmatterSchema,
  ScienceFrontmatterSchema,
  SkillFrontmatterSchema,
} from '../../../../../lib/content/schemas'
import { putContent, deleteContent, type ContentType } from '../../../../../lib/content/blob'

const ContentTypeEnum = z.enum(['diary', 'articles', 'science', 'skills'])

const PublishBodySchema = z.object({
  type: ContentTypeEnum,
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'slug must be lowercase alphanumeric with hyphens'),
  metadata: z.record(z.string(), z.unknown()),
  content: z.string(),
})

const DeleteBodySchema = z.object({
  action: z.literal('delete'),
  type: ContentTypeEnum,
  slug: z.string().min(1),
})

const BodySchema = z.union([
  DeleteBodySchema,
  PublishBodySchema,
])

const schemaMap: Record<ContentType, z.ZodSchema> = {
  diary: DiaryFrontmatterSchema,
  articles: ArticleFrontmatterSchema,
  science: ScienceFrontmatterSchema,
  skills: SkillFrontmatterSchema,
}

function getRevalidationPaths(type: ContentType, slug: string): string[] {
  return [
    '/en',              // homepage (shows recent content)
    `/en/${type}`,      // listing page
    `/en/${type}/${slug}`, // detail page
  ]
}

export async function POST(request: Request): Promise<NextResponse> {
  // Auth: validate API key from x-api-key header
  const apiKey = request.headers.get('x-api-key')
  const secret = process.env.CONTENT_API_KEY

  if (!secret) {
    return NextResponse.json({ error: 'CONTENT_API_KEY not configured' }, { status: 500 })
  }

  if (!apiKey || apiKey !== secret) {
    return NextResponse.json({ error: 'Missing or invalid API key' }, { status: 401 })
  }

  // Parse request body
  let rawBody: unknown
  try {
    rawBody = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = BodySchema.safeParse(rawBody)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 })
  }

  const body = parsed.data

  // Handle delete
  if ('action' in body && body.action === 'delete') {
    try {
      await deleteContent(body.type, body.slug)
      const paths = getRevalidationPaths(body.type, body.slug)
      for (const path of paths) {
        revalidatePath(path)
      }
      return NextResponse.json({ deleted: true, slug: body.slug })
    } catch (err) {
      return NextResponse.json(
        { error: `Delete failed: ${err instanceof Error ? err.message : 'unknown'}` },
        { status: 500 },
      )
    }
  }

  // From here, body is a publish request (not delete)
  const publishBody = body as z.infer<typeof PublishBodySchema>

  // Validate type-specific metadata
  const schema = schemaMap[publishBody.type]
  const metaParsed = schema.safeParse(publishBody.metadata)
  if (!metaParsed.success) {
    return NextResponse.json(
      { error: `Invalid metadata: ${metaParsed.error.message}` },
      { status: 400 },
    )
  }

  // Store to Blob
  try {
    await putContent(publishBody.type, publishBody.slug, metaParsed.data as Record<string, unknown>, publishBody.content)
  } catch (err) {
    return NextResponse.json(
      { error: `Storage failed: ${err instanceof Error ? err.message : 'unknown'}` },
      { status: 500 },
    )
  }

  // Revalidate affected paths
  const paths = getRevalidationPaths(publishBody.type, publishBody.slug)
  for (const path of paths) {
    revalidatePath(path)
  }

  return NextResponse.json({
    published: true,
    slug: publishBody.slug,
    url: `/en/${publishBody.type}/${publishBody.slug}`,
    revalidated: paths,
  })
}
