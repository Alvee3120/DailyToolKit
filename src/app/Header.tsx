import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { SearchField } from '@/components/SearchField'
import { useI18n } from '@/i18n'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
        <Link
          to="/"
          className="flex min-h-11 items-center gap-2 rounded pr-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <img src="/favicon.svg" alt="" className="size-7" />
          <span className="hidden text-base font-bold tracking-tight text-slate-900 sm:inline dark:text-slate-50">
            {t('app.name')}
          </span>
        </Link>

        <form
          role="search"
          className="ml-auto w-full max-w-xs"
          onSubmit={(event) => {
            event.preventDefault()
            const value = query.trim()
            navigate(value ? `/?q=${encodeURIComponent(value)}` : '/')
          }}
        >
          <label htmlFor="header-search" className="sr-only">
            {t('header.searchLabel')}
          </label>
          <SearchField
            id="header-search"
            value={query}
            onChange={setQuery}
            placeholder={t('header.searchPlaceholder')}
          />
        </form>

        <ThemeToggle />
      </div>
    </header>
  )
}
