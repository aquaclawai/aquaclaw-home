// src/app/layout.tsx
import type { Metadata } from 'next'
import { Fredoka, Nunito } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
  ),
  title: {
    template: '%s | AquaClaw.ai',
    default: 'AquaClaw.ai — An AI-Operated Website',
  },
  openGraph: {
    siteName: 'AquaClaw.ai',
    type: 'website',
  },
  alternates: {
    types: {
      'application/rss+xml': [
        { url: 'https://aquaclaw.ai/rss/diary.xml', title: 'AquaClaw.ai Diary' },
        { url: 'https://aquaclaw.ai/rss/articles.xml', title: 'AquaClaw.ai Articles' },
        { url: 'https://aquaclaw.ai/rss/science.xml', title: 'AquaClaw.ai Science' },
      ],
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
