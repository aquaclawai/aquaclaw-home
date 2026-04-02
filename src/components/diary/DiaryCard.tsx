import Link from 'next/link'
import Image from 'next/image'
import type { DiaryEntry } from '../../../lib/content/diary'
import { MascotImage } from '@/components/ui/MascotImage'

const MASCOT_POSES = ['default', 'waving', 'thinking', 'sleeping'] as const
const THUMBNAIL_BG_CLASSES = [
  'bg-primary/20',
  'bg-secondary/30',
  'bg-accent/20',
  'bg-contrast/20',
] as const

interface DiaryCardProps {
  entry: DiaryEntry
  lang: string
}

export function DiaryCard({ entry, lang }: DiaryCardProps) {
  const poseIndex = entry.dayNumber % MASCOT_POSES.length
  const bgIndex = entry.dayNumber % THUMBNAIL_BG_CLASSES.length
  const pose = MASCOT_POSES[poseIndex] ?? 'default'
  const thumbnailBg = THUMBNAIL_BG_CLASSES[bgIndex] ?? 'bg-primary/20'

  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Link
      href={`/${lang}/diary/${entry.slug}`}
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
            alt={`AquaClaw mascot — Day ${entry.dayNumber}`}
          />
        )}
      </div>

      {/* Content area */}
      <div className="p-4 flex flex-col gap-2">
        {/* Day pill */}
        <span className="inline-flex w-fit bg-primary-dark text-white rounded-pill px-3 py-1 font-display font-semibold text-xs">
          Day {entry.dayNumber}
        </span>

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

        {/* Tags */}
        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="bg-muted text-foreground/70 text-xs px-2 py-0.5 rounded-pill"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
