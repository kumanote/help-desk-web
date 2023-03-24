import { FaqItemDetail } from './form'

export default function FaqItemDetailPage({
  params: { id },
}: {
  params: { id: string }
}) {
  return <FaqItemDetail id={id} />
}
