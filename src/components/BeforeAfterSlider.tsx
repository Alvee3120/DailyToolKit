import { GripVertical } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useI18n } from '@/i18n'

interface BeforeAfterSliderProps {
  beforeSrc: string
  afterSrc: string
  alt?: string
  beforeLabel?: string
  afterLabel?: string
  className?: string
}

const clamp = (value: number) => Math.min(100, Math.max(0, value))

/**
 * Compare two versions of the same image with a draggable divider.
 * Works with mouse and touch (pointer events) and with the keyboard.
 */
export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  alt = '',
  beforeLabel,
  afterLabel,
  className = '',
}: BeforeAfterSliderProps) {
  const { t } = useI18n()
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(50)
  const [dragging, setDragging] = useState(false)

  const updateFromClientX = useCallback((clientX: number) => {
    const element = containerRef.current
    if (!element) return
    const rect = element.getBoundingClientRect()
    if (rect.width === 0) return
    setPosition(clamp(((clientX - rect.left) / rect.width) * 100))
  }, [])

  useEffect(() => {
    if (!dragging) return

    const onMove = (event: PointerEvent) => updateFromClientX(event.clientX)
    const onUp = () => setDragging(false)

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [dragging, updateFromClientX])

  const labelClass =
    'pointer-events-none absolute top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white'

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 ${className}`}
    >
      <img
        src={afterSrc}
        alt={alt}
        draggable={false}
        className="block w-full"
      />
      <img
        src={beforeSrc}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute inset-0 size-full object-cover"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      />

      {beforeLabel ? (
        <span className={`${labelClass} left-2`}>{beforeLabel}</span>
      ) : null}
      {afterLabel ? (
        <span className={`${labelClass} right-2`}>{afterLabel}</span>
      ) : null}

      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/90 shadow-sm"
        style={{ left: `${position}%` }}
        aria-hidden="true"
      />

      <button
        type="button"
        role="slider"
        aria-label={t('compare.ariaLabel')}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        onPointerDown={(event) => {
          event.preventDefault()
          setDragging(true)
          updateFromClientX(event.clientX)
        }}
        onKeyDown={(event) => {
          const step = event.shiftKey ? 10 : 2
          if (event.key === 'ArrowLeft') {
            setPosition((value) => clamp(value - step))
            event.preventDefault()
          } else if (event.key === 'ArrowRight') {
            setPosition((value) => clamp(value + step))
            event.preventDefault()
          } else if (event.key === 'Home') {
            setPosition(0)
            event.preventDefault()
          } else if (event.key === 'End') {
            setPosition(100)
            event.preventDefault()
          }
        }}
        className="absolute top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 touch-none items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
        style={{ left: `${position}%` }}
      >
        <GripVertical className="size-5" aria-hidden="true" />
      </button>
    </div>
  )
}
