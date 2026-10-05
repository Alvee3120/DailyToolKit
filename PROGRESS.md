# DailyKit — Progress

Status legend: ✅ done · 🚧 in progress · ⬜ not started

| #   | Module                                                | Status | Finished   |
| --- | ----------------------------------------------------- | ------ | ---------- |
| 0   | Project Setup & Deployment Pipeline                   | ✅     | 2026-10-05 |
| 1   | App Shell & Shared Components                         | ✅     | 2026-10-05 |
| 2   | Image Compress, Resize & Convert                      | ✅     | 2026-10-05 |
| 3   | Image Crop, Rotate & Flip                             | ⬜     |            |
| 4   | Watermark & Text Overlay                              | ⬜     |            |
| 5   | Background Removal (AI, in-browser)                   | ⬜     |            |
| 6   | PDF Pages: Images→PDF, Merge, Page Selector, Organize | ⬜     |            |
| 7   | PDF to Images & PDF Compress                          | ⬜     |            |
| 8   | PDF Editor                                            | ⬜     |            |
| 9   | OCR (Image to Text)                                   | ⬜     |            |
| 10  | Everyday Utilities                                    | ⬜     |            |
| 11  | Text Tools & Bangla Tools                             | ⬜     |            |
| 12  | Batch Mode & Productivity                             | ⬜     |            |
| 13  | PWA, Bangla UI, SEO & Final Polish                    | ⬜     |            |

---

## Notes & decisions log

### Module 0 — Project Setup & Deployment Pipeline (2026-10-05)

- Scaffolded with `pnpm create vite` (create-vite 9.2.1), React + TypeScript
  template. Installed with pnpm 12.9.1.
- create-vite 9 ships **oxlint** by default; replaced it with **ESLint 10**
  (flat config) because the project spec asks for ESLint. Added Prettier and
  `eslint-config-prettier` so they don't fight.
- Tailwind CSS **v4** via the `@tailwindcss/vite` plugin (no `tailwind.config.js`
  needed; dark mode follows the system preference by default).
- Added a **`@/*` → `src/*`** path alias in both `vite.config.ts` and
  `tsconfig.app.json` to keep imports readable as the codebase grows.
- Set `packageManager: pnpm@12.9.1` and `engines.node >= 22.12` (Vitest 5 needs
  Node ≥ 22.12).
- `public/_headers` includes security headers **without COOP/COEP** on purpose
  (cross-origin isolation is evaluated in Module 5, per the plan). The CSP is
  deliberately permissive (`connect-src https:`, `'wasm-unsafe-eval'`) so CDN
  models and WASM keep working; it will be tightened in Module 13.
- The template's `tsconfig` did not include `strict`, so `"strict": true` was
  added explicitly.

### Module 1 — App Shell & Shared Components (2026-10-05)

- Added `react-router-dom` 7.18.4 (MIT) and `lucide-react` 1.52.0 (ISC).
- **Registry-driven**: `src/registry.ts` holds every tool (metadata + a lazily
  loaded `component`). `src/app/router.tsx` and the home page both map over
  `tools`, so adding a tool needs no changes to the home page or router. Each
  tool's `meta.ts`, colocated with its UI, is the single registration point.
- **Tool metadata carries the icon component** (a `LucideIcon`) rather than a
  string name, which keeps the registry type-safe and tree-shakeable.
- **i18n layer** (`src/i18n`): a small hand-rolled provider with a flat English
  dictionary and `{placeholder}` interpolation — no extra dependency. The Bangla
  dictionary drops into the same `dictionaries` map in Module 13.
- **Theme system**: preference is `light | dark | system`, stored in
  localStorage. `public/theme-init.js` (a same-origin blocking script) applies
  the theme before first paint so there is no flash — a file rather than an
  inline script, so the CSP needs no `'unsafe-inline'`.
- **Tailwind dark mode** switched to class-based via
  `@custom-variant dark (&:where(.dark, .dark *))`.
- **Home search** uses the URL (`?q=`) as the single source of truth so the
  header search and the home field always agree; `replace: true` keeps every
  keystroke out of browser history.
- Added `public/_redirects` (`/* /index.html 200`) so client-side routes work on
  Cloudflare Pages instead of 404-ing on deep links.
- `react-hooks` v7's new `set-state-in-effect` rule flagged two spots. HomePage
  now derives the query from the URL; `useObjectUrl` keeps the canonical,
  cleanup-safe effect and disables the rule on that one line with a comment.
  `react-refresh/only-export-components` is off for provider/context files
  (`src/i18n`, `ThemeProvider`, `src/lib`) where a component and hooks
  legitimately share a module.
- Shared components added: `DropZone`, `ProgressBar`, `BeforeAfterSlider`,
  `FileSizeCompare`, `DownloadButton`, `ErrorMessage`, `ToolLayout`,
  `PrivacyBadge`, `OptionsPanel`, plus `SearchField` and `ToolCard`.
- Added a temporary **Demo tool** (`/tools/demo`) exercising the shared
  components (DropZone, ProgressBar, OptionsPanel, DownloadButton, persisted
  settings). Placeholder to be removed once real tools exist.
- Verified in a real browser (agent-browser): shell, search (match + no
  results), header-search navigation, all three theme modes without flash, lazy
  tool loading, image-upload flow, friendly wrong-type error, 404 page, and a
  360px viewport with ≥44px tap targets and no horizontal overflow.
- Bundle after Module 1: main chunk 105.65 kB gzipped (budget ~200 kB).

### Module 2 — Image Compress, Resize & Convert (2026-10-05)

- Added `comlink` 4.4.2 (Apache-2.0) for the worker RPC and `heic2any` 0.0.4
  (MIT) for HEIC input.
- **Chose three separate registered tools** (`image-compress`, `image-resize`,
  `image-convert`) over one tabbed page: each surfaces in search on its own
  ("compress", "heic", "full hd"), pages stay small, and it matches the
  one-route-per-tool model. Shared behaviour lives in `src/lib/image/*` and the
  `useImageJob` hook instead of duplicated page code.
- **Shared image pipeline** in `src/lib/image`: `format.ts` (pure helpers),
  `search.ts` (pure binary search), `pipeline.ts` (canvas draw + encode),
  `worker.ts` (Comlink `expose`), `client.ts` (worker client + HEIC + main
  thread fallback). The pipeline code is identical whether it runs in the
  worker (OffscreenCanvas) or the fallback (<canvas>).
- **Off the main thread**: all encode/compress work runs in a Web Worker via
  Comlink. `createImageBitmap` decodes; the worker binary-searches quality, and
  if even the lowest quality is too big it downscales and retries. Verified the
  worker is actually created (`worker.ts?worker_file&type=module` is fetched).
- **HEIC** is converted on the main thread by heic2any first (it needs DOM
  APIs), then handed to the worker. heic2any is dynamically imported, so its
  344 kB gzip chunk only loads when a HEIC file is chosen.
- Compress offers **quality** and **target-size** modes; the target search is a
  binary search with dimension fallback, and a friendly message appears if the
  target cannot be reached.
- Resize offers pixels (with aspect lock) or percentage, plus HD/Full HD/
  Instagram/Facebook/WhatsApp presets. Convert outputs JPG/PNG/WebP with a
  quality slider and a background colour for JPEG transparency.
- The **Demo tool was removed** now that real tools exist.
- Image tools remember their last settings (mode, quality, target size, preset)
  via localStorage.
- Verified in a real browser with a real **5.7 MB / 12 MP** photo: compressed to
  **194 KB** (under the 200 KB target) with a **max main-thread frame gap of
  106 ms** (i.e. no freeze); resize preset produced 1920×1080; JPEG→WebP
  conversion kept dimensions. 360px viewport: no horizontal overflow, all tap
  targets ≥44px. 47 unit tests pass.
- Bundle: main chunk 106 kB gzip; three tool chunks + worker + useImageJob all
  code-split; heic2any 345 kB gzip loaded on demand only.
- Note: the target-size search on a pathological 12 MP _noise_ image took ~13 s
  and downscaled to 3306×2480. Real photos converge much faster; a time
  estimate/cancel button is planned for Module 12.
