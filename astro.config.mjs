import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: 'https://weekinomarchy.com',
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: {
    resolve: {
      alias: {
        '@layouts': path.join(root, 'src/layouts'),
        '@lib': path.join(root, 'src/lib'),
      },
    },
  },
});
