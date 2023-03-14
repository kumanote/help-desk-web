'use client'

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

import { getFaqSettings, searchFaqCategory } from '@/api/gateway/faq'

const PAGE_SIZE = 20

interface SearchForm {
  text: string
}

interface SearchParams {
  text: string
  page: number
}

export function FaqCategorySearch() {
  const router = useRouter()
  const langState = useLangContext()
  const lang = langState!.lang
  const dictionary = langState!.dictionary
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
    ['/faq/categories', searchParams],
    () => {
      const offset = (searchParams.page - 1) * PAGE_SIZE
      return searchFaqCategory({
        lang,
        access_token: authState.data!.token,
        text: searchForm.text,
        limit: PAGE_SIZE,
        offset,
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
  const totalPage = searchResult
    ? Math.floor(searchResult.total / PAGE_SIZE) +
      (searchResult.total % PAGE_SIZE > 0 ? 1 : 0)
    : 0
  if (!settings || !searchResult) {
    return <Skeleton className="h-10" />
  }
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
                onClick={() => router.push(`/${lang}/faq/categories/new`)}
              >
                {dictionary.add}
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div className="mt-8">
        {searchResult.total > 0 && (
          <div className="mt-8 flow-root">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden bg-color-base border-base sm:rounded-lg">
                  <table className="min-w-full divide-y divide-zinc-300 dark:divide-zinc-600">
                    <thead className="bg-zinc-50 dark:bg-zinc-800">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-color-base sm:pl-6"
                        >
                          No
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-color-base"
                        >
                          {dictionary.types.faq_category.slug}
                        </th>
                        {settings.supported_locales.map((locale) => {
                          return (
                            <th
                              key={locale.value}
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-color-base"
                            >
                              {dictionary.types.faq_category_content.title}(
                              {locale.text})
                            </th>
                          )
                        })}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                      {searchResult.list.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-primary-50 dark:hover:bg-primary-800"
                          onClick={() =>
                            router.push(`/${lang}/faq/categories/${item.id}`)
                          }
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-color-base sm:pl-6">
                            # {item.display_order}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-color-description">
                            {item.slug}
                          </td>
                          {settings.supported_locales.map((locale) => {
                            const content = item.contents?.find(
                              (c) => c.locale.value === locale.value
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
                      ))}
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
        {searchResult.total === 0 && <EmptyState />}
      </div>
    </div>
  )
}
