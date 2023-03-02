'use client'

import { FormData } from 'next/dist/compiled/@edge-runtime/primitives/fetch'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { showNotification } from '@/app/notification-provider'
import { useWorkspaceContext } from '@/app/workspace-provider'

import { Button } from '@/components/buttons/Button'
import { PasswordInput } from '@/components/forms/PasswordInput'
import { TextInput } from '@/components/forms/TextInput'

import { useForm } from '@/hooks/form'

import { Lang } from '@/lib/language'
import {
  validateAgentName,
  validateEmail,
  validatePassword,
  validateWorkspaceName,
} from '@/lib/validator'

import { initWorkspace } from '@/api/gateway/workspace'

interface Props {
  lang: Lang
  dict: any
}

interface FormData {
  workspaceName: string
  firstAgentName: string
  firstAgentEmail: string
  firstAgentPassword: string
}

export function WelcomeForm({ lang, dict }: Props) {
  const router = useRouter()
  const form = useForm<FormData>({
    initialValues: {
      workspaceName: '',
      firstAgentName: '',
      firstAgentEmail: '',
      firstAgentPassword: '',
    },
    validate: {
      workspaceName: (value) => validateWorkspaceName({ value, dict }),
      firstAgentName: (value) =>
        validateAgentName({ value, required: true, dict }),
      firstAgentEmail: (value) =>
        validateEmail({ value, required: true, dict }),
      firstAgentPassword: (value) => validatePassword({ value, dict }),
    },
    validateInputOnChange: false,
    validateInputOnBlur: true,
  })
  // set loading animation to submit button during submitting (disable click)
  const [submitting, setSubmitting] = useState(false)
  const { dispatch: workspaceDispatcher } = useWorkspaceContext()
  const handleSubmit = async (values: FormData) => {
    if (submitting) return false
    setSubmitting(true)
    try {
      const response = await initWorkspace({
        lang,
        workspace_name: values.workspaceName,
        first_agent_email: values.firstAgentEmail,
        first_agent_password: values.firstAgentPassword,
        first_agent_name: values.firstAgentName,
      })
      if (response.ok) {
        workspaceDispatcher({ type: 'set', payload: response.ok })
        showNotification({
          type: 'success',
          message: dict.welcome.initialized,
          autoClose: 5000,
        })
        router.push(`/${lang}/login`)
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
        name="workspace_name"
        id="workspace_name"
        label={dict.types.workspace.name}
        placeholder="your-domain.com"
        {...form.getInputProps('workspaceName')}
      />
      <TextInput
        name="first_agent_name"
        id="first_agent_name"
        label={dict.welcome.first_agent.name}
        placeholder="Your Name"
        {...form.getInputProps('firstAgentName')}
      />
      <TextInput
        type="email"
        name="first_agent_email"
        id="first_agent_email"
        label={dict.welcome.first_agent.email}
        placeholder="your-name@example.com"
        {...form.getInputProps('firstAgentEmail')}
      />
      <PasswordInput
        name="first_agent_password"
        id="first_agent_password"
        label={dict.welcome.first_agent.password}
        {...form.getInputProps('firstAgentPassword')}
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
