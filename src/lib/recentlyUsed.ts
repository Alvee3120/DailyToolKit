import { readSetting, writeSetting } from './storage'

/** Stored without the "dailykit:" prefix (see lib/storage.ts). */
export const RECENTLY_USED_KEY = 'recently-used'

const MAX_ITEMS = 6

/** Tool ids the user opened most recently, newest first. */
export function getRecentlyUsed(): string[] {
  const value = readSetting<unknown>(RECENTLY_USED_KEY, [])
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

/** Record that a tool was used and return the updated list. */
export function markToolUsed(id: string): string[] {
  const next = [id, ...getRecentlyUsed().filter((item) => item !== id)].slice(
    0,
    MAX_ITEMS,
  )
  writeSetting(RECENTLY_USED_KEY, next)
  return next
}
