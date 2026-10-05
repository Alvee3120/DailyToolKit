import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getRecentlyUsed, markToolUsed } from './recentlyUsed'

function createLocalStorageMock(): Storage {
  const store = new Map<string, string>()

  return {
    get length() {
      return store.size
    },
    clear: () => store.clear(),
    getItem: (key: string) => store.get(key) ?? null,
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    removeItem: (key: string) => {
      store.delete(key)
    },
    setItem: (key: string, value: string) => {
      store.set(key, String(value))
    },
  }
}

beforeEach(() => {
  vi.stubGlobal('localStorage', createLocalStorageMock())
})

describe('recentlyUsed', () => {
  it('starts empty', () => {
    expect(getRecentlyUsed()).toEqual([])
  })

  it('keeps the newest first and de-duplicates', () => {
    markToolUsed('a')
    markToolUsed('b')
    markToolUsed('a')

    expect(getRecentlyUsed()).toEqual(['a', 'b'])
  })

  it('caps the list at six items', () => {
    for (const id of ['a', 'b', 'c', 'd', 'e', 'f', 'g']) {
      markToolUsed(id)
    }

    const recent = getRecentlyUsed()
    expect(recent).toHaveLength(6)
    expect(recent[0]).toBe('g')
    expect(recent).not.toContain('a')
  })
})
