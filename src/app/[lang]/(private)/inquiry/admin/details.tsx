'use client'

import { Dictionary } from '@/dictionaries/interface'

import { Button } from '@/components/buttons/Button'

import { InquirySettings } from '@/api/schema/inquiry_settings'

import { InquiryAdminHeading } from './heading'

interface Props {
  settings: InquirySettings | null
  dictionary: Dictionary
  onEditButtonClick: () => void
}

export function InquirySettingsDetails({
  settings,
  dictionary,
  onEditButtonClick,
}: Props) {
  return (
    <div>
      <InquiryAdminHeading dictionary={dictionary} />
      <div className="divide-y divide-color-base space-y-6">
        <div>
          <h2 className="mt-6 text-lg font-medium text-color-base capitalize">
            {dictionary.types.inquiry_settings.line.title}
          </h2>
          <div className="mt-2 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
            <div className="sm:col-span-2">
              <div className="text-sm font-medium text-color-label">
                {dictionary.types.inquiry_settings.line.enabled}
              </div>
              <div className="mt-1 text-base font-medium text-color-base">
                {settings?.line.enabled
                  ? dictionary.enabled
                  : dictionary.disabled}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-color-label">
                {dictionary.types.inquiry_settings.line.friend_url}
              </div>
              <div className="mt-1 text-base font-medium text-color-base">
                {settings?.line.friend_url || '-'}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-color-label">
                {dictionary.types.inquiry_settings.line.friend_qr_code_url}
              </div>
              <div className="mt-1 text-base font-medium text-color-base">
                {settings?.line.friend_qr_code_url || '-'}
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="mt-6 text-lg font-medium text-color-base capitalize">
            {dictionary.types.inquiry_settings.notification.title}
          </h2>
          <div className="mt-2 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
            <div>
              <div className="text-sm font-medium text-color-label">
                {
                  dictionary.types.inquiry_settings.notification
                    .slack_webhook_url
                }
              </div>
              <div className="mt-1 text-base font-medium text-color-base">
                {settings?.notification.slack_webhook_url || '-'}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-x-3 mt-6">
        <Button
          type="button"
          intent="normal"
          className="uppercase"
          onClick={onEditButtonClick}
        >
          {dictionary.edit}
        </Button>
      </div>
    </div>
  )
}
