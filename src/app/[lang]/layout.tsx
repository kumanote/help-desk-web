import type { ReactNode } from 'react'

import { getDictionary } from '@/app/[lang]/dictionaries'
import AuthProvider from '@/app/auth-provider'
import '@/app/globals.scss'
import LangProvider from '@/app/lang-provider'
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
  const dictionary = await getDictionary(lang)
  return (
    <html lang={lang}>
      <head />
      <body className="bg-color-base">
        <LangProvider lang={lang} dictionary={dictionary}>
          <NotificationsProvider>
            <WorkspaceProvider>
              <AuthProvider>{children}</AuthProvider>
            </WorkspaceProvider>
          </NotificationsProvider>
        </LangProvider>
      </body>
    </html>
  )
}
