import Link from 'next/link'

interface ArticleRef {
  slug: string
  title: string
}

interface ArticlePrevNextProps {
  prevEntry: ArticleRef | null
  nextEntry: ArticleRef | null
  lang: string
  dict: {
    prev: string
    next: string
  }
}

export function ArticlePrevNext({
  prevEntry,
  nextEntry,
  lang,
  dict,
}: ArticlePrevNextProps) {
  if (!prevEntry && !nextEntry) return null

  return (
    <nav
      aria-label="Article navigation"
      className="flex justify-between gap-4"
    >
      {/* Prev (older) article — left side */}
      {prevEntry ? (
        <Link
          href={`/${lang}/articles/${prevEntry.slug}`}
          className="flex-1 bg-card rounded-xl px-4 py-3 hover:bg-muted transition-colors shadow-sm group"
          aria-label={`${dict.prev}: ${prevEntry.title}`}
        >
          <span className="block text-foreground/50 text-xs mb-0.5">
            ← {dict.prev}
          </span>
          <span className="block font-display font-semibold text-sm text-foreground leading-snug group-hover:text-primary transition-colors">
            {prevEntry.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {/* Next (newer) article — right side */}
      {nextEntry ? (
        <Link
          href={`/${lang}/articles/${nextEntry.slug}`}
          className="flex-1 bg-card rounded-xl px-4 py-3 hover:bg-muted transition-colors shadow-sm text-right group"
          aria-label={`${dict.next}: ${nextEntry.title}`}
        >
          <span className="block text-foreground/50 text-xs mb-0.5">
            {dict.next} →
          </span>
          <span className="block font-display font-semibold text-sm text-foreground leading-snug group-hover:text-primary transition-colors">
            {nextEntry.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  )
}
