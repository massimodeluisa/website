import { onUnmounted } from 'vue'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'

import { prefersReducedMotion } from '@/utils/motion'

gsap.registerPlugin(ScrollTrigger, TextPlugin)

// MARK: - Types

export interface ITypewriterOptions {
  /** Element whose viewport entry/exit drives the effect. Defaults to the first target. */
  trigger?: HTMLElement | null
  /** ScrollTrigger start position. */
  start?: string
  /** Characters typed per second. */
  cps?: number
  /** Pause (seconds) inserted before each element after the first. */
  gap?: number
}

// MARK: - Composable

/*
 * Scroll-driven typewriter. Reads each element's rendered text, clears it, and
 * types it back character-by-character on entry (TextPlugin). The same timeline
 * runs in reverse on exit — `toggleActions: 'play none none reverse'` — so the
 * text un-types when the reader scrolls back above it. "Both sides": comparsa
 * (type-in) and scomparsa (type-out).
 */
export function useTypewriter() {
  // MARK: - Variables

  const triggers: ScrollTrigger[] = []
  const timelines: gsap.core.Timeline[] = []

  // MARK: - Methods

  function typewriterOnScroll(
    els: Array<HTMLElement | null>,
    opts: ITypewriterOptions = {},
  ): () => void {
    const elements = els.filter((el): el is HTMLElement => Boolean(el))
    if (!elements.length) {
      return () => {}
    }

    if (prefersReducedMotion()) {
      elements.forEach((el) => gsap.set(el, { opacity: 1 }))
      return () => {}
    }

    const { trigger, start = 'top 80%', cps = 30, gap = 0.12 } = opts

    /* Snapshot the rendered text, then start from empty so TextPlugin owns it. */
    const targets = elements.map((el) => el.textContent ?? '')
    elements.forEach((el) => {
      el.textContent = ''
      gsap.set(el, { opacity: 1 })
    })

    const tl = gsap.timeline({ paused: true })
    elements.forEach((el, index) => {
      const text = targets[index] ?? ''
      const duration = Math.max(0.25, text.length / cps)
      tl.to(el, { text: { value: text }, duration, ease: 'none' }, index === 0 ? 0 : `+=${gap}`)
    })

    const st = ScrollTrigger.create({
      trigger: trigger ?? elements[0],
      start,
      toggleActions: 'play none none reverse',
      animation: tl,
    })

    triggers.push(st)
    timelines.push(tl)

    return () => {
      st.kill()
      tl.kill()
      const ti = triggers.indexOf(st)
      if (ti !== -1) triggers.splice(ti, 1)
      const li = timelines.indexOf(tl)
      if (li !== -1) timelines.splice(li, 1)
    }
  }

  function cleanup() {
    while (timelines.length) {
      timelines.pop()?.kill()
    }
    while (triggers.length) {
      triggers.pop()?.kill()
    }
  }

  // MARK: - Lifecycle

  onUnmounted(cleanup)

  return { typewriterOnScroll, cleanup }
}
