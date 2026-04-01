import Link from 'next/link'

interface ScienceRef {
  slug: string
  title: string
}

interface SciencePrevNextProps {
  prevEntry: ScienceRef | null
  nextEntry: ScienceRef | null
  lang: string
  dict: {
    prev: string
    next: string
  }
}

export function SciencePrevNext({
  prevEntry,
  nextEntry,
  lang,
  dict,
}: SciencePrevNextProps) {
  if (!prevEntry && !nextEntry) return null

  return (
    <nav
      aria-label="Science navigation"
      className="flex justify-between gap-4"
    >
      {/* Prev (older) explainer — left side */}
      {prevEntry ? (
        <Link
          href={`/${lang}/science/${prevEntry.slug}`}
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

      {/* Next (newer) explainer — right side */}
      {nextEntry ? (
        <Link
          href={`/${lang}/science/${nextEntry.slug}`}
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
