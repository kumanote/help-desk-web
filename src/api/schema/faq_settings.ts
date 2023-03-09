import { FaqContentLocale } from '@/api/schema/faq_content_locale'

export interface FaqSettings {
  home_url: string | null
  supported_locales: Array<FaqContentLocale>
}
