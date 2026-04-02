import Link from 'next/link'
import { MascotImage } from '@/components/ui/MascotImage'
import type en from '../../../dictionaries/en.json'

interface HeroSectionProps {
  lang: string
  dict: (typeof en)['home']
}

export function HeroSection({ lang, dict }: HeroSectionProps) {
  return (
    <section className="text-center py-16 md:py-24 px-4 flex flex-col items-center gap-6">
      <div className="animate-bounce-in">
        <MascotImage
          pose="waving"
          size={192}
          className="animate-float"
          alt={dict.hero.mascotAlt}
        />
      </div>

      <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
        {dict.hero.tagline}
      </h1>

      <p className="font-sans text-lg text-foreground/70 max-w-2xl mx-auto">
        {dict.hero.subCopy}
      </p>

      <Link
        href={`/${lang}/diary`}
        className="bg-primary-dark text-white rounded-pill px-8 py-3 font-display font-semibold text-lg hover:opacity-90 transition-opacity inline-block"
      >
        {dict.hero.ctaLabel}
      </Link>
    </section>
  )
}
