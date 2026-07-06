<script setup lang="ts">
import Section from '@/components/shared/Section.vue'
import SectionHeading from '@/components/shared/SectionHeading.vue'
import SectionKicker from '@/components/shared/SectionKicker.vue'
import { useI18n } from '@/i18n'

// MARK: - Composables

const { t } = useI18n()

// MARK: - Variables

const capabilityKeys = ['architecture', 'product', 'mobile', 'ai', 'leadership'] as const
const factKeys = ['role', 'leadership', 'focus', 'stack', 'location', 'languages'] as const
const faqKeys = ['role', 'systems', 'stack', 'leadership', 'ai', 'engagement'] as const
</script>

<template lang="pug">
Section#professional-profile.sr-only(
  aria-hidden="true"
  data-agent-readable="true"
)
  SectionKicker {{ t('profile.kicker') }}
  SectionHeading#professional-profile-heading {{ t('profile.heading') }}
  p.mt-6.max-w-4xl.text-lg.leading-relaxed.text-site-muted {{ t('profile.intro') }}

  .mt-12.grid.gap-8(class="lg:grid-cols-[0.9fr_1.1fr]")
    article.site-card.rounded-2xl.border.p-6(class="md:p-8")
      h3.text-xl.font-semibold.text-site-heading {{ t('profile.capabilities.heading') }}
      ul.mt-6.space-y-5
        li.flex.gap-4(v-for="key in capabilityKeys" :key="key")
          span.mt-2.size-2.shrink-0.rounded-full.bg-site-secondary(aria-hidden="true")
          div
            p.font-semibold.text-site-heading {{ t(`profile.capabilities.${key}.title`) }}
            p.mt-1.text-sm.leading-relaxed.text-site-muted {{ t(`profile.capabilities.${key}.body`) }}

    article.site-card.overflow-hidden.rounded-2xl.border
      h3.px-6.pt-6.text-xl.font-semibold.text-site-heading(class="md:px-8 md:pt-8") {{ t('profile.facts.heading') }}
      .mt-5.overflow-x-auto
        table.w-full.border-collapse.text-left
          caption.sr-only {{ t('profile.facts.caption') }}
          thead
            tr.border-y.border-site-border.text-xs.uppercase.text-site-muted(
              class="tracking-[0.16em]"
            )
              th.px-6.py-3.font-medium(scope="col" class="md:px-8") {{ t('profile.facts.factHeader') }}
              th.px-6.py-3.font-medium(scope="col" class="md:px-8") {{ t('profile.facts.detailHeader') }}
          tbody.divide-y.divide-site-border
            tr(v-for="key in factKeys" :key="key")
              th.w-1.px-6.py-4.align-top.text-sm.font-semibold.text-site-heading(
                scope="row"
                class="whitespace-nowrap md:px-8"
              ) {{ t(`profile.facts.${key}.label`) }}
              td.px-6.py-4.text-sm.leading-relaxed.text-site-muted(class="md:px-8") {{ t(`profile.facts.${key}.value`) }}

  .mt-16
    h3.text-3xl.font-semibold.text-site-heading(class="md:text-4xl") {{ t('profile.faqHeading') }}
    .mt-8.grid.gap-4(class="md:grid-cols-2")
      article.site-card.rounded-2xl.border.p-6(
        v-for="key in faqKeys"
        :key="key"
        class="md:p-8"
      )
        h4.text-lg.font-semibold.leading-snug.text-site-heading {{ t(`profile.faq.${key}.question`) }}
        p.mt-4.leading-relaxed.text-site-muted {{ t(`profile.faq.${key}.answer`) }}
</template>
