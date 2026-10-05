import { ChevronDown } from 'lucide-react'
import { useState, type ReactNode } from 'react'

import { useI18n } from '@/i18n'

interface OptionsPanelProps {
  children: ReactNode
  title?: string
  defaultOpen?: boolean
}

/** Collapsible section for advanced options, closed by default. */
export function OptionsPanel({
  children,
  title,
  defaultOpen = false,
}: OptionsPanelProps) {
  const { t } = useI18n()
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-11 w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 dark:text-slate-200 dark:hover:bg-slate-900"
      >
        <span>{title ?? t('options.advanced')}</span>
        <ChevronDown
          className={`size-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <div
        hidden={!open}
        className="border-t border-slate-200 p-3 dark:border-slate-800"
      >
        {children}
      </div>
    </div>
  )
}
