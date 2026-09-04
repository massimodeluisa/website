import { onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

import { prefersReducedMotion } from '@/utils/motion'

gsap.registerPlugin(ScrollTrigger, SplitText)

// MARK: - Types

export interface IRevealOptions {
  type?: 'lines' | 'words' | 'chars' | 'lines,words' | 'words,chars'
  duration?: number
  stagger?: number
  ease?: string
  scrollTrigger?: boolean
  start?: string
  delay?: number
  /** When true, animate opacity only (no yPercent slide, no rotationX). */
  fade?: boolean
}

interface IActiveSplit {
  split: SplitText
  wrappers: HTMLElement[]
  revert: () => void
}

// MARK: - Variables

const activeSplits: IActiveSplit[] = []
const activeScrollTriggers: ScrollTrigger[] = []
const elementReveals = new WeakMap<HTMLElement, IActiveSplit>()

// MARK: - Methods

function wrapLinesForMask(lines: HTMLElement[]): HTMLElement[] {
  const inners: HTMLElement[] = []

  lines.forEach((line) => {
    line.style.overflow = 'hidden'

    const inner = document.createElement('div')
    inner.className = 'reveal-line-inner'

    while (line.firstChild) {
      inner.appendChild(line.firstChild)
    }
    line.appendChild(inner)
    inners.push(inner)
  })

  return inners
}

function unwrapLines(lines: HTMLElement[], inners: HTMLElement[]) {
  inners.forEach((inner, i) => {
    const line = lines[i]
    if (!line || !inner) {
      return
    }

    while (inner.firstChild) {
      line.appendChild(inner.firstChild)
    }
    inner.remove()
    line.style.overflow = ''
  })
}

function createReveal(element: HTMLElement | null, options: IRevealOptions = {}): () => void {
  if (!element) {
    return () => {}
  }

  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1, clearProps: 'transform' })
    return () => {}
  }

  const previous = elementReveals.get(element)
  if (previous) {
    previous.revert()
  }

  const {
    type = 'lines',
    duration = 0.9,
    stagger,
    ease = 'power3.out',
    scrollTrigger = true,
    start = 'top 82%',
    delay = 0,
    fade = false,
  } = options

  const split = new SplitText(element, {
    type,
    linesClass: 'reveal-line',
    wordsClass: 'reveal-word',
    charsClass: 'reveal-char',
    /* Keep U+00A0 non-breaking spaces intact so they never split. */
    reduceWhiteSpace: false,
  })

  let targets: HTMLElement[]
  let wrappers: HTMLElement[] = []

  if (type.includes('lines')) {
    wrappers = wrapLinesForMask(split.lines as HTMLElement[])
    targets = wrappers
    gsap.set(targets, fade ? { opacity: 0 } : { yPercent: 118, opacity: 0 })
  } else if (type.includes('chars')) {
    /*
     * Chars sit inside word wrappers (split 'words,chars') so a word never
     * breaks mid-word across lines — only whole words wrap, like normal text.
     */
    targets = split.chars as HTMLElement[]
    gsap.set(targets, fade ? { opacity: 0 } : { yPercent: 105, opacity: 0, rotationX: -12 })
  } else {
    targets = split.words as HTMLElement[]
    gsap.set(targets, fade ? { opacity: 0 } : { yPercent: 85, opacity: 0, rotationX: -8 })
  }

  /*
   * Reveal the parent only AFTER the split children are hidden. Doing it the
   * other way round (parent → 1, then children → 0) leaves a one-frame window
   * where the freshly-split children paint at their natural opacity:1 — the
   * "flash everything, then hide, then animate" artifact. Hiding children first
   * guarantees the parent is never visible with visible children.
   */
  gsap.set(element, { opacity: 1 })

  const computedStagger =
    stagger ?? (type.includes('lines') ? 0.085 : type.includes('chars') ? 0.014 : 0.028)

  const tl = gsap.timeline({
    defaults: { ease },
    delay,
    paused: true,
  })

  tl.to(
    targets,
    fade
      ? { opacity: 1, duration, stagger: computedStagger }
      : { yPercent: 0, opacity: 1, rotationX: 0, duration, stagger: computedStagger },
  )

  let localTrigger: ScrollTrigger | null = null

  if (scrollTrigger) {
    localTrigger = ScrollTrigger.create({
      trigger: element,
      start,
      once: true,
      onEnter: () => {
        tl.play()
      },
    })
    activeScrollTriggers.push(localTrigger)
  } else {
    tl.play()
  }

  const revert = () => {
    tl.kill()

    if (localTrigger) {
      localTrigger.kill()
      const idx = activeScrollTriggers.indexOf(localTrigger)
      if (idx !== -1) {
        activeScrollTriggers.splice(idx, 1)
      }
    }

    if (type.includes('lines') && split.lines && wrappers.length) {
      unwrapLines(split.lines as HTMLElement[], wrappers)
    }

    split.revert()

    elementReveals.delete(element)
  }

  const record: IActiveSplit = { split, wrappers, revert }
  activeSplits.push(record)
  elementReveals.set(element, record)

  return revert
}

// MARK: - Composable

export function useTextReveal() {
  const localReverts: Array<() => void> = []

  function track(revertFn: () => void) {
    localReverts.push(revertFn)
    return revertFn
  }

  function revealLines(el: HTMLElement | null, opts: IRevealOptions = {}) {
    return track(createReveal(el, { type: 'lines', ...opts }))
  }

  function revealWords(el: HTMLElement | null, opts: IRevealOptions = {}) {
    return track(createReveal(el, { type: 'words', duration: 0.75, ...opts }))
  }

  function revealChars(el: HTMLElement | null, opts: IRevealOptions = {}) {
    return track(createReveal(el, { type: 'words,chars', duration: 0.7, stagger: 0.012, ...opts }))
  }

  function revealCharsFade(el: HTMLElement | null, opts: IRevealOptions = {}) {
    return track(
      createReveal(el, { type: 'words,chars', duration: 0.5, stagger: 0.012, fade: true, ...opts }),
    )
  }

  function cleanupAll() {
    localReverts.forEach((fn) => fn())
    localReverts.length = 0

    while (activeSplits.length) {
      const item = activeSplits.pop()
      item?.revert()
    }
    while (activeScrollTriggers.length) {
      activeScrollTriggers.pop()?.kill()
    }
  }

  onUnmounted(() => {
    cleanupAll()
  })

  return {
    revealLines,
    revealWords,
    revealChars,
    revealCharsFade,
    createReveal,
    cleanupAll,
  }
}

export { createReveal as createTextReveal }
