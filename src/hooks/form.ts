'use client'

import { klona } from 'klona'
import type {
  ChangeEvent,
  Dispatch,
  FormEvent,
  ReactNode,
  SetStateAction,
} from 'react'
import { useCallback, useState } from 'react'

type GetInputPropsType = 'input' | 'checkbox'
type GetInputProps<Values> = (
  path: keyof Values,
  options?: {
    type?: GetInputPropsType
    withError?: boolean
    withFocus?: boolean
  }
) => {
  value?: any
  checked?: any
  onChange: any
  error?: any
  onBlur?: any
}
type FormErrors = Record<string, ReactNode>
type FormValidationResult = {
  hasErrors: boolean
  errors: FormErrors
}
type SetErrors = Dispatch<SetStateAction<FormErrors>>
type SetFieldValue<Values> = (
  path: keyof Values | string,
  value: Values[keyof Values]
) => void
type SetFieldError<Values> = (
  path: keyof Values | string,
  error: ReactNode
) => void
type ClearFieldError<Values> = (path: keyof Values | string) => void
type OnSubmit<Values> = (
  handleSubmit: (values: Values, event?: FormEvent<HTMLFormElement>) => void,
  handleValidationFailure?: (
    errors: FormErrors,
    values: Values,
    event?: FormEvent<HTMLFormElement>
  ) => void
) => (event?: FormEvent<HTMLFormElement>) => void

function getInputOnChange<Value>(
  setValue: (value: Value | ((current: Value) => Value)) => void
) {
  return (val: Value | ChangeEvent<unknown> | ((current: Value) => Value)) => {
    if (!val) {
      setValue(val as Value)
    } else if (typeof val === 'function') {
      setValue(val)
    } else if (typeof val === 'object' && 'nativeEvent' in val) {
      const { currentTarget } = val
      if (currentTarget instanceof HTMLInputElement) {
        if (currentTarget.type === 'checkbox') {
          setValue(currentTarget.checked as any)
        } else {
          setValue(currentTarget.value as any)
        }
      } else if (
        currentTarget instanceof HTMLTextAreaElement ||
        currentTarget instanceof HTMLSelectElement
      ) {
        setValue(currentTarget.value as any)
      }
    } else {
      setValue(val)
    }
  }
}

function validateValues<Values>(
  rules: Partial<{
    [Key in keyof Values]: (
      value: Values[Key],
      values: Values,
      path: string
    ) => ReactNode
  }>,
  values: Values
): FormValidationResult {
  const errors: FormErrors = {}
  Object.keys(rules).reduce((acc, ruleKey) => {
    const rule = rules[ruleKey as keyof Values]
    if (!!rule) {
      // if validation rule is well-defined function, check value by the function
      const value = values[ruleKey as keyof Values]
      const checked = rule(value, values, ruleKey)
      if (checked !== undefined && checked !== null && checked !== false) {
        // only if the check result is defined, not null, and not false, then inject the reuslt
        acc[ruleKey] = checked
      }
    }
    return acc
  }, errors)
  return {
    hasErrors: Object.keys(errors).length > 0,
    errors,
  }
}

function validateFieldValue<Values>(
  path: keyof Values | string,
  rules: Partial<{
    [Key in keyof Values]: (
      value: Values[Key],
      values: Values,
      path: string
    ) => ReactNode
  }>,
  values: Values
): {
  hasError: boolean
  error: ReactNode
} {
  const results = validateValues(rules, values)
  const pathInError = Object.keys(results.errors).find(
    (errorKey) => errorKey === path
  )
  return {
    hasError: !!pathInError,
    error: pathInError ? results.errors[pathInError as keyof Values] : null,
  }
}

export function useForm<Values = Record<string, unknown>>({
  initialValues,
  validate: rules,
  validateInputOnChange,
  validateInputOnBlur,
}: {
  initialValues: Values
  validate?: Partial<{
    [Key in keyof Values]: (
      value: Values[Key],
      values: Values,
      path: string
    ) => ReactNode
  }>
  validateInputOnChange?: boolean
  validateInputOnBlur?: boolean
}) {
  const [values, _setValues] = useState<Values>(initialValues)
  const [errors, _setErrors] = useState<Record<string, ReactNode>>({})

  const setErrors: SetErrors = useCallback(
    (errs) =>
      _setErrors((current) =>
        typeof errs === 'function' ? errs(current) : errs
      ),
    []
  )

  const setFieldError: SetFieldError<Values> = useCallback(
    (path, error) => setErrors((current) => ({ ...current, [path]: error })),
    [setErrors]
  )

  const clearFieldError: ClearFieldError<Values> = useCallback(
    (path) =>
      setErrors((current) => {
        const clone = { ...current }
        delete clone[path as string]
        return clone
      }),
    [setErrors]
  )

  const setFieldValue: SetFieldValue<Values> = useCallback(
    (path, value) => {
      const shouldValidate = validateInputOnChange && !!rules
      _setValues((current) => {
        const result: Values = klona(current)!
        result[path as keyof Values] = value
        if (shouldValidate) {
          const validationResults = validateFieldValue(path, rules, result)
          validationResults.hasError
            ? setFieldError(path, validationResults.error)
            : clearFieldError(path)
        }
        return result
      })
      !shouldValidate && setFieldError(path, null)
    },
    [clearFieldError, rules, setFieldError, validateInputOnChange]
  )

  const clearErrors: () => void = useCallback(() => _setErrors({}), [])
  const reset: () => void = useCallback(() => {
    _setValues(initialValues)
    clearErrors()
  }, [clearErrors, initialValues])

  const validate: () => FormValidationResult = useCallback(() => {
    if (!rules) {
      return {
        hasErrors: false,
        errors: {},
      }
    }
    const results = validateValues(rules, values)
    _setErrors(results.errors)
    return results
  }, [values, rules])

  const getInputProps: GetInputProps<Values> = (
    path,
    { type = 'input', withError = type === 'input' } = {}
  ) => {
    const value = type !== 'checkbox' && values ? values[path] : undefined
    const checked = type === 'checkbox' && values ? values[path] : undefined
    const onChange = getInputOnChange((value) =>
      setFieldValue(path, value as any)
    )
    const error = withError ? errors[path as string] : undefined
    const onBlur = () => {
      const shouldValidate = validateInputOnBlur && !!rules
      if (shouldValidate) {
        const validationResults = validateFieldValue(path, rules, values)
        validationResults.hasError
          ? setFieldError(path, validationResults.error)
          : clearFieldError(path)
      }
    }
    return {
      value,
      checked,
      onChange,
      error,
      onBlur,
    }
  }

  const onSubmit: OnSubmit<Values> =
    (handleSubmit, handleValidationFailure) => (event) => {
      event?.preventDefault()
      const results = validate()
      if (results.hasErrors) {
        handleValidationFailure?.(results.errors, values, event)
      } else {
        handleSubmit(values, event)
      }
    }

  return {
    values,
    errors,
    setFieldValue,
    setFieldError,
    clearFieldError,
    clearErrors,
    reset,
    validate,
    getInputProps,
    onSubmit,
  }
}
