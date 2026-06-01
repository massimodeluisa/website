<script setup lang="ts">
// TODO: remove TestBgView + its /test-bg route before production (dev-only background sandbox)
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import FluidDistortionBackground from '@/components/home/FluidDistortionBackground.vue'
import MeshGradientBackground from '@/components/home/MeshGradientBackground.vue'
import ShaderGradientBackground from '@/components/home/ShaderGradientBackground.vue'
import Three3DMeshBackground from '@/components/home/Three3DMeshBackground.vue'

interface IBgVariant {
  id: string
  label: string
  description: string
}

// MARK: - Composables

const route = useRoute()

// MARK: - Variables

const VARIANTS: IBgVariant[] = [
  {
    id: '1',
    label: 'Mesh gradient drift',
    description: 'CSS radial-gradients drifting (current Hero bg)',
  },
  {
    id: '2',
    label: 'WebGL shader gradient',
    description: 'fBm noise + multi-color blend, paper.design style',
  },
  {
    id: '3',
    label: 'WebGL fluid distortion',
    description: 'mouse-reactive ripples warping the gradient',
  },
  {
    id: '4',
    label: 'WebGL 3D mesh terrain',
    description: 'tessellated plane displaced by noise, iso-projected',
  },
]

// MARK: - Computed

const currentId = computed(() => String(route.params.id ?? '1'))
const currentVariant = computed(
  () => VARIANTS.find((v) => v.id === currentId.value) ?? VARIANTS[0]!,
)
</script>

<template lang="pug">
section.relative.min-h-dvh.flex.flex-col.overflow-hidden.bg-site-background.text-site-text
  MeshGradientBackground(v-if="currentId === '1'")
  ShaderGradientBackground(v-else-if="currentId === '2'")
  FluidDistortionBackground(v-else-if="currentId === '3'")
  Three3DMeshBackground(v-else-if="currentId === '4'")

  .relative.z-10.mx-auto.flex.min-h-dvh.w-full.max-w-screen-2xl.flex-col.justify-between.px-6.py-12(class="md:px-12 lg:px-20")
    header.flex.flex-col.gap-2
      //- TODO: move "Background test" label to i18n (proposed key: testBg.label) — dev-only view
      p.font-mono.text-xs.font-semibold.uppercase.text-site-secondary(class="tracking-[0.24em]") Background test · {{ currentId }} / {{ VARIANTS.length }}
      h1.text-5xl.font-semibold.text-site-heading(class="md:text-7xl") {{ currentVariant.label }}
      p.max-w-xl.text-lg.text-site-muted {{ currentVariant.description }}

    .self-center.text-center
      //- TODO: move "Sample content" label to i18n (proposed key: testBg.sampleContent) — dev-only view
      p.font-mono.text-xs.uppercase.text-site-muted.mb-3(class="tracking-[0.24em]") Sample content
      //- TODO: move "Builder, CTO, technologist." to i18n (proposed key: testBg.sampleHeading) — dev-only view
      p.text-4xl.font-semibold.text-site-heading(class="md:text-6xl") Builder, CTO, technologist.
      //- TODO: move sample body text to i18n (proposed key: testBg.sampleBody) — dev-only view
      p.mt-4.max-w-xl.mx-auto.text-base.text-site-muted I structure backends, AI workflows and Vue UIs.

    nav.flex.flex-wrap.items-center.gap-3.text-sm
      //- TODO: move "Switch:" to i18n (proposed key: testBg.switchLabel) — dev-only view
      span.font-mono.text-xs.uppercase.text-site-muted(class="tracking-[0.24em]") Switch:
      RouterLink.test-bg-pill(
        v-for="v in VARIANTS"
        :key="v.id"
        :to="`/test-bg/${v.id}`"
        :class="{ 'is-active': v.id === currentId }"
      ) {{ v.id }} · {{ v.label }}
      RouterLink.test-bg-pill.test-bg-pill--alt(to="/") ← back to site
</template>

<style scoped lang="scss">
// color-mix() with var() — not expressible in Tailwind
.test-bg-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.85rem;
  border-radius: 9999px;
  border: 1px solid var(--site-border);
  background: color-mix(in oklab, var(--site-background) 70%, transparent);
  backdrop-filter: blur(8px);
  color: var(--site-muted);
  font-size: 0.8rem;
  text-decoration: none;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;

  &:hover {
    color: var(--site-heading);
    border-color: var(--site-secondary);
  }

  &.is-active {
    color: var(--site-background);
    background: var(--site-heading);
    border-color: var(--site-heading);
  }
}

.test-bg-pill--alt {
  margin-left: auto;
  font-style: italic;
}
</style>
