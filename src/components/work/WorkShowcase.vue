<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch, type PropType } from 'vue'

import gsap from 'gsap'

import { prefersReducedMotion } from '@/utils/motion'

const props = defineProps({
  images: { type: Array as PropType<string[]>, required: true },
  label: { type: String, required: true },
})

// MARK: - Variables

const rootEl = ref<HTMLElement | null>(null)
let frames: HTMLElement[] = []
let timer: number | undefined
let index = 0

/*
 * Ken Burns motion chosen by the image's own aspect ratio:
 *  - wide images (banner, the iOS/Android composites) shift right→left so the
 *    content scans naturally left-to-right;
 *  - tall screenshots pan top→bottom;
 *  - the rest gently zoom (alternating, for variety).
 */
const PAN_LTR = { from: { xPercent: 7, scale: 1.12 }, to: { xPercent: -7, scale: 1.12 } }
const PAN_DOWN = { from: { yPercent: 7, scale: 1.14 }, to: { yPercent: -7, scale: 1.14 } }
const ZOOM_IN = { from: { scale: 1.0 }, to: { scale: 1.15 } }
const ZOOM_OUT = { from: { scale: 1.15 }, to: { scale: 1.02 } }

const HOLD = 4 // seconds a frame stays before advancing
const FADE = 1.2 // crossfade duration

// MARK: - Methods

const effectFor = (el: HTMLElement, i: number) => {
  const img = el as HTMLImageElement
  /* Default to wide while the image is still loading (the cover is wide). */
  const aspect = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1.6
  if (aspect >= 1.4) {
    return PAN_LTR
  }
  if (aspect <= 0.92) {
    return PAN_DOWN
  }
  return i % 2 === 0 ? ZOOM_IN : ZOOM_OUT
}

const showSlide = (i: number, instant = false) => {
  const el = frames[i]
  if (!el) {
    return
  }
  const effect = effectFor(el, i)
  gsap.killTweensOf(el)
  gsap.set(el, { ...effect.from, zIndex: 2 })
  /* Keep drifting through the crossfade so motion never visibly stops. */
  gsap.to(el, { ...effect.to, duration: HOLD + FADE, ease: 'none' })
  gsap.to(el, { autoAlpha: 1, duration: instant ? 0 : FADE, ease: 'power1.inOut' })

  frames.forEach((other, j) => {
    if (j === i) {
      return
    }
    gsap.to(other, {
      autoAlpha: 0,
      duration: instant ? 0 : FADE,
      ease: 'power1.inOut',
      overwrite: 'auto',
      onComplete: () => gsap.set(other, { zIndex: 0 }),
    })
  })
}

const stop = () => {
  if (timer) {
    window.clearInterval(timer)
    timer = undefined
  }
  if (frames.length) {
    gsap.killTweensOf(frames)
  }
}

const start = () => {
  if (!rootEl.value) {
    return
  }
  frames = Array.from(rootEl.value.querySelectorAll<HTMLElement>('.ks-frame'))
  if (!frames.length) {
    return
  }

  /* Reduced motion or a single image: show it, no drift, no cycling. */
  if (prefersReducedMotion() || frames.length === 1) {
    gsap.set(frames, { autoAlpha: 0, clearProps: 'transform' })
    const first = frames[0]
    if (first) {
      gsap.set(first, { autoAlpha: 1, zIndex: 1 })
    }
    return
  }

  gsap.set(frames, { autoAlpha: 0 })
  index = 0
  showSlide(0, true)
  timer = window.setInterval(() => {
    index = (index + 1) % frames.length
    showSlide(index)
  }, HOLD * 1000)
}

// MARK: - Lifecycle

onMounted(start)

watch(
  () => props.images,
  () => {
    stop()
    nextTick(start)
  },
)

onUnmounted(stop)
</script>

<template lang="pug">
.relative.size-full.overflow-hidden.isolate(ref="rootEl")
  img.ks-frame.absolute.inset-0.size-full.object-cover.opacity-0.will-change-transform(
    v-for="(src, i) in images"
    :key="src + i"
    :src="src"
    :alt="`${label} — ${i + 1}`"
    decoding="async"
    draggable="false"
  )
</template>
