// src/__tests__/i18n.test.ts
// Tests for FOUN-02: i18n routing architecture with next-intl
// These tests verify the structure and exports of the i18n layer.
// Stub: failing tests will be replaced by real assertions in plan 01-02.

import { describe, it, expect } from 'vitest'

describe('i18n architecture (FOUN-02)', () => {
  it.todo('middleware.ts exports a default function (next-intl createMiddleware)')
  it.todo('getDictionary returns English strings for locale "en"')
  it.todo('getDictionary contains site.name key')
  it.todo('dictionaries/en.json exists and is valid JSON')
  it.todo('app/[lang]/layout.tsx exists')
})
