'use client'

import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

import { useAuthContext } from '@/app/auth-provider'
import { useLangContext } from '@/app/lang-provider'
import { useWorkspaceContext } from '@/app/workspace-provider'

function Skeleton() {
  // TODO nice custom loading animation.
  return (
    <div className="fixed inset-0 bg-zinc-900 bg-opacity-25 z-50 dark:bg-opacity-75"></div>
  )
}

export default function RouteHandler({
  children,
  requireAuth,
}: {
  children: ReactNode
  requireAuth: boolean
}) {
  const langState = useLangContext()
  const lang = langState!.lang
  const router = useRouter()
  const pathname = usePathname()
  const { state: workspace } = useWorkspaceContext()
  const { state: authState } = useAuthContext()
  useEffect(() => {
    if (!workspace.fetched || !authState.fetched) {
      return
    }
    if (workspace.data === null) {
      // case workspace has not been initialized
      if (pathname !== `/${lang}/welcome`) {
        router.push(`/${lang}/welcome`)
      }
      return
    }
    // case workspace has been initialized
    if (pathname === `/${lang}`) {
      // top page
      if (authState.data == null) {
        router.push(`/${lang}/login`)
      } else {
        router.push(`/${lang}/dashboard`)
      }
      return
    }
    if (requireAuth) {
      // case login required page
      if (authState.data == null) {
        router.push(`/${lang}/login`)
      }
      return
    }
    if (pathname === `/${lang}/welcome`) {
      // case welcome page (even after workspace has been initialized.)
      router.push(`/${lang}/login`)
      return
    }
  }, [workspace, authState, pathname, router, lang, requireAuth])
  if (!workspace.fetched || !authState.fetched) {
    return <Skeleton />
  }
  if (requireAuth && !authState.data) {
    return <Skeleton />
  }
  return <>{children}</>
}
