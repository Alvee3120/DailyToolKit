import { useMemo, useRef, useState } from 'react'

import { DropZone } from '@/components/DropZone'
import { ErrorMessage } from '@/components/ErrorMessage'
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
  outputFileName,
} from '@/lib/image/format'
import type { Watermark } from '@/lib/image/types'
import { useImageJob } from '@/lib/useImageJob'
import { useObjectUrl } from '@/lib/useObjectUrl'
import { usePersistentState } from '@/lib/usePersistentState'
import { PositionPicker } from './PositionPicker'
import { WatermarkPreview } from './WatermarkPreview'
import {
  DEFAULT_IMAGE,
  DEFAULT_TEXT,
  TEXT_FONTS,
  type ImageSettings,
  type Placement,
  type TextSettings,
} from './logic'
import { imageWatermarkMeta as meta } from './meta'

type WatermarkMode = 'text' | 'image'

const percent = (value: number) => `${Math.round(value * 100)}%`

export default function ImageWatermarkTool() {
  const { t } = useI18n()
  const job = useImageJob()
  const [mode, setMode] = usePersistentState<WatermarkMode>(
    'image-watermark:mode',
    'text',
  )
  const [text, setText] = usePersistentState<TextSettings>(
    'image-watermark:text',
    DEFAULT_TEXT,
  )
  const [image, setImage] = usePersistentState<ImageSettings>(
    'image-watermark:image',
    DEFAULT_IMAGE,
  )
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const logoUrl = useObjectUrl(logoFile)

  const { source, result, status, error } = job
  const isProcessing = status === 'processing'
  const busy = status === 'loading' || isProcessing

  const watermark = useMemo<Watermark>(() => {
    if (mode === 'text') return { kind: 'text', ...text }
    return { kind: 'image', logo: logoFile ?? new Blob(), ...image }
  }, [mode, text, image, logoFile])

  const canApply =
    mode === 'text' ? text.text.trim().length > 0 : logoFile !== null

  const run = () => {
    if (!canApply) return
    void job.runWatermark(watermark)
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
              'watermarked',
            ),
          }}
          onReset={job.reset}
        />
      ) : (
        <div className="space-y-5">
          {job.sourceUrl ? (
            <WatermarkPreview
              sourceUrl={job.sourceUrl}
              source={{ width: source.width, height: source.height }}
              logoUrl={mode === 'image' ? logoUrl : null}
              watermark={watermark}
            />
          ) : null}

          <div>
            <p className={`${labelClass} mb-2`}>{t('wm.type')}</p>
            <SegmentedControl<WatermarkMode>
              ariaLabel={t('wm.type')}
              value={mode}
              onChange={setMode}
              options={[
                { value: 'text', label: t('wm.type.text') },
                { value: 'image', label: t('wm.type.image') },
              ]}
            />
          </div>

          {mode === 'text' ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="wm-text" className={labelClass}>
                  {t('wm.text')}
                </label>
                <input
                  id="wm-text"
                  type="text"
                  value={text.text}
                  placeholder={t('wm.textPlaceholder')}
                  onChange={(event) =>
                    setText({ ...text, text: event.target.value })
                  }
                  className={`${inputClass} mt-2`}
                />
              </div>

              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label htmlFor="wm-font" className={labelClass}>
                    {t('wm.font')}
                  </label>
                  <select
                    id="wm-font"
                    value={text.fontFamily}
                    onChange={(event) =>
                      setText({ ...text, fontFamily: event.target.value })
                    }
                    className={`${inputClass} mt-2 w-40`}
                  >
                    {TEXT_FONTS.map((font) => (
                      <option key={font.value} value={font.value}>
                        {t(font.labelKey)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="wm-color" className={labelClass}>
                    {t('wm.color')}
                  </label>
                  <input
                    id="wm-color"
                    type="color"
                    value={text.color}
                    onChange={(event) =>
                      setText({ ...text, color: event.target.value })
                    }
                    className={`${inputClass} mt-2 h-11 w-16 cursor-pointer p-1`}
                  />
                </div>

                <label className="inline-flex min-h-11 items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={text.bold}
                    onChange={(event) =>
                      setText({ ...text, bold: event.target.checked })
                    }
                    className="size-5 accent-indigo-600"
                  />
                  {t('wm.bold')}
                </label>

                <label className="inline-flex min-h-11 items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={text.italic}
                    onChange={(event) =>
                      setText({ ...text, italic: event.target.checked })
                    }
                    className="size-5 accent-indigo-600"
                  />
                  {t('wm.italic')}
                </label>
              </div>

              <PlacementControls
                placement={text}
                onChange={(patch) => setText({ ...text, ...patch })}
                sizeLabel={t('wm.size')}
                size={text.size}
                onSize={(size) => setText({ ...text, size })}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className={labelClass}>{t('wm.logo')}</p>
                <div className="mt-2 flex items-center gap-3">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt=""
                      className="h-12 w-auto max-w-32 rounded border border-slate-200 bg-slate-50 object-contain p-1 dark:border-slate-700 dark:bg-slate-900"
                    />
                  ) : null}
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className={secondaryButtonClass}
                  >
                    {logoUrl ? t('wm.logoChange') : t('wm.logoPick')}
                  </button>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept={IMAGE_ACCEPT}
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) setLogoFile(file)
                      event.target.value = ''
                    }}
                  />
                </div>
                <p className={hintClass}>{t('wm.logoHint')}</p>
              </div>

              <PlacementControls
                placement={image}
                onChange={(patch) => setImage({ ...image, ...patch })}
                sizeLabel={t('wm.scale')}
                size={image.scale}
                onSize={(scale) => setImage({ ...image, scale })}
              />
            </div>
          )}

          <p className={hintClass}>{t('wm.hint')}</p>

          {isProcessing ? (
            <ProgressBar indeterminate label={t('img.processing')} />
          ) : null}

          {error ? <ErrorMessage message={error} /> : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={run}
              disabled={busy || !canApply}
              className={primaryButtonClass}
            >
              {isProcessing ? t('img.processing') : t('wm.process')}
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

interface SliderFieldProps {
  id: string
  label: string
  value: number
  min: number
  max: number
  step: number
  format: (value: number) => string
  onChange: (value: number) => void
}

function SliderField({
  id,
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: SliderFieldProps) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}: {format(value)}
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full accent-indigo-600"
      />
    </div>
  )
}

interface PlacementControlsProps {
  placement: Placement
  onChange: (patch: Partial<Placement>) => void
  sizeLabel: string
  size: number
  onSize: (value: number) => void
}

/** Position + the numeric controls shared by both watermark modes. */
function PlacementControls({
  placement,
  onChange,
  sizeLabel,
  size,
  onSize,
}: PlacementControlsProps) {
  const { t } = useI18n()

  return (
    <div className="space-y-4">
      <div>
        <p className={`${labelClass} mb-2`}>{t('wm.position')}</p>
        <PositionPicker
          value={placement.position}
          onChange={(position) => onChange({ position })}
        />
      </div>

      <SliderField
        id="wm-size"
        label={sizeLabel}
        value={size}
        min={0.02}
        max={0.4}
        step={0.01}
        format={percent}
        onChange={onSize}
      />
      <SliderField
        id="wm-opacity"
        label={t('wm.opacity')}
        value={placement.opacity}
        min={0.05}
        max={1}
        step={0.05}
        format={percent}
        onChange={(opacity) => onChange({ opacity })}
      />
      <SliderField
        id="wm-rotation"
        label={t('wm.rotation')}
        value={placement.rotation}
        min={-180}
        max={180}
        step={1}
        format={(value) => `${value}°`}
        onChange={(rotation) => onChange({ rotation })}
      />
      <SliderField
        id="wm-margin"
        label={t('wm.margin')}
        value={placement.margin}
        min={0}
        max={0.2}
        step={0.005}
        format={percent}
        onChange={(margin) => onChange({ margin })}
      />
    </div>
  )
}
