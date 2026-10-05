import { Scaling } from 'lucide-react'
import { lazy } from 'react'

import type { Tool } from '@/registry'

export const imageResizeMeta: Tool = {
  id: 'image-resize',
  name: 'Resize image',
  description:
    'Change image size by pixels or a percentage, with ready presets.',
  category: 'Image',
  icon: Scaling,
  route: '/tools/image-resize',
  keywords: [
    'resize',
    'scale',
    'dimensions',
    'pixels',
    'width',
    'height',
    'hd',
    'instagram',
    'facebook',
    'preset',
  ],
  heavy: false,
  component: lazy(() => import('./index')),
}
