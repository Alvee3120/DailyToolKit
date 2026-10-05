import { formatBytes } from '@/lib/format'

interface ImagePreviewCardProps {
  url: string | null
  title: string
  width: number
  height: number
  bytes: number
  alt?: string
}

/** A framed image preview with a caption showing pixel size and file size. */
export function ImagePreviewCard({
  url,
  title,
  width,
  height,
  bytes,
  alt = '',
}: ImagePreviewCardProps) {
  return (
    <figure className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-44 items-center justify-center bg-slate-100 p-2 dark:bg-slate-950">
        {url ? (
          <img
            src={url}
            alt={alt}
            className="max-h-40 w-auto max-w-full object-contain"
          />
        ) : null}
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5 border-t border-slate-200 px-3 py-2 text-xs dark:border-slate-800">
        <span className="font-medium text-slate-700 dark:text-slate-200">
          {title}
        </span>
        <span className="text-slate-500 dark:text-slate-400">
          {width} × {height} px · {formatBytes(bytes)}
        </span>
      </figcaption>
    </figure>
  )
}
