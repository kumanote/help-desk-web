'use client'

import { useState } from 'react'

import { useAuthContext } from '@/app/auth-provider'
import { useLangContext } from '@/app/lang-provider'
import { showNotification } from '@/app/notification-provider'

import { Button } from '@/components/buttons/Button'
import { PasswordInput } from '@/components/forms/PasswordInput'

import { useForm } from '@/hooks/form'

import { validatePassword, validatePasswordConfirmation } from '@/lib/validator'

import { changePassword } from '@/api/gateway/me'

interface FormData {
  currentPassword: string
  newPassword: string
  newPasswordConfirmation: string
}

export function SecuritySettingsForm() {
  const langState = useLangContext()
  const lang = langState!.lang
  const dictionary = langState!.dictionary
  const { state: authState } = useAuthContext()
  const form = useForm<FormData>({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirmation: '',
    },
    validate: {
      currentPassword: (value) =>
        !value ? dictionary.validations.required : null,
      newPassword: (value) => validatePassword({ value, dict: dictionary }),
      newPasswordConfirmation: (value, values) =>
        validatePasswordConfirmation({
          confirmation: value,
          password: values.newPassword,
          dict: dictionary,
        }),
    },
    validateInputOnChange: false,
    validateInputOnBlur: true,
  })
  const [submitting, setSubmitting] = useState(false)
  const handleSubmit = async (values: FormData) => {
    if (submitting) return false
    setSubmitting(true)
    try {
      const accessToken = authState.data!.token
      const response = await changePassword({
        lang,
        access_token: accessToken,
        current_password: values.currentPassword,
        new_password: values.newPassword,
      })
      if (response.ok) {
        showNotification({
          type: 'success',
          message: dictionary.settings.change_password_succeeded,
          autoClose: 5000,
        })
        form.reset()
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
      <div>
        <h1 className="text-xl font-medium text-color-base capitalize">
          {dictionary.navigations.settings.security.title}
        </h1>
        <p className="mt-1 text-sm text-color-dimmed">
          {dictionary.navigations.settings.security.description}
        </p>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
        <PasswordInput
          name="current_password"
          id="current_password"
          label={dictionary.current_password}
          {...form.getInputProps('currentPassword')}
        />
        <div className="hidden sm:block" />
        <PasswordInput
          name="new_password"
          id="new_password"
          label={dictionary.new_password}
          {...form.getInputProps('newPassword')}
        />
        <div className="hidden sm:block" />
        <PasswordInput
          name="new_password_confirmation"
          id="new_password_confirmation"
          label={dictionary.password_for_confirmation}
          {...form.getInputProps('newPasswordConfirmation')}
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
      </div>
    </form>
  )
}
