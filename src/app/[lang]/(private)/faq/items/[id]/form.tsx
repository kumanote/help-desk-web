'use client'

import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

import { NoAvailableLocaleWarnings } from '@/app/[lang]/(private)/faq/no-available-locale-warnings'
import { useAuthContext } from '@/app/auth-provider'
import { useLangContext } from '@/app/lang-provider'
import { showNotification } from '@/app/notification-provider'

import { AlertErrors } from '@/components/alerts/AlertErrors'
import { Button } from '@/components/buttons/Button'
import { AlertDialog } from '@/components/dialogs/AlertDialog'
import { MultiFaqCategoryPicker } from '@/components/forms/MultiFaqCategoryPicker'
import { Select, SelectOption } from '@/components/forms/Select'
import { TextInput } from '@/components/forms/TextInput'
import { Toggle } from '@/components/forms/Toggle'
import {
  RichTextEditor,
  RichTextEditorValue,
  createEmptyValue,
  getJsonString,
} from '@/components/forms/editors/RichTextEditor'
import { Skeleton } from '@/components/skeletons/Skeleton'

import { useForm } from '@/hooks/form'

import { validateFaqItemTitle, validateSlug } from '@/lib/validator'

import {
  deleteFaqItem,
  getFaqItem,
  getFaqSettings,
  updateFaqItem,
} from '@/api/gateway/faq'
import { FaqCategory } from '@/api/schema/faq_category'
import { FaqCategoryItem } from '@/api/schema/faq_category_item'
import { FaqContentLocale } from '@/api/schema/faq_content_locale'
import { FaqItem } from '@/api/schema/faq_item'
import { CreateFaqItemContent } from '@/api/schema/faq_item_content'
import { FaqSettings } from '@/api/schema/faq_settings'

class LocaleOption implements SelectOption {
  value: string
  text: string
  constructor(value: string, text: string) {
    this.value = value
    this.text = text
  }
  getId(): string | number {
    return this.value
  }
  getLabel(): string {
    return this.text
  }
}

interface ContentFormData {
  title: string
}

interface FormData {
  slug: string
  categories: Array<FaqCategory>
  isPublished: boolean
  contents: Map<string, ContentFormData>
}

function FaqItemDetailEditor({
  settings,
  item,
  currentLocale,
  onContentLocaleChange,
  onSave,
  onCancel,
}: {
  settings: FaqSettings
  item: FaqItem
  currentLocale: LocaleOption
  onContentLocaleChange: (locale: LocaleOption) => void
  onSave: (item: FaqItem) => void
  onCancel: () => void
}) {
  const langState = useLangContext()
  const lang = langState!.lang
  const dictionary = langState!.dictionary
  const { state: authState } = useAuthContext()
  const [submitting, setSubmitting] = useState(false)
  const localeOptions = settings.supported_locales.map((locale) => {
    return new LocaleOption(locale.value, locale.text)
  })
  const initContents = () => {
    const result = new Map<string, ContentFormData>()
    settings.supported_locales.forEach((locale) => {
      const target = item.contents?.find((c) => c.locale.value === locale.value)
      if (target) {
        result.set(locale.value, {
          title: target.title,
        })
      } else {
        result.set(locale.value, {
          title: '',
        })
      }
    })
    return result
  }
  const form = useForm<FormData>({
    initialValues: {
      slug: item.slug,
      categories: item.categories?.map((item) => item.category!) || [],
      isPublished: item.is_published,
      contents: initContents(),
    },
    validate: {
      slug: (value) =>
        validateSlug({ value, required: true, dict: dictionary }),
      contents: {
        title: (value) =>
          validateFaqItemTitle({
            value,
            required: true,
            dict: dictionary,
          }),
      },
    },
    validateInputOnChange: false,
    validateInputOnBlur: true,
  })
  const initBodies = () => {
    const result = new Map<string, RichTextEditorValue>()
    settings.supported_locales.forEach((locale) => {
      const target = item.contents?.find((c) => c.locale.value === locale.value)
      if (target) {
        result.set(locale.value, target.body || createEmptyValue())
      } else {
        result.set(locale.value, createEmptyValue())
      }
    })
    return result
  }
  const [bodies, setBodies] = useState<Map<string, RichTextEditorValue>>(
    initBodies()
  )
  const [contentErrors, setContentErrors] = useState<Array<string>>([])
  useEffect(() => {
    const newErrors: Array<string> = []
    settings.supported_locales.forEach((locale) => {
      for (let key in form.errors) {
        if (key.startsWith(`contents.${locale.value}`) && !!form.errors[key]) {
          newErrors.push(
            `[${locale.text}] ${dictionary.validations.contains_error}`
          )
          break
        }
      }
    })
    setContentErrors(newErrors)
  }, [form.errors])

  const handleSubmit = async (values: FormData) => {
    if (submitting) return false
    setSubmitting(true)
    try {
      const accessToken = authState.data!.token
      const contents: Array<CreateFaqItemContent> = []
      settings.supported_locales.forEach((locale) => {
        const content = form.values.contents.get(locale.value)!
        let body = bodies.get(locale.value)!
        contents.push({
          locale: locale.value,
          title: content.title,
          body: getJsonString(body),
        })
      })
      const response = await updateFaqItem({
        lang,
        access_token: accessToken,
        id: item.id,
        slug: values.slug,
        is_published: values.isPublished,
        contents,
        categories: values.categories.map((item) => item.id),
      })
      if (response.ok) {
        showNotification({
          type: 'success',
          message: dictionary.faq.create_item_succeeded,
          autoClose: 5000,
        })
        onSave(response.ok)
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
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
        <TextInput
          name="slug"
          id="slug"
          label={dictionary.types.faq_item.slug}
          help={dictionary.types.faq_item.slug_help}
          placeholder="how-to-sign-in"
          {...form.getInputProps('slug')}
        />
        <MultiFaqCategoryPicker
          value={form.values.categories}
          onChange={(categories) =>
            form.setFieldValue('categories', categories)
          }
          label={dictionary.types.faq_item.category}
          displayLocale={settings.supported_locales[0]}
          settings={settings}
          lang={lang}
          dictionary={dictionary}
        />
        <div className="sm:col-span-2">
          {/* contents locale tab area */}
          <Select
            options={localeOptions}
            value={currentLocale!}
            label={dictionary.types.faq_category_content.locale}
            onChange={onContentLocaleChange}
            wrapperClassName="sm:hidden"
          />
          <div className="hidden sm:block">
            <nav className="flex space-x-2 w-full overflow-x-auto border-b border-zinc-200 dark:border-zinc-700">
              {localeOptions.map((locale) => {
                const current = currentLocale?.value === locale.value
                return (
                  <a
                    key={locale.value}
                    className={clsx(
                      current
                        ? 'border-b border-primary-500 text-primary-700'
                        : 'border-transparent text-gray-500 hover:text-primary-700',
                      'border-b-2 px-3 py-2 text-xs font-medium'
                    )}
                    onClick={() => onContentLocaleChange(locale)}
                  >
                    {locale.text}
                  </a>
                )
              })}
            </nav>
          </div>
          {/* contents detail area */}
          {localeOptions.map((locale) => {
            const current = currentLocale?.value === locale.value
            const body = bodies.get(locale.value)!
            const setBody = (value: RichTextEditorValue) => {
              bodies.set(locale.value, value)
              setBodies(bodies)
            }
            return (
              <div
                key={locale.value}
                className={clsx(
                  current ? 'block' : 'hidden',
                  'py-4 sm:px-2 space-y-3'
                )}
              >
                <TextInput
                  name={`title_${locale.value}`}
                  id={`title_${locale.value}`}
                  label={`${dictionary.types.faq_category_content.title} (${locale.text})`}
                  {...form.getInputProps(`contents.${locale.value}.title`)}
                />
                <RichTextEditor
                  name={`body-${locale.value}`}
                  value={body}
                  onChange={setBody}
                  label={`${dictionary.types.faq_item_content.body} (${locale.text})`}
                  wrapperClassName="sm:col-span-2"
                />
              </div>
            )
          })}
        </div>
      </div>
      {contentErrors.length > 0 && (
        <div className="px-2">
          <AlertErrors errors={contentErrors} />
        </div>
      )}
      <div className="mt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
        <Toggle
          {...form.getInputProps('isPublished')}
          wrapperClassName="sm:col-span-2"
        >
          <span className="font-medium text-color-base">
            {dictionary.publish}
          </span>
        </Toggle>
      </div>
      <div className="flex items-center gap-x-3 mt-4">
        <Button
          type="submit"
          intent="primary"
          loading={submitting}
          className="uppercase"
        >
          {dictionary.save}
        </Button>
        <Button
          type="button"
          intent="normal"
          className="uppercase"
          onClick={onCancel}
        >
          {dictionary.cancel}
        </Button>
      </div>
    </form>
  )
}

function FaqItemDeleteDialog({
  open,
  item,
  onDelete,
  onCancel,
}: {
  open: boolean
  item: FaqItem
  onDelete: () => void
  onCancel: () => void
}) {
  const langState = useLangContext()
  const lang = langState!.lang
  const dictionary = langState!.dictionary
  const { state: authState } = useAuthContext()
  const [submitting, setSubmitting] = useState(false)
  const handleDelete = async () => {
    if (submitting) return false
    setSubmitting(true)
    try {
      const accessToken = authState.data!.token
      const response = await deleteFaqItem({
        lang,
        access_token: accessToken,
        id: item.id,
      })
      if (response.ok) {
        showNotification({
          type: 'success',
          message: dictionary.faq.delete_item.succeeded,
          autoClose: 5000,
        })
        onDelete()
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
  return (
    <AlertDialog
      open={open}
      title={dictionary.faq.delete_item.confirm_title}
      okButtonText={dictionary.remove}
      cancelButtonText={dictionary.cancel}
      onOk={handleDelete}
      onCancel={onCancel}
    >
      <p className="text-sm text-color-description">
        {dictionary.faq.delete_item.confirm_description}
      </p>
    </AlertDialog>
  )
}

function displayCategory(
  category_item: FaqCategoryItem,
  displayLocale?: FaqContentLocale
): string {
  const category = category_item.category
  if (!category) return '-'
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

function FaqItemDetailViewer({
  settings,
  item,
  currentLocale,
  onContentLocaleChange,
  onEditBtnClick,
}: {
  settings: FaqSettings
  item: FaqItem
  currentLocale: LocaleOption
  onContentLocaleChange: (locale: LocaleOption) => void
  onEditBtnClick: () => void
}) {
  const router = useRouter()
  const langState = useLangContext()
  const lang = langState!.lang
  const dictionary = langState!.dictionary
  const localeOptions = settings.supported_locales.map((locale) => {
    return new LocaleOption(locale.value, locale.text)
  })
  const [deleteDialog, setDeleteDialog] = useState(false)
  return (
    <>
      <div>
        <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
          <div>
            <div className="text-sm font-medium text-color-label">
              {dictionary.types.faq_item.slug}
            </div>
            <div className="mt-1 text-base font-medium text-color-base">
              {item.slug}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-color-label">
              {dictionary.types.faq_item.category}
            </div>
            <div className="mt-1 text-base font-medium text-color-base">
              {!item.categories || item.categories.length < 1
                ? '-'
                : item.categories.map((category_item, i) => {
                    return (
                      <span
                        key={category_item.faq_category_id}
                        className={clsx(
                          'inline-block items-center rounded-full px-3 py-0.5 text-sm font-medium bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 truncate',
                          i < item.categories!.length - 1 ? 'mr-1' : ''
                        )}
                      >
                        {displayCategory(
                          category_item,
                          settings.supported_locales[0]
                        )}
                      </span>
                    )
                  })}
            </div>
          </div>
          <div className="sm:col-span-2">
            {/* contents locale tab area */}
            <Select
              options={localeOptions}
              value={currentLocale!}
              label={dictionary.types.faq_item_content.locale}
              onChange={onContentLocaleChange}
              wrapperClassName="sm:hidden"
            />
            <div className="hidden sm:block">
              <nav className="flex space-x-2 w-full overflow-x-auto border-b border-zinc-200 dark:border-zinc-700">
                {localeOptions.map((locale) => {
                  const current = currentLocale?.value === locale.value
                  return (
                    <a
                      key={locale.value}
                      className={clsx(
                        current
                          ? 'border-b border-primary-500 text-primary-700'
                          : 'border-transparent text-gray-500 hover:text-primary-700',
                        'border-b-2 px-3 py-2 text-xs font-medium'
                      )}
                      onClick={() => onContentLocaleChange(locale)}
                    >
                      {locale.text}
                    </a>
                  )
                })}
              </nav>
            </div>
            {/* contents detail area */}
            {localeOptions.map((locale) => {
              const current = currentLocale?.value === locale.value
              const content = item.contents?.find(
                (c) => c.locale.value === locale.value
              )
              return (
                <div
                  key={locale.value}
                  className={clsx(
                    current ? 'block' : 'hidden',
                    'py-4 sm:px-2 space-y-3'
                  )}
                >
                  <div>
                    <div className="text-sm font-medium text-color-label">
                      {`${dictionary.types.faq_item_content.title} (${locale.text})`}
                    </div>
                    <div className="mt-1 text-base font-medium text-color-base">
                      {content?.title || '-'}
                    </div>
                  </div>
                  <RichTextEditor
                    name={`body-${locale.value}`}
                    value={content?.body || createEmptyValue()}
                    readonly={true}
                    label={`${dictionary.types.faq_item_content.body} (${locale.text})`}
                    wrapperClassName="sm:col-span-2"
                  />
                </div>
              )
            })}
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
          <div>
            <div className="text-sm font-medium text-color-label">
              {dictionary.types.faq_item.publish_status}
            </div>
            <div className="mt-1 text-base font-medium text-color-base">
              {item.is_published ? dictionary.public : dictionary.draft}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-x-3 mt-4">
          <Button
            type="button"
            intent="danger"
            className="uppercase"
            onClick={() => setDeleteDialog(true)}
          >
            {dictionary.remove}
          </Button>
          <Button
            type="button"
            intent="normal"
            className="uppercase"
            onClick={onEditBtnClick}
          >
            {dictionary.edit}
          </Button>
        </div>
      </div>
      <FaqItemDeleteDialog
        open={deleteDialog}
        item={item}
        onDelete={() => {
          router.push(`/${lang}/faq/items`)
        }}
        onCancel={() => setDeleteDialog(false)}
      />
    </>
  )
}

function FaqItemDetailForm({
  settings,
  item,
  onSave,
}: {
  settings: FaqSettings
  item: FaqItem
  onSave: (item: FaqItem) => void
}) {
  const [editing, setEditing] = useState(false)
  const [currentLocale, setCurrentLocale] = useState<LocaleOption>(
    new LocaleOption(
      settings.supported_locales[0]!.value,
      settings.supported_locales[0]!.text
    )
  )
  if (editing) {
    return (
      <FaqItemDetailEditor
        settings={settings}
        item={item}
        currentLocale={currentLocale}
        onContentLocaleChange={setCurrentLocale}
        onSave={(item) => {
          setEditing(false)
          onSave(item)
        }}
        onCancel={() => setEditing(false)}
      />
    )
  } else {
    return (
      <FaqItemDetailViewer
        settings={settings}
        item={item}
        currentLocale={currentLocale}
        onContentLocaleChange={setCurrentLocale}
        onEditBtnClick={() => setEditing(true)}
      />
    )
  }
}

export function FaqItemDetail({ id }: { id: string }) {
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
  const { data: item, mutate: mutateItem } = useSWR(
    `/faq/items/${id}`,
    () => {
      return getFaqItem({
        lang,
        access_token: authState.data!.token,
        id,
      }).then((response) => {
        if (response.ok) {
          return response.ok
        } else {
          throw Error('failed to fetch faq item data...')
        }
      })
    },
    { refreshInterval: 0 }
  )
  if (!settings || !item) {
    return <Skeleton className="h-10" />
  }
  if (settings.supported_locales.length === 0) {
    return <NoAvailableLocaleWarnings />
  }
  return (
    <div>
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-medium text-color-base capitalize">
          {dictionary.navigations.faq_features.item.detail.title}
        </h1>
        <div className="ml-3">
          <Button
            type="button"
            intent="normal"
            className="uppercase"
            onClick={() => router.push(`/${lang}/faq/items`)}
          >
            {dictionary.back}
          </Button>
        </div>
      </header>
      <FaqItemDetailForm settings={settings} item={item} onSave={mutateItem} />
    </div>
  )
}
