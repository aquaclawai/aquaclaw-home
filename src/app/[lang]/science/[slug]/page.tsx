// src/app/[lang]/science/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getScienceEntries, getScienceBySlug } from '../../../../../lib/content/science'
import { getDictionary, type Locale } from '@/lib/i18n/getDictionary'
import { SciencePrevNext } from '@/components/science/SciencePrevNext'
import { renderMDX } from '../../../../../lib/content/mdx'

interface SciencePageProps {
  params: Promise<{ lang: string; slug: string }>
}

export const revalidate = 3600

// Color-coded difficulty badge styles — same values as ScienceCard
const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
}

export async function generateStaticParams() {
  const entries = await getScienceEntries()
  const locales = ['en']
  return locales.flatMap((lang) =>
    entries.map((entry) => ({ lang, slug: entry.slug }))
  )
}

export async function generateMetadata({ params }: SciencePageProps) {
  const { slug } = await params
  const entry = await getScienceBySlug(slug)
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

export default async function ScienceDetailPage({ params }: SciencePageProps) {
  const { lang, slug } = await params
  const entry = await getScienceBySlug(slug)
  if (!entry) notFound()

  const dict = await getDictionary(lang as Locale)

  // Render MDX content from Blob
  const mdxContent = entry.content ? await renderMDX(entry.content) : null

  // Compute prev/next (entries are newest-first, so prev=older=higher index, next=newer=lower index)
  const entries = await getScienceEntries()
  const currentIndex = entries.findIndex((e) => e.slug === slug)
  const prevEntry =
    currentIndex < entries.length - 1 ? entries[currentIndex + 1] : null // older
  const nextEntry = currentIndex > 0 ? entries[currentIndex - 1] : null // newer

  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Back link */}
      <Link
        href={`/${lang}/science`}
        className="inline-block font-sans text-sm text-primary hover:underline mb-8"
      >
        ← {dict.science.backToScience}
      </Link>

      {/* Explainer header */}
      <header className="mb-8">
        {/* Difficulty badge + tag pills in same row */}
        <div className="flex flex-wrap gap-1 mb-3">
          <span
            className={`${DIFFICULTY_STYLES[entry.difficulty] ?? 'bg-muted text-foreground/60'} text-xs px-2 py-0.5 rounded-pill font-semibold`}
          >
            {dict.science.difficulty[entry.difficulty as keyof typeof dict.science.difficulty]}
          </span>
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="bg-muted text-foreground/60 text-xs px-2 py-0.5 rounded-pill"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Date */}
        <p className="font-sans text-xs text-foreground/50 mb-3">{formattedDate}</p>

        {/* Title */}
        <h1 className="font-display text-3xl font-bold text-foreground leading-tight">
          {entry.title}
        </h1>
      </header>

      {/* MDX content — Further Reading section renders inside prose via MDX */}
      <article className="prose prose-lg prose-headings:font-display prose-a:text-primary max-w-prose mx-auto mb-16">
        {mdxContent ?? (
          <div className="whitespace-pre-wrap font-sans text-foreground/80">
            {entry.content}
          </div>
        )}
      </article>

      {/* Prev/next navigation */}
      <SciencePrevNext
        prevEntry={prevEntry ? { slug: prevEntry.slug, title: prevEntry.title } : null}
        nextEntry={nextEntry ? { slug: nextEntry.slug, title: nextEntry.title } : null}
        lang={lang}
        dict={{
          prev: dict.science.prev,
          next: dict.science.next,
        }}
      />
    </div>
  )
}
