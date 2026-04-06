// src/app/[lang]/science/page/[page]/page.tsx
import { notFound, redirect } from 'next/navigation'
import { getScienceEntries } from '../../../../../../lib/content/science'
import { getDictionary, type Locale } from '@/lib/i18n/getDictionary'
import { ScienceCard } from '@/components/science/ScienceCard'
import { ScienceCardGrid } from '@/components/science/ScienceCardGrid'
import { PaginationBar } from '@/components/diary/PaginationBar'

export const revalidate = 3600

const PAGE_SIZE = 12

interface PaginationPageProps {
  params: Promise<{ lang: string; page: string }>
}

export async function generateStaticParams() {
  const entries = await getScienceEntries()
  const totalPages = Math.ceil(entries.length / PAGE_SIZE)
  const locales = ['en']
  return locales.flatMap((lang) =>
    Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
      lang,
      page: String(i + 2), // start at page 2 (page 1 is /science)
    }))
  )
}

export async function generateMetadata({ params }: PaginationPageProps) {
  const { lang, page } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: `${dict.science.title} — ${dict.science.page} ${page}`,
    description: dict.science.description,
  }
}

export default async function SciencePaginationPage({ params }: PaginationPageProps) {
  const { lang, page } = await params
  const pageNum = Number(page)
  const entries = await getScienceEntries()
  const totalPages = Math.ceil(entries.length / PAGE_SIZE)

  // Redirect page 1 to avoid duplicate content
  if (pageNum === 1) {
    redirect(`/${lang}/science`)
  }

  // Validate page range
  if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
    notFound()
  }

  const dict = await getDictionary(lang as Locale)
  const pageEntries = entries.slice((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE)

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
        <p className="font-sans text-sm text-foreground/50 mt-1">
          {dict.science.page} {pageNum} {dict.science.of} {totalPages}
        </p>
      </header>

      {/* Explainer grid */}
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

      {/* Pagination */}
      <div className="mt-12">
        <PaginationBar
          currentPage={pageNum}
          totalPages={totalPages}
          lang={lang}
          basePath="science"
        />
      </div>
    </div>
  )
}
