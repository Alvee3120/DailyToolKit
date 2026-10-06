import { useEffect, useRef } from 'react'

import { useI18n } from '@/i18n'
import { renderWatermark } from '@/lib/image/pipeline'
import type { Dimensions, Watermark } from '@/lib/image/types'

interface WatermarkPreviewProps {
  sourceUrl: string
  source: Dimensions
  logoUrl: string | null
  watermark: Watermark
}

/** Cap the preview canvas so redrawing stays instant even for huge photos. */
const MAX_PREVIEW = 960

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('image-load-failed'))
    image.src = url
  })
}

/**
 * WYSIWYG preview: renders the base image and watermark on a canvas with the
 * exact same drawing code the worker uses for the final file.
 */
export function WatermarkPreview({
  sourceUrl,
  source,
  logoUrl,
  watermark,
}: WatermarkPreviewProps) {
  const { t } = useI18n()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let cancelled = false

    const draw = async () => {
      try {
        const base = await loadImage(sourceUrl)
        const logo = logoUrl ? await loadImage(logoUrl) : null
        if (cancelled) return

        const canvas = canvasRef.current
        if (!canvas) return

        const scale = Math.min(
          1,
          MAX_PREVIEW / Math.max(source.width, source.height),
        )
        const width = Math.max(1, Math.round(source.width * scale))
        const height = Math.max(1, Math.round(source.height * scale))
        canvas.width = width
        canvas.height = height

        const context = canvas.getContext('2d')
        if (!context) return
        renderWatermark(context, base, logo, watermark, { width, height })
      } catch {
        // Best-effort preview; the final render still runs in the worker.
      }
    }

    void draw()
    return () => {
      cancelled = true
    }
  }, [sourceUrl, source.width, source.height, logoUrl, watermark])

  return (
    <canvas
      ref={canvasRef}
      aria-label={t('wm.preview')}
      className="mx-auto block max-h-[60vh] max-w-full rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950"
    />
  )
}
