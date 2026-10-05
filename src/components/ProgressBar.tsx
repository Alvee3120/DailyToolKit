interface ProgressBarProps {
  /** 0–100. Omit when `indeterminate`. */
  value?: number
  label?: string
  indeterminate?: boolean
}

export function ProgressBar({
  value,
  label,
  indeterminate = false,
}: ProgressBarProps) {
  const clamped =
    typeof value === 'number' ? Math.min(100, Math.max(0, value)) : undefined

  return (
    <div className="w-full">
      {label || clamped !== undefined ? (
        <div className="mb-1 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>{label}</span>
          {clamped !== undefined ? <span>{Math.round(clamped)}%</span> : null}
        </div>
      ) : null}

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : clamped}
        aria-label={label}
        className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
      >
        <div
          className={
            indeterminate
              ? 'h-full w-1/3 animate-pulse rounded-full bg-indigo-600 dark:bg-indigo-500'
              : 'h-full rounded-full bg-indigo-600 transition-[width] duration-200 ease-out dark:bg-indigo-500'
          }
          style={indeterminate ? undefined : { width: `${clamped ?? 0}%` }}
        />
      </div>
    </div>
  )
}
