import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { usePersistentState } from '@/lib/usePersistentState'
import {
  applyTheme,
  resolveTheme,
  systemPrefersDark,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
} from '@/lib/theme'

interface ThemeContextValue {
  /** The user's stored choice; "system" follows the OS. */
  preference: ThemePreference
  /** The concrete theme currently applied. */
  theme: ResolvedTheme
  setPreference: (preference: ThemePreference) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function prefersDarkNow(): boolean {
  if (typeof window === 'undefined') return false
  return systemPrefersDark()
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = usePersistentState<ThemePreference>(
    THEME_STORAGE_KEY,
    'system',
  )
  const [systemDark, setSystemDark] = useState(prefersDarkNow)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event: MediaQueryListEvent) =>
      setSystemDark(event.matches)

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const theme = resolveTheme(preference, systemDark)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      theme,
      setPreference,
      toggleTheme: () => setPreference(theme === 'dark' ? 'light' : 'dark'),
    }),
    [preference, theme, setPreference],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used inside a <ThemeProvider>.')
  }
  return context
}
