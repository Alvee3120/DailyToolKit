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
    // Cloudflare Pages allows a maximum of 25 MiB per file. Warn if a chunk
    // gets unusually large so we notice before it becomes a hosting problem.
    chunkSizeWarningLimit: 1024,
  },
  test: {
    // Pure-logic tests only for now (converters, text tools). Add jsdom per-tool
    // when a test needs the DOM.
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})
