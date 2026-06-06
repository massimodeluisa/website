import { computed, ref, watch } from 'vue'

import i18next from 'i18next'

import { en } from './locales/en'
import { it } from './locales/it'
import { ja } from './locales/ja'
import { ru } from './locales/ru'
import { uk } from './locales/uk'

// MARK: - Locale catalog

/* Single source of truth for locale codes; the union type and every locale-aware
   regex/list across the app derive from this tuple. */
export const SUPPORTED_LOCALES = ['en', 'it', 'ja', 'ru', 'uk'] as const
export type TLocaleCode = (typeof SUPPORTED_LOCALES)[number]
export const DEFAULT_LOCALE: TLocaleCode = 'en'
export const NON_DEFAULT_LOCALES: readonly TLocaleCode[] = SUPPORTED_LOCALES.filter(
  (code) => code !== DEFAULT_LOCALE,
)

const LOCALE_STORAGE_KEY = 'mdl:locale'

const availableLocales: { code: TLocaleCode; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'it', label: 'IT' },
  { code: 'ja', label: 'JP' },
  { code: 'ru', label: 'RU' },
  { code: 'uk', label: 'UK' },
]

/* i18next owns lookup and interpolation; every locale is bundled as a resource. */
void i18next.init({
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: [...SUPPORTED_LOCALES],
  resources: {
    en: { translation: en },
    it: { translation: it },
    ja: { translation: ja },
    ru: { translation: ru },
    uk: { translation: uk },
  },
  interpolation: { escapeValue: false },
  returnNull: false,
  initAsync: false,
})

const currentLocale = ref<TLocaleCode>(DEFAULT_LOCALE)

function setLocale(code: TLocaleCode) {
  if (!availableLocales.some((entry) => entry.code === code)) {
    return
  }
  void i18next.changeLanguage(code)
  currentLocale.value = code
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCALE_STORAGE_KEY, code)
    document.documentElement.lang = code
  }
}

/* The locale persisted by a previous manual switch, if still supported. */
export function storedLocale(): TLocaleCode | null {
  if (typeof window === 'undefined') {
    return null
  }
  const value = localStorage.getItem(LOCALE_STORAGE_KEY)
  return availableLocales.some((entry) => entry.code === value) ? (value as TLocaleCode) : null
}

/* First supported language from the browser's preference list, else the default. */
export function browserLocale(): TLocaleCode {
  if (typeof navigator === 'undefined') {
    return DEFAULT_LOCALE
  }
  const list = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const entry of list) {
    const code = entry.toLowerCase().split('-')[0]
    if (availableLocales.some((l) => l.code === code)) {
      return code as TLocaleCode
    }
  }
  return DEFAULT_LOCALE
}

/* A manual choice always wins over browser auto-detection. */
export function preferredLocale(): TLocaleCode {
  return storedLocale() ?? browserLocale()
}

/* Touches currentLocale so templates re-render on switch, and pins i18next to it. */
function t(key: string, fallback?: string): string {
  const lng = currentLocale.value
  const value: unknown = i18next.t(key, { lng, defaultValue: fallback })
  return typeof value === 'string' ? value : key
}

export function useI18n() {
  const locale = computed(() => currentLocale.value)

  watch(currentLocale, (code) => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = code
    }
  })

  return { t, locale, setLocale, availableLocales }
}

export { t as translate, setLocale as setGlobalLocale, availableLocales }
