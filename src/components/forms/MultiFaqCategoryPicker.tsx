'use client'

import { Dialog, Transition } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { Fragment, useRef, useState } from 'react'
import useSWR from 'swr'

import { Dictionary } from '@/dictionaries/interface'

import { useAuthContext } from '@/app/auth-provider'

import { Button } from '@/components/buttons/Button'
import { EmptyState } from '@/components/empties/EmptyState'
import { SearchTextInput } from '@/components/forms/SearchTextInput'
import { CardFooterPagination } from '@/components/paginations/CardFooterPagination'
import { Skeleton } from '@/components/skeletons/Skeleton'

import { Lang } from '@/lib/language'

import { searchFaqCategory } from '@/api/gateway/faq'
import { FaqCategory } from '@/api/schema/faq_category'
import { FaqContentLocale } from '@/api/schema/faq_content_locale'
import { FaqSettings } from '@/api/schema/faq_settings'

const PAGE_SIZE = 10

interface Props {
  value: Array<FaqCategory>
  onChange: (value: Array<FaqCategory>) => void
  label?: string
  wrapperClassName?: string
  displayLocale?: FaqContentLocale
  settings: FaqSettings
  lang: Lang
  dictionary: Dictionary
}

interface SearchParams {
  text: string
  ids: Array<string>
  page: number
}

function displayCategory(
  category: FaqCategory,
  displayLocale?: FaqContentLocale
): string {
  if (!category.contents || category.contents.length < 1) {
    return category.slug
  }
  if (!displayLocale) {
    return category.contents[0].title
  }
  const target = category.contents.find(
    (content) => content.locale.value === displayLocale.value
  )
  return target ? target.title : category.contents[0].title
}

export function MultiFaqCategoryPicker({
  value,
  onChange,
  label,
  wrapperClassName,
  displayLocale,
  settings,
  lang,
  dictionary,
}: Props) {
  const { state: authState } = useAuthContext()
  const cancelButtonRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchParams, setSearchParams] = useState<SearchParams>({
    text: searchText,
    ids: value.map((item) => item.id),
    page: 1,
  })
  const handleSearchTextBlur = () => {
    setSearchParams({ ...searchParams, text: searchText })
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
        text: searchParams.text,
        ids: searchParams.ids,
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
  const [selected, setSelected] = useState<Array<FaqCategory>>(value)
  const handleOnOk = () => {
    onChange(selected)
    setOpen(false)
  }
  return (
    <>
      <div className={wrapperClassName}>
        {label && (
          <span className="block text-sm font-medium text-color-label mb-1">
            {label}
          </span>
        )}
        <button
          type="button"
          className="bg-color-base text-color-base relative w-full border-base rounded-md pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          onClick={() => setOpen(!open)}
        >
          {selected.length < 1
            ? '-'
            : selected.map((category, i) => {
                return (
                  <span
                    key={category.id}
                    className={clsx(
                      'inline-block items-center rounded-full px-3 py-0.5 text-sm font-medium bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 truncate',
                      i < selected.length - 1 ? 'mr-1' : ''
                    )}
                  >
                    {displayCategory(category, displayLocale)}
                  </span>
                )
              })}
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronUpDownIcon
              className="h-5 w-5 text-color-dimmed"
              aria-hidden="true"
            />
          </span>
        </button>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-6">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden bg-color-sheet transform transition-all w-full sm:my-8 sm:p-6">
                  <div>
                    <Dialog.Title
                      as="h3"
                      className="text-sm leading-6 font-medium text-color-base mb-2"
                    >
                      {'FAQカテゴリ選択'}
                    </Dialog.Title>
                    <div>
                      <SearchTextInput
                        value={searchText}
                        onChange={(event) => setSearchText(event.target.value)}
                        onBlur={handleSearchTextBlur}
                        name="search"
                      />
                    </div>
                    <div className="mt-6">
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
                                        className="relative px-7 sm:w-12 sm:px-6"
                                      ></th>
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
                                      {settings.supported_locales.map(
                                        (locale) => {
                                          return (
                                            <th
                                              key={locale.value}
                                              scope="col"
                                              className="px-3 py-3.5 text-left text-sm font-semibold text-color-base"
                                            >
                                              {
                                                dictionary.types
                                                  .faq_category_content.title
                                              }
                                              ({locale.text})
                                            </th>
                                          )
                                        }
                                      )}
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                                    {searchResult.list.map((item) => {
                                      const isSelected = !!selected.find(
                                        (s) => s.id === item.id
                                      )
                                      const toggle = () => {
                                        setSelected(
                                          !isSelected
                                            ? [...selected, item]
                                            : selected.filter(
                                                (s) => s.id !== item.id
                                              )
                                        )
                                      }
                                      return (
                                        <tr
                                          key={item.id}
                                          className={clsx(
                                            isSelected
                                              ? 'bg-primary-50 dark:bg-primary-800'
                                              : ''
                                          )}
                                          onClick={toggle}
                                        >
                                          <td className="relative px-7 sm:w-12 sm:px-6">
                                            {isSelected && (
                                              <div className="absolute inset-y-0 left-0 w-0.5 bg-primary-500" />
                                            )}
                                            <input
                                              type="checkbox"
                                              className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                                              value={item.id}
                                              checked={isSelected}
                                              onChange={toggle}
                                            />
                                          </td>
                                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-color-base sm:pl-6">
                                            # {item.display_order}
                                          </td>
                                          <td className="whitespace-nowrap px-3 py-4 text-sm text-color-description">
                                            {item.slug}
                                          </td>
                                          {settings.supported_locales.map(
                                            (locale) => {
                                              const content =
                                                item.contents?.find(
                                                  (c) =>
                                                    c.locale.value ===
                                                    locale.value
                                                )
                                              return (
                                                <td
                                                  key={locale.value}
                                                  className="whitespace-nowrap max-w-72 truncate px-3 py-4 text-sm text-color-description"
                                                >
                                                  {!!content
                                                    ? content.title
                                                    : '-'}
                                                </td>
                                              )
                                            }
                                          )}
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
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <Button
                      type="button"
                      intent="primary"
                      className="normal w-full sm:ml-3 sm:w-auto"
                      onClick={handleOnOk}
                    >
                      {dictionary.select}
                    </Button>
                    <Button
                      type="button"
                      intent="normal"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      {dictionary.cancel}
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
