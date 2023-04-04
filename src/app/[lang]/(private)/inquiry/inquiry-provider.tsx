'use client'

import { usePathname } from 'next/navigation'
import type { Dispatch, ReactNode } from 'react'
import { createContext, useContext, useEffect, useReducer } from 'react'

import { useAuthContext } from '@/app/auth-provider'
import { useLangContext } from '@/app/lang-provider'

export type InquiryNavigationItemType = 'thread' | 'contact' | 'admin'

export interface InquiryNavigationItem {
  name: InquiryNavigationItemType
  title: string
  description: string
  href: string
  current: boolean
}

export type InquiryState = {
  navigationItems: Array<InquiryNavigationItem>
}

export type InquiryStoreAction = {
  type: 'setNavigationItems'
  payload: Array<InquiryNavigationItem>
}

const InquiryContext = createContext(
  {} as {
    state: InquiryState
    dispatch: Dispatch<InquiryStoreAction>
  }
)

function reducer(state: InquiryState, action: InquiryStoreAction) {
  switch (action.type) {
    case 'setNavigationItems':
      return {
        ...state,
        navigationItems: action.payload,
      }
  }
}

export function useInquiryContext() {
  return useContext(InquiryContext)
}

export function useInquiryStore(): [
  InquiryState,
  Dispatch<InquiryStoreAction>
] {
  return useReducer(reducer, {
    navigationItems: [],
  })
}

export default function InquiryProvider({ children }: { children: ReactNode }) {
  const langState = useLangContext()
  const lang = langState!.lang
  const dict = langState!.dictionary
  const [state, dispatch] = useInquiryStore()
  const pathname = usePathname()
  const { state: authState } = useAuthContext()
  useEffect(() => {
    if (!authState.fetched) {
      return
    }
    // navigation items
    let navigationItems: Array<InquiryNavigationItem> = [
      {
        name: 'thread',
        title: dict.navigations.inquiry_features.thread.title,
        description: dict.navigations.inquiry_features.thread.description,
        href: `/${lang}/inquiry/threads`,
        current: false,
      },
      {
        name: 'contact',
        title: dict.navigations.inquiry_features.contact.title,
        description: dict.navigations.inquiry_features.contact.description,
        href: `/${lang}/inquiry/contacts`,
        current: false,
      },
      {
        name: 'admin',
        title: dict.navigations.inquiry_features.admin.title,
        description: dict.navigations.inquiry_features.admin.description,
        href: `/${lang}/inquiry/admin`,
        current: false,
      },
    ]
    navigationItems = navigationItems.filter((item) => {
      switch (item.name) {
        case 'thread':
        case 'contact':
          return (
            authState.data !== null &&
            authState.data.scopes.find((scope) =>
              ['read:inquiry', 'write:inquiry', 'admin:inquiry'].includes(scope)
            )
          )
        case 'admin':
          return (
            authState.data !== null &&
            authState.data.scopes.find((scope) =>
              scope.includes('admin:inquiry')
            )
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
    <InquiryContext.Provider value={{ state, dispatch }}>
      {children}
    </InquiryContext.Provider>
  )
}
