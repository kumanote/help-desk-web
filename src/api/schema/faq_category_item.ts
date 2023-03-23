import { FaqCategory } from '@/api/schema/faq_category'

export interface FaqCategoryItem {
  faq_category_id: string
  faq_item_id: string
  display_order: number
  category?: FaqCategory
}
