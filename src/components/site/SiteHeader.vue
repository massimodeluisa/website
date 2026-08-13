<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { useActiveSection } from '@/composables/use-scroll-spy'
import { useLocale } from '@/composables/use-locale'
import { useScrollProgress } from '@/composables/use-scroll-progress'
import { useI18n } from '@/i18n'
import LanguageSwitcher from './LanguageSwitcher.vue'
import SiteHeaderNav from './SiteHeaderNav.vue'
import SiteUtilityBar from './SiteUtilityBar.vue'

// MARK: - Composables

const route = useRoute()
const { t } = useI18n()
const { localePath } = useLocale()
const { activeSection } = useActiveSection()
const { progress: headerProgress } = useScrollProgress()

// MARK: - Computed

// The house icon lights bronze when the home page's #home section is active.
const homeActive = computed(() => {
  const name = String(route.name ?? '')
  return (name === 'home' || name === 'locale.home') && activeSection.value === 'home'
})
</script>

<template lang="pug">
header.fixed.inset-x-0.top-0.z-50.pointer-events-none(
  :style="{ '--header-progress': headerProgress }"
)
  .mx-auto.flex.flex-col(
    class="mt-[calc(var(--header-progress,0)*var(--spacing)*4)] w-[calc(100%_-_var(--header-progress,0)*var(--spacing)*8)]"
  )
    .pointer-events-auto.flex.items-center.gap-8.border(
      class="py-1.5 sm:py-2.5 px-1.5 sm:px-2.5 rounded-[calc(var(--header-progress,0)*var(--spacing)*4)] border-[color-mix(in_oklab,var(--site-border)_calc(var(--header-progress,0)*100%),transparent)] bg-[color-mix(in_oklab,var(--site-background)_calc(var(--header-progress,0)*88%),transparent)] backdrop-blur-[calc(var(--header-progress,0)*16px)]"
    )
      RouterLink.flex.size-11.shrink-0.items-center.justify-center.text-3xl.font-bold.leading-none.transition-colors(
        :to="localePath('/')"
        :aria-label="t('nav.home')"
        class="-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-site-secondary"
        :class="{ 'text-site-secondary': homeActive }"
      ) &#8962;

      LanguageSwitcher.my-auto(class="hidden md:block")

      SiteHeaderNav

    SiteUtilityBar(:header-progress="headerProgress")
</template>
