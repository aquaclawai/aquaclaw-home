import { getDictionary, type Locale } from '@/lib/i18n/getDictionary'
import { getArticleEntries } from '../../../../lib/content/articles'
import { MascotImage } from '@/components/ui/MascotImage'
import { DownloadSection } from '@/components/openclaw/DownloadSection'
import { FeatureList } from '@/components/openclaw/FeatureList'
import { TutorialCards } from '@/components/openclaw/TutorialCards'

export const revalidate = 3600

interface OpenClawPageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: OpenClawPageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.openclaw.title,
    description: dict.openclaw.description,
  }
}

const TUTORIAL_SLUGS = [
  'building-ai-agent-from-scratch',
  'how-this-site-was-built',
  'what-is-prompt-engineering',
]

export default async function OpenClawPage({ params }: OpenClawPageProps) {
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
          alt={dict.openclaw.hero.mascotAlt}
        />
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
          {dict.openclaw.hero.heading}
        </h1>
        <p className="font-sans text-lg text-foreground/70 max-w-2xl mx-auto">
          {dict.openclaw.hero.subheading}
        </p>
      </header>

      {/* Download CTAs — OPCL-01 */}
      <section className="mb-16">
        <DownloadSection dict={dict.openclaw.download} />
      </section>

      {/* Features + Use Cases — OPCL-02 */}
      <section className="mb-16">
        <FeatureList
          dict={{
            features: dict.openclaw.features,
            useCases: dict.openclaw.useCases,
          }}
        />
      </section>

      {/* Tutorial Cards — OPCL-03 */}
      <section>
        <TutorialCards
          entries={tutorialArticles}
          lang={lang}
          dict={dict.openclaw.tutorials}
        />
      </section>
    </div>
  )
}
