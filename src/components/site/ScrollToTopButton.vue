<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { useI18n } from '@/i18n'

// Scroll threshold before the button becomes visible.
const SHOW_THRESHOLD = 600

// MARK: - Composables

const { t } = useI18n()

// MARK: - Variables

const scrollY = ref(0)

// MARK: - Computed

const isVisible = computed(() => scrollY.value >= SHOW_THRESHOLD)

// MARK: - Methods

const onScroll = () => {
  scrollY.value = window.scrollY
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// MARK: - Lifecycle

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template lang="pug">
teleport(to="body")
  transition(name="scroll-btn-shell")
    .fixed.z-60(
      v-if="isVisible"
      class="bottom-6 right-6"
    )
      button.inline-flex.size-10.cursor-pointer.items-center.justify-center.rounded-full.border-0.transition.duration-200(
        type="button"
        :aria-label="t('scrollToTop.toTop')"
        class="bg-site-heading text-site-background hover:bg-site-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--site-secondary)] motion-reduce:transition-none"
        @click="scrollToTop"
      )
        svg(width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true")
          polyline(points="6 15 12 9 18 15")
</template>

<style scoped lang="scss">
// Fade + slide when the button appears / disappears.
.scroll-btn-shell-enter-active,
.scroll-btn-shell-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.scroll-btn-shell-enter-from,
.scroll-btn-shell-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (prefers-reduced-motion: reduce) {
  .scroll-btn-shell-enter-active,
  .scroll-btn-shell-leave-active {
    transition: opacity 0.2s ease;
  }
}
</style>
