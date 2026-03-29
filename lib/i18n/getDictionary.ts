// lib/i18n/getDictionary.ts
import 'server-only'

const dictionaries = {
  en: () => import('../../dictionaries/en.json').then((m) => m.default),
}

export type Locale = keyof typeof dictionaries

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]()
}
