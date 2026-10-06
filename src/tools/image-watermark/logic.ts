import type { TranslationKey } from '@/i18n'
import type { WatermarkPosition } from '@/lib/image/types'

/** Settings shared by the text and logo watermarks. */
export interface Placement {
  opacity: number
  rotation: number
  margin: number
  position: WatermarkPosition
}

export interface TextSettings extends Placement {
  text: string
  fontFamily: string
  bold: boolean
  italic: boolean
  size: number
  color: string
}

export interface ImageSettings extends Placement {
  scale: number
}

export const DEFAULT_TEXT: TextSettings = {
  text: '© Your name',
  fontFamily: 'sans-serif',
  bold: true,
  italic: false,
  size: 0.06,
  color: '#ffffff',
  opacity: 0.75,
  rotation: 0,
  margin: 0.04,
  position: 'bottom-right',
}

export const DEFAULT_IMAGE: ImageSettings = {
  scale: 0.25,
  opacity: 0.75,
  rotation: 0,
  margin: 0.04,
  position: 'bottom-right',
}

export const TEXT_FONTS: { value: string; labelKey: TranslationKey }[] = [
  { value: 'sans-serif', labelKey: 'wm.font.sans' },
  { value: 'serif', labelKey: 'wm.font.serif' },
  { value: 'monospace', labelKey: 'wm.font.mono' },
]

/** Reading order for the 3×3 position grid. */
export const POSITIONS: WatermarkPosition[] = [
  'top-left',
  'top-center',
  'top-right',
  'middle-left',
  'center',
  'middle-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
]

export const POSITION_LABELS: Record<WatermarkPosition, TranslationKey> = {
  'top-left': 'wm.position.topLeft',
  'top-center': 'wm.position.topCenter',
  'top-right': 'wm.position.topRight',
  'middle-left': 'wm.position.middleLeft',
  center: 'wm.position.center',
  'middle-right': 'wm.position.middleRight',
  'bottom-left': 'wm.position.bottomLeft',
  'bottom-center': 'wm.position.bottomCenter',
  'bottom-right': 'wm.position.bottomRight',
}
