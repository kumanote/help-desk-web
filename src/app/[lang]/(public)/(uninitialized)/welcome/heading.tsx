'use client'

import { useLangContext } from '@/app/lang-provider'

import { Logo } from '@/components/logos/Logo'
import { TextContainer } from '@/components/texts/TextContainer'

export function WelcomeHeading() {
  const langState = useLangContext()
  const dict = langState!.dictionary
  return (
    <>
      <Logo className="mx-auto h-12 w-12 text-primary-500" />
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-color-base capitalize">
        {dict.welcome.title}
      </h2>
      <p className="mt-2 text-center text-sm text-color-description">
        <TextContainer text={dict.welcome.subtitle} />
      </p>
    </>
  )
}
