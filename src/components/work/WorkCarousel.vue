<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

import { useLocale } from '@/composables/use-locale'
import { worksFor } from '@/contents/works'
import { useI18n } from '@/i18n'
import { prefersReducedMotion } from '@/utils/motion'

// MARK: - Composables
const { t } = useI18n()
const { current } = useLocale()

// MARK: - Variables
const index = ref(0)
let timer: number | undefined

// MARK: - Computed
const works = computed(() => worksFor(current.value))
const labelTotal = computed(() => String(works.value.length).padStart(2, '0'))
const labelCurrent = computed(() => String(index.value + 1).padStart(2, '0'))
const labelTitle = computed(() => works.value[index.value]?.title ?? '')

// MARK: - Lifecycle
onMounted(() => {
  if (prefersReducedMotion()) {
    return
  }
  timer = window.setInterval(() => {
    index.value = (index.value + 1) % works.value.length
  }, 2400)
})

onUnmounted(() => {
  if (timer != null) {
    clearInterval(timer)
  }
})
</script>

<template lang="pug">
.work-carousel.absolute.inset-0.overflow-hidden.isolate(
  aria-hidden="true"
  class="rounded-[inherit] bg-[#111]"
)
  .absolute.inset-0
    img.work-carousel-image.absolute.inset-0.size-full.object-cover(
      v-for="(work, i) in works"
      :key="work.slug"
      :src="work.coverUrl"
      :alt="work.title"
      :class="{ 'is-active': i === index }"
      loading="lazy"
      decoding="async"
      draggable="false"
    )

  .work-carousel-veil.absolute.inset-0.pointer-events-none
  .work-carousel-grain.absolute.inset-0.pointer-events-none(class="opacity-[0.18] mix-blend-overlay")

  .work-carousel-top.absolute.flex.items-baseline.justify-between.gap-4(
    class="z-[2] top-[calc(var(--site-header-offset)+clamp(0.5rem,1.2vw,1rem))] left-[clamp(1.25rem,2.2vw,2rem)] right-[clamp(1.25rem,2.2vw,2rem)]"
  )
    span.font-mono.font-semibold.uppercase.text-white(
      class="text-[clamp(0.8rem,0.95vw,1rem)] tracking-[0.22em]"
    ) {{ t('work.kicker') }}
    span.font-mono.font-semibold.uppercase.text-white(
      class="text-[clamp(0.8rem,0.95vw,1rem)]"
    ) {{ labelCurrent }}
      span.opacity-60  /  {{ labelTotal }}

  .work-carousel-bottom.absolute(
    class="z-[2] left-[clamp(1.25rem,2.2vw,2rem)] right-[clamp(1.25rem,2.2vw,2rem)] bottom-[clamp(1.25rem,2.2vw,2rem)]"
  )
    p.m-0.font-semibold.text-white(
      class="leading-[1.05] text-[clamp(2rem,3.2vw,3.75rem)] tracking-[-0.02em] animate-[work-carousel-title-in_0.55s_ease]"
      :key="labelTitle"
    ) {{ labelTitle }}
</template>

<style scoped lang="scss">
// Ken-Burns crossfade for cover images
.work-carousel-image {
  opacity: 0;
  transition:
    opacity 0.9s ease,
    transform 4.2s ease-out;
  transform: scale(1.08);

  &.is-active {
    opacity: 1;
    transform: scale(1);
  }
}

// Multi-layer gradient veil — too complex for a single arbitrary utility
.work-carousel-veil {
  background: linear-gradient(
    180deg,
    color-mix(in oklab, black 30%, transparent) 0%,
    color-mix(in oklab, black 5%, transparent) 38%,
    color-mix(in oklab, black 8%, transparent) 60%,
    color-mix(in oklab, black 55%, transparent) 100%
  );
}

// Dot-grain texture — radial-gradient background-image stays in SCSS
.work-carousel-grain {
  background-image: radial-gradient(
    circle,
    color-mix(in oklab, white 20%, transparent) 1px,
    transparent 1.2px
  );
  background-size: 18px 18px;
}
</style>
