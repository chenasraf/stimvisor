import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ui': path.resolve(__dirname, './src/components/ui'),
      '@icons': path.resolve(__dirname, './src/components/Icons'),
      $app: path.resolve(__dirname, './wailsjs/go/main/App'),
      $main: path.resolve(__dirname, './wailsjs/go/main'),
      $runtime: path.resolve(__dirname, './wailsjs/runtime'),
      $models: path.resolve(__dirname, './wailsjs/go/models'),
    },
  },
  server: {
    hmr: {
      host: 'localhost',
      protocol: 'ws',
    },
  },
})
