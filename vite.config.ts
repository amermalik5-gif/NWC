import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const port = parseInt(process.env.PORT || '3000', 10)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port,
    strictPort: false,
  },
  preview: {
    port,
    strictPort: false,
  },
})
