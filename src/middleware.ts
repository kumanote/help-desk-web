import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { getLanguage, languageCookieName, languages } from '@/lib/language'

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname
  const pathnameIsMissingLocale = languages.every(
    (lang) => !pathname.startsWith(`/${lang}/`) && pathname !== `/${lang}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const lang = getLanguage(request)

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(new URL(`/${lang}/${pathname}`, request.url))
  }

  const response = NextResponse.next()
  // Save locale cookie if the referer includes locale in the pathname
  if (request.headers.has('referer')) {
    const refererUrl = new URL(request.headers.get('referer')!)
    const localeInReferer = languages.find((lang) =>
      refererUrl.pathname.startsWith(`/${lang}`)
    )
    if (localeInReferer)
      response.cookies.set(languageCookieName, localeInReferer)
  }
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
