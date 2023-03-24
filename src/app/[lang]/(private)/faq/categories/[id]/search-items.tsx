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
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import useSWR from 'swr'

import { useAuthContext } from '@/app/auth-provider'
import { useLangContext } from '@/app/lang-provider'
import { showNotification } from '@/app/notification-provider'

import { EmptyState } from '@/components/empties/EmptyState'
import { CardFooterPagination } from '@/components/paginations/CardFooterPagination'
import { Skeleton } from '@/components/skeletons/Skeleton'

import {
  reorderFaqItemByCategory,
  searchFaqItemByCategory,
} from '@/api/gateway/faq'
import { FaqCategory } from '@/api/schema/faq_category'
import { FaqCategoryItem } from '@/api/schema/faq_category_item'
import { FaqSettings } from '@/api/schema/faq_settings'

const PAGE_SIZE = 20

interface Props {
  category: FaqCategory
  settings: FaqSettings
}

interface SearchParams {
  page: number
}

interface SortableItemProps {
  item: FaqCategoryItem
  settings: FaqSettings
  onClick: (item: FaqCategoryItem) => void
}

function SortableItem({ item, settings, onClick }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.faq_item_id, resizeObserverConfig: {} })
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
        {item.item?.slug}
      </td>
      {settings.supported_locales.map((locale) => {
        const content = item.item?.contents?.find(
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

export function FaqItemsByCategorySearch({ category, settings }: Props) {
  const router = useRouter()
  const langState = useLangContext()
  const lang = langState!.lang
  const dictionary = langState!.dictionary
  const { state: authState } = useAuthContext()
  const [submitting, setSubmitting] = useState(false)
  const [searchParams, setSearchParams] = useState<SearchParams>({
    page: 1,
  })
  const handlePageChange = (page: number) => {
    setSearchParams({ ...searchParams, page })
  }
  const { data: searchResult, mutate: mutateSearchResult } = useSWR(
    [`/faq/categories/${category.id}/items/`, searchParams],
    () => {
      const offset = (searchParams.page - 1) * PAGE_SIZE
      return searchFaqItemByCategory({
        lang,
        access_token: authState.data!.token,
        faq_category_id: category.id,
        limit: PAGE_SIZE,
        offset,
      }).then((response) => {
        if (response.ok) {
          return response.ok
        } else {
          throw Error('failed to search faq items by category...')
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
  const handleRowClick = (item: FaqCategoryItem) => {
    router.push(`/${lang}/faq/items/${item.faq_item_id}`)
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
        (value) => value.faq_item_id === active.id
      )
      const newIndex = searchResult.list.findIndex(
        (value) => value.faq_item_id === over.id
      )
      const objective = searchResult.list[oldIndex]
      const target = searchResult.list[newIndex]
      const accessToken = authState.data!.token
      const response = await reorderFaqItemByCategory({
        lang,
        access_token: accessToken,
        faq_category_id: category.id,
        faq_item_id: String(active.id),
        target_faq_item_id: String(over.id),
        append: objective.display_order < target.display_order,
      })
      if (response.ok) {
        showNotification({
          type: 'success',
          message: dictionary.faq.reorder_item_succeeded,
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
  if (!searchResult) {
    return <Skeleton className="h-10" />
  }
  return (
    <div className="mt-12">
      <h2 className="text-lg font-medium text-color-base capitalize">
        {dictionary.navigations.faq_features.category.detail.search_items}
      </h2>
      {searchResult.total > 0 && (
        <div className="mt-2 flow-root">
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
                        {dictionary.types.faq_item.slug}
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
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={searchResult.list.map((item) => {
                          return {
                            id: item.faq_item_id,
                            ...item,
                          }
                        })}
                        strategy={verticalListSortingStrategy}
                      >
                        {searchResult.list.map((item) => (
                          <SortableItem
                            key={item.faq_item_id}
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
  )
}
