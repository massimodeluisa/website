<script setup lang="ts">
import { computed, type PropType } from 'vue'

import type { TWorkCaseStudy } from '@/contents/works'
import { useI18n } from '@/i18n'

import WorkShowcase from './WorkShowcase.vue'

const props = defineProps({
  work: { type: Object as PropType<TWorkCaseStudy>, required: true },
  index: { type: Number, required: true },
  total: { type: Number, required: true },
})

const emit = defineEmits(['open'])

// MARK: - Composables
const { t } = useI18n()

// MARK: - Computed
const number = computed(() => String(props.index + 1).padStart(2, '0'))
const totalNumber = computed(() => String(props.total).padStart(2, '0'))

const stageImages = computed(() => props.work.showcase)

// MARK: - Methods
const handleOpen = () => emit('open', props.work.slug)
</script>

<template lang="pug">
.work-stage-layout.absolute.inset-0.overflow-hidden.bg-site-background.grid(
  :data-slug="work.slug"
  class="grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] max-lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
)
  .work-stage-visual.relative.overflow-hidden.isolate(
    aria-hidden="true"
    class="bg-[#111]"
  )
    WorkShowcase.work-stage-cover(:images="stageImages" :label="work.title")
    .work-stage-cover-overlay.absolute.inset-0.pointer-events-none
    .work-stage-cover-grain.absolute.inset-0.pointer-events-none(
      class="opacity-[0.16] mix-blend-overlay"
    )

    .absolute.flex.justify-between.gap-4(
      class="z-[2] top-[calc(var(--site-header-offset)+clamp(0.75rem,1.6vw,1.5rem))] left-[clamp(1.5rem,3vw,2.75rem)] right-[clamp(1.5rem,3vw,2.75rem)]"
    )
      span.font-mono.text-xs.font-semibold.text-white(
        class="tracking-[0.24em]"
      ) {{ number }}
        span.opacity-60  /  {{ totalNumber }}
      span.font-mono.text-xs.font-semibold.uppercase.text-white(
        class="tracking-[0.22em] opacity-90"
      ) {{ work.eyebrow }}

    .absolute(
      class="z-[2] bottom-[clamp(1.75rem,3.5vw,3rem)] left-[clamp(1.75rem,3.5vw,3rem)] right-[clamp(1.75rem,3.5vw,3rem)]"
    )
      h3.m-0.font-semibold.leading-none.text-white.text-balance(
        class="text-[clamp(2.5rem,4.8vw,5.5rem)] max-lg:text-[clamp(2.25rem,5.4vw,4rem)] tracking-[-0.02em]"
      ) {{ work.title }}
      p.font-mono.text-xs.uppercase.text-white(
        class="mt-[clamp(0.85rem,1.5vw,1.25rem)] tracking-[0.2em] opacity-80"
      ) {{ work.period }} · {{ work.role }}

  .work-stage-content.relative.flex.flex-col.justify-between.gap-8.bg-site-surface.border-l.border-site-border.min-h-0(
    class="px-[clamp(1.5rem,3vw,3rem)] pt-[calc(var(--site-header-offset)+clamp(0.75rem,1.6vw,1.5rem))] pb-[clamp(1.75rem,4vw,3rem)]"
  )
    .flex.flex-col.min-h-0(class="gap-[clamp(1rem,2vw,1.5rem)]")
      p.m-0.font-mono.text-xs.font-semibold.uppercase.text-site-secondary(
        class="tracking-[0.22em]"
      ) {{ t('work.kicker') }}
      p.m-0.font-medium.text-site-heading(
        class="text-lg leading-relaxed md:text-xl md:leading-relaxed lg:text-2xl lg:leading-relaxed"
      ) {{ work.summary }}

      ul.m-0.list-none.flex.flex-col.p-0(
        v-if="work.highlights.length"
        class="gap-[0.8rem]"
      )
        li.flex.items-start(
          v-for="h in work.highlights.slice(0, 3)"
          :key="h"
          class="gap-[0.7rem] text-md leading-[1.55] text-site-muted"
        )
          span.shrink-0.rounded-full.bg-site-secondary(
            aria-hidden="true"
            class="mt-[0.55rem] size-[5px]"
          )
          span {{ h }}

    .flex.flex-col(class="gap-[clamp(1rem,2vw,1.5rem)]")
      .flex.flex-wrap(
        v-if="work.stack.length"
        class="gap-[0.4rem]"
      )
        span.whitespace-nowrap.rounded-full.border.border-site-border.font-mono.text-site-muted(
          v-for="s in work.stack.slice(0, 6)"
          :key="s"
          class="px-[10px] py-[3px] text-[11px]"
        ) {{ s }}

      button.work-stage-cta.inline-flex.cursor-pointer.items-center.self-start.rounded-full.font-medium.bg-site-heading.text-site-background(
        type="button"
        class="transition-[background,transform] gap-[0.65rem] px-5 py-3 text-[14px] duration-[250ms] ease-in-out hover:bg-site-secondary hover:-translate-y-px"
        @click="handleOpen"
      )
        span {{ t('work.viewProject') }}
        span.work-stage-cta-arrow.transition-transform(
          class="duration-[250ms] ease-in-out"
          aria-hidden="true"
        ) →
</template>

<style scoped lang="scss">
// Filter not expressible as a Tailwind utility
.work-stage-cover {
  filter: saturate(1.05) contrast(1.02) brightness(0.82);
}

// Multi-layer gradient overlay — stays in SCSS
.work-stage-cover-overlay {
  background: linear-gradient(
    180deg,
    color-mix(in oklab, black 34%, transparent) 0%,
    color-mix(in oklab, black 8%, transparent) 26%,
    color-mix(in oklab, black 40%, transparent) 60%,
    color-mix(in oklab, black 90%, transparent) 100%
  );
}

.work-stage-layout .text-white {
  text-shadow:
    0 1px 3px color-mix(in oklab, black 55%, transparent),
    0 4px 22px color-mix(in oklab, black 45%, transparent);
}

// Dot-grain texture
.work-stage-cover-grain {
  background-image: radial-gradient(
    circle,
    color-mix(in oklab, white 18%, transparent) 1px,
    transparent 1.2px
  );
  background-size: 22px 22px;
}

// Arrow nudge on CTA hover — nested child selector, not expressible with plain utilities
.work-stage-cta:hover .work-stage-cta-arrow {
  transform: translateX(3px);
}
</style>
