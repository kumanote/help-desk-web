'use client'

import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

import { useAuthContext } from '@/app/auth-provider'
import { useLangContext } from '@/app/lang-provider'

export default function FaqIndexRouteHandler({
  children,
}: {
  children: ReactNode
}) {
  const langState = useLangContext()
  const lang = langState!.lang
  const router = useRouter()
  const pathname = usePathname()
  const { state: authState } = useAuthContext()

  useEffect(() => {
    if (!authState.fetched) {
      return
    }
    const isReadAuthorized =
      authState.data !== null &&
      authState.data.scopes.find((scope) =>
        ['read:faq', 'write:faq', 'admin:faq'].includes(scope)
      )
    const isAdminAuthorized =
      authState.data !== null &&
      authState.data.scopes.find((scope) => ['admin:faq'].includes(scope))
    if (isReadAuthorized) {
      router.push(`/${lang}/faq/items`)
    } else if (isAdminAuthorized) {
      router.push(`/${lang}/faq/admin`)
    }
  }, [authState, pathname, router, lang])

  return <>{children}</>
}
