import type { Dimensions, ImageFormat, ResizeRequest } from './types'

export const IMAGE_FORMATS: ImageFormat[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
]

const EXTENSIONS: Record<ImageFormat, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

const LABELS: Record<ImageFormat, string> = {
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
  'image/webp': 'WebP',
}

export function formatExtension(format: ImageFormat): string {
  return EXTENSIONS[format]
}

export function formatLabel(format: ImageFormat): string {
  return LABELS[format]
}

/** JPEG has no alpha; WebP does but we still allow a soft quality setting. */
export function isLossy(format: ImageFormat): boolean {
  return format !== 'image/png'
}

export function formatFromMime(type?: string): ImageFormat | null {
  const normalized = (type ?? '').toLowerCase()
  if (normalized === 'image/jpeg' || normalized === 'image/jpg') {
    return 'image/jpeg'
  }
  if (normalized === 'image/png') return 'image/png'
  if (normalized === 'image/webp') return 'image/webp'
  return null
}

export function formatFromFileName(name: string): ImageFormat | null {
  const lower = name.toLowerCase()
  if (/\.(jpe?g)$/.test(lower)) return 'image/jpeg'
  if (/\.png$/.test(lower)) return 'image/png'
  if (/\.webp$/.test(lower)) return 'image/webp'
  return null
}

/** Best-effort detection of the format a file will decode to. */
export function detectImageFormat(file: File): ImageFormat | null {
  return formatFromMime(file.type) ?? formatFromFileName(file.name)
}

/** Accept string for the image tools' file inputs. */
export const IMAGE_ACCEPT =
  'image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif'

/** Build a tidy download name like "photo-small.jpg" from an original name. */
export function outputFileName(
  originalName: string,
  extension: string,
  suffix?: string,
): string {
  const base = originalName.replace(/\.[^.]+$/, '') || 'image'
  const safe =
    base
      .replace(/[^\w.-]+/g, '-')
      .replace(/^[-.]+|[-.]+$/g, '')
      .slice(0, 60) || 'image'
  return `${safe}${suffix ? `-${suffix}` : ''}.${extension}`
}

export function clampDimension(value: number): number {
  if (!Number.isFinite(value)) return 1
  return Math.max(1, Math.round(value))
}

export function aspectRatio(dimensions: Dimensions): number {
  return dimensions.width / dimensions.height
}

/** Scale down so the longest edge fits within `maxDimension` (never scales up). */
export function fitWithin(
  source: Dimensions,
  maxDimension: number,
): Dimensions {
  const longest = Math.max(source.width, source.height)
  if (longest <= maxDimension) return { ...source }
  const scale = maxDimension / longest
  return {
    width: clampDimension(source.width * scale),
    height: clampDimension(source.height * scale),
  }
}

export function applyPercent(source: Dimensions, percent: number): Dimensions {
  return {
    width: clampDimension((source.width * percent) / 100),
    height: clampDimension((source.height * percent) / 100),
  }
}

/**
 * Turn a resize request into concrete pixel dimensions.
 *
 * With `lockAspect`, the provided width (or height) drives the other side so
 * the original ratio is kept. Without it, both sides are used verbatim.
 */
export function resolveTargetDimensions(
  source: Dimensions,
  request: ResizeRequest,
): Dimensions {
  if (typeof request.percent === 'number' && request.percent > 0) {
    return applyPercent(source, request.percent)
  }

  if (typeof request.maxDimension === 'number' && request.maxDimension > 0) {
    return fitWithin(source, request.maxDimension)
  }

  const hasWidth = typeof request.width === 'number' && request.width > 0
  const hasHeight = typeof request.height === 'number' && request.height > 0
  const ratio = aspectRatio(source)

  if (hasWidth && hasHeight && !request.lockAspect) {
    return {
      width: clampDimension(request.width as number),
      height: clampDimension(request.height as number),
    }
  }

  if (hasWidth) {
    const width = clampDimension(request.width as number)
    return { width, height: clampDimension(width / ratio) }
  }

  if (hasHeight) {
    const height = clampDimension(request.height as number)
    return { width: clampDimension(height * ratio), height }
  }

  return { ...source }
}
