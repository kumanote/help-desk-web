import { API_BASE_URL } from '@/lib/constants'
import { Lang } from '@/lib/language'

import { ErrorResponse } from '@/api/schema/error'
import {
  InquiryLineSettings,
  InquiryNotificationSettings,
  InquirySettings,
} from '@/api/schema/inquiry_settings'
import { ResponseResult } from '@/api/schema/result'

export async function getInquirySettings({
  lang,
  access_token,
}: {
  lang: Lang
  access_token: string
}): Promise<ResponseResult<InquirySettings | null, ErrorResponse>> {
  const response = await fetch(`${API_BASE_URL}/inquiry/settings`, {
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
      ok: (await response.json()) as InquirySettings | null,
    }
  } else {
    return {
      err: (await response.json()) as ErrorResponse,
    }
  }
}

export async function createOrUpdateInquirySettings({
  lang,
  access_token,
  line,
  notification,
}: {
  lang: Lang
  access_token: string
  line: InquiryLineSettings
  notification: InquiryNotificationSettings
}): Promise<ResponseResult<InquirySettings, ErrorResponse>> {
  const data = {
    line,
    notification,
  }
  const response = await fetch(`${API_BASE_URL}/inquiry/settings`, {
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
      ok: (await response.json()) as InquirySettings,
    }
  } else {
    return {
      err: (await response.json()) as ErrorResponse,
    }
  }
}
