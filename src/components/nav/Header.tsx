import Link from 'next/link'
import { MascotImage } from '@/components/ui/MascotImage'
import MobileMenuTrigger from './MobileMenuTrigger'

interface HeaderProps {
  lang: string
  dict: {
    nav: { diary: string; articles: string; science: string; skills: string; aquarium: string; aquariumCta: string; home: string }
    header: { logoAlt: string; menuOpen: string; menuClose: string }
    site: { name: string }
  }
}

const navLinks = [
  { key: 'diary', href: 'diary' },
  { key: 'articles', href: 'articles' },
  { key: 'science', href: 'science' },
  { key: 'skills', href: 'skills' },
] as const

export default function Header({ lang, dict }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-muted">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo area */}
          <Link href={`/${lang}`} className="flex items-center">
            <MascotImage pose="default" size={28} />
            <span className="font-display text-xl font-bold text-primary-dark ml-2">
              {dict.site.name}
            </span>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map(({ key, href }) => (
              <li key={key}>
                <Link
                  href={`/${lang}/${href}`}
                  className="px-3 py-2 rounded-md text-sm font-medium font-sans text-foreground hover:text-primary hover:bg-muted transition-colors"
                >
                  {dict.nav[key]}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={`/${lang}/aquarium`}
                className="ml-2 px-4 py-2 rounded-pill text-sm font-semibold font-sans bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                {dict.nav.aquariumCta}
              </Link>
            </li>
          </ul>

          {/* Mobile menu trigger — client island */}
          <MobileMenuTrigger lang={lang} dict={dict} />
        </div>
      </nav>
    </header>
  )
}
