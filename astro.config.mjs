import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://YY00SI.github.io',
  base: '/subsidy-saas-matcher',
  trailingSlash: 'always',
  output: 'static',
  integrations: [sitemap()],
});
