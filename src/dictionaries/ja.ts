const dictionary = {
  submit: '送信',
  save: '保存',
  reset: 'リセット',
  close: '閉じる',
  back: '戻る',
  add: '追加',
  remove: '削除',
  edit: '編集',
  cancel: 'キャンセル',
  email: 'メールアドレス',
  password: 'パスワード',
  current_password: '現在のパスワード',
  new_password: '新しいパスワード',
  password_for_confirmation: '新しいパスワード確認用',
  login: 'ログイン',
  logout: 'ログアウト',
  no_data_found: '検索結果がありません。',
  menu: 'メニュー',
  types: {
    workspace: {
      name: 'ワークスペース名',
    },
    agent: {
      name: '名前',
      email: 'メールアドレス',
    },
    faq_settings: {
      home_url: 'サービスURL',
      home_url_help:
        'エンドユーザーがFAQのサイトから戻る際のURLを指定できます。',
      supported_locales: '使用する言語',
      supported_locales_help: 'FAQのサイトで利用する言語を複数設定できます。',
    },
    faq_category: {
      slug: 'スラグ',
      slug_help:
        'スラグはこのカテゴリの記事を公開する場合のURLの一部に利用されます。',
      display_order: '表示順',
    },
    faq_category_content: {
      locale: '言語',
      title: 'タイトル',
    },
  },
  navigations: {
    dashboard: 'ダッシュボード',
    inquiry: 'お問合せ',
    faq: 'FAQ',
    announcement: 'お知らせ',
    workspace: 'システム設定',
    profile: 'プロフィール',
    faq_features: {
      item: {
        title: '記事',
        description: 'FAQの記事を編集できます。',
      },
      category: {
        title: 'カテゴリ',
        description: 'FAQのカテゴリを編集できます。',
        search: {
          title: 'FAQカテゴリ一覧',
        },
        new: {
          title: 'FAQカテゴリ新規作成',
        },
        detail: {
          title: 'FAQカテゴリ詳細',
        },
      },
      admin: {
        title: '管理',
        description: 'FAQのシステム設定を管理できます。',
      },
    },
    settings: {
      profile: {
        title: 'プロフィール',
        description: 'プロフィールを変更できます。',
      },
      security: {
        title: 'セキュリティ',
        description: 'パスワードを変更できます。',
      },
      language: {
        title: '言語',
        description: '表示用の言語を切り替えられます。',
      },
    },
  },
  faq: {
    title: 'FAQ',
    no_available_locale_warning: {
      title: 'FAQで使用する言語の設定が完了していません',
      description:
        'FAQの機能を利用する際は、事前にFAQのシステム設定を行い、使用する言語を設定する必要があります。',
      nav_label: 'FAQシステム設定に移動',
    },
    create_category_succeeded: 'FAQカテゴリを作成しました。',
    update_category_succeeded: 'FAQカテゴリを保存しました。',
    update_settings_succeeded: 'FAQシステム設定を保存しました。',
  },
  settings: {
    title: 'アカウント設定',
    update_profile_succeeded: 'プロフィール情報を保存しました。',
    change_password_succeeded: 'パスワードが変更されました。',
  },
  welcome: {
    title: 'welcome',
    subtitle:
      'システムの初期化とルートユーザー\n（管理者となる初回ログインユーザー）の作成を行います。',
    first_agent: {
      name: 'ルートユーザー・氏名',
      email: 'ルートユーザー・メールアドレス',
      password: 'ルートユーザー・パスワード',
    },
    initialized: 'システムの初期化が完了しました!',
  },
  validations: {
    contains_error: '入力エラーが含まれています。内容を確認してください。',
    network:
      'サーバーに正しく接続することができませんでした。再度やり直してください。',
    required: 'この項目は必須です。',
    too_short: 'この項目は{0}文字以上で入力してください。',
    too_long: 'この項目は{0}文字以下で入力してください。',
    invalid_email_format: 'メールアドレスの形式が正しくありません。',
    invalid_password_format:
      'パスワードは半角英数記号を使い6〜32文字の間で入力して下さい。',
    password_confirmation_must_match: '確認用のパスワードが一致しません。',
    invalid_url_format: 'URLの形式が正しくありません。',
    invalid_slug_format:
      'スラグは英数、アンダーバー(_)、ハイフン(-)を使い、3〜55文字で入力してください。',
  },
}

export default dictionary
