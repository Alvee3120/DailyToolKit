import { describe, expect, it } from 'vitest'

import {
  applyPercent,
  detectImageFormat,
  fitWithin,
  formatExtension,
  formatFromMime,
  formatLabel,
  isLossy,
  outputFileName,
  resolveTargetDimensions,
} from './format'

function makeFile(name: string, type: string): File {
  return new File([new Uint8Array(4)], name, { type })
}

describe('format helpers', () => {
  it('maps formats to extension and label', () => {
    expect(formatExtension('image/jpeg')).toBe('jpg')
    expect(formatExtension('image/webp')).toBe('webp')
    expect(formatLabel('image/png')).toBe('PNG')
  })

  it('knows which formats are lossy', () => {
    expect(isLossy('image/jpeg')).toBe(true)
    expect(isLossy('image/webp')).toBe(true)
    expect(isLossy('image/png')).toBe(false)
  })

  it('reads mime types and file extensions', () => {
    expect(formatFromMime('image/jpg')).toBe('image/jpeg')
    expect(formatFromMime('image/heic')).toBeNull()
    expect(detectImageFormat(makeFile('photo.JPEG', ''))).toBe('image/jpeg')
    expect(detectImageFormat(makeFile('x.unknown', 'image/webp'))).toBe(
      'image/webp',
    )
    expect(detectImageFormat(makeFile('x.heic', 'image/heic'))).toBeNull()
  })
})

describe('outputFileName', () => {
  it('keeps the base name and swaps the extension', () => {
    expect(outputFileName('holiday.JPG', 'webp')).toBe('holiday.webp')
  })

  it('adds an optional suffix', () => {
    expect(outputFileName('holiday.png', 'jpg', 'compressed')).toBe(
      'holiday-compressed.jpg',
    )
  })

  it('cleans up odd characters and handles missing names', () => {
    expect(outputFileName('my photo (1).png', 'jpg')).toBe('my-photo-1.jpg')
    expect(outputFileName('', 'png')).toBe('image.png')
  })
})

describe('fitWithin', () => {
  it('keeps smaller images untouched', () => {
    expect(fitWithin({ width: 800, height: 600 }, 1920)).toEqual({
      width: 800,
      height: 600,
    })
  })

  it('scales the longest edge down and keeps the ratio', () => {
    expect(fitWithin({ width: 4000, height: 3000 }, 2000)).toEqual({
      width: 2000,
      height: 1500,
    })
    expect(fitWithin({ width: 3000, height: 4000 }, 2000)).toEqual({
      width: 1500,
      height: 2000,
    })
  })
})

describe('applyPercent', () => {
  it('scales both sides and never returns zero', () => {
    expect(applyPercent({ width: 1000, height: 500 }, 50)).toEqual({
      width: 500,
      height: 250,
    })
    expect(applyPercent({ width: 4, height: 4 }, 1)).toEqual({
      width: 1,
      height: 1,
    })
  })
})

describe('resolveTargetDimensions', () => {
  const source = { width: 4000, height: 3000 }

  it('derives the height from a locked width', () => {
    expect(
      resolveTargetDimensions(source, { width: 800, lockAspect: true }),
    ).toEqual({ width: 800, height: 600 })
  })

  it('derives the width from a given height', () => {
    expect(resolveTargetDimensions(source, { height: 600 })).toEqual({
      width: 800,
      height: 600,
    })
  })

  it('uses both sides verbatim when the aspect is unlocked', () => {
    expect(
      resolveTargetDimensions(source, {
        width: 800,
        height: 800,
        lockAspect: false,
      }),
    ).toEqual({ width: 800, height: 800 })
  })

  it('supports percent and max-dimension modes', () => {
    expect(resolveTargetDimensions(source, { percent: 25 })).toEqual({
      width: 1000,
      height: 750,
    })
    expect(resolveTargetDimensions(source, { maxDimension: 3000 })).toEqual({
      width: 3000,
      height: 2250,
    })
  })

  it('falls back to the source size', () => {
    expect(resolveTargetDimensions(source, {})).toEqual(source)
  })
})
