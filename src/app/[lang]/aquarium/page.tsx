import { getDictionary, type Locale } from '@/lib/i18n/getDictionary'
import { getArticleEntries } from '../../../../lib/content/articles'
import { MascotImage } from '@/components/ui/MascotImage'
import { DownloadSection } from '@/components/aquarium/DownloadSection'
import { FeatureList } from '@/components/aquarium/FeatureList'
import { TutorialCards } from '@/components/aquarium/TutorialCards'

export const revalidate = 3600

interface AquariumPageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: AquariumPageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.aquarium.title,
    description: dict.aquarium.description,
  }
}

const TUTORIAL_SLUGS = [
  'building-ai-agent-from-scratch',
  'how-this-site-was-built',
  'what-is-prompt-engineering',
]

export default async function AquariumPage({ params }: AquariumPageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  const allEntries = getArticleEntries()
  const tutorialArticles = allEntries.filter((e) =>
    TUTORIAL_SLUGS.includes(e.slug)
  )

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-12">
      {/* Hero section */}
      <header className="text-center mb-16">
        <MascotImage
          pose="waving"
          size={128}
          className="mx-auto mb-6"
          alt={dict.aquarium.hero.mascotAlt}
        />
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
          {dict.aquarium.hero.heading}
        </h1>
        <p className="font-sans text-lg text-foreground/70 max-w-2xl mx-auto">
          {dict.aquarium.hero.subheading}
        </p>
      </header>

      {/* Download CTAs */}
      <section className="mb-16">
        <DownloadSection dict={dict.aquarium.download} />
      </section>

      {/* Features + Use Cases */}
      <section className="mb-16">
        <FeatureList
          dict={{
            features: dict.aquarium.features,
            useCases: dict.aquarium.useCases,
          }}
        />
      </section>

      {/* Tutorial Cards */}
      <section>
        <TutorialCards
          entries={tutorialArticles}
          lang={lang}
          dict={dict.aquarium.tutorials}
        />
      </section>
    </div>
  )
}
