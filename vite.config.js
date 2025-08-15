import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';  // If using React; adjust if not

export default defineConfig({
  plugins: [react()],  // Add if needed
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});