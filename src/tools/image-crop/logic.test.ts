import { describe, expect, it } from 'vitest'

import {
  CROP_PRESETS,
  FULL_CROP,
  MIN_CROP,
  centeredCrop,
  clampCrop,
  moveCrop,
  presetAspect,
  resizeCrop,
  toPixelCrop,
} from './logic'

const IMAGE_ASPECT = 4 / 3

describe('presetAspect', () => {
  const square = CROP_PRESETS.find((preset) => preset.id === 'square')!
  const original = CROP_PRESETS.find((preset) => preset.id === 'original')!
  const free = CROP_PRESETS.find((preset) => preset.id === 'free')!

  it('is null for free resizing', () => {
    expect(presetAspect(free, IMAGE_ASPECT)).toBeNull()
  })

  it('locks "original" to the image aspect', () => {
    expect(presetAspect(original, IMAGE_ASPECT)).toBe(1)
  })

  it('scales a fixed ratio into normalized units', () => {
    expect(presetAspect(square, IMAGE_ASPECT)).toBeCloseTo(1 / IMAGE_ASPECT)
  })
})

describe('clampCrop', () => {
  it('keeps the selection inside the image', () => {
    expect(clampCrop({ x: 0.8, y: -0.2, width: 0.5, height: 0.4 })).toEqual({
      x: 0.5,
      y: 0,
      width: 0.5,
      height: 0.4,
    })
  })

  it('enforces a minimum size', () => {
    const rect = clampCrop({ x: 0, y: 0, width: 0, height: 0 })
    expect(rect.width).toBe(MIN_CROP)
    expect(rect.height).toBe(MIN_CROP)
  })
})

describe('centeredCrop', () => {
  it('returns a centered square for 1:1 on a landscape image', () => {
    const rect = centeredCrop(IMAGE_ASPECT, 1)
    expect(rect.height).toBe(1)
    expect(rect.width).toBeCloseTo(1 / IMAGE_ASPECT)
    expect(rect.x).toBeCloseTo((1 - rect.width) / 2)
    expect(rect.y).toBe(0)
  })

  it('fills the width for a wider target ratio', () => {
    const rect = centeredCrop(IMAGE_ASPECT, 2)
    expect(rect.width).toBe(1)
    expect(rect.height).toBeCloseTo(IMAGE_ASPECT / 2)
  })
})

describe('moveCrop', () => {
  it('moves the selection and clamps it to the edges', () => {
    const rect = moveCrop(
      { x: 0.2, y: 0.2, width: 0.4, height: 0.4 },
      0.1,
      -0.5,
    )
    expect(rect.x).toBeCloseTo(0.3)
    expect(rect.y).toBe(0)
    expect(rect.width).toBe(0.4)
    expect(rect.height).toBe(0.4)
  })
})

describe('resizeCrop', () => {
  it('resizes freely from a corner', () => {
    const rect = resizeCrop(
      { x: 0.2, y: 0.2, width: 0.4, height: 0.4 },
      'se',
      0.1,
      0.1,
      null,
    )
    expect(rect).toEqual({ x: 0.2, y: 0.2, width: 0.5, height: 0.5 })
  })

  it('anchors the opposite corner when dragging the north-west handle', () => {
    const rect = resizeCrop(
      { x: 0.2, y: 0.2, width: 0.5, height: 0.5 },
      'nw',
      -0.1,
      -0.1,
      null,
    )
    expect(rect.x).toBeCloseTo(0.1)
    expect(rect.y).toBeCloseTo(0.1)
    expect(rect.width).toBeCloseTo(0.6)
    expect(rect.height).toBeCloseTo(0.6)
  })

  it('never lets the selection leave the image', () => {
    const rect = resizeCrop(
      { x: 0.5, y: 0.5, width: 0.5, height: 0.5 },
      'se',
      1,
      1,
      null,
    )
    expect(rect.width + rect.x).toBeLessThanOrEqual(1)
    expect(rect.height + rect.y).toBeLessThanOrEqual(1)
  })

  it('keeps the aspect ratio while resizing', () => {
    const aspect = 2 // normalized width / height
    const rect = resizeCrop(
      { x: 0.1, y: 0.1, width: 0.4, height: 0.2 },
      'se',
      0.2,
      0,
      aspect,
    )
    expect(rect.width / rect.height).toBeCloseTo(aspect)
  })

  it('responds to vertical drags too when a ratio is locked', () => {
    const rect = resizeCrop(
      { x: 0.1, y: 0.1, width: 0.4, height: 0.2 },
      'se',
      0,
      0.2,
      2,
    )
    expect(rect.height).toBeGreaterThan(0.2)
    expect(rect.width / rect.height).toBeCloseTo(2)
  })
})

describe('toPixelCrop', () => {
  it('converts normalized values to rounded source pixels', () => {
    expect(toPixelCrop(FULL_CROP, { width: 4000, height: 3000 })).toEqual({
      x: 0,
      y: 0,
      width: 4000,
      height: 3000,
    })
  })

  it('never returns a zero-sized crop', () => {
    const crop = toPixelCrop(
      { x: 0, y: 0, width: 0.0001, height: 0.0001 },
      { width: 100, height: 100 },
    )
    expect(crop.width).toBe(1)
    expect(crop.height).toBe(1)
  })
})
