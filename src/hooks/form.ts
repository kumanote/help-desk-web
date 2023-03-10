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
  path: any,
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
export type FormErrors = Record<string, ReactNode>
type FormValidationResult = {
  hasErrors: boolean
  errors: FormErrors
}

type Rule<Value, Values> = (
  value: Value,
  values: Values,
  path: string
) => ReactNode
type FormRulesRecord<Values, InitValues = Values> = Partial<{
  [Key in keyof Values]: FormRule<Values[Key], InitValues>
}>
type FormRule<Value, Values> = NonNullable<Value> extends Array<infer ListValue>
  ?
      | Partial<{
          [Key in keyof ListValue]: ListValue[Key] extends Array<
            infer NestedListItem
          >
            ? FormRulesRecord<NestedListItem> | Rule<ListValue[Key], Values>
            : FormRulesRecord<ListValue[Key]> | Rule<ListValue[Key], Values>
        }>
      | Rule<Value, Values>
  : NonNullable<Value> extends Map<any, infer MapValue>
  ? FormRulesRecord<MapValue> | Rule<Value, Values>
  : NonNullable<Value> extends Record<string, any>
  ? FormRulesRecord<Value, Values> | Rule<Value, Values>
  : Rule<Value, Values>
type FormValidateInput<Values> =
  | FormRulesRecord<Values>
  | ((values: Values) => FormErrors)

type SetErrors = Dispatch<SetStateAction<FormErrors>>
type SetFieldValue<Values> = (path: any, value: Values[keyof Values]) => void
type SetFieldError<Values> = (path: any, error: ReactNode) => void
type ClearFieldError<Values> = (path: any | string) => void
type OnSubmit<Values> = (
  handleSubmit: (values: Values, event?: FormEvent<HTMLFormElement>) => void,
  handleValidationFailure?: (
    errors: FormErrors,
    values: Values,
    event?: FormEvent<HTMLFormElement>
  ) => void
) => (event?: FormEvent<HTMLFormElement>) => void

function getValueByPath<Values>({
  path,
  values,
}: {
  path: any
  values: Values
}): unknown {
  const paths = typeof path === 'string' ? path.split('.') : []
  if (paths.length === 0 || typeof values !== 'object' || values === null) {
    return undefined
  }
  let value: any = values[paths[0] as keyof Values]
  for (let i = 1; i < paths.length; i += 1) {
    if (value === undefined) break
    if (value instanceof Map) {
      value = value.get(paths[i])
    } else {
      value = value ? value[paths[i]] : undefined
    }
  }
  return value
}

function setValuesByPath<Values>({
  path,
  value,
  values,
}: {
  path: any
  value: any
  values: Values
}) {
  const paths = typeof path === 'string' ? path.split('.') : []
  if (paths.length === 0) {
    return values
  }
  const cloned = klona(values)
  if (paths.length === 1) {
    cloned[paths[0] as keyof Values] = value
    return cloned
  }
  let val: any = cloned[paths[0] as keyof Values]
  for (let i = 1; i < paths.length - 1; i += 1) {
    if (val === undefined) {
      return cloned
    }
    if (val instanceof Map) {
      val = val.get(paths[i])
    } else {
      val = val ? val[paths[i]] : undefined
    }
  }
  if (val instanceof Map) {
    val.set(paths[paths.length - 1], value)
  } else {
    val[paths[paths.length - 1]] = value
  }
  return cloned
}

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

function validateRulesRecord<Values>(
  rules: FormRulesRecord<Values>,
  values: Values,
  path: string = '',
  errors: FormErrors = {}
) {
  Object.keys(rules).reduce((acc, ruleKey) => {
    const rule = rules[ruleKey]
    const rulePath = `${path === '' ? '' : `${path}.`}${ruleKey}`
    if (!!rule) {
      // if validation rule is well-defined
      const value: any = getValueByPath({ path: rulePath, values })
      if (typeof rule === 'function') {
        const checked = rule(value, values, rulePath)
        if (checked !== undefined && checked !== null && checked !== false) {
          // only if the check result is defined, not null, and not false, then inject the reuslt
          acc[rulePath] = checked
        }
      } else if (typeof rule === 'object' && Array.isArray(value)) {
        value.forEach((_item, index) =>
          validateRulesRecord(rule, values, `${rulePath}.${index}`, acc)
        )
      } else if (value instanceof Map) {
        value.forEach((value, key) =>
          validateRulesRecord(rule, values, `${rulePath}.${key}`, acc)
        )
      } else if (
        typeof rule === 'object' &&
        typeof value === 'object' &&
        value !== null
      ) {
        validateRulesRecord(rule, values, rulePath, acc)
      }
    }
    return acc
  }, errors)
}

function validateValues<Values>(
  rules: FormValidateInput<Values>,
  values: Values
): FormValidationResult {
  if (typeof rules === 'function') {
    const errors = rules(values)
    return {
      hasErrors: Object.keys(errors).length > 0,
      errors,
    }
  }
  const errors: FormErrors = {}
  validateRulesRecord(rules, values, '', errors)
  return {
    hasErrors: Object.keys(errors).length > 0,
    errors,
  }
}

function validateFieldValue<Values>(
  path: any,
  rules: FormValidateInput<Values>,
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
  validate?: FormValidateInput<Values>
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
        const result = setValuesByPath({ path, value, values: current })
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
    const value =
      type !== 'checkbox' ? getValueByPath({ path, values }) : undefined
    const checked =
      type === 'checkbox' ? getValueByPath({ path, values }) : undefined
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
