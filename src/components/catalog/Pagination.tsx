'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

export default function Pagination({ totalPages, currentPage }: { totalPages: number, currentPage: number }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {currentPage > 1 && (
        <Link 
          href={createPageUrl(currentPage - 1)}
          className="px-4 py-2 text-sm border border-foreground/10 rounded-md hover:bg-foreground/5 transition-colors"
        >
          Önceki
        </Link>
      )}
      
      <span className="text-sm font-medium px-4">
        Sayfa {currentPage} / {totalPages}
      </span>

      {currentPage < totalPages && (
        <Link 
          href={createPageUrl(currentPage + 1)}
          className="px-4 py-2 text-sm border border-foreground/10 rounded-md hover:bg-foreground/5 transition-colors"
        >
          Sonraki
        </Link>
      )}
    </div>
  )
}
