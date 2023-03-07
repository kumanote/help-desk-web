import { getDictionary } from '@/app/[lang]/dictionaries'

import { Lang } from '@/lib/language'

export default async function DashboardPage({
  params: { lang },
}: {
  params: { lang: Lang }
}) {
  const dict = await getDictionary(lang)
  return <div>dashboard</div>
}
