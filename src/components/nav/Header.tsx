import Link from 'next/link'
import { MascotImage } from '@/components/ui/MascotImage'

interface HeaderProps {
  lang: string
  dict: {
    nav: { diary: string; articles: string; science: string; skills: string; openclaw: string; home: string }
    header: { logoAlt: string; menuOpen: string; menuClose: string }
    site: { name: string }
  }
}

const navLinks = [
  { key: 'diary', href: 'diary' },
  { key: 'articles', href: 'articles' },
  { key: 'science', href: 'science' },
  { key: 'skills', href: 'skills' },
  { key: 'openclaw', href: 'openclaw' },
] as const

export default function Header({ lang, dict }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-muted">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo area */}
          <Link href={`/${lang}`} className="flex items-center" aria-label={dict.header.logoAlt}>
            <MascotImage pose="default" size={28} />
            <span className="font-display text-xl font-bold text-primary ml-2">
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
          </ul>

          {/* Hamburger button — wired in Plan 02 */}
          <button className="md:hidden p-2" aria-label={dict.header.menuOpen}>
            <svg
              className="w-5 h-5 text-foreground"
              fill="none"
              viewBox="0 0 20 20"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <line x1="2" y1="5" x2="18" y2="5" />
              <line x1="2" y1="10" x2="18" y2="10" />
              <line x1="2" y1="15" x2="18" y2="15" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  )
}
