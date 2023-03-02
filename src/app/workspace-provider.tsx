'use client'

import type { Dispatch, ReactNode } from 'react'
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'

import { Lang } from '@/lib/language'

import { getWorkspace } from '@/api/gateway/workspace'
import { Workspace } from '@/api/schema/workspace'

export type WorkspaceState = Workspace | null

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
      return action.payload
  }
}

export function useWorkspaceContext() {
  return useContext(WorkspaceContext)
}

export function useWorkspaceStore(): [
  WorkspaceState,
  Dispatch<WorkspaceStoreAction>
] {
  return useReducer(reducer, null)
}

function Skeleton() {
  return (
    <div className="fixed inset-0 bg-zinc-900 bg-opacity-25 z-50 dark:bg-opacity-75"></div>
  )
}

export default function WorkspaceProvider({
  children,
  lang,
}: {
  children: ReactNode
  lang: Lang
}) {
  const [fetched, setFetched] = useState(false)
  const [state, dispatch] = useWorkspaceStore()
  useEffect(() => {
    getWorkspace({ lang }).then((response) => {
      if (response.ok || response.ok === null) {
        dispatch({ type: 'set', payload: response.ok })
        setFetched(true)
      } else if (response.err) {
        throw new Error('failed to fetch workspace data')
      }
    })
  }, [dispatch, lang])
  if (!fetched) return <Skeleton />
  return (
    <WorkspaceContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkspaceContext.Provider>
  )
}
