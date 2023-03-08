'use client'

import { useLangContext } from '@/app/lang-provider'

import { Logo } from '@/components/logos/Logo'

export function LoginHeading() {
  const langState = useLangContext()
  const dict = langState!.dictionary
  return (
    <>
      <Logo className="mx-auto h-12 w-12 text-primary-500" />
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-color-base capitalize">
        {dict.login}
      </h2>
    </>
  )
}
