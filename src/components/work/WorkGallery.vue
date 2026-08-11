<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, onUnmounted, ref, type PropType } from 'vue'

import { prefersReducedMotion } from '@/utils/motion'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  images: { type: Array as PropType<string[]>, required: true },
  label: { type: String, required: true },
})

// MARK: - Variables
// Plain arrays — GSAP/layout only need stable element handles.
const gridEl = ref<HTMLElement | null>(null)
const items: HTMLElement[] = []
const triggers: ScrollTrigger[] = []

// MARK: - Methods
const setItemRef = (el: Element | null | { $el?: Element }, index: number) => {
  if (el instanceof HTMLElement) {
    items[index] = el
  }
}

/*
 * Masonry via CSS Grid: rows are 0px, so each item spans as many (gap-separated)
 * rows as its natural content height needs — items keep their aspect ratio and
 * pack tightly in DOM order. Recomputed as images load and on resize.
 */
const layoutItem = (el: HTMLElement) => {
  const grid = gridEl.value
  if (!grid) {
    return
  }
  const styles = window.getComputedStyle(grid)
  const rowGap = parseFloat(styles.rowGap) || 0
  const rowHeight = parseFloat(styles.gridAutoRows) || 0
  const img = el.querySelector('img')
  const height = (img ?? el).getBoundingClientRect().height
  const span = Math.max(1, Math.ceil((height + rowGap) / (rowHeight + rowGap)))
  el.style.gridRowEnd = `span ${span}`
}

const layoutAll = () => {
  items.forEach((el) => el && layoutItem(el))
}

const onImgLoad = (event: Event) => {
  const item = (event.target as HTMLElement).closest<HTMLElement>('.work-masonry-item')
  if (item) {
    layoutItem(item)
  }
  ScrollTrigger.refresh()
}

// MARK: - Lifecycle
onMounted(() => {
  layoutAll()
  window.addEventListener('resize', layoutAll)

  const reduced = prefersReducedMotion()
  items.forEach((el, index) => {
    if (!el) {
      return
    }
    if (reduced) {
      gsap.set(el, { opacity: 1 })
      return
    }
    gsap.set(el, { opacity: 0, y: 16 })
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          delay: (index % 3) * 0.05,
        })
      },
    })
    triggers.push(trigger)
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', layoutAll)
  while (triggers.length) {
    triggers.pop()?.kill()
  }
})
</script>

<template lang="pug">
section.work-gallery(:aria-label="label")
  .work-masonry.grid.gap-3(ref="gridEl" class="grid-cols-2 md:grid-cols-3")
    figure.work-masonry-item.self-start.overflow-hidden.border(
      v-for="(src, i) in images"
      :key="src + i"
      :ref="(el) => setItemRef(el, i)"
      class="rounded-[14px] border-[color-mix(in_oklab,var(--site-border)_60%,transparent)] bg-[color-mix(in_oklab,var(--site-surface)_60%,transparent)] opacity-0"
    )
      img.block.w-full.h-auto(
        :src="src"
        :alt="`${label} — image ${i + 1}`"
        loading="lazy"
        decoding="async"
        draggable="false"
        @load="onImgLoad"
      )
</template>

<style scoped lang="scss">
/* 0px rows let grid-row-end spans size each item to its image height. */
.work-masonry {
  grid-auto-rows: 0;
}
</style>
