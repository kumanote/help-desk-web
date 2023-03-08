'use client'

import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import type { Dispatch, ReactNode } from 'react'
import { createContext, useContext, useEffect, useReducer } from 'react'

import { useLangContext } from '@/app/lang-provider'

import { COOKIES } from '@/lib/constants'

import { getAuthorizedScopes } from '@/api/gateway/auth'
import { Scope } from '@/api/schema/scope'

interface AuthStateData {
  scopes: Array<Scope>
  token: string
}

export type AuthState = {
  data: AuthStateData | null
  fetched: boolean
}

export type AuthStoreAction =
  | {
      type: 'set'
      payload: AuthStateData | null
    }
  | {
      type: 'clear'
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
    case 'clear':
      // clear data, keep fetched flag true
      return {
        data: null,
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

export function deleteAuthTokenCookie() {
  deleteCookie(COOKIES.auth.token.name)
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const langState = useLangContext()
  const lang = langState!.lang
  const [state, dispatch] = useAuthStore()
  const accessToken = getCookie(COOKIES.auth.token.name)
  useEffect(() => {
    if (accessToken) {
      const token = String(accessToken)
      getAuthorizedScopes({ lang, access_token: token }).then((response) => {
        if (response.ok) {
          dispatch({
            type: 'set',
            payload: {
              scopes: response.ok,
              token,
            },
          })
        } else if (response.ok === null) {
          dispatch({ type: 'clear' })
        } else {
          throw new Error('failed to fetch authorized scope data')
        }
      })
    } else {
      dispatch({ type: 'clear' })
    }
  }, [accessToken, dispatch, lang])
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
