import { UploadCloud } from 'lucide-react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'

import { useI18n } from '@/i18n'
import { describeAccept, fileMatchesAccept } from '@/lib/file'
import { formatBytes } from '@/lib/format'
import { ErrorMessage } from './ErrorMessage'

interface DropZoneProps {
  onFiles: (files: File[]) => void
  /** Accept string, e.g. "image/*,.pdf". */
  accept?: string
  multiple?: boolean
  maxBytes?: number
  disabled?: boolean
  className?: string
}

/**
 * The shared file input for every tool: drag & drop, click to browse,
 * clipboard paste (Ctrl/⌘+V) and camera capture on mobile. Validates file
 * type and size and shows friendly errors.
 */
export function DropZone({
  onFiles,
  accept,
  multiple = false,
  maxBytes,
  disabled = false,
  className = '',
}: DropZoneProps) {
  const { t } = useI18n()
  const inputRef = useRef<HTMLInputElement>(null)
  const dragCounter = useRef(0)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hintId = useId()

  const handleFiles = useCallback(
    (incoming: FileList | File[]) => {
      const files = Array.from(incoming)
      if (files.length === 0) return

      const accepted: File[] = []
      let nextError: string | null = null

      for (const file of files) {
        if (!fileMatchesAccept(file, accept)) {
          nextError = t('error.unsupportedType', {
            types: describeAccept(accept),
          })
          continue
        }
        if (typeof maxBytes === 'number' && file.size > maxBytes) {
          nextError = t('error.fileTooLarge', {
            name: file.name,
            size: formatBytes(file.size),
            limit: formatBytes(maxBytes),
          })
          continue
        }
        accepted.push(file)
      }

      setError(nextError)
      if (accepted.length > 0) {
        onFiles(multiple ? accepted : accepted.slice(0, 1))
      }
    },
    [accept, maxBytes, multiple, onFiles, t],
  )

  const openPicker = useCallback(() => {
    if (!disabled) inputRef.current?.click()
  }, [disabled])

  // Paste support: files copied to the clipboard land here.
  useEffect(() => {
    if (disabled) return

    const onPaste = (event: ClipboardEvent) => {
      const files = event.clipboardData?.files
      if (files && files.length > 0) {
        event.preventDefault()
        handleFiles(files)
      }
    }

    window.addEventListener('paste', onPaste)
    return () => window.removeEventListener('paste', onPaste)
  }, [disabled, handleFiles])

  return (
    <div className={className}>
      <div
        onDragEnter={(event) => {
          event.preventDefault()
          if (disabled) return
          dragCounter.current += 1
          setIsDragging(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          dragCounter.current -= 1
          if (dragCounter.current <= 0) {
            dragCounter.current = 0
            setIsDragging(false)
          }
        }}
        onDrop={(event) => {
          event.preventDefault()
          dragCounter.current = 0
          setIsDragging(false)
          if (!disabled && event.dataTransfer.files.length > 0) {
            handleFiles(event.dataTransfer.files)
          }
        }}
        className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40'
            : 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900'
        }`}
      >
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled}
          aria-describedby={hintId}
          className="flex flex-col items-center gap-2 rounded-lg px-4 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <UploadCloud
            className="size-8 text-indigo-600 dark:text-indigo-400"
            aria-hidden="true"
          />
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {isDragging ? t('dropzone.dropNow') : t('dropzone.title')}
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {t('dropzone.or')}{' '}
            <span className="font-medium text-indigo-600 underline underline-offset-2 dark:text-indigo-400">
              {t('dropzone.browse')}
            </span>
          </span>
        </button>

        <p id={hintId} className="text-xs text-slate-500 dark:text-slate-500">
          {t('dropzone.pasteHint')}
          {accept ? ` · ${describeAccept(accept)}` : ''}
        </p>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          tabIndex={-1}
          className="sr-only"
          onChange={(event) => {
            if (event.target.files) handleFiles(event.target.files)
            event.target.value = ''
          }}
        />
      </div>

      {error ? (
        <div className="mt-2">
          <ErrorMessage message={error} />
        </div>
      ) : null}
    </div>
  )
}
