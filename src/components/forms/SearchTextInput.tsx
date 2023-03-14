'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { InputHTMLAttributes } from 'react'

interface Props {
  name: string
  id?: string
  error?: string
  label?: string
  placeholder?: string
  help?: string
  wrapperClassName?: string
}

export function SearchTextInput({
  name,
  id,
  error,
  label,
  placeholder,
  help,
  wrapperClassName,
  ...props
}: Props & InputHTMLAttributes<HTMLInputElement>) {
  const hasError = !!error
  return (
    <div className={wrapperClassName}>
      {label && (
        <label
          htmlFor={id || name}
          className="block text-sm font-medium text-color-label"
        >
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <input
          type="search"
          name={name}
          id={id || name}
          placeholder={placeholder || 'Search'}
          className={`block w-full sm:text-sm rounded-md bg-color-base text-color-base py-1.5 pl-10 sm:leading-6 ${
            hasError
              ? 'border-red-300 text-red-600 placeholder-red-300 focus:ring-red-500 focus:border-red-500 pr-10'
              : 'border-zinc-300 focus:ring-primary-500 focus:border-primary-500 dark:border-zinc-700'
          }`}
          {...props}
        />
      </div>
      {hasError ? (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      ) : help ? (
        <p className="mt-2 text-sm text-color-dimmed">{help}</p>
      ) : (
        ''
      )}
    </div>
  )
}
