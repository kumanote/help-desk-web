const dictionary = {
  submit: 'submit',
  save: 'save',
  reset: 'reset',
  close: 'close',
  back: 'back',
  add: 'add',
  remove: 'remove',
  edit: 'edit',
  cancel: 'cancel',
  email: 'email',
  password: 'password',
  current_password: 'current password',
  new_password: 'new password',
  password_for_confirmation: 'password for confirmation',
  login: 'sign in',
  logout: 'sign out',
  no_data_found: 'No data found',
  menu: 'menu',
  types: {
    workspace: {
      name: 'workspace name',
    },
    agent: {
      name: 'name',
      email: 'email address',
    },
    faq_settings: {
      home_url: 'home url',
      home_url_help:
        'You can specify the URL for end users to return from FAQ site.',
      supported_locales: 'languages',
      supported_locales_help: 'You can set multiple languages for FAQ site.',
    },
    faq_category: {
      slug: 'slug',
      slug_help: 'Slug will become part of the URL for this category',
      display_order: 'display order',
    },
    faq_category_content: {
      locale: 'language',
      title: 'title',
    },
  },
  navigations: {
    dashboard: 'dashboard',
    inquiry: 'inquiry',
    faq: 'FAQ',
    announcement: 'announcement',
    workspace: 'system settings',
    profile: 'profile',
    faq_features: {
      item: {
        title: 'Article',
        description: 'You can edit FAQ articles.',
      },
      category: {
        title: 'Category',
        description: 'You can edit FAQ categories.',
        search: {
          title: 'FAQ categories',
        },
        new: {
          title: 'Add new FAQ category',
        },
      },
      admin: {
        title: 'Admin',
        description: 'You can manage FAQ system settings',
      },
    },
    settings: {
      profile: {
        title: 'profile',
        description: 'You can edit your profile.',
      },
      security: {
        title: 'security',
        description: 'You can edit your password.',
      },
      language: {
        title: 'language',
        description: 'You can switch languages.',
      },
    },
  },
  faq: {
    title: 'FAQ',
    no_available_locale_warning: {
      title: 'The locale settings has not been initialized',
      description:
        'When using the FAQ function, it is necessary to configure the FAQ system settings and set the language to be used in advance.',
      nav_label: 'Navigate me to system settings',
    },
    create_category_succeeded:
      'FAQ category has been created completely successfully.',
    update_settings_succeeded:
      'FAQ system settings has been saved completely successfully.',
  },
  settings: {
    title: 'account settings',
    update_profile_succeeded:
      'Profile information has been saved completely successfully.',
    change_password_succeeded:
      'New password has been saved completely successfully.',
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
    contains_error: 'There are input errors. Please confirm the contents.',
    network: 'Could not connect to the server properly. Please try again.',
    required: 'This field is required.',
    too_short: 'Provide this field at least {0} characters.',
    too_long: 'Provide this field within {0} characters.',
    invalid_email_format: 'Email address is not in valid format.',
    invalid_password_format:
      'Password mut be 6 to 32 letters using half-width English letters, numbers and symbols.',
    password_confirmation_must_match:
      'Password for confirmation dose not match',
    invalid_url_format: 'URL is not in valid format.',
    invalid_slug_format:
      'Slug must be 3 to 55 letters using alphanumeric characters, underscores (_) and hyphens (-).',
  },
}

export default dictionary
