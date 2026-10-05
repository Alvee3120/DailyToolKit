/** Shared types for the in-browser image pipeline. */

export type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp'

export interface Dimensions {
  width: number
  height: number
}

/** How a resize request should be interpreted (only one mode is used). */
export interface ResizeRequest {
  width?: number
  height?: number
  maxDimension?: number
  percent?: number
  lockAspect?: boolean
}

export interface ProcessOptions {
  format: ImageFormat
  /** 0–1. Ignored for PNG (lossless). */
  quality: number
  /** Output size; when omitted the source size is kept. */
  target?: Dimensions
  /** Flatten transparency onto this colour (used for JPEG). */
  background?: string
}

export interface TargetSizeOptions {
  format: ImageFormat
  /** Desired maximum output size in bytes. */
  targetBytes: number
  /** Never exceed this longest edge (the search may downscale further). */
  maxDimension?: number
  background?: string
}

export interface ProcessResult {
  blob: Blob
  width: number
  height: number
  format: ImageFormat
}

export interface TargetProgress {
  /** 0–1. */
  fraction: number
  stage: 'quality' | 'scale'
}

/** The API exposed by the image Web Worker (via Comlink). */
export interface ImageWorkerApi {
  process(blob: Blob, options: ProcessOptions): Promise<ProcessResult>
  compressToTarget(
    blob: Blob,
    options: TargetSizeOptions,
    onProgress?: (progress: TargetProgress) => void,
  ): Promise<ProcessResult>
}
