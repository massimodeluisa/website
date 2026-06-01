<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { TextPlugin } from 'gsap/TextPlugin'

import { useI18n } from '@/i18n'
import { useTextReveal } from '@/composables/use-text-reveal'
import { prefersReducedMotion } from '@/utils/motion'

gsap.registerPlugin(SplitText, TextPlugin)

const TAGLINE_KEYS = [
  'tagline1',
  'tagline2',
  'tagline3',
  'tagline4',
  'tagline5',
  'tagline6',
] as const

const TYPEWRITER_MS = 900
const DRAW_PER_LINE_MS = 600
const DRAW_STAGGER_MS = 260
const DWELL_MS = 2800
const RETRACT_PER_LINE_MS = 360
const RETRACT_STAGGER_MS = 200
const FADE_OUT_MS = 280
const FIRST_CYCLE_DELAY_MS = 600

// MARK: - Composables

const { t } = useI18n()
const { revealCharsFade, revealChars } = useTextReveal()

// MARK: - Variables

const kickerEl = ref<HTMLElement | null>(null)
const nameEl = ref<HTMLElement | null>(null)
const taglineEl = ref<HTMLElement | null>(null)
const taglineInnerEl = ref<HTMLElement | null>(null)

let cancelled = false
let taglineIndex = 0
let activeSplit: SplitText | null = null
let activeTl: gsap.core.Timeline | null = null
let initialDelayTimer: number | undefined

// MARK: - Methods

const createTextReveal = () => {
  if (nameEl.value) {
    revealChars(nameEl.value, {
      scrollTrigger: false,
      duration: 0.82,
      stagger: 0.011,
      delay: 0.08,
    })
  }

  if (kickerEl.value) {
    revealCharsFade(kickerEl.value, {
      scrollTrigger: false,
      delay: 0,
      duration: 0.45,
      stagger: 0.018,
    })
  }
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/*
 * Wraps a GSAP timeline so it can be awaited. Resolves on onComplete; resolves
 * immediately if the timeline has no animation steps.
 */
const playTimeline = (tl: gsap.core.Timeline) =>
  new Promise<void>((resolve) => {
    if (tl.duration() === 0) {
      resolve()
      return
    }
    tl.eventCallback('onComplete', () => resolve())
  })

/*
 * Imperative cycle:
 *   typewriter (TextPlugin) → SplitText('lines') → stagger draw → dwell →
 *   stagger retract → fade-out → advance index → loop.
 *
 * The inner span starts EMPTY (no Vue interpolation) so TextPlugin and
 * SplitText own its text node exclusively — Vue cannot patch it from
 * underneath them mid-animation, which previously caused stacked taglines.
 */
const runTaglineCycle = async (): Promise<void> => {
  const parent = taglineEl.value
  if (parent) {
    gsap.to(parent, { opacity: 1, duration: 0.4, ease: 'power2.out' })
  }

  while (!cancelled) {
    const el = taglineInnerEl.value
    if (!el) {
      await wait(50)
      continue
    }

    const targetText = t(`hero.${TAGLINE_KEYS[taglineIndex]}`)
    if (!targetText) {
      break
    }

    const reduced = prefersReducedMotion()

    el.textContent = ''
    gsap.set(el, { opacity: 1 })

    if (reduced) {
      el.textContent = targetText
      await wait(DWELL_MS + 1600)
      gsap.set(el, { opacity: 0 })
      taglineIndex = (taglineIndex + 1) % TAGLINE_KEYS.length
      continue
    }

    // Phase 1 — typewriter type-in (TextPlugin).
    const typeTl = gsap.timeline()
    activeTl = typeTl
    typeTl.to(el, {
      text: targetText,
      duration: TYPEWRITER_MS / 1000,
      ease: 'none',
    })
    await playTimeline(typeTl)

    if (cancelled) {
      break
    }

    // Phase 2 — split into lines, animate underlines sequentially.
    const split = new SplitText(el, {
      type: 'lines',
      linesClass: 'tagline-line',
    })
    activeSplit = split
    const lines = split.lines as HTMLElement[]

    gsap.set(lines, { '--ul-size': '0%', '--ul-pos': '0%' })

    const tl = gsap.timeline()
    activeTl = tl

    // Draw — left-anchored, size 0% → 100%, staggered across lines.
    tl.to(lines, {
      '--ul-size': '100%',
      duration: DRAW_PER_LINE_MS / 1000,
      ease: 'power2.inOut',
      stagger: DRAW_STAGGER_MS / 1000,
    })

    // Dwell (no-op tween used to reserve duration on the timeline).
    tl.to({}, { duration: DWELL_MS / 1000 })

    // Flip anchor to right edge (instant, invisible while size is still 100%).
    tl.set(lines, { '--ul-pos': '100%' })

    // Retract — right-anchored, size 100% → 0%, staggered across lines.
    tl.to(lines, {
      '--ul-size': '0%',
      duration: RETRACT_PER_LINE_MS / 1000,
      ease: 'power2.in',
      stagger: RETRACT_STAGGER_MS / 1000,
    })

    // Fade element out before the swap.
    tl.to(el, {
      opacity: 0,
      duration: FADE_OUT_MS / 1000,
      ease: 'power2.in',
    })

    await playTimeline(tl)

    if (cancelled) {
      break
    }

    split.revert()
    activeSplit = null

    taglineIndex = (taglineIndex + 1) % TAGLINE_KEYS.length
  }
}

// MARK: - Lifecycle

onMounted(() => {
  requestAnimationFrame(() => {
    createTextReveal()
  })

  initialDelayTimer = window.setTimeout(() => {
    runTaglineCycle()
  }, FIRST_CYCLE_DELAY_MS)
})

onBeforeUnmount(() => {
  cancelled = true
  if (initialDelayTimer) {
    clearTimeout(initialDelayTimer)
  }
  if (activeTl) {
    activeTl.kill()
  }
  if (activeSplit) {
    activeSplit.revert()
  }
})
</script>

<template lang="pug">
.min-w-0.text-center(class="md:text-left")
  .font-mono.text-xs.font-semibold.uppercase.text-site-secondary(
    ref="kickerEl"
    class="mb-4 opacity-0 translate-y-2 tracking-[0.28em]"
  ) {{ t('hero.role') }}

  h1.select-none.font-semibold.text-site-heading.opacity-0(
    ref="nameEl"
    style="font-feature-settings: 'tnum', 'ss01'"
    class="text-[clamp(2.4rem,5vw,4.7rem)] leading-[0.76] tracking-[-0.035em]"
  )
    span Massimo De&nbsp;Luisa

  p.mt-6.text-xl.font-medium.leading-tight.text-site-muted.mx-auto.opacity-0(
    ref="taglineEl"
    class="md:text-[1.65rem] md:leading-[1.1] max-w-[28ch] md:mx-0 min-h-[calc(2lh_+_0.5rem)]"
  )
    span.inline-block.w-full(ref="taglineInnerEl")

  slot(name="ctas")
</template>

<style scoped lang="scss">
/* SplitText('lines') — block sized to text width so the underline gradient
   spans only that line. GSAP drives --ul-size/--ul-pos per line. */
:deep(.tagline-line) {
  --ul-size: 0%;
  --ul-pos: 0%;
  display: block;
  width: max-content;
  max-width: 100%;
  margin-inline: auto;
  padding-bottom: 0.06em;
  background-image: linear-gradient(var(--site-secondary), var(--site-secondary));
  background-size: var(--ul-size) 2px;
  background-position: var(--ul-pos) 100%;
  background-repeat: no-repeat;
}

@media (min-width: 1024px) {
  :deep(.tagline-line) {
    margin-inline: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  :deep(.tagline-line) {
    --ul-size: 100%;
  }
}
</style>
