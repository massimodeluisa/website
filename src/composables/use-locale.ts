import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useI18n, type TLocaleCode } from '@/i18n'

const NON_DEFAULT_LOCALES = ['it', 'ja', 'ru', 'uk'] as const

export function useLocale() {
  const route = useRoute()
  const i18n = useI18n()

  const current = computed<TLocaleCode>(() => {
    const param = route.params.locale
    if (typeof param === 'string' && (NON_DEFAULT_LOCALES as readonly string[]).includes(param)) {
      return param as TLocaleCode
    }
    return 'en'
  })

  const prefix = computed(() => (current.value === 'en' ? '' : `/${current.value}`))

  const localePath = (path: string, target?: TLocaleCode) => {
    const code = target ?? current.value
    const tail = path.startsWith('/') ? path : `/${path}`
    if (code === 'en') {
      return tail === '/' ? '/' : tail
    }
    return `/${code}${tail === '/' ? '' : tail}`
  }

  const localeAlternates = (path: string) => {
    const all: TLocaleCode[] = ['en', 'it', 'ja', 'ru', 'uk']
    return all.map((code) => ({ code, href: localePath(path, code) }))
  }

  return {
    current,
    prefix,
    localePath,
    localeAlternates,
    setLocale: i18n.setLocale,
    availableLocales: i18n.availableLocales,
  }
}
