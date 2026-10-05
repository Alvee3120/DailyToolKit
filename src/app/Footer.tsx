import { Lock } from 'lucide-react'

import { useI18n } from '@/i18n'

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-slate-500 dark:text-slate-400">
        <p className="flex items-center gap-2">
          <Lock
            className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
            aria-hidden="true"
          />
          {t('footer.privacy')}
        </p>
        <p className="mt-1">{t('footer.tagline')}</p>
      </div>
    </footer>
  )
}
