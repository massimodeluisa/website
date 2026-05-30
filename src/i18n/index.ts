import { computed, ref, watch } from 'vue'

import i18next from 'i18next'

import { en } from './locales/en'
import { it } from './locales/it'
import { ja } from './locales/ja'
import { ru } from './locales/ru'
import { uk } from './locales/uk'

export type TLocaleCode = 'en' | 'it' | 'ja' | 'ru' | 'uk'

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
  lng: 'en',
  fallbackLng: 'en',
  supportedLngs: ['en', 'it', 'ja', 'ru', 'uk'],
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

const currentLocale = ref<TLocaleCode>('en')

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
