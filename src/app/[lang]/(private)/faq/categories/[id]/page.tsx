import { FaqCategoryDetail } from './form'

export default function FaqCategoryDetailPage({
  params: { id },
}: {
  params: { id: string }
}) {
  return <FaqCategoryDetail id={id} />
}
