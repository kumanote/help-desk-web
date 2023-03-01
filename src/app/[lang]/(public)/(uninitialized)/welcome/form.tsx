'use client'

import { FormData } from 'next/dist/compiled/@edge-runtime/primitives/fetch'
import { useState } from 'react'

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
import { Workspace } from '@/api/schema/workspace'

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
        const workspace = (await response.json()) as Workspace
        workspaceDispatcher({ type: 'set', payload: workspace })
        // TODO show complete message and redirect to login page
      } else {
        // handle error
        const error = response.json()
        // TODO show error message
      }
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
