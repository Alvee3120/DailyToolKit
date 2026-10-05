import { describe, expect, it } from 'vitest'

import { formatBytes, percentSaved } from './format'

describe('formatBytes', () => {
  it('formats plain bytes', () => {
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(999)).toBe('999 B')
  })

  it('formats kilobytes', () => {
    expect(formatBytes(1000)).toBe('1 KB')
    expect(formatBytes(1500)).toBe('1.5 KB')
    expect(formatBytes(380000)).toBe('380 KB')
  })

  it('formats megabytes', () => {
    expect(formatBytes(2400000)).toBe('2.4 MB')
    expect(formatBytes(5000000)).toBe('5 MB')
  })

  it('handles invalid input gracefully', () => {
    expect(formatBytes(-5)).toBe('—')
    expect(formatBytes(Number.NaN)).toBe('—')
    expect(formatBytes(Number.POSITIVE_INFINITY)).toBe('—')
  })
})

describe('percentSaved', () => {
  it('computes the percentage saved', () => {
    expect(percentSaved(5_000_000, 380_000)).toBe(92)
  })

  it('is negative when the result is larger', () => {
    expect(percentSaved(100, 150)).toBe(-50)
  })

  it('is zero when unchanged and guards against a zero original', () => {
    expect(percentSaved(100, 100)).toBe(0)
    expect(percentSaved(0, 100)).toBe(0)
  })
})
