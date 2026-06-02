<script setup lang="ts">
import AboutSection from '@/components/home/AboutSection.vue'
import ContactSection from '@/components/home/ContactSection.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import JournalTeaserSection from '@/components/home/JournalTeaserSection.vue'
import WorksSection from '@/components/work/WorksSection.vue'
import { usePageSeo, useJsonLd } from '@/composables/use-page-seo'
import { useScrollSpy } from '@/composables/use-scroll-spy'
import { SECTION_IDS } from '@/data/navigation'
import { useI18n } from '@/i18n'

// MARK: - Composables

const { t } = useI18n()

useScrollSpy({ ids: SECTION_IDS })
usePageSeo({
  title: () => t('hero.role'),
  description: () => t('contact.description'),
})
useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Massimo De Luisa',
  alternateName: 'MDL',
  url: 'https://deluisa.me',
  jobTitle: 'CTO & Product Engineer',
  worksFor: [
    { '@type': 'Organization', name: 'Smart Squad' },
    { '@type': 'Organization', name: 'Inksquad' },
  ],
  sameAs: [
    'https://github.com/massimodeluisa',
    'https://x.com/massimodeluisa',
    'https://www.linkedin.com/in/massimodeluisa',
  ],
})
</script>

<template lang="pug">
article.relative.isolate.bg-site-background.text-site-text(class="overflow-x-clip")
  HeroSection
  AboutSection
  WorksSection
  JournalTeaserSection
  ContactSection
</template>
