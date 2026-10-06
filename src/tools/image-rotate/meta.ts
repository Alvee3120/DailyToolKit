import { RotateCw } from 'lucide-react'
import { lazy } from 'react'

import type { Tool } from '@/registry'

export const imageRotateMeta: Tool = {
  id: 'image-rotate',
  name: 'Rotate & flip image',
  description:
    'Turn a photo sideways or upside down, or mirror it horizontally or vertically.',
  category: 'Image',
  icon: RotateCw,
  route: '/tools/image-rotate',
  keywords: [
    'rotate',
    'flip',
    'mirror',
    'turn',
    'orientation',
    'sideways',
    'upside down',
    'photo',
  ],
  heavy: false,
  component: lazy(() => import('./index')),
}
