import { Dictionary } from './interface'

const dictionary: Dictionary = {
  submit: 'submit',
  save: 'save',
  reset: 'reset',
  close: 'close',
  back: 'back',
  add: 'add',
  remove: 'remove',
  edit: 'edit',
  cancel: 'cancel',
  select: 'select',
  email: 'email',
  password: 'password',
  current_password: 'current password',
  new_password: 'new password',
  password_for_confirmation: 'password for confirmation',
  login: 'sign in',
  logout: 'sign out',
  no_data_found: 'No data found',
  menu: 'menu',
  publish: 'publish',
  public: 'public',
  draft: 'draft',
  enabled: 'enabled',
  disabled: 'disabled',
  types: {
    workspace: {
      name: 'workspace name',
    },
    agent: {
      name: 'name',
      email: 'email address',
    },
    inquiry_settings: {
      line: {
        title: 'Line settings',
        enabled: 'Enable Line',
        friend_url: 'Line friend URL',
        friend_qr_code_url: 'Line friend QR code URL',
      },
      notification: {
        title: 'Notification settings',
        slack_webhook_url: 'Slack webhook URL',
      },
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
      slug_help: 'Slug will become part of the URL for this category.',
      display_order: 'display order',
    },
    faq_category_content: {
      locale: 'language',
      title: 'title',
    },
    faq_item: {
      slug: 'slug',
      slug_help: 'Slug will become part of the URL for this article.',
      category: 'category',
      publish_status: 'status',
    },
    faq_item_content: {
      locale: 'language',
      title: 'title',
      body: 'body',
    },
  },
  navigations: {
    dashboard: 'dashboard',
    inquiry: 'inquiry',
    faq: 'FAQ',
    announcement: 'announcement',
    workspace: 'system settings',
    profile: 'profile',
    inquiry_features: {
      thread: {
        title: 'Inquiry',
        description: 'You can view and respond inquiry details.',
        search: {
          title: 'Inquiries',
        },
        detail: {
          title: 'Inquiry details',
        },
      },
      contact: {
        title: 'Contacts',
        description: 'You can view contact details.',
        search: {
          title: 'Contacts',
        },
        detail: {
          title: 'Contact details',
        },
      },
      admin: {
        title: 'Admin',
        description: 'You can manage Inquiry system settings',
      },
    },
    faq_features: {
      item: {
        title: 'Article',
        description: 'You can edit FAQ articles.',
        search: {
          title: 'FAQ articles',
        },
        new: {
          title: 'Add new FAQ article',
        },
        detail: {
          title: 'FAQ article details',
        },
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
        detail: {
          title: 'FAQ category details',
          search_items: 'FAQ articles',
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
  inquiry: {
    title: 'Inquiry',
    settings_not_initialized_warning: {
      title: 'The inquiry system settings has not been initialized.',
      description:
        'When using the Inquiry function, it is necessary to configure the Inquiry system settings in advance.',
      nav_label: 'Navigate me to system settings',
    },
    update_settings_succeeded:
      'inquiry system settings has been saved completely successfully.',
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
    update_category_succeeded:
      'FAQ category has been saved completely successfully.',
    delete_category: {
      confirm_title: 'Delete FAQ category',
      confirm_description: 'Are you sure you want to delete this FAQ category?',
      succeeded: 'FAQ category has been deleted completely successfully.',
    },
    reorder_category_succeeded:
      'FAQ categories have been reordered successfully.',
    reorder_item_succeeded: 'FAQ articles have been reordered successfully.',
    create_item_succeeded:
      'FAQ article has been saved completely successfully.',
    update_item_succeeded:
      'FAQ article has been saved completely successfully.',
    delete_item: {
      confirm_title: 'Delete FAQ article',
      confirm_description: 'Are you sure you want to delete this FAQ article?',
      succeeded: 'FAQ article has been deleted completely successfully.',
    },
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
