import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'hybrid',
  adapter: cloudflare({ mode: 'directory' }),
  image: {
    service: {
      entrypoint: 'astro/assets/services/noop'
    }
  },
  integrations: [react(), tailwind()],
  // Dev only: forward /api calls to the local Worker (npm run worker:dev).
  // Has no effect on the production build.
  vite: {
    server: {
      proxy: { '/api': 'http://localhost:8787' }
    }
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'my', 'th'],
    routing: { prefixDefaultLocale: false }
  }
});
