/**
 * Tiny typed localStorage helper.
 *
 * Everything is namespaced under "dailykit:" and JSON-encoded, so a corrupt
 * or unavailable store (private mode, storage full) degrades to the fallback
 * instead of throwing.
 */

const PREFIX = 'dailykit:'

function getStore(): Storage | null {
  try {
    if (typeof localStorage === 'undefined') return null
    return localStorage
  } catch {
    return null
  }
}

export function readSetting<T>(key: string, fallback: T): T {
  const store = getStore()
  if (!store) return fallback

  try {
    const raw = store.getItem(PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeSetting<T>(key: string, value: T): void {
  const store = getStore()
  if (!store) return

  try {
    store.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Ignore quota / permission errors — settings are best-effort.
  }
}

export function removeSetting(key: string): void {
  const store = getStore()
  if (!store) return

  try {
    store.removeItem(PREFIX + key)
  } catch {
    // Ignore.
  }
}
