// src/app/[lang]/articles/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticleEntries, getArticleBySlug } from '../../../../../lib/content/articles'
import { getDictionary, type Locale } from '@/lib/i18n/getDictionary'
import { ArticlePrevNext } from '@/components/articles/ArticlePrevNext'

interface ArticlePageProps {
  params: Promise<{ lang: string; slug: string }>
}

export const revalidate = 3600

export async function generateStaticParams() {
  const entries = getArticleEntries()
  const locales = ['en']
  return locales.flatMap((lang) =>
    entries.map((entry) => ({ lang, slug: entry.slug }))
  )
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params
  const entry = getArticleBySlug(slug)
  if (!entry) return {}
  return {
    title: entry.title,
    description: entry.excerpt,
    openGraph: {
      title: entry.title,
      description: entry.excerpt,
      type: 'article',
      publishedTime: entry.date,
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { lang, slug } = await params
  const entry = getArticleBySlug(slug)
  if (!entry) notFound()

  const dict = await getDictionary(lang as Locale)

  // Dynamic MDX import — relative path from this file to project root content/
  // Falls back to raw content if MDX import fails
  let MDXContent: React.ComponentType | null = null
  try {
    const mdxModule = await import(`../../../../../content/articles/${slug}.mdx`)
    MDXContent = mdxModule.default
  } catch {
    // Fall through to raw content rendering
  }

  // Compute prev/next (entries are newest-first, so prev=older=higher index, next=newer=lower index)
  const entries = getArticleEntries()
  const currentIndex = entries.findIndex((e) => e.slug === slug)
  const prevEntry =
    currentIndex < entries.length - 1 ? entries[currentIndex + 1] : null // older entry
  const nextEntry = currentIndex > 0 ? entries[currentIndex - 1] : null // newer entry

  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Back link */}
      <Link
        href={`/${lang}/articles`}
        className="inline-block font-sans text-sm text-primary hover:underline mb-8"
      >
        ← {dict.articles.backToArticles}
      </Link>

      {/* Article header */}
      <header className="mb-8">
        {/* Tag pills */}
        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="bg-muted text-foreground/60 text-xs px-2 py-0.5 rounded-pill"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Date */}
        <p className="font-sans text-xs text-foreground/50 mb-3">{formattedDate}</p>

        {/* Title */}
        <h1 className="font-display text-3xl font-bold text-foreground leading-tight">
          {entry.title}
        </h1>
      </header>

      {/* MDX content */}
      <article className="prose prose-lg prose-headings:font-display prose-a:text-primary max-w-prose mx-auto mb-16">
        {MDXContent ? (
          <MDXContent />
        ) : (
          // Fallback: render raw content if MDX import fails
          <div className="whitespace-pre-wrap font-sans text-foreground/80">
            {entry.content}
          </div>
        )}
      </article>

      {/* Prev/next navigation */}
      <ArticlePrevNext
        prevEntry={prevEntry ? { slug: prevEntry.slug, title: prevEntry.title } : null}
        nextEntry={nextEntry ? { slug: nextEntry.slug, title: nextEntry.title } : null}
        lang={lang}
        dict={{
          prev: dict.articles.prev,
          next: dict.articles.next,
        }}
      />
    </div>
  )
}
