import { Stamp } from 'lucide-react'
import { lazy } from 'react'

import type { Tool } from '@/registry'

export const imageWatermarkMeta: Tool = {
  id: 'image-watermark',
  name: 'Watermark & text',
  description:
    'Stamp a text or logo watermark on a photo — position, size, opacity and rotation.',
  category: 'Image',
  icon: Stamp,
  route: '/tools/image-watermark',
  keywords: [
    'watermark',
    'text',
    'overlay',
    'logo',
    'copyright',
    'credit',
    'signature',
    'brand',
    'stamp',
    'photo',
  ],
  heavy: false,
  component: lazy(() => import('./index')),
}
