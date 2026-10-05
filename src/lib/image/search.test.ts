import { describe, expect, it, vi } from 'vitest'

import { findBestQuality, nextScale } from './search'

/** Fake encoder: file size is proportional to quality. */
const fakeEncode = (quality: number) =>
  Promise.resolve(Math.round(quality * 1_000_000))

describe('findBestQuality', () => {
  it('finds the highest quality that fits the target', async () => {
    const result = await findBestQuality(fakeEncode, 500_000)

    expect(result.reached).toBe(true)
    expect(result.bytes).toBeLessThanOrEqual(500_000)
    expect(result.quality).toBeGreaterThan(0.47)
    expect(result.quality).toBeLessThan(0.53)
  })

  it('returns the smallest encoding when the target is unreachable', async () => {
    const result = await findBestQuality(fakeEncode, 10_000)

    expect(result.reached).toBe(false)
    expect(result.quality).toBe(0.2)
    expect(result.bytes).toBe(200_000)
  })

  it('reports progress after every encode', async () => {
    const onStep = vi.fn()
    await findBestQuality(fakeEncode, 500_000, { iterations: 5, onStep })

    expect(onStep).toHaveBeenCalledTimes(6)
    expect(onStep.mock.calls.at(-1)?.[0]).toBe(1)
  })

  it('respects custom quality bounds', async () => {
    const result = await findBestQuality(fakeEncode, 500_000, {
      minQuality: 0.4,
      maxQuality: 0.6,
    })

    expect(result.quality).toBeGreaterThanOrEqual(0.4)
    expect(result.quality).toBeLessThanOrEqual(0.6)
  })
})

describe('nextScale', () => {
  it('shrinks by the step', () => {
    expect(nextScale(1, 0.8)).toBeCloseTo(0.8)
  })

  it('never goes below 0.1', () => {
    expect(nextScale(0.11, 0.5)).toBe(0.1)
  })
})
