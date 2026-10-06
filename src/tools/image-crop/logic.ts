import type { TranslationKey } from '@/i18n'

/**
 * Pure crop-selection maths. Everything here works in *normalized* units:
 * x/y/width/height are fractions of the image (0–1), so the selection is
 * independent of how large the image is drawn on screen.
 */

export interface NormalizedRect {
  x: number
  y: number
  width: number
  height: number
}

export type CropHandle = 'move' | 'nw' | 'ne' | 'sw' | 'se'

export type ResizeHandle = Exclude<CropHandle, 'move'>

/** The whole image. */
export const FULL_CROP: NormalizedRect = { x: 0, y: 0, width: 1, height: 1 }

/** Smallest crop side, as a fraction of the image. */
export const MIN_CROP = 0.05

export interface CropPreset {
  id: string
  labelKey: TranslationKey
  /** width / height in pixels, or null for "free" and "original". */
  ratio: number | null
}

export const CROP_PRESETS: CropPreset[] = [
  { id: 'free', labelKey: 'crop.preset.free', ratio: null },
  { id: 'original', labelKey: 'crop.preset.original', ratio: null },
  { id: 'square', labelKey: 'crop.preset.square', ratio: 1 },
  { id: 'landscape', labelKey: 'crop.preset.landscape', ratio: 4 / 3 },
  { id: 'portrait', labelKey: 'crop.preset.portrait', ratio: 3 / 4 },
  { id: 'wide', labelKey: 'crop.preset.wide', ratio: 16 / 9 },
  { id: 'tall', labelKey: 'crop.preset.tall', ratio: 9 / 16 },
  { id: 'photo', labelKey: 'crop.preset.photo', ratio: 3 / 2 },
  { id: 'photoPortrait', labelKey: 'crop.preset.photoPortrait', ratio: 2 / 3 },
]

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Normalized width/height ratio to enforce while resizing, or null for free
 * resizing. Both `imageAspect` and `targetAspect` are pixel width / height.
 */
export function presetAspect(
  preset: CropPreset,
  imageAspect: number,
): number | null {
  const target = preset.id === 'original' ? imageAspect : preset.ratio
  if (!target) return null
  return target / imageAspect
}

/** Keep a rectangle inside the image, never smaller than MIN_CROP. */
export function clampCrop(rect: NormalizedRect): NormalizedRect {
  const width = clamp(rect.width, MIN_CROP, 1)
  const height = clamp(rect.height, MIN_CROP, 1)
  return {
    width,
    height,
    x: clamp(rect.x, 0, 1 - width),
    y: clamp(rect.y, 0, 1 - height),
  }
}

/**
 * The largest rectangle with a given pixel aspect ratio, centered in the
 * image. Used when the user picks a fixed-ratio preset.
 */
export function centeredCrop(
  imageAspect: number,
  targetAspect: number,
): NormalizedRect {
  const k = targetAspect / imageAspect
  const width = k >= 1 ? 1 : k
  const height = k >= 1 ? 1 / k : 1
  return clampCrop({
    x: (1 - width) / 2,
    y: (1 - height) / 2,
    width,
    height,
  })
}

export function moveCrop(
  rect: NormalizedRect,
  dx: number,
  dy: number,
): NormalizedRect {
  return clampCrop({ ...rect, x: rect.x + dx, y: rect.y + dy })
}

/**
 * Move one corner of the selection by (dx, dy), normalized. When `aspect` is
 * set the opposite dimension follows so the ratio is kept; the opposite corner
 * stays anchored.
 */
export function resizeCrop(
  rect: NormalizedRect,
  handle: ResizeHandle,
  dx: number,
  dy: number,
  aspect: number | null,
): NormalizedRect {
  const east = handle === 'ne' || handle === 'se'
  const south = handle === 'se' || handle === 'sw'

  const left = rect.x
  const top = rect.y
  const right = rect.x + rect.width
  const bottom = rect.y + rect.height

  let width = rect.width + (east ? dx : -dx)
  let height = rect.height + (south ? dy : -dy)

  const maxWidth = east ? 1 - left : right
  const maxHeight = south ? 1 - top : bottom

  if (aspect) {
    const widthChangedMore =
      Math.abs(width / rect.width - 1) >= Math.abs(height / rect.height - 1)

    if (widthChangedMore) {
      width = clamp(
        width,
        MIN_CROP * aspect,
        Math.min(maxWidth, maxHeight * aspect),
      )
      height = width / aspect
    } else {
      height = clamp(height, MIN_CROP, Math.min(maxHeight, maxWidth / aspect))
      width = height * aspect
    }
  } else {
    width = clamp(width, MIN_CROP, maxWidth)
    height = clamp(height, MIN_CROP, maxHeight)
  }

  const x = east ? left : right - width
  const y = south ? top : bottom - height
  return clampCrop({ x, y, width, height })
}

/** Convert a normalized selection to rounded source pixels (at least 1×1). */
export function toPixelCrop(
  rect: NormalizedRect,
  source: { width: number; height: number },
) {
  const x = Math.round(rect.x * source.width)
  const y = Math.round(rect.y * source.height)
  return {
    x,
    y,
    width: Math.max(1, Math.round(rect.width * source.width)),
    height: Math.max(1, Math.round(rect.height * source.height)),
  }
}
