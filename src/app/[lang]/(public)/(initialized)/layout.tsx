import { redirect } from 'next/navigation'

import '@/app/globals.scss'
import WorkspaceProvider from '@/app/workspace-provider'

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
  if (workspace === null) {
    redirect(`/${lang}/welcome`)
  }
  return (
    <html lang={lang}>
      {/*
        <head /> will contain the components returned by the nearest parent head.tsx.
        Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <WorkspaceProvider workspace={workspace}>{children}</WorkspaceProvider>
      </body>
    </html>
  )
}
