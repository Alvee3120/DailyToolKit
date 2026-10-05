import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import { PrivacyBadge } from '@/components/PrivacyBadge'
import { SearchField } from '@/components/SearchField'
import { ToolCard } from '@/components/ToolCard'
import { useI18n, type TranslationKey } from '@/i18n'
import { getRecentlyUsed } from '@/lib/recentlyUsed'
import {
  searchTools,
  tools,
  TOOL_CATEGORIES,
  type Tool,
  type ToolCategory,
} from '@/registry'

const CATEGORY_LABEL_KEY: Record<ToolCategory, TranslationKey> = {
  Image: 'category.Image',
  PDF: 'category.PDF',
  Text: 'category.Text',
  Utilities: 'category.Utilities',
}

function ToolGrid({ items }: { items: Tool[] }) {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((tool) => (
        <li key={tool.id}>
          <ToolCard tool={tool} />
        </li>
      ))}
    </ul>
  )
}

function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className="text-sm font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
      {children}
    </h2>
  )
}

export function HomePage() {
  const { t } = useI18n()
  // The URL query string is the single source of truth for the search term,
  // so the header search and this field always agree. `replace` keeps every
  // keystroke out of the browser history.
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''

  const setQuery = useCallback(
    (value: string) => {
      setSearchParams(value ? { q: value } : {}, { replace: true })
    },
    [setSearchParams],
  )

  const toolsById = useMemo(
    () => new Map(tools.map((tool) => [tool.id, tool])),
    [],
  )

  const results = useMemo(() => searchTools(query), [query])
  const recentTools = useMemo(
    () =>
      getRecentlyUsed()
        .map((id) => toolsById.get(id))
        .filter((tool): tool is Tool => tool !== undefined),
    [toolsById],
  )

  const trimmed = query.trim()

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      <section className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
          {t('home.heroTitle')}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">
          {t('home.heroSubtitle')}
        </p>
        <div className="mx-auto mt-6 max-w-xl">
          <SearchField value={query} onChange={setQuery} />
        </div>
        <div className="mt-4">
          <PrivacyBadge />
        </div>
      </section>

      {trimmed ? (
        <section className="mt-10">
          <h2 className="sr-only">{t('search.resultsHeading')}</h2>
          {results.length > 0 ? (
            <ToolGrid items={results} />
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {t('search.noResultsTitle')}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {t('search.noResultsBody', { query: trimmed })}
              </p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="mt-4 inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {t('search.clearAction')}
              </button>
            </div>
          )}
        </section>
      ) : (
        <>
          {recentTools.length > 0 ? (
            <section className="mt-10">
              <SectionHeading>{t('home.recentlyUsed')}</SectionHeading>
              <div className="mt-3">
                <ToolGrid items={recentTools} />
              </div>
            </section>
          ) : null}

          {TOOL_CATEGORIES.map((category) => {
            const categoryTools = tools.filter(
              (tool) => tool.category === category,
            )
            if (categoryTools.length === 0) return null

            return (
              <section key={category} className="mt-10">
                <SectionHeading>
                  {t(CATEGORY_LABEL_KEY[category])}
                </SectionHeading>
                <div className="mt-3">
                  <ToolGrid items={categoryTools} />
                </div>
              </section>
            )
          })}

          {tools.length === 0 ? (
            <p className="mt-10 text-center text-slate-500 dark:text-slate-400">
              {t('home.noTools')}
            </p>
          ) : null}
        </>
      )}
    </div>
  )
}
