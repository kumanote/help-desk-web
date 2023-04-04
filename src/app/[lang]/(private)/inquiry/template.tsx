import type { ReactNode } from 'react'

import InquiryProvider from './inquiry-provider'
import {
  DesktopInquiryNavigations,
  MobileInquiryNavigations,
} from './navigations'

export default function Template({ children }: { children: ReactNode }) {
  return (
    <InquiryProvider>
      <div className="flex flex-1 flex-col overflow-y-auto xl:overflow-hidden">
        <MobileInquiryNavigations />
        <div className="flex flex-1 xl:overflow-hidden">
          <DesktopInquiryNavigations />
          <div className="w-full flex-1 xl:overflow-y-auto">
            <div className="pt-6 pb-10 px-4 sm:px-6 lg:pb-12 lg:px-8 h-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </InquiryProvider>
  )
}
