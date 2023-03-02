'use client'

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface Props {
  name: string
  id?: string
  error?: string
  label?: string
  placeholder?: string
  help?: string
  wrapperClassName?: string
}

export function PasswordInput({
  name,
  id,
  error,
  label,
  placeholder,
  help,
  wrapperClassName,
  ...props
}: Props) {
  const [visible, setVisible] = useState(false)
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
          type={visible ? 'text' : 'password'}
          name={name}
          id={id || name}
          placeholder={placeholder}
          className={`block w-full sm:text-sm rounded-md shadow-sm bg-color-base text-color-base pr-10 ${
            hasError
              ? 'border-red-300 text-red-600 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-zinc-300 focus:ring-primary-500 focus:border-primary-500 dark:border-zinc-700'
          }`}
          {...props}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
          {visible ? (
            <EyeSlashIcon
              className="h-5 w-5 text-color-dimmed"
              onClick={() => setVisible(false)}
            />
          ) : (
            <EyeIcon
              className="h-5 w-5 text-color-dimmed"
              onClick={() => setVisible(true)}
            />
          )}
        </div>
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
