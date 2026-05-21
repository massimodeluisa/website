<script setup lang="ts">
type FontSpecimen = {
  name: string
  family: string
  role: string
  sample: string
  weights?: string
}

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789'

const heroFont: FontSpecimen = {
  name: 'Geist Sans',
  family: '"Geist Sans", ui-sans-serif, system-ui, sans-serif',
  role: 'Interface and long-form reading',
  sample: 'Design systems need rhythm, contrast, and quiet defaults.',
  weights: '100-900 variable, regular and italic',
}

const primaryFonts: FontSpecimen[] = [
  heroFont,
  {
    name: 'Geist Mono',
    family: '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
    role: 'Code, tokens, labels, numeric strings',
    sample: 'const palette = ["#8894A9", "#484647", "#B68370"]',
    weights: '100-900 variable, regular and italic',
  },
  {
    name: 'Geist Pixel Square',
    family: '"Geist Pixel Square", "Geist Sans", ui-sans-serif, system-ui, sans-serif',
    role: 'Display moments and small editorial accents (and later some animations)',
    sample: 'Pixel display sample 0123456789',
    weights: '400 static',
  },
]

const pixelFonts: FontSpecimen[] = [
  {
    name: 'Square',
    family: '"Geist Pixel Square", "Geist Sans", ui-sans-serif, system-ui, sans-serif',
    role: 'Default pixel display',
    sample: 'SQUARE PIXEL',
  },
  {
    name: 'Grid',
    family: '"Geist Pixel Grid", "Geist Sans", ui-sans-serif, system-ui, sans-serif',
    role: 'Grid texture',
    sample: 'GRID PIXEL',
  },
  {
    name: 'Circle',
    family: '"Geist Pixel Circle", "Geist Sans", ui-sans-serif, system-ui, sans-serif',
    role: 'Round texture',
    sample: 'CIRCLE PIXEL',
  },
  {
    name: 'Triangle',
    family: '"Geist Pixel Triangle", "Geist Sans", ui-sans-serif, system-ui, sans-serif',
    role: 'Angular texture',
    sample: 'TRIANGLE PIXEL',
  },
  {
    name: 'Line',
    family: '"Geist Pixel Line", "Geist Sans", ui-sans-serif, system-ui, sans-serif',
    role: 'Linear texture',
    sample: 'LINE PIXEL',
  },
]

const typeScale = [
  { label: 'H1', className: 'text-5xl md:text-6xl', weight: '650' },
  { label: 'H2', className: 'text-4xl md:text-5xl', weight: '620' },
  { label: 'H3', className: 'text-3xl md:text-4xl', weight: '600' },
  { label: 'H4', className: 'text-2xl md:text-3xl', weight: '580' },
  { label: 'H5', className: 'text-xl md:text-2xl', weight: '560' },
  { label: 'H6', className: 'text-lg md:text-xl', weight: '540' },
]
</script>

<template>
  <article class="presentation-page">
    <section class="presentation-hero">
      <div class="site-card rounded-lg border p-6 md:p-8">
        <p class="site-kicker text-sm font-semibold uppercase tracking-[0.18em]">Typography</p>
        <h1 class="site-heading mt-4 text-5xl font-semibold md:text-7xl">Font</h1>
        <p class="site-muted mt-5 max-w-2xl text-lg leading-8">
          A view for comparing the theme font families, weights, type scale, and pixel variants.
        </p>
      </div>

      <div
        class="site-card flex min-h-72 flex-col justify-between rounded-lg border p-6"
        :style="{ fontFamily: heroFont.family }"
      >
        <p class="font-mono text-sm text-site-secondary">Geist Sans</p>
        <p class="specimen-line text-8xl font-semibold md:text-9xl">Aa</p>
        <p class="site-muted text-lg">{{ alphabet }}</p>
      </div>
    </section>

    <section class="presentation-section">
      <div class="presentation-section-heading">
        <p class="site-kicker text-sm font-semibold uppercase tracking-[0.18em]">Families</p>
        <h2 class="site-heading mt-2 text-3xl font-semibold">Primary families</h2>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <div v-for="font in primaryFonts" :key="font.name" class="site-card rounded-lg border p-5">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 class="site-heading text-xl font-semibold">{{ font.name }}</h3>
              <p class="site-muted mt-1 text-sm">{{ font.role }}</p>
            </div>
            <p class="site-muted shrink-0 font-mono text-xs">{{ font.weights }}</p>
          </div>

          <p class="specimen-line mt-8 text-4xl" :style="{ fontFamily: font.family }">
            {{ font.sample }}
          </p>
          <p class="site-muted specimen-line mt-6 font-mono text-sm">{{ alphabet }}</p>
        </div>
      </div>
    </section>

    <section class="presentation-section">
      <div class="presentation-section-heading">
        <p class="site-kicker text-sm font-semibold uppercase tracking-[0.18em]">Type scale</p>
        <h2 class="site-heading mt-2 text-3xl font-semibold">Hierarchy</h2>
      </div>

      <div class="presentation-stack">
        <div
          v-for="item in typeScale"
          :key="item.label"
          class="site-card grid gap-4 rounded-lg border p-5 lg:grid-cols-[120px_1fr]"
        >
          <div>
            <p class="font-mono text-sm text-site-secondary">{{ item.label }}</p>
            <p class="site-muted mt-1 font-mono text-xs">weight {{ item.weight }}</p>
          </div>
          <p
            class="site-heading specimen-line"
            :class="item.className"
            :style="{ fontWeight: item.weight }"
          >
            ABCDEFGHIJKLMNOPQRSTUVXYZ abcdefghijklmnopqrstuvwxyz 0123456789
          </p>
        </div>
      </div>
    </section>

    <section class="presentation-section">
      <div class="presentation-section-heading">
        <p class="site-kicker text-sm font-semibold uppercase tracking-[0.18em]">Pixel set</p>
        <h2 class="site-heading mt-2 text-3xl font-semibold">Pixel variants</h2>
      </div>

      <div class="showcase-grid">
        <div v-for="font in pixelFonts" :key="font.name" class="site-card rounded-lg border p-5">
          <p class="site-muted font-mono text-sm">{{ font.name }}</p>
          <p class="specimen-line mt-8 text-4xl leading-tight" :style="{ fontFamily: font.family }">
            {{ font.sample }}
          </p>
          <p class="site-muted mt-5 text-sm">{{ font.role }}</p>
        </div>
      </div>
    </section>
  </article>
</template>
