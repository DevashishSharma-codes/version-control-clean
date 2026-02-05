import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Your existing proxy for Gemini
      '/gemini': {
        target: 'https://generativelanguage.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gemini/, ''),
      },
      // --- ADD THIS NEW PROXY FOR YOUR BACKEND ---
      '/repo': {
        target: 'http://localhost:3000', // Or your backend's port
        changeOrigin: true,
      }
    }
  }
})