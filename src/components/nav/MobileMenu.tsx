'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { MascotImage } from '@/components/ui/MascotImage'

interface MobileMenuProps {
  lang: string
  dict: {
    nav: { diary: string; articles: string; science: string; skills: string; aquarium: string; aquariumCta: string; home: string; feedback: string }
    header: { menuClose: string }
  }
  isOpen: boolean
  onClose: () => void
}

const navLinks = [
  { key: 'home', href: '' },
  { key: 'diary', href: 'diary' },
  { key: 'articles', href: 'articles' },
  { key: 'science', href: 'science' },
  { key: 'skills', href: 'skills' },
  { key: 'aquarium', href: 'aquarium' },
] as const

const feedbackLinks = [
  { label: 'GitHub Issues', href: 'https://github.com/aquaclawai/aquarium-ce/issues' },
  { label: 'tech@aquaclaw.ai', href: 'mailto:tech@aquaclaw.ai' },
]

export default function MobileMenu({ lang, dict, isOpen, onClose }: MobileMenuProps) {
  // Escape key handler
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop — tap outside closes */}
      <div
        className="absolute inset-0 bg-background/95 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu panel */}
      <nav className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 animate-bounce-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-foreground"
          aria-label={dict.header.menuClose}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        </button>

        {/* Navigation links */}
        <ul className="flex flex-col items-center gap-6">
          {navLinks.map(({ key, href }) => (
            <li key={key}>
              <Link
                href={href ? `/${lang}/${href}` : `/${lang}`}
                onClick={onClose}
                className="text-2xl font-display font-semibold text-foreground hover:text-primary transition-colors"
              >
                {dict.nav[key]}
              </Link>
            </li>
          ))}
        </ul>

        {/* Feedback links */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="text-sm font-sans font-semibold text-foreground/50">{dict.nav.feedback}</p>
          {feedbackLinks.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              onClick={onClose}
              className="text-sm font-sans text-foreground/70 hover:text-primary transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Waving mascot at bottom */}
        <div className="absolute bottom-12 animate-float">
          <MascotImage pose="waving" size={64} />
        </div>
      </nav>
    </div>
  )
}
