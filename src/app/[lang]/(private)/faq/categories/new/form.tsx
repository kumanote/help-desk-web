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
import { Select, SelectOption } from '@/components/forms/Select'
import { TextInput } from '@/components/forms/TextInput'
import { Skeleton } from '@/components/skeletons/Skeleton'

import { useForm } from '@/hooks/form'

import { validateFaqCategoryTitle, validateSlug } from '@/lib/validator'

import { createFaqCategory, getFaqSettings } from '@/api/gateway/faq'
import { CreateFaqCategoryContent } from '@/api/schema/faq_category_content'
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
  contents: Map<string, ContentFormData>
}

function CreateFaqCategoryForm({ settings }: { settings: FaqSettings }) {
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
      contents: initContents(),
    },
    validate: {
      slug: (value) =>
        validateSlug({ value, required: true, dict: dictionary }),
      contents: {
        title: (value) =>
          validateFaqCategoryTitle({
            value,
            required: false,
            dict: dictionary,
          }),
      },
    },
    validateInputOnChange: false,
    validateInputOnBlur: true,
  })
  const initContentErrors = () => {
    const result = new Map<string, Array<string>>()
    settings.supported_locales.forEach((locale) => {
      result.set(locale.value, [])
    })
    return result
  }
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
      const contents: Array<CreateFaqCategoryContent> = []
      values.contents.forEach((item, locale) => {
        if (item.title) {
          contents.push({
            locale,
            title: item.title,
          })
        }
      })
      const response = await createFaqCategory({
        lang,
        access_token: accessToken,
        slug: values.slug,
        contents,
      })
      if (response.ok) {
        showNotification({
          type: 'success',
          message: dictionary.faq.create_category_succeeded,
          autoClose: 5000,
        })
        router.push(`/${lang}/faq/categories`)
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
          {dictionary.navigations.faq_features.category.new.title}
        </h1>
        <div className="ml-3">
          <Button
            type="button"
            intent="normal"
            className="uppercase"
            onClick={() => router.push(`/${lang}/faq/categories`)}
          >
            {dictionary.back}
          </Button>
        </div>
      </header>
      <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
        <TextInput
          name="slug"
          id="slug"
          label={dictionary.types.faq_category.slug}
          help={dictionary.types.faq_category.slug_help}
          placeholder="how-to-sign-in"
          {...form.getInputProps('slug')}
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
      <div className="flex gap-x-3 mt-8">
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

export function CreateFaqCategory() {
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
  return <CreateFaqCategoryForm settings={settings} />
}
