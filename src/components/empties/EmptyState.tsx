'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

import { useLangContext } from '@/app/lang-provider'

export function EmptyState() {
  const langState = useLangContext()
  const dictionary = langState!.dictionary
  return (
    <div className="flex flex-col items-center justify-center py-24 block w-full rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600">
      <MagnifyingGlassIcon className="h-12 w-12 text-color-dimmed"></MagnifyingGlassIcon>
      <p className="mt-2 text-color-label">{dictionary.no_data_found}</p>
    </div>
  )
}
