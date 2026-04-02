'use client'

// src/components/engagement/GiscusComments.tsx
// GitHub Discussions-backed comment widget via Giscus
// Only renders when NEXT_PUBLIC_GISCUS_REPO_ID and NEXT_PUBLIC_GISCUS_CATEGORY_ID are set

import Giscus from '@giscus/react'

interface GiscusCommentsProps {
  lang: string
}

export function GiscusComments({ lang }: GiscusCommentsProps) {
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID

  // Gracefully hide if env vars are not configured — prevents broken iframes in development
  if (!repoId || !categoryId) {
    return null
  }

  return (
    <section className="mt-16 pt-8 border-t border-muted">
      <Giscus
        repo="aquaclawai/aquaclaw-home"
        repoId={repoId}
        category="Comments"
        categoryId={categoryId}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="preferred_color_scheme"
        lang={lang}
        loading="lazy"
      />
    </section>
  )
}
