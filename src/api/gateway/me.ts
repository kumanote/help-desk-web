import { API_BASE_URL } from '@/lib/constants'
import { Lang } from '@/lib/language'

import { Agent } from '@/api/schema/agent'
import { ErrorResponse } from '@/api/schema/error'
import { ResponseResult } from '@/api/schema/result'

export async function getProfile({
  lang,
  access_token,
}: {
  lang: Lang
  access_token: string
}): Promise<ResponseResult<Agent, ErrorResponse>> {
  const response = await fetch(`${API_BASE_URL}/agents/me`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Accept-Language': lang,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
  })
  if (response.ok) {
    return {
      ok: (await response.json()) as Agent,
    }
  } else {
    return {
      err: (await response.json()) as ErrorResponse,
    }
  }
}

export async function updateProfile({
  lang,
  access_token,
  email,
  name,
}: {
  lang: Lang
  access_token: string
  email: string
  name: string
}): Promise<ResponseResult<Agent, ErrorResponse>> {
  const data = {
    email,
    name,
  }
  const response = await fetch(`${API_BASE_URL}/agents/me`, {
    method: 'PUT',
    cache: 'no-store',
    headers: {
      'Accept-Language': lang,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify(data),
  })
  if (response.ok) {
    return {
      ok: (await response.json()) as Agent,
    }
  } else {
    return {
      err: (await response.json()) as ErrorResponse,
    }
  }
}

export async function changePassword({
  lang,
  access_token,
  current_password,
  new_password,
}: {
  lang: Lang
  access_token: string
  current_password: string
  new_password: string
}): Promise<ResponseResult<string, ErrorResponse>> {
  const data = {
    current_password,
    new_password,
  }
  const response = await fetch(`${API_BASE_URL}/agents/me/password`, {
    method: 'PUT',
    cache: 'no-store',
    headers: {
      'Accept-Language': lang,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify(data),
  })
  if (response.ok) {
    return {
      ok: await response.text(),
    }
  } else {
    return {
      err: (await response.json()) as ErrorResponse,
    }
  }
}
