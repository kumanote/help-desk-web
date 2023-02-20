import { getDictionary } from '@/app/[lang]/dictionaries'

export default async function Home({
  params: { lang },
}: {
  params: { lang: string }
}) {
  const dict = await getDictionary(lang)

  return <main>{dict.products.cart}</main>
}
