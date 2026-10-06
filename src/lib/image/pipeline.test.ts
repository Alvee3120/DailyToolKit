import { describe, expect, it } from 'vitest'

import { transformedDimensions } from './pipeline'

const source = { width: 4000, height: 3000 }

describe('transformedDimensions', () => {
  it('defaults to the whole image', () => {
    expect(transformedDimensions(source, {})).toEqual(source)
  })

  it('uses the crop size when nothing is rotated', () => {
    expect(
      transformedDimensions(source, {
        crop: { x: 100, y: 200, width: 800, height: 600 },
      }),
    ).toEqual({ width: 800, height: 600 })
  })

  it('swaps the axes for quarter turns', () => {
    expect(
      transformedDimensions(source, {
        crop: { x: 0, y: 0, width: 800, height: 600 },
        rotate: 90,
      }),
    ).toEqual({ width: 600, height: 800 })
    expect(
      transformedDimensions(source, {
        crop: { x: 0, y: 0, width: 800, height: 600 },
        rotate: 270,
      }),
    ).toEqual({ width: 600, height: 800 })
  })

  it('does not swap for 180°', () => {
    expect(
      transformedDimensions(source, {
        crop: { x: 0, y: 0, width: 800, height: 600 },
        rotate: 180,
      }),
    ).toEqual({ width: 800, height: 600 })
  })

  it('clamps an out-of-bounds crop to the source', () => {
    expect(
      transformedDimensions(source, {
        crop: { x: 3900, y: 2900, width: 500, height: 500 },
      }),
    ).toEqual({ width: 100, height: 100 })
  })
})
