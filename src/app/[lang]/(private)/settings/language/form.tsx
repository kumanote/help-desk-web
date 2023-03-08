'use client'

import { useLangContext } from '@/app/lang-provider'

import { LangSelect } from '@/components/forms/LangSelect'

export function LanguageSettingsForm() {
  const langState = useLangContext()
  const lang = langState!.lang
  const dictionary = langState!.dictionary
  return (
    <div>
      <div>
        <h1 className="text-xl font-medium text-color-base capitalize">
          {dictionary.navigations.settings.language.title}
        </h1>
        <p className="mt-1 text-sm text-color-dimmed">
          {dictionary.navigations.settings.language.description}
        </p>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
        <div>
          <LangSelect lang={lang} />
        </div>
      </div>
    </div>
  )
}
