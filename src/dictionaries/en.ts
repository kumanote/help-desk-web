const dictionary = {
  submit: 'submit',
  types: {
    workspace: {
      name: 'workspace name',
    },
  },
  welcome: {
    title: 'welcome',
    subtitle: "Let's initialize your workspace and create a 'root' user.",
    first_agent: {
      name: 'root user name',
      email: 'root user email address',
      password: 'root user password',
    },
  },
  validations: {
    required: 'This field is required.',
    too_short: 'Provide this field at least {0} characters.',
    too_long: 'Provide this field within {0} characters.',
    invalid_email_format: 'Email address is not in valid format.',
    invalid_password_format:
      'Password mut be 6 to 32 letters using half-width English letters, numbers and symbols.',
  },
}

export default dictionary
