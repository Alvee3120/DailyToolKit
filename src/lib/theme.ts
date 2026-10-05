export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

/** Stored without the "dailykit:" prefix (see lib/storage.ts). */
export const THEME_STORAGE_KEY = 'theme'

/** Turn a preference (which may be "system") into a concrete light/dark theme. */
export function resolveTheme(
  preference: ThemePreference,
  prefersDark: boolean,
): ResolvedTheme {
  if (preference === 'system') return prefersDark ? 'dark' : 'light'
  return preference
}

/** Apply the resolved theme to the document. */
export function applyTheme(
  theme: ResolvedTheme,
  root: HTMLElement = document.documentElement,
): void {
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
}

/** Whether dark mode is currently requested by the operating system. */
export function systemPrefersDark(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}
