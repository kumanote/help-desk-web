import '@/app/globals.css'

import { locales } from '@/lib/language'

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export default function PublicRootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode
  params: {
    lang: string
  }
}) {
  return (
    <html lang={lang}>
      {/*
        <head /> will contain the components returned by the nearest parent head.tsx.
        Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>{children}</body>
    </html>
  )
}
