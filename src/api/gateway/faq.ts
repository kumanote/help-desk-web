import { API_BASE_URL } from '@/lib/constants'
import { Lang } from '@/lib/language'

import { ErrorResponse } from '@/api/schema/error'
import { FaqCategory } from '@/api/schema/faq_category'
import { CreateFaqCategoryContent } from '@/api/schema/faq_category_content'
import { FaqSettings } from '@/api/schema/faq_settings'
import { ResponseResult } from '@/api/schema/result'

export async function getFaqSettings({
  lang,
  access_token,
}: {
  lang: Lang
  access_token: string
}): Promise<ResponseResult<FaqSettings, ErrorResponse>> {
  const response = await fetch(`${API_BASE_URL}/faq/settings`, {
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
      ok: (await response.json()) as FaqSettings,
    }
  } else {
    return {
      err: (await response.json()) as ErrorResponse,
    }
  }
}

export async function updateFaqSettings({
  lang,
  access_token,
  home_url,
  supported_locales,
}: {
  lang: Lang
  access_token: string
  home_url: string | null
  supported_locales: Array<string>
}): Promise<ResponseResult<FaqSettings, ErrorResponse>> {
  const data = {
    home_url,
    supported_locales,
  }
  const response = await fetch(`${API_BASE_URL}/faq/settings`, {
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
      ok: (await response.json()) as FaqSettings,
    }
  } else {
    return {
      err: (await response.json()) as ErrorResponse,
    }
  }
}

export async function createFaqCategory({
  lang,
  access_token,
  slug,
  contents,
}: {
  lang: Lang
  access_token: string
  slug: string
  contents: Array<CreateFaqCategoryContent>
}): Promise<ResponseResult<FaqCategory, ErrorResponse>> {
  const data = {
    slug,
    contents,
  }
  const response = await fetch(`${API_BASE_URL}/faq/categories/`, {
    method: 'POST',
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
      ok: (await response.json()) as FaqCategory,
    }
  } else {
    return {
      err: (await response.json()) as ErrorResponse,
    }
  }
}
