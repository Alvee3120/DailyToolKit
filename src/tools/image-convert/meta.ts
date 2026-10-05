import { Repeat } from 'lucide-react'
import { lazy } from 'react'

import type { Tool } from '@/registry'

export const imageConvertMeta: Tool = {
  id: 'image-convert',
  name: 'Convert image',
  description: 'Change an image to JPG, PNG or WebP — HEIC from iPhones too.',
  category: 'Image',
  icon: Repeat,
  route: '/tools/image-convert',
  keywords: [
    'convert',
    'format',
    'jpeg',
    'jpg',
    'png',
    'webp',
    'heic',
    'heif',
    'change format',
    'iphone',
  ],
  heavy: false,
  component: lazy(() => import('./index')),
}
