'use client'

import { useState } from 'react'
import useSWR from 'swr'

import { useAuthContext } from '@/app/auth-provider'
import { useLangContext } from '@/app/lang-provider'
import { showNotification } from '@/app/notification-provider'

import { Button } from '@/components/buttons/Button'
import { TextInput } from '@/components/forms/TextInput'
import { Skeleton } from '@/components/skeletons/Skeleton'

import { useForm } from '@/hooks/form'

import { validateUrl } from '@/lib/validator'

import { getFaqSettings, updateFaqSettings } from '@/api/gateway/faq'

interface FormData {
  homeUrl: string
  supportedLocales: Array<string>
}

function Heading({ dictionary }: { dictionary: any }) {
  return (
    <div>
      <h1 className="text-xl font-medium text-color-base capitalize">
        {dictionary.navigations.faq_features.admin.title}
      </h1>
      <p className="mt-1 text-sm text-color-dimmed">
        {dictionary.navigations.faq_features.admin.description}
      </p>
    </div>
  )
}

export function FaqAdminForm() {
  const langState = useLangContext()
  const lang = langState!.lang
  const dictionary = langState!.dictionary
  const { state: authState } = useAuthContext()
  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { data: settings, mutate: mutateSettings } = useSWR(
    '/agent/me',
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
  const form = useForm<FormData>({
    initialValues: {
      homeUrl: '',
      supportedLocales: [],
    },
    validate: {
      homeUrl: (value) =>
        validateUrl({ value, required: false, dict: dictionary }),
    },
    validateInputOnChange: false,
    validateInputOnBlur: true,
  })
  const turnEditModeOn = () => {
    if (!settings) return false
    form.reset()
    form.setFieldValue('homeUrl', settings.home_url || '')
    form.setFieldValue(
      'supportedLocales',
      settings.supported_locales.map((item) => item.value)
    )
    setEditing(true)
  }
  const handleSubmit = async (values: FormData) => {
    if (submitting) return false
    setSubmitting(true)
    try {
      const accessToken = authState.data!.token
      const response = await updateFaqSettings({
        lang,
        access_token: accessToken,
        home_url: values.homeUrl ? values.homeUrl : null,
        supported_locales: values.supportedLocales,
      })
      if (response.ok) {
        showNotification({
          type: 'success',
          message: dictionary.settings.update_profile_succeeded,
          autoClose: 5000,
        })
        await mutateSettings(response.ok)
        setEditing(false)
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
  if (editing) {
    return (
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Heading dictionary={dictionary} />
        <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
          <TextInput
            name="home_url"
            id="home_url"
            label={dictionary.types.faq_settings.home_url}
            help={dictionary.types.faq_settings.home_url_help}
            placeholder="https://your-service.com"
            {...form.getInputProps('homeUrl')}
            wrapperClassName="sm:col-span-2"
          />
        </div>
        <div className="flex gap-x-3 mt-6">
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
            onClick={() => setEditing(false)}
          >
            {dictionary.cancel}
          </Button>
        </div>
      </form>
    )
  } else {
    return (
      <div>
        <Heading dictionary={dictionary} />
        <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
          <div className="sm:col-span-2">
            <div className="text-sm font-medium text-color-label">
              {dictionary.types.faq_settings.home_url}
            </div>
            <div className="mt-1 text-base font-medium text-color-base">
              {!settings ? (
                <Skeleton className="h-2" />
              ) : (
                settings.home_url || '-'
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-x-3 mt-6">
          <Button
            type="button"
            intent="normal"
            className="uppercase"
            onClick={() => turnEditModeOn()}
          >
            {dictionary.edit}
          </Button>
        </div>
      </div>
    )
  }
}
