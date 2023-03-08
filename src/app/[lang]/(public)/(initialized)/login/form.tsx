'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { setAuthTokenCookie, useAuthContext } from '@/app/auth-provider'
import { useLangContext } from '@/app/lang-provider'
import {
  cleanNotifications,
  showNotification,
} from '@/app/notification-provider'

import { Button } from '@/components/buttons/Button'
import { PasswordInput } from '@/components/forms/PasswordInput'
import { TextInput } from '@/components/forms/TextInput'

import { useForm } from '@/hooks/form'

import { getAuthorizedScopes, login } from '@/api/gateway/auth'

interface FormData {
  username: string
  password: string
}

export function LoginForm() {
  const router = useRouter()
  const langState = useLangContext()
  const lang = langState!.lang
  const dict = langState!.dictionary
  const form = useForm<FormData>({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) => (!value ? dict.validations.required : null),
      password: (value) => (!value ? dict.validations.required : null),
    },
    validateInputOnChange: false,
    validateInputOnBlur: false,
  })
  const [submitting, setSubmitting] = useState(false)
  const { dispatch: authDispatcher } = useAuthContext()
  const handleSubmit = async (values: FormData) => {
    if (submitting) return false
    setSubmitting(true)
    try {
      const response = await login({
        lang,
        username: values.username,
        password: values.password,
      })
      if (response.ok) {
        const accessToken = response.ok.access_token
        setAuthTokenCookie({ accessToken })
        const authResponse = await getAuthorizedScopes({
          lang,
          access_token: accessToken,
        })
        if (authResponse.ok) {
          authDispatcher({
            type: 'set',
            payload: {
              scopes: authResponse.ok,
              token: accessToken,
            },
          })
          cleanNotifications()
          router.push(`/${lang}/dashboard`)
        } else {
          showNotification({
            type: 'error',
            message: dict.validations.network,
            autoClose: false,
          })
        }
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
        return false
      }
    } catch {
      showNotification({
        type: 'error',
        message: dict.validations.network,
        autoClose: false,
      })
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <form className="space-y-6" onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        type="email"
        name="email"
        id="email"
        label={dict.email}
        placeholder="your-name@example.com"
        {...form.getInputProps('username')}
      />
      <PasswordInput
        name="password"
        id="password"
        label={dict.password}
        {...form.getInputProps('password')}
      />
      <div>
        <Button
          type="submit"
          intent="primary"
          loading={submitting}
          className="w-full uppercase"
        >
          {dict.submit}
        </Button>
      </div>
    </form>
  )
}
