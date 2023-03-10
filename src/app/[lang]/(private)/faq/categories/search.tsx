'use client'

import { useRouter } from 'next/navigation'

import { useAuthContext } from '@/app/auth-provider'
import { useLangContext } from '@/app/lang-provider'

import { Button } from '@/components/buttons/Button'
import { EmptyState } from '@/components/empties/EmptyState'
import { SearchTextInput } from '@/components/forms/SearchTextInput'

import { useForm } from '@/hooks/form'

interface SearchForm {
  text: string
}

export function FaqCategorySearch() {
  const router = useRouter()
  const langState = useLangContext()
  const lang = langState!.lang
  const dictionary = langState!.dictionary
  const { state: authState } = useAuthContext()
  const searchForm = useForm<SearchForm>({
    initialValues: {
      text: '',
    },
    validateInputOnChange: false,
    validateInputOnBlur: false,
  })
  return (
    <div className="h-full flex flex-col">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-xl font-medium text-color-base capitalize">
          {dictionary.navigations.faq_features.category.search.title}
        </h1>
        <div className="mt-5 flex sm:mt-0 sm:ml-4">
          <div className="flex-1 flex justify-between">
            <div className="flex-1 flex">
              <SearchTextInput
                name="search"
                {...searchForm.getInputProps('text')}
                wrapperClassName="w-full lg:ml-0"
              />
            </div>
            <div className="ml-3">
              <Button
                type="button"
                intent="primary"
                className="uppercase"
                onClick={() => router.push(`/${lang}/faq/categories/new`)}
              >
                {dictionary.add}
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div className="mt-8">
        <EmptyState />
      </div>
    </div>
  )
}
