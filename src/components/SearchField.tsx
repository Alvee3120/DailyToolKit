import { Search, X } from 'lucide-react'

import { useI18n } from '@/i18n'

interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  id?: string
  className?: string
}

export function SearchField({
  value,
  onChange,
  placeholder,
  id,
  className = '',
}: SearchFieldProps) {
  const { t } = useI18n()

  return (
    <div className={`relative ${className}`}>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder ?? t('home.searchPlaceholder')}
        className="min-h-11 w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-10 pl-9 text-base text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label={t('search.clear')}
          className="absolute top-1/2 right-1.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  )
}
