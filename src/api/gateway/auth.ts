import { API_BASE_URL } from '@/lib/constants'
import { Lang } from '@/lib/language'

import { AccessToken } from '@/api/schema/access_token'
import { ErrorResponse } from '@/api/schema/error'
import { ResponseResult } from '@/api/schema/result'

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
