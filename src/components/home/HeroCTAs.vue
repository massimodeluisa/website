<script setup lang="ts">
import { onMounted } from 'vue'
import gsap from 'gsap'

import StdButton from '@/components/shared/StdButton.vue'
import { useI18n } from '@/i18n'
import { prefersReducedMotion } from '@/utils/motion'

// MARK: - Constants

const CTA_REVEAL_DURATION = 0.45
const CTA_REVEAL_STAGGER = 0.06

// MARK: - Composables

const { t } = useI18n()

// MARK: - Methods

const scrollToContact = () => {
  const target = document.getElementById('contact')
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else {
    window.location.hash = '#contact'
  }
}

const scrollToWork = () => {
  const target = document.getElementById('work')
  target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// MARK: - Lifecycle

onMounted(() => {
  requestAnimationFrame(() => {
    if (prefersReducedMotion()) {
      gsap.set('[data-hero-cta]', { opacity: 1, y: 0 })
      return
    }
    gsap
      .timeline({ defaults: { ease: 'power3.out' } })
      .to(
        '[data-hero-cta]',
        { opacity: 1, y: 0, duration: CTA_REVEAL_DURATION, stagger: CTA_REVEAL_STAGGER },
        0.55,
      )
  })
})
</script>

<template lang="pug">
.mt-8.flex.flex-wrap.items-center.justify-center.gap-3(
  data-hero-cta
  class="opacity-0 translate-y-2 md:justify-start"
)
  StdButton.min-h-11.rounded-full.px-7(variant="primary" @click="scrollToContact") {{ t('hero.ctaContact') }}

  StdButton.min-h-11.rounded-full.px-6(variant="secondary" @click="scrollToWork") {{ t('hero.ctaWork') }}
</template>
