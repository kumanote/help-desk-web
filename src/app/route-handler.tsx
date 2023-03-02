'use client'

import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

import { useWorkspaceContext } from '@/app/workspace-provider'

import { Lang } from '@/lib/language'

export default function RouteHandler({
  children,
  lang,
}: {
  children: ReactNode
  lang: Lang
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { state: workspace } = useWorkspaceContext()
  useEffect(() => {
    if (workspace === null) {
      if (pathname !== `/${lang}/welcome`) {
        router.push(`/${lang}/welcome`)
      }
    } else {
      if (pathname !== `/${lang}/login`) {
        router.push(`/${lang}/login`)
      }
    }
  }, [workspace, pathname, router, lang])
  return <>{children}</>
}
