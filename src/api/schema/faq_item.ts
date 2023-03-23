import { FaqCategoryItem } from '@/api/schema/faq_category_item'
import { FaqItemContent } from '@/api/schema/faq_item_content'

export interface FaqItem {
  id: string
  slug: string
  is_published: boolean
  published_at: number | null
  last_updated_at: number | null
  contents?: Array<FaqItemContent>
  categories?: Array<FaqCategoryItem>
}

export interface SearchedFaqItem {
  id: string
  contents: Array<SearchedFaqItemContent>
  categories: Array<SearchedFaqItemCategory>
}

export interface SearchedFaqItemContent {
  locale: string
  title: string
  body: string
}

export interface SearchedFaqItemCategory {
  locale: string
  title: string
}
