'use client'

import { useLangContext } from '@/app/lang-provider'

import { Select, SelectOption } from '@/components/forms/Select'

import { useForm } from '@/hooks/form'

class LocaleOption implements SelectOption {
  value: string
  text: string
  constructor(value: string, text: string) {
    this.value = value
    this.text = text
  }
  getId(): string | number {
    return this.value
  }
  getLabel(): string {
    return this.text
  }
}

interface FormData {
  text: string
  locale: LocaleOption
}

export function FaqItemsSearchForm() {
  const langState = useLangContext()
  const lang = langState!.lang
  const defaultLocaleOption = new LocaleOption('', 'All')
  const localeOptions = [defaultLocaleOption, new LocaleOption('test', 'TEST')]
  const form = useForm<FormData>({
    initialValues: {
      text: '',
      locale: defaultLocaleOption,
    },
    validateInputOnChange: false,
    validateInputOnBlur: true,
  })
  return (
    <div>
      <Select
        options={localeOptions}
        label="locale"
        {...form.getInputProps('locale')}
      />
    </div>
  )
}
