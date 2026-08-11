<script setup lang="ts">
import { computed } from 'vue'

import { TECH_BRANDS, techBrandIconUrl, type IBrandInfo, type TBrand } from '@/data/techBrands'

// TBrand is a string union (keyof TECH_BRANDS); String covers the runtime shape.
const model = defineModel('brand', { type: String as unknown as () => TBrand, required: true })

// MARK: - Computed

/*
 * Widen the `as const` literal union to IBrandInfo so optional fields (mono,
 * iconBackground) are reachable — every entry satisfies IBrandInfo by construction.
 */
const info = computed<IBrandInfo>(() => TECH_BRANDS[model.value])
const iconUrl = computed(() => techBrandIconUrl(model.value))
const isMono = computed(() => info.value.mono === true)
const iconBackground = computed(() => info.value.iconBackground ?? null)
</script>

<template lang="pug">
a.inline-flex.items-baseline.font-semibold.no-underline.whitespace-nowrap.transition-colors.duration-200(
  :href="info.href"
  target="_blank"
  rel="noopener noreferrer"
  :style="{ '--brand-color': info.color }"
  :aria-label="`${info.label} (opens in new tab)`"
  class="[color:var(--brand-color)] [gap:0.32em] hover:underline hover:[text-underline-offset:0.18em] hover:[text-decoration-color:color-mix(in_oklab,var(--brand-color)_60%,transparent)] hover:[text-decoration-thickness:1.5px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded-sm focus-visible:[outline-color:var(--brand-color)]"
)
  span.tech-brand-icon.tech-brand-icon--mono.inline-block.shrink-0(
    v-if="isMono"
    :style="{ maskImage: `url(${iconUrl})`, WebkitMaskImage: `url(${iconUrl})` }"
    aria-hidden="true"
    class="w-[1em] h-[1em] [transform:translateY(0.12em)] bg-[var(--brand-color)]"
  )
  img.inline-block.shrink-0(
    v-else
    :src="iconUrl"
    :style="iconBackground ? { backgroundColor: iconBackground } : {}"
    :alt="info.label"
    aria-hidden="true"
    loading="lazy"
    decoding="async"
    width="18"
    height="18"
    class="w-[1em] h-[1em] [transform:translateY(0.12em)]"
  )
  span(class="[letter-spacing:-0.01em]") {{ info.label }}
</template>

<style scoped lang="scss">
// Mono icon: masked with brand colour via SVG mask-image set in template.
.tech-brand-icon--mono {
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  mask-mode: alpha;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}
</style>
