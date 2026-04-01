'use client'

import { useEffect, useRef, useState } from 'react'

interface StatsCounterProps {
  diaryCount: number
  articleCount: number
  skillCount: number
  dict: {
    heading: string
    diaryLabel: string
    articlesLabel: string
    skillsLabel: string
  }
}

function useCountUp(target: number, duration: number, triggered: boolean): number {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!triggered) return

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setCount(target)
      return
    }

    let rafId: number
    const start = performance.now()

    function frame(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) {
        rafId = requestAnimationFrame(frame)
      } else {
        setCount(target)
      }
    }

    rafId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [triggered, target, duration])

  return count
}

export function StatsCounter({
  diaryCount,
  articleCount,
  skillCount,
  dict,
}: StatsCounterProps) {
  const ref = useRef<HTMLElement>(null)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          setTriggered(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  }, [])

  const diary = useCountUp(diaryCount, 1500, triggered)
  const articles = useCountUp(articleCount, 1500, triggered)
  const skills = useCountUp(skillCount, 1500, triggered)

  return (
    <section ref={ref} className="py-16 px-4 bg-muted/50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display text-3xl font-bold text-center mb-10">
          {dict.heading}
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
          <div className="flex flex-col items-center">
            <span className="font-display text-5xl md:text-6xl font-bold text-primary">
              {diary}
            </span>
            <span className="font-sans text-foreground/70 mt-1">{dict.diaryLabel}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-display text-5xl md:text-6xl font-bold text-primary">
              {articles}
            </span>
            <span className="font-sans text-foreground/70 mt-1">{dict.articlesLabel}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-display text-5xl md:text-6xl font-bold text-primary">
              {skills}
            </span>
            <span className="font-sans text-foreground/70 mt-1">{dict.skillsLabel}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
