'use client'

import { Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import {
  Fragment,
  createContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'

import {
  Notification,
  NotificationType,
  useNotificationsState,
} from '@/hooks/notification'

interface NotificationContextProps {
  notifications: Notification[]
  queue: Notification[]
}

const NotificationsContext = createContext<NotificationContextProps | null>(
  null
)

function NotificationItemIcon({ type }: { type?: NotificationType }) {
  switch (type) {
    case 'success':
      return (
        <CheckCircleIcon
          className="h-6 w-6 text-green-400"
          aria-hidden="true"
        ></CheckCircleIcon>
      )
    case 'warning':
      return (
        <ExclamationCircleIcon
          className="h-6 w-6 text-yellow-400"
          aria-hidden="true"
        ></ExclamationCircleIcon>
      )
    case 'error':
      return (
        <ExclamationCircleIcon
          className="h-6 w-6 text-red-400"
          aria-hidden="true"
        ></ExclamationCircleIcon>
      )
    default:
      return (
        <InformationCircleIcon
          className="h-6 w-6 text-blue-400"
          aria-hidden="true"
        ></InformationCircleIcon>
      )
  }
}

function NotificationItem({
  notification,
  onHide,
}: {
  notification: Notification
  onHide(id: string): void
}) {
  const [isShowing, setIsShowing] = useState(true)
  const hideTimeout = useRef<number>()
  const handleHide = () => {
    setIsShowing(false)
    onHide(notification.id!)
    window.clearTimeout(hideTimeout.current)
  }
  const cancelDelayedHide = () => {
    clearTimeout(hideTimeout.current)
  }
  const handleDelayedHide = () => {
    if (typeof notification.autoClose === 'number') {
      hideTimeout.current = window.setTimeout(
        () => setIsShowing(false),
        notification.autoClose
      )
    }
  }
  useEffect(() => {
    handleDelayedHide()
    return cancelDelayedHide
  })

  return (
    <Transition
      appear={true}
      afterLeave={handleHide}
      show={isShowing}
      key={notification.id}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-1/2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100 sm:translate-x-0"
      leaveTo="opacity-0 sm:translate-x-1/2"
    >
      <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-color-base shadow-lg dark:shadow-zinc-700 ring-1 ring-black dark:ring-zinc-600 ring-opacity-5">
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <NotificationItemIcon type={notification.type} />
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5 text-sm font-medium">
              {notification.title && (
                <p className="text-sm font-medium text-color-base">
                  {notification.title}
                </p>
              )}
              <p className="mt-1 text-sm text-color-description">
                {notification.message}
              </p>
            </div>
            <div className="ml-4 flex flex-shrink-0">
              <button
                type="button"
                className="inline-flex rounded-md bg-color-base text-color-dimmed hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                onClick={() => setIsShowing(false)}
              >
                <XMarkIcon className="h-5 w-5"></XMarkIcon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  )
}

export function showNotification(notification: Notification) {
  const event = new CustomEvent<Notification>('notifications:show', {
    detail: notification,
  })
  window.dispatchEvent(event)
}

export function cleanNotifications() {
  const event = new CustomEvent('notifications:clean')
  window.dispatchEvent(event)
}

export function cleanNotificationsQueue() {
  const event = new CustomEvent('notifications:cleanQueue')
  window.dispatchEvent(event)
}

export default function NotificationsProvider({
  children,
}: {
  children: ReactNode
}) {
  const {
    notifications,
    queue,
    showNotification,
    hideNotification,
    clean,
    cleanQueue,
  } = useNotificationsState({ limit: 10 })

  // register custom event listener
  const showNotificationCustomEvent = (event: Event) =>
    showNotification((event as CustomEvent).detail as Notification)
  const cleanNotificationsCustomEvent = () => clean()
  const cleanNotificationsQueueCustomEvent = () => cleanQueue()
  const useIsomorphicEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect
  useIsomorphicEffect(() => {
    window.removeEventListener(
      'notifications:show',
      showNotificationCustomEvent
    )
    window.addEventListener('notifications:show', showNotificationCustomEvent)
    window.removeEventListener(
      'notifications:clean',
      cleanNotificationsCustomEvent
    )
    window.addEventListener(
      'notifications:clean',
      cleanNotificationsCustomEvent
    )
    window.removeEventListener(
      'notifications:cleanQueue',
      cleanNotificationsQueueCustomEvent
    )
    window.addEventListener(
      'notifications:cleanQueue',
      cleanNotificationsQueueCustomEvent
    )
    return () => {
      // window.removeEventListener('notifications:show', showNotificationCustomEvent);
      window.removeEventListener(
        'notifications:clean',
        cleanNotificationsCustomEvent
      )
      window.removeEventListener(
        'notifications:cleanQueue',
        cleanNotificationsQueueCustomEvent
      )
    }
  }, [])

  const items = notifications.map((notification) => (
    <NotificationItem
      key={notification.id}
      notification={notification}
      onHide={hideNotification}
    />
  ))
  return (
    <NotificationsContext.Provider value={{ notifications, queue }}>
      <div className="pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-end space-y-2 px-4 py-6 sm:items-end sm:justify-end sm:p-6">
        {items}
      </div>
      {children}
    </NotificationsContext.Provider>
  )
}
