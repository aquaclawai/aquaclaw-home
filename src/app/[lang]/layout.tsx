// src/app/[lang]/layout.tsx
import { ReactNode } from 'react'

interface LangLayoutProps {
  children: ReactNode
  params: Promise<{ lang: string }>
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params
  return (
    <div lang={lang}>
      {children}
    </div>
  )
}
