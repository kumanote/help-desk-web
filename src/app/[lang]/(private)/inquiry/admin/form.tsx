'use client'

import { useState } from 'react'

import { Dictionary } from '@/dictionaries/interface'

import { useAuthContext } from '@/app/auth-provider'
import { showNotification } from '@/app/notification-provider'

import { Button } from '@/components/buttons/Button'
import { TextInput } from '@/components/forms/TextInput'
import { Toggle } from '@/components/forms/Toggle'

import { useForm } from '@/hooks/form'

import { Lang } from '@/lib/language'
import { validateUrl } from '@/lib/validator'

import { createOrUpdateInquirySettings } from '@/api/gateway/inquiry'
import { InquirySettings } from '@/api/schema/inquiry_settings'

import { InquiryAdminHeading } from './heading'

interface Props {
  settings: InquirySettings | null
  lang: Lang
  dictionary: Dictionary
  onSave: (settings: InquirySettings) => void
  onCancel: () => void
}

interface LineSettings {
  enabled: boolean
  friendUrl: string
  friendQrCodeUrl: string
}

interface NotificationSettings {
  slackWebhookUrl: string
}

interface FormData {
  line: LineSettings
  notification: NotificationSettings
}

export function InquirySettingsForm({
  settings,
  lang,
  dictionary,
  onSave,
  onCancel,
}: Props) {
  const { state: authState } = useAuthContext()
  const [submitting, setSubmitting] = useState(false)
  const form = useForm<FormData>({
    initialValues: {
      line: {
        enabled: settings ? settings.line.enabled : false,
        friendUrl: settings?.line.friend_url || '',
        friendQrCodeUrl: settings?.line.friend_qr_code_url || '',
      },
      notification: {
        slackWebhookUrl: settings?.notification.slack_webhook_url || '',
      },
    },
    validate: {
      line: {
        friendUrl: (value) =>
          validateUrl({ value, required: false, dict: dictionary }),
        friendQrCodeUrl: (value) =>
          validateUrl({ value, required: false, dict: dictionary }),
      },
    },
    validateInputOnChange: false,
    validateInputOnBlur: true,
  })
  const handleSubmit = async (values: FormData) => {
    if (submitting) return false
    setSubmitting(true)
    try {
      const accessToken = authState.data!.token
      const response = await createOrUpdateInquirySettings({
        lang,
        access_token: accessToken,
        line: {
          enabled: values.line.enabled,
          friend_url: values.line.friendUrl ? values.line.friendUrl : null,
          friend_qr_code_url: values.line.friendQrCodeUrl
            ? values.line.friendQrCodeUrl
            : null,
        },
        notification: {
          slack_webhook_url: values.notification.slackWebhookUrl
            ? values.notification.slackWebhookUrl
            : null,
        },
      })
      if (response.ok) {
        showNotification({
          type: 'success',
          message: dictionary.inquiry.update_settings_succeeded,
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
      <InquiryAdminHeading dictionary={dictionary} />
      <div className="divide-y divide-color-base space-y-6">
        <div>
          <h2 className="mt-6 text-lg font-medium text-color-base capitalize">
            {dictionary.types.inquiry_settings.line.title}
          </h2>
          <div className="mt-2 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
            <Toggle
              label={dictionary.types.inquiry_settings.line.enabled}
              {...form.getInputProps('line.enabled')}
              wrapperClassName="sm:col-span-2"
            >
              <span className="font-medium text-color-base">
                {dictionary.enabled}
              </span>
            </Toggle>
            <TextInput
              name="line_friend_url"
              id="line_friend_url"
              label={dictionary.types.inquiry_settings.line.friend_url}
              placeholder="https://lin.ee/xxxxxxx"
              {...form.getInputProps('line.friendUrl')}
            />
            <TextInput
              name="friend_qr_code_url"
              id="friend_qr_code_url"
              label={dictionary.types.inquiry_settings.line.friend_qr_code_url}
              placeholder="https://qr-official.line.me/gs/M_xxxxxxxx_GW.png"
              {...form.getInputProps('line.friendQrCodeUrl')}
            />
          </div>
        </div>
        <div>
          <h2 className="mt-6 text-lg font-medium text-color-base capitalize">
            {dictionary.types.inquiry_settings.notification.title}
          </h2>
          <div className="mt-2 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
            <TextInput
              name="notification_slack_webhook_url"
              id="notification_slack_webhook_url"
              label={
                dictionary.types.inquiry_settings.notification.slack_webhook_url
              }
              placeholder="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
              {...form.getInputProps('notification.slackWebhookUrl')}
            />
          </div>
        </div>
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
          onClick={() => onCancel()}
        >
          {dictionary.cancel}
        </Button>
      </div>
    </form>
  )
}
