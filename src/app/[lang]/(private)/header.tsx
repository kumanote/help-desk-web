'use client'

import { Menu, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Fragment } from 'react'

import { useAppContext } from '@/app/[lang]/(private)/app-provider'
import { deleteAuthTokenCookie, useAuthContext } from '@/app/auth-provider'
import { useLangContext } from '@/app/lang-provider'

import { AgentAvatar } from '@/components/avatars/AgentAvatar'

import { logout } from '@/api/gateway/auth'

export function Header() {
  const router = useRouter()
  const langState = useLangContext()
  const lang = langState!.lang
  const dictionary = langState!.dictionary
  const { state: authState, dispatch: authDispatcher } = useAuthContext()
  const { state: appState, dispatch: appDispatcher } = useAppContext()
  const setMobileMenuOpen = (value: boolean) =>
    appDispatcher({ type: 'setGlobalMobileMenuOpen', payload: value })
  const handleLogout = async (event: any) => {
    event.preventDefault()
    router.push(`/${lang}/login`)
    const accessToken = authState.data!.token
    await logout({ lang, access_token: accessToken })
    deleteAuthTokenCookie()
    authDispatcher({ type: 'clear' })
  }
  return (
    <header className="w-full">
      <div className="relative z-40 flex h-12 flex-shrink-0 border-b border-zinc-200 dark:border-zinc-700 bg-transparent shadow-sm">
        <button
          type="button"
          className="border-r border-zinc-200 dark:border-zinc-700 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex flex-1 justify-between px-4 sm:px-6">
          <div className="flex flex-1">
            <div className="flex w-full md:ml-0">
              <div className="relative w-full text-color-dimmed focus-within:text-gray-600 dark:focus-within:text-gray-400">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                  <MagnifyingGlassIcon
                    className="h-5 w-5 flex-shrink-0"
                    aria-hidden="true"
                  />
                </div>
                <input
                  name="mobile-search"
                  className="h-full w-full border-0 pl-8 pr-3 text-base bg-color-base text-color-base focus:outline-none focus:ring-0 focus:placeholder:text-gray-400 dark:focus:placeholder:text-gray-600 sm:hidden"
                  placeholder="Search"
                  type="search"
                />
                <input
                  name="desktop-search"
                  className="hidden h-full w-full border-0 pl-8 pr-3 text-sm bg-color-base text-color-base focus:outline-none focus:ring-0 focus:placeholder:text-gray-400 dark:focus:placeholder:text-gray-600 sm:block"
                  placeholder="Search"
                  type="search"
                />
              </div>
            </div>
          </div>
          <div className="ml-2 flex items-center space-x-4 sm:ml-6 sm:space-x-6">
            <Menu as="div" className="relative flex-shrink-0">
              <div>
                <Menu.Button className="flex rounded-full text-sm ring-1 ring-zinc-200 dark:ring-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2">
                  <AgentAvatar size={28} />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-40 mt-2 w-48 origin-top-right rounded-md py-1 bg-color-base shadow-lg dark:shadow-zinc-700 ring-1 ring-black dark:ring-zinc-600 ring-opacity-5 focus:outline-none">
                  {appState.profileNavigationItems.map((item) => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        <Link
                          href={item.href}
                          className={clsx(
                            active ? 'bg-zinc-100 dark:bg-zinc-800' : '',
                            'block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 capitalize'
                          )}
                        >
                          {item.label}
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        className={clsx(
                          active ? 'bg-zinc-100 dark:bg-zinc-800' : '',
                          'block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 capitalize'
                        )}
                        onClick={handleLogout}
                      >
                        {dictionary.logout}
                      </a>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  )
}
