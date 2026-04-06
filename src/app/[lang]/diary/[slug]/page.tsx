// src/app/[lang]/diary/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDiaryEntries, getDiaryEntry } from '../../../../../lib/content/diary'
import { getDictionary, type Locale } from '@/lib/i18n/getDictionary'
import { DiaryPrevNext } from '@/components/diary/DiaryPrevNext'
import { GiscusComments } from '@/components/engagement/GiscusComments'
import { renderMDX } from '../../../../../lib/content/mdx'

interface DiaryEntryPageProps {
  params: Promise<{ lang: string; slug: string }>
}

export const revalidate = 3600

export async function generateStaticParams() {
  const entries = await getDiaryEntries()
  const locales = ['en']
  return locales.flatMap((lang) =>
    entries.map((entry) => ({ lang, slug: entry.slug }))
  )
}

export async function generateMetadata({ params }: DiaryEntryPageProps) {
  const { slug } = await params
  const entry = await getDiaryEntry(slug)
  if (!entry) return {}
  return {
    title: `Day ${entry.dayNumber}: ${entry.title}`,
    description: entry.excerpt,
    openGraph: {
      title: `Day ${entry.dayNumber}: ${entry.title}`,
      description: entry.excerpt,
      type: 'article',
      publishedTime: entry.date,
    },
  }
}

export default async function DiaryEntryPage({ params }: DiaryEntryPageProps) {
  const { lang, slug } = await params
  const entry = await getDiaryEntry(slug)
  if (!entry) notFound()

  const dict = await getDictionary(lang as Locale)

  // Render MDX content from Blob
  const mdxContent = entry.content ? await renderMDX(entry.content) : null

  // Compute prev/next (entries are newest-first, so prev=older=higher index, next=newer=lower index)
  const entries = await getDiaryEntries()
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
        href={`/${lang}/diary`}
        className="inline-block font-sans text-sm text-primary hover:underline mb-8"
      >
        ← {dict.diary.backToDiary}
      </Link>

      {/* Entry header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {/* Day pill */}
          <span className="inline-flex bg-primary text-white rounded-pill px-3 py-1 font-display font-semibold text-xs">
            {dict.diary.day} {entry.dayNumber}
          </span>
          {/* Date */}
          <span className="font-sans text-xs text-foreground/50">{formattedDate}</span>
        </div>

        {/* Tags */}
        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
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

        {/* Title */}
        <h1 className="font-display text-3xl font-bold text-foreground leading-tight">
          {entry.title}
        </h1>
      </header>

      {/* MDX content */}
      <article className="prose prose-lg prose-headings:font-display prose-a:text-primary max-w-prose mx-auto mb-16">
        {mdxContent ?? (
          <div className="whitespace-pre-wrap font-sans text-foreground/80">
            {entry.content}
          </div>
        )}
      </article>

      {/* Prev/next navigation */}
      <DiaryPrevNext
        prevEntry={prevEntry ? { slug: prevEntry.slug, title: prevEntry.title, dayNumber: prevEntry.dayNumber } : null}
        nextEntry={nextEntry ? { slug: nextEntry.slug, title: nextEntry.title, dayNumber: nextEntry.dayNumber } : null}
        lang={lang}
        dict={{
          prev: dict.diary.prev,
          next: dict.diary.next,
          day: dict.diary.day,
        }}
      />
      <GiscusComments lang={lang} />
    </div>
  )
}
