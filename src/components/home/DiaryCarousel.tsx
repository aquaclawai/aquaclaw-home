'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { DiaryEntry } from '../../../lib/content/diary'
import { DiaryCard } from '@/components/diary/DiaryCard'

interface DiaryCarouselProps {
  entries: DiaryEntry[]
  lang: string
  dict: {
    heading: string
    prev: string
    next: string
    viewAll: string
  }
}

export function DiaryCarousel({ entries, lang, dict }: DiaryCarouselProps) {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const advance = useCallback(() => {
    setCurrent((c) => (c + 1) % entries.length)
  }, [entries.length])

  const retreat = useCallback(() => {
    setCurrent((c) => (c - 1 + entries.length) % entries.length)
  }, [entries.length])

  const startAutoScroll = useCallback(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    timerRef.current = setInterval(advance, 5000)
  }, [advance])

  const pause = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const resume = useCallback(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    timerRef.current = setInterval(advance, 5000)
  }, [advance])

  useEffect(() => {
    startAutoScroll()
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current)
      }
    }
  }, [startAutoScroll])

  if (entries.length === 0) {
    return null
  }

  return (
    <section
      className="py-16 px-4 max-w-6xl mx-auto"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {/* Heading row with view-all link */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-3xl font-bold">{dict.heading}</h2>
        <Link
          href={`/${lang}/diary`}
          className="text-primary font-semibold hover:underline"
        >
          {dict.viewAll}
        </Link>
      </div>

      {/* Carousel viewport */}
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {entries.map((entry) => (
            <div key={entry.slug} className="min-w-full">
              <DiaryCard entry={entry} lang={lang} />
            </div>
          ))}
        </div>
      </div>

      {/* Prev / Next controls */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={retreat}
          className="bg-card rounded-full p-3 shadow-sm hover:shadow-md transition-shadow"
          aria-label={dict.prev}
        >
          <svg
            viewBox="0 0 24 24"
            width={20}
            height={20}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={advance}
          className="bg-card rounded-full p-3 shadow-sm hover:shadow-md transition-shadow"
          aria-label={dict.next}
        >
          <svg
            viewBox="0 0 24 24"
            width={20}
            height={20}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {entries.map((entry, i) => (
          <button
            key={entry.slug}
            onClick={() => setCurrent(i)}
            className={
              i === current
                ? 'bg-primary w-3 h-3 rounded-full'
                : 'bg-muted w-2 h-2 rounded-full'
            }
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
