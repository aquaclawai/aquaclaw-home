'use client'

import { useState } from 'react'
import type { SkillEntry } from '../../../lib/content/skills'
import { SkillCard } from './SkillCard'
import { SkillCardGrid } from './SkillCardGrid'

interface SkillFilterGridProps {
  entries: SkillEntry[]
  categories: string[]
  lang: string
  dict: {
    allCategories: string
    noSkills: string
  }
}

export function SkillFilterGrid({
  entries,
  categories,
  lang,
  dict,
}: SkillFilterGridProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // null means "show all"
  const filtered = activeCategory
    ? entries.filter((e) => e.category === activeCategory)
    : entries

  return (
    <div>
      {/* Filter pill buttons */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-1.5 rounded-pill text-sm font-sans transition-colors ${
            activeCategory === null
              ? 'bg-primary text-white'
              : 'bg-muted text-foreground/70 hover:bg-muted/80'
          }`}
        >
          {dict.allCategories}
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-1.5 rounded-pill text-sm font-sans transition-colors ${
              activeCategory === category
                ? 'bg-primary text-white'
                : 'bg-muted text-foreground/70 hover:bg-muted/80'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Card grid or empty state */}
      {filtered.length > 0 ? (
        <SkillCardGrid>
          {filtered.map((entry) => (
            <SkillCard key={entry.slug} entry={entry} lang={lang} />
          ))}
        </SkillCardGrid>
      ) : (
        <p className="font-sans text-foreground/60 text-center py-12">
          {dict.noSkills}
        </p>
      )}
    </div>
  )
}
