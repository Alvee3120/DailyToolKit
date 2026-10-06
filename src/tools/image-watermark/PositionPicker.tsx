import { useI18n } from '@/i18n'
import type { WatermarkPosition } from '@/lib/image/types'
import { POSITION_LABELS, POSITIONS } from './logic'

interface PositionPickerProps {
  value: WatermarkPosition
  onChange: (value: WatermarkPosition) => void
}

/** A 3×3 grid of radio buttons for choosing the watermark corner. */
export function PositionPicker({ value, onChange }: PositionPickerProps) {
  const { t } = useI18n()

  return (
    <div
      role="radiogroup"
      aria-label={t('wm.position')}
      className="grid w-fit grid-cols-3 gap-1 rounded-lg border border-slate-300 p-1 dark:border-slate-700"
    >
      {POSITIONS.map((position) => {
        const selected = position === value
        return (
          <button
            key={position}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={t(POSITION_LABELS[position])}
            onClick={() => onChange(position)}
            className={`flex size-11 items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 ${
              selected
                ? 'bg-indigo-600'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span
              className={`size-2 rounded-full ${
                selected ? 'bg-white' : 'bg-slate-400 dark:bg-slate-500'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}
