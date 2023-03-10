'use client'

import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useAuthContext } from '@/app/auth-provider'
import { useLangContext } from '@/app/lang-provider'

export function NoAvailableLocaleWarnings() {
  const router = useRouter()
  const langState = useLangContext()
  const lang = langState!.lang
  const dictionary = langState!.dictionary
  const { state: authState } = useAuthContext()
  const isAdminAuthorized =
    authState.data !== null &&
    authState.data.scopes.find((scope) => ['admin:faq'].includes(scope))
  return (
    <div className="rounded-md bg-yellow-50 dark:bg-yellow-900 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon
            className="h-5 w-5 text-yellow-400 dark:text-yellow-600"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            {dictionary.faq.no_available_locale_warning.title}
          </h3>
          <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
            <p>{dictionary.faq.no_available_locale_warning.description}</p>
          </div>
          {isAdminAuthorized && (
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <Link
                  href={`/${lang}/faq/admin`}
                  className="rounded-md bg-yellow-50 dark:bg-yellow-900 px-2 py-1.5 text-sm font-medium text-yellow-800 dark:text-yellow-200 hover:bg-yellow-100 dark:hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50 underline"
                >
                  {dictionary.faq.no_available_locale_warning.nav_label}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
