import { ArticleCard } from '@/components/articles/ArticleCard'
import type { ArticleEntry } from '../../../lib/content/articles'

interface TutorialCardsProps {
  entries: ArticleEntry[]
  lang: string
  dict: {
    heading: string
    description: string
  }
}

export function TutorialCards({ entries, lang, dict }: TutorialCardsProps) {
  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
        {dict.heading}
      </h2>
      <p className="font-sans text-foreground/70 mb-8">{dict.description}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {entries.map((entry) => (
          <ArticleCard key={entry.slug} entry={entry} lang={lang} />
        ))}
      </div>
    </div>
  )
}
