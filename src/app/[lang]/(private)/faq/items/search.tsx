'use client'

import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import useSWR from 'swr'

import { useAuthContext } from '@/app/auth-provider'
import { useLangContext } from '@/app/lang-provider'

import { Button } from '@/components/buttons/Button'
import { EmptyState } from '@/components/empties/EmptyState'
import { SearchTextInput } from '@/components/forms/SearchTextInput'
import { CardFooterPagination } from '@/components/paginations/CardFooterPagination'
import { Skeleton } from '@/components/skeletons/Skeleton'

import { getFaqSettings, searchFaqItem } from '@/api/gateway/faq'
import { SearchedFaqItem } from '@/api/schema/faq_item'
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
  const { state: authState } = useAuthContext()
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
  const handlePageChange = (page: number) => {
    setSearchParams({ ...searchParams, page })
  }
  const { data: searchResult } = useSWR(
    ['/faq/items', searchParams],
    () => {
      const offset = (searchParams.page - 1) * PAGE_SIZE
      return searchFaqItem({
        lang,
        access_token: authState.data!.token,
        text: searchParams.text,
        limit: PAGE_SIZE,
        offset,
      }).then((response) => {
        if (response.ok) {
          return response.ok
        } else {
          throw Error('failed to search faq items...')
        }
      })
    },
    { refreshInterval: 0 }
  )
  const totalPage = searchResult
    ? Math.floor(searchResult.total / PAGE_SIZE) +
      (searchResult.total % PAGE_SIZE > 0 ? 1 : 0)
    : 0
  const handleRowClick = (item: SearchedFaqItem) => {
    router.push(`/${lang}/faq/items/${item.id}`)
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
      <div className="mt-8">
        {!searchResult ? (
          <Skeleton className="h-10" />
        ) : searchResult.total <= 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-8 flow-root">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden bg-color-base border-base sm:rounded-lg">
                  <table className="min-w-full divide-y divide-zinc-300 dark:divide-zinc-600">
                    <thead className="bg-zinc-50 dark:bg-zinc-800">
                      <tr>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-color-base"
                        >
                          {dictionary.types.faq_item.category}
                        </th>
                        {settings.supported_locales.map((locale) => {
                          return (
                            <th
                              key={locale.value}
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-color-base"
                            >
                              {dictionary.types.faq_item_content.title}(
                              {locale.text})
                            </th>
                          )
                        })}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                      {searchResult.list.map((item) => {
                        const displayCategories = item.categories.filter(
                          (c) =>
                            c.locale === settings.supported_locales[0].value
                        )
                        return (
                          <tr
                            key={item.id}
                            className="hover:bg-primary-50 dark:hover:bg-primary-800"
                            onClick={() => handleRowClick(item)}
                          >
                            <td className="px-3 py-4 text-sm text-color-description flex flex-wrap">
                              {displayCategories.length < 1
                                ? '-'
                                : displayCategories.map((category, i) => {
                                    return (
                                      <span
                                        key={i}
                                        className={clsx(
                                          'inline-block items-center rounded-full px-3 py-0.5 text-sm font-medium bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 truncate',
                                          i < item.categories.length - 1
                                            ? 'mr-1'
                                            : ''
                                        )}
                                      >
                                        {category.title}
                                      </span>
                                    )
                                  })}
                            </td>
                            {settings.supported_locales.map((locale) => {
                              const content = item.contents?.find(
                                (c) => c.locale === locale.value
                              )
                              return (
                                <td
                                  key={locale.value}
                                  className="whitespace-nowrap max-w-72 truncate px-3 py-4 text-sm text-color-description"
                                >
                                  {!!content ? content.title : '-'}
                                </td>
                              )
                            })}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  <CardFooterPagination
                    currentPage={searchParams.page}
                    totalPage={totalPage}
                    onChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
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
