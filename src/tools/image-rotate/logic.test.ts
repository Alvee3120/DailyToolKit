import { describe, expect, it } from 'vitest'

import {
  IDENTITY,
  cssTransform,
  isIdentity,
  rotateBy,
  rotatedDimensions,
} from './logic'

describe('rotateBy', () => {
  it('adds clockwise quarter turns', () => {
    expect(rotateBy(0, 90)).toBe(90)
    expect(rotateBy(270, 90)).toBe(0)
  })

  it('handles counter-clockwise turns', () => {
    expect(rotateBy(0, -90)).toBe(270)
    expect(rotateBy(90, -90)).toBe(0)
  })

  it('normalizes larger steps', () => {
    expect(rotateBy(90, 180)).toBe(270)
    expect(rotateBy(270, 180)).toBe(90)
  })
})

describe('rotatedDimensions', () => {
  it('keeps the size for 0° and 180°', () => {
    expect(rotatedDimensions({ width: 4000, height: 3000 }, 0)).toEqual({
      width: 4000,
      height: 3000,
    })
    expect(rotatedDimensions({ width: 4000, height: 3000 }, 180)).toEqual({
      width: 4000,
      height: 3000,
    })
  })

  it('swaps width and height for quarter turns', () => {
    expect(rotatedDimensions({ width: 4000, height: 3000 }, 90)).toEqual({
      width: 3000,
      height: 4000,
    })
    expect(rotatedDimensions({ width: 4000, height: 3000 }, 270)).toEqual({
      width: 3000,
      height: 4000,
    })
  })
})

describe('isIdentity', () => {
  it('detects an untouched orientation', () => {
    expect(isIdentity(IDENTITY)).toBe(true)
    expect(isIdentity({ ...IDENTITY, rotation: 90 })).toBe(false)
    expect(isIdentity({ ...IDENTITY, flipHorizontal: true })).toBe(false)
  })
})

describe('cssTransform', () => {
  it('mirrors before rotating so the preview matches the pipeline', () => {
    expect(
      cssTransform({
        rotation: 90,
        flipHorizontal: true,
        flipVertical: false,
      }),
    ).toBe('scaleX(-1) scaleY(1) rotate(90deg)')
  })

  it('is the identity transform when nothing is set', () => {
    expect(cssTransform(IDENTITY)).toBe('scaleX(1) scaleY(1) rotate(0deg)')
  })
})
