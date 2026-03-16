import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://www.bethmotleymd.com',
  output: 'static',
  integrations: [
    react(),
    tailwind(),
    sitemap(),
    mdx(),
  ],
  image: {
    domains: ['img.youtube.com'],
  },
});
