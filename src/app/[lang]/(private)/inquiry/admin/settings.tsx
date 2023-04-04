'use client'

import { useState } from 'react'
import useSWR from 'swr'

import { useAuthContext } from '@/app/auth-provider'
import { useLangContext } from '@/app/lang-provider'

import { Skeleton } from '@/components/skeletons/Skeleton'

import { getInquirySettings } from '@/api/gateway/inquiry'
import { InquirySettings } from '@/api/schema/inquiry_settings'

import { InquirySettingsDetails } from './details'
import { InquirySettingsForm } from './form'

export function InquiryAdminSettings() {
  const langState = useLangContext()
  const lang = langState!.lang
  const dictionary = langState!.dictionary
  const { state: authState } = useAuthContext()
  const [editing, setEditing] = useState(false)

  const { data: settings, mutate: mutateSettings } = useSWR(
    '/inquiry/settings',
    () => {
      return getInquirySettings({
        lang,
        access_token: authState.data!.token,
      }).then((response) => {
        if (typeof response.ok !== 'undefined') {
          return response.ok
        } else {
          throw Error('failed to fetch inquiry settings...')
        }
      })
    },
    { refreshInterval: 0 }
  )
  const loadingSettings = typeof settings === 'undefined'
  if (loadingSettings) {
    return <Skeleton className="h-10" />
  }

  const handleOnSave = async (settings: InquirySettings) => {
    await mutateSettings(settings)
    setEditing(false)
  }

  if (editing) {
    return (
      <InquirySettingsForm
        settings={settings}
        lang={lang}
        dictionary={dictionary}
        onSave={handleOnSave}
        onCancel={() => setEditing(false)}
      />
    )
  } else {
    return (
      <InquirySettingsDetails
        settings={settings}
        dictionary={dictionary}
        onEditButtonClick={() => setEditing(true)}
      />
    )
  }
}
