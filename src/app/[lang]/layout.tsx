import type { ReactNode } from 'react'

import AuthProvider from '@/app/auth-provider'
import '@/app/globals.scss'
import NotificationsProvider from '@/app/notification-provider'
import WorkspaceProvider from '@/app/workspace-provider'

import { Lang, languages } from '@/lib/language'

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
        <NotificationsProvider>
          <WorkspaceProvider lang={lang}>
            <AuthProvider lang={lang}>{children}</AuthProvider>
          </WorkspaceProvider>
        </NotificationsProvider>
      </body>
    </html>
  )
}
