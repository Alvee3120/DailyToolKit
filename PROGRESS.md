# DailyKit — Progress

Status legend: ✅ done · 🚧 in progress · ⬜ not started

| #   | Module                                                | Status | Finished   |
| --- | ----------------------------------------------------- | ------ | ---------- |
| 0   | Project Setup & Deployment Pipeline                   | ✅     | 2026-10-05 |
| 1   | App Shell & Shared Components                         | ⬜     |            |
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
