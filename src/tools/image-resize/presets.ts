import type { TranslationKey } from '@/i18n'

export interface ResizePreset {
  id: string
  /** i18n key for the human name; the pixel size is appended when shown. */
  labelKey: TranslationKey
  width: number
  height: number
}

export const RESIZE_PRESETS: ResizePreset[] = [
  { id: 'hd', labelKey: 'preset.hd', width: 1280, height: 720 },
  { id: 'full-hd', labelKey: 'preset.fullHd', width: 1920, height: 1080 },
  {
    id: 'instagram-post',
    labelKey: 'preset.instagramPost',
    width: 1080,
    height: 1080,
  },
  {
    id: 'instagram-story',
    labelKey: 'preset.instagramStory',
    width: 1080,
    height: 1920,
  },
  {
    id: 'facebook-cover',
    labelKey: 'preset.facebookCover',
    width: 820,
    height: 312,
  },
  {
    id: 'whatsapp-profile',
    labelKey: 'preset.whatsappProfile',
    width: 500,
    height: 500,
  },
]
