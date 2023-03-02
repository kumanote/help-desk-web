'use client'

import type { ReactNode } from 'react'

import { useQueue } from '@/hooks/queue'
import { randomId } from '@/hooks/random-id'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface Notification {
  id?: string
  type?: NotificationType
  title?: ReactNode
  message: ReactNode
  autoClose?: boolean | number

  onClose?(): void
}

export function useNotificationsState({ limit }: { limit: number }) {
  const { state, queue, update, cleanQueue } = useQueue<Notification>({
    initialValues: [],
    limit,
  })
  const showNotification = (notification: Notification) => {
    const id = notification.id || randomId()
    update((notifications) => {
      if (
        notification.id &&
        notifications.some((n) => n.id === notification.id)
      ) {
        return notifications
      }
      return [...notifications, { ...notification, id }]
    })
    return id
  }
  const updateNotification = (notification: Notification) =>
    update((notifications) => {
      const index = notifications.findIndex((n) => n.id === notification.id)
      if (index === -1) {
        return notifications
      }
      const newNotifications = [...notifications]
      newNotifications[index] = notification
      return newNotifications
    })
  const hideNotification = (id: string) =>
    update((notifications) =>
      notifications.filter((notification) => {
        return notification.id !== id
      })
    )

  const clean = () => update(() => [])

  return {
    notifications: state,
    queue,
    showNotification,
    updateNotification,
    hideNotification,
    cleanQueue,
    clean,
  }
}
