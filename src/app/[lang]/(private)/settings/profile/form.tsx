'use client'

import { useState } from 'react'
import useSWR from 'swr'

import { Dictionary } from '@/dictionaries/interface'

import { useAuthContext } from '@/app/auth-provider'
import { useLangContext } from '@/app/lang-provider'
import { showNotification } from '@/app/notification-provider'

import { Button } from '@/components/buttons/Button'
import { TextInput } from '@/components/forms/TextInput'
import { Skeleton } from '@/components/skeletons/Skeleton'

import { useForm } from '@/hooks/form'

import { validateAgentName, validateEmail } from '@/lib/validator'

import { getProfile, updateProfile } from '@/api/gateway/me'

interface FormData {
  email: string
  name: string
}

function Heading({ dictionary }: { dictionary: Dictionary }) {
  return (
    <div>
      <h1 className="text-xl font-medium text-color-base capitalize">
        {dictionary.navigations.settings.profile.title}
      </h1>
      <p className="mt-1 text-sm text-color-dimmed">
        {dictionary.navigations.settings.profile.description}
      </p>
    </div>
  )
}

export function ProfileSettingsForm() {
  const langState = useLangContext()
  const lang = langState!.lang
  const dictionary = langState!.dictionary
  const { state: authState } = useAuthContext()
  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { data: agent, mutate: mutateAgent } = useSWR(
    '/agent/me',
    () => {
      return getProfile({
        lang,
        access_token: authState.data!.token,
      }).then((response) => {
        if (response.ok) {
          return response.ok
        } else {
          throw Error('failed to fetch agent profile...')
        }
      })
    },
    { refreshInterval: 0 }
  )
  const form = useForm<FormData>({
    initialValues: {
      email: '',
      name: '',
    },
    validate: {
      email: (value) =>
        validateEmail({ value, required: true, dict: dictionary }),
      name: (value) =>
        validateAgentName({ value, required: true, dict: dictionary }),
    },
    validateInputOnChange: false,
    validateInputOnBlur: true,
  })
  const turnEditModeOn = () => {
    if (!agent) return false
    form.reset()
    form.setFieldValue('email', agent.email)
    form.setFieldValue('name', agent.name)
    setEditing(true)
  }
  const handleSubmit = async (values: FormData) => {
    if (submitting) return false
    setSubmitting(true)
    try {
      const accessToken = authState.data!.token
      const response = await updateProfile({
        lang,
        access_token: accessToken,
        email: values.email,
        name: values.name,
      })
      if (response.ok) {
        showNotification({
          type: 'success',
          message: dictionary.settings.update_profile_succeeded,
          autoClose: 5000,
        })
        await mutateAgent(response.ok)
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
            name="name"
            id="name"
            label={dictionary.types.agent.name}
            placeholder="Your Name"
            {...form.getInputProps('name')}
          />
          <div className="hidden sm:block" />
          <TextInput
            type="email"
            name="email"
            id="email"
            label={dictionary.types.agent.email}
            placeholder="your-name@example.com"
            {...form.getInputProps('email')}
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
          <div>
            <div className="text-sm font-medium text-color-label">
              {dictionary.types.agent.name}
            </div>
            <div className="mt-1 text-base font-medium text-color-base">
              {!agent ? <Skeleton className="h-2" /> : agent.name}
            </div>
          </div>
          <div className="hidden sm:block" />
          <div>
            <div className="text-sm font-medium text-color-label">
              {dictionary.types.agent.email}
            </div>
            <div className="mt-1 text-base font-medium text-color-base">
              {!agent ? <Skeleton className="h-2" /> : agent.email}
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
