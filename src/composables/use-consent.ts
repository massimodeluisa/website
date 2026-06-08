import { watch } from 'vue'
import i18next from 'i18next'

import 'vanilla-cookieconsent/dist/cookieconsent.css'
import * as CookieConsent from 'vanilla-cookieconsent'

import { gtag } from './use-analytics'
import { SUPPORTED_LOCALES, useI18n, type TLocaleCode } from '@/i18n'

// MARK: - Consent Mode sync

/*
 * Bridges the banner choice to (1) Google Consent Mode v2 and (2) a dataLayer
 * event for tags that don't speak Consent Mode natively (e.g. Meta Pixel —
 * gate its GTM trigger on `cc_advertisement === true`).
 */
function syncConsent() {
  const analytics = CookieConsent.acceptedCategory('analytics')
  const ads = CookieConsent.acceptedCategory('advertisement')

  gtag('consent', 'update', {
    analytics_storage: analytics ? 'granted' : 'denied',
    ad_storage: ads ? 'granted' : 'denied',
    ad_user_data: ads ? 'granted' : 'denied',
    ad_personalization: ads ? 'granted' : 'denied',
    functionality_storage: 'granted',
    personalization_storage: 'granted',
  })

  window.dataLayer?.push({
    event: 'cc_consent_update',
    cc_analytics: analytics,
    cc_advertisement: ads,
  })
}

// MARK: - Localized banner copy (single source of truth = i18n `cookie.*`)

const tl = (lng: TLocaleCode, key: string) => i18next.t(`cookie.${key}`, { lng }) as string

function translationFor(lng: TLocaleCode) {
  return {
    consentModal: {
      title: tl(lng, 'title'),
      description: tl(lng, 'description'),
      acceptAllBtn: tl(lng, 'acceptAll'),
      acceptNecessaryBtn: tl(lng, 'acceptNecessary'),
      showPreferencesBtn: tl(lng, 'showPreferences'),
    },
    preferencesModal: {
      title: tl(lng, 'prefTitle'),
      acceptAllBtn: tl(lng, 'acceptAll'),
      acceptNecessaryBtn: tl(lng, 'acceptNecessary'),
      savePreferencesBtn: tl(lng, 'savePreferences'),
      closeIconLabel: tl(lng, 'close'),
      sections: [
        { title: tl(lng, 'sectionNecessaryTitle'), description: tl(lng, 'sectionNecessaryDesc'), linkedCategory: 'necessary' },
        { title: tl(lng, 'sectionAnalyticsTitle'), description: tl(lng, 'sectionAnalyticsDesc'), linkedCategory: 'analytics' },
        { title: tl(lng, 'sectionAdsTitle'), description: tl(lng, 'sectionAdsDesc'), linkedCategory: 'advertisement' },
      ],
    },
  }
}

// MARK: - Init

/* Mounts the consent banner (client only — no-op during SSG pre-render). */
export function initConsent() {
  if (typeof window === 'undefined') {
    return
  }

  const { locale } = useI18n()

  void CookieConsent.run({
    guiOptions: {
      consentModal: { layout: 'box wide', position: 'bottom left' },
      preferencesModal: { layout: 'box' },
    },
    onFirstConsent: syncConsent,
    onConsent: syncConsent,
    onChange: syncConsent,
    categories: {
      necessary: { enabled: true, readOnly: true },
      analytics: {
        autoClear: { cookies: [{ name: /^_ga/ }, { name: '_gid' }] },
      },
      advertisement: {
        autoClear: { cookies: [{ name: /^_fbp/ }, { name: '_fbc' }, { name: /^_gcl/ }] },
      },
    },
    language: {
      default: locale.value,
      autoDetect: undefined,
      translations: Object.fromEntries(
        SUPPORTED_LOCALES.map((code) => [code, translationFor(code)]),
      ),
    },
  })

  // Keep the banner language in sync with the site's locale switcher.
  watch(locale, (code) => {
    if (CookieConsent.getConfig('language')) {
      void CookieConsent.setLanguage(code)
    }
  })
}

/* Re-open the preferences modal — wire to a footer link (GDPR: easy to revoke). */
export const showCookiePreferences = () => CookieConsent.showPreferences()
