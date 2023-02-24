'use client'

import { FormData } from 'next/dist/compiled/@edge-runtime/primitives/fetch'

import { Button } from '@/components/buttons/Button'
import { TextInput } from '@/components/forms/TextInput'

import { useForm } from '@/hooks/form'

interface Props {
  dict: any
}

interface FormData {
  workspaceName: string
  firstAgentName: string
  firstAgentEmail: string
  firstAgentPassword: string
}

export function WelcomeForm({ dict }: Props) {
  const form = useForm<FormData>({
    initialValues: {
      workspaceName: '',
      firstAgentName: 'test',
      firstAgentEmail: '',
      firstAgentPassword: '',
    },
    validate: {
      firstAgentName: (value) =>
        !value
          ? 'this field is required...'
          : value.length > 3
          ? 'too long...'
          : null,
    },
    validateInputOnChange: false,
    validateInputOnBlur: true,
  })
  const handleSubmit = async (values: FormData) => {
    // TODO handle
    alert(JSON.stringify(values))
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
      {/* TODO switch to PasswordInput component */}
      <TextInput
        name="first_agent_password"
        id="first_agent_password"
        label={dict.welcome.first_agent.password}
        {...form.getInputProps('firstAgentPassword')}
      />
      <div>
        <Button type="submit" intent="primary" className="w-full uppercase">
          {dict.submit}
        </Button>
      </div>
    </form>
  )
}
