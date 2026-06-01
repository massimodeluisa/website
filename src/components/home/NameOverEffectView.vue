<script setup lang="ts">
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { useI18n } from '@/i18n'

gsap.registerPlugin(SplitText)

// MARK: - Composables

const { t } = useI18n()

interface ICharGroup {
  wrapper: HTMLElement
  letters: HTMLElement[]
  katakana: HTMLElement
}

interface IKatakanaGroup {
  count: number
  text: string
}

// MARK: - Variables

const nameLine = ref<HTMLElement | null>(null)
const baseFontFamily = 'var(--font-sans)'
const pixelFontFamily = 'var(--font-pixel-line)'

const katakanaGroups: IKatakanaGroup[] = [
  { count: 2, text: 'マ' },
  { count: 3, text: 'ッシ' },
  { count: 2, text: 'モ' },
  { count: 2, text: 'デ' },
  { count: 2, text: 'ル' },
  { count: 1, text: 'イ' },
  { count: 2, text: 'ザ' },
]

let splitText: SplitText | undefined
let introTimeline: gsap.core.Timeline | undefined
let letters: HTMLElement[] = []
let groups: ICharGroup[] = []
const removeListeners: Array<() => void> = []

// MARK: - Methods

const buildGroups = (chars: HTMLElement[]): ICharGroup[] => {
  const built: ICharGroup[] = []
  let index = 0

  katakanaGroups.forEach(({ count, text }) => {
    const groupLetters = chars.slice(index, index + count)
    index += count

    const first = groupLetters[0]
    if (!first || !first.parentNode) {
      return
    }

    const wrapper = document.createElement('span')
    wrapper.className = 'name-group'
    first.parentNode.insertBefore(wrapper, first)
    groupLetters.forEach((letter) => wrapper.appendChild(letter))

    const kana = document.createElement('span')
    kana.className = 'name-katakana'
    kana.textContent = text
    kana.setAttribute('aria-hidden', 'true')

    gsap.set(kana, { autoAlpha: 0, scale: 0.85 })
    wrapper.appendChild(kana)

    built.push({ wrapper, letters: groupLetters, katakana: kana })
  })

  return built
}

const showKatakana = (groupLetters: HTMLElement[], katakana: HTMLElement) => {
  gsap.killTweensOf([...groupLetters, katakana])
  gsap.to(groupLetters, {
    autoAlpha: 0,
    scale: 0.85,
    y: -4,
    duration: 0.18,
    ease: 'power2.in',
  })
  gsap.to(katakana, {
    autoAlpha: 1,
    scale: 1,
    duration: 0.32,
    ease: 'power3.out',
    delay: 0.06,
  })
}

const showLetters = (groupLetters: HTMLElement[], katakana: HTMLElement) => {
  gsap.killTweensOf([...groupLetters, katakana])
  gsap.to(katakana, {
    autoAlpha: 0,
    scale: 0.85,
    duration: 0.18,
    ease: 'power2.in',
  })
  gsap.to(groupLetters, {
    autoAlpha: 1,
    scale: 1,
    y: 0,
    duration: 0.32,
    ease: 'power3.out',
    delay: 0.06,
  })
}

const attachGroupListeners = () => {
  groups.forEach(({ wrapper, letters: groupLetters, katakana }) => {
    const onEnter = () => showKatakana(groupLetters, katakana)
    const onLeave = () => showLetters(groupLetters, katakana)

    wrapper.addEventListener('mouseenter', onEnter)
    wrapper.addEventListener('mouseleave', onLeave)

    removeListeners.push(() => {
      wrapper.removeEventListener('mouseenter', onEnter)
      wrapper.removeEventListener('mouseleave', onLeave)
    })
  })
}

const animateIntro = () => {
  if (!nameLine.value) {
    return
  }

  introTimeline = gsap.timeline({
    onComplete: attachGroupListeners,
  })

  introTimeline
    .set(nameLine.value, {
      autoAlpha: 0,
      scale: 0,
      transformOrigin: '50% 50%',
    })
    .set(letters, {
      display: 'inline-block',
      fontFamily: pixelFontFamily,
      scale: 1,
      y: 0,
    })
    .to(nameLine.value, {
      autoAlpha: 1,
      scale: 1,
      duration: 0.5,
    })
    .addLabel('fontSwap', '>+0.12')

  letters.forEach((letter, index) => {
    const startPosition = `fontSwap+=${index * 0.035}`

    introTimeline
      ?.to(
        letter,
        {
          autoAlpha: 0.72,
          scale: 0.9,
          y: -4,
          duration: 0.1,
          ease: 'power2.in',
        },
        startPosition,
      )
      .set(letter, { fontFamily: baseFontFamily }, `${startPosition}+=0.1`)
      .to(
        letter,
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.24,
          ease: 'power3.out',
        },
        `${startPosition}+=0.1`,
      )
  })
}

// MARK: - Lifecycle

onMounted(() => {
  if (!nameLine.value) {
    return
  }

  splitText = new SplitText(nameLine.value, {
    type: 'words, chars',
    charsClass: 'letter++',
    wordsClass: 'name-word',
  })
  letters = gsap.utils.toArray<HTMLElement>(splitText.chars)
  groups = buildGroups(letters)
  animateIntro()
})

onBeforeUnmount(() => {
  introTimeline?.kill()
  gsap.killTweensOf(letters)
  groups.forEach(({ katakana }) => gsap.killTweensOf(katakana))

  removeListeners.forEach((fn) => fn())
  removeListeners.length = 0

  groups = []
  letters = []

  splitText?.revert()
})
</script>

<template lang="pug">
h1.name-line#home-title.relative.w-full.select-none.uppercase.tracking-normal(
  ref="nameLine"
  class="text-[clamp(2.25rem,10vw,5.1rem)] leading-[0.82] md:text-[clamp(3rem,8vw,10rem)] whitespace-nowrap inline-block"
) {{ t('hero.fullName') }}
</template>

<style scoped lang="scss">
// Hidden until GSAP intro fires
.name-line {
  visibility: hidden;
}

:deep(.name-word) {
  display: inline-block;
  white-space: nowrap;
}

// Extra-small breakpoint: stack words and tighten tracking
@media (width < 40rem) {
  .name-line {
    font-size: 2rem;
    line-height: 0.92;
  }

  :deep(.name-word) {
    display: block;
  }
}

:deep(.name-group) {
  position: relative;
  display: inline-block;
  vertical-align: baseline;
  cursor: pointer;
}

// Katakana overlay — injected by buildGroups(); needs jp font + em-relative size
:deep(.name-katakana) {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  font-family: var(--font-jp);
  font-weight: 400;
  font-size: 0.55em;
  line-height: 1;
}
</style>
