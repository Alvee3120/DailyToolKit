/**
 * DailyKit tool registry.
 *
 * Every tool registers itself here. The home page, search and navigation are
 * all generated from this list, so adding a tool never means editing the home
 * page by hand.
 */

export type ToolCategory = 'Image' | 'PDF' | 'Text' | 'Utilities'

export interface ToolMeta {
  /** Unique, URL-safe id. Used as the React key and for "recently used". */
  id: string
  name: string
  description: string
  category: ToolCategory
  /** lucide-react icon name, resolved into a component in Module 1. */
  icon: string
  /** Route path for the tool page. Must start with "/". */
  route: string
  /** Extra words that should match this tool in the home page search. */
  keywords: string[]
  /** True when the tool downloads a large AI model the first time it runs. */
  heavy: boolean
}

/** Display order for the categories shown on the home page. */
export const TOOL_CATEGORIES: ToolCategory[] = [
  'Image',
  'PDF',
  'Text',
  'Utilities',
]

/** Populated as tools are built, starting in Module 1. */
export const tools: ToolMeta[] = []
