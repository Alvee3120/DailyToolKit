/**
 * Pure search helpers for "compress to a target size".
 *
 * They take an injected `encode` function so they can be unit-tested without
 * a canvas — the real encoder lives in pipeline.ts.
 */

export interface QualitySearchResult {
  quality: number
  bytes: number
  /** True when a quality was found that meets the target. */
  reached: boolean
}

export interface QualitySearchOptions {
  minQuality?: number
  maxQuality?: number
  iterations?: number
  /** Called after each encode with a 0–1 fraction of the work done. */
  onStep?: (fraction: number) => void
}

/**
 * Binary-search the highest quality whose encoding still fits the target.
 * Assumes larger quality never produces a smaller file (true for JPEG/WebP).
 */
export async function findBestQuality(
  encode: (quality: number) => Promise<number>,
  targetBytes: number,
  options: QualitySearchOptions = {},
): Promise<QualitySearchResult> {
  const minQuality = options.minQuality ?? 0.2
  const maxQuality = options.maxQuality ?? 0.95
  const iterations = options.iterations ?? 7
  const total = iterations + 1

  const smallest = await encode(minQuality)
  options.onStep?.(1 / total)

  if (smallest > targetBytes) {
    return { quality: minQuality, bytes: smallest, reached: false }
  }

  let bestQuality = minQuality
  let bestBytes = smallest
  let low = minQuality
  let high = maxQuality

  for (let step = 0; step < iterations; step += 1) {
    const mid = (low + high) / 2
    const bytes = await encode(mid)
    options.onStep?.((step + 2) / total)

    if (bytes <= targetBytes) {
      bestQuality = mid
      bestBytes = bytes
      low = mid
    } else {
      high = mid
    }
  }

  return { quality: bestQuality, bytes: bestBytes, reached: true }
}

/** How much to shrink dimensions between failed target-size attempts. */
export const SCALE_STEP = 0.82

export function nextScale(scale: number, step = SCALE_STEP): number {
  return Math.max(0.1, scale * step)
}
