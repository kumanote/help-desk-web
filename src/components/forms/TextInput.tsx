'use client'

import { ExclamationCircleIcon } from '@heroicons/react/20/solid'

interface Props {
  type?: string
  name: string
  id?: string
  error?: string
  label?: string
  placeholder?: string
  help?: string
  wrapperClassName?: string
}

export function TextInput({
  type,
  name,
  id,
  error,
  label,
  placeholder,
  help,
  wrapperClassName,
  ...props
}: Props) {
  const hasError = !!error
  return (
    <div className={wrapperClassName}>
      {label && (
        <label
          htmlFor={id || name}
          className="block text-sm font-medium text-color-label mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type || 'text'}
          name={name}
          id={id || name}
          placeholder={placeholder}
          className={`block w-full sm:text-sm rounded-md shadow-sm bg-color-base text-color-base ${
            hasError
              ? 'border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 placeholder-red-300 dark:placeholder-red-600 focus:ring-red-500 focus:border-red-500 pr-10'
              : 'border-zinc-300 dark:border-zinc-700 focus:ring-primary-500 focus:border-primary-500'
          }`}
          {...props}
        />
        {hasError && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
          </div>
        )}
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
