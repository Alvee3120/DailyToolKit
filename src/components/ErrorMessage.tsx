import { TriangleAlert } from 'lucide-react'

import { useI18n } from '@/i18n'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  const { t } = useI18n()

  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200"
    >
      <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="flex-1">
        <p>{message}</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-1 font-medium underline underline-offset-2 hover:no-underline"
          >
            {t('common.tryAgain')}
          </button>
        ) : null}
      </div>
    </div>
  )
}
