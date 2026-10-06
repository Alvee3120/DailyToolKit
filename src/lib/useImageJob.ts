import { useCallback, useRef, useState } from 'react'

import { useI18n } from '@/i18n'
import {
  compressImage,
  normalizeForCanvas,
  processImage,
  readImageDimensions,
  transformImage,
  watermarkImage,
} from '@/lib/image/client'
import { detectImageFormat } from '@/lib/image/format'
import type {
  ImageFormat,
  ProcessOptions,
  TargetSizeOptions,
  TransformOptions,
  Watermark,
} from '@/lib/image/types'
import { useObjectUrl } from '@/lib/useObjectUrl'

export interface ImageJobSource {
  file: File
  /** Decoded-ready source (HEIC already converted to PNG when needed). */
  blob: Blob
  width: number
  height: number
  bytes: number
  format: ImageFormat | null
}

export interface ImageJobResult {
  blob: Blob
  width: number
  height: number
  format: ImageFormat
}

export type ImageJobStatus =
  'idle' | 'loading' | 'processing' | 'ready' | 'error'

export type ImageJobStage = 'quality' | 'scale' | null

/**
 * Shared state machine for the image tools: pick a file → decode → run a
 * pipeline job → show the result. All heavy work happens in the worker.
 */
export function useImageJob() {
  const { t } = useI18n()
  const [source, setSource] = useState<ImageJobSource | null>(null)
  const [result, setResult] = useState<ImageJobResult | null>(null)
  const [status, setStatus] = useState<ImageJobStatus>('idle')
  const [progress, setProgress] = useState<number | null>(null)
  const [stage, setStage] = useState<ImageJobStage>(null)
  const [error, setError] = useState<string | null>(null)
  const runId = useRef(0)

  const sourceUrl = useObjectUrl(source?.blob ?? null)
  const resultUrl = useObjectUrl(result?.blob ?? null)

  const beginRun = useCallback(() => {
    runId.current += 1
    setError(null)
    setResult(null)
    return runId.current
  }, [])

  const select = useCallback(
    async (file: File) => {
      const id = beginRun()
      setStatus('loading')
      setProgress(null)
      setStage(null)

      try {
        const blob = await normalizeForCanvas(file)
        const dimensions = await readImageDimensions(blob)
        if (runId.current !== id) return

        setSource({
          file,
          blob,
          width: dimensions.width,
          height: dimensions.height,
          bytes: file.size,
          format: detectImageFormat(file),
        })
        setStatus('idle')
      } catch {
        if (runId.current !== id) return
        setSource(null)
        setStatus('error')
        setError(t('img.error.decode'))
      }
    },
    [beginRun, t],
  )

  const runProcess = useCallback(
    async (options: ProcessOptions) => {
      if (!source) return
      const id = beginRun()
      setStatus('processing')
      setProgress(null)
      setStage(null)

      try {
        const output = await processImage(source.blob, options)
        if (runId.current !== id) return
        setResult(output)
        setStatus('ready')
      } catch {
        if (runId.current !== id) return
        setStatus('error')
        setError(t('img.error.process'))
      }
    },
    [beginRun, source, t],
  )

  const runTransform = useCallback(
    async (transform: TransformOptions, options?: Partial<ProcessOptions>) => {
      if (!source) return
      const id = beginRun()
      setStatus('processing')
      setProgress(null)
      setStage(null)

      try {
        const output = await transformImage(source.blob, transform, {
          format: options?.format ?? source.format ?? 'image/jpeg',
          quality: options?.quality ?? 0.92,
          background: options?.background,
        })
        if (runId.current !== id) return
        setResult(output)
        setStatus('ready')
      } catch {
        if (runId.current !== id) return
        setStatus('error')
        setError(t('img.error.process'))
      }
    },
    [beginRun, source, t],
  )

  const runWatermark = useCallback(
    async (watermark: Watermark, options?: Partial<ProcessOptions>) => {
      if (!source) return
      const id = beginRun()
      setStatus('processing')
      setProgress(null)
      setStage(null)

      try {
        const output = await watermarkImage(source.blob, watermark, {
          format: options?.format ?? source.format ?? 'image/jpeg',
          quality: options?.quality ?? 0.92,
          background: options?.background,
        })
        if (runId.current !== id) return
        setResult(output)
        setStatus('ready')
      } catch {
        if (runId.current !== id) return
        setStatus('error')
        setError(t('img.error.process'))
      }
    },
    [beginRun, source, t],
  )

  const runCompress = useCallback(
    async (options: TargetSizeOptions) => {
      if (!source) return
      const id = beginRun()
      setStatus('processing')
      setProgress(0)
      setStage('quality')

      try {
        const output = await compressImage(source.blob, options, (event) => {
          if (runId.current !== id) return
          setProgress(event.fraction)
          setStage(event.stage)
        })
        if (runId.current !== id) return
        setResult(output)
        setProgress(1)
        setStage(null)
        setStatus('ready')
      } catch {
        if (runId.current !== id) return
        setStatus('error')
        setError(t('img.error.process'))
      }
    },
    [beginRun, source, t],
  )

  const reset = useCallback(() => {
    runId.current += 1
    setSource(null)
    setResult(null)
    setStatus('idle')
    setProgress(null)
    setStage(null)
    setError(null)
  }, [])

  return {
    source,
    result,
    status,
    progress,
    stage,
    error,
    sourceUrl,
    resultUrl,
    select,
    runProcess,
    runTransform,
    runWatermark,
    runCompress,
    reset,
  }
}
