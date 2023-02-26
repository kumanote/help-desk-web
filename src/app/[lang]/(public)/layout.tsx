import type { ReactNode } from 'react'

import '@/app/globals.scss'
import WorkspaceProvider from '@/app/workspace-provider'

import { languages } from '@/lib/language'

export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }))
}

export default async function PublicRootLayout({
  children,
  params: { lang },
}: {
  children: ReactNode
  params: {
    lang: string
  }
}) {
  return (
    <html lang={lang}>
      <head />
      <body>
        <WorkspaceProvider lang={lang}>{children}</WorkspaceProvider>
      </body>
    </html>
  )
}
