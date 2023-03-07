import type { ReactNode } from 'react'

import RouteHandler from '@/app/route-handler'

import { Lang, languages } from '@/lib/language'

export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }))
}

export default function PrivateRootLayout({
  children,
  params: { lang },
}: {
  children: ReactNode
  params: {
    lang: Lang
  }
}) {
  return (
    <RouteHandler lang={lang} requireAuth={true}>
      <div>{children}</div>
    </RouteHandler>
  )
}
