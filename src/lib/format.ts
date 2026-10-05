/** Human-friendly formatting helpers shared across tools. */

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const

/**
 * Format a byte count for display, e.g. 2400000 -> "2.4 MB".
 * Uses decimal (1000-based) units, which is what phones report for photos.
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—'
  if (bytes < 1000) return `${Math.round(bytes)} B`

  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1000)),
    UNITS.length - 1,
  )
  const value = bytes / 1000 ** exponent
  const rounded =
    value >= 100 ? Math.round(value) : Number(value.toFixed(decimals))

  return `${rounded} ${UNITS[exponent]}`
}

/**
 * Percentage saved when going from `before` to `after`.
 * Positive means smaller, negative means larger, 0 means unchanged.
 */
export function percentSaved(before: number, after: number): number {
  if (!Number.isFinite(before) || before <= 0) return 0
  return Math.round((1 - after / before) * 100)
}
