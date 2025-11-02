import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/country-clash/',   // el nombre exacto del repo
  plugins: [react()],
})
