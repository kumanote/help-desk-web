'use client'

import { usePathname } from 'next/navigation'
import type { Dispatch, ReactNode } from 'react'
import { createContext, useContext, useEffect, useReducer } from 'react'

import { useAuthContext } from '@/app/auth-provider'
import { useLangContext } from '@/app/lang-provider'

export type FaqNavigationItemType = 'item' | 'category' | 'admin'

export interface FaqNavigationItem {
  name: FaqNavigationItemType
  title: string
  description: string
  href: string
  current: boolean
}

export type FaqState = {
  navigationItems: Array<FaqNavigationItem>
}

export type FaqStoreAction = {
  type: 'setNavigationItems'
  payload: Array<FaqNavigationItem>
}

const FaqContext = createContext(
  {} as {
    state: FaqState
    dispatch: Dispatch<FaqStoreAction>
  }
)

function reducer(state: FaqState, action: FaqStoreAction) {
  switch (action.type) {
    case 'setNavigationItems':
      return {
        ...state,
        navigationItems: action.payload,
      }
  }
}

export function useFaqContext() {
  return useContext(FaqContext)
}

export function useFaqStore(): [FaqState, Dispatch<FaqStoreAction>] {
  return useReducer(reducer, {
    navigationItems: [],
  })
}

export default function FaqProvider({ children }: { children: ReactNode }) {
  const langState = useLangContext()
  const lang = langState!.lang
  const dict = langState!.dictionary
  const [state, dispatch] = useFaqStore()
  const pathname = usePathname()
  const { state: authState } = useAuthContext()
  useEffect(() => {
    if (!authState.fetched) {
      return
    }
    // navigation items
    let navigationItems: Array<FaqNavigationItem> = [
      {
        name: 'item',
        title: dict.navigations.faq_features.item.title,
        description: dict.navigations.faq_features.item.description,
        href: `/${lang}/faq/items`,
        current: false,
      },
      {
        name: 'category',
        title: dict.navigations.faq_features.category.title,
        description: dict.navigations.faq_features.category.description,
        href: `/${lang}/faq/categories`,
        current: false,
      },
      {
        name: 'admin',
        title: dict.navigations.faq_features.admin.title,
        description: dict.navigations.faq_features.admin.description,
        href: `/${lang}/faq/admin`,
        current: false,
      },
    ]
    navigationItems = navigationItems.filter((item) => {
      switch (item.name) {
        case 'item':
        case 'category':
          return (
            authState.data !== null &&
            authState.data.scopes.find((scope) =>
              ['read:faq', 'write:faq', 'admin:faq'].includes(scope)
            )
          )
        case 'admin':
          return (
            authState.data !== null &&
            authState.data.scopes.find((scope) => scope.includes('admin:faq'))
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
    <FaqContext.Provider value={{ state, dispatch }}>
      {children}
    </FaqContext.Provider>
  )
}
