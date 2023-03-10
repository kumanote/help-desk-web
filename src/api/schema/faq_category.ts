import { FaqCategoryContent } from '@/api/schema/faq_category_content'

export interface FaqCategory {
  id: string
  slug: string
  display_order: number
  contents?: Array<FaqCategoryContent>
}
