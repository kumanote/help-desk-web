'use client'

import { getCookie, setCookie } from 'cookies-next'
import type { Dispatch, ReactNode } from 'react'
import { createContext, useContext, useEffect, useReducer } from 'react'

import { COOKIES } from '@/lib/constants'
import { Lang } from '@/lib/language'

import { getAuthorizedScopes } from '@/api/gateway/auth'
import { Scope } from '@/api/schema/scope'

export type AuthState = {
  data: Array<Scope> | null
  fetched: boolean
}

export type AuthStoreAction = {
  type: 'set'
  payload: Array<Scope> | null
}

const AuthContext = createContext(
  {} as {
    state: AuthState
    dispatch: Dispatch<AuthStoreAction>
  }
)

function reducer(state: AuthState, action: AuthStoreAction) {
  switch (action.type) {
    case 'set':
      return {
        data: action.payload,
        fetched: true,
      }
  }
}

export function useAuthContext() {
  return useContext(AuthContext)
}

export function useAuthStore(): [AuthState, Dispatch<AuthStoreAction>] {
  return useReducer(reducer, {
    data: null,
    fetched: false,
  })
}

export function setAuthTokenCookie({ accessToken }: { accessToken: string }) {
  setCookie(COOKIES.auth.token.name, accessToken, COOKIES.auth.token.options)
}

export default function AuthProvider({
  children,
  lang,
}: {
  children: ReactNode
  lang: Lang
}) {
  const [state, dispatch] = useAuthStore()
  const accessToken = getCookie(COOKIES.auth.token.name)
  useEffect(() => {
    if (accessToken) {
      getAuthorizedScopes({ lang, access_token: String(accessToken) }).then(
        (response) => {
          if (response.ok || response.ok === null) {
            dispatch({ type: 'set', payload: response.ok })
          } else {
            throw new Error('failed to fetch authorized scope data')
          }
        }
      )
    } else {
      dispatch({ type: 'set', payload: null })
    }
  }, [accessToken, dispatch, lang])
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
