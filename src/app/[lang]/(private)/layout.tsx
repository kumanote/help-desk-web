import type { ReactNode } from 'react'

import RouteHandler from '@/app/route-handler'

import AppProvider from './app-provider'
import { Header } from './header'
import { Sidebar } from './sidebar'

export default async function PrivateRootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <RouteHandler requireAuth={true}>
      <AppProvider>
        <div className="h-screen overflow-hidden flex">
          <Sidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header />
            <main className="flex flex-1 items-stretch overflow-hidden">
              {children}
            </main>
          </div>
        </div>
      </AppProvider>
    </RouteHandler>
  )
}
