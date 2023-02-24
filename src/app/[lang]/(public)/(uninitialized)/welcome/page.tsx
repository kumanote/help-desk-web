import { getDictionary } from '@/app/[lang]/dictionaries'

import { Logo } from '@/components/logos/Logo'
import { TextContainer } from '@/components/texts/TextContainer'

import { WelcomeForm } from './form'

export default async function WelcomePage({
  params: { lang },
}: {
  params: { lang: string }
}) {
  const dict = await getDictionary(lang)
  return (
    <main className="min-h-screen flex-grow flex flex-col justify-center">
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Logo className="mx-auto h-12 w-12 text-primary-500" />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight title-text-color">
            {dict.welcome.title}
          </h2>
          <p className="mt-2 text-center text-sm text-color">
            <TextContainer text={dict.welcome.subtitle} />
          </p>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="sheet-bg-color py-8 px-4 sm:rounded-lg sm:px-10">
            <WelcomeForm dict={dict} />
          </div>
        </div>
      </div>
    </main>
  )
}
