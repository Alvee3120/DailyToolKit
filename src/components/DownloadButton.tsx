import { Download } from 'lucide-react'
import type { ReactNode } from 'react'

import { useI18n } from '@/i18n'

interface DownloadButtonProps {
  url: string
  filename: string
  children?: ReactNode
  className?: string
  onClick?: () => void
}

export function DownloadButton({
  url,
  filename,
  children,
  className = '',
  onClick,
}: DownloadButtonProps) {
  const { t } = useI18n()

  return (
    <a
      href={url}
      download={filename}
      onClick={onClick}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${className}`}
    >
      <Download className="size-4 shrink-0" aria-hidden="true" />
      {children ?? t('download.button')}
    </a>
  )
}
