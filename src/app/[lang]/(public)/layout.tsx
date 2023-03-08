import type { ReactNode } from 'react'

import RouteHandler from '@/app/route-handler'

import { Footer } from './footer'
import { Header } from './header'

export default async function PublicRootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <RouteHandler requireAuth={false}>
      <div className="min-h-screen flex flex-col">
        <Header />
        {children}
        <Footer />
      </div>
    </RouteHandler>
  )
}
