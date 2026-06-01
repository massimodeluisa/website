<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'

import dayjs from 'dayjs'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { useI18n } from '@/i18n'
import { prefersReducedMotion } from '@/utils/motion'

import MeshGradientBackground from './MeshGradientBackground.vue'
import HeroBio from './HeroBio.vue'
import HeroCTAs from './HeroCTAs.vue'
import HeroPortrait3D from './HeroPortrait3D.vue'

gsap.registerPlugin(ScrollTrigger)

// MARK: - Composables

const { t } = useI18n()

// MARK: - Variables

/* Where I'm based — change these two to move the hero clock pin. */
const CURRENT_LOCATION = 'Udine, Italy'
const CURRENT_LOCATION_URL = 'https://x.com/VisitFVG'

const formatter = shallowRef('dddd YY-MM-DD HH:mm:ss z')
const formatted = ref('')

const sectionEl = ref<HTMLElement | null>(null)
const washBronzeEl = ref<HTMLElement | null>(null)
const washAzureEl = ref<HTMLElement | null>(null)
const meshPaused = ref(false)

let clockTimer: number | undefined
let bgScrollTrigger: ScrollTrigger | undefined

// MARK: - Methods

const setupFormatted = () => {
  formatted.value = dayjs().tz('Europe/Rome').format(formatter.value)
}

/*
 * Scroll-scrubbed background: across the hero's scroll the mesh freezes while a
 * bronze wash fades in (first half) and then the azzurro over it (second half),
 * so the home dissolves into the next section's colour.
 */
const setupBackgroundScroll = () => {
  if (prefersReducedMotion() || !sectionEl.value) {
    return
  }

  const tl = gsap.timeline()
  tl.to(washBronzeEl.value, { opacity: 1, ease: 'none' }).to(washAzureEl.value, {
    opacity: 1,
    ease: 'none',
  })

  bgScrollTrigger = ScrollTrigger.create({
    trigger: sectionEl.value,
    start: 'top top',
    end: '+=40%',
    scrub: true,
    animation: tl,
    onUpdate: (self) => {
      meshPaused.value = self.progress > 0.06
    },
  })
}

// MARK: - Lifecycle

onMounted(() => {
  setupFormatted()
  clockTimer = window.setInterval(setupFormatted, 1000)
  setupBackgroundScroll()
})

onBeforeUnmount(() => {
  if (clockTimer) {
    clearInterval(clockTimer)
  }
  bgScrollTrigger?.kill()
})
</script>

<template lang="pug">
section#home.relative.min-h-dvh.flex.items-center.overflow-hidden.bg-site-background(
  ref="sectionEl"
  class="pt-12 pb-20 md:py-20"
)
  MeshGradientBackground(:paused="meshPaused")

  .absolute.inset-0.z-0.pointer-events-none.opacity-0(
    ref="washBronzeEl"
    aria-hidden="true"
    class="bg-[color-mix(in_oklab,var(--site-secondary)_16%,var(--site-background))]"
  )
  .absolute.inset-0.z-0.bg-site-background.pointer-events-none.opacity-0(
    ref="washAzureEl"
    aria-hidden="true"
  )

  .relative.z-10.mx-auto.w-full.px-6(
    class="max-w-[calc(var(--spacing)*310)] md:px-12 lg:px-20"
  )
    .grid.items-center.gap-x-12(class="gap-y-10 md:gap-y-16 md:grid-cols-[1.2fr_0.8fr]")
      HeroBio(class="order-2 md:order-1")
        template(#ctas)
          HeroCTAs

      HeroPortrait3D(class="order-1 md:order-2")

  .absolute.bottom-6.w-full.z-10
    p.site-container.text-center.font-mono.uppercase.text-site-muted(class="text-[10px] tracking-[0.2em]")
      span {{ formatted }}
      span(aria-hidden="true") &nbsp;—&nbsp;
      a.font-bold.text-site-heading.transition-colors(
        :href="CURRENT_LOCATION_URL"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="`${CURRENT_LOCATION} (opens in new tab)`"
        class="hover:text-site-secondary"
      ) {{ CURRENT_LOCATION }}
</template>
