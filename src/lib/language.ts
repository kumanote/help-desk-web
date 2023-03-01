import { match } from '@formatjs/intl-localematcher'
import Negotiator, { Headers } from 'negotiator'
import type { NextRequest } from 'next/server'

export type Lang = 'en' | 'ja' | 'vi'
export const defaultLanguage = 'en'
export const languages: Array<Lang> = ['en', 'ja', 'vi']

export const languageCookieName = 'i18n'

/**
 * parse http request header and detect language
 * @param request http request that may contain `Accept-Language` header
 */
export function getLanguage(request: NextRequest) {
  if (request.cookies.has(languageCookieName)) {
    const cookieValue = request.cookies.get(languageCookieName)!.value
    return match([cookieValue], languages, defaultLanguage)
  }
  const headers: Headers = {}
  request.headers.forEach((value, key) => {
    headers[key] = value
  })
  const requestedLanguages = new Negotiator({ headers }).languages()
  return match(requestedLanguages, languages, defaultLanguage)
}
