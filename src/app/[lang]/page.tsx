// src/app/[lang]/page.tsx
import { getDictionary, type Locale } from '@/lib/i18n/getDictionary'

interface HomePageProps {
  params: Promise<{ lang: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return (
    <main>
      <h1>{dict.site.name}</h1>
      <p>{dict.site.tagline}</p>
    </main>
  )
}
