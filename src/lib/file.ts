/** Helpers for validating and describing files (used by DropZone and tools). */

const MIME_LABELS: Record<string, string> = {
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
  'image/webp': 'WebP',
  'image/heic': 'HEIC',
  'image/heif': 'HEIF',
  'image/gif': 'GIF',
  'application/pdf': 'PDF',
  'text/plain': 'TXT',
}

/**
 * Does `file` match an accept string like "image/*,application/pdf,.txt"?
 * Mirrors the browser's own `accept` matching rules closely enough for
 * friendly validation messages.
 */
export function fileMatchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true

  const tokens = accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)

  if (tokens.length === 0) return true

  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()

  return tokens.some((token) => {
    if (token.startsWith('.')) return name.endsWith(token)
    if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1))
    return type === token
  })
}

/** Turn an accept string into something friendly for an error message. */
export function describeAccept(accept?: string): string {
  if (!accept) return 'any file'

  const labels = accept
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => {
      if (token === 'image/*') return 'images'
      if (MIME_LABELS[token]) return MIME_LABELS[token]
      if (token.startsWith('.')) return token.slice(1).toUpperCase()
      return token
    })

  return Array.from(new Set(labels)).join(', ')
}
