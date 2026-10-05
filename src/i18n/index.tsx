import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { readSetting } from '@/lib/storage'
import { en, type TranslationKey } from './locales/en'

export type { TranslationKey } from './locales/en'

export type Locale = 'en'

export const LOCALE_STORAGE_KEY = 'locale'
export const DEFAULT_LOCALE: Locale = 'en'

/** All available dictionaries. Add 'bn' here in Module 13. */
const dictionaries: Record<Locale, typeof en> = { en }

const availableLocales = Object.keys(dictionaries) as Locale[]

export type TranslationVars = Record<string, string | number>
export type Translate = (key: TranslationKey, vars?: TranslationVars) => string

/** Replace {placeholders} in a string. Missing values are left as-is. */
export function interpolate(template: string, vars?: TranslationVars): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  )
}

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translate
}

const I18nContext = createContext<I18nContextValue | null>(null)

function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && availableLocales.includes(value as Locale)
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    const stored = readSetting<unknown>(LOCALE_STORAGE_KEY, DEFAULT_LOCALE)
    return isLocale(stored) ? stored : DEFAULT_LOCALE
  })

  const t = useCallback<Translate>(
    (key, vars) => {
      const template = dictionaries[locale][key] ?? key
      return interpolate(template, vars)
    },
    [locale],
  )

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used inside an <I18nProvider>.')
  }
  return context
}
