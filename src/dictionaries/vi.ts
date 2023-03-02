const dictionary = {
  submit: 'submit',
  email: 'email',
  password: 'password',
  login: 'sign in',
  types: {
    workspace: {
      name: 'workspace name',
    },
  },
  welcome: {
    title: 'chào mừng',
    subtitle: "Let's initialize your workspace and create a 'root' user.",
    first_agent: {
      name: 'root user name',
      email: 'root user email address',
      password: 'root user password',
    },
    initialized: 'Your workspace has been initialized successfully!',
  },
  validations: {
    network: 'Could not connect to the server properly. Please try again.',
    required: 'This field is required.',
    too_short: 'Provide this field at least {0} characters.',
    too_long: 'Provide this field within {0} characters.',
    invalid_email_format: 'Email address is not in valid format.',
    invalid_password_format:
      'Password mut be 6 to 32 letters using half-width English letters, numbers and symbols.',
  },
}

export default dictionary
