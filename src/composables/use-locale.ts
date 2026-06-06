import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { NON_DEFAULT_LOCALES, SUPPORTED_LOCALES, useI18n, type TLocaleCode } from '@/i18n'

// MARK: - Composable

export function useLocale() {
  // MARK: - Variables

  const route = useRoute()
  const i18n = useI18n()

  // MARK: - Computed

  const current = computed<TLocaleCode>(() => {
    const param = route.params.locale
    if (typeof param === 'string' && (NON_DEFAULT_LOCALES as readonly string[]).includes(param)) {
      return param as TLocaleCode
    }
    return 'en'
  })

  const prefix = computed(() => (current.value === 'en' ? '' : `/${current.value}`))

  // MARK: - Methods

  const localePath = (path: string, target?: TLocaleCode) => {
    const code = target ?? current.value
    const tail = path.startsWith('/') ? path : `/${path}`
    if (code === 'en') {
      return tail === '/' ? '/' : tail
    }
    return `/${code}${tail === '/' ? '' : tail}`
  }

  const localeAlternates = (path: string) =>
    SUPPORTED_LOCALES.map((code) => ({ code, href: localePath(path, code) }))

  return {
    current,
    prefix,
    localePath,
    localeAlternates,
    setLocale: i18n.setLocale,
    availableLocales: i18n.availableLocales,
  }
}
