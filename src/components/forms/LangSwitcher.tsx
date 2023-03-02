'use client'

import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { usePathname, useRouter } from 'next/navigation'
import { Fragment } from 'react'

import { LangIcon } from '@/components/icons/langs/LangIcon'

import { Lang, languages } from '@/lib/language'

interface Props {
  lang: Lang
}

interface Option {
  value: Lang
  text: string
}

export function LangSwitcher({ lang }: Props) {
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
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-default rounded-full ring-1 ring-zinc-900/20 backdrop-blur dark:ring-white/50">
              <span className="flex items-center">
                <LangIcon
                  lang={lang}
                  className="overflow-hidden rounded-full w-6 h-6"
                ></LangIcon>
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute right-0 z-10 mt-1 w-48 overflow-auto rounded-md py-1 text-base shadow-lg dark:shadow-zinc-700 ring-1 ring-black dark:ring-zinc-600 ring-opacity-5 focus:outline-none sm:text-sm">
                {options.map((item) => (
                  <Listbox.Option
                    key={item.value}
                    className={({ active }) =>
                      clsx(
                        active
                          ? 'bg-primary-600 text-white'
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
                              'ml-3 block whitespace-nowrap'
                            )}
                          >
                            {item.text}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={clsx(
                              active ? 'text-white' : 'text-primary-600',
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
