// src/app/[lang]/science/page.tsx
import { getScienceEntries } from '../../../../lib/content/science'
import { getDictionary, type Locale } from '@/lib/i18n/getDictionary'
import { ScienceCard } from '@/components/science/ScienceCard'
import { ScienceCardGrid } from '@/components/science/ScienceCardGrid'
import { PaginationBar } from '@/components/diary/PaginationBar'

export const revalidate = 3600

const PAGE_SIZE = 12

interface SciencePageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: SciencePageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.science.title,
    description: dict.science.description,
  }
}

export default async function SciencePage({ params }: SciencePageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  const entries = await getScienceEntries()
  const pageEntries = entries.slice(0, PAGE_SIZE)
  const totalPages = Math.ceil(entries.length / PAGE_SIZE)

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-12">
      {/* Page header */}
      <header className="mb-10">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          {dict.science.title}
        </h1>
        <p className="font-sans text-foreground/70">
          {dict.science.description}
        </p>
      </header>

      {/* Explainer grid */}
      {pageEntries.length > 0 ? (
        <ScienceCardGrid>
          {pageEntries.map((entry) => (
            <ScienceCard
              key={entry.slug}
              entry={entry}
              lang={lang}
              dict={{ difficulty: dict.science.difficulty }}
            />
          ))}
        </ScienceCardGrid>
      ) : (
        <p className="font-sans text-foreground/60 text-center py-16">
          {dict.science.noExplainers}
        </p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12">
          <PaginationBar
            currentPage={1}
            totalPages={totalPages}
            lang={lang}
            basePath="science"
          />
        </div>
      )}
    </div>
  )
}
