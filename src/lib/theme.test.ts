import { describe, expect, it } from 'vitest'

import { resolveTheme } from './theme'

describe('resolveTheme', () => {
  it('follows the system when the preference is "system"', () => {
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('system', false)).toBe('light')
  })

  it('honours an explicit preference regardless of the system', () => {
    expect(resolveTheme('dark', false)).toBe('dark')
    expect(resolveTheme('light', true)).toBe('light')
  })
})
