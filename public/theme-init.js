/*
 * Runs before first paint to apply the saved theme, so users never see a
 * flash of the wrong colours. Kept as a plain same-origin script (not inline)
 * so the Content-Security-Policy does not need 'unsafe-inline'.
 *
 * The storage key and JSON encoding must match src/lib/storage.ts and
 * src/lib/theme.ts.
 */
;(function () {
  try {
    var raw = localStorage.getItem('dailykit:theme')
    var preference = raw ? JSON.parse(raw) : 'system'
    if (preference !== 'light' && preference !== 'dark') {
      preference = 'system'
    }

    var prefersDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    var dark = preference === 'dark' || (preference === 'system' && prefersDark)

    var root = document.documentElement
    root.classList.toggle('dark', dark)
    root.style.colorScheme = dark ? 'dark' : 'light'
  } catch (error) {
    /* Ignore — fall back to the light theme. */
  }
})()
