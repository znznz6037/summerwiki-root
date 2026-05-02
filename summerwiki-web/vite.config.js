import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    proxy: {
      // 1. API 요청 프록시
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // 2. OAuth2 인증 요청 프록시
      '/oauth2/authorization': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})