'use client'

import type { Dispatch, ReactNode } from 'react'
import { createContext, useContext, useEffect, useReducer } from 'react'

import { Lang } from '@/lib/language'

interface LangStateData {
  lang: Lang
  dictionary: any
}

export type LangState = LangStateData | null

export type LangStoreAction = {
  type: 'set'
  payload: LangStateData | null
}

const LangContext = createContext<LangState>(null)

function reducer(state: LangState, action: LangStoreAction) {
  switch (action.type) {
    case 'set':
      return action.payload
  }
}

export function useLangContext() {
  return useContext(LangContext)
}

function useLangStore(): [LangState, Dispatch<LangStoreAction>] {
  return useReducer(reducer, null)
}

export default function LangProvider({
  children,
  lang,
  dictionary,
}: {
  children: ReactNode
  lang: Lang
  dictionary: any
}) {
  const [state, dispatch] = useLangStore()
  useEffect(() => {
    dispatch({
      type: 'set',
      payload: {
        lang,
        dictionary,
      },
    })
  }, [dispatch, lang, dictionary])
  if (state === null) {
    return <></>
  }
  return <LangContext.Provider value={state}>{children}</LangContext.Provider>
}
