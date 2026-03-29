// src/__tests__/content.test.ts
// Tests for FOUN-03: content storage structure
// Tests for FOUN-04: typed content access layer
// Stub: failing tests will be replaced by real assertions in plan 01-03.

import { describe, it, expect } from 'vitest'

describe('content storage structure (FOUN-03)', () => {
  it.todo('content/diary/ directory exists')
  it.todo('content/articles/ directory exists')
  it.todo('content/science/ directory exists')
  it.todo('content/skills/ directory exists')
  it.todo('day-001.mdx exists in content/diary/ with valid frontmatter')
})

describe('content access layer (FOUN-04)', () => {
  it.todo('getDiaryEntries returns an array')
  it.todo('getDiaryEntries returns day-001 entry with title field')
  it.todo('getDiaryEntry("day-001") returns the correct entry')
  it.todo('DiaryFrontmatterSchema rejects entry missing required dayNumber field')
  it.todo('lib/content/diary.ts imports server-only guard')
})
