'use client'

import { useLangContext } from '@/app/lang-provider'

import { LangSwitcher } from '@/components/forms/LangSwitcher'

export function Header() {
  const langState = useLangContext()
  const lang = langState!.lang
  return (
    <nav className="fixed top-0 w-full">
      <div className="container flex items-center justify-end py-2 sm:py-4">
        <LangSwitcher lang={lang} />
      </div>
    </nav>
  )
}
