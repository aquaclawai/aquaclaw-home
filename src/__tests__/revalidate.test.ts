// src/__tests__/revalidate.test.ts
// Tests for ISR revalidation webhook endpoint (AUTO-03)

import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock next/cache before importing the route
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// Mock next/server for NextResponse
vi.mock('next/server', () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      body,
      json: async () => body,
    }),
  },
}))

const VALID_SECRET = 'test-secret-123'

describe('POST /api/revalidate', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    process.env.REVALIDATION_SECRET = VALID_SECRET
  })

  function makeRequest(
    options: {
      method?: string
      authHeader?: string | null
      body?: unknown
    } = {}
  ): Request {
    const { method = 'POST', authHeader = `Bearer ${VALID_SECRET}`, body } = options

    const headers = new Headers()
    if (authHeader !== null) {
      headers.set('Authorization', authHeader)
    }
    headers.set('Content-Type', 'application/json')

    return new Request('http://localhost/api/revalidate', {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  }

  it('returns 401 when Authorization header is missing', async () => {
    const { POST } = await import('@/app/api/revalidate/route')
    const req = makeRequest({ authHeader: null, body: { paths: ['/en/diary'] } })
    const res = await POST(req)
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data).toEqual({ error: 'Missing or invalid secret' })
  })

  it('returns 401 when Bearer token is incorrect', async () => {
    const { POST } = await import('@/app/api/revalidate/route')
    const req = makeRequest({ authHeader: 'Bearer wrong-token', body: { paths: ['/en/diary'] } })
    const res = await POST(req)
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data).toEqual({ error: 'Missing or invalid secret' })
  })

  it('returns 401 when Authorization header has wrong format', async () => {
    const { POST } = await import('@/app/api/revalidate/route')
    const req = makeRequest({ authHeader: VALID_SECRET, body: { paths: ['/en/diary'] } })
    const res = await POST(req)
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data).toEqual({ error: 'Missing or invalid secret' })
  })

  it('returns 200 with valid auth and single path', async () => {
    const { revalidatePath } = await import('next/cache')
    const { POST } = await import('@/app/api/revalidate/route')
    const req = makeRequest({ body: { paths: ['/en/diary'] } })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toEqual({ revalidated: true, paths: ['/en/diary'] })
    expect(revalidatePath).toHaveBeenCalledWith('/en/diary')
    expect(revalidatePath).toHaveBeenCalledTimes(1)
  })

  it('returns 200 and revalidates multiple paths', async () => {
    const { revalidatePath } = await import('next/cache')
    const { POST } = await import('@/app/api/revalidate/route')
    const paths = ['/en/diary', '/en/articles']
    const req = makeRequest({ body: { paths } })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toEqual({ revalidated: true, paths })
    expect(revalidatePath).toHaveBeenCalledTimes(2)
    expect(revalidatePath).toHaveBeenCalledWith('/en/diary')
    expect(revalidatePath).toHaveBeenCalledWith('/en/articles')
  })

  it('returns 400 when paths field is missing', async () => {
    const { POST } = await import('@/app/api/revalidate/route')
    const req = makeRequest({ body: {} })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data).toHaveProperty('error')
    expect(typeof data.error).toBe('string')
  })

  it('returns 400 when paths is an empty array', async () => {
    const { POST } = await import('@/app/api/revalidate/route')
    const req = makeRequest({ body: { paths: [] } })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data).toHaveProperty('error')
  })

  it('returns 400 when paths is not an array', async () => {
    const { POST } = await import('@/app/api/revalidate/route')
    const req = makeRequest({ body: { paths: '/en/diary' } })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data).toHaveProperty('error')
  })

  it('returns 400 when body is malformed JSON', async () => {
    const { POST } = await import('@/app/api/revalidate/route')
    const headers = new Headers()
    headers.set('Authorization', `Bearer ${VALID_SECRET}`)
    headers.set('Content-Type', 'application/json')
    const req = new Request('http://localhost/api/revalidate', {
      method: 'POST',
      headers,
      body: 'not-valid-json{',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data).toHaveProperty('error')
  })
})
