import * as process from 'process'

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Open Help Desk'
export const APP_DESK =
  process.env.NEXT_PUBLIC_APP_DESC || 'Help Desk powered by kumanote LLC.'
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
