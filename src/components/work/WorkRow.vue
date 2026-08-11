<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, type PropType } from 'vue'

import gsap from 'gsap'

import type { TWorkCaseStudy } from '@/contents/works'
import { prefersReducedMotion } from '@/utils/motion'

const props = defineProps({
  work: { type: Object as PropType<TWorkCaseStudy>, required: true },
  index: { type: Number, required: true },
  total: { type: Number, required: true },
})

const emit = defineEmits(['open'])

// MARK: - Variables
const previewEl = ref<HTMLElement | null>(null)
let hoverTl: gsap.core.Timeline | undefined

// MARK: - Computed
const number = computed(() => String(props.index + 1).padStart(2, '0'))

// MARK: - Methods
const handleClick = () => emit('open', props.work.slug)

const onEnter = () => {
  if (!previewEl.value || prefersReducedMotion()) {
    return
  }
  hoverTl?.kill()
  hoverTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  hoverTl.to(previewEl.value, { opacity: 1, x: 0, scale: 1, duration: 0.45 }, 0)
}

const onLeave = () => {
  if (!previewEl.value || prefersReducedMotion()) {
    return
  }
  hoverTl?.kill()
  hoverTl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })
  hoverTl.to(previewEl.value, { opacity: 0, x: 24, scale: 0.96, duration: 0.3 }, 0)
}

// MARK: - Lifecycle
onMounted(() => {
  if (previewEl.value) {
    gsap.set(previewEl.value, { opacity: 0, x: 24, scale: 0.96 })
  }
})

onUnmounted(() => {
  hoverTl?.kill()
})
</script>

<template lang="pug">
button.work-row.group.relative.block.w-full.cursor-pointer.bg-transparent.text-left(
  type="button"
  :aria-label="`${work.title}, ${work.eyebrow}`"
  class="py-[clamp(1.5rem,2.5vw,2.25rem)] border-b last:border-b-0 border-[color-mix(in_oklab,var(--site-border)_80%,transparent)]"
  @click="handleClick"
  @mouseenter="onEnter"
  @mouseleave="onLeave"
)
  .flex.w-full.gap-8
    span.work-row-number.inline-flex.items-center.self-center.font-mono.text-xs.font-semibold.text-site-muted(
      class="min-h-[1.2em] tracking-[0.18em]"
    ) {{ number }}

    .mr-auto.min-w-0(class="mt-1 md:mt-0")
      h3.font-semibold.leading-tight.text-site-heading.transition-colors(
        class="text-2xl md:text-3xl lg:text-4xl tracking-[-0.01em] group-hover:text-site-link-hover"
      ) {{ work.title }}
      p.mt-2.line-clamp-2.text-sm.text-site-muted(class="lg:max-w-2xl") {{ work.summary }}

    span.self-center.font-mono.text-xl.text-site-muted.transition-transform(
      class="inline group-hover:translate-x-1 group-hover:text-site-link-hover"
      aria-hidden="true"
    ) →

  .work-row-preview(
    v-if="work.coverUrl"
    ref="previewEl"
    aria-hidden="true"
    class="max-lg:hidden absolute right-0 top-1/2 -translate-y-1/2 w-[240px] h-[144px] rounded-xl overflow-hidden pointer-events-none z-[5] bg-site-surface border border-[var(--site-border-soft)] shadow-[0_18px_48px_color-mix(in_oklab,var(--site-heading)_14%,transparent)]"
  )
    img.block.size-full.object-cover(
      :src="work.coverUrl"
      :alt="work.title"
      loading="lazy"
      decoding="async"
      draggable="false"
    )
</template>
