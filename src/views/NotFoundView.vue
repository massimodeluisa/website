<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'

import StdButton from '@/components/shared/StdButton.vue'
import { useLocale } from '@/composables/use-locale'
import { usePageSeo } from '@/composables/use-page-seo'
import { useI18n } from '@/i18n'
import { prefersReducedMotion } from '@/utils/motion'

gsap.registerPlugin(TextPlugin)

interface IGlyph {
  char: string
  left: number
  size: number
  dim: number
}

// MARK: - Composables

const { t } = useI18n()
const { localePath } = useLocale()

usePageSeo({
  title: () => `${t('notFound.title')} ${t('notFound.accent')}`,
  description: () => t('notFound.subtitle'),
})

// MARK: - Variables

/* Kanji of loss / drift / void / mistake / retry — the mood of a 404. */
const RAIN_CHARS = '迷失散空虚無永遠忘誤違過再試喪漂惑茫亡探'
/* Deterministic layout (SSG-safe); GSAP adds the randomised fall in onMounted. */
const RAIN: IGlyph[] = Array.from({ length: 64 }, (_, i) => ({
  char: RAIN_CHARS[(i * 7) % RAIN_CHARS.length] ?? '迷',
  left: (i * 41) % 100,
  size: 0.7 + ((i * 17) % 6) * 0.12,
  dim: 0.1 + ((i * 23) % 5) * 0.05,
}))

const rootEl = ref<HTMLElement | null>(null)
const numberEl = ref<HTMLElement | null>(null)
const titleEl = ref<HTMLElement | null>(null)
const accentEl = ref<HTMLElement | null>(null)
const subtitleEl = ref<HTMLElement | null>(null)
let ctx: gsap.Context | undefined

// MARK: - Computed

const homePath = computed(() => localePath('/'))

// MARK: - Lifecycle

onMounted(() => {
  if (prefersReducedMotion() || !rootEl.value) {
    return
  }
  const root = rootEl.value
  ctx = gsap.context(() => {
    const fall = root.offsetHeight + 80
    gsap.utils.toArray<HTMLElement>('.nf-glyph').forEach((el) => {
      const duration = 5 + Math.random() * 7
      gsap.fromTo(el, { y: -80 }, { y: fall, duration, ease: 'none', repeat: -1, delay: -Math.random() * duration })
    })

    /* Typewriter: clear each line, then type it back — the subtitle types fast. */
    const sequence = [
      { el: numberEl.value, speed: 0.09 },
      { el: titleEl.value, speed: 0.06 },
      { el: accentEl.value, speed: 0.06 },
      { el: subtitleEl.value, speed: 0.012 },
    ]
      .filter((line): line is { el: HTMLElement; speed: number } => line.el !== null)
      .map((line) => ({ el: line.el, speed: line.speed, text: line.el.textContent ?? '' }))
    sequence.forEach((line) => {
      line.el.textContent = ''
    })

    const tw = gsap.timeline({ delay: 0.2 })
    sequence.forEach((line) => {
      tw.to(line.el, { text: line.text, duration: Math.max(0.2, line.text.length * line.speed), ease: 'none' }, '>0.1')
    })
    tw.to('.nf-cursor', { opacity: 1, duration: 0.1 }, '>-0.05')

    tw.add(() => {
      if (!accentEl.value) {
        return
      }
      gsap
        .timeline({ repeat: -1, repeatDelay: 1.8 })
        .to(accentEl.value, { skewX: 12, x: -5, duration: 0.05, ease: 'power1.inOut' })
        .to(accentEl.value, { skewX: -9, x: 5, y: -3, duration: 0.05 })
        .to(accentEl.value, { skewX: 0, x: 0, y: 0, duration: 0.05 })
    })
  }, root)
})

onBeforeUnmount(() => {
  ctx?.revert()
})
</script>

<template lang="pug">
section.nf.relative.flex.h-full.items-center.overflow-hidden.bg-site-background(ref="rootEl")
  .nf-rain.absolute.inset-0.overflow-hidden.pointer-events-none(aria-hidden="true")
    span.nf-glyph.absolute.top-0.font-jp.leading-none.will-change-transform(
      v-for="(g, i) in RAIN"
      :key="i"
      :class="i % 4 === 0 ? 'text-site-secondary' : 'text-site-muted'"
      :style="{ left: `${g.left}%`, fontSize: `${g.size}rem`, opacity: g.dim }"
    ) {{ g.char }}

  .site-container.relative.z-10
    p.font-mono.font-semibold.leading-none.text-site-heading(ref="numberEl" class="text-[clamp(5rem,22vw,16rem)] tracking-[-0.04em]") {{ t('notFound.eyebrow') }}
    h1.mt-2.font-semibold.text-site-heading(class="text-[clamp(1.8rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.02em]")
      span(ref="titleEl") {{ t('notFound.title') }}
      span.inline-block.text-site-secondary(ref="accentEl" class="ml-[0.25em]") {{ t('notFound.accent') }}
    p.mt-6.max-w-xl.text-lg.text-site-muted
      span(ref="subtitleEl") {{ t('notFound.subtitle') }}
      span.nf-cursor.ml-1.inline-block.opacity-0(aria-hidden="true")
    RouterLink.mt-10.inline-block(:to="homePath")
      StdButton.min-h-11.rounded-full.px-6(variant="primary") {{ t('notFound.cta') }}
</template>

<style scoped lang="scss">
/* Fade the digital rain at the top and bottom edges. */
.nf-rain {
  mask-image: linear-gradient(to bottom, transparent, #000 16%, #000 84%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, #000 16%, #000 84%, transparent);
}

/* Typewriter cursor — blinks via visibility so GSAP keeps control of opacity. */
.nf-cursor {
  width: 0.55ch;
  height: 1.05em;
  vertical-align: text-bottom;
  background: var(--site-secondary);
  animation: nf-blink 1s steps(1) infinite;
}

@keyframes nf-blink {
  0%,
  50% {
    visibility: visible;
  }
  50.01%,
  100% {
    visibility: hidden;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nf-cursor {
    display: none;
  }
}
</style>
