// src/app/api/revalidate/route.ts
// ISR revalidation webhook endpoint for Aquarium autonomous publishing (AUTO-03)
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const BodySchema = z.object({
  paths: z.array(z.string()).min(1, 'paths must contain at least one entry'),
})

export async function POST(request: Request): Promise<NextResponse> {
  // Auth: validate Bearer token against REVALIDATION_SECRET
  const authHeader = request.headers.get('Authorization')
  const secret = process.env.REVALIDATION_SECRET

  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token || token !== secret) {
    return NextResponse.json({ error: 'Missing or invalid secret' }, { status: 401 })
  }

  // Parse and validate request body
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

  const { paths } = parsed.data

  // Trigger ISR revalidation for each path
  try {
    for (const path of paths) {
      revalidatePath(path)
    }
  } catch {
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
  }

  return NextResponse.json({ revalidated: true, paths }, { status: 200 })
}
