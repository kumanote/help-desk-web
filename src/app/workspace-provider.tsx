'use client'

import type { Dispatch, ReactNode } from 'react'
import { createContext, useContext, useEffect, useReducer } from 'react'

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

function reducer(state: WorkspaceState | null, action: WorkspaceStoreAction) {
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

export default function WorkspaceProvider({
  children,
  workspace,
}: {
  children: ReactNode
  workspace: Workspace | null
}) {
  const [state, dispatch] = useWorkspaceStore()
  useEffect(() => {
    dispatch({ type: 'set', payload: workspace })
  }, [dispatch, workspace])
  return (
    <WorkspaceContext.Provider value={state}>
      {children}
    </WorkspaceContext.Provider>
  )
}
