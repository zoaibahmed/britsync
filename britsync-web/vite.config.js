import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5003',
        changeOrigin: true,
        secure: false,
      },
      '/main': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/news-images': {
        target: 'http://localhost:3000/main',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
