import { DropZone } from '@/components/DropZone'
import { ErrorMessage } from '@/components/ErrorMessage'
import { ImagePreviewCard } from '@/components/ImagePreviewCard'
import { ImageResultView } from '@/components/ImageResultView'
import { ProgressBar } from '@/components/ProgressBar'
import { SegmentedControl } from '@/components/SegmentedControl'
import { ToolLayout } from '@/components/ToolLayout'
import {
  hintClass,
  inputClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from '@/components/styles'
import { useI18n } from '@/i18n'
import {
  IMAGE_ACCEPT,
  formatExtension,
  formatLabel,
  isLossy,
  outputFileName,
} from '@/lib/image/format'
import type { ImageFormat } from '@/lib/image/types'
import { useImageJob } from '@/lib/useImageJob'
import { usePersistentState } from '@/lib/usePersistentState'
import { imageConvertMeta as meta } from './meta'

const FORMAT_OPTIONS: ImageFormat[] = ['image/jpeg', 'image/png', 'image/webp']

export default function ImageConvertTool() {
  const { t } = useI18n()
  const job = useImageJob()
  const [formatChoice, setFormatChoice] =
    usePersistentState<ImageFormat | null>('image-convert:format', null)
  const [quality, setQuality] = usePersistentState<number>(
    'image-convert:quality',
    90,
  )
  const [background, setBackground] = usePersistentState<string>(
    'image-convert:background',
    '#ffffff',
  )

  const { source, result, status, error } = job
  const targetFormat = formatChoice ?? source?.format ?? 'image/jpeg'
  const isProcessing = status === 'processing'
  const busy = status === 'loading' || isProcessing

  const run = () => {
    if (!source) return
    void job.runProcess({
      format: targetFormat,
      quality: quality / 100,
      background,
    })
  }

  return (
    <ToolLayout tool={meta}>
      {!source ? (
        <div className="space-y-3">
          <DropZone
            accept={IMAGE_ACCEPT}
            onFiles={(files) => {
              const file = files[0]
              if (file) void job.select(file)
            }}
          />
          {status === 'loading' ? (
            <ProgressBar indeterminate label={t('img.processing')} />
          ) : null}
          {error ? <ErrorMessage message={error} onRetry={job.reset} /> : null}
        </div>
      ) : result ? (
        <ImageResultView
          source={{
            url: job.sourceUrl,
            width: source.width,
            height: source.height,
            bytes: source.bytes,
          }}
          result={{
            url: job.resultUrl,
            width: result.width,
            height: result.height,
            bytes: result.blob.size,
            filename: outputFileName(
              source.file.name,
              formatExtension(result.format),
            ),
          }}
          onReset={job.reset}
        />
      ) : (
        <div className="space-y-5">
          <ImagePreviewCard
            url={job.sourceUrl}
            title={t('img.original')}
            width={source.width}
            height={source.height}
            bytes={source.bytes}
          />

          <div>
            <p className={`${labelClass} mb-2`}>{t('img.convert.format')}</p>
            <SegmentedControl<ImageFormat>
              ariaLabel={t('img.convert.format')}
              value={targetFormat}
              onChange={setFormatChoice}
              options={FORMAT_OPTIONS.map((format) => ({
                value: format,
                label: formatLabel(format),
              }))}
            />
          </div>

          {source.format ? (
            <p className={hintClass}>
              {t('img.convert.current', {
                format: formatLabel(source.format),
              })}
            </p>
          ) : null}

          {isLossy(targetFormat) ? (
            <div>
              <label htmlFor="convert-quality" className={labelClass}>
                {t('img.compress.quality')}: {quality}%
              </label>
              <input
                id="convert-quality"
                type="range"
                min={10}
                max={100}
                value={quality}
                onChange={(event) => setQuality(Number(event.target.value))}
                className="mt-2 w-full accent-indigo-600"
              />
            </div>
          ) : null}

          {targetFormat === 'image/jpeg' ? (
            <div>
              <label htmlFor="convert-background" className={labelClass}>
                {t('img.convert.background')}
              </label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  id="convert-background"
                  type="color"
                  value={background}
                  onChange={(event) => setBackground(event.target.value)}
                  className={`${inputClass} h-11 w-16 cursor-pointer p-1`}
                />
                <p className={hintClass}>{t('img.convert.backgroundHint')}</p>
              </div>
            </div>
          ) : null}

          {isProcessing ? (
            <ProgressBar indeterminate label={t('img.processing')} />
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={run}
              disabled={busy}
              className={primaryButtonClass}
            >
              {isProcessing ? t('img.processing') : t('img.convert.process')}
            </button>
            <button
              type="button"
              onClick={job.reset}
              className={secondaryButtonClass}
            >
              {t('img.reset')}
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  )
}
