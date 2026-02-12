import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <--- C'est ICI que ça change !

// https://vite.dev/config/
export default defineConfig({
  plugins: [ 
    react(), 
    tailwindcss(), 
  ], 
  server: { 
    port: 1308, 
  } 
})