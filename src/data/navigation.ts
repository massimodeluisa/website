/*
 * Single source of truth for the primary navigation and the home-page section
 * ids the scroll-spy tracks. Keep NAV_ITEMS in DOM / scroll order.
 */

// MARK: - Types

export type TSectionId = 'home' | 'about' | 'work' | 'blog' | 'contact'

export interface INavItem {
  id: TSectionId
  labelKey: `nav.${TSectionId}`
  to: string
  /** Rendered as the prominent contact pill instead of a plain link. */
  prominent?: boolean
}

// MARK: - Data

export const NAV_ITEMS: readonly INavItem[] = [
  { id: 'home', labelKey: 'nav.home', to: '/#home' },
  { id: 'about', labelKey: 'nav.about', to: '/#about' },
  { id: 'work', labelKey: 'nav.work', to: '/#work' },
  { id: 'blog', labelKey: 'nav.blog', to: '/#blog' },
  { id: 'contact', labelKey: 'nav.contact', to: '#contact', prominent: true },
]

// Home-page section ids in DOM order — drives useScrollSpy.
export const SECTION_IDS: TSectionId[] = NAV_ITEMS.map((item) => item.id)
