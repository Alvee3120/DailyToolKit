import { useCallback, useState } from 'react'

import { readSetting, writeSetting } from './storage'

/**
 * useState that is mirrored into localStorage, so a tool can remember the
 * user's last-used settings between visits.
 */
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => readSetting(key, initial))

  const update = useCallback(
    (next: T | ((previous: T) => T)) => {
      setValue((previous) => {
        const resolved =
          typeof next === 'function' ? (next as (p: T) => T)(previous) : next
        writeSetting(key, resolved)
        return resolved
      })
    },
    [key],
  )

  return [value, update] as const
}
