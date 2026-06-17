import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// SPA build → dist/ (matches root wrangler.toml `pages_build_output_dir = "dist"`).
// Dev only: forward /api calls to the local API Worker (npm run worker:dev).
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': 'http://localhost:8787'
    }
  }
});
