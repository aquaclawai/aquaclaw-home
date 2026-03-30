import { ReactNode } from 'react'
import { getDictionary, Locale } from '@/lib/i18n/getDictionary'
import Header from '@/components/nav/Header'
import Footer from '@/components/nav/Footer'

interface LangLayoutProps {
  children: ReactNode
  params: Promise<{ lang: string }>
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return (
    <div lang={lang} className="min-h-screen flex flex-col">
      <Header lang={lang} dict={dict} />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer lang={lang} dict={dict} />
    </div>
  )
}
