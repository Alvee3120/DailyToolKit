import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'

import { useI18n, type TranslationKey } from '@/i18n'
import {
  moveCrop,
  resizeCrop,
  type CropHandle,
  type NormalizedRect,
  type ResizeHandle,
} from './logic'

interface CropEditorProps {
  url: string
  /** Normalized (0–1) selection. */
  crop: NormalizedRect
  /** Locked normalized width/height ratio, or null for free resizing. */
  aspect: number | null
  onChange: (crop: NormalizedRect) => void
}

interface DragState {
  handle: CropHandle
  pointerId: number
  startX: number
  startY: number
  rect: NormalizedRect
}

const HANDLES: {
  handle: ResizeHandle
  labelKey: TranslationKey
  position: string
}[] = [
  { handle: 'nw', labelKey: 'crop.handle.nw', position: 'left-0 top-0' },
  { handle: 'ne', labelKey: 'crop.handle.ne', position: 'left-full top-0' },
  { handle: 'sw', labelKey: 'crop.handle.sw', position: 'left-0 top-full' },
  { handle: 'se', labelKey: 'crop.handle.se', position: 'left-full top-full' },
]

const KEY_STEPS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
}

/**
 * An interactive crop selection drawn over the image. Supports dragging the
 * selection and its four corners with mouse, touch or pen, plus arrow-key
 * nudging for keyboard users.
 */
export function CropEditor({ url, crop, aspect, onChange }: CropEditorProps) {
  const { t } = useI18n()
  const boxRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState | null>(null)
  const [dragging, setDragging] = useState<CropHandle | null>(null)

  useEffect(() => {
    if (!dragging) return

    const onMove = (event: globalThis.PointerEvent) => {
      const drag = dragRef.current
      const box = boxRef.current
      if (!drag || !box) return

      const bounds = box.getBoundingClientRect()
      if (bounds.width === 0 || bounds.height === 0) return

      const dx = (event.clientX - drag.startX) / bounds.width
      const dy = (event.clientY - drag.startY) / bounds.height

      onChange(
        drag.handle === 'move'
          ? moveCrop(drag.rect, dx, dy)
          : resizeCrop(drag.rect, drag.handle, dx, dy, aspect),
      )
    }

    const onUp = (event: globalThis.PointerEvent) => {
      if (dragRef.current?.pointerId !== event.pointerId) return
      dragRef.current = null
      setDragging(null)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [dragging, aspect, onChange])

  const startDrag = (handle: CropHandle, event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    event.preventDefault()
    event.stopPropagation()
    dragRef.current = {
      handle,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      rect: crop,
    }
    setDragging(handle)
  }

  const nudge = (
    handle: CropHandle,
    event: KeyboardEvent<HTMLElement>,
  ): void => {
    const step = KEY_STEPS[event.key]
    if (!step) return
    const amount = event.shiftKey ? 0.05 : 0.01
    const dx = step[0] * amount
    const dy = step[1] * amount
    event.preventDefault()
    onChange(
      handle === 'move'
        ? moveCrop(crop, dx, dy)
        : resizeCrop(crop, handle, dx, dy, aspect),
    )
  }

  const percent = (value: number) => `${value * 100}%`

  return (
    <div className="flex justify-center">
      <div
        ref={boxRef}
        className="relative inline-block max-w-full select-none rounded-lg"
      >
        <img
          src={url}
          alt=""
          draggable={false}
          className="block max-h-[60vh] max-w-full rounded-lg"
        />

        {/* Dim everything outside the selection. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 bg-slate-950/55"
          style={{ height: percent(crop.y) }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 bg-slate-950/55"
          style={{ height: percent(1 - crop.y - crop.height) }}
        />
        <div
          className="pointer-events-none absolute left-0 bg-slate-950/55"
          style={{
            top: percent(crop.y),
            height: percent(crop.height),
            width: percent(crop.x),
          }}
        />
        <div
          className="pointer-events-none absolute right-0 bg-slate-950/55"
          style={{
            top: percent(crop.y),
            height: percent(crop.height),
            width: percent(1 - crop.x - crop.width),
          }}
        />

        {/* The selection itself. */}
        <div
          role="group"
          aria-label={t('crop.selection')}
          tabIndex={0}
          onPointerDown={(event) => startDrag('move', event)}
          onKeyDown={(event) => nudge('move', event)}
          className="absolute cursor-move touch-none rounded-sm outline-none ring-1 ring-white/90 focus-visible:ring-2 focus-visible:ring-indigo-400"
          style={{
            left: percent(crop.x),
            top: percent(crop.y),
            width: percent(crop.width),
            height: percent(crop.height),
          }}
        >
          <div className="pointer-events-none absolute inset-y-0 left-1/3 w-px bg-white/40" />
          <div className="pointer-events-none absolute inset-y-0 left-2/3 w-px bg-white/40" />
          <div className="pointer-events-none absolute inset-x-0 top-1/3 h-px bg-white/40" />
          <div className="pointer-events-none absolute inset-x-0 top-2/3 h-px bg-white/40" />

          {HANDLES.map(({ handle, labelKey, position }) => (
            <button
              key={handle}
              type="button"
              aria-label={t(labelKey)}
              onPointerDown={(event) => startDrag(handle, event)}
              onKeyDown={(event) => nudge(handle, event)}
              className={`absolute ${position} flex size-11 -translate-x-1/2 -translate-y-1/2 touch-none items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-indigo-400`}
            >
              <span className="pointer-events-none block size-3.5 rounded-sm border-2 border-white bg-indigo-500 shadow" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
