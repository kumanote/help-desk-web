'use client'

import type { Dispatch, ReactNode } from 'react'
import { createContext, useContext, useEffect, useReducer } from 'react'

import { Lang } from '@/lib/language'

import { getWorkspace } from '@/api/gateway/workspace'
import { Workspace } from '@/api/schema/workspace'

export type WorkspaceState = {
  data: Workspace | null
  fetched: boolean
}

export type WorkspaceStoreAction = {
  type: 'set'
  payload: Workspace | null
}

const WorkspaceContext = createContext(
  {} as {
    state: WorkspaceState
    dispatch: Dispatch<WorkspaceStoreAction>
  }
)

function reducer(state: WorkspaceState, action: WorkspaceStoreAction) {
  switch (action.type) {
    case 'set':
      return {
        data: action.payload,
        fetched: true,
      }
  }
}

export function useWorkspaceContext() {
  return useContext(WorkspaceContext)
}

export function useWorkspaceStore(): [
  WorkspaceState,
  Dispatch<WorkspaceStoreAction>
] {
  return useReducer(reducer, {
    data: null,
    fetched: false,
  })
}

export default function WorkspaceProvider({
  children,
  lang,
}: {
  children: ReactNode
  lang: Lang
}) {
  const [state, dispatch] = useWorkspaceStore()
  useEffect(() => {
    getWorkspace({ lang }).then((response) => {
      if (response.ok || response.ok === null) {
        dispatch({ type: 'set', payload: response.ok })
      } else if (response.err) {
        throw new Error('failed to fetch workspace data')
      }
    })
  }, [dispatch, lang])
  return (
    <WorkspaceContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkspaceContext.Provider>
  )
}
