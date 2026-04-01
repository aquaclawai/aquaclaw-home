// src/app/[lang]/page.tsx
import { getDictionary, type Locale } from '@/lib/i18n/getDictionary'
import { HeroSection } from '@/components/home/HeroSection'
import { StatsCounter } from '@/components/home/StatsCounter'
import { DiaryCarousel } from '@/components/home/DiaryCarousel'
import { ValuePropGrid } from '@/components/home/ValuePropGrid'
import { FeaturedContent } from '@/components/home/FeaturedContent'
import { getDiaryEntries } from '../../../lib/content/diary'
import { getArticleEntries } from '../../../lib/content/articles'
import { getScienceEntries } from '../../../lib/content/science'
import { getSkillEntries } from '../../../lib/content/skills'

export const revalidate = 3600

interface HomePageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: HomePageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.home.title,
    description: dict.home.description,
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  // Fetch all content once (server-side, at build time)
  const allDiary = getDiaryEntries()
  const allArticles = getArticleEntries()
  const allScience = getScienceEntries()
  const allSkills = getSkillEntries()

  // Derive counts and slices
  const diaryCount = allDiary.length
  const articleCount = allArticles.length
  const skillCount = allSkills.length
  const diaryEntries = allDiary.slice(0, 6) // carousel
  const articleEntries = allArticles.slice(0, 3) // featured
  const scienceEntries = allScience.slice(0, 3) // featured
  const skillEntries = allSkills.slice(0, 3) // featured

  return (
    <main>
      <HeroSection lang={lang} dict={dict.home} />
      <StatsCounter
        diaryCount={diaryCount}
        articleCount={articleCount}
        skillCount={skillCount}
        dict={dict.home.stats}
      />
      <DiaryCarousel entries={diaryEntries} lang={lang} dict={dict.home.carousel} />
      <ValuePropGrid dict={dict.home.valueProp} />
      <FeaturedContent
        articles={articleEntries}
        science={scienceEntries}
        skills={skillEntries}
        lang={lang}
        dict={dict}
      />
    </main>
  )
}
