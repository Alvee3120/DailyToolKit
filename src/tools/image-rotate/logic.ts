import type { Dimensions, Rotation } from '@/lib/image/types'

/** Rotation + mirror state for the rotate/flip tool. */
export interface Orientation {
  rotation: Rotation
  flipHorizontal: boolean
  flipVertical: boolean
}

export const IDENTITY: Orientation = {
  rotation: 0,
  flipHorizontal: false,
  flipVertical: false,
}

/** Add a quarter-turn multiple, wrapped back into 0–359. */
export function rotateBy(rotation: Rotation, delta: number): Rotation {
  return ((((rotation + delta) % 360) + 360) % 360) as Rotation
}

/** Output size after rotating (mirroring never changes the size). */
export function rotatedDimensions(
  source: Dimensions,
  rotation: Rotation,
): Dimensions {
  const swap = rotation === 90 || rotation === 270
  return swap
    ? { width: source.height, height: source.width }
    : { width: source.width, height: source.height }
}

export function isIdentity(orientation: Orientation): boolean {
  return (
    orientation.rotation === 0 &&
    !orientation.flipHorizontal &&
    !orientation.flipVertical
  )
}

/**
 * CSS transform for the live preview. Mirrors first then rotates, matching the
 * order the canvas pipeline uses (flip applied to the rotated result).
 */
export function cssTransform({
  rotation,
  flipHorizontal,
  flipVertical,
}: Orientation): string {
  const scaleX = flipHorizontal ? -1 : 1
  const scaleY = flipVertical ? -1 : 1
  return `scaleX(${scaleX}) scaleY(${scaleY}) rotate(${rotation}deg)`
}
