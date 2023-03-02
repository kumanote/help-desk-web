'use client'

import { useState } from 'react'

import { showNotification } from '@/app/notification-provider'

import { Button } from '@/components/buttons/Button'
import { PasswordInput } from '@/components/forms/PasswordInput'
import { TextInput } from '@/components/forms/TextInput'

import { useForm } from '@/hooks/form'

import { Lang } from '@/lib/language'

interface Props {
  lang: Lang
  dict: any
}

interface FormData {
  username: string
  password: string
}

export function LoginForm({ lang: _, dict }: Props) {
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
  const handleSubmit = async (values: FormData) => {
    if (submitting) return false
    setSubmitting(true)
    try {
      showNotification({
        type: 'error',
        title: 'test',
        message: values.username,
        autoClose: 1000,
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
