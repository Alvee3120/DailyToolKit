import { Shrink } from 'lucide-react'
import { lazy } from 'react'

import type { Tool } from '@/registry'

export const imageCompressMeta: Tool = {
  id: 'image-compress',
  name: 'Compress image',
  description:
    'Make a photo smaller — set the quality or a size limit like 200 KB.',
  category: 'Image',
  icon: Shrink,
  route: '/tools/image-compress',
  keywords: [
    'compress',
    'shrink',
    'smaller',
    'reduce',
    'optimize',
    'size',
    'jpeg',
    'jpg',
    'png',
    'webp',
    'photo',
  ],
  heavy: false,
  component: lazy(() => import('./index')),
}
