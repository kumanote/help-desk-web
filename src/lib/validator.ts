import GraphemeSplitter from 'grapheme-splitter'

type ValidationResult = string | null

function stringFormat(template: string, ...args: any[]) {
  return template.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] !== 'undefined' ? args[number] : match
  })
}

function validateString({
  value,
  required,
  minLength,
  maxLength,
  dict,
}: {
  value: string
  required: boolean
  minLength?: number
  maxLength?: number
  dict: any
}): ValidationResult {
  if (!value) {
    if (required) {
      return dict.validations.required
    } else {
      return null
    }
  }
  const splitter = new GraphemeSplitter()
  const valueLength = splitter.countGraphemes(value)
  if (minLength && valueLength < minLength) {
    return stringFormat(dict.validations.too_short, [minLength])
  }
  if (maxLength && valueLength > maxLength) {
    return stringFormat(dict.validations.too_long, [maxLength])
  }
  return null
}

export function validateWorkspaceName({
  value,
  dict,
}: {
  value: string
  dict: any
}): ValidationResult {
  return validateString({
    value,
    required: true,
    minLength: 3,
    maxLength: 50,
    dict,
  })
}

export function validateAgentName({
  value,
  required,
  dict,
}: {
  value: string
  required: boolean
  dict: any
}): ValidationResult {
  return validateString({
    value,
    required,
    minLength: 3,
    maxLength: 50,
    dict,
  })
}

export function validateEmail({
  value,
  required,
  dict,
}: {
  value: string
  required: boolean
  dict: any
}): ValidationResult {
  if (required && !value) {
    return dict.validations.required
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return dict.validations.invalid_email_format
  }
  return null
}

export function validatePassword({
  value,
  dict,
}: {
  value: string
  dict: any
}): ValidationResult {
  if (!value) {
    return dict.validations.required
  }
  if (!/^[a-zA-Z0-9!#$&*-@]{6,32}$/.test(value)) {
    return dict.validations.invalid_password_format
  }
  return null
}

export function validatePasswordConfirmation({
  confirmation,
  password,
  dict,
}: {
  confirmation: string
  password: string
  dict: any
}): ValidationResult {
  if (!confirmation) {
    return dict.validations.required
  }
  if (confirmation !== password) {
    return dict.validations.password_confirmation_must_match
  }
  return null
}
