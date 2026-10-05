import { describe, expect, it } from 'vitest'

import { TOOL_CATEGORIES, tools } from './registry'

describe('tool registry', () => {
  it('keeps a stable category order for the home page', () => {
    expect(TOOL_CATEGORIES).toEqual(['Image', 'PDF', 'Text', 'Utilities'])
  })

  it('every registered tool has a unique id, absolute route and keywords', () => {
    const ids = tools.map((tool) => tool.id)

    expect(new Set(ids).size).toBe(ids.length)

    for (const tool of tools) {
      expect(tool.route.startsWith('/')).toBe(true)
      expect(tool.keywords.length).toBeGreaterThan(0)
    }
  })
})
