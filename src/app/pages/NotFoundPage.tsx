import { Link } from 'react-router-dom'

import { useI18n } from '@/i18n'

export function NotFoundPage() {
  const { t } = useI18n()

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="text-5xl font-bold text-slate-300 dark:text-slate-700">
        404
      </p>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
        {t('notFound.title')}
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        {t('notFound.body')}
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        {t('notFound.action')}
      </Link>
    </div>
  )
}
