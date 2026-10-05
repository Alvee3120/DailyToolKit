import { expose } from 'comlink'

import { compressBitmapToTarget, processBitmap } from './pipeline'
import type { ImageWorkerApi } from './types'

async function decode(blob: Blob): Promise<ImageBitmap> {
  return createImageBitmap(blob, { imageOrientation: 'from-image' })
}

const api: ImageWorkerApi = {
  async process(blob, options) {
    const bitmap = await decode(blob)
    try {
      return await processBitmap(bitmap, options)
    } finally {
      bitmap.close()
    }
  },

  async compressToTarget(blob, options, onProgress) {
    const bitmap = await decode(blob)
    try {
      return await compressBitmapToTarget(bitmap, options, onProgress)
    } finally {
      bitmap.close()
    }
  },
}

expose(api)
