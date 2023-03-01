import type { ReactNode } from 'react'

import '@/app/globals.scss'
import WorkspaceProvider from '@/app/workspace-provider'

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
    <html lang={lang}>
      <head />
      <body className="bg-color-base">
        <WorkspaceProvider lang={lang}>
          <div className="min-h-screen flex flex-col">
            <Header lang={lang} />
            {children}
            <Footer />
          </div>
        </WorkspaceProvider>
      </body>
    </html>
  )
}
