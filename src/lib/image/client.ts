import { proxy, wrap, type Remote } from 'comlink'

import {
  compressBitmapToTarget,
  processBitmap,
  transformBitmap,
} from './pipeline'
import type {
  Dimensions,
  ImageWorkerApi,
  ProcessOptions,
  ProcessResult,
  TargetProgress,
  TargetSizeOptions,
  TransformOptions,
} from './types'

const HEIC_PATTERN = /\.(heic|heif)$/i

export function isHeic(file: File): boolean {
  const type = file.type.toLowerCase()
  return (
    type === 'image/heic' ||
    type === 'image/heif' ||
    HEIC_PATTERN.test(file.name)
  )
}

/**
 * HEIC/HEIF is not decodable by `createImageBitmap` outside Safari, so convert
 * it to PNG with heic2any first (loaded lazily, only when needed). Runs on the
 * main thread because heic2any needs DOM APIs.
 */
export async function normalizeForCanvas(file: File): Promise<Blob> {
  if (!isHeic(file)) return file

  const { default: heic2any } = await import('heic2any')
  const converted = await heic2any({ blob: file, toType: 'image/png' })
  return Array.isArray(converted) ? converted[0] : converted
}

let worker: Worker | null = null
let remote: Remote<ImageWorkerApi> | null = null

/** Whether the off-main-thread pipeline (Worker + OffscreenCanvas) is usable. */
export function isWorkerPipelineAvailable(): boolean {
  return typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined'
}

function getRemote(): Remote<ImageWorkerApi> | null {
  if (!isWorkerPipelineAvailable()) return null

  if (!remote) {
    worker = new Worker(new URL('./worker.ts', import.meta.url), {
      type: 'module',
    })
    remote = wrap<ImageWorkerApi>(worker)
  }
  return remote
}

function decode(blob: Blob): Promise<ImageBitmap> {
  return createImageBitmap(blob, { imageOrientation: 'from-image' })
}

export async function readImageDimensions(blob: Blob): Promise<Dimensions> {
  const bitmap = await decode(blob)
  try {
    return { width: bitmap.width, height: bitmap.height }
  } finally {
    bitmap.close()
  }
}

export async function processImage(
  blob: Blob,
  options: ProcessOptions,
): Promise<ProcessResult> {
  const api = getRemote()
  if (api) return api.process(blob, options)

  const bitmap = await decode(blob)
  try {
    return await processBitmap(bitmap, options)
  } finally {
    bitmap.close()
  }
}

export async function transformImage(
  blob: Blob,
  transform: TransformOptions,
  options: ProcessOptions,
): Promise<ProcessResult> {
  const api = getRemote()
  if (api) return api.transform(blob, transform, options)

  const bitmap = await decode(blob)
  try {
    return await transformBitmap(bitmap, transform, options)
  } finally {
    bitmap.close()
  }
}

export async function compressImage(
  blob: Blob,
  options: TargetSizeOptions,
  onProgress?: (progress: TargetProgress) => void,
): Promise<ProcessResult> {
  const api = getRemote()
  if (api) {
    return api.compressToTarget(
      blob,
      options,
      onProgress ? proxy(onProgress) : undefined,
    )
  }

  const bitmap = await decode(blob)
  try {
    return await compressBitmapToTarget(bitmap, options, onProgress)
  } finally {
    bitmap.close()
  }
}
