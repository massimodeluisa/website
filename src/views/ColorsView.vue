<script setup lang="ts">
type ColorToken = {
  name: string
  hex: string
  role: string
  foreground?: string
}

type GradientPair = {
  from: string
  to: string
}

const themeChoices: ColorToken[] = [
  {
    name: 'Lavender Gray',
    hex: '#8894A9',
    role: 'Primary',
    foreground: 'var(--site-primary-dark)',
  },
  {
    name: 'Charcoal',
    hex: '#484647',
    role: 'Primary dark',
    foreground: '#F7F5E2',
  },
  {
    name: 'Dusty Taupe',
    hex: '#B68370',
    role: 'Secondary',
    foreground: 'var(--site-primary-dark)',
  },
]

const corePalette: ColorToken[] = [
  { name: 'Lavender Gray', hex: '#8894A9', role: 'Primary' },
  { name: 'Grey Olive', hex: '#9A9A91', role: 'Neutral support' },
  {
    name: 'Charcoal',
    hex: '#484647',
    role: 'Primary dark',
    foreground: '#F7F5E2',
  },
  { name: 'Dusty Taupe', hex: '#B68370', role: 'Secondary' },
]

const osakaPalette: ColorToken[] = [
  { name: 'Signal Red', hex: '#CC1613', role: 'Accent', foreground: '#F7F5E2' },
  { name: 'Deep Umber', hex: '#22150C', role: 'Depth', foreground: '#F7F5E2' },
  { name: 'Dark Garnet', hex: '#6D0002', role: 'Shadow', foreground: '#F7F5E2' },
  { name: 'Warm Ivory', hex: '#F7F5E2', role: 'Light surface', foreground: '#22150C' },
]

const corePairings: GradientPair[] = [
  { from: '#8894A9', to: '#9A9A91' },
  { from: '#8894A9', to: '#484647' },
  { from: '#8894A9', to: '#B68370' },
  { from: '#9A9A91', to: '#484647' },
  { from: '#9A9A91', to: '#B68370' },
  { from: '#484647', to: '#B68370' },
]

const osakaPairings: GradientPair[] = [
  { from: '#CC1613', to: '#22150C' },
  { from: '#CC1613', to: '#6D0002' },
  { from: '#CC1613', to: '#F7F5E2' },
  { from: '#22150C', to: '#6D0002' },
  { from: '#22150C', to: '#F7F5E2' },
  { from: '#6D0002', to: '#F7F5E2' },
]
</script>

<template>
  <article class="presentation-page">
    <section class="presentation-hero">
      <div class="site-card rounded-lg border p-6 md:p-8">
        <p class="site-kicker text-sm font-semibold uppercase tracking-[0.18em]">Palette</p>
        <h1 class="site-heading mt-4 text-5xl font-semibold md:text-7xl">Colors</h1>
        <p class="site-muted mt-5 max-w-2xl text-lg leading-8">
          A presentation page for checking the theme tokens, contrast, and color pairings.
        </p>
      </div>

      <div class="presentation-stack">
        <div
          v-for="color in themeChoices"
          :key="color.hex"
          class="rounded-lg border p-5"
          :style="{
            background: color.hex,
            borderColor: 'var(--site-border)',
            color: color.foreground,
          }"
        >
          <p class="text-sm font-semibold">{{ color.role }}</p>
          <h2 class="mt-3 text-2xl font-semibold">{{ color.name }}</h2>
          <p class="mt-2 font-mono text-sm">{{ color.hex }}</p>
        </div>
      </div>
    </section>

    <section class="presentation-section">
      <div class="presentation-section-heading">
        <p class="site-kicker text-sm font-semibold uppercase tracking-[0.18em]">Core palette</p>
        <h2 class="site-heading mt-2 text-3xl font-semibold">Profile</h2>
      </div>

      <div class="showcase-grid">
        <div
          v-for="color in corePalette"
          :key="color.hex"
          class="site-card overflow-hidden rounded-lg border"
        >
          <div
            class="h-32"
            :style="{
              background: color.hex,
              color: color.foreground ?? 'var(--site-primary-dark)',
            }"
          ></div>
          <div class="p-4">
            <p class="font-semibold">{{ color.name }}</p>
            <p class="site-muted font-mono text-sm">{{ color.hex }}</p>
            <p class="site-muted mt-2 text-sm">{{ color.role }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="presentation-section">
      <div class="presentation-section-heading">
        <p class="site-kicker text-sm font-semibold uppercase tracking-[0.18em]">
          Background palette
        </p>
        <h2 class="site-heading mt-2 text-3xl font-semibold">Osaka</h2>
      </div>

      <div class="showcase-grid">
        <div
          v-for="color in osakaPalette"
          :key="color.hex"
          class="site-card overflow-hidden rounded-lg border"
        >
          <div
            class="flex h-32 items-end p-4"
            :style="{ background: color.hex, color: color.foreground }"
          >
            <span class="font-mono text-sm">{{ color.hex }}</span>
          </div>
          <div class="p-4">
            <p class="font-semibold">{{ color.name }}</p>
            <p class="site-muted mt-2 text-sm">{{ color.role }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="presentation-section">
      <div class="presentation-section-heading">
        <p class="site-kicker text-sm font-semibold uppercase tracking-[0.18em]">Pairings</p>
        <h2 class="site-heading mt-2 text-3xl font-semibold">Core gradients</h2>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <div
          v-for="pair in corePairings"
          :key="`${pair.from}-${pair.to}`"
          class="site-card rounded-lg border p-4"
        >
          <div
            class="h-24 rounded-md"
            :style="{ background: `linear-gradient(90deg, ${pair.from}, ${pair.to})` }"
          ></div>
          <p class="site-muted mt-3 font-mono text-sm">{{ pair.from }} -> {{ pair.to }}</p>
        </div>
      </div>
    </section>

    <section class="presentation-section">
      <div class="presentation-section-heading">
        <p class="site-kicker text-sm font-semibold uppercase tracking-[0.18em]">Pairings</p>
        <h2 class="site-heading mt-2 text-3xl font-semibold">Osaka gradients</h2>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <div
          v-for="pair in osakaPairings"
          :key="`${pair.from}-${pair.to}`"
          class="site-card rounded-lg border p-4"
        >
          <div
            class="h-24 rounded-md"
            :style="{ background: `linear-gradient(90deg, ${pair.from}, ${pair.to})` }"
          ></div>
          <p class="site-muted mt-3 font-mono text-sm">{{ pair.from }} -> {{ pair.to }}</p>
        </div>
      </div>
    </section>
  </article>
</template>
