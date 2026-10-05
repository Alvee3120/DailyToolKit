import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { useI18n } from '@/i18n'
import { Footer } from './Footer'
import { Header } from './Header'

function RouteFallback() {
  const { t } = useI18n()

  return (
    <div
      role="status"
      className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-slate-500 dark:text-slate-400"
    >
      {t('tool.loading')}
    </div>
  )
}

export function Layout() {
  const { t } = useI18n()

  return (
    <div className="flex min-h-full flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-indigo-600 focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        {t('app.skipToContent')}
      </a>

      <Header />

      <main id="content" className="flex-1">
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}
