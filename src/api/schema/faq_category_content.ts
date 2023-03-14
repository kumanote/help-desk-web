import { FaqContentLocale } from '@/api/schema/faq_content_locale'

export interface FaqCategoryContent {
  faq_category_id: string
  locale: FaqContentLocale
  title: string
}

export interface CreateFaqCategoryContent {
  locale: string
  title: string
}

export interface UpdateFaqCategoryContent {
  locale: string
  title: string
}
