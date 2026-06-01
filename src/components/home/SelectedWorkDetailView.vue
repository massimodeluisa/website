<script setup lang="ts">
import { computed, type CSSProperties, type PropType } from 'vue'

import type { TWorkCaseStudy } from '@/contents/works'
import { useI18n } from '@/i18n'

// MARK: - Composables

const { t } = useI18n()

const props = defineProps({
  work: { type: Object as PropType<TWorkCaseStudy>, required: true },
  activeNumber: { type: Number, required: true },
  total: { type: Number, required: true },
  visualStyle: { type: Object as PropType<CSSProperties>, required: true },
  variant: { type: String as () => 'preview' | 'immersive', required: false, default: undefined },
})

// MARK: - Computed

const isImmersive = computed(() => props.variant === 'immersive')

const layoutClass = computed(() =>
  isImmersive.value
    ? 'max-w-none grid-rows-[minmax(0,0.45fr)_minmax(0,0.55fr)] gap-0 p-0 lg:grid-rows-none lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.78fr)]'
    : 'grid-rows-[minmax(230px,0.86fr)_minmax(0,1fr)] gap-0',
)

const visualClass = computed(() =>
  isImmersive.value
    ? 'rounded-none border-0 lg:border-r lg:border-site-border'
    : 'border-b border-site-border',
)

const titleClass = computed(() => (isImmersive.value ? 'sm:text-5xl md:text-7xl' : 'sm:text-5xl'))

const contentClass = computed(() =>
  isImmersive.value
    ? 'site-card rounded-none border-0 p-5 md:p-8 lg:border-l lg:border-site-border lg:p-12'
    : 'bg-site-background p-5 md:p-6',
)

const summaryClass = computed(() =>
  isImmersive.value
    ? 'text-lg leading-7 md:mt-8 md:text-4xl md:leading-[1.15]'
    : 'text-base leading-7 md:text-lg md:leading-8',
)

// MARK: - Methods

const workInitials = (title: string) =>
  title
    .split(/[\s/&+-]+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part[0]?.toUpperCase())
    .join('')

const formattedNumber = (value: number) => String(value).padStart(2, '0')
const stackPreview = () => props.work.stack.slice(0, 6)
const highlightPreview = () => props.work.highlights.slice(0, 2)
</script>

<template lang="pug">
article.relative.isolate.flex.h-full.w-full.overflow-hidden.text-site-text(
  :style="visualStyle"
  :data-work-detail-immersive="isImmersive ? 'true' : undefined"
  data-work-detail
)
  .absolute.inset-0.bg-site-background(data-work-detail-bg aria-hidden="true")
  .absolute.inset-0(
    class="bg-[radial-gradient(circle,color-mix(in_oklab,var(--site-primary)_16%,transparent)_1px,transparent_1.2px)] bg-[length:18px_18px] opacity-55"
    aria-hidden="true"
  )

  .relative.mx-auto.grid.h-full.w-full.items-stretch(
    :class="layoutClass"
  )
    .relative.flex.min-h-0.overflow-hidden(
      :class="visualClass"
      class="bg-[var(--work-surface)] text-[var(--work-foreground)]"
      data-work-detail-visual
    )
      img.absolute.inset-0.h-full.w-full.object-cover.opacity-85(
        v-if="work.imageUrl"
        :src="work.imageUrl"
        :alt="`${work.title} preview`"
        loading="lazy"
      )
      .absolute.inset-0(v-else class="[background:var(--work-pattern)]")
      .absolute.inset-0(
        class="bg-[radial-gradient(circle,color-mix(in_oklab,var(--work-foreground)_20%,transparent)_1px,transparent_1.2px)] bg-[length:20px_20px] opacity-25"
      )
      .absolute.inset-x-0.bottom-0(
        class="h-1/2 bg-[linear-gradient(180deg,transparent,color-mix(in_oklab,var(--work-surface)_78%,black))]"
      )
      .relative.z-10.flex.w-full.flex-col.justify-between.p-6(class="md:p-8")
        .flex.items-start.justify-between.gap-4
          .flex.size-16.items-center.justify-center.rounded-md.border.font-mono.text-xl.font-semibold(
            class="border-[color-mix(in_oklab,var(--work-foreground)_30%,transparent)] bg-[color-mix(in_oklab,var(--work-surface)_82%,white)]"
          )
            img.max-h-10.max-w-10.object-contain(
              v-if="work.logoUrl"
              :src="work.logoUrl"
              :alt="`${work.title} logo`"
              loading="lazy"
            )
            span(v-else) {{ workInitials(work.title) }}
          p.font-mono.text-xs.uppercase(class="tracking-[0.18em]")
            | {{ formattedNumber(activeNumber) }} / {{ formattedNumber(total) }}

        .max-w-3xl(data-work-detail-title)
          p.font-mono.text-xs.font-semibold.uppercase(class="tracking-[0.2em]") {{ work.eyebrow }}
          h3.mt-4.text-4xl.font-semibold.leading-none(:class="titleClass") {{ work.title }}
          .mt-6.h-px.w-full.origin-left(
            class="bg-[color-mix(in_oklab,var(--work-foreground)_38%,transparent)]"
            data-work-detail-line
          )

    .flex.min-h-0.flex-col.justify-between.overflow-hidden(
      :class="contentClass"
      data-work-detail-content
    )
      div
        p.font-mono.text-xs.font-semibold.uppercase.text-site-secondary(class="tracking-[0.18em]") {{ work.period }} / {{ work.role }}
        p.mt-5.font-medium.text-site-heading(
          :class="summaryClass"
        ) {{ work.summary }}
        .mt-5.grid.gap-3(data-work-detail-copy class="md:mt-8 md:gap-4")
          p.border-l.border-site-secondary.pl-4.text-base.leading-7.text-site-muted(
            v-for="highlight in highlightPreview()"
            :key="highlight"
            class="max-sm:text-sm max-sm:leading-6"
          ) {{ highlight }}

      .mt-6(class="md:mt-10")
        .hidden.flex-wrap.gap-2(class="sm:flex")
          span.rounded-full.border.border-site-border.px-3.py-1.font-mono.text-xs.text-site-muted(
            v-for="item in stackPreview()"
            :key="item"
          ) {{ item }}
        .mt-5.flex.flex-wrap.gap-3(class="sm:mt-8")
          a.font-mono.text-xs.font-semibold.uppercase.text-site-secondary.transition-colors(
            v-if="work.href"
            :href="work.href"
            target="_blank"
            rel="noopener noreferrer"
            class="tracking-[0.18em] hover:text-site-link-hover"
          ) {{ t('work.openWork') }}
          a.font-mono.text-xs.font-semibold.uppercase.text-site-muted.transition-colors(
            v-for="(source, sourceIndex) in work.sourceUrls.slice(0, 2)"
            :key="source"
            :href="source"
            target="_blank"
            rel="noopener noreferrer"
            class="tracking-[0.18em] hover:text-site-link-hover"
          ) {{ t('work.source') }} {{ sourceIndex + 1 }}
</template>
