import type { ReactNode } from 'react'

interface DiaryCardGridProps {
  children: ReactNode
}

export function DiaryCardGrid({ children }: DiaryCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  )
}
