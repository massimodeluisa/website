<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { useI18n } from '@/i18n'
import { prefersReducedMotion } from '@/utils/motion'

gsap.registerPlugin(ScrollTrigger)

// MARK: - Composables

const { t } = useI18n()

// MARK: - Variables

const stageEl = ref<HTMLElement | null>(null)
const frameEl = ref<HTMLElement | null>(null)
const innerEl = ref<HTMLElement | null>(null)
const captionEl = ref<HTMLElement | null>(null)

let portraitScrollTrigger: ScrollTrigger | null = null
let mouseMoveHandler: ((e: PointerEvent) => void) | null = null
let mouseLeaveHandler: (() => void) | null = null
let xQuick: gsap.QuickToFunc | null = null
let yQuick: gsap.QuickToFunc | null = null
let rotQuick: gsap.QuickToFunc | null = null
let rotXQuick: gsap.QuickToFunc | null = null
let rotYQuick: gsap.QuickToFunc | null = null
let glareXQuick: gsap.QuickToFunc | null = null
let glareYQuick: gsap.QuickToFunc | null = null
let glareOpQuick: gsap.QuickToFunc | null = null

// MARK: - Methods

// TODO: drop this wrapper once gsap.quickTo's property param is typed to accept template-literal CSS custom property names natively
const setCssVarQuickTo = (
  target: HTMLElement,
  prop: `--${string}`,
  opts: Parameters<typeof gsap.quickTo>[2],
) => gsap.quickTo(target, prop, opts)

// MARK: - Lifecycle

onMounted(() => {
  if (!stageEl.value) {
    return
  }

  const reduced = prefersReducedMotion()

  if (reduced) {
    gsap.set(stageEl.value, { opacity: 1, scale: 1, y: 0 })
    if (innerEl.value) {
      gsap.set(innerEl.value, { opacity: 1, scale: 1.15, y: 0, rotation: 0 })
    }
    if (captionEl.value) {
      gsap.set(captionEl.value, { opacity: 1, y: 0 })
    }
    return
  }

  gsap.fromTo(
    stageEl.value,
    { opacity: 0, scale: 0.96, y: 24 },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1.05,
      ease: 'power3.out',
      delay: 0.12,
    },
  )

  if (innerEl.value) {
    /*
     * Keep |yPercent| under the scale buffer ((1.15 - 1) / 2 ≈ 7.5%) so the
     * parallax never lifts the image off the frame and exposes its background.
     */
    portraitScrollTrigger = gsap.to(innerEl.value, {
      yPercent: -5,
      ease: 'none',
      scrollTrigger: {
        trigger: stageEl.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.35,
      },
    }) as unknown as ScrollTrigger
  }

  if (innerEl.value && frameEl.value) {
    const inner = innerEl.value
    const frame = frameEl.value

    xQuick = gsap.quickTo(inner, 'x', { duration: 0.85, ease: 'power2.out' })
    yQuick = gsap.quickTo(inner, 'y', { duration: 0.85, ease: 'power2.out' })
    rotQuick = gsap.quickTo(inner, 'rotation', { duration: 0.9, ease: 'power2.out' })

    rotXQuick = gsap.quickTo(frame, 'rotationX', { duration: 0.55, ease: 'power3.out' })
    rotYQuick = gsap.quickTo(frame, 'rotationY', { duration: 0.55, ease: 'power3.out' })
    glareXQuick = setCssVarQuickTo(frame, '--glare-x', { duration: 0.4, ease: 'power2.out' })
    glareYQuick = setCssVarQuickTo(frame, '--glare-y', { duration: 0.4, ease: 'power2.out' })
    glareOpQuick = setCssVarQuickTo(frame, '--glare-opacity', {
      duration: 0.45,
      ease: 'power2.out',
    })

    mouseMoveHandler = (e: PointerEvent) => {
      if (!stageEl.value) {
        return
      }
      const rect = stageEl.value.getBoundingClientRect()
      const relX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const relY = ((e.clientY - rect.top) / rect.height - 0.5) * 2

      xQuick?.(relX * 5.2)
      yQuick?.(relY * 4.0)
      rotQuick?.(relX * -0.55 + relY * 0.25)

      rotYQuick?.(relX * 10)
      rotXQuick?.(relY * -8)

      const px = ((e.clientX - rect.left) / rect.width) * 100
      const py = ((e.clientY - rect.top) / rect.height) * 100
      glareXQuick?.(px)
      glareYQuick?.(py)
      glareOpQuick?.(0.55)
    }

    mouseLeaveHandler = () => {
      xQuick?.(0)
      yQuick?.(0)
      rotQuick?.(0)
      rotXQuick?.(0)
      rotYQuick?.(0)
      glareOpQuick?.(0)
    }

    stageEl.value.addEventListener('pointermove', mouseMoveHandler as EventListener, {
      passive: true,
    })
    stageEl.value.addEventListener('pointerleave', mouseLeaveHandler as EventListener)
  }

  if (captionEl.value) {
    gsap.fromTo(
      captionEl.value,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.95 },
    )
  }
})

onUnmounted(() => {
  if (portraitScrollTrigger) {
    portraitScrollTrigger.kill()
    portraitScrollTrigger = null
  }

  const p = stageEl.value
  if (p && mouseMoveHandler) {
    p.removeEventListener('pointermove', mouseMoveHandler as EventListener)
  }
  if (p && mouseLeaveHandler) {
    p.removeEventListener('pointerleave', mouseLeaveHandler as EventListener)
  }

  mouseMoveHandler = null
  mouseLeaveHandler = null
  xQuick = null
  yQuick = null
  rotQuick = null
  rotXQuick = null
  rotYQuick = null
  glareXQuick = null
  glareYQuick = null
  glareOpQuick = null

  if (innerEl.value) {
    gsap.killTweensOf(innerEl.value)
  }
})
</script>

<template lang="pug">
.portrait-stage.relative.justify-self-center(
  ref="stageEl"
  style="perspective: 1200px; perspective-origin: 50% 50%"
  class="w-[min(320px,72vw)] md:w-[380px] lg:w-[420px] md:justify-self-end"
)
  .hero-portrait-frame.relative.rounded-2xl.border.border-site-border.bg-site-primary.shadow-xl(
    ref="frameEl"
    class="aspect-[4/3.15]"
  )
    .hero-portrait-clip.absolute.inset-0.overflow-hidden.rounded-2xl
      .absolute.inset-0(
        ref="innerEl"
        style="transform: scale(1.15); will-change: transform;"
      )
        img.absolute.inset-0.h-full.w-full.object-cover(
          src="@/assets/me-squared-clean.webp"
          :alt="t('hero.portraitAlt')"
          loading="eager"
          decoding="async"
        )
      .absolute.inset-0.pointer-events-none(
        class="bg-gradient-to-b from-black/10 via-transparent to-black/30 lg:to-black/20"
      )
    .hero-portrait-glare(aria-hidden="true")
</template>

<style scoped lang="scss">
.hero-portrait-frame {
  --glare-x: 50%;
  --glare-y: 50%;
  --glare-opacity: 0;
  transform-origin: 50% 50%;
  will-change: transform;
  transition: box-shadow 0.45s ease;
}

/* Multi-layer shadow driven by theme colour — not expressible in Tailwind. */
.portrait-stage:hover .hero-portrait-frame {
  box-shadow:
    0 30px 60px -20px color-mix(in oklab, var(--site-heading) 32%, transparent),
    0 18px 30px -16px color-mix(in oklab, var(--site-heading) 22%, transparent);
}

/* Glare: dynamic CSS vars + radial color-mix gradient + mix-blend-mode. */
.hero-portrait-glare {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  background: radial-gradient(
    circle at var(--glare-x) var(--glare-y),
    color-mix(in oklab, white 60%, transparent) 0%,
    color-mix(in oklab, white 16%, transparent) 22%,
    transparent 55%
  );
  mix-blend-mode: overlay;
  opacity: var(--glare-opacity);
  z-index: 3;
  transition: opacity 0.4s ease;
}

@media (prefers-reduced-motion: reduce) {
  .hero-portrait-frame {
    transform: none !important;
  }
  .hero-portrait-glare {
    display: none;
  }
}
</style>
