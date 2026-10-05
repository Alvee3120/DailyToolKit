import { Wrench } from 'lucide-react'
import { lazy } from 'react'

import type { Tool } from '@/registry'

export const demoMeta: Tool = {
  id: 'demo',
  name: 'Demo tool',
  description:
    'A temporary demo of the shared UI pieces — drop a few images to try it.',
  category: 'Utilities',
  icon: Wrench,
  route: '/tools/demo',
  keywords: ['demo', 'example', 'sample', 'playground', 'test'],
  heavy: false,
  component: lazy(() => import('./index')),
}
