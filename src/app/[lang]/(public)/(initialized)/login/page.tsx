import { getDictionary } from '@/app/[lang]/dictionaries'

import { Logo } from '@/components/logos/Logo'

import { Lang } from '@/lib/language'

import { LoginForm } from './form'

export default async function LoginPage({
  params: { lang },
}: {
  params: { lang: Lang }
}) {
  const dict = await getDictionary(lang)
  return (
    <main className="flex-grow flex flex-col justify-center">
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Logo className="mx-auto h-12 w-12 text-primary-500" />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-color-base capitalize">
            {dict.login}
          </h2>
        </div>
        <div className="mt-8 px-2 sm:w-full sm:mx-auto sm:max-w-md">
          <div className="bg-color-sheet py-8 px-4 rounded-lg sm:px-10">
            <LoginForm lang={lang} dict={dict} />
          </div>
        </div>
      </div>
    </main>
  )
}
