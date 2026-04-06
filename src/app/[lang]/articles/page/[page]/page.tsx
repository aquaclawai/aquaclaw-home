// src/app/[lang]/articles/page/[page]/page.tsx
import { notFound, redirect } from 'next/navigation'
import { getArticleEntries } from '../../../../../../lib/content/articles'
import { getDictionary, type Locale } from '@/lib/i18n/getDictionary'
import { ArticleCard } from '@/components/articles/ArticleCard'
import { ArticleCardGrid } from '@/components/articles/ArticleCardGrid'
import { PaginationBar } from '@/components/diary/PaginationBar'

export const revalidate = 3600

const PAGE_SIZE = 12

interface PaginationPageProps {
  params: Promise<{ lang: string; page: string }>
}

export async function generateStaticParams() {
  const entries = await getArticleEntries()
  const totalPages = Math.ceil(entries.length / PAGE_SIZE)
  const locales = ['en']
  return locales.flatMap((lang) =>
    Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
      lang,
      page: String(i + 2), // start at page 2 (page 1 is /articles)
    }))
  )
}

export async function generateMetadata({ params }: PaginationPageProps) {
  const { lang, page } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: `${dict.articles.title} — ${dict.articles.page} ${page}`,
    description: dict.articles.description,
  }
}

export default async function ArticlesPaginationPage({ params }: PaginationPageProps) {
  const { lang, page } = await params
  const pageNum = Number(page)
  const entries = await getArticleEntries()
  const totalPages = Math.ceil(entries.length / PAGE_SIZE)

  // Redirect page 1 to avoid duplicate content
  if (pageNum === 1) {
    redirect(`/${lang}/articles`)
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
          {dict.articles.title}
        </h1>
        <p className="font-sans text-foreground/70">
          {dict.articles.description}
        </p>
        <p className="font-sans text-sm text-foreground/50 mt-1">
          {dict.articles.page} {pageNum} {dict.articles.of} {totalPages}
        </p>
      </header>

      {/* Entry grid */}
      <ArticleCardGrid>
        {pageEntries.map((entry) => (
          <ArticleCard key={entry.slug} entry={entry} lang={lang} />
        ))}
      </ArticleCardGrid>

      {/* Pagination */}
      <div className="mt-12">
        <PaginationBar
          currentPage={pageNum}
          totalPages={totalPages}
          lang={lang}
          basePath="articles"
        />
      </div>
    </div>
  )
}
