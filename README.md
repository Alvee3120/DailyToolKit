# DailyKit

Free, privacy-first, all-in-one daily toolkit for images, PDFs and text —
**everything runs in your browser**. Files are processed locally with Canvas,
WebAssembly and Web Workers, so they never get uploaded anywhere.

> 🔒 Your files never leave your device.

Built for everyone, including people on mid-range Android phones and slow
connections. Bangla support (OCR, Bijoy ↔ Unicode, Bangla UI) is on the
roadmap.

## Tech stack

| Area            | Choice                                        |
| --------------- | --------------------------------------------- |
| Package manager | pnpm (never npm or yarn)                      |
| Build tool      | Vite                                          |
| Framework       | React + TypeScript                            |
| Styling         | Tailwind CSS v4                               |
| Routing         | React Router (one route per tool)             |
| State           | React state (Zustand only if it gets complex) |
| Heavy work      | Web Workers (Comlink)                         |
| Testing         | Vitest (pure logic)                           |
| Hosting         | Cloudflare Pages (static, free tier)          |

## Requirements

- Node.js **>= 22.12** (see `engines` in `package.json`)
- pnpm **>= 9** — enable with `corepack enable` if needed

## Local development

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

### Scripts

| Script           | What it does                         |
| ---------------- | ------------------------------------ |
| `pnpm dev`       | Start the dev server                 |
| `pnpm build`     | Type-check and build to `dist/`      |
| `pnpm preview`   | Preview the production build locally |
| `pnpm lint`      | Run ESLint                           |
| `pnpm format`    | Format with Prettier                 |
| `pnpm test`      | Run Vitest once                      |
| `pnpm typecheck` | Type-check without emitting          |

## Project structure

```
src/
  app/          # App shell, router, layout, theme
  components/   # Shared UI (DropZone, ProgressBar, ...)
  tools/
    <name>/
      index.tsx # Tool page UI
      worker.ts # Heavy processing (optional)
      logic.ts  # Pure, testable functions
      meta.ts   # Tool metadata for the registry
  lib/          # Shared helpers (file utils, canvas, model loader, ...)
  registry.ts   # The list of all tools (drives home page, search, nav)
  i18n/         # UI strings (English now, Bangla-ready)
public/
  _headers      # Cloudflare Pages headers
```

## Deploying to Cloudflare Pages

The build output is a static site in `dist/` — no server needed.

### Option A — Git integration (recommended)

1. Push this repository to GitHub/GitLab.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages →
   Connect to Git**, and pick the repo.
3. Build settings:
   - **Framework preset:** None (or Vite)
   - **Build command:** `pnpm build`
   - **Build output directory:** `dist`
4. Cloudflare detects pnpm automatically from `pnpm-lock.yaml`. If the build
   complains about Node, add an environment variable **`NODE_VERSION = 22`**
   (Pages → Settings → Environment variables).
5. Save and deploy. Every push to the default branch redeploys.

### Option B — Direct upload with Wrangler

```bash
pnpm build
pnpm dlx wrangler pages deploy dist --project-name dailykit
```

### Hosting constraints we design around

Cloudflare Pages free tier: static files only, **max 25 MiB per file**, max
20,000 files. Any AI model larger than 25 MiB is therefore loaded from a public
CDN (Hugging Face / jsDelivr) or Cloudflare R2 — never committed to the repo.

## Roadmap

Built module by module (see `PROGRESS.md`): app shell → image
compress/resize/convert → crop → watermark → background removal → PDF
page tools → PDF ↔ images → PDF editor → OCR → everyday utilities → text &
Bangla tools → batch mode → PWA, Bangla UI & polish.

## License

The DailyKit source is provided as-is. Third-party dependency licenses are
listed in [`LICENSES.md`](./LICENSES.md).
