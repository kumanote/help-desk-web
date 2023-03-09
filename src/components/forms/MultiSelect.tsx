'use client'

import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { useState } from 'react'
import { Fragment } from 'react'

import { SelectOption } from '@/components/forms/Select'

export interface MultiSelectOption {
  getId(): string | number
  getLabel(): string
}

interface Props<T extends MultiSelectOption> {
  value?: Array<T>
  options: Array<T>
  error?: string
  label?: string
  help?: string
  wrapperClassName?: string
  onChange: (value: Array<T>) => void
}

export function MultiSelect<T extends SelectOption>({
  value,
  options,
  error,
  label,
  help,
  wrapperClassName,
  onChange,
}: Props<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const isSelected = (a: T) => {
    return !!value?.find((b) => b.getId() === a.getId())
  }
  const handleDeselect = (v: T) => {
    const newValue = value?.filter((item) => item.getId() !== v.getId()) || []
    onChange(newValue)
    setIsOpen(true)
  }
  const handleSelect = (v: any) => {
    if (!isSelected(v)) {
      const newValue = [...(value || []), options.find((item) => item === v)!]
      onChange(newValue)
    } else {
      handleDeselect(v)
    }
    setIsOpen(true)
  }
  const hasError = !!error

  return (
    <div className={wrapperClassName}>
      <Listbox value={value} onChange={(value) => handleSelect(value)}>
        {({ open }) => (
          <>
            {label && (
              <Listbox.Label className="block text-sm font-medium text-color-label">
                {label}
              </Listbox.Label>
            )}
            <div className="mt-1 relative">
              <Listbox.Button
                className="bg-color-base text-color-base relative w-full border-base rounded-md pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                onClick={() => setIsOpen(!isOpen)}
              >
                {!value || value.length < 1
                  ? '-'
                  : value.map((v, i) => {
                      return (
                        <span
                          key={v.getId()}
                          className={clsx(
                            'inline-block items-center rounded-full px-3 py-0.5 text-sm font-medium bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 truncate',
                            i < value.length - 1 ? 'mr-1' : ''
                          )}
                        >
                          {v.getLabel()}
                        </span>
                      )
                    })}
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
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
                <Listbox.Options className="absolute z-10 mt-1 w-full bg-color-base text-color-base shadow-lg dark:shadow-zinc-700 max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {options.map((item) => {
                    const selected = isSelected(item)
                    return (
                      <Listbox.Option
                        key={item.getId()}
                        className={({ active }) =>
                          clsx(
                            active
                              ? 'bg-primary-500 text-white'
                              : 'text-color-base',
                            'relative cursor-default select-none py-2 pl-3 pr-9'
                          )
                        }
                        value={item}
                      >
                        {({ active }) => (
                          <>
                            <span
                              className={clsx(
                                'block truncate',
                                selected ? 'font-semibold' : 'font-normal'
                              )}
                            >
                              {item.getLabel()}
                            </span>

                            {selected ? (
                              <span
                                className={clsx(
                                  active ? 'text-white' : 'text-primary-600',
                                  'absolute inset-y-0 right-0 flex items-center pr-4'
                                )}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    )
                  })}
                </Listbox.Options>
              </Transition>
            </div>
            {hasError ? (
              <p className="mt-2 text-sm text-red-500">{error}</p>
            ) : help ? (
              <p className="mt-2 text-sm text-color-dimmed">{help}</p>
            ) : (
              ''
            )}
          </>
        )}
      </Listbox>
    </div>
  )
}
