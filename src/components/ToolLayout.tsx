import { ArrowLeft } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { useI18n } from '@/i18n'
import { markToolUsed } from '@/lib/recentlyUsed'
import type { Tool } from '@/registry'
import { PrivacyBadge } from './PrivacyBadge'

interface ToolLayoutProps {
  tool: Tool
  children: ReactNode
}

/** Shared page frame for every tool: back link, title, privacy badge. */
export function ToolLayout({ tool, children }: ToolLayoutProps) {
  const { t } = useI18n()

  // Record the visit so the home page can show "Recently used".
  useEffect(() => {
    markToolUsed(tool.id)
  }, [tool.id])

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-8">
      <Link
        to="/"
        className="inline-flex min-h-11 items-center gap-1.5 rounded pr-2 text-sm font-medium text-slate-600 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t('tool.backToTools')}
      </Link>

      <header className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {tool.name}
          </h1>
          <p className="mt-1 max-w-prose text-sm text-slate-600 dark:text-slate-400">
            {tool.description}
          </p>
        </div>
        <PrivacyBadge />
      </header>

      <div className="mt-6">{children}</div>
    </div>
  )
}
