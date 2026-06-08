<script setup lang="ts">
import AboutSection from '@/components/home/AboutSection.vue'
import ContactSection from '@/components/home/ContactSection.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import JournalTeaserSection from '@/components/home/JournalTeaserSection.vue'
import WorksSection from '@/components/work/WorksSection.vue'
import {
  usePageSeo,
  useJsonLd,
  personEntity,
  websiteEntity,
  SITE_URL,
  PERSON_ID,
  WEBSITE_ID,
} from '@/composables/use-page-seo'
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
/*
 * One @graph linking the Person, the WebSite and this ProfilePage by @id — the
 * shape Google's Knowledge Graph and AI answer engines resolve most cleanly.
 */
useJsonLd({
  '@context': 'https://schema.org',
  '@graph': [
    personEntity(),
    websiteEntity(),
    {
      '@type': 'ProfilePage',
      '@id': `${SITE_URL}/#profilepage`,
      url: SITE_URL,
      name: 'Massimo De Luisa — CTO & Product Engineer',
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': PERSON_ID },
      mainEntity: { '@id': PERSON_ID },
    },
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
