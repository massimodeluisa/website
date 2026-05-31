<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

import type { TLocaleCode } from '@/i18n'
import { useI18n } from '@/i18n'
import { useLocale } from '@/composables/use-locale'

// MARK: - Composables

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { current, localePath, availableLocales } = useLocale()

// MARK: - Methods

const pathWithoutLocale = () => {
  const path = route.path
  const segments = path.split('/').filter(Boolean)
  if (segments.length === 0) {
    return '/'
  }
  if (['it', 'ja', 'ru', 'uk'].includes(segments[0]!)) {
    // Dropping the locale segment leaves '/' when nothing follows it.
    return `/${segments.slice(1).join('/')}`
  }
  return path
}

const switchTo = (code: TLocaleCode) => {
  if (code === current.value) {
    return
  }
  router.push(localePath(pathWithoutLocale(), code) + (route.hash ?? ''))
}

const isActive = (code: TLocaleCode) => current.value === code

const buttonClasses = (code: TLocaleCode) => {
  const base = 'px-2 py-0.5 rounded-full transition-colors text-[10px]'
  if (isActive(code)) {
    return `${base} bg-site-secondary text-site-background font-semibold`
  }
  return `${base} text-site-muted hover:text-site-heading hover:bg-site-border/60`
}
</script>

<template lang="pug">
div(
  class="flex items-center gap-px rounded-full border border-site-border p-0.5 font-mono uppercase backdrop-blur bg-site-surface/60 text-[10px] tracking-[0.16em]"
  role="group"
  :aria-label="t('lang.switchTo')"
)
  button(
    v-for="l in availableLocales"
    :key="l.code"
    type="button"
    :aria-pressed="isActive(l.code)"
    :class="buttonClasses(l.code)"
    @click="switchTo(l.code)"
  ) {{ l.label }}
</template>
