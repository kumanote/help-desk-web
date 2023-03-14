import type { ReactNode } from 'react'

import FaqProvider from './faq-provider'
import { DesktopFaqNavigations, MobileFaqNavigations } from './navigations'

export default function Template({ children }: { children: ReactNode }) {
  return (
    <FaqProvider>
      <div className="flex flex-1 flex-col overflow-y-auto xl:overflow-hidden">
        <MobileFaqNavigations />
        <div className="flex flex-1 xl:overflow-hidden">
          <DesktopFaqNavigations />
          <div className="w-full flex-1 xl:overflow-y-auto">
            <div className="pt-6 pb-10 px-4 sm:px-6 lg:pb-12 lg:px-8 h-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </FaqProvider>
  )
}
