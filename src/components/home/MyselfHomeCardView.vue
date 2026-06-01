<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'

import { useScrollProgress } from '@/composables/use-scroll-progress'
import { useI18n } from '@/i18n'

gsap.registerPlugin(DrawSVGPlugin)

// MARK: - Composables

const { progress } = useScrollProgress()
const { t } = useI18n()

// MARK: - Variables

const cardRadius = 16
const cardEl = ref<HTMLElement | null>(null)
const borderPath = ref<SVGPathElement | null>(null)
const cardW = ref(0)
const cardH = ref(0)

let observer: ResizeObserver | null = null

// MARK: - Computed

const viewBox = computed(() => `0 0 ${cardW.value} ${cardH.value}`)

const borderPathD = computed(() => {
  const w = cardW.value
  const h = cardH.value
  const r = cardRadius
  if (w <= 0 || h <= 0) {
    return ''
  }
  return [
    `M 0 ${h - r}`,
    `L 0 ${r}`,
    `A ${r} ${r} 0 0 1 ${r} 0`,
    `L ${w - r} 0`,
    `A ${r} ${r} 0 0 1 ${w} ${r}`,
    `L ${w} ${h - r}`,
    `A ${r} ${r} 0 0 1 ${w - r} ${h}`,
    `L ${r} ${h}`,
    `A ${r} ${r} 0 0 1 0 ${h - r}`,
    'Z',
  ].join(' ')
})

// MARK: - Watchers

watch(progress, (p) => {
  if (!borderPath.value) {
    return
  }
  gsap.set(borderPath.value, { drawSVG: `0% ${p * 100}%` })
})

// MARK: - Lifecycle

onMounted(() => {
  if (cardEl.value) {
    observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) {
        return
      }
      cardW.value = entry.contentRect.width
      cardH.value = entry.contentRect.height
    })
    observer.observe(cardEl.value)
  }
  if (borderPath.value) {
    gsap.set(borderPath.value, { drawSVG: 0 })
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template lang="pug">
.myself-card.relative.shrink-0.overflow-hidden(
  ref="cardEl"
  class="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[26rem] lg:h-[26rem] xl:w-[30rem] xl:h-[30rem]"
  :style="{ '--card-radius': `${cardRadius}px`, '--card-progress': progress }"
)
  .card-bg.absolute.inset-0(class="bg-white dark:bg-black")
  img.relative.h-full.w-full.object-cover(
    src='@/assets/me-squared-clean.webp'
    :alt="t('hero.portraitAlt')"
  )
  svg.absolute.inset-0.h-full.w-full.pointer-events-none(
    :viewBox="viewBox"
    preserveAspectRatio="none"
    aria-hidden="true"
  )
    path(
      ref="borderPath"
      :d="borderPathD"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      vector-effect="non-scaling-stroke"
    )
</template>

<style scoped lang="scss">
.myself-card {
  border-radius: var(--card-radius);
  color: color-mix(in oklab, var(--site-text) 70%, transparent);
}

.card-bg {
  opacity: var(--card-progress, 0);
}
</style>
