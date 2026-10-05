import { ShieldCheck } from 'lucide-react'

import { useI18n } from '@/i18n'

export function PrivacyBadge({ className = '' }: { className?: string }) {
  const { t } = useI18n()

  return (
    <p
      className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 ${className}`}
    >
      <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
      {t('privacy.badge')}
    </p>
  )
}
