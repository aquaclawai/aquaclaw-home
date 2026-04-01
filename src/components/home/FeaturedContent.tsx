import Link from 'next/link'
import { ArticleCard } from '@/components/articles/ArticleCard'
import { ScienceCard } from '@/components/science/ScienceCard'
import { SkillCard } from '@/components/skills/SkillCard'
import type { ArticleEntry } from '../../../lib/content/articles'
import type { ScienceEntry } from '../../../lib/content/science'
import type { SkillEntry } from '../../../lib/content/skills'
import type en from '../../../dictionaries/en.json'

interface FeaturedContentProps {
  articles: ArticleEntry[]
  science: ScienceEntry[]
  skills: SkillEntry[]
  lang: string
  dict: typeof en
}

export function FeaturedContent({
  articles,
  science,
  skills,
  lang,
  dict,
}: FeaturedContentProps) {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto space-y-16">
      {/* Latest Articles */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl font-bold">
            {dict.home.featured.articlesHeading}
          </h3>
          <Link
            href={`/${lang}/articles`}
            className="text-primary font-semibold hover:underline"
          >
            {dict.home.featured.viewAllArticles}
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((e) => (
            <ArticleCard key={e.slug} entry={e} lang={lang} />
          ))}
        </div>
      </div>

      {/* Latest Science */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl font-bold">
            {dict.home.featured.scienceHeading}
          </h3>
          <Link
            href={`/${lang}/science`}
            className="text-primary font-semibold hover:underline"
          >
            {dict.home.featured.viewAllScience}
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {science.map((e) => (
            <ScienceCard
              key={e.slug}
              entry={e}
              lang={lang}
              dict={{ difficulty: dict.science.difficulty }}
            />
          ))}
        </div>
      </div>

      {/* Latest Skill Packs */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl font-bold">
            {dict.home.featured.skillsHeading}
          </h3>
          <Link
            href={`/${lang}/skills`}
            className="text-primary font-semibold hover:underline"
          >
            {dict.home.featured.viewAllSkills}
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skills.map((e) => (
            <SkillCard key={e.slug} entry={e} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  )
}
