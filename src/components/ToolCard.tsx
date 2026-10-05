import { Link } from 'react-router-dom'

import { useI18n } from '@/i18n'
import type { Tool, ToolCategory } from '@/registry'

const CATEGORY_ICON_CLASS: Record<ToolCategory, string> = {
  Image:
    'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-300',
  PDF: 'bg-rose-50 text-rose-600 dark:bg-rose-950/70 dark:text-rose-300',
  Text: 'bg-amber-50 text-amber-600 dark:bg-amber-950/70 dark:text-amber-300',
  Utilities: 'bg-teal-50 text-teal-600 dark:bg-teal-950/70 dark:text-teal-300',
}

export function ToolCard({ tool }: { tool: Tool }) {
  const { t } = useI18n()
  const Icon = tool.icon

  return (
    <Link
      to={tool.route}
      className="group flex h-full flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
    >
      <span className="flex items-start justify-between gap-2">
        <span
          className={`inline-flex size-10 items-center justify-center rounded-lg ${CATEGORY_ICON_CLASS[tool.category]}`}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
        {tool.heavy ? (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {t('tool.aiBadge')}
          </span>
        ) : null}
      </span>
      <span className="font-medium text-slate-900 dark:text-slate-100">
        {tool.name}
      </span>
      <span className="text-sm text-slate-600 dark:text-slate-400">
        {tool.description}
      </span>
    </Link>
  )
}
