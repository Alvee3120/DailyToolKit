# DailyKit — Progress

Status legend: ✅ done · 🚧 in progress · ⬜ not started

| #   | Module                                                | Status | Finished   |
| --- | ----------------------------------------------------- | ------ | ---------- |
| 0   | Project Setup & Deployment Pipeline                   | ✅     | 2026-10-05 |
| 1   | App Shell & Shared Components                         | ✅     | 2026-10-05 |
| 2   | Image Compress, Resize & Convert                      | ⬜     |            |
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
