import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <--- C'est ICI que ça change !
import { VitePWA } from 'vite-plugin-pwa'; // <--- Et ICI !

// https://vite.dev/config/
export default defineConfig({
  plugins: [ 
    react(), 
    tailwindcss(), 
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      workbox: {
        maximumFileSizeToCacheInBytes: 500 * 1024,
        globPatterns: ['**/*.{js,css,html,webmanifest,png,svg,webp}'],
      },
      manifest: {
        name: 'Princess Project',
        short_name: 'PrincessApp',
        description: 'Une application spéciale pour ma femme adorée',
        theme_color: '#fdf2f8', // La couleur rose-50 de ton fond
        background_color: '#fdf2f8',
        display: 'standalone', // C'est CA qui enlève la barre d'URL !
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ], 
  server: { 
    host: true,
    port: 1308, 
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'framer-motion': ['framer-motion'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})