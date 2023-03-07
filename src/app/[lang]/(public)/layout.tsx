import type { ReactNode } from 'react'

import RouteHandler from '@/app/route-handler'

import { Lang, languages } from '@/lib/language'

import { Footer } from './footer'
import { Header } from './header'

export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }))
}

export default async function PublicRootLayout({
  children,
  params: { lang },
}: {
  children: ReactNode
  params: {
    lang: Lang
  }
}) {
  return (
    <RouteHandler lang={lang} requireAuth={false}>
      <div className="min-h-screen flex flex-col">
        <Header lang={lang} />
        {children}
        <Footer />
      </div>
    </RouteHandler>
  )
}
