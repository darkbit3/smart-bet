import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: false,
    watch: {
      usePolling: true,
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      clientPort: 3000,
      // If running through container/VM binding, optionally use:
      // host: process.env.HMR_HOST || 'localhost',
      // clientPort: Number(process.env.HMR_CLIENT_PORT || 3000),
    },
  },

  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
  
  // Environment variables configuration
  define: {
    'import.meta.env.DEV': JSON.stringify(process.env.NODE_ENV === 'development'),
  },
})
