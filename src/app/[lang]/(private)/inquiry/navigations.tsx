'use client'

import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import Link from 'next/link'
import { Fragment } from 'react'

import { useLangContext } from '@/app/lang-provider'

import { useInquiryContext } from './inquiry-provider'

export function MobileInquiryNavigations() {
  const langState = useLangContext()
  const dictionary = langState!.dictionary
  const { state: inquiryState } = useInquiryContext()
  return (
    <nav className="border-b border-slate-200 dark:border-zinc-700 bg-transparent xl:hidden">
      <Popover className="relative isolate z-30 shadow">
        <div className="bg-color-base py-4">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-color-label capitalize">
              {dictionary.menu}
              <ChevronDownIcon className="h-5 w-5" />
            </Popover.Button>
          </div>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 -translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-1"
        >
          <Popover.Panel className="absolute inset-x-0 top-0 -z-10 pt-12 bg-color-sheet">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-2 px-6 py-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-0 lg:grid-cols-4 lg:gap-4 lg:px-8 xl:gap-8">
              {inquiryState.navigationItems.map((item) => (
                <div
                  key={item.name}
                  className="group relative -mx-3 flex gap-6 rounded-lg p-3 text-sm leading-6 hover:bg-zinc-50 dark:hover:bg-zinc-800 sm:flex-col sm:p-6"
                >
                  <div>
                    <Link
                      href={item.href}
                      className="font-semibold text-color-base capitalize"
                    >
                      {item.title}
                      <span className="absolute inset-0" />
                    </Link>
                    <p className="mt-1 text-color-dimmed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </nav>
  )
}

export function DesktopInquiryNavigations() {
  const langState = useLangContext()
  const dictionary = langState!.dictionary
  const { state: inquiryState } = useInquiryContext()
  return (
    <nav className="hidden w-80 flex-shrink-0 border-r border-zinc-200 dark:border-zinc-700 bg-transparent xl:flex xl:flex-col">
      <div className="flex h-12 flex-shrink-0 items-center border-b border-slate-200 dark:border-zinc-700 px-4">
        <p className="text-sm font-medium text-color-base capitalize">
          {dictionary.inquiry.title}
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {inquiryState.navigationItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={clsx(
              item.current
                ? 'bg-primary-50 dark:bg-primary-900'
                : 'hover:bg-primary-50 dark:hover:bg-primary-900',
              'border-zinc-200 dark:border-zinc-700 flex border-b p-4'
            )}
            aria-current={item.current ? 'page' : undefined}
          >
            <div className="text-sm">
              <p className="font-medium text-color-base capitalize">
                {item.title}
              </p>
              <p className="mt-1 text-color-dimmed">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  )
}
