// src/app/[lang]/skills/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSkillEntries, getSkillBySlug } from '../../../../../lib/content/skills'
import { getDictionary, type Locale } from '@/lib/i18n/getDictionary'
import { renderMDX } from '../../../../../lib/content/mdx'

export const revalidate = 3600

interface SkillDetailPageProps {
  params: Promise<{ lang: string; slug: string }>
}

export async function generateStaticParams() {
  const entries = await getSkillEntries()
  const locales = ['en']
  return locales.flatMap((lang) =>
    entries.map((entry) => ({ lang, slug: entry.slug }))
  )
}

export async function generateMetadata({ params }: SkillDetailPageProps) {
  const { slug } = await params
  const entry = await getSkillBySlug(slug)
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

export default async function SkillDetailPage({ params }: SkillDetailPageProps) {
  const { lang, slug } = await params
  const entry = await getSkillBySlug(slug)
  if (!entry) notFound()

  const dict = await getDictionary(lang as Locale)

  // Render MDX content from Blob
  const mdxContent = entry.content ? await renderMDX(entry.content) : null

  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Back link */}
      <Link
        href={`/${lang}/skills`}
        className="inline-block font-sans text-sm text-primary hover:underline mb-8"
      >
        ← {dict.skills.backToSkills}
      </Link>

      {/* Skill pack header */}
      <header className="mb-8">
        {/* Category badge + tag pills in same row */}
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="bg-secondary/30 text-foreground/80 text-xs px-2 py-0.5 rounded-pill font-semibold">
            {entry.category}
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

      {/* Download CTA — prominently placed before MDX prose */}
      <div className="mb-8">
        <a
          href={entry.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary text-white font-sans font-semibold px-6 py-3 rounded-pill hover:bg-primary/90 transition-colors shadow-sm"
        >
          {dict.skills.downloadCta}
        </a>
      </div>

      {/* MDX content — feature list in MDX body renders as styled bullet points via typography plugin */}
      <article className="prose prose-lg prose-headings:font-display prose-a:text-primary max-w-prose mx-auto mb-16">
        {mdxContent ?? (
          <div className="whitespace-pre-wrap font-sans text-foreground/80">
            {entry.content}
          </div>
        )}
      </article>
    </div>
  )
}
