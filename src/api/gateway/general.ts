import { API_BASE_URL } from '@/lib/constants'
import { Lang } from '@/lib/language'

import { ErrorResponse } from '@/api/schema/error'
import { FaqContentLocale } from '@/api/schema/faq_content_locale'
import { ResponseResult } from '@/api/schema/result'

export async function getFaqContentLocales({
  lang,
  access_token,
}: {
  lang: Lang
  access_token: string
}): Promise<ResponseResult<Array<FaqContentLocale> | null, ErrorResponse>> {
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
      ok: (await response.json()) as Array<FaqContentLocale>,
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
