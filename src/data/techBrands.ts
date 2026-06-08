// MARK: - Types

export interface IBrandInfo {
  label: string
  icon: string
  color: string
  href: string
  iconBackground?: string
  /** When true, the icon is rendered as a CSS mask filled by --brand-color
   *  (instead of an <img>), so its color adapts to the theme. Use for
   *  monochromatic brands whose mark is the same shape in light/dark. */
  mono?: boolean
}

// MARK: - Catalog

export const TECH_BRANDS = {
  nestjs: {
    label: 'NestJS',
    icon: 'logos:nestjs',
    color: '#E0234E',
    href: 'https://nestjs.com/',
  },
  typesense: {
    label: 'Typesense',
    icon: '/brands/typesense.svg',
    color: 'var(--site-heading)',
    href: 'https://typesense.org/',
    iconBackground: '#000000',
  },
  sequin: {
    label: 'Sequin',
    icon: 'mdi:database-sync-outline',
    color: '#33B3A6',
    href: 'https://sequinstream.com/',
  },
  redis: {
    label: 'Redis',
    icon: 'logos:redis',
    color: '#DC382D',
    href: 'https://redis.io/',
  },
  deno: {
    label: 'Deno',
    icon: 'logos:deno',
    color: 'var(--site-heading)',
    href: 'https://deno.com/',
  },
  n8n: {
    label: 'n8n',
    icon: 'simple-icons:n8n',
    color: '#EA4B71',
    href: 'https://n8n.io/',
  },
  turborepo: {
    label: 'Turborepo',
    icon: 'logos:turborepo-icon',
    color: '#FF1E56',
    href: 'https://turbo.build/',
  },
  expo: {
    label: 'Expo',
    icon: 'simple-icons:expo',
    color: 'var(--site-heading)',
    href: 'https://expo.dev/',
    mono: true,
  },
  vue: {
    label: 'Vue',
    icon: 'logos:vue',
    color: '#41B883',
    href: 'https://vuejs.org/',
  },
  tailwind: {
    label: 'Tailwind',
    icon: 'logos:tailwindcss-icon',
    color: '#06B6D4',
    href: 'https://tailwindcss.com/',
  },
  supabase: {
    label: 'Supabase',
    icon: 'logos:supabase-icon',
    color: '#3ECF8E',
    href: 'https://supabase.com/',
  },
  vercel: {
    label: 'Vercel',
    icon: 'simple-icons:vercel',
    color: 'var(--site-heading)',
    href: 'https://vercel.com/',
    mono: true,
  },
  // TODO: replace with a dedicated AI SDK icon when one becomes available in Iconify
  aisdk: {
    label: 'AI SDK',
    icon: 'simple-icons:vercel',
    color: 'var(--site-heading)',
    href: 'https://sdk.vercel.ai/',
    mono: true,
  },
  openai: {
    label: 'OpenAI',
    icon: 'simple-icons:openai',
    color: '#10A37F',
    href: 'https://openai.com/',
    mono: true,
  },
  googleVertex: {
    label: 'Google Vertex',
    icon: 'logos:google-cloud',
    color: '#4285F4',
    href: 'https://cloud.google.com/vertex-ai',
  },
  replicate: {
    label: 'Replicate',
    icon: 'simple-icons:replicate',
    color: 'var(--site-heading)',
    href: 'https://replicate.com/',
    mono: true,
  },
  gsap: {
    label: 'GSAP',
    icon: 'simple-icons:gsap',
    color: '#0AE448',
    href: 'https://gsap.com/',
    mono: true,
  },
  bun: {
    label: 'Bun',
    icon: 'simple-icons:bun',
    color: 'var(--site-heading)',
    href: 'https://bun.sh/',
    mono: true,
  },
  vite: {
    label: 'Vite',
    icon: 'logos:vitejs',
    color: '#646CFF',
    href: 'https://vite.dev/',
  },
  typescript: {
    label: 'TypeScript',
    icon: 'logos:typescript-icon',
    color: '#3178C6',
    href: 'https://www.typescriptlang.org/',
  },
} as const satisfies Record<string, IBrandInfo>

export type TBrand = keyof typeof TECH_BRANDS

// MARK: - Methods

export const techBrandIconUrl = (brand: TBrand): string => {
  const info = TECH_BRANDS[brand]
  const icon = info.icon
  if (icon.startsWith('/') || icon.startsWith('http')) {
    return icon
  }
  const base = `https://api.iconify.design/${icon}.svg`
  if (icon.startsWith('logos:')) {
    return base
  }
  /*
   * Mono brands are rendered as a CSS mask; the URL color doesn't paint the
   * visible icon (mask-mode: alpha does), but a luminous color makes the SVG
   * unambiguous for browsers that occasionally fall back to luminance mode.
   */
  if ('mono' in info && (info as { mono?: boolean }).mono === true) {
    return `${base}?color=fff`
  }
  return `${base}?color=${encodeURIComponent(info.color)}`
}
