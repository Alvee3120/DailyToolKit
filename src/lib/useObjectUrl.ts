import { useEffect, useState } from 'react'

/**
 * Create an object URL for a Blob and revoke it automatically when the blob
 * changes or the component unmounts. Prevents the memory leaks that come from
 * forgetting URL.revokeObjectURL.
 */
export function useObjectUrl(blob: Blob | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    const next = blob ? URL.createObjectURL(blob) : null

    // Object URLs are a resource outside React; mirroring the created URL into
    // state is the cleanup-safe pattern recommended for this exact case.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(next)

    if (!next) return
    return () => URL.revokeObjectURL(next)
  }, [blob])

  return url
}
