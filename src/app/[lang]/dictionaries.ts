import 'server-only'

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  ja: () => import('@/dictionaries/ja.json').then((module) => module.default),
  vi: () => import('@/dictionaries/vi.json').then((module) => module.default),
}

export const getDictionary = async (locale: string) => {
  switch (locale) {
    case 'ja':
      return dictionaries.ja()
    case 'vi':
      return dictionaries.vi()
    default:
      return dictionaries.en()
  }
}
