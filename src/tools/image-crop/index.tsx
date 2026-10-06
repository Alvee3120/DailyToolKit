import { useState } from 'react'

import { DropZone } from '@/components/DropZone'
import { ErrorMessage } from '@/components/ErrorMessage'
import { ImageResultView } from '@/components/ImageResultView'
import { ProgressBar } from '@/components/ProgressBar'
import { ToolLayout } from '@/components/ToolLayout'
import {
  hintClass,
  inputClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
  warningClass,
} from '@/components/styles'
import { useI18n } from '@/i18n'
import {
  IMAGE_ACCEPT,
  formatExtension,
  outputFileName,
} from '@/lib/image/format'
import { useImageJob, type ImageJobSource } from '@/lib/useImageJob'
import { usePersistentState } from '@/lib/usePersistentState'
import { CropEditor } from './CropEditor'
import {
  CROP_PRESETS,
  FULL_CROP,
  centeredCrop,
  toPixelCrop,
  type NormalizedRect,
} from './logic'
import { imageCropMeta as meta } from './meta'

const MEGAPIXEL_WARNING = 25_000_000

export default function ImageCropTool() {
  const { t } = useI18n()
  const job = useImageJob()
  const [aspectId, setAspectId] = usePersistentState<string>(
    'image-crop:aspect',
    'free',
  )

  const { source, result, status, error } = job
  const isProcessing = status === 'processing'
  const busy = status === 'loading' || isProcessing

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
              'cropped',
            ),
          }}
          onReset={job.reset}
        />
      ) : (
        <CropWorkspace
          key={aspectId}
          source={source}
          sourceUrl={job.sourceUrl}
          aspectId={aspectId}
          onAspectChange={setAspectId}
          busy={busy}
          isProcessing={isProcessing}
          error={error}
          onApply={(crop) => void job.runTransform({ crop })}
          onCancel={job.reset}
        />
      )}
    </ToolLayout>
  )
}

interface CropWorkspaceProps {
  source: ImageJobSource
  sourceUrl: string | null
  aspectId: string
  onAspectChange: (id: string) => void
  busy: boolean
  isProcessing: boolean
  error: string | null
  onApply: (crop: ReturnType<typeof toPixelCrop>) => void
  onCancel: () => void
}

function CropWorkspace({
  source,
  sourceUrl,
  aspectId,
  onAspectChange,
  busy,
  isProcessing,
  error,
  onApply,
  onCancel,
}: CropWorkspaceProps) {
  const { t } = useI18n()
  const preset =
    CROP_PRESETS.find((item) => item.id === aspectId) ?? CROP_PRESETS[0]
  const imageAspect = source.width / source.height
  const targetAspect = preset.id === 'original' ? imageAspect : preset.ratio
  const aspect = targetAspect ? targetAspect / imageAspect : null

  const initialCrop = (): NormalizedRect =>
    targetAspect ? centeredCrop(imageAspect, targetAspect) : FULL_CROP

  const [crop, setCrop] = useState<NormalizedRect>(initialCrop)
  const output = toPixelCrop(crop, source)

  return (
    <div className="space-y-5">
      {source.width * source.height > MEGAPIXEL_WARNING ? (
        <p className={warningClass}>
          {t('img.largeImage', {
            megapixels: Math.round((source.width * source.height) / 1_000_000),
          })}
        </p>
      ) : null}

      {sourceUrl ? (
        <CropEditor
          url={sourceUrl}
          crop={crop}
          aspect={aspect}
          onChange={setCrop}
        />
      ) : null}

      <div>
        <label htmlFor="crop-aspect" className={labelClass}>
          {t('crop.aspect')}
        </label>
        <select
          id="crop-aspect"
          value={preset.id}
          onChange={(event) => onAspectChange(event.target.value)}
          className={`${inputClass} mt-2`}
        >
          {CROP_PRESETS.map((item) => (
            <option key={item.id} value={item.id}>
              {t(item.labelKey)}
            </option>
          ))}
        </select>
        <p className={hintClass}>{t('crop.hint')}</p>
      </div>

      <p className={hintClass}>
        {t('crop.output', { width: output.width, height: output.height })}
      </p>

      {isProcessing ? (
        <ProgressBar indeterminate label={t('img.processing')} />
      ) : null}

      {error ? <ErrorMessage message={error} /> : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onApply(output)}
          disabled={busy}
          className={primaryButtonClass}
        >
          {isProcessing ? t('img.processing') : t('crop.process')}
        </button>
        <button
          type="button"
          onClick={() => setCrop(initialCrop())}
          className={secondaryButtonClass}
        >
          {t('crop.resetSelection')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={secondaryButtonClass}
        >
          {t('img.reset')}
        </button>
      </div>
    </div>
  )
}
