import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Cloudflare Pages allows a maximum of 25 MiB per file. This limit still
    // catches anything approaching that; it is above the lazily-loaded
    // heic2any chunk (loaded only when a HEIC file is chosen).
    chunkSizeWarningLimit: 2048,
  },
  test: {
    // Pure-logic tests only for now (converters, text tools). Add jsdom per-tool
    // when a test needs the DOM.
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})
