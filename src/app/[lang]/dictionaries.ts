import 'server-only'

const dictionaries = {
  en: () => import('@/dictionaries/en').then((module) => module.default),
  ja: () => import('@/dictionaries/ja').then((module) => module.default),
  vi: () => import('@/dictionaries/vi').then((module) => module.default),
}

export function getDictionary(language: string) {
  switch (language) {
    case 'ja':
      return dictionaries.ja()
    case 'vi':
      return dictionaries.vi()
    default:
      return dictionaries.en()
  }
}
