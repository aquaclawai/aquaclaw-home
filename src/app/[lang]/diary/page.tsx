// src/app/[lang]/diary/page.tsx
import { getDiaryEntries } from '../../../../lib/content/diary'
import { getDictionary, type Locale } from '@/lib/i18n/getDictionary'
import { DiaryCard } from '@/components/diary/DiaryCard'
import { DiaryCardGrid } from '@/components/diary/DiaryCardGrid'
import { PaginationBar } from '@/components/diary/PaginationBar'

export const revalidate = 3600

const PAGE_SIZE = 12

interface DiaryPageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: DiaryPageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.diary.title,
    description: dict.diary.description,
  }
}

export default async function DiaryPage({ params }: DiaryPageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  const entries = await getDiaryEntries()
  const pageEntries = entries.slice(0, PAGE_SIZE)
  const totalPages = Math.ceil(entries.length / PAGE_SIZE)

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-12">
      {/* Page header */}
      <header className="mb-10">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          {dict.diary.title}
        </h1>
        <p className="font-sans text-foreground/70">
          {dict.diary.description}
        </p>
      </header>

      {/* Entry grid */}
      {pageEntries.length > 0 ? (
        <DiaryCardGrid>
          {pageEntries.map((entry) => (
            <DiaryCard key={entry.slug} entry={entry} lang={lang} />
          ))}
        </DiaryCardGrid>
      ) : (
        <p className="font-sans text-foreground/60 text-center py-16">
          {dict.diary.noEntries}
        </p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12">
          <PaginationBar
            currentPage={1}
            totalPages={totalPages}
            lang={lang}
            basePath="diary"
          />
        </div>
      )}
    </div>
  )
}
