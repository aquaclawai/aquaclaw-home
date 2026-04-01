import Link from 'next/link'

interface EntryRef {
  slug: string
  title: string
  dayNumber: number
}

interface DiaryPrevNextProps {
  prevEntry: EntryRef | null
  nextEntry: EntryRef | null
  lang: string
  dict: {
    prev: string
    next: string
    day: string
  }
}

export function DiaryPrevNext({
  prevEntry,
  nextEntry,
  lang,
  dict,
}: DiaryPrevNextProps) {
  if (!prevEntry && !nextEntry) return null

  return (
    <nav
      aria-label="Diary entry navigation"
      className="flex justify-between gap-4"
    >
      {/* Prev (older) entry — left side */}
      {prevEntry ? (
        <Link
          href={`/${lang}/diary/${prevEntry.slug}`}
          className="flex-1 bg-card rounded-xl px-4 py-3 hover:bg-muted transition-colors shadow-sm group"
          aria-label={`${dict.prev}: Day ${prevEntry.dayNumber} — ${prevEntry.title}`}
        >
          <span className="block text-foreground/50 text-xs mb-0.5">
            ← {dict.prev}
          </span>
          <span className="block font-display font-semibold text-sm text-foreground leading-snug group-hover:text-primary transition-colors">
            {dict.day} {prevEntry.dayNumber}: {prevEntry.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {/* Next (newer) entry — right side */}
      {nextEntry ? (
        <Link
          href={`/${lang}/diary/${nextEntry.slug}`}
          className="flex-1 bg-card rounded-xl px-4 py-3 hover:bg-muted transition-colors shadow-sm text-right group"
          aria-label={`${dict.next}: Day ${nextEntry.dayNumber} — ${nextEntry.title}`}
        >
          <span className="block text-foreground/50 text-xs mb-0.5">
            {dict.next} →
          </span>
          <span className="block font-display font-semibold text-sm text-foreground leading-snug group-hover:text-primary transition-colors">
            {dict.day} {nextEntry.dayNumber}: {nextEntry.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  )
}
