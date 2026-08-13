<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { useLocale } from '@/composables/use-locale'
import { useTextReveal } from '@/composables/use-text-reveal'
import { useWorkMorph } from '@/composables/use-work-morph'
import { registerWorkStageNav, setWorkStageIndex } from '@/composables/use-work-stage'
import { worksFor } from '@/contents/works'
import { useI18n } from '@/i18n'
import { prefersReducedMotion } from '@/utils/motion'

import WorkCarousel from './WorkCarousel.vue'
import WorkRow from './WorkRow.vue'
import WorkStage from './WorkStage.vue'

gsap.registerPlugin(ScrollTrigger)

// MARK: - Composables
const { t } = useI18n()
const { current } = useLocale()
const router = useRouter()
const { revealCharsFade } = useTextReveal()

// MARK: - Variables
const sectionEl = ref<HTMLElement | null>(null)
const kickerEl = ref<HTMLElement | null>(null)
const titleEl = ref<HTMLElement | null>(null)
const introEl = ref<HTMLElement | null>(null)
const previewSlotEl = ref<HTMLElement | null>(null)
const headerAreaEl = ref<HTMLElement | null>(null)
const trackEl = ref<HTMLElement | null>(null)
const stageEl = ref<HTMLElement | null>(null)
const previewLayerEl = ref<HTMLElement | null>(null)
const fullLayerEl = ref<HTMLElement | null>(null)
const mobileListEl = ref<HTMLElement | null>(null)

const isDesktop = ref(false)
const activeIndex = ref(0)
const progress = ref(0)
const winAspect = ref(16 / 9)

const triggers: ScrollTrigger[] = []
const rowTriggers: ScrollTrigger[] = []
let mq: MediaQueryList | undefined
let swapTrigger: ScrollTrigger | undefined
let unregisterStageNav: (() => void) | undefined
let cleanupHeaderReveal: (() => void) | undefined

/*
 * useWorkMorph must be instantiated after the element refs it receives — so it
 * lives here rather than in the Composables block above.
 */
const workMorph = useWorkMorph(
  {
    headerArea: headerAreaEl,
    track: trackEl,
    stage: stageEl,
    previewSlot: previewSlotEl,
    layerPreview: previewLayerEl,
    layerFull: fullLayerEl,
  },
  { prefersReducedMotion },
)

// MARK: - Computed
const works = computed(() => worksFor(current.value))
const activeWork = computed(() => works.value[activeIndex.value] ?? works.value[0]!)
const counterLabel = computed(() => {
  const cur = String(activeIndex.value + 1).padStart(2, '0')
  const tot = String(works.value.length).padStart(2, '0')
  return `${cur} / ${tot}`
})
const progressPercent = computed(() => `${Math.round(progress.value * 100)}%`)

// MARK: - Methods
const handleOpen = (slug: string) => {
  router.push({ name: 'work', params: { slug } })
}

function workHash(slug: string) {
  return `#work-${slug}`
}

function slugFromHash(hash: string) {
  const value = hash.startsWith('#') ? hash.slice(1) : hash
  return value.startsWith('work-') ? value.slice(5) : ''
}

function applyWorkHash(slug: string) {
  if (typeof window === 'undefined') {
    return
  }
  const target = workHash(slug)
  if (window.location.hash === target) {
    return
  }
  const url = `${window.location.pathname}${window.location.search}${target}`
  window.history.replaceState(window.history.state, '', url)
}

function scrollToWorkIndex(index: number) {
  if (!swapTrigger || typeof window === 'undefined') {
    return
  }
  const total = works.value.length
  const reduced = prefersReducedMotion()
  const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth'
  if (index < 0) {
    window.scrollTo({ top: Math.max(0, swapTrigger.start - 48), behavior })
    return
  }
  if (index >= total) {
    window.scrollTo({ top: swapTrigger.end + 48, behavior })
    return
  }
  const progressAt = (index + 0.45) / total
  const top = swapTrigger.start + progressAt * (swapTrigger.end - swapTrigger.start)
  window.scrollTo({ top, behavior })
}

function syncFromHash() {
  if (typeof window === 'undefined') {
    return
  }
  const slug = slugFromHash(window.location.hash)
  if (!slug) {
    return
  }
  const next = works.value.findIndex((work) => work.slug === slug)
  if (next >= 0) {
    scrollToWorkIndex(next)
  }
}

function setupHeaderReveals() {
  cleanupHeaderReveal?.()
  /*
   * Char-fade reveal (kicker → title → counter line), matching the About/Contact
   * headers so the section comparsa reads at the same quick pace instead of the
   * slow character-by-character typewriter. rAF-deferred to clear hydration.
   */
  const reverts: Array<() => void> = []
  requestAnimationFrame(() => {
    if (kickerEl.value) {
      reverts.push(
        revealCharsFade(kickerEl.value, { start: 'top 85%', duration: 0.4, stagger: 0.016 }),
      )
    }
    if (titleEl.value) {
      reverts.push(
        revealCharsFade(titleEl.value, {
          start: 'top 82%',
          delay: 0.08,
          duration: 0.45,
          stagger: 0.014,
        }),
      )
    }
    if (introEl.value) {
      reverts.push(
        revealCharsFade(introEl.value, {
          start: 'top 82%',
          delay: 0.16,
          duration: 0.4,
          stagger: 0.01,
        }),
      )
    }
  })
  cleanupHeaderReveal = () => {
    reverts.forEach((fn) => fn())
    reverts.length = 0
  }
}

function setupMobileRows() {
  if (!mobileListEl.value) {
    return
  }
  if (prefersReducedMotion()) {
    gsap.set(mobileListEl.value.children, { opacity: 1, y: 0 })
    return
  }
  Array.from(mobileListEl.value.children).forEach((child, index) => {
    const el = child as HTMLElement
    gsap.set(el, { opacity: 0, y: 28 })
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power3.out',
          delay: Math.min(index, 4) * 0.04,
        })
      },
    })
    rowTriggers.push(trigger)
  })
}

function destroyMobileRows() {
  while (rowTriggers.length) {
    rowTriggers.pop()?.kill()
  }
}

function setupDesktop() {
  const slot = previewSlotEl.value
  const track = trackEl.value
  const stage = stageEl.value
  const previewLayer = previewLayerEl.value
  const fullLayer = fullLayerEl.value
  if (!slot || !track || !stage || !previewLayer || !fullLayer) {
    return
  }

  /*
   * Sticky-morph + crossfade lifecycle lives in useWorkMorph; the swap
   * ScrollTrigger driving progress + activeIndex stays inline as orchestration state.
   */
  workMorph.setup()

  const segments = works.value.length
  const swap = ScrollTrigger.create({
    trigger: track,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.4,
    onUpdate: (self) => {
      progress.value = self.progress
      const idx = Math.min(segments - 1, Math.max(0, Math.floor(self.progress * segments)))
      if (idx !== activeIndex.value) {
        activeIndex.value = idx
      }
      const rect = track.getBoundingClientRect()
      const fullscreen = rect.top <= 0 && rect.bottom > window.innerHeight
      setWorkStageIndex(fullscreen ? idx : -1)
      if (fullscreen) {
        const slug = works.value[idx]?.slug
        if (slug) {
          applyWorkHash(slug)
        }
      }
    },
  })
  swapTrigger = swap
  triggers.push(swap)
  unregisterStageNav = registerWorkStageNav({
    count: segments,
    goTo: scrollToWorkIndex,
  })
}

function destroyDesktop() {
  workMorph.teardown()
  unregisterStageNav?.()
  unregisterStageNav = undefined
  swapTrigger = undefined
  setWorkStageIndex(-1)
  while (triggers.length) {
    triggers.pop()?.kill()
  }
}

function refreshMode() {
  if (!mq) {
    return
  }
  const wantDesktop = mq.matches
  if (wantDesktop === isDesktop.value) {
    return
  }
  isDesktop.value = wantDesktop
  destroyDesktop()
  destroyMobileRows()
  requestAnimationFrame(() => {
    if (isDesktop.value) {
      setupDesktop()
    } else {
      setupMobileRows()
    }
    ScrollTrigger.refresh()
  })
}

// MARK: - Watchers

// Locale switch re-renders the header copy — retype it in the new language.
watch(current, () => {
  requestAnimationFrame(() => setupHeaderReveals())
})

watch(
  () => activeWork.value?.slug,
  () => {
    if (!isDesktop.value || !fullLayerEl.value || prefersReducedMotion()) {
      return
    }
    const layout = fullLayerEl.value.querySelector<HTMLElement>('.work-stage-layout')
    if (!layout) {
      return
    }
    gsap.fromTo(
      layout,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.42, ease: 'power3.out', overwrite: 'auto' },
    )
  },
)

// MARK: - Lifecycle

/*
 * Keep the preview slot's aspect ratio equal to the window's, so the morph's
 * per-axis scale (slotW/winW, slotH/winH) stays uniform and never stretches.
 */
const updateWinAspect = () => {
  winAspect.value = window.innerWidth / window.innerHeight
}

onMounted(() => {
  setupHeaderReveals()
  updateWinAspect()
  window.addEventListener('resize', updateWinAspect, { passive: true })
  mq = window.matchMedia('(min-width: 1280px)')
  isDesktop.value = mq.matches
  mq.addEventListener('change', refreshMode)
  requestAnimationFrame(() => {
    if (isDesktop.value) {
      setupDesktop()
      requestAnimationFrame(() => {
        syncFromHash()
        setTimeout(syncFromHash, 200)
      })
    } else {
      setupMobileRows()
    }
  })
  window.addEventListener('hashchange', syncFromHash)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWinAspect)
  window.removeEventListener('hashchange', syncFromHash)
  mq?.removeEventListener('change', refreshMode)
  destroyDesktop()
  destroyMobileRows()
})
</script>

<template lang="pug">
section#work.relative.isolate.border-t.border-site-border(
  ref="sectionEl"
  class="py-20 md:py-24"
)
  .site-container
    .work-header-area(
      ref="headerAreaEl"
      class="pb-0 xl:pb-[clamp(80px,5vw,96px)]"
    )
      .work-header(class="xl:grid xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] xl:items-start xl:gap-10")
        .work-header-text.min-w-0
          p.site-kicker.font-mono.text-sm.font-semibold.uppercase.text-site-secondary.opacity-0(
            ref="kickerEl"
            class="tracking-[0.24em]"
          ) {{ t('work.kicker') }}
          h2.mt-3.font-semibold.leading-tight.text-site-heading.opacity-0(
            ref="titleEl"
            class="text-4xl md:text-6xl tracking-[-0.02em]"
          ) {{ t('work.intro') }}
          p.font-mono.mt-8.text-xs.uppercase.text-site-muted.opacity-0(
            ref="introEl"
            class="tracking-[0.2em]"
          )
            | {{ works.length }} {{ t('work.kicker') }} · {{ t('work.yearRange') }}

        .relative.justify-self-end(
          v-if="isDesktop"
          ref="previewSlotEl"
          aria-hidden="true"
          :style="{ aspectRatio: winAspect }"
          class="h-[clamp(220px,23vw,340px)]"
        )

  template(v-if="isDesktop")
    .work-track.relative(
      ref="trackEl"
      class="h-[calc(100vh*11)]"
    )
      .work-stage.sticky.top-0.overflow-hidden.bg-site-surface.border.border-site-border(
        ref="stageEl"
        class="h-[100vh] w-[100vw] ml-[calc(50%-50vw)] origin-top-left shadow-[0_18px_50px_color-mix(in_oklab,var(--site-heading)_8%,transparent)]"
      )
        .absolute.inset-0(ref="previewLayerEl")
          WorkCarousel
        .absolute.inset-0(ref="fullLayerEl")
          WorkStage(
            :work="activeWork"
            :index="activeIndex"
            :total="works.length"
            @open="handleOpen"
          )

          //- Right inset clears the fixed up/down scroll-nav cluster
          //- (bottom-6 right-6, size-10 → ~4rem gutter) so the 01 / 10 counter
          //- never sits under the arrows.
          .work-stage-progress.absolute.z-10.pointer-events-none.flex.items-center.gap-4.text-white(
            class="left-[clamp(1rem,3vw,2rem)] right-[clamp(5rem,3vw+3.25rem,6rem)] bottom-[0.85rem]"
            aria-hidden="true"
          )
            .work-stage-progress-track.flex-1.overflow-hidden.rounded-sm(
              class="h-[2px] bg-[color-mix(in_oklab,var(--site-muted)_45%,transparent)]"
            )
              .h-full.bg-site-secondary(
                class="transition-[width] duration-[180ms] ease-linear"
                :style="{ width: progressPercent }"
              )
            p.shrink-0.font-mono.text-white(
              class="text-[10.5px] tracking-widest"
            ) {{ counterLabel }}

  template(v-if="!isDesktop")
    .site-container
      ol.m-0.list-none.p-0.mt-12(
        ref="mobileListEl"
        class="md:mt-16"
      )
        li.list-none(
          v-for="(work, index) in works"
          :key="work.slug"
        )
          WorkRow(
            :work="work"
            :index="index"
            :total="works.length"
            @open="handleOpen"
          )
</template>
