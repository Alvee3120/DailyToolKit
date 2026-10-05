import { describe, expect, it } from 'vitest'

import { searchTools, tools, TOOL_CATEGORIES } from './registry'

describe('tool registry', () => {
  it('keeps a stable category order for the home page', () => {
    expect(TOOL_CATEGORIES).toEqual(['Image', 'PDF', 'Text', 'Utilities'])
  })

  it('every registered tool has a unique id, absolute route and a component', () => {
    const ids = tools.map((tool) => tool.id)

    expect(new Set(ids).size).toBe(ids.length)

    for (const tool of tools) {
      expect(tool.route.startsWith('/')).toBe(true)
      expect(tool.keywords.length).toBeGreaterThan(0)
      expect(tool.component).toBeDefined()
      expect(tool.name.length).toBeGreaterThan(0)
      expect(tool.description.length).toBeGreaterThan(0)
    }
  })
})

describe('searchTools', () => {
  it('returns every tool for an empty query', () => {
    expect(searchTools('')).toHaveLength(tools.length)
    expect(searchTools('   ')).toHaveLength(tools.length)
  })

  it('matches by name, ignoring case', () => {
    expect(searchTools('COMPRESS').map((tool) => tool.id)).toContain(
      'image-compress',
    )
  })

  it('matches by keyword', () => {
    expect(searchTools('heic').map((tool) => tool.id)).toContain(
      'image-convert',
    )
  })

  it('requires every search term to match', () => {
    expect(searchTools('compress zzz-nonexistent')).toHaveLength(0)
  })

  it('returns nothing for a nonsense query', () => {
    expect(searchTools('nope-nothing-here')).toHaveLength(0)
  })
})
