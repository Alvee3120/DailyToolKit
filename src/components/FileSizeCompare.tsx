import { useI18n } from '@/i18n'
import { formatBytes, percentSaved } from '@/lib/format'

interface FileSizeCompareProps {
  beforeBytes: number
  afterBytes: number
}

export function FileSizeCompare({
  beforeBytes,
  afterBytes,
}: FileSizeCompareProps) {
  const { t } = useI18n()
  const saved = percentSaved(beforeBytes, afterBytes)

  const badgeClass =
    saved > 0
      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
      : saved < 0
        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'

  const badgeText =
    saved > 0
      ? t('size.smaller', { percent: saved })
      : saved < 0
        ? t('size.larger', { percent: Math.abs(saved) })
        : t('size.same')

  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
      <span className="text-slate-500 dark:text-slate-400">
        {formatBytes(beforeBytes)}
      </span>
      <span aria-hidden="true" className="text-slate-400">
        →
      </span>
      <span className="font-medium text-slate-900 dark:text-slate-100">
        {formatBytes(afterBytes)}
      </span>
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-medium ${badgeClass}`}
      >
        {badgeText}
      </span>
    </p>
  )
}
