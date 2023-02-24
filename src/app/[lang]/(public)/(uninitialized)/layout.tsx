import { redirect } from 'next/navigation'

import '@/app/globals.scss'

import { languages } from '@/lib/language'

import { getWorkspace } from '@/api/gateway/workspace'

export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }))
}

export default async function PublicRootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode
  params: {
    lang: string
  }
}) {
  const workspace = await getWorkspace()
  if (workspace !== null) {
    redirect(`/${lang}/login`)
  }
  return (
    <html lang={lang}>
      <head />
      <body className="font-inter tracking-tight antialiased min-h-screen bg-white text-gray-900 dark:bg-zinc-900 dark:text-gray-50">
        {children}
      </body>
    </html>
  )
}
