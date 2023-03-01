import { LangSwitcher } from '@/components/forms/LangSwitcher'

import { Lang } from '@/lib/language'

interface Props {
  lang: Lang
}

export function Header({ lang }: Props) {
  return (
    <nav className="fixed top-0 w-full">
      <div className="container flex items-center justify-end py-2 sm:py-4">
        <LangSwitcher lang={lang} />
      </div>
    </nav>
  )
}
