'use client'

import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Link from 'next/link'
import { Fragment } from 'react'

import { useAppContext } from '@/app/[lang]/(private)/app-provider'

import { Logo } from '@/components/logos/Logo'

export function Sidebar() {
  const { state: appState, dispatch: appDispatcher } = useAppContext()
  const setMobileMenuOpen = (value: boolean) =>
    appDispatcher({ type: 'setGlobalMobileMenuOpen', payload: value })
  return (
    <>
      {/* Narrow sidebar */}
      <div className="hidden w-20 overflow-y-auto bg-transparent md:block border-r border-zinc-200 dark:border-zinc-700">
        <div className="flex w-full flex-col items-center py-6">
          <div className="flex flex-shrink-0 items-center">
            <Logo className="mx-auto h-8 w-8 text-primary-500" />
          </div>
          <div className="mt-6 w-full flex-1 space-y-1 px-2 flex flex-col items-center">
            {appState.globalNavigationItems.map((item) => {
              return (
                <span key={item.name} className="relative group">
                  <span
                    className="z-50 whitespace-nowrap rounded text-white dark:text-primary-900 bg-primary-800 dark:bg-primary-20http://localhost:3000/ja/inquiry/admin
                  0 px-2 py-1 text-xs translate-y-10 translate-x-10 fixed opacity-0 group-hover:opacity-100 transition pointer-events-none"
                  >
                    {item.label}
                  </span>
                  <Link
                    href={item.href}
                    className={clsx(
                      item.current
                        ? 'bg-primary-200 dark:bg-primary-700'
                        : 'hover:bg-primary-200 dark:hover:bg-primary-700',
                      'group inline-flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    <item.icon
                      className={clsx(
                        item.current
                          ? 'text-primary-700 dark:text-primary-200'
                          : 'text-gray-500 group-hover:text-primary-700 dark:group-hover:text-primary-200',
                        'h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                  </Link>
                </span>
              )
            })}
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      <Transition.Root show={appState.globalMobileMenuOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 md:hidden"
          onClose={setMobileMenuOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-zinc-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-color-base pt-5 pb-4">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-1 right-0 -mr-14 p-1">
                    <button
                      type="button"
                      className="flex h-12 w-12 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex flex-shrink-0 items-center px-4">
                  <Logo className="h-8 w-8 text-primary-500" />
                </div>
                <div className="mt-8 h-0 flex-1 overflow-y-auto px-2">
                  <nav className="flex h-full flex-col">
                    <div className="space-y-3">
                      {appState.globalNavigationItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={clsx(
                            item.current
                              ? 'bg-primary-200 text-primary-700 dark:bg-primary-700 dark:text-primary-200'
                              : 'text-gray-500 hover:bg-primary-200 hover:text-primary-700 dark:hover:bg-primary-700 dark:hover:text-primary-200',
                            'group flex items-center rounded-md py-2 px-3 text-sm font-medium'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          <item.icon
                            className={clsx(
                              item.current
                                ? 'text-primary-600 dark:text-primary-400'
                                : 'text-gray-400 dark:text-gray-600 group-hover:text-primary-600',
                              'mr-3 h-6 w-6'
                            )}
                            aria-hidden="true"
                          />
                          <span className="capitalize">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="w-14 flex-shrink-0" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
