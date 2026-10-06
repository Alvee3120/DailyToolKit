import { describe, expect, it } from 'vitest'

import { renderWatermark } from './pipeline'
import type { Dimensions, TextWatermark, Watermark } from './types'

interface Recorded {
  drawn: unknown[][]
  translated: [number, number][]
  rotated: number[]
  fonts: string[]
  aligns: string[]
  baselines: string[]
  filled: [string, number, number][]
}

/** A 2D-context stand-in that records the calls we care about. */
function createContext() {
  let align = ''
  let baseline = ''
  const calls: Recorded = {
    drawn: [],
    translated: [],
    rotated: [],
    fonts: [],
    aligns: [],
    baselines: [],
    filled: [],
  }
  const context = {
    globalAlpha: 1,
    fillStyle: '',
    save() {},
    restore() {},
    translate(x: number, y: number) {
      calls.translated.push([x, y])
    },
    rotate(angle: number) {
      calls.rotated.push(angle)
    },
    drawImage(...args: unknown[]) {
      calls.drawn.push(args)
    },
    fillText(text: string, x: number, y: number) {
      calls.filled.push([text, x, y])
    },
    set font(value: string) {
      calls.fonts.push(value)
    },
    get font() {
      return ''
    },
    set textAlign(value: string) {
      align = value
      calls.aligns.push(value)
    },
    get textAlign() {
      return align
    },
    set textBaseline(value: string) {
      baseline = value
      calls.baselines.push(value)
    },
    get textBaseline() {
      return baseline
    },
  }
  return { context, calls }
}

function asContext(value: unknown): CanvasRenderingContext2D {
  return value as CanvasRenderingContext2D
}

function asSource(value: unknown): CanvasImageSource {
  return value as CanvasImageSource
}

const target: Dimensions = { width: 1000, height: 500 }
const base = { width: 1000, height: 500 }

const textWatermark: TextWatermark = {
  kind: 'text',
  text: 'hello',
  fontFamily: 'sans-serif',
  bold: true,
  italic: false,
  size: 0.1,
  color: '#ffffff',
  opacity: 0.8,
  rotation: 0,
  position: 'bottom-right',
  margin: 0.05,
}

describe('renderWatermark', () => {
  it('draws the base image to fill the target', () => {
    const { context, calls } = createContext()
    renderWatermark(
      asContext(context),
      asSource(base),
      null,
      textWatermark,
      target,
    )
    expect(calls.drawn[0]).toEqual([base, 0, 0, 1000, 500])
  })

  it('anchors text at the bottom-right with the right align and baseline', () => {
    const { context, calls } = createContext()
    renderWatermark(
      asContext(context),
      asSource(base),
      null,
      textWatermark,
      target,
    )

    // margin = 0.05 * 1000, anchored from the right/bottom edges.
    expect(calls.translated[0]).toEqual([950, 450])
    expect(calls.fonts[0]).toContain('bold')
    expect(calls.fonts[0]).toContain('100px')
    expect(calls.fonts[0]).toContain('sans-serif')
    expect(calls.aligns).toContain('right')
    expect(calls.baselines).toContain('bottom')
    expect(calls.filled[0]).toEqual(['hello', 0, 0])
  })

  it('applies the rotation in radians', () => {
    const { context, calls } = createContext()
    renderWatermark(
      asContext(context),
      asSource(base),
      null,
      { ...textWatermark, rotation: 45 },
      target,
    )
    expect(calls.rotated[0]).toBeCloseTo(Math.PI / 4)
  })

  it('skips empty text', () => {
    const { context, calls } = createContext()
    renderWatermark(
      asContext(context),
      asSource(base),
      null,
      { ...textWatermark, text: '   ' },
      target,
    )
    expect(calls.filled).toHaveLength(0)
  })

  it('centers a logo watermark and keeps its aspect ratio', () => {
    const { context, calls } = createContext()
    const logo = { width: 200, height: 100 }
    const watermark: Watermark = {
      kind: 'image',
      logo: new Blob(),
      scale: 0.25,
      opacity: 1,
      rotation: 90,
      position: 'center',
      margin: 0.05,
    }
    renderWatermark(
      asContext(context),
      asSource(base),
      asSource(logo),
      watermark,
      target,
    )

    // width = 0.25 * 1000 = 250, height = 250 * (100 / 200) = 125, centered.
    expect(calls.translated[0]).toEqual([500, 250])
    expect(calls.rotated[0]).toBeCloseTo(Math.PI / 2)
    expect(calls.drawn[1]).toEqual([logo, -125, -62.5, 250, 125])
  })

  it('draws only the base when an image watermark has no logo', () => {
    const { context, calls } = createContext()
    const watermark: Watermark = {
      kind: 'image',
      logo: new Blob(),
      scale: 0.25,
      opacity: 1,
      rotation: 0,
      position: 'center',
      margin: 0.05,
    }
    renderWatermark(asContext(context), asSource(base), null, watermark, target)
    expect(calls.drawn).toHaveLength(1)
  })
})
