<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Section from '@/components/shared/Section.vue'
import TechBrand from '@/components/shared/TechBrand.vue'
import { useI18n } from '@/i18n'
import { useTextReveal } from '@/composables/use-text-reveal'
import { prefersReducedMotion } from '@/utils/motion'

gsap.registerPlugin(ScrollTrigger)

// MARK: - Constants

const KICKER_REVEAL_DURATION = 0.4
const KICKER_REVEAL_STAGGER = 0.018
const TITLE_REVEAL_DELAY = 0.08
const TITLE_REVEAL_DURATION = 0.45
const TITLE_REVEAL_STAGGER = 0.014
const TOKEN_REVEAL_DURATION = 0.5
const TOKEN_REVEAL_STAGGER = 0.05
const CARD_REVEAL_DURATION = 0.7
const CARD_EYEBROW_DURATION = 0.55
const CARD_EYEBROW_STAGGER = 0.04
const CARD_TITLE_DURATION = 0.65
const CARD_BODY_DURATION = 0.75
const CARD_BODY_STAGGER = 0.07

// MARK: - Composables

const { t } = useI18n()
const { revealCharsFade, revealLines, revealWords } = useTextReveal()

// MARK: - Variables

const focusAreas = [
  {
    key: 'product',
    icon: '◆',
  },
  {
    key: 'leadership',
    icon: '◎',
  },
  {
    key: 'research',
    icon: '◌',
  },
] as const

let aboutTriggers: ScrollTrigger[] = []

// MARK: - Lifecycle

onMounted(() => {
  /*
   * Defer all SplitText/reveal setup by one frame so Vue's hydration fully
   * commits and the browser paints the opacity-0 (hidden) state once before we
   * rewrite the DOM. Splitting synchronously during the hydration flush is what
   * caused the "flash everything → hide → animate" artifact. Mirrors HeroBio.
   */
  requestAnimationFrame(setupReveals)
})

function setupReveals() {
  const kicker = document.querySelector<HTMLElement>('#about .site-kicker')
  const title = document.querySelector<HTMLElement>('#about h2')
  const bio = document.querySelector<HTMLElement>('#about [data-about-bio]')
  const intro = document.querySelector<HTMLElement>('#about [data-about-intro]')

  const reduced = prefersReducedMotion()

  if (kicker) {
    revealCharsFade(kicker, {
      start: 'top 88%',
      duration: KICKER_REVEAL_DURATION,
      stagger: KICKER_REVEAL_STAGGER,
    })
  }
  if (title) {
    revealCharsFade(title, {
      start: 'top 85%',
      delay: TITLE_REVEAL_DELAY,
      duration: TITLE_REVEAL_DURATION,
      stagger: TITLE_REVEAL_STAGGER,
    })
  }

  /*
   * The bio and intro mix text phrases with inline TechBrand badges. Revealing
   * each as one left-to-right opacity stagger keeps the badges in lock-step with
   * the text (a per-char SplitText walk lets the un-split badges pop in early).
   */
  const revealTokens = (el: HTMLElement, delay: number) => {
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 82%',
      once: true,
      onEnter: () => {
        const tokens = Array.from(el.children) as HTMLElement[]
        if (reduced) {
          gsap.set(tokens, { opacity: 1 })
          gsap.set(el, { opacity: 1 })
          return
        }
        // Hide children first, then reveal the parent — never a frame where the
        // parent is visible with its children still at natural opacity.
        gsap.set(tokens, { opacity: 0 })
        gsap.set(el, { opacity: 1 })
        gsap.to(tokens, {
          opacity: 1,
          duration: TOKEN_REVEAL_DURATION,
          ease: 'power2.out',
          stagger: TOKEN_REVEAL_STAGGER,
          delay,
        })
      },
    })
    aboutTriggers.push(trigger)
  }

  if (bio) {
    revealTokens(bio, 0.12)
  }
  if (intro) {
    revealTokens(intro, 0.18)
  }

  const cards = document.querySelectorAll<HTMLElement>('#about .site-card')
  cards.forEach((card, index) => {
    const trigger = ScrollTrigger.create({
      trigger: card,
      start: 'top 82%',
      once: true,
      onEnter: () => {
        if (reduced) {
          gsap.set(card, { opacity: 1, y: 0, scale: 1 })
        } else {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: CARD_REVEAL_DURATION,
            ease: 'power3.out',
            delay: index * 0.07,
          })
        }

        const eyebrow = card.querySelector<HTMLElement>('[data-card-eyebrow]')
        const cardTitle = card.querySelector<HTMLElement>('[data-card-title]')
        const cardBody = card.querySelector<HTMLElement>('[data-card-body]')

        const baseDelay = 0.22 + index * 0.07

        if (eyebrow) {
          revealWords(eyebrow, {
            scrollTrigger: false,
            delay: baseDelay,
            duration: CARD_EYEBROW_DURATION,
            stagger: CARD_EYEBROW_STAGGER,
          })
        }
        if (cardTitle) {
          revealWords(cardTitle, {
            scrollTrigger: false,
            delay: baseDelay + 0.06,
            duration: CARD_TITLE_DURATION,
          })
        }
        if (cardBody) {
          revealLines(cardBody, {
            scrollTrigger: false,
            delay: baseDelay + 0.14,
            duration: CARD_BODY_DURATION,
            stagger: CARD_BODY_STAGGER,
          })
        }
      },
    })
    aboutTriggers.push(trigger)
  })
}

onUnmounted(() => {
  aboutTriggers.forEach((trigger) => trigger.kill())
  aboutTriggers = []
})
</script>

<template lang="pug">
Section(id="about")
  p.site-kicker.font-mono.text-sm.font-semibold.uppercase.opacity-0(class="tracking-[0.24em]") {{ t('about.kicker') }}
  h2.mt-3.text-4xl.font-semibold.text-site-heading.opacity-0(class="md:text-6xl") {{ t('about.title') }}

  p.mt-6.text-lg.leading-relaxed.text-site-heading.opacity-0(data-about-bio)
    span {{ t('hero.bioPre') }}
    TechBrand(brand="smartsquad")
    span {{ t('hero.bioAnd') }}
    TechBrand(brand="inksquad")
    span {{ t('hero.bioPost') }}

  p.mt-5.text-lg.leading-relaxed.text-site-muted.opacity-0(
    data-about-intro
    style="word-spacing: 0"
  )
    span {{ t('about.introStart') }}
    TechBrand(brand="nestjs")
    span {{ t('about.introWith') }}
    TechBrand(brand="typesense")
    span {{ t('about.introSep') }}
    TechBrand(brand="sequin")
    span {{ t('about.introSep') }}
    TechBrand(brand="redis")
    span {{ t('about.introAnd') }}
    TechBrand(brand="deno")
    span {{ t('about.introPersist') }}
    TechBrand(brand="supabase")
    span {{ t('about.introAutomate') }}
    TechBrand(brand="n8n")
    span {{ t('about.introShip') }}
    TechBrand(brand="vue")
    span.font-medium.text-site-muted(class="mx-[0.15em]")  +
    TechBrand(brand="tailwind")
    span {{ t('about.introTo') }}
    TechBrand(brand="vercel")
    span {{ t('about.introUsing') }}
    TechBrand(brand="turborepo")
    span {{ t('about.introBuild') }}
    TechBrand(brand="expo")
    span {{ t('about.introOrchestrate') }}
    TechBrand(brand="aisdk")
    span {{ t('about.introSep') }}
    TechBrand(brand="openai")
    span {{ t('about.introSep') }}
    TechBrand(brand="googleVertex")
    span {{ t('about.introAnd') }}
    TechBrand(brand="replicate")
    span {{ t('about.introEnd') }}

  .mt-12.grid.gap-4(class="md:grid-cols-3")
    article.site-card.rounded-xl.border.p-6(
      v-for="area in focusAreas"
      :key="area.key"
      class="opacity-0 translate-y-8 scale-[0.985]"
    )
      .font-mono.text-xs.font-semibold.uppercase.tracking-widest.text-site-secondary.opacity-0(
        data-card-eyebrow
      ) {{ t(`about.focus.${area.key}.eyebrow`) }}
      h3.mt-3.text-xl.font-semibold.text-site-heading.opacity-0(
        data-card-title
      ) {{ t(`about.focus.${area.key}.title`) }}
      p.mt-3.opacity-0(
        data-card-body
        class="text-[15px] leading-[1.6] text-site-muted"
      ) {{ t(`about.focus.${area.key}.body`) }}
</template>
