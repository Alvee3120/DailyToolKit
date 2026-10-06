/**
 * DailyKit tool registry.
 *
 * Every tool registers itself here. The home page, search and navigation are
 * all generated from this list, so adding a tool never means editing the home
 * page or the router by hand.
 */

import type { LucideIcon } from 'lucide-react'
import type { ComponentType, LazyExoticComponent } from 'react'

import { imageCompressMeta } from '@/tools/image-compress/meta'
import { imageConvertMeta } from '@/tools/image-convert/meta'
import { imageCropMeta } from '@/tools/image-crop/meta'
import { imageResizeMeta } from '@/tools/image-resize/meta'
import { imageRotateMeta } from '@/tools/image-rotate/meta'
import { imageWatermarkMeta } from '@/tools/image-watermark/meta'

export type ToolCategory = 'Image' | 'PDF' | 'Text' | 'Utilities'

export interface ToolMeta {
  /** Unique, URL-safe id. Used as the React key and for "recently used". */
  id: string
  name: string
  description: string
  category: ToolCategory
  /** lucide-react icon component shown on the home page card. */
  icon: LucideIcon
  /** Route path for the tool page. Must start with "/". */
  route: string
  /** Extra words that should match this tool in the home page search. */
  keywords: string[]
  /** True when the tool downloads a large AI model the first time it runs. */
  heavy: boolean
}

export interface Tool extends ToolMeta {
  /** Lazily-loaded tool page, so each tool ships in its own chunk. */
  component: LazyExoticComponent<ComponentType>
}

/** Display order for the categories shown on the home page. */
export const TOOL_CATEGORIES: ToolCategory[] = [
  'Image',
  'PDF',
  'Text',
  'Utilities',
]

/** Every tool in the app, in home page order. */
export const tools: Tool[] = [
  imageCompressMeta,
  imageResizeMeta,
  imageConvertMeta,
  imageCropMeta,
  imageRotateMeta,
  imageWatermarkMeta,
]

/** Find tools matching a free-text query across name, description and keywords. */
export function searchTools(query: string, list: Tool[] = tools): Tool[] {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return list

  const terms = trimmed.split(/\s+/)

  return list.filter((tool) => {
    const haystack = [
      tool.name,
      tool.description,
      tool.category,
      ...tool.keywords,
    ]
      .join(' ')
      .toLowerCase()

    return terms.every((term) => haystack.includes(term))
  })
}
