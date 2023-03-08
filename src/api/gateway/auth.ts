import { API_BASE_URL } from '@/lib/constants'
import { Lang } from '@/lib/language'

import { AccessToken } from '@/api/schema/access_token'
import { ErrorResponse } from '@/api/schema/error'
import { ResponseResult } from '@/api/schema/result'
import { Scope } from '@/api/schema/scope'

export async function login({
  lang,
  username,
  password,
}: {
  lang: Lang
  username: string
  password: string
}): Promise<ResponseResult<AccessToken, ErrorResponse>> {
  const data = {
    username,
    password,
  }
  const response = await fetch(`${API_BASE_URL}/auth`, {
    method: 'POST',
    headers: {
      'Accept-Language': lang,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (response.ok) {
    return {
      ok: (await response.json()) as AccessToken,
    }
  } else {
    return {
      err: (await response.json()) as ErrorResponse,
    }
  }
}

export async function logout({
  lang,
  access_token,
}: {
  lang: Lang
  access_token: string
}): Promise<ResponseResult<string, ErrorResponse>> {
  const response = await fetch(`${API_BASE_URL}/auth`, {
    method: 'DELETE',
    headers: {
      'Accept-Language': lang,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
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

export async function getAuthorizedScopes({
  lang,
  access_token,
}: {
  lang: Lang
  access_token: string
}): Promise<ResponseResult<Array<Scope> | null, ErrorResponse>> {
  const response = await fetch(`${API_BASE_URL}/auth/scopes/`, {
    method: 'GET',
    headers: {
      'Accept-Language': lang,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
  })
  if (response.ok) {
    return {
      ok: (await response.json()) as Array<Scope>,
    }
  } else {
    if (response.status === 401) {
      return {
        ok: null,
      }
    }
    return {
      err: (await response.json()) as ErrorResponse,
    }
  }
}
