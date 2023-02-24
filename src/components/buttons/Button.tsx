'use client'

import { type VariantProps, cva } from 'class-variance-authority'
import React from 'react'

const button = cva('button', {
  variants: {
    intent: {
      primary: [
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
  },
  compoundVariants: [{ intent: 'normal', size: 'medium', class: 'capitalize' }],
  defaultVariants: {
    intent: 'normal',
    size: 'medium',
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button: React.FC<ButtonProps> = ({
  className,
  intent,
  size,
  ...props
}) => <button className={button({ intent, size, className })} {...props} />
