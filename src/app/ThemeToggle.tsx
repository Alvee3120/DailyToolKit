import { Moon, Sun } from 'lucide-react'

import { useI18n } from '@/i18n'
import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useI18n()

  const isDark = theme === 'dark'
  const label = isDark ? t('theme.toggleToLight') : t('theme.toggleToDark')

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      {isDark ? (
        <Sun className="size-5" aria-hidden="true" />
      ) : (
        <Moon className="size-5" aria-hidden="true" />
      )}
    </button>
  )
}
