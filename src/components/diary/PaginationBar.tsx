import Link from 'next/link'

interface PaginationBarProps {
  currentPage: number
  totalPages: number
  lang: string
  basePath: string
}

export function PaginationBar({
  currentPage,
  totalPages,
  lang,
  basePath,
}: PaginationBarProps) {
  if (totalPages <= 1) return null

  function pageHref(page: number): string {
    if (page === 1) return `/${lang}/${basePath}`
    return `/${lang}/${basePath}/page/${page}`
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2 flex-wrap"
    >
      {/* Prev arrow */}
      {currentPage > 1 ? (
        <Link
          href={pageHref(currentPage - 1)}
          className="flex items-center justify-center w-9 h-9 bg-card text-foreground rounded-pill hover:bg-muted transition-colors shadow-sm"
          aria-label="Previous page"
        >
          ←
        </Link>
      ) : (
        <span
          className="flex items-center justify-center w-9 h-9 bg-card text-foreground/30 rounded-pill cursor-not-allowed shadow-sm"
          aria-disabled="true"
          aria-label="No previous page"
        >
          ←
        </span>
      )}

      {/* Page numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
        const isCurrent = page === currentPage
        return isCurrent ? (
          <span
            key={page}
            className="flex items-center justify-center w-9 h-9 bg-primary text-white rounded-pill font-semibold text-sm"
            aria-current="page"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={pageHref(page)}
            className="flex items-center justify-center w-9 h-9 bg-card text-foreground rounded-pill hover:bg-muted transition-colors shadow-sm text-sm"
            aria-label={`Page ${page}`}
          >
            {page}
          </Link>
        )
      })}

      {/* Next arrow */}
      {currentPage < totalPages ? (
        <Link
          href={pageHref(currentPage + 1)}
          className="flex items-center justify-center w-9 h-9 bg-card text-foreground rounded-pill hover:bg-muted transition-colors shadow-sm"
          aria-label="Next page"
        >
          →
        </Link>
      ) : (
        <span
          className="flex items-center justify-center w-9 h-9 bg-card text-foreground/30 rounded-pill cursor-not-allowed shadow-sm"
          aria-disabled="true"
          aria-label="No next page"
        >
          →
        </span>
      )}
    </nav>
  )
}
