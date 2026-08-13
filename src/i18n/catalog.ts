/* Vue-free locale catalog — imported by the app, vite.config, and postbuild scripts. */

export const SUPPORTED_LOCALES = ['en', 'it', 'ja', 'ru', 'uk'] as const
export type TLocaleCode = (typeof SUPPORTED_LOCALES)[number]
export const DEFAULT_LOCALE: TLocaleCode = 'en'
export const NON_DEFAULT_LOCALES: readonly TLocaleCode[] = SUPPORTED_LOCALES.filter(
  (code) => code !== DEFAULT_LOCALE,
)

export const LOCALE_LABELS: Record<TLocaleCode, string> = {
  en: 'EN',
  it: 'IT',
  ja: 'JP',
  ru: 'RU',
  uk: 'UK',
}
