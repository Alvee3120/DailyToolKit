import { FlipHorizontal, FlipVertical, RotateCcw, RotateCw } from 'lucide-react'
import { useState } from 'react'

import { DropZone } from '@/components/DropZone'
import { ErrorMessage } from '@/components/ErrorMessage'
import { ImageResultView } from '@/components/ImageResultView'
import { ProgressBar } from '@/components/ProgressBar'
import { ToolLayout } from '@/components/ToolLayout'
import {
  hintClass,
  primaryButtonClass,
  secondaryButtonClass,
} from '@/components/styles'
import { useI18n } from '@/i18n'
import {
  IMAGE_ACCEPT,
  formatExtension,
  outputFileName,
} from '@/lib/image/format'
import { useImageJob, type ImageJobSource } from '@/lib/useImageJob'
import { imageRotateMeta as meta } from './meta'
import {
  IDENTITY,
  cssTransform,
  isIdentity,
  rotateBy,
  rotatedDimensions,
  type Orientation,
} from './logic'

export default function ImageRotateTool() {
  const { t } = useI18n()
  const job = useImageJob()
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
              'rotated',
            ),
          }}
          onReset={job.reset}
        />
      ) : (
        <RotateWorkspace
          source={source}
          sourceUrl={job.sourceUrl}
          busy={busy}
          isProcessing={isProcessing}
          error={error}
          onApply={(orientation) =>
            void job.runTransform({
              rotate: orientation.rotation,
              flipHorizontal: orientation.flipHorizontal,
              flipVertical: orientation.flipVertical,
            })
          }
          onCancel={job.reset}
        />
      )}
    </ToolLayout>
  )
}

interface RotateWorkspaceProps {
  source: ImageJobSource
  sourceUrl: string | null
  busy: boolean
  isProcessing: boolean
  error: string | null
  onApply: (orientation: Orientation) => void
  onCancel: () => void
}

function RotateWorkspace({
  source,
  sourceUrl,
  busy,
  isProcessing,
  error,
  onApply,
  onCancel,
}: RotateWorkspaceProps) {
  const { t } = useI18n()
  const [orientation, setOrientation] = useState<Orientation>(IDENTITY)
  const output = rotatedDimensions(source, orientation.rotation)

  const transform = (patch: Partial<Orientation>) =>
    setOrientation((current) => ({ ...current, ...patch }))

  const actions: {
    key: string
    labelKey: Parameters<typeof t>[0]
    icon: typeof RotateCw
    onClick: () => void
  }[] = [
    {
      key: 'left',
      labelKey: 'rotate.left',
      icon: RotateCcw,
      onClick: () =>
        transform({ rotation: rotateBy(orientation.rotation, -90) }),
    },
    {
      key: 'right',
      labelKey: 'rotate.right',
      icon: RotateCw,
      onClick: () =>
        transform({ rotation: rotateBy(orientation.rotation, 90) }),
    },
    {
      key: 'flip-h',
      labelKey: 'rotate.flipH',
      icon: FlipHorizontal,
      onClick: () => transform({ flipHorizontal: !orientation.flipHorizontal }),
    },
    {
      key: 'flip-v',
      labelKey: 'rotate.flipV',
      icon: FlipVertical,
      onClick: () => transform({ flipVertical: !orientation.flipVertical }),
    },
  ]

  return (
    <div className="space-y-5">
      <div className="mx-auto flex aspect-square w-full max-w-sm items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
        {sourceUrl ? (
          <img
            src={sourceUrl}
            alt=""
            draggable={false}
            className="max-h-full max-w-full select-none object-contain transition-transform duration-200"
            style={{ transform: cssTransform(orientation) }}
          />
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.key}
              type="button"
              onClick={action.onClick}
              className={`${secondaryButtonClass} flex-col gap-1 py-3`}
            >
              <Icon className="size-5" aria-hidden="true" />
              {t(action.labelKey)}
            </button>
          )
        })}
      </div>

      <p className={hintClass}>{t('rotate.hint')}</p>
      <p className={hintClass}>
        {t('rotate.output', { width: output.width, height: output.height })}
      </p>

      {isProcessing ? (
        <ProgressBar indeterminate label={t('img.processing')} />
      ) : null}

      {error ? <ErrorMessage message={error} /> : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onApply(orientation)}
          disabled={busy || isIdentity(orientation)}
          className={primaryButtonClass}
        >
          {isProcessing ? t('img.processing') : t('rotate.process')}
        </button>
        <button
          type="button"
          onClick={() => setOrientation(IDENTITY)}
          disabled={isIdentity(orientation)}
          className={secondaryButtonClass}
        >
          {t('rotate.resetTransforms')}
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
