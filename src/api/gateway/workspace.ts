import { API_BASE_URL } from '@/lib/constants'

import { Workspace } from '@/api/schema/workspace'

export async function getWorkspace(): Promise<Workspace | null> {
  const res = await fetch(`${API_BASE_URL}/workspace`)
  if (!res.ok) {
    throw new Error('Failed to fetch workspace')
  }
  return res.json()
}
