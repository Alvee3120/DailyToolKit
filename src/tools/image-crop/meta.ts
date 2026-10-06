import { Crop } from 'lucide-react'
import { lazy } from 'react'

import type { Tool } from '@/registry'

export const imageCropMeta: Tool = {
  id: 'image-crop',
  name: 'Crop image',
  description:
    'Trim a photo to the part you want, with square and social-media ratios.',
  category: 'Image',
  icon: Crop,
  route: '/tools/image-crop',
  keywords: [
    'crop',
    'trim',
    'cut',
    'aspect ratio',
    'square',
    'portrait',
    'landscape',
    'frame',
    'photo',
  ],
  heavy: false,
  component: lazy(() => import('./index')),
}
