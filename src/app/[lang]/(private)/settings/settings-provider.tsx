'use client'

import { usePathname } from 'next/navigation'
import type { Dispatch, ReactNode } from 'react'
import { createContext, useContext, useEffect, useReducer } from 'react'

import { useAuthContext } from '@/app/auth-provider'
import { useLangContext } from '@/app/lang-provider'

export type SettingsNavigationItemType = 'profile' | 'security' | 'language'

export interface SettingsNavigationItem {
  name: SettingsNavigationItemType
  title: string
  description: string
  href: string
  current: boolean
}

export type SettingsState = {
  navigationItems: Array<SettingsNavigationItem>
}

export type SettingsStoreAction = {
  type: 'setNavigationItems'
  payload: Array<SettingsNavigationItem>
}

const SettingsContext = createContext(
  {} as {
    state: SettingsState
    dispatch: Dispatch<SettingsStoreAction>
  }
)

function reducer(state: SettingsState, action: SettingsStoreAction) {
  switch (action.type) {
    case 'setNavigationItems':
      return {
        ...state,
        navigationItems: action.payload,
      }
  }
}

export function useSettingsContext() {
  return useContext(SettingsContext)
}

export function useSettingsStore(): [
  SettingsState,
  Dispatch<SettingsStoreAction>
] {
  return useReducer(reducer, {
    navigationItems: [],
  })
}

export default function SettingsProvider({
  children,
}: {
  children: ReactNode
}) {
  const langState = useLangContext()
  const lang = langState!.lang
  const dict = langState!.dictionary
  const [state, dispatch] = useSettingsStore()
  const pathname = usePathname()
  const { state: authState } = useAuthContext()
  useEffect(() => {
    if (!authState.fetched) {
      return
    }
    // navigation items
    let navigationItems: Array<SettingsNavigationItem> = [
      {
        name: 'profile',
        title: dict.navigations.settings.profile.title,
        description: dict.navigations.settings.profile.description,
        href: `/${lang}/settings/profile`,
        current: false,
      },
      {
        name: 'security',
        title: dict.navigations.settings.security.title,
        description: dict.navigations.settings.security.description,
        href: `/${lang}/settings/security`,
        current: false,
      },
      {
        name: 'language',
        title: dict.navigations.settings.language.title,
        description: dict.navigations.settings.language.description,
        href: `/${lang}/settings/language`,
        current: false,
      },
    ]
    navigationItems = navigationItems.filter((item) => {
      switch (item.name) {
        case 'security':
        case 'language':
          return true
        case 'profile':
          return (
            authState.data !== null &&
            authState.data.scopes.find((scope) => scope.includes('profile'))
          )
      }
    })
    navigationItems = navigationItems.map((item) => {
      return {
        ...item,
        current: pathname !== null && pathname.startsWith(item.href),
      }
    })
    dispatch({
      type: 'setNavigationItems',
      payload: navigationItems,
    })
  }, [authState, pathname, dispatch, lang, dict])
  return (
    <SettingsContext.Provider value={{ state, dispatch }}>
      {children}
    </SettingsContext.Provider>
  )
}
