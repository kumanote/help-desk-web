'use client'

import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { usePathname, useRouter } from 'next/navigation'
import { Fragment } from 'react'

import { LangIcon } from '@/components/icons/langs/LangIcon'

import { Lang, languages } from '@/lib/language'

interface Props {
  lang: Lang
  label?: string
}

interface Option {
  value: Lang
  text: string
}

// Language select box
export function LangSelect({ lang, label }: Props) {
  const router = useRouter()
  const pathName = usePathname()
  const redirectedPathName = (value: Lang) => {
    if (!pathName) return '/'
    const segments = pathName.split('/')
    segments[1] = value
    return segments.join('/')
  }
  const options: Array<Option> = languages.map((lang) => {
    const text = (function (lang) {
      switch (lang) {
        case 'vi':
          return 'Tiếng Việt'
        case 'ja':
          return '日本語'
        default:
          return 'English'
      }
    })(lang)
    return {
      value: lang,
      text,
    }
  })
  const selected: Option =
    options.find((item) => item.value === lang) || options[0]
  const handleChange = async (item: Option) => {
    await router.push(redirectedPathName(item.value))
  }
  return (
    <Listbox value={selected} onChange={handleChange}>
      {({ open }) => (
        <>
          {label && (
            <Listbox.Label className="block text-sm font-medium text-color-label">
              label
            </Listbox.Label>
          )}
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-md border-base bg-color-base py-2 pl-3 pr-10 text-left shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm">
              <span className="flex items-center">
                <LangIcon
                  lang={selected.value}
                  className="flex-shrink-0 overflow-hidden rounded-full w-6 h-6"
                ></LangIcon>
                <span className="ml-3 block text-color-base truncate">
                  {selected.text}
                </span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-color-dimmed"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md py-1 text-base bg-color-sheet ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {options.map((item) => (
                  <Listbox.Option
                    key={item.value}
                    className={({ active }) =>
                      clsx(
                        active
                          ? 'text-white bg-primary-500'
                          : 'text-color-base',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <LangIcon
                            lang={item.value}
                            className="overflow-hidden rounded-full w-6 h-6"
                          ></LangIcon>
                          <span
                            className={clsx(
                              selected ? 'font-semibold' : 'font-normal',
                              'ml-3 block truncate'
                            )}
                          >
                            {item.text}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={clsx(
                              active ? 'text-white' : 'text-primary-500',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}
