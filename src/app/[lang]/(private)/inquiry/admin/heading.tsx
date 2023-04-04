'use client'

import { Dictionary } from '@/dictionaries/interface'

export function InquiryAdminHeading({
  dictionary,
}: {
  dictionary: Dictionary
}) {
  return (
    <div>
      <h1 className="text-xl font-medium text-color-base capitalize">
        {dictionary.navigations.inquiry_features.admin.title}
      </h1>
      <p className="mt-1 text-sm text-color-dimmed">
        {dictionary.navigations.inquiry_features.admin.description}
      </p>
    </div>
  )
}
