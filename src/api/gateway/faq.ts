import { API_BASE_URL } from '@/lib/constants'
import { Lang } from '@/lib/language'

import { ErrorResponse } from '@/api/schema/error'
import { FaqCategory } from '@/api/schema/faq_category'
import {
  CreateFaqCategoryContent,
  UpdateFaqCategoryContent,
} from '@/api/schema/faq_category_content'
import { FaqItem, SearchedFaqItem } from '@/api/schema/faq_item'
import { CreateFaqItemContent } from '@/api/schema/faq_item_content'
import { FaqSettings } from '@/api/schema/faq_settings'
import { PagingResult } from '@/api/schema/paging_result'
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

export async function updateFaqCategory({
  lang,
  access_token,
  id,
  slug,
  contents,
}: {
  lang: Lang
  access_token: string
  id: string
  slug: string
  contents: Array<UpdateFaqCategoryContent>
}): Promise<ResponseResult<FaqCategory, ErrorResponse>> {
  const data = {
    slug,
    contents,
  }
  const response = await fetch(`${API_BASE_URL}/faq/categories/${id}`, {
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
      ok: (await response.json()) as FaqCategory,
    }
  } else {
    return {
      err: (await response.json()) as ErrorResponse,
    }
  }
}

export async function searchFaqCategory({
  lang,
  access_token,
  text,
  limit,
  offset,
}: {
  lang: Lang
  access_token: string
  text?: string
  limit: number
  offset: number
}): Promise<ResponseResult<PagingResult<FaqCategory>, ErrorResponse>> {
  const params: {
    text?: string
    limit: string
    offset: string
  } = {
    limit: String(limit),
    offset: String(offset),
  }
  if (text) {
    params.text = text
  }
  const query = new URLSearchParams(params)
  const response = await fetch(`${API_BASE_URL}/faq/categories/?${query}`, {
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
      ok: (await response.json()) as PagingResult<FaqCategory>,
    }
  } else {
    return {
      err: (await response.json()) as ErrorResponse,
    }
  }
}

export async function getFaqCategory({
  lang,
  access_token,
  id,
}: {
  lang: Lang
  access_token: string
  id: string
}): Promise<ResponseResult<FaqCategory, ErrorResponse>> {
  const response = await fetch(`${API_BASE_URL}/faq/categories/${id}`, {
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
      ok: (await response.json()) as FaqCategory,
    }
  } else {
    return {
      err: (await response.json()) as ErrorResponse,
    }
  }
}

export async function deleteFaqCategory({
  lang,
  access_token,
  id,
}: {
  lang: Lang
  access_token: string
  id: string
}): Promise<ResponseResult<string, ErrorResponse>> {
  const response = await fetch(`${API_BASE_URL}/faq/categories/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
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

export async function reorderFaqCategory({
  lang,
  access_token,
  id,
  target_id,
  append,
}: {
  lang: Lang
  access_token: string
  id: string
  target_id: string
  append: boolean
}): Promise<ResponseResult<string, ErrorResponse>> {
  const data = {
    id,
    target_id,
    append,
  }
  const response = await fetch(`${API_BASE_URL}/faq/categories/reorder`, {
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
      ok: await response.text(),
    }
  } else {
    return {
      err: (await response.json()) as ErrorResponse,
    }
  }
}

export async function createFaqItem({
  lang,
  access_token,
  slug,
  is_published,
  contents,
  categories,
}: {
  lang: Lang
  access_token: string
  slug: string
  is_published: boolean
  contents: Array<CreateFaqItemContent>
  categories: Array<string>
}): Promise<ResponseResult<FaqItem, ErrorResponse>> {
  const data = {
    slug,
    is_published,
    contents,
    categories,
  }
  const response = await fetch(`${API_BASE_URL}/faq/items/`, {
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
      ok: (await response.json()) as FaqItem,
    }
  } else {
    return {
      err: (await response.json()) as ErrorResponse,
    }
  }
}

export async function searchFaqItem({
  lang,
  access_token,
  text,
  limit,
  offset,
}: {
  lang: Lang
  access_token: string
  text?: string
  limit: number
  offset: number
}): Promise<ResponseResult<PagingResult<SearchedFaqItem>, ErrorResponse>> {
  const params: {
    text?: string
    limit: string
    offset: string
  } = {
    limit: String(limit),
    offset: String(offset),
  }
  if (text) {
    params.text = text
  }
  const query = new URLSearchParams(params)
  const response = await fetch(`${API_BASE_URL}/faq/items/?${query}`, {
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
      ok: (await response.json()) as PagingResult<SearchedFaqItem>,
    }
  } else {
    return {
      err: (await response.json()) as ErrorResponse,
    }
  }
}

export async function getFaqItem({
  lang,
  access_token,
  id,
}: {
  lang: Lang
  access_token: string
  id: string
}): Promise<ResponseResult<FaqItem, ErrorResponse>> {
  const response = await fetch(`${API_BASE_URL}/faq/items/${id}`, {
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
      ok: (await response.json()) as FaqItem,
    }
  } else {
    return {
      err: (await response.json()) as ErrorResponse,
    }
  }
}

export async function deleteFaqItem({
  lang,
  access_token,
  id,
}: {
  lang: Lang
  access_token: string
  id: string
}): Promise<ResponseResult<string, ErrorResponse>> {
  const response = await fetch(`${API_BASE_URL}/faq/items/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
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
