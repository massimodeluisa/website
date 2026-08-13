/* Vue-free site identity — imported by SEO composables and postbuild scripts. */

export const SITE_URL = 'https://deluisa.me'
export const SITE_NAME = 'Massimo De Luisa'
export const SITE_EMAIL = 'massimodeluisa@me.com'
export const SITE_ROLE = 'CTO & Product Engineer'
export const SITE_SUMMARY =
  'CTO & Product Engineer. I build platforms, mobile apps and AI-assisted workflows that stay simple under pressure. Shipping Inksquad, IsReady.AI and SIDUS. Experimenting with Rust. Based in Udine, Italy — moving to Japan.'
export const TWITTER_HANDLE = '@massimodeluisa'

export const PERSON_ID = `${SITE_URL}/#person`
export const WEBSITE_ID = `${SITE_URL}/#website`
export const ORG_ID = `${SITE_URL}/#organization`

export const PROFILES = {
  github: 'https://github.com/massimodeluisa',
  linkedin: 'https://www.linkedin.com/in/massimodeluisa',
  x: 'https://x.com/massimodeluisa',
  bio: 'https://massimo.deluisa.bio',
  telegram: 'https://t.me/massimodeluisa',
  isready: 'https://isready.ai',
  sidus: 'https://sidus.tools',
} as const

export const SAME_AS = [
  PROFILES.github,
  PROFILES.x,
  PROFILES.linkedin,
  PROFILES.bio,
  PROFILES.isready,
  PROFILES.sidus,
] as const
