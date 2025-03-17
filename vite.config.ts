import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: [
      'shelter-dog-database.onrender.com',
      '.onrender.com' // This will allow all subdomains on render.com
    ]
  }
})