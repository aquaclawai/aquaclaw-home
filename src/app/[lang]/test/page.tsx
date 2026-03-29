// src/app/[lang]/test/page.tsx
// Proof-of-concept page to verify SEO pipeline (FOUN-05)
// This page can be deleted after verification or kept as a development test fixture.
import type { Metadata } from 'next'

interface TestPageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: TestPageProps): Promise<Metadata> {
  const { lang } = await params

  return {
    title: 'Foundation Test',
    description: 'Verifying the SEO pipeline is working correctly.',
    openGraph: {
      title: 'Foundation Test | AquaClaw.ai',
      description: 'Verifying the SEO pipeline is working correctly.',
      url: `https://aquaclaw.ai/${lang}/test`,
      type: 'website',
    },
    alternates: {
      canonical: `https://aquaclaw.ai/${lang}/test`,
    },
  }
}

export default async function TestPage({ params }: TestPageProps) {
  const { lang } = await params

  return (
    <main>
      <h1>Foundation Test Page</h1>
      <p>
        This page verifies the SEO pipeline is operational. Locale: <code>{lang}</code>
      </p>
      <p>Check page source for:</p>
      <ul>
        <li>Title: &ldquo;Foundation Test | AquaClaw.ai&rdquo;</li>
        <li>og:title meta tag</li>
        <li>og:description meta tag</li>
        <li>Canonical URL: https://aquaclaw.ai/{lang}/test</li>
      </ul>
    </main>
  )
}
