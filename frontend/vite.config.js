import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/auth': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      '/settings': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      '/categories': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      '/inventory': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      '/roles': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      '/sales': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      '/sales-report': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
    },
  },
});
