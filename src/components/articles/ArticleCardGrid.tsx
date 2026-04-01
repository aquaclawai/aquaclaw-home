import type { ReactNode } from 'react'

interface ArticleCardGridProps {
  children: ReactNode
}

export function ArticleCardGrid({ children }: ArticleCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  )
}
