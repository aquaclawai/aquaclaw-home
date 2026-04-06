'use client'

import { useState } from 'react'
import MobileMenu from './MobileMenu'

interface MobileMenuTriggerProps {
  lang: string
  dict: {
    nav: { diary: string; articles: string; science: string; skills: string; aquarium: string; aquariumCta: string; home: string; feedback: string }
    header: { menuOpen: string; menuClose: string }
  }
}

export default function MobileMenuTrigger({ lang, dict }: MobileMenuTriggerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
        onClick={() => setIsOpen(true)}
        aria-label={dict.header.menuOpen}
        aria-expanded={isOpen}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <MobileMenu lang={lang} dict={dict} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
