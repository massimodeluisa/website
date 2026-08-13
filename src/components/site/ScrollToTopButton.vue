<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { useWorkStageNav } from '@/composables/use-work-stage'
import { useI18n } from '@/i18n'

// Scroll threshold before the button cluster becomes visible.
const SHOW_THRESHOLD = 600
const DESKTOP_BREAKPOINT = '(min-width: 1280px)'

// MARK: - Composables

const { t } = useI18n()
const { goPrev, goNext } = useWorkStageNav()

// MARK: - Variables

const scrollY = ref(0)
const isInWorkSection = ref(false)
const isDesktop = ref(false)

let mediaQuery: MediaQueryList | null = null
let mediaQueryHandler: ((e: MediaQueryListEvent) => void) | null = null

// MARK: - Computed

const mode = computed<'hidden' | 'top' | 'work'>(() => {
  if (scrollY.value < SHOW_THRESHOLD) {
    return 'hidden'
  }
  if (isInWorkSection.value && isDesktop.value) {
    return 'work'
  }
  return 'top'
})

const isWorkMode = computed(() => mode.value === 'work')

// MARK: - Methods

const updateState = () => {
  scrollY.value = window.scrollY
  const track = document.querySelector('#work .work-track')
  if (!track) {
    isInWorkSection.value = false
    return
  }
  const rect = track.getBoundingClientRect()
  /* Fullscreen locked card: the track covers the viewport (top at or above 0,
     bottom still past the fold). Any morph that is not 100% fuses back to ↑. */
  isInWorkSection.value = rect.top <= 0 && rect.bottom > window.innerHeight
}

const onScroll = () => updateState()
const onResize = () => updateState()

const scrollUp = () => {
  goPrev()
}

const anchorClick = () => {
  if (isWorkMode.value) {
    goNext()
    return
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// MARK: - Lifecycle

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })

  mediaQuery = window.matchMedia(DESKTOP_BREAKPOINT)
  isDesktop.value = mediaQuery.matches
  mediaQueryHandler = (e: MediaQueryListEvent) => {
    isDesktop.value = e.matches
  }
  mediaQuery.addEventListener('change', mediaQueryHandler)

  updateState()
  requestAnimationFrame(updateState)
  setTimeout(updateState, 200)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
  if (mediaQuery && mediaQueryHandler) {
    mediaQuery.removeEventListener('change', mediaQueryHandler)
  }
})
</script>

<template lang="pug">
teleport(to="body")
  svg.absolute.w-0.h-0.pointer-events-none(aria-hidden="true" focusable="false")
    defs
      filter#liquid-glass-fusion(x="-50%" y="-50%" width="200%" height="200%")
        feGaussianBlur(in="SourceGraphic" stdDeviation="5")
        feColorMatrix(values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="liquid")
        feComposite(in="SourceGraphic" in2="liquid" operator="atop")

  transition(name="scroll-btn-shell")
    .fixed.z-60(
      v-if="mode !== 'hidden'"
      class="bottom-6 right-6"
    )
      .scroll-buttons-cluster.flex.flex-col.p-2.-m-2(class="[gap:0.45rem] [filter:url(#liquid-glass-fusion)]")
        transition(name="scroll-btn-fuse")
          button.inline-flex.size-10.cursor-pointer.items-center.justify-center.rounded-full.border-0.transition.duration-200(
            v-if="isWorkMode"
            key="up-emerging"
            type="button"
            :aria-label="t('scrollToTop.prevWork')"
            class="bg-site-heading text-site-background hover:bg-site-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--site-secondary)] motion-reduce:transition-none"
            @click="scrollUp"
          )
            svg(width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true")
              polyline(points="6 15 12 9 18 15")

        button.scroll-btn--anchor.inline-flex.size-10.cursor-pointer.items-center.justify-center.rounded-full.border-0.transition.duration-200(
          type="button"
          :class="{ 'is-flipped': isWorkMode }"
          :aria-label="isWorkMode ? t('scrollToTop.nextWork') : t('scrollToTop.toTop')"
          class="bg-site-heading text-site-background hover:bg-site-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--site-secondary)] motion-reduce:transition-none"
          @click="anchorClick"
        )
          svg.scroll-btn-chevron.will-change-transform(width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true")
            polyline(points="6 15 12 9 18 15")
</template>

<style scoped lang="scss">
.scroll-btn-chevron {
  transition: transform 0.5s cubic-bezier(0.65, 0, 0.35, 1);
}

.scroll-btn--anchor.is-flipped .scroll-btn-chevron {
  transform: rotate(180deg);
}

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

/* Molecular fusion: UP droplet emerges from the anchor, then splits. */
.scroll-btn-fuse-enter-active,
.scroll-btn-fuse-leave-active {
  transition:
    transform 0.55s cubic-bezier(0.65, 0, 0.35, 1),
    opacity 0.45s cubic-bezier(0.4, 0, 0.6, 1);
  will-change: transform, opacity;
}

.scroll-btn-fuse-enter-from,
.scroll-btn-fuse-leave-to {
  transform: translateY(3rem) scale(0.55);
  opacity: 0;
}

.scroll-btn-fuse-enter-to,
.scroll-btn-fuse-leave-from {
  transform: translateY(0) scale(1);
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .scroll-buttons-cluster {
    filter: none;
  }

  .scroll-btn-chevron,
  .scroll-btn-shell-enter-active,
  .scroll-btn-shell-leave-active,
  .scroll-btn-fuse-enter-active,
  .scroll-btn-fuse-leave-active {
    transition: opacity 0.2s ease;
  }

  .scroll-btn-fuse-enter-from,
  .scroll-btn-fuse-leave-to {
    transform: none;
    opacity: 0;
  }
}
</style>
