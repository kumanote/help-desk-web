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

import { createFaqItem, getFaqSettings } from '@/api/gateway/faq'
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
  categories: Array<string>
  isPublished: boolean
  contents: Map<string, ContentFormData>
}

function CreateFaqItemForm({ settings }: { settings: FaqSettings }) {
  const router = useRouter()
  const langState = useLangContext()
  const lang = langState!.lang
  const dictionary = langState!.dictionary
  const { state: authState } = useAuthContext()
  const [currentLocale, setCurrentLocale] = useState<LocaleOption>(
    new LocaleOption(
      settings.supported_locales[0]!.value,
      settings.supported_locales[0]!.text
    )
  )
  const [submitting, setSubmitting] = useState(false)
  const localeOptions = settings.supported_locales.map((locale) => {
    return new LocaleOption(locale.value, locale.text)
  })
  const initContents = () => {
    const result = new Map<string, ContentFormData>()
    settings.supported_locales.forEach((locale) => {
      result.set(locale.value, {
        title: '',
      })
    })
    return result
  }
  const form = useForm<FormData>({
    initialValues: {
      slug: '',
      categories: [],
      isPublished: false,
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
      result.set(locale.value, createEmptyValue())
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
      const response = await createFaqItem({
        lang,
        access_token: accessToken,
        slug: values.slug,
        is_published: values.isPublished,
        contents,
        categories: values.categories,
      })
      if (response.ok) {
        showNotification({
          type: 'success',
          message: dictionary.faq.create_item_succeeded,
          autoClose: 5000,
        })
        router.push(`/${lang}/faq/items`)
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
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-medium text-color-base capitalize">
          {dictionary.navigations.faq_features.item.new.title}
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
      <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
        <TextInput
          name="slug"
          id="slug"
          label={dictionary.types.faq_item.slug}
          help={dictionary.types.faq_item.slug_help}
          placeholder="how-to-sign-in"
          {...form.getInputProps('slug')}
          wrapperClassName="sm:col-span-2"
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
          wrapperClassName="sm:col-span-2"
        />
        <div className="sm:col-span-2">
          {/* contents locale tab area */}
          <Select
            options={localeOptions}
            value={currentLocale!}
            label={dictionary.types.faq_category_content.locale}
            onChange={setCurrentLocale}
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
                    onClick={() => setCurrentLocale(locale)}
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
                  name="body"
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
      </div>
    </form>
  )
}

export function CreateFaqItem() {
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
  if (settings.supported_locales.length === 0) {
    return <NoAvailableLocaleWarnings />
  }
  return <CreateFaqItemForm settings={settings} />
}
