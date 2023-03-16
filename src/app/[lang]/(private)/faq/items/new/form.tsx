'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import useSWR from 'swr'

import { NoAvailableLocaleWarnings } from '@/app/[lang]/(private)/faq/no-available-locale-warnings'
import { useAuthContext } from '@/app/auth-provider'
import { useLangContext } from '@/app/lang-provider'

import { Button } from '@/components/buttons/Button'
import { TextInput } from '@/components/forms/TextInput'
import {
  RichTextEditor,
  RichTextEditorValue,
  createEmptyValue,
} from '@/components/forms/editors/RichTextEditor'
import { Skeleton } from '@/components/skeletons/Skeleton'

import { useForm } from '@/hooks/form'

import { validateSlug } from '@/lib/validator'

import { getFaqSettings } from '@/api/gateway/faq'
import { FaqSettings } from '@/api/schema/faq_settings'

interface FormData {
  slug: string
}

function CreateFaqItemForm({ settings }: { settings: FaqSettings }) {
  const router = useRouter()
  const langState = useLangContext()
  const lang = langState!.lang
  const dictionary = langState!.dictionary
  const [submitting, setSubmitting] = useState(false)
  const form = useForm<FormData>({
    initialValues: {
      slug: '',
    },
    validate: {
      slug: (value) =>
        validateSlug({ value, required: true, dict: dictionary }),
    },
    validateInputOnChange: false,
    validateInputOnBlur: true,
  })
  const [body, setBody] = useState<RichTextEditorValue>(createEmptyValue())
  return (
    <form>
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-medium text-color-base capitalize">
          {dictionary.navigations.faq_features.item.new.title}
        </h1>
        <div className="ml-3">
          <Button
            type="button"
            intent="normal"
            className="uppercase"
            onClick={() => router.push(`/${lang}/faq/items`)}
          >
            {dictionary.back}
          </Button>
        </div>
      </header>
      <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
        <TextInput
          name="slug"
          id="slug"
          label={dictionary.types.faq_item.slug}
          help={dictionary.types.faq_item.slug_help}
          placeholder="how-to-sign-in"
          {...form.getInputProps('slug')}
          wrapperClassName="sm:col-span-2"
        />
        <RichTextEditor
          value={body}
          onChange={setBody}
          label={dictionary.types.faq_item_content.body}
          wrapperClassName="sm:col-span-2"
        />
      </div>
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

export function CreateFaqItem() {
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
  return <CreateFaqItemForm settings={settings} />
}
