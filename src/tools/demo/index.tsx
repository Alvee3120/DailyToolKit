import { useEffect, useRef, useState } from 'react'

import { DownloadButton } from '@/components/DownloadButton'
import { DropZone } from '@/components/DropZone'
import { OptionsPanel } from '@/components/OptionsPanel'
import { ProgressBar } from '@/components/ProgressBar'
import { ToolLayout } from '@/components/ToolLayout'
import { useI18n } from '@/i18n'
import { formatBytes } from '@/lib/format'
import { useObjectUrl } from '@/lib/useObjectUrl'
import { usePersistentState } from '@/lib/usePersistentState'
import { demoMeta } from './meta'

const STEP_MS = 60
const STEP_VALUE = 8

/**
 * Not a real tool — a playground that exercises DropZone, ProgressBar,
 * OptionsPanel, DownloadButton and the persisted-settings helper.
 */
export default function DemoTool() {
  const { t } = useI18n()
  const [files, setFiles] = useState<File[]>([])
  const [progress, setProgress] = useState<number | null>(null)
  const [quality, setQuality] = usePersistentState<number>('demo:quality', 80)
  const timer = useRef<number | null>(null)

  const downloadUrl = useObjectUrl(files[0] ?? null)

  const stopTimer = () => {
    if (timer.current !== null) {
      window.clearInterval(timer.current)
      timer.current = null
    }
  }

  useEffect(() => stopTimer, [])

  const handleFiles = (next: File[]) => {
    setFiles(next)
    setProgress(0)
    stopTimer()
    timer.current = window.setInterval(() => {
      setProgress((value) => {
        if (value === null) return 0
        const following = value + STEP_VALUE
        if (following >= 100) {
          stopTimer()
          return 100
        }
        return following
      })
    }, STEP_MS)
  }

  const reset = () => {
    stopTimer()
    setFiles([])
    setProgress(null)
  }

  const done = progress !== null && progress >= 100

  return (
    <ToolLayout tool={demoMeta}>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {t('demo.intro')}
      </p>

      <div className="mt-4">
        <DropZone accept="image/*" multiple onFiles={handleFiles} />
      </div>

      {files.length > 0 ? (
        <div className="mt-6 space-y-4">
          {done ? (
            <>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                {t('demo.done')}
              </p>

              <div>
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {t('demo.pickedFiles')}
                </h2>
                <ul className="mt-2 divide-y divide-slate-200 dark:divide-slate-800">
                  {files.map((file) => (
                    <li
                      key={`${file.name}-${file.size}`}
                      className="flex items-center justify-between gap-3 py-2 text-sm"
                    >
                      <span className="truncate text-slate-700 dark:text-slate-200">
                        {file.name}
                      </span>
                      <span className="shrink-0 text-slate-500 dark:text-slate-400">
                        {formatBytes(file.size)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {downloadUrl ? (
                <DownloadButton
                  url={downloadUrl}
                  filename={files[0]?.name ?? 'download'}
                >
                  {t('demo.downloadOriginal')}
                </DownloadButton>
              ) : null}

              <div>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {t('demo.reset')}
                </button>
              </div>
            </>
          ) : (
            <ProgressBar value={progress ?? 0} label={t('demo.processing')} />
          )}
        </div>
      ) : null}

      <div className="mt-6">
        <OptionsPanel>
          <label
            htmlFor="demo-quality"
            className="block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            {t('demo.quality')}: {quality}
          </label>
          <input
            id="demo-quality"
            type="range"
            min={1}
            max={100}
            value={quality}
            onChange={(event) => setQuality(Number(event.target.value))}
            className="mt-2 w-full accent-indigo-600"
          />
        </OptionsPanel>
      </div>

      <p className="mt-6 text-xs text-slate-500 dark:text-slate-500">
        {t('demo.note')}
      </p>
    </ToolLayout>
  )
}
