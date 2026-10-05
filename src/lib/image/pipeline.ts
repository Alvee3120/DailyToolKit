import { fitWithin, isLossy } from './format'
import { findBestQuality, nextScale } from './search'
import type {
  Dimensions,
  ImageFormat,
  ProcessOptions,
  ProcessResult,
  TargetProgress,
  TargetSizeOptions,
} from './types'

type AnyCanvas = OffscreenCanvas | HTMLCanvasElement
type AnyContext = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D

/** How many times the target-size search may downscale before giving up. */
const MAX_TARGET_ATTEMPTS = 4

/**
 * Canvas drawing + encoding. Runs inside a Web Worker (OffscreenCanvas) when
 * available, and falls back to a normal <canvas> on the main thread otherwise.
 * The code is identical in both places.
 */
function createCanvas(width: number, height: number): AnyCanvas {
  if (typeof OffscreenCanvas !== 'undefined') {
    return new OffscreenCanvas(width, height)
  }
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

function isOffscreen(canvas: AnyCanvas): canvas is OffscreenCanvas {
  return (
    typeof OffscreenCanvas !== 'undefined' && canvas instanceof OffscreenCanvas
  )
}

async function canvasToBlob(
  canvas: AnyCanvas,
  format: ImageFormat,
  quality: number,
): Promise<Blob> {
  const qualityOption = isLossy(format) ? quality : undefined

  if (isOffscreen(canvas)) {
    return canvas.convertToBlob({ type: format, quality: qualityOption })
  }

  return new Promise<Blob>((resolve, reject) => {
    ;(canvas as HTMLCanvasElement).toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('image-encode-failed'))
      },
      format,
      qualityOption,
    )
  })
}

export async function encodeBitmap(
  bitmap: ImageBitmap,
  target: Dimensions,
  options: ProcessOptions,
): Promise<Blob> {
  const canvas = createCanvas(target.width, target.height)
  const context = (canvas as OffscreenCanvas).getContext(
    '2d',
  ) as AnyContext | null
  if (!context) throw new Error('image-context-unavailable')

  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'

  // JPEG cannot store transparency, so flatten it onto a solid colour first.
  if (options.format === 'image/jpeg') {
    context.fillStyle = options.background ?? '#ffffff'
    context.fillRect(0, 0, target.width, target.height)
  }

  context.drawImage(bitmap, 0, 0, target.width, target.height)

  return canvasToBlob(canvas, options.format, options.quality)
}

export async function processBitmap(
  bitmap: ImageBitmap,
  options: ProcessOptions,
): Promise<ProcessResult> {
  const target = options.target ?? {
    width: bitmap.width,
    height: bitmap.height,
  }
  const blob = await encodeBitmap(bitmap, target, options)
  return {
    blob,
    width: target.width,
    height: target.height,
    format: options.format,
  }
}

/**
 * Compress to a target byte size: binary-search the quality, and if even the
 * lowest quality is too big, downscale the dimensions and try again.
 */
export async function compressBitmapToTarget(
  bitmap: ImageBitmap,
  options: TargetSizeOptions,
  onProgress?: (progress: TargetProgress) => void,
): Promise<ProcessResult> {
  const source: Dimensions = { width: bitmap.width, height: bitmap.height }
  const maxDimension =
    options.maxDimension ?? Math.max(source.width, source.height)
  const lossy = isLossy(options.format)
  const span = 1 / MAX_TARGET_ATTEMPTS

  let scale = 1
  let best: ProcessResult | undefined

  const encodeWith = (target: Dimensions, quality: number) =>
    encodeBitmap(bitmap, target, {
      format: options.format,
      quality,
      background: options.background,
    })

  for (let attempt = 0; attempt < MAX_TARGET_ATTEMPTS; attempt += 1) {
    const limit = Math.max(16, Math.round(maxDimension * scale))
    const target = fitWithin(source, limit)
    const base = attempt * span

    if (lossy) {
      const found = await findBestQuality(
        async (quality) => (await encodeWith(target, quality)).size,
        options.targetBytes,
        {
          onStep: (fraction) =>
            onProgress?.({
              fraction: base + fraction * span,
              stage: 'quality',
            }),
        },
      )

      const blob = await encodeWith(target, found.quality)
      const result: ProcessResult = {
        blob,
        width: target.width,
        height: target.height,
        format: options.format,
      }
      if (!best || blob.size < best.blob.size) best = result

      if (found.reached) {
        onProgress?.({ fraction: 1, stage: 'quality' })
        return result
      }
    } else {
      const blob = await encodeWith(target, 1)
      onProgress?.({ fraction: base + span, stage: 'scale' })

      const result: ProcessResult = {
        blob,
        width: target.width,
        height: target.height,
        format: options.format,
      }
      if (!best || blob.size < best.blob.size) best = result

      if (blob.size <= options.targetBytes) {
        onProgress?.({ fraction: 1, stage: 'scale' })
        return result
      }
    }

    scale = nextScale(scale)
  }

  if (!best) throw new Error('image-target-unreachable')
  onProgress?.({ fraction: 1, stage: 'scale' })
  return best
}
