'use client'

import {
  Cog8ToothIcon,
  HomeIcon,
  InboxIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'
import type { Dispatch, ReactNode } from 'react'
import { createContext, useContext, useEffect, useReducer } from 'react'

import { useAuthContext } from '@/app/auth-provider'
import { useLangContext } from '@/app/lang-provider'

export type GlobalNavigationItemType =
  | 'dashboard'
  | 'inquiry'
  | 'faq'
  | 'announcement'
  | 'workspace'

export interface GlobalNavigationItem {
  name: GlobalNavigationItemType
  label: string
  icon: any
  href: string
  current: boolean
}

export type ProfileNavigationItemType = 'profile'

export interface ProfileNavigationItem {
  name: ProfileNavigationItemType
  label: string
  href: string
}

export type AppState = {
  globalNavigationItems: Array<GlobalNavigationItem>
  globalMobileMenuOpen: boolean
  profileNavigationItems: Array<ProfileNavigationItem>
}

export type AppStoreAction =
  | {
      type: 'setNavigationItems'
      payload: {
        globalNavigationItems: Array<GlobalNavigationItem>
        profileNavigationItems: Array<ProfileNavigationItem>
      }
    }
  | {
      type: 'setGlobalMobileMenuOpen'
      payload: boolean
    }

const AppContext = createContext(
  {} as {
    state: AppState
    dispatch: Dispatch<AppStoreAction>
  }
)

function reducer(state: AppState, action: AppStoreAction) {
  switch (action.type) {
    case 'setNavigationItems':
      return {
        ...state,
        globalNavigationItems: action.payload.globalNavigationItems,
        profileNavigationItems: action.payload.profileNavigationItems,
      }
    case 'setGlobalMobileMenuOpen':
      return {
        ...state,
        globalMobileMenuOpen: action.payload,
      }
  }
}

export function useAppContext() {
  return useContext(AppContext)
}

export function useAppStore(): [AppState, Dispatch<AppStoreAction>] {
  return useReducer(reducer, {
    globalNavigationItems: [],
    globalMobileMenuOpen: false,
    profileNavigationItems: [],
  })
}

export default function AppProvider({ children }: { children: ReactNode }) {
  const langState = useLangContext()
  const lang = langState!.lang
  const dict = langState!.dictionary
  const [state, dispatch] = useAppStore()
  const pathname = usePathname()
  const { state: authState } = useAuthContext()
  useEffect(() => {
    if (!authState.fetched) {
      return
    }
    // global(side bar) navigation items
    let globalNavigationItems: Array<GlobalNavigationItem> = [
      {
        name: 'dashboard',
        label: dict.navigations.dashboard,
        icon: HomeIcon,
        href: `/${lang}/dashboard`,
        current: false,
      },
      {
        name: 'inquiry',
        label: dict.navigations.inquiry,
        icon: InboxIcon,
        href: `/${lang}/inquiry`,
        current: false,
      },
      {
        name: 'faq',
        label: dict.navigations.faq,
        icon: QuestionMarkCircleIcon,
        href: `/${lang}/faq`,
        current: false,
      },
      {
        name: 'announcement',
        label: dict.navigations.announcement,
        icon: InformationCircleIcon,
        href: `/${lang}/announcement`,
        current: false,
      },
      {
        name: 'workspace',
        label: dict.navigations.workspace,
        icon: Cog8ToothIcon,
        href: `/${lang}/workspace`,
        current: false,
      },
    ]
    globalNavigationItems = globalNavigationItems.filter((item) => {
      switch (item.name) {
        case 'dashboard':
          return true
        case 'inquiry':
          return (
            authState.data !== null &&
            authState.data.scopes.find((scope) => scope.includes('inquiry'))
          )
        case 'faq':
          return (
            authState.data !== null &&
            authState.data.scopes.find((scope) => scope.includes('faq'))
          )
        case 'announcement':
          return (
            authState.data !== null &&
            authState.data.scopes.find((scope) =>
              scope.includes('announcement')
            )
          )
        case 'workspace':
          return (
            authState.data !== null &&
            authState.data.scopes.find((scope) => scope.includes('workspace'))
          )
      }
    })
    globalNavigationItems = globalNavigationItems.map((item) => {
      return {
        ...item,
        current: pathname !== null && pathname.startsWith(item.href),
      }
    })
    // global(header) profile navigation items
    let profileNavigationItems: Array<ProfileNavigationItem> = [
      {
        name: 'profile',
        label: dict.navigations.profile,
        href: `/${lang}/settings/profile`,
      },
    ]
    profileNavigationItems.filter((item) => {
      switch (item.name) {
        case 'profile':
          return (
            authState.data !== null &&
            authState.data.scopes.find((scope) => scope.includes('profile'))
          )
      }
    })
    dispatch({
      type: 'setNavigationItems',
      payload: {
        globalNavigationItems,
        profileNavigationItems,
      },
    })
  }, [authState, pathname, dispatch, lang, dict])
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}
