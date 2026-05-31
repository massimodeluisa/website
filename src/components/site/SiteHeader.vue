<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { useActiveSection } from '@/composables/use-scroll-spy'
import { useScrollProgress } from '@/composables/use-scroll-progress'
import LanguageSwitcher from './LanguageSwitcher.vue'
import SiteHeaderNav from './SiteHeaderNav.vue'

// MARK: - Composables

const route = useRoute()
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
  .pointer-events-auto.my-auto.mx-auto.flex.items-center.gap-8.border(
    class="py-1.5 sm:py-2.5 px-1.5 sm:px-2.5 mt-[calc(var(--header-progress,0)*var(--spacing)*4)] w-[calc(100%_-_var(--header-progress,0)*var(--spacing)*8)] rounded-[calc(var(--header-progress,0)*var(--spacing)*4)] border-[color-mix(in_oklab,var(--site-border)_calc(var(--header-progress,0)*100%),transparent)] bg-[color-mix(in_oklab,var(--site-background)_calc(var(--header-progress,0)*88%),transparent)] backdrop-blur-[calc(var(--header-progress,0)*16px)]"
  )
    RouterLink.flex.size-11.shrink-0.items-center.justify-center.text-3xl.font-bold.leading-none.transition-colors(
      to='/'
      aria-label='Home'
      class="-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-site-secondary"
      :class="{ 'text-site-secondary': homeActive }"
    ) &#8962;

    LanguageSwitcher.my-auto(class="hidden md:block")

    SiteHeaderNav
</template>
