'use client'

import { Switch } from '@headlessui/react'
import clsx from 'clsx'
import type { ReactNode } from 'react'

interface Props {
  value?: boolean
  onChange: (value: boolean) => void
  error?: string
  wrapperClassName?: string
  children?: ReactNode
}

export function Toggle({
  value,
  onChange,
  error,
  wrapperClassName,
  children,
}: Props) {
  const checked = !!value
  const hasError = !!error
  return (
    <div className={wrapperClassName}>
      <Switch.Group as="div" className="flex items-center">
        <Switch
          checked={value}
          onChange={onChange}
          className={clsx(
            checked ? 'bg-primary-500' : 'bg-zinc-200 dark:bg-zinc-700',
            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
          )}
        >
          <span
            aria-hidden="true"
            className={clsx(
              checked ? 'translate-x-5' : 'translate-x-0',
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-zinc-900 ring-0 transition duration-200 ease-in-out'
            )}
          />
        </Switch>
        {children && (
          <Switch.Label as="span" className="ml-3 text-sm">
            {children}
          </Switch.Label>
        )}
      </Switch.Group>
      {hasError && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}
