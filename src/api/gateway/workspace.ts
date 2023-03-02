import { API_BASE_URL } from '@/lib/constants'
import { Lang } from '@/lib/language'

import { ErrorResponse } from '@/api/schema/error'
import { ResponseResult } from '@/api/schema/result'
import { Workspace } from '@/api/schema/workspace'

export async function getWorkspace({
  lang,
}: {
  lang: Lang
}): Promise<ResponseResult<Workspace | null, ErrorResponse>> {
  const response = await fetch(`${API_BASE_URL}/workspace`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Accept-Language': lang,
      'Content-Type': 'application/json',
    },
  })
  if (response.ok) {
    return {
      ok: (await response.json()) as Workspace | null,
    }
  } else {
    return {
      err: (await response.json()) as ErrorResponse,
    }
  }
}

export async function initWorkspace({
  lang,
  workspace_name,
  first_agent_email,
  first_agent_password,
  first_agent_name,
}: {
  lang: Lang
  workspace_name: string
  first_agent_email: string
  first_agent_password: string
  first_agent_name: string
}): Promise<ResponseResult<Workspace, ErrorResponse>> {
  const data = {
    workspace_name,
    first_agent_email,
    first_agent_password,
    first_agent_name,
  }
  const response = await fetch(`${API_BASE_URL}/workspace`, {
    method: 'POST',
    headers: {
      'Accept-Language': lang,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (response.ok) {
    return {
      ok: (await response.json()) as Workspace,
    }
  } else {
    return {
      err: (await response.json()) as ErrorResponse,
    }
  }
}
