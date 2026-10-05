import { DropZone } from '@/components/DropZone'
import { ErrorMessage } from '@/components/ErrorMessage'
import { ImagePreviewCard } from '@/components/ImagePreviewCard'
import { ImageResultView } from '@/components/ImageResultView'
import { ProgressBar } from '@/components/ProgressBar'
import { SegmentedControl } from '@/components/SegmentedControl'
import { ToolLayout } from '@/components/ToolLayout'
import {
  hintClass,
  labelClass,
  numberInputClass,
  primaryButtonClass,
  secondaryButtonClass,
  warningClass,
} from '@/components/styles'
import { useI18n } from '@/i18n'
import { formatBytes } from '@/lib/format'
import {
  IMAGE_ACCEPT,
  formatExtension,
  formatLabel,
  outputFileName,
} from '@/lib/image/format'
import { useImageJob } from '@/lib/useImageJob'
import { usePersistentState } from '@/lib/usePersistentState'
import { imageCompressMeta as meta } from './meta'

type CompressMode = 'quality' | 'size'
type SizeUnit = 'KB' | 'MB'

/** Warn above this many pixels (25 MP) — phones can struggle. */
const MEGAPIXEL_WARNING = 25_000_000

function unitToBytes(value: number, unit: SizeUnit): number {
  return unit === 'MB' ? value * 1_000_000 : value * 1000
}

export default function ImageCompressTool() {
  const { t } = useI18n()
  const job = useImageJob()
  const [mode, setMode] = usePersistentState<CompressMode>(
    'image-compress:mode',
    'quality',
  )
  const [quality, setQuality] = usePersistentState<number>(
    'image-compress:quality',
    80,
  )
  const [sizeValue, setSizeValue] = usePersistentState<number>(
    'image-compress:sizeValue',
    200,
  )
  const [sizeUnit, setSizeUnit] = usePersistentState<SizeUnit>(
    'image-compress:sizeUnit',
    'KB',
  )

  const { source, result, status, progress, stage, error } = job
  const outputFormat = source?.format ?? 'image/jpeg'
  const targetBytes = unitToBytes(sizeValue, sizeUnit)
  const isProcessing = status === 'processing'
  const busy = status === 'loading' || isProcessing

  const progressLabel =
    stage === 'scale'
      ? t('img.progress.scale')
      : stage === 'quality'
        ? t('img.progress.quality')
        : t('img.processing')

  const run = () => {
    if (!source) return
    if (mode === 'quality') {
      void job.runProcess({ format: outputFormat, quality: quality / 100 })
    } else {
      void job.runCompress({
        format: outputFormat,
        targetBytes,
        background: '#ffffff',
      })
    }
  }

  const missedTarget =
    mode === 'size' && result !== null && result.blob.size > targetBytes

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
              'compressed',
            ),
          }}
          warning={
            missedTarget
              ? t('img.target.missed', { size: formatBytes(targetBytes) })
              : null
          }
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

          {source.width * source.height > MEGAPIXEL_WARNING ? (
            <p className={warningClass}>
              {t('img.largeImage', {
                megapixels: Math.round(
                  (source.width * source.height) / 1_000_000,
                ),
              })}
            </p>
          ) : null}

          <div>
            <p className={`${labelClass} mb-2`}>{t('img.compress.mode')}</p>
            <SegmentedControl<CompressMode>
              ariaLabel={t('img.compress.mode')}
              value={mode}
              onChange={setMode}
              options={[
                { value: 'quality', label: t('img.compress.byQuality') },
                { value: 'size', label: t('img.compress.bySize') },
              ]}
            />
          </div>

          {mode === 'quality' ? (
            <div>
              <label htmlFor="compress-quality" className={labelClass}>
                {t('img.compress.quality')}: {quality}%
              </label>
              <input
                id="compress-quality"
                type="range"
                min={10}
                max={100}
                value={quality}
                onChange={(event) => setQuality(Number(event.target.value))}
                className="mt-2 w-full accent-indigo-600"
              />
              <p className={hintClass}>{t('img.compress.qualityHint')}</p>
            </div>
          ) : (
            <div>
              <label htmlFor="compress-size" className={labelClass}>
                {t('img.compress.targetSize')}
              </label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="compress-size"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={sizeValue}
                  onChange={(event) =>
                    setSizeValue(Math.max(1, Number(event.target.value) || 1))
                  }
                  className={numberInputClass}
                />
                <SegmentedControl<SizeUnit>
                  ariaLabel={t('img.compress.targetSize')}
                  value={sizeUnit}
                  onChange={setSizeUnit}
                  options={[
                    { value: 'KB', label: t('img.unit.kb') },
                    { value: 'MB', label: t('img.unit.mb') },
                  ]}
                />
              </div>
              <p className={hintClass}>{t('img.compress.targetHint')}</p>
            </div>
          )}

          <p className={hintClass}>
            {t('img.compress.formatNote', {
              format: formatLabel(outputFormat),
            })}
          </p>

          {isProcessing ? (
            <ProgressBar
              value={progress ?? undefined}
              indeterminate={progress === null}
              label={progressLabel}
            />
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={run}
              disabled={busy}
              className={primaryButtonClass}
            >
              {isProcessing ? t('img.processing') : t('img.compress.process')}
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
