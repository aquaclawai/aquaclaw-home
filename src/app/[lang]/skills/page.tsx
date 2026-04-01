// src/app/[lang]/skills/page.tsx
import { getSkillEntries } from '../../../../lib/content/skills'
import { getDictionary, type Locale } from '@/lib/i18n/getDictionary'
import { SkillFilterGrid } from '@/components/skills/SkillFilterGrid'

export const revalidate = 3600

interface SkillsPageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: SkillsPageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.skills.title,
    description: dict.skills.description,
  }
}

export default async function SkillsPage({ params }: SkillsPageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  const entries = getSkillEntries()

  // Derive unique categories server-side — sorted alphabetically
  const categories = Array.from(new Set(entries.map((e) => e.category))).sort()

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-12">
      {/* Page header */}
      <header className="mb-10">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          {dict.skills.title}
        </h1>
        <p className="font-sans text-foreground/70">
          {dict.skills.description}
        </p>
      </header>

      {/* Client-side filter grid island — receives all entries and categories as serializable props */}
      <SkillFilterGrid
        entries={entries}
        categories={categories}
        lang={lang}
        dict={{
          allCategories: dict.skills.allCategories,
          noSkills: dict.skills.noSkills,
        }}
      />
    </div>
  )
}
