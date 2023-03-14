import type { ReactNode } from 'react'

import {
  DesktopSettingsNavigations,
  MobileSettingsNavigations,
} from './navigations'
import SettingsProvider from './settings-provider'

export default function Template({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <div className="flex flex-1 flex-col overflow-y-auto xl:overflow-hidden">
        <MobileSettingsNavigations />
        <div className="flex flex-1 xl:overflow-hidden">
          <DesktopSettingsNavigations />
          <div className="w-full flex-1 xl:overflow-y-auto">
            <div className="pt-6 pb-10 px-4 sm:px-6 lg:pb-12 lg:px-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </SettingsProvider>
  )
}
