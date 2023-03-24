export interface Dictionary {
  submit: string
  save: string
  reset: string
  close: string
  back: string
  add: string
  remove: string
  edit: string
  cancel: string
  select: string
  email: string
  password: string
  current_password: string
  new_password: string
  password_for_confirmation: string
  login: string
  logout: string
  no_data_found: string
  menu: string
  publish: string
  public: string
  draft: string
  types: {
    workspace: {
      name: string
    }
    agent: {
      name: string
      email: string
    }
    faq_settings: {
      home_url: string
      home_url_help: string
      supported_locales: string
      supported_locales_help: string
    }
    faq_category: {
      slug: string
      slug_help: string
      display_order: string
    }
    faq_category_content: {
      locale: string
      title: string
    }
    faq_item: {
      slug: string
      slug_help: string
      category: string
      publish_status: string
    }
    faq_item_content: {
      locale: string
      title: string
      body: string
    }
  }
  navigations: {
    dashboard: string
    inquiry: string
    faq: string
    announcement: string
    workspace: string
    profile: string
    faq_features: {
      item: {
        title: string
        description: string
        search: {
          title: string
        }
        new: {
          title: string
        }
        detail: {
          title: string
        }
      }
      category: {
        title: string
        description: string
        search: {
          title: string
        }
        new: {
          title: string
        }
        detail: {
          title: string
          search_items: string
        }
      }
      admin: {
        title: string
        description: string
      }
    }
    settings: {
      profile: {
        title: string
        description: string
      }
      security: {
        title: string
        description: string
      }
      language: {
        title: string
        description: string
      }
    }
  }
  faq: {
    title: string
    no_available_locale_warning: {
      title: string
      description: string
      nav_label: string
    }
    create_category_succeeded: string
    update_category_succeeded: string
    delete_category: {
      confirm_title: string
      confirm_description: string
      succeeded: string
    }
    reorder_category_succeeded: string
    reorder_item_succeeded: string
    create_item_succeeded: string
    update_item_succeeded: string
    delete_item: {
      confirm_title: string
      confirm_description: string
      succeeded: string
    }
    update_settings_succeeded: string
  }
  settings: {
    title: string
    update_profile_succeeded: string
    change_password_succeeded: string
  }
  welcome: {
    title: string
    subtitle: string
    first_agent: {
      name: string
      email: string
      password: string
    }
    initialized: string
  }
  validations: {
    contains_error: string
    network: string
    required: string
    too_short: string
    too_long: string
    invalid_email_format: string
    invalid_password_format: string
    password_confirmation_must_match: string
    invalid_url_format: string
    invalid_slug_format: string
  }
}
