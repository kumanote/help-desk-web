'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import useSWR from 'swr'

import { useAuthContext } from '@/app/auth-provider'
import { useLangContext } from '@/app/lang-provider'

import { Button } from '@/components/buttons/Button'
import { SearchTextInput } from '@/components/forms/SearchTextInput'
import { Skeleton } from '@/components/skeletons/Skeleton'

import { getFaqSettings } from '@/api/gateway/faq'
import { FaqSettings } from '@/api/schema/faq_settings'

const PAGE_SIZE = 20

interface SearchForm {
  text: string
}

interface SearchParams {
  text: string
  page: number
}

function FaqItemsSearchForm({ settings }: { settings: FaqSettings }) {
  const router = useRouter()
  const langState = useLangContext()
  const lang = langState!.lang
  const dictionary = langState!.dictionary
  const [searchForm, setSearchForm] = useState<SearchForm>({
    text: '',
  })
  const [searchParams, setSearchParams] = useState<SearchParams>({
    text: searchForm.text,
    page: 1,
  })
  const handleSearchTextChange = (event: any) => {
    setSearchForm({ ...searchForm, text: event.target.value })
  }
  const handleSearchTextBlur = () => {
    setSearchParams({ ...searchParams, text: searchForm.text })
  }
  return (
    <>
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-xl font-medium text-color-base capitalize">
          {dictionary.navigations.faq_features.item.search.title}
        </h1>
        <div className="mt-5 flex sm:mt-0 sm:ml-4">
          <div className="flex-1 flex justify-between">
            <div className="flex-1 flex">
              <SearchTextInput
                value={searchForm.text}
                onChange={handleSearchTextChange}
                onBlur={handleSearchTextBlur}
                name="search"
                wrapperClassName="w-full lg:ml-0"
              />
            </div>
            <div className="ml-3">
              <Button
                type="button"
                intent="primary"
                className="uppercase"
                onClick={() => router.push(`/${lang}/faq/items/new`)}
              >
                {dictionary.add}
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export function FaqItemsSearch() {
  const langState = useLangContext()
  const lang = langState!.lang
  const { state: authState } = useAuthContext()
  const { data: settings } = useSWR(
    '/faq/settings',
    () => {
      return getFaqSettings({
        lang,
        access_token: authState.data!.token,
      }).then((response) => {
        if (response.ok) {
          return response.ok
        } else {
          throw Error('failed to fetch faq settings...')
        }
      })
    },
    { refreshInterval: 0 }
  )
  if (!settings) {
    return <Skeleton className="h-10" />
  }
  return (
    <div className="h-full flex flex-col">
      <FaqItemsSearchForm settings={settings} />
    </div>
  )
}
