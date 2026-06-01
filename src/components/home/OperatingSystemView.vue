<script setup lang="ts">
import { useI18n } from '@/i18n'

import AnimatedIconView from './AnimatedIconView.vue'

// MARK: - Composables

const { t } = useI18n()

// MARK: - Variables

const focusAreas = [
  { key: 'product', animationVariant: 'idea' },
  { key: 'leadership', animationVariant: 'laptop' },
  { key: 'research', animationVariant: 'ai' },
] as const
</script>

<template lang="pug">
.grid.gap-8(class="lg:grid-cols-[0.78fr_1.22fr]")
  .min-w-0(data-panel)
    p.site-kicker.font-mono.text-sm.font-semibold.uppercase(class="tracking-[0.24em]") {{ t('operatingSystem.kicker') }}
    h2.mt-4.text-4xl.font-semibold.text-site-heading(class="md:text-6xl") {{ t('operatingSystem.heading') }}

  .grid.gap-4
    article.site-card.operating-system-card.relative.overflow-hidden.rounded-lg.border.p-6(
      v-for="card in focusAreas"
      :key="card.key"
      data-panel
      class="md:min-h-72 md:p-7"
    )
      .operating-system-animation.pointer-events-none.absolute(aria-hidden="true")
        AnimatedIconView(
          :variant="card.animationVariant"
          :title="t(`operatingSystem.areas.${card.key}.animationTitle`)"
        )
      .operating-system-copy.relative.z-10
        p.font-mono.text-xs.font-bold.uppercase.text-site-secondary(class="tracking-[0.2em]") {{ t(`operatingSystem.areas.${card.key}.eyebrow`) }}
        h3.mt-4.text-2xl.font-semibold.text-site-heading {{ t(`operatingSystem.areas.${card.key}.title`) }}
        p.mt-4.text-base.leading-7.text-site-muted {{ t(`operatingSystem.areas.${card.key}.body`) }}
</template>

<style scoped lang="scss">
.operating-system-card {
  min-height: calc(var(--spacing) * 58);
  --operating-system-animation-size: clamp(
    calc(var(--spacing) * 26),
    15vw,
    calc(var(--spacing) * 38)
  );
}

// ::before: radial accent glow + crosshatch grid pattern
.operating-system-card::before {
  position: absolute;
  inset: 0;
  content: '';
  background:
    radial-gradient(
      circle at 84% 24%,
      color-mix(in oklab, var(--site-secondary) 16%, transparent),
      transparent 34%
    ),
    linear-gradient(color-mix(in oklab, var(--site-border) 42%, transparent) 1px, transparent 1px),
    linear-gradient(
      90deg,
      color-mix(in oklab, var(--site-border) 42%, transparent) 1px,
      transparent 1px
    );
  background-size:
    auto,
    calc(var(--spacing) * 7) calc(var(--spacing) * 7),
    calc(var(--spacing) * 7) calc(var(--spacing) * 7);
  opacity: 0.52;
}

.operating-system-animation {
  right: calc(var(--spacing) * 3);
  bottom: calc(var(--spacing) * 2);
  width: var(--operating-system-animation-size);
  height: var(--operating-system-animation-size);
  opacity: 0.72;
  filter: saturate(0.82) contrast(1.02);
}

// Constrain copy so it never overlaps the floating animation icon
.operating-system-copy {
  max-width: min(
    calc(var(--spacing) * 140),
    calc(100% - var(--operating-system-animation-size) - calc(var(--spacing) * 6))
  );
}

@media (width < 768px) {
  .operating-system-card {
    padding-bottom: calc(var(--spacing) * 28);
    --operating-system-animation-size: calc(var(--spacing) * 28);
  }

  .operating-system-animation {
    opacity: 0.58;
  }
  .operating-system-copy {
    max-width: none;
  }
}
</style>
