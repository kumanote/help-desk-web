export interface InquirySettings {
  line: InquiryLineSettings
  notification: InquiryNotificationSettings
}

export interface InquiryLineSettings {
  enabled: boolean
  friend_url: string | null
  friend_qr_code_url: string | null
}

export interface InquiryNotificationSettings {
  slack_webhook_url: string | null
}
