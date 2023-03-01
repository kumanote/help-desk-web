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
          className="block text-sm font-medium text-color-label"
        >
          {label}
        </label>
      )}
      <div className="mt-1 relative">
        <input
          type={type || 'text'}
          name={name}
          id={id || name}
          placeholder={placeholder}
          className={`block w-full sm:text-sm rounded-md shadow-sm bg-color-base text-color-base ${
            hasError
              ? 'border-red-300 text-red-600 placeholder-red-300 focus:ring-red-500 focus:border-red-500 pr-10'
              : 'border-zinc-300 focus:ring-primary-500 focus:border-primary-500 dark:border-zinc-700'
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
