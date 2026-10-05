import { describe, expect, it } from 'vitest'

import { describeAccept, fileMatchesAccept } from './file'

function makeFile(name: string, type: string): File {
  return new File([new Uint8Array(8)], name, { type })
}

describe('fileMatchesAccept', () => {
  it('accepts anything when no accept string is given', () => {
    expect(fileMatchesAccept(makeFile('a.png', 'image/png'), undefined)).toBe(
      true,
    )
  })

  it('matches wildcard MIME types', () => {
    expect(fileMatchesAccept(makeFile('a.png', 'image/png'), 'image/*')).toBe(
      true,
    )
    expect(
      fileMatchesAccept(makeFile('a.pdf', 'application/pdf'), 'image/*'),
    ).toBe(false)
  })

  it('matches exact MIME types', () => {
    expect(
      fileMatchesAccept(makeFile('a.jpg', 'image/jpeg'), 'image/jpeg'),
    ).toBe(true)
    expect(
      fileMatchesAccept(makeFile('a.png', 'image/png'), 'image/jpeg'),
    ).toBe(false)
  })

  it('matches file extensions', () => {
    expect(fileMatchesAccept(makeFile('notes.txt', ''), '.txt')).toBe(true)
    expect(fileMatchesAccept(makeFile('notes.md', ''), '.txt')).toBe(false)
  })

  it('accepts a file matching any token in a list', () => {
    const accept = 'image/*,application/pdf'
    expect(fileMatchesAccept(makeFile('a.webp', 'image/webp'), accept)).toBe(
      true,
    )
    expect(
      fileMatchesAccept(makeFile('a.pdf', 'application/pdf'), accept),
    ).toBe(true)
    expect(fileMatchesAccept(makeFile('a.txt', 'text/plain'), accept)).toBe(
      false,
    )
  })
})

describe('describeAccept', () => {
  it('describes a friendly list', () => {
    expect(describeAccept('image/*,application/pdf')).toBe('images, PDF')
  })

  it('uppercases extensions and de-duplicates', () => {
    expect(describeAccept('.jpg,.jpeg,.jpg')).toBe('JPG, JPEG')
  })

  it('falls back to "any file"', () => {
    expect(describeAccept(undefined)).toBe('any file')
  })
})
