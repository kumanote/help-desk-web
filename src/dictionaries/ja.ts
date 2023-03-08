const dictionary = {
  submit: '送信',
  email: 'メールアドレス',
  password: 'パスワード',
  login: 'ログイン',
  logout: 'ログアウト',
  types: {
    workspace: {
      name: 'ワークスペース名',
    },
  },
  navigations: {
    dashboard: 'ダッシュボード',
    inquiry: 'お問合せ',
    faq: 'FAQ',
    announcement: 'お知らせ',
    workspace: 'システム設定',
    profile: 'プロフィール',
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
  },
}

export default dictionary
