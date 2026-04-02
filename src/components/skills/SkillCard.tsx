import Link from 'next/link'
import Image from 'next/image'
import type { SkillEntry } from '../../../lib/content/skills'
import { MascotImage } from '@/components/ui/MascotImage'

const MASCOT_POSES = ['default', 'waving', 'thinking', 'sleeping'] as const
const THUMBNAIL_BG_CLASSES = [
  'bg-primary/20',
  'bg-secondary/30',
  'bg-accent/20',
  'bg-contrast/20',
] as const

interface SkillCardProps {
  entry: SkillEntry
  lang: string
}

export function SkillCard({ entry, lang }: SkillCardProps) {
  // Deterministic pose/color via slug character code hash
  const hash = entry.slug
    .split('')
    .reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const pose = MASCOT_POSES[hash % MASCOT_POSES.length] ?? 'default'
  const thumbnailBg = THUMBNAIL_BG_CLASSES[hash % THUMBNAIL_BG_CLASSES.length] ?? 'bg-primary/20'

  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Link
      href={`/${lang}/skills/${entry.slug}`}
      className="group block bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Thumbnail area */}
      <div
        className={`relative flex items-center justify-center ${thumbnailBg} h-40 overflow-hidden`}
      >
        {entry.thumbnail ? (
          <Image
            src={entry.thumbnail}
            alt={entry.title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <MascotImage
            pose={pose}
            size={96}
            alt={`AquaClaw mascot — ${entry.title}`}
          />
        )}
      </div>

      {/* Content area */}
      <div className="p-4 flex flex-col gap-2">
        {/* Category badge + tag pills */}
        <div className="flex flex-wrap gap-1">
          <span className="bg-secondary/30 text-foreground/80 text-xs px-2 py-0.5 rounded-pill font-semibold">
            {entry.category}
          </span>
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="bg-muted text-foreground/70 text-xs px-2 py-0.5 rounded-pill"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <p className="font-display text-lg font-semibold text-foreground leading-snug">
          {entry.title}
        </p>

        {/* Date */}
        <p className="font-sans text-xs text-foreground/70">{formattedDate}</p>

        {/* Excerpt */}
        <p className="font-sans text-sm text-foreground/70 line-clamp-3">
          {entry.excerpt}
        </p>
      </div>
    </Link>
  )
}
