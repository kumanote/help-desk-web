import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

interface Props {
  currentPage: number
  totalPage: number
  onChange: (page: number) => void
}

interface PageItem {
  page: number | null
  active: boolean
  label: string
}

export function CardFooterPagination({
  currentPage,
  totalPage,
  onChange,
}: Props) {
  const previous = currentPage - 1
  const hasPrevious = previous > 0
  const next = currentPage + 1
  const hasNext = next <= totalPage
  const computePages = () => {
    const maxItemCount = 7
    const results: Array<PageItem> = []
    const appendItem = (page: number | null) => {
      results.push({
        page,
        active: page === currentPage,
        label: page ? `${page}` : '...',
      })
    }
    if (totalPage <= maxItemCount) {
      for (let i = 1; i <= totalPage; i++) {
        appendItem(i)
      }
      return results
    }
    const half = (maxItemCount - (maxItemCount % 2)) / 2
    if (currentPage <= half || totalPage - currentPage < half) {
      for (let i = 1; i <= half; i++) {
        appendItem(i)
      }
      if (currentPage === half) {
        appendItem(half + 1)
      }
      appendItem(null)
      if (currentPage === totalPage - half + 1) {
        appendItem(totalPage - half)
      }
      for (let i = totalPage - half + 1; i <= totalPage; i++) {
        appendItem(i)
      }
    } else {
      appendItem(1)
      appendItem(null)
      const additional = maxItemCount - 4
      const start = currentPage - (additional - (additional % 2)) / 2
      for (let i = start; i < start + additional; i++) {
        appendItem(i)
      }
      appendItem(null)
      appendItem(totalPage)
    }
    return results
  }
  const pages = computePages()
  return (
    <div className="bg-transparent px-4 py-3 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-700 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <a
          className={clsx(
            'relative inline-flex items-center px-4 py-2 border-base text-sm font-medium rounded-md capitalize',
            hasPrevious
              ? 'text-color-label bg-color-base'
              : 'text-color-dimmed bg-zinc-100 dark:bg-zinc-800'
          )}
          onClick={() => hasPrevious && onChange(previous)}
        >
          <ChevronLeftIcon className="h-5 w-5"></ChevronLeftIcon>
        </a>
        <a
          className={clsx(
            'ml-3 relative inline-flex items-center px-4 py-2 border-base text-sm font-medium rounded-md capitalize',
            hasNext
              ? 'text-color-label bg-color-base'
              : 'text-color-dimmed bg-zinc-100 dark:bg-zinc-800'
          )}
          onClick={() => hasNext && onChange(next)}
        >
          <ChevronRightIcon className="h-5 w-5"></ChevronRightIcon>
        </a>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:flex-row-reverse">
        <div>
          <nav className="relative z-0 inline-flex shadow-sm -space-x-px">
            <a
              className={clsx(
                'relative inline-flex items-center px-2 py-2 rounded-l-md border-base bg-color-base text-sm font-medium',
                hasPrevious
                  ? 'text-color-label hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  : 'text-color-dimmed'
              )}
              onClick={() => hasPrevious && onChange(previous)}
            >
              <ChevronLeftIcon className="h-5 w-5"></ChevronLeftIcon>
            </a>
            {pages.map((item, index) => {
              if (item.page) {
                return (
                  <a
                    key={index}
                    className={clsx(
                      'relative inline-flex items-center px-4 py-2 border-base bg-color-base text-sm font-medium',
                      item.active
                        ? 'text-primary-500 bg-primary-50 dark:bg-primary-800'
                        : 'text-color-label hover:bg-primary-50 dark:hover:bg-primary-800'
                    )}
                    onClick={() => {
                      if (item.page && item.page !== currentPage) {
                        onChange(item.page)
                      }
                    }}
                  >
                    {item.label}
                  </a>
                )
              } else {
                return (
                  <span
                    key={index}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                  >
                    {item.label}
                  </span>
                )
              }
            })}
            <a
              className={clsx(
                'relative inline-flex items-center px-2 py-2 rounded-r-md border-base bg-color-base text-sm font-medium',
                hasNext
                  ? 'text-color-label hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  : 'text-color-dimmed'
              )}
              onClick={() => hasNext && onChange(next)}
            >
              <ChevronRightIcon className="h-5 w-5"></ChevronRightIcon>
            </a>
          </nav>
        </div>
      </div>
    </div>
  )
}
