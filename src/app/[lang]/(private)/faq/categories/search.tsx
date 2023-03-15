'use client'

import {
  DndContext,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { DragEndEvent } from '@dnd-kit/core/dist/types'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import useSWR from 'swr'

import { useAuthContext } from '@/app/auth-provider'
import { useLangContext } from '@/app/lang-provider'
import { showNotification } from '@/app/notification-provider'

import { Button } from '@/components/buttons/Button'
import { EmptyState } from '@/components/empties/EmptyState'
import { SearchTextInput } from '@/components/forms/SearchTextInput'
import { CardFooterPagination } from '@/components/paginations/CardFooterPagination'
import { Skeleton } from '@/components/skeletons/Skeleton'

import {
  getFaqSettings,
  reorderFaqCategory,
  searchFaqCategory,
} from '@/api/gateway/faq'
import { FaqCategory } from '@/api/schema/faq_category'
import { FaqSettings } from '@/api/schema/faq_settings'

const PAGE_SIZE = 20

interface SearchForm {
  text: string
}

interface SearchParams {
  text: string
  page: number
}

interface SortableItemProps {
  item: FaqCategory
  settings: FaqSettings
  onClick: (item: FaqCategory) => void
}

function SortableItem({ item, settings, onClick }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id, resizeObserverConfig: {} })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="hover:bg-primary-50 dark:hover:bg-primary-800"
      onClick={() => onClick(item)}
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
  )
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
  const [submitting, setSubmitting] = useState(false)
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
  const { data: searchResult, mutate: mutateSearchResult } = useSWR(
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
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )
  const handleRowClick = (item: FaqCategory) => {
    router.push(`/${lang}/faq/categories/${item.id}`)
  }
  const handleDragEnd = async (event: DragEndEvent) => {
    if (!searchResult) return false
    const { active, over } = event
    if (!over || active.id === over.id) {
      return false
    }
    if (submitting) return false
    setSubmitting(true)
    try {
      const oldIndex = searchResult.list.findIndex(
        (value) => value.id === active.id
      )
      const newIndex = searchResult.list.findIndex(
        (value) => value.id === over.id
      )
      const objective = searchResult.list[oldIndex]
      const target = searchResult.list[newIndex]
      const accessToken = authState.data!.token
      const response = await reorderFaqCategory({
        lang,
        access_token: accessToken,
        id: String(active.id),
        target_id: String(over.id),
        append: objective.display_order < target.display_order,
      })
      if (response.ok) {
        showNotification({
          type: 'success',
          message: dictionary.faq.reorder_category_succeeded,
          autoClose: 5000,
        })
        await mutateSearchResult({
          ...searchResult,
          list: arrayMove(searchResult.list, oldIndex, newIndex),
        })
      } else {
        // handle error
        const message = response.err?.error?.reasons.map((reason, index) => {
          return (
            <>
              {index > 0 && <br />}
              <span>{reason}</span>
            </>
          )
        })
        if (message) {
          showNotification({
            type: 'error',
            message,
            autoClose: false,
          })
        }
      }
    } catch {
      showNotification({
        type: 'error',
        message: dictionary.validations.network,
        autoClose: false,
      })
    } finally {
      setSubmitting(false)
    }
  }
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
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={searchResult.list}
                          strategy={verticalListSortingStrategy}
                        >
                          {searchResult.list.map((item) => (
                            <SortableItem
                              key={item.id}
                              item={item}
                              settings={settings}
                              onClick={handleRowClick}
                            />
                          ))}
                        </SortableContext>
                      </DndContext>
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
