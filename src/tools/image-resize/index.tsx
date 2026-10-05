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
  numberInputClass,
  primaryButtonClass,
  secondaryButtonClass,
  warningClass,
} from '@/components/styles'
import { useI18n } from '@/i18n'
import {
  IMAGE_ACCEPT,
  clampDimension,
  formatExtension,
  outputFileName,
  resolveTargetDimensions,
} from '@/lib/image/format'
import type { ResizeRequest } from '@/lib/image/types'
import { useImageJob } from '@/lib/useImageJob'
import { usePersistentState } from '@/lib/usePersistentState'
import { imageResizeMeta as meta } from './meta'
import { RESIZE_PRESETS } from './presets'

type ResizeMode = 'pixels' | 'percent'

const MEGAPIXEL_WARNING = 25_000_000
const RESIZE_QUALITY = 0.92

export default function ImageResizeTool() {
  const { t } = useI18n()
  const job = useImageJob()
  const [mode, setMode] = usePersistentState<ResizeMode>(
    'image-resize:mode',
    'pixels',
  )
  const [width, setWidth] = usePersistentState<number | null>(
    'image-resize:width',
    null,
  )
  const [height, setHeight] = usePersistentState<number | null>(
    'image-resize:height',
    null,
  )
  const [lock, setLock] = usePersistentState<boolean>('image-resize:lock', true)
  const [percent, setPercent] = usePersistentState<number>(
    'image-resize:percent',
    50,
  )
  const [presetId, setPresetId] = usePersistentState<string>(
    'image-resize:preset',
    'custom',
  )

  const { source, result, status, error } = job
  const outputFormat = source?.format ?? 'image/jpeg'
  const isProcessing = status === 'processing'
  const busy = status === 'loading' || isProcessing

  const sourceSize = source
    ? { width: source.width, height: source.height }
    : { width: 0, height: 0 }

  const request: ResizeRequest =
    mode === 'percent'
      ? { percent }
      : {
          width: width ?? sourceSize.width,
          height: height ?? sourceSize.height,
          lockAspect: lock,
        }

  const target = source
    ? resolveTargetDimensions(sourceSize, request)
    : sourceSize

  const handleWidth = (value: number) => {
    const next = clampDimension(value)
    setWidth(next)
    setPresetId('custom')
    if (lock && source) {
      setHeight(clampDimension(next / (source.width / source.height)))
    }
  }

  const handleHeight = (value: number) => {
    const next = clampDimension(value)
    setHeight(next)
    setPresetId('custom')
    if (lock && source) {
      setWidth(clampDimension(next * (source.width / source.height)))
    }
  }

  const applyPreset = (id: string) => {
    setPresetId(id)
    const preset = RESIZE_PRESETS.find((item) => item.id === id)
    if (!preset) return
    setMode('pixels')
    setLock(false)
    setWidth(preset.width)
    setHeight(preset.height)
  }

  const run = () => {
    if (!source) return
    void job.runProcess({
      format: outputFormat,
      quality: RESIZE_QUALITY,
      target,
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
              'resized',
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
            <label htmlFor="resize-preset" className={labelClass}>
              {t('img.resize.preset')}
            </label>
            <select
              id="resize-preset"
              value={presetId}
              onChange={(event) => applyPreset(event.target.value)}
              className={`${inputClass} mt-2`}
            >
              <option value="custom">{t('img.resize.presetCustom')}</option>
              {RESIZE_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {t(preset.labelKey)} ({preset.width}×{preset.height})
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className={`${labelClass} mb-2`}>{t('img.resize.mode')}</p>
            <SegmentedControl<ResizeMode>
              ariaLabel={t('img.resize.mode')}
              value={mode}
              onChange={setMode}
              options={[
                { value: 'pixels', label: t('img.resize.byPixels') },
                { value: 'percent', label: t('img.resize.byPercent') },
              ]}
            />
          </div>

          {mode === 'pixels' ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label htmlFor="resize-width" className={labelClass}>
                    {t('img.resize.width')}
                  </label>
                  <input
                    id="resize-width"
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={width ?? source.width}
                    onChange={(event) =>
                      handleWidth(Number(event.target.value) || 1)
                    }
                    className={`${numberInputClass} mt-2`}
                  />
                </div>
                <div>
                  <label htmlFor="resize-height" className={labelClass}>
                    {t('img.resize.height')}
                  </label>
                  <input
                    id="resize-height"
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={height ?? source.height}
                    onChange={(event) =>
                      handleHeight(Number(event.target.value) || 1)
                    }
                    className={`${numberInputClass} mt-2`}
                  />
                </div>
              </div>

              <label className="inline-flex min-h-11 items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={lock}
                  onChange={(event) => setLock(event.target.checked)}
                  className="size-5 accent-indigo-600"
                />
                {t('img.resize.lock')}
              </label>
            </div>
          ) : (
            <div>
              <label htmlFor="resize-percent" className={labelClass}>
                {t('img.resize.percent')}: {percent}%
              </label>
              <input
                id="resize-percent"
                type="range"
                min={5}
                max={100}
                step={5}
                value={percent}
                onChange={(event) => setPercent(Number(event.target.value))}
                className="mt-2 w-full accent-indigo-600"
              />
            </div>
          )}

          <p className={hintClass}>
            {t('img.result')}: {target.width} × {target.height} px
          </p>

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
              {isProcessing ? t('img.processing') : t('img.resize.process')}
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
