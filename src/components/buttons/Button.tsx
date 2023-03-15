'use client'

import { cva } from 'class-variance-authority'
import React, { forwardRef } from 'react'

const button = cva('button', {
  variants: {
    intent: {
      primary: [
        'inline-flex',
        'items-center',
        'justify-center',
        'bg-primary-500',
        'text-white',
        'border',
        'border-transparent',
        'shadow-sm',
        'dark:shadow-zinc-700',
        'hover:bg-primary-600',
        'dark:hover:bg-primary-400',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-primary-500',
        'focus:ring-offset-2',
      ],
      secondary: [
        'inline-flex',
        'items-center',
        'justify-center',
        'bg-primary-100',
        'text-primary-700',
        'border',
        'border-transparent',
        'hover:bg-primary-200',
        'dark:hover:bg-primary-200',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-primary-500',
        'focus:ring-offset-2',
      ],
      normal: [
        'inline-flex',
        'items-center',
        'justify-center',
        'bg-white',
        'dark:bg-zinc-900',
        'text-gray-700',
        'dark:text-gray-200',
        'border',
        'border-zinc-300',
        'dark:border-zinc-700',
        'shadow-sm',
        'dark:shadow-zinc-700',
        'hover:bg-zinc-50',
        'dark:hover:bg-zinc-800',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-primary-500',
        'focus:ring-offset-2',
      ],
      danger: [
        'inline-flex',
        'items-center',
        'justify-center',
        'bg-red-500',
        'text-white',
        'border',
        'border-transparent',
        'shadow-sm',
        'dark:shadow-zinc-700',
        'hover:bg-red-600',
        'dark:hover:bg-red-400',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-red-500',
        'focus:ring-offset-2',
      ],
    },
    size: {
      small: ['text-xs', 'py-1', 'px-2', 'rounded'],
      medium: ['text-sm', 'py-2', 'px-4', 'rounded-md'],
    },
    condition: {
      normal: [''],
      loading: ['bg-opacity-75', 'pointer-events-none'],
    },
  },
  compoundVariants: [
    {
      intent: 'normal',
      size: 'medium',
      condition: 'normal',
      class: 'capitalize',
    },
  ],
  defaultVariants: {
    intent: 'normal',
    size: 'medium',
    condition: 'normal',
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  intent?: 'primary' | 'secondary' | 'normal' | 'danger'
  size?: 'small' | 'medium'
  className?: string
  loading?: boolean
}

const Loader = () => {
  return (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, intent, size, loading, children, ...props },
    ref
  ) {
    if (loading) {
      return (
        <button
          className={button({ intent, size, className, condition: 'loading' })}
          disabled
          ref={ref}
          {...props}
        >
          <Loader />
          {children}
        </button>
      )
    } else {
      return (
        <button
          className={button({ intent, size, className, condition: 'normal' })}
          ref={ref}
          {...props}
        >
          {children}
        </button>
      )
    }
  }
)
