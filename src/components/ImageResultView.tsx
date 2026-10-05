import { useI18n } from '@/i18n'
import { DownloadButton } from './DownloadButton'
import { FileSizeCompare } from './FileSizeCompare'
import { ImagePreviewCard } from './ImagePreviewCard'

interface Preview {
  url: string | null
  width: number
  height: number
  bytes: number
}

interface ImageResultViewProps {
  source: Preview
  result: Preview & { filename: string }
  warning?: string | null
  onReset: () => void
}

/** Before/after preview, size comparison, download and "start over". */
export function ImageResultView({
  source,
  result,
  warning,
  onReset,
}: ImageResultViewProps) {
  const { t } = useI18n()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ImagePreviewCard
          url={source.url}
          title={t('img.original')}
          width={source.width}
          height={source.height}
          bytes={source.bytes}
        />
        <ImagePreviewCard
          url={result.url}
          title={t('img.result')}
          width={result.width}
          height={result.height}
          bytes={result.bytes}
          alt={t('img.result')}
        />
      </div>

      {warning ? (
        <p
          role="status"
          className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
        >
          {warning}
        </p>
      ) : null}

      <FileSizeCompare beforeBytes={source.bytes} afterBytes={result.bytes} />

      <div className="flex flex-wrap items-center gap-3">
        {result.url ? (
          <DownloadButton url={result.url} filename={result.filename} />
        ) : null}
        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {t('img.reset')}
        </button>
      </div>
    </div>
  )
}
