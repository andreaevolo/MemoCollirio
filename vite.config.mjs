import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        app: resolve(process.cwd(), 'index.html'),
        landing: resolve(process.cwd(), 'landing.html'),
      },
    },
  },
});
