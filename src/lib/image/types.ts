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

/** Quarter-turn rotations, in degrees clockwise. */
export type Rotation = 0 | 90 | 180 | 270

/** A crop rectangle in source-image pixels. */
export interface CropRect {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Crop, rotate and flip applied together. The crop is taken from the source
 * first, then the result is rotated and flipped (so a flip mirrors what you
 * see in the preview).
 */
export interface TransformOptions {
  rotate?: Rotation
  flipHorizontal?: boolean
  flipVertical?: boolean
  /** Region of the source to keep; defaults to the whole image. */
  crop?: CropRect
}

/** Where a watermark sits on the image. */
export type WatermarkPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'center'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

interface WatermarkBase {
  /** Opacity, 0–1. */
  opacity: number
  /** Clockwise rotation in degrees. */
  rotation: number
  position: WatermarkPosition
  /** Gap from the edge, as a fraction of the longest side. */
  margin: number
}

export interface TextWatermark extends WatermarkBase {
  kind: 'text'
  text: string
  /** A CSS generic family so it renders the same in the worker. */
  fontFamily: string
  bold: boolean
  italic: boolean
  /** Font size as a fraction of the longest side. */
  size: number
  color: string
}

export interface ImageWatermark extends WatermarkBase {
  kind: 'image'
  /** The logo, decoded inside the worker. */
  logo: Blob
  /** Logo width as a fraction of the base image width. */
  scale: number
}

export type Watermark = TextWatermark | ImageWatermark

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
  transform(
    blob: Blob,
    transform: TransformOptions,
    options: ProcessOptions,
  ): Promise<ProcessResult>
  watermark(
    blob: Blob,
    watermark: Watermark,
    options: ProcessOptions,
  ): Promise<ProcessResult>
}
