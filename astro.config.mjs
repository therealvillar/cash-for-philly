import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://cashforphilly.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  vite: { build: { assetsInlineLimit: 0 } }
});
