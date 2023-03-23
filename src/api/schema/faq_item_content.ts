import { FaqContentLocale } from '@/api/schema/faq_content_locale'

export interface FaqItemContent {
  faq_item_id: string
  locale: FaqContentLocale
  title: string
  body: string
}

export interface CreateFaqItemContent {
  locale: string
  title: string
  body: string
}

export interface UpdateFaqItemContent {
  locale: string
  title: string
  body: string
}
