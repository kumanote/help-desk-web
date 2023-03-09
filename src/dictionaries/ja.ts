const dictionary = {
  submit: '送信',
  save: '保存',
  reset: 'リセット',
  close: '閉じる',
  back: '戻る',
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
  menu: 'メニュー',
  types: {
    workspace: {
      name: 'ワークスペース名',
    },
    agent: {
      name: '名前',
      email: 'メールアドレス',
    },
  },
  navigations: {
    dashboard: 'ダッシュボード',
    inquiry: 'お問合せ',
    faq: 'FAQ',
    announcement: 'お知らせ',
    workspace: 'システム設定',
    profile: 'プロフィール',
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
    network:
      'サーバーに正しく接続することができませんでした。再度やり直してください。',
    required: 'この項目は必須です。',
    too_short: 'この項目は{0}文字以上で入力してください。',
    too_long: 'この項目は{0}文字以下で入力してください。',
    invalid_email_format: 'メールアドレスの形式が正しくありません。',
    invalid_password_format:
      'パスワードは半角英数記号を使い6〜32文字の間で入力して下さい。',
    password_confirmation_must_match: '確認用のパスワードが一致しません。',
  },
}

export default dictionary
