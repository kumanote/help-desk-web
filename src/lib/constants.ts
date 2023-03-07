import * as process from 'process'

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Open Help Desk'
export const APP_DESK =
  process.env.NEXT_PUBLIC_APP_DESC || 'Help Desk powered by kumanote LLC.'
export const AUTHOR = process.env.NEXT_PUBLIC_AUTHOR || 'kumanote LLC.'
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
export const COOKIES = {
  auth: {
    token: {
      name: 'help-desk.auth.token',
      options: {
        maxAge: 14 * 24 * 60 * 60,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
}

export const GLOBAL_EVENT_NAMES = {
  notifications: {
    show: 'notifications:show',
    clean: 'notifications:clean',
    cleanQueue: 'notifications:cleanQueue',
  },
}
