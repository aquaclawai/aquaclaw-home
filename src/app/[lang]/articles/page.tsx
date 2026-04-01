// src/app/[lang]/articles/page.tsx
import { getArticleEntries } from '../../../../lib/content/articles'
import { getDictionary, type Locale } from '@/lib/i18n/getDictionary'
import { ArticleCard } from '@/components/articles/ArticleCard'
import { ArticleCardGrid } from '@/components/articles/ArticleCardGrid'
import { PaginationBar } from '@/components/diary/PaginationBar'

export const revalidate = 3600

const PAGE_SIZE = 12

interface ArticlesPageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: ArticlesPageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.articles.title,
    description: dict.articles.description,
  }
}

export default async function ArticlesPage({ params }: ArticlesPageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  const entries = getArticleEntries()
  const pageEntries = entries.slice(0, PAGE_SIZE)
  const totalPages = Math.ceil(entries.length / PAGE_SIZE)

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
      </header>

      {/* Entry grid */}
      {pageEntries.length > 0 ? (
        <ArticleCardGrid>
          {pageEntries.map((entry) => (
            <ArticleCard key={entry.slug} entry={entry} lang={lang} />
          ))}
        </ArticleCardGrid>
      ) : (
        <p className="font-sans text-foreground/60 text-center py-16">
          {dict.articles.noArticles}
        </p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12">
          <PaginationBar
            currentPage={1}
            totalPages={totalPages}
            lang={lang}
            basePath="articles"
          />
        </div>
      )}
    </div>
  )
}
