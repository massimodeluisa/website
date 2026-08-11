import { onUnmounted, type Ref } from 'vue'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// MARK: - Types

export interface IWorkMorphRefs {
  headerArea: Ref<HTMLElement | null>
  track: Ref<HTMLElement | null>
  stage: Ref<HTMLElement | null>
  previewSlot: Ref<HTMLElement | null>
  layerPreview: Ref<HTMLElement | null>
  layerFull: Ref<HTMLElement | null>
}

export interface IWorkMorphOptions {
  prefersReducedMotion: () => boolean
}

export interface IWorkMorphMeasurement {
  x: number
  y: number
  scaleX: number
  scaleY: number
}

export interface IWorkMorphHandles {
  setup: () => void
  teardown: () => void
  measureFrom: () => IWorkMorphMeasurement | null
}

// MARK: - Composable

/*
 * Scroll distance (px) the small-preview → fullscreen morph is spread across.
 * Larger = the card grows more gradually as you scroll past the work header.
 */
const MORPH_SCROLL_PX = 520

export function useWorkMorph(refs: IWorkMorphRefs, opts: IWorkMorphOptions): IWorkMorphHandles {
  // MARK: - Variables

  const tweens: Array<gsap.core.Tween | gsap.core.Timeline> = []
  const triggers: ScrollTrigger[] = []

  /* Shared scrub range so morph + both crossfades stay perfectly in step. */
  const morphRange = () => ({
    start: 'bottom bottom',
    end: `bottom bottom-=${MORPH_SCROLL_PX}`,
    scrub: 0.4,
  })

  // MARK: - Methods

  const measureFrom = (): IWorkMorphMeasurement | null => {
    // SSR/SSG guard: window is unavailable during pre-render
    if (typeof window === 'undefined') {
      return null
    }
    const slot = refs.previewSlot.value
    const track = refs.track.value
    if (!slot || !track) {
      return null
    }
    const slotRect = slot.getBoundingClientRect()
    const trackRect = track.getBoundingClientRect()
    return {
      x: slotRect.left,
      y: slotRect.top + window.scrollY - (trackRect.top + window.scrollY),
      scaleX: slotRect.width / window.innerWidth,
      scaleY: slotRect.height / window.innerHeight,
    }
  }

  const setup = () => {
    const stage = refs.stage.value
    const previewLayer = refs.layerPreview.value
    const fullLayer = refs.layerFull.value
    const headerArea = refs.headerArea.value
    const slot = refs.previewSlot.value
    if (!stage || !previewLayer || !fullLayer || !slot) {
      return
    }

    if (opts.prefersReducedMotion()) {
      gsap.set(stage, { autoAlpha: 1 })
      gsap.set(previewLayer, { autoAlpha: 0 })
      gsap.set(fullLayer, { autoAlpha: 1 })
      return
    }

    gsap.set(stage, { transformOrigin: 'top left' })
    let from = measureFrom()
    if (!from) {
      return
    }
    gsap.set(stage, {
      x: from.x,
      y: from.y,
      scaleX: from.scaleX,
      scaleY: from.scaleY,
      borderRadius: 18,
    })
    gsap.set(previewLayer, { autoAlpha: 1 })
    gsap.set(fullLayer, { autoAlpha: 0 })

    const triggerEl = headerArea ?? slot

    const morphTween = gsap.fromTo(
      stage,
      {
        x: () => from?.x ?? 0,
        y: () => from?.y ?? 0,
        scaleX: () => from?.scaleX ?? 1,
        scaleY: () => from?.scaleY ?? 1,
        borderRadius: 18,
      },
      {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        borderRadius: 0,
        ease: 'power3.inOut',
        immediateRender: true,
        scrollTrigger: {
          trigger: triggerEl,
          ...morphRange(),
          invalidateOnRefresh: true,
          onRefresh: () => {
            const next = measureFrom()
            if (next) {
              from = next
            }
          },
        },
      },
    )
    tweens.push(morphTween)
    if (morphTween.scrollTrigger) {
      triggers.push(morphTween.scrollTrigger)
    }

    const fadePrev = gsap.fromTo(
      previewLayer,
      { autoAlpha: 1 },
      {
        autoAlpha: 0,
        ease: 'power2.in',
        scrollTrigger: {
          trigger: triggerEl,
          ...morphRange(),
        },
      },
    )
    tweens.push(fadePrev)
    if (fadePrev.scrollTrigger) {
      triggers.push(fadePrev.scrollTrigger)
    }

    const fadeFull = gsap.fromTo(
      fullLayer,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: triggerEl,
          ...morphRange(),
        },
      },
    )
    tweens.push(fadeFull)
    if (fadeFull.scrollTrigger) {
      triggers.push(fadeFull.scrollTrigger)
    }
  }

  const teardown = () => {
    while (tweens.length) {
      tweens.pop()?.kill()
    }
    while (triggers.length) {
      triggers.pop()?.kill()
    }
    if (refs.stage.value) {
      gsap.set(refs.stage.value, { clearProps: 'all' })
    }
    if (refs.layerPreview.value) {
      gsap.set(refs.layerPreview.value, { clearProps: 'all' })
    }
    if (refs.layerFull.value) {
      gsap.set(refs.layerFull.value, { clearProps: 'all' })
    }
  }

  // MARK: - Lifecycle

  onUnmounted(teardown)

  return { setup, teardown, measureFrom }
}
