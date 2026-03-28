/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: true,
    fs: {
      allow: ['..']
    },
    proxy: {
      '/api/fred': {
        target: 'https://api.stlouisfed.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fred/, '')
      },
      '/api/cfpb': {
        target: 'https://www.consumerfinance.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cfpb/, '')
      }
    }
  },
  test: {
    globals: true,
    environment: 'node',
  },
})
