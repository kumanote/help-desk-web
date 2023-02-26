'use client'

import { usePathname, useRouter } from 'next/navigation'
import type { Dispatch, ReactNode } from 'react'
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'

import { getWorkspace } from '@/api/gateway/workspace'
import { Workspace } from '@/api/schema/workspace'

const WorkspaceContext = createContext<Workspace | null>(null)

export function useWorkspaceContext() {
  return useContext(WorkspaceContext)
}

export type WorkspaceState = Workspace | null

export type WorkspaceStoreAction = {
  type: 'set'
  payload: Workspace | null
}

function reducer(state: WorkspaceState, action: WorkspaceStoreAction) {
  switch (action.type) {
    case 'set':
      return action.payload
  }
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
  lang: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [fetched, setFetched] = useState(false)
  const [state, dispatch] = useWorkspaceStore()
  useEffect(() => {
    getWorkspace({ lang })
      .then((res) => res.json())
      .then((data) => {
        const welcomePagePath = `/${lang}/welcome`
        if (data == null) {
          if (pathname !== welcomePagePath) {
            router.replace(welcomePagePath)
          }
        } else {
          if (pathname === welcomePagePath) {
            router.replace('/login')
          }
        }
        dispatch({ type: 'set', payload: data })
        setFetched(true)
      })
  }, [dispatch, lang, pathname, router])
  if (!fetched) {
    return <Skeleton />
  }
  return (
    <WorkspaceContext.Provider value={state}>
      {children}
    </WorkspaceContext.Provider>
  )
}
